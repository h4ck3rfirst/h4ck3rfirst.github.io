---
title:  "[OverTheWire] Bandit – Level 0 → 33 Full Walkthrough"
date:   2025-11-22
categories: overthewire writeup linux
tags: wargame ssh enumeration privilege-escalation forensics stego
img: https://miro.medium.com/v2/resize:fit:640/format:webp/1*qO7TM0hqCq9UjfHghAxyiA.jpeg
---
![Bandit Banner](https://miro.medium.com/v2/resize:fit:640/format:webp/1*qO7TM0hqCq9UjfHghAxyiA.jpeg)

**Game**: OverTheWire – Bandit  
**Difficulty**: Beginner → Intermediate  
**Levels**: 0 → 33 (34 total)  
**Goal**: Learn Linux commands, privilege escalation, basic forensics & stego

I completed the entire Bandit wargame.

Here is the **complete step-by-step walkthrough** with every command.

# bandit  https://overthewire.org/wargames/bandit

**learn and practice the linux commands in game mode**

---


```zsh
ssh bandit0@bandit.labs.overthewire.org -p 2220
  
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames
backend: 
bandit0@bandit.labs.overthewire.org's password: bandit0
```

# password search of bandit2
### ls --list  , cat --read the contant of file without gui 

 ```zsh
 bandit0@bandit:~$ ls && cat  readme
 password : ZjLjTmM6FvvyRnrb2rfNWOZOTa6ip5If
 ```

# password search of  bandit2 
### ./ --refers to the current directory

 ```zsh
bandit1@bandit:~$ cat  ./-
 password:263JGJPfgU6LtdEvgfWU1XP5yac29mFx
```
---

#  password search of bandit3

###  Escaping Spaces: Using backslashes ( \ ) or quotes (' or ")  or fowardslashes ( / ) ensures the shell treats the file name as a single argument, avoiding errors due to spaces.

```zsh
bandit2@bandit:~$ cat ./--spaces\ in\ this\ filename--
MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx
bandit2@bandit:~$ cat './--spaces in this filename--'
MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx
bandit2@bandit:~$cat ./--spaces/ in/ this/ filename--
MNk8KNH3Usiio41PRUEoDFPqfxLPlSmx

#other mehods to read the same file
 
 less './--spaces in this filename--'

 more './--spaces in this filename--'

 head './--spaces in this filename--'

 tail './--spaces in this filename--'
    
 nano './--spaces in this filename--'
```
---

# password search of bandit4
### ls -lahs  (-l ) list , (-a) all hidden or not hidden , ( -h ) human readable form,   

```zsh
bandit3@bandit:~$ ls
inhere
bandit3@bandit:~$ cd inhere/
bandit3@bandit:~/inhere$ ls
bandit3@bandit:~/inhere$ ls -lhas
4.0K drwxr-xr-x 2 root    root    4.0K Aug 15 13:16 .
4.0K drwxr-xr-x 3 root    root    4.0K Aug 15 13:16 ..
4.0K -rw-r----- 1 bandit4 bandit3   33 Aug 15 13:16 ...Hiding-From-You
bandit3@bandit:~/inhere$ cat ...Hiding-From-You 
2WmrDFRmJIq3IPxneAaMGhap0pFhF3NJ
```
---

# password search of bandit5

```file``` command examines the contents of a file to determine its type (text, binary data, etc.).
``` * ``` this meaning in linux all , it is one of regular expression 
```zsh
bandit4@bandit:~/inhere$ file  ./-file0*
./-file00: Non-ISO extended-ASCII text, with no line terminators, with overstriking
./-file01: data
./-file02: data
./-file03: data
./-file04: data
./-file05: data
./-file06: data
./-file07: ASCII text
./-file08: data
./-file09: data
bandit4@bandit:~/inhere$ cat ./-file07
4oQYVPkxZOOEOO5pTW81FB8j8lxXGUQw
```
---

# password search of bandit6 

```find inhere/``` — search recursively inside inhere

```-type f ```— only look for files

```-size 1033c ```— files that are exactly 1033 bytes (c = bytes)

```! -executable```— file is not executable

```-exec file {} \; ```— run the file command on each match to check its type

```grep "ASCII"``` — filters to show only human-readable text file

```zsh
bandit5@bandit:~$ ls
inhere
bandit5@bandit:~$ cd inhere/
bandit5@bandit:~/inhere$ ls
maybehere00  maybehere02  maybehere04  maybehere06  maybehere08  maybehere10  maybehere12  maybehere14  maybehere16  maybehere18
maybehere01  maybehere03  maybehere05  maybehere07  maybehere09  maybehere11  maybehere13  maybehere15  maybehere17  maybehere19
bandit5@bandit:~/inhere$ find . -type f -size 1033c ! -exec
-exec        -execdir     -executable   
bandit5@bandit:~/inhere$ find . -type f -size 1033c ! -executable -exec {} \; | grep "ASCII text"
find: ‘./maybehere07/.file2’: Permission denied
bandit5@bandit:~/inhere$ cat ./maybehere07/.file2 
HWasnPhtq9AVKe0dmk45nxy20cvUa6EG
```
---

# password search of bandit7

```
zsh bandit6@bandit:~$ find / -user bandit7 -group bandit6  -size 33c   
find: ‘/sys/kernel/tracing/osnoise’: Permission denied
find: ‘/sys/kernel/tracing/hwlat_detector’: Permission denied
find: ‘/sys/kernel/tracing/instances’: Permission denied
find: ‘/sys/kernel/tracing/trace_stat’: Permission denied
find: ‘/sys/kernel/tracing/per_cpu’: Permission denied
find: ‘/sys/kernel/tracing/options’: Permission denied
find: ‘/sys/kernel/tracing/rv’: Permission denied
find: ‘/sys/kernel/debug’: Permission denied
find: ‘/sys/fs/pstore’: Permission denied
find: ‘/sys/fs/bpf’: Permission denied
find: ‘/root’: Permission denied
find: ‘/boot/lost+found’: Permission denied
find: ‘/boot/efi’: Permission denied
find: ‘/run/user/13003’: Permission denied
find: ‘/run/user/11028’: Permission denied
find: ‘/run/user/11020’: Permission denied
find: ‘/run/user/12002’: Permission denied
find: ‘/run/user/11012’: Permission denied
find: ‘/run/sudo’: Permission denied
find: ‘/run/lock/lvm’: Permission denied
find: ‘/dev/mqueue’: Permission denied
find: ‘/dev/shm’: Permission denied
find: ‘/lost+found’: Permission denied
find: ‘/drifter/drifter14_src/axTLS’: Permission denied
find: ‘/manpage/manpage3-pw’: Permission denied
/var/lib/dpkg/info/bandit7.password
find: ‘/var/spool/bandit24’: Permission denied
find: ‘/var/spool/rsyslog’: Permission denied
find: ‘/var/spool/cron/crontabs’: Permission denied
such file or directory
find: ‘/proc/2487160/task/2487160/fdinfo/6’: No such file or directory
find: ‘/proc/2487160/fd/5’: No such file or directory
find: ‘/proc/2487160/fdinfo/5’: No such file or directory
find: ‘/home/bandit27-git’: Permission denied
find: ‘/home/leviathan0/.backup’: Permission denied
find: ‘/home/drifter6/data’: Permission denied
find: ‘/home/ubuntu’: Permission denied
find: ‘/home/bandit28-git’: Permission denied
find: ‘/home/bandit29-git’: Permission denied
find: ‘/home/drifter8/chroot’: Permission denied
```

```/```	Start searching from the root directory (search entire system)

```-user bandit7	```Only files owned by user bandit7

```-group bandit6```	Only files in group bandit6

``` 2>/dev/null ``` 2	Refers to stderr (error output)  ```>	```Means redirect ```/dev/null```	Special file that discards output

```zsh
bandit6@bandit:/home$ find / -user bandit7 -group bandit6 -size 33c 2>/dev/null
/var/lib/dpkg/info/bandit7.password
bandit6@bandit:/home$ cat /var/lib/dpkg/info/bandit7.password 
morbNTDkSW6jIlUc0ymOdMaLnOlFVAaj
bandit6@bandit:/home$
```
---

# password search of bandit8

```|``` -piping  or output of one commands  input to other commands

```Read the instruction carefully```

```zsh
bandit7@bandit:~$ ls
data.txt
bandit7@bandit:~$ file data.txt
data.txt: ASCII text
bandit7@bandit:~$ cat data.txt  | find millionth
find: ‘millionth’: No such file or directory
bandit7@bandit:~$ cat data.txt  | grep  millionth
millionth	dfwvzFQi4mU0wfNbFOe9RoWskMLg7eEc
bandit7@bandit:~$
```
--- 
# Bandit Level 8 → Level 9
#### Level Goal

The password for the next level is stored in the file data.txt and is the only line of text that occurs only once



```uniq ```by default removes consecutive duplicate lines, so sorting ensures duplicates are consecutive.

```uniq -u``` filters to only lines appearing once.

```zsh
bandit8@bandit:~$ ls
data.txt
bandit8@bandit:~$ wc  data.txt 
 1001  1001 33033 data.txt
bandit8@bandit:~$ wc -l data.txt 
1001 data.txt
```


```sort ```organizes the lines alphabetically or numerically.



```
bandit8@bandit:~$ cat data.txt | sort | uniq
08DeKfqaKdvvCatYWrGgkKe8pPDKmUDx
0t47YbXIURx5KxO0pxjDlKLhWilUrIam
0Wv56NnQBakSbhB3saOWpQAHQgFt4BW3
19h1swIAlLcBUL3FpWHXTExZKr9Enoql
2luIGt2bviwkSr1YzjFwakfcE2npoDuE
2qgkBfULgqOEG3FSysquO8APRIwOtqVo
3PhmgEv7YEbzIl0pjAZ6ik3atmygedX1
3PRLMUKYoKCLPW9mJBO6lwJ8YphI6uQV
....
....
....
ZzQDv5Imr9y5XSYGD3r61uP1fjXAhuod
```


```uniq ```by default removes consecutive duplicate lines, so sorting ensures duplicates are consecutive.

```uniq -u``` filters to only lines appearing once.


```
bandit8@bandit:~$ cat data.txt | sort | uniq -u
4CKMh1JI91bUIZZPXDqGanal4xvAg0JM
bandit8@bandit:~$
```
---

# Bandit Level 9 → Level 10
#### Level Goal

The password for the next level is stored in the file data.txt in one of the few human-readable strings, preceded by several ‘=’ characters.
```zsh
bandit9@bandit:~$ file data.txt 
data.txt: data
bandit9@bandit:~$ head -n 4 data.txt 
�s�z���tvFJg����9
��H������r�      �Bz������7��.ؓs�Z�@���E���p\�J���
           G5*M'Jg��[�JuA���V��0��B��H��G��KY��
                                               �e��c���sE>Id#{��#��0)�g�b��%�<��
                                      ��'EB�� >-��RpV�RhG�Y6�׿ʝ�4bo`K��݊��~����O"��f��zg��%���0�����a������^�����dԂS�}��GT��׺K]�&��B�Yk�Q���VN5ZTH��R�e�c���ԌG�+�~������
```

```strings``` command extracts human-readable, printable strings from binary or data files, making it easier to find embedded text

```
bandit9@bandit:~$ strings data.txt  | grep =
========== theg
VQ=97
[m=K1x
/i8D2[U?=
========== password
LU=W
========== is
=v$,
h{=,rw_c
=}%q
=D!7
YU=<
5=fq
vJ=ho
========== FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey
=AdD
```
---

# Bandit Level 10 → Level 11
### Level Goal

The password for the next level is stored in the file data.txt, which contains base64 encoded data
```base64 -d``` to decode the 

```zsh
bandit10@bandit:~$ ls
data.txt
bandit10@bandit:~$ cat data.txt 
VGhlIHBhc3N3b3JkIGlzIGR0UjE3M2ZaS2IwUlJzREZTR3NnMlJXbnBOVmozcVJyCg==
bandit10@bandit:~$ cat data.txt | base64 -d
The password is dtR173fZKb0RRsDFSGsg2RWnpNVj3qRr
bandit10@bandit:~$
```
# Bandit Level 11 → Level 12
### Level Goal

The password for the next level is stored in the file data.txt, where all lowercase (a-z) and uppercase (A-Z) letters have been rotated by 13 positions
```the gpt is help me to solve this and also their is a hint of instruction page```
```tr ``` translate 
```zsh
bandit11@bandit:~$ ls
data.txt
bandit11@bandit:~$ cat data.txt 
Gur cnffjbeq vf 7k16JArUVv5LxVuJfsSVdbbtaHGlw9D4
bandit11@bandit:~$ echo "Gur cnffjbeq vf 7k16JArUVv5LxVuJfsSVdbbtaHGlw9D4" | tr 'A-Za-z' 'N-ZA-Mn-za-m'
The password is 7x16WNeHIi5YkIhWsfFIqoognUTyj9Q4
bandit11@bandit:~$
```
---
# Bandit Level 12 → Level 13
### Level Goal

The password for the next level is stored in the file data.txt, which is a hexdump of a file that has been repeatedly compressed. For this level it may be useful to create a directory under /tmp in which you can work. Use mkdir with a hard to guess directory name. Or better, use the command “mktemp -d”. Then copy the datafile using cp, and rename it using mv (read the manpages!)

```zsh
bandit12@bandit:~$ ls
data.txt
bandit12@bandit:~$ ls -lhas
total 24K
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:15 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -rw-r-----   1 bandit13 bandit12 2.6K Aug 15 13:15 data.txt
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
bandit12@bandit:~$ file data.txt 
data.txt: ASCII text
bandit12@bandit:~$ wc -l data.txt 
39 data.txt
bandit12@bandit:~$ cat data.txt 
00000000: 1f8b 0808 0933 9f68 0203 6461 7461 322e  .....3.h..data2.
00000010: 6269 6e00 0148 02b7 fd42 5a68 3931 4159  bin..H...BZh91AY
00000020: 2653 59be 9d9d 9600 001f ffff fe7f fbcf  &SY.............
00000030: af7f 9eff f7ee ffdf bff7 fef7 ddbe 9db7  ................
00000040: bf9f 9f5f ca6f fffe d6fb feff b001 3ab3  ..._.o........:.
00000050: 0403 40d0 0000 00d0 01a0 03d4 0000 0346  ..@............F
00000060: 41a1 9000 0000 1900 0190 0686 8191 a326  A..............&
00000070: 1340 0c8c 4d0f 4d4c 4403 468d 0d1a 0001  .@..M.MLD.F.....
00000080: a686 8000 01a0 6462 6868 6800 0006 8f50  ......dbhhh....P
00000090: 00d0 1a06 9a0c d406 8c80 189a 6834 64d0  ............h4d.
000000a0: 064d 0000 3a68 1a34 d00d 0001 a1a1 91a0  .M..:h.4........
000000b0: 0000 0323 4d03 2341 9034 1a00 00c8 320d  ...#M.#A.4....2.
000000c0: 001a 1880 3401 8406 9a68 00d1 a34d 34d1  ....4....h...M4.
000000d0: 7808 0920 2027 a994 91db 6412 de13 8af2  x..  '....d.....
000000e0: 7f2a f82d c875 b4c2 6723 afc6 8b7c 62ad  .*.-.u..g#...|b.
000000f0: a375 3887 65c0 1718 5224 81c3 0b33 8e21  .u8.e...R$...3.!
00000100: c736 e901 b187 8c9f 5b3c a81e f09d ec5c  .6......[<.....\
00000110: 41c0 0b74 ca62 56e6 8452 ce37 8889 5ab7  A..t.bV..R.7..Z.
00000120: d5d8 9316 1d26 26e7 b18f e376 b6b9 02ec  .....&&....v....
00000130: 0880 aa07 3c2c fd25 03ba cc87 59fa 5436  ....<,.%....Y.T6
00000140: 4a67 b193 3aec d8a3 6813 92e6 67ce 5118  Jg..:...h...g.Q.
00000150: b22b d1b2 114c 9fb6 3033 d37a 86b2 62c5  .+...L..03.z..b.
00000160: 9fb1 09c3 afcb 76ab ab69 e168 cdb6 6d5e  ......v..i.h..m^
00000170: 3b86 91a9 7a45 0371 70de ca02 4ce5 1de9  ;...zE.qp...L...
00000180: f996 0ae0 2c33 a0ca ceeb 1d0a 02a7 3160  ....,3........1`
00000190: 9746 3cd6 c5c1 433b 991f 9989 5ab3 cbf2  .F<...C;....Z...
000001a0: 0759 072f 8b6f 08af f163 c149 8879 f738  .Y./.o...c.I.y.8
000001b0: 6241 3876 4edf 6038 0b60 277c d2ca 7908  bA8vN.`8.`'|..y.
000001c0: b1f3 a93c 23d0 277b 215c 7498 b2a1 01dd  ...<#.'{!\t.....
000001d0: 563b be47 3fdc a008 0f08 82c7 2044 c8da  V;.G?....... D..
000001e0: a241 c91c c3ee f1a1 9b98 25eb 5212 3fb1  .A........%.R.?.
000001f0: e545 2469 108f 7f01 e7c9 faed cd3e 9f08  .E$i.........>..
00000200: 97bc 1b04 a087 e826 0993 65d3 13b6 5365  .......&..e...Se
00000210: 3c6d 10e5 1d85 66ab 0497 6242 8799 8112  <m....f...bB....
00000220: 61a0 87dc fcfb 9274 774a c918 d5ce 3c0f  a......twJ....<.
00000230: d346 95c8 1e30 42a6 a3b7 a93b 67f3 186c  .F...0B....;g..l
00000240: 904c 842c 30c5 e1b2 b841 05e0 7144 2a60  .L.,0....A..qD*`
00000250: ca14 0a52 f589 fe2e e48a 70a1 217d 3b3b  ...R......p.!};;
00000260: 2c19 d8f7 0e48 0200 00                   ,....H...
bandit12@bandit:~$ mktmp -d 
Command 'mktmp' not found, did you mean:
  command 'mktip' from deb kylin-display-switch (3.0.14-1build1)
  command 'mktemp' from deb coreutils (9.4-2ubuntu2)
Try: apt install <deb name>
bandit12@bandit:~$ mktemp -d 
/tmp/tmp.xcXCcAxkNQ
bandit12@bandit:~$ cd /tmp/tmp.xcXCcAxkNQ
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ cp ~/data.txt .
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
data.txt
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ xxd -r data.txt data.gz
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
data.gz  data.txt
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ gunzip data.gz
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ mv data data2.bz2
bunzip2 data2.bz2
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
data2  data.txt
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data2
data2: gzip compressed data, was "data4.bin", last modified: Fri Aug 15 13:15:53 2025, max compression, from Unix, original size modulo 2^32 20480
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ strings data2 | less
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ hexdump -C data2 | head
00000000  1f 8b 08 08 09 33 9f 68  02 03 64 61 74 61 34 2e  |.....3.h..data4.|
00000010  62 69 6e 00 ed d1 4f 48  93 71 18 c0 f1 9f 38 63  |bin...OH.q....8c|
00000020  97 17 46 48 d8 1c ee a5  a5 c3 02 79 df 77 ef d6  |..FH.......y.w..|
00000030  1f 08 d6 1f 86 84 86 94  18 b3 3c bc 32 a4 15 28  |..........<.2..(|
00000040  ea 1b 68 11 db 3a ac 2e  03 25 a5 78 a1 93 17 0d  |..h..:...%.x....|
00000050  25 09 8a 04 0f 33 e8 ac  d3 82 08 2f 62 4c 0c 86  |%....3...../bL..|
00000060  7a 48 87 a2 b5 3c 16 e4  49 2b f8 7e 2e cf 03 cf  |zH...<..I+.~....|
00000070  73 fb 46 0c d3 f0 d7 b4  46 db c5 fe 51 0a 02 ba  |s.F.....F...Q...|
00000080  be 3b 0b 7e 99 9a fe 73  57 fd 8a 7e 2a e0 53 75  |.;.~...sW..~*.Su|
00000090  55 15 8a aa 6a ba 26 64  45 1c 80 bb dd a6 d1 25  |U...j.&dE......%|
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ gunzip data2
gzip: data2: unknown suffix -- ignored
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data4.bin
data4.bin: cannot open `data4.bin' (No such file or directory)
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ gunzip -c data2 > data4.bin
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data4.bin
data4.bin: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data4.bin
data4.bin: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ tar -xf data4.bin
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ tar -xf data4.bin
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
data2  data4.bin  data5.bin  data.txt
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ fine data4.bin 
Command 'fine' not found, did you mean:
  command 'fiwe' from snap fiwe (latest)
  command 'wine' from deb wine (8.0.1~repack-3ubuntu2)
  command 'xine' from deb xine-ui (0.99.14-1)
  command 'ifne' from deb moreutils (0.67-1)
  command 'file' from deb file (1:5.45-2)
  command 'find' from deb findutils (4.9.0-5)
See 'snap info <snapname>' for additional versions.
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data4.bin 
data4.bin: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data5.bin 
data5.bin: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data2
data2: gzip compressed data, was "data4.bin", last modified: Fri Aug 15 13:15:53 2025, max compression, from Unix, original size modulo 2^32 20480
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ tar -xf data5.bin
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
data2  data4.bin  data5.bin  data6.bin  data.txt
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data6.bin 
data6.bin: bzip2 compressed data, block size = 900k
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ bunzip2 data6.bin
bunzip2: Can't guess original name for data6.bin -- using data6.bin.out
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data6
data6: cannot open `data6' (No such file or directory)
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data6.bin.out 
data6.bin.out: POSIX tar archive (GNU)
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ tar -xf data6.bin.out
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
data2  data4.bin  data5.bin  data6.bin.out  data8.bin  data.txt
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ cat data8.bin 
�       3�hdata9.bin
�.6*K   q)w��>�2A1bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data8.bin
data8.bin: gzip compressed data, was "data9.bin", last modified: Fri Aug 15 13:15:53 2025, max compression, from Unix, original size modulo 2^32 49
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ gunzip data8.bin
gzip: data8.bin: unknown suffix -- ignored
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
data2  data4.bin  data5.bin  data6.bin.out  data8.bin  data.txt
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ gunzip -c data8.bin > data9.bin
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ file data9.bin
data9.bin: ASCII text
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ cat data9.bin 
The password is FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$ ls
data2  data4.bin  data5.bin  data6.bin.out  data8.bin  data9.bin  data.txt
bandit12@bandit:/tmp/tmp.xcXCcAxkNQ$

```
i used Gpt to solve this level 
```zsh
The password is FO5dwFsc0cbaIiH0h8J2eUks2vdTDwAn

#!/bin/bash
WORKDIR=$(mktemp -d)
echo "Working in $WORKDIR"
cd "$WORKDIR" || exit 1
cp ~/data.txt .
xxd -r data.txt data.gz
gunzip -c data.gz > data2.bz2
bunzip2 data2.bz2
gunzip -c data2 > data4.bin
tar -xf data4.bin
tar -xf data5.bin
bunzip2 data6.bin
tar -xf data6.bin.out
gunzip -c data8.bin > data9.bin
echo "Final password:"
cat data9.bin

```
---
# Bandit Level 13 → Level 14
### Level Goal

The password for the next level is stored in /etc/bandit_pass/bandit14 and can only be read by user bandit14. For this level, you don’t get the next password, but you get a private SSH key that can be used to log into the next level. Note: localhost is a hostname that refers to the machine you are working on

[cheatshee of ssh](https://www.stationx.net/ssh-commands-cheat-sheet/)

```zsh 
bandit13@bandit:~$ ssh -i sshkey.private  bandit14@bandit.labs.overthewire.org -p 2220
bandit14@bandit:~$ cat /etc/bandit_pass/bandit14
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS 
```
---

# Bandit Level 14 → Level 15
### Level Goal

The password for the next level can be retrieved by submitting the password of the current level to port 30000 on localhost.



```zsh
bandit14@bandit:~$ nmap -A -p 30000 127.0.0.1
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-09-18 16:47 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.000070s latency).

PORT      STATE SERVICE VERSION
30000/tcp open  ndmps?
| fingerprint-strings: 
|   FourOhFourRequest, GenericLines, GetRequest, HTTPOptions, Help, LPDString, RTSPRequest, SIPOptions: 
|_    Wrong! Please enter the correct current password.
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port30000-TCP:V=7.94SVN%I=7%D=9/18%Time=68CC37B3%P=x86_64-pc-linux-gnu%
SF:r(GenericLines,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20curre
SF:nt\x20password\.\n")%r(GetRequest,32,"Wrong!\x20Please\x20enter\x20the\
SF:x20correct\x20current\x20password\.\n")%r(HTTPOptions,32,"Wrong!\x20Ple
SF:ase\x20enter\x20the\x20correct\x20current\x20password\.\n")%r(RTSPReque
SF:st,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20current\x20passwo
SF:rd\.\n")%r(Help,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20curr
SF:ent\x20password\.\n")%r(FourOhFourRequest,32,"Wrong!\x20Please\x20enter
SF:\x20the\x20correct\x20current\x20password\.\n")%r(LPDString,32,"Wrong!\
SF:x20Please\x20enter\x20the\x20correct\x20current\x20password\.\n")%r(SIP
SF:Options,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20current\x20p
SF:assword\.\n");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 126.71 seconds
```

```
bandit14@bandit:~$ telnet 30000
Trying 0.0.117.48...
telnet: Unable to connect to remote host: Connection refused

bandit14@bandit:~$ telnet 127.0.0.1 30000 
Trying 127.0.0.1...
Connected to 127.0.0.1.
Escape character is '^]'.
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
Correct!
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
```
```nc``` command, also known as **Netcat**, is a versatile command-line utility used for reading from and writing to network connections using the TCP or UDP protocols

```
Connection closed by foreign host.
bandit14@bandit:~$ nc 127.0.0.1 30000
MU4VWeTyJk8ROof1qqmcBPaLh7lDCPvS
Correct!
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo

```
---
# Bandit Level 15 → Level 16
### Level Goal

The password for the next level can be retrieved by submitting the password of the current level to port 30001 on localhost using SSL/TLS encryption.

Helpful note: Getting “DONE”, “RENEGOTIATING” or “KEYUPDATE”? Read the “CONNECTED COMMANDS” section in the manpage.

```zsh

bandit14@bandit:~$ nmap -A 127.0.0.1 -p 30001
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-09-18 17:17 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.000070s latency).

PORT      STATE SERVICE             VERSION
30001/tcp open  ssl/pago-services1?
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=SnakeOil
| Not valid before: 2024-06-10T03:59:50
|_Not valid after:  2034-06-08T03:59:50
| fingerprint-strings: 
|   FourOhFourRequest, GenericLines, GetRequest, HTTPOptions, Help, LPDString, RTSPRequest, SIPOptions: 
|_    Wrong! Please enter the correct current password.
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port30001-TCP:V=7.94SVN%T=SSL%I=7%D=9/18%Time=68CC3EC2%P=x86_64-pc-linu
SF:x-gnu%r(GenericLines,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x2
SF:0current\x20password\.\n")%r(GetRequest,32,"Wrong!\x20Please\x20enter\x
SF:20the\x20correct\x20current\x20password\.\n")%r(HTTPOptions,32,"Wrong!\
SF:x20Please\x20enter\x20the\x20correct\x20current\x20password\.\n")%r(RTS
SF:PRequest,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20current\x20
SF:password\.\n")%r(Help,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x
SF:20current\x20password\.\n")%r(FourOhFourRequest,32,"Wrong!\x20Please\x2
SF:0enter\x20the\x20correct\x20current\x20password\.\n")%r(LPDString,32,"W
SF:rong!\x20Please\x20enter\x20the\x20correct\x20current\x20password\.\n")
SF:%r(SIPOptions,32,"Wrong!\x20Please\x20enter\x20the\x20correct\x20curren
SF:t\x20password\.\n");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 141.59 seconds
```
i used curl to testing purposes where server certificate validation might fail (e.g., self-signed certificates, expired certificates), you can bypass verification using --insecure or -k
```
bandit14@bandit:~$ curl https://127.0.0.1:30001
curl: (60) SSL certificate problem: self-signed certificate
More details here: https://curl.se/docs/sslcerts.html

curl failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn more about this situation and
how to fix it, please visit the web page mentioned above.

bandit14@bandit:~$ curl -k https://127.0.0.1:30001
curl: (1) Received HTTP/0.9 when not allowed

bandit14@bandit:~$ curl --insecure https://127.0.0.1:30001
curl: (1) Received HTTP/0.9 when not allowed
```


```
bandit14@bandit:~$ openssl s_client -connect 127.0.0.1:30001
CONNECTED(00000003)
Can't use SSL_get_servername
depth=0 CN = SnakeOil
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN = SnakeOil
verify return:1
---
Certificate chain
 0 s:CN = SnakeOil
   i:CN = SnakeOil
   a:PKEY: rsaEncryption, 4096 (bit); sigalg: RSA-SHA256
   v:NotBefore: Jun 10 03:59:50 2024 GMT; NotAfter: Jun  8 03:59:50 2034 GMT
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIFBzCCAu+gAwIBAgIUBLz7DBxA0IfojaL/WaJzE6Sbz7cwDQYJKoZIhvcNAQEL
BQAwEzERMA8GA1UEAwwIU25ha2VPaWwwHhcNMjQwNjEwMDM1OTUwWhcNMzQwNjA4
MDM1OTUwWjATMREwDwYDVQQDDAhTbmFrZU9pbDCCAiIwDQYJKoZIhvcNAQEBBQAD
ggIPADCCAgoCggIBANI+P5QXm9Bj21FIPsQqbqZRb5XmSZZJYaam7EIJ16Fxedf+
jXAv4d/FVqiEM4BuSNsNMeBMx2Gq0lAfN33h+RMTjRoMb8yBsZsC063MLfXCk4p+
09gtGP7BS6Iy5XdmfY/fPHvA3JDEScdlDDmd6Lsbdwhv93Q8M6POVO9sv4HuS4t/
jEjr+NhE+Bjr/wDbyg7GL71BP1WPZpQnRE4OzoSrt5+bZVLvODWUFwinB0fLaGRk
GmI0r5EUOUd7HpYyoIQbiNlePGfPpHRKnmdXTTEZEoxeWWAaM1VhPGqfrB/Pnca+
vAJX7iBOb3kHinmfVOScsG/YAUR94wSELeY+UlEWJaELVUntrJ5HeRDiTChiVQ++
wnnjNbepaW6shopybUF3XXfhIb4NvwLWpvoKFXVtcVjlOujF0snVvpE+MRT0wacy
tHtjZs7Ao7GYxDz6H8AdBLKJW67uQon37a4MI260ADFMS+2vEAbNSFP+f6ii5mrB
18cY64ZaF6oU8bjGK7BArDx56bRc3WFyuBIGWAFHEuB948BcshXY7baf5jjzPmgz
mq1zdRthQB31MOM2ii6vuTkheAvKfFf+llH4M9SnES4NSF2hj9NnHga9V08wfhYc
x0W6qu+S8HUdVF+V23yTvUNgz4Q+UoGs4sHSDEsIBFqNvInnpUmtNgcR2L5PAgMB
AAGjUzBRMB0GA1UdDgQWBBTPo8kfze4P9EgxNuyk7+xDGFtAYzAfBgNVHSMEGDAW
gBTPo8kfze4P9EgxNuyk7+xDGFtAYzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3
DQEBCwUAA4ICAQAKHomtmcGqyiLnhziLe97Mq2+Sul5QgYVwfx/KYOXxv2T8ZmcR
Ae9XFhZT4jsAOUDK1OXx9aZgDGJHJLNEVTe9zWv1ONFfNxEBxQgP7hhmDBWdtj6d
taqEW/Jp06X+08BtnYK9NZsvDg2YRcvOHConeMjwvEL7tQK0m+GVyQfLYg6jnrhx
egH+abucTKxabFcWSE+Vk0uJYMqcbXvB4WNKz9vj4V5Hn7/DN4xIjFko+nREw6Oa
/AUFjNnO/FPjap+d68H1LdzMH3PSs+yjGid+6Zx9FCnt9qZydW13Miqg3nDnODXw
+Z682mQFjVlGPCA5ZOQbyMKY4tNazG2n8qy2famQT3+jF8Lb6a4NGbnpeWnLMkIu
jWLWIkA9MlbdNXuajiPNVyYIK9gdoBzbfaKwoOfSsLxEqlf8rio1GGcEV5Hlz5S2
txwI0xdW9MWeGWoiLbZSbRJH4TIBFFtoBG0LoEJi0C+UPwS8CDngJB4TyrZqEld3
rH87W+Et1t/Nepoc/Eoaux9PFp5VPXP+qwQGmhir/hv7OsgBhrkYuhkjxZ8+1uk7
tUWC/XM0mpLoxsq6vVl3AJaJe1ivdA9xLytsuG4iv02Juc593HXYR8yOpow0Eq2T
U5EyeuFg5RXYwAPi7ykw1PW7zAPL4MlonEVz+QXOSx6eyhimp1VZC11SCg==
-----END CERTIFICATE-----
subject=CN = SnakeOil
issuer=CN = SnakeOil
---
No client certificate CA names sent
Peer signing digest: SHA256
Peer signature type: RSA-PSS
Server Temp Key: X25519, 253 bits
---
SSL handshake has read 2103 bytes and written 373 bytes
Verification error: self-signed certificate
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Server public key is 4096 bit
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 18 (self-signed certificate)
---
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: DBADE84D79F6D2C26D6FD3A48C8D22EDA71E1F0FA46CD48E05519BAC776271D2
    Session-ID-ctx: 
    Resumption PSK: 87CA0936E61D74123710F72B3909FFCB906FCA11DC8A3C126AA124F16F67EC7A469A060ABFDC69E8356379A33718ADA1
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - b3 e0 25 4d 51 8b 9b bc-6d 7b 2e b9 70 74 42 b6   ..%MQ...m{..ptB.
    0010 - ba 8a 6b cb aa 43 b0 ff-7c 79 c1 39 f1 3f a4 ea   ..k..C..|y.9.?..
    0020 - aa f2 02 23 4e 9d 06 90-0a 85 2d 54 49 f9 f7 66   ...#N.....-TI..f
    0030 - a1 00 87 dd 31 a4 62 31-3a 2e 31 12 c9 2e a0 4a   ....1.b1:.1....J
    0040 - 0d 39 d1 1a f3 94 01 56-fa 50 0a 53 64 a2 5b 48   .9.....V.P.Sd.[H
    0050 - 49 20 1e 2e ff 9a b0 64-90 d4 56 ce 04 ea be 6c   I .....d..V....l
    0060 - a5 f6 4b 6a 51 d9 fb 37-b8 b3 5a 02 5b 23 2e c8   ..KjQ..7..Z.[#..
    0070 - 74 e2 ec 9a 03 d9 eb c9-f1 4f ff f6 c7 67 21 bd   t........O...g!.
    0080 - 11 9a 95 46 c1 26 84 86-c4 3c c3 93 93 a0 c4 33   ...F.&...<.....3
    0090 - c6 df ce 9d 41 a3 f1 cb-d5 df 45 54 6a 3c 50 5c   ....A.....ETj<P\
    00a0 - a6 05 ef 21 45 c5 52 30-04 87 e8 12 20 d5 63 af   ...!E.R0.... .c.
    00b0 - 6c d7 70 d9 cc 08 92 63-7a 9f dd 28 d7 35 b1 59   l.p....cz..(.5.Y
    00c0 - e1 e3 7b 50 a8 a1 66 5e-e9 20 12 f3 ac 49 c8 d8   ..{P..f^. ...I..
    00d0 - 02 98 34 3b 9c d2 60 38-41 5c 9a 93 f4 4f ac 77   ..4;..`8A\...O.w

    Start Time: 1758216151
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
---
Post-Handshake New Session Ticket arrived:
SSL-Session:
    Protocol  : TLSv1.3
    Cipher    : TLS_AES_256_GCM_SHA384
    Session-ID: BD4F76A1B8C025F2D2256F49AAF8B25BA010680630B030F977450CC8D5859ED2
    Session-ID-ctx: 
    Resumption PSK: 90FC2F8101F1389DD4B912875C79F03E257E00C0DC6DE8CB03766C3EA84D63D8464045C45C62DDCD57CCE98DCEC0B485
    PSK identity: None
    PSK identity hint: None
    SRP username: None
    TLS session ticket lifetime hint: 300 (seconds)
    TLS session ticket:
    0000 - b3 e0 25 4d 51 8b 9b bc-6d 7b 2e b9 70 74 42 b6   ..%MQ...m{..ptB.
    0010 - 9f bd 4e 48 c3 5f 7a e4-c9 6f d4 29 bd 54 79 20   ..NH._z..o.).Ty 
    0020 - ae 70 c6 d4 2c 29 28 e3-80 b5 fd a3 a0 21 0c bc   .p..,)(......!..
    0030 - f1 24 f7 37 c3 d5 d8 b0-32 63 fe b7 af e1 06 cb   .$.7....2c......
    0040 - 6c f6 55 be b9 41 9b 1a-5f 52 01 04 6c c3 64 69   l.U..A.._R..l.di
    0050 - a9 6f ed b6 5e eb c4 32-02 ea 93 60 61 a3 a4 0e   .o..^..2...`a...
    0060 - 09 16 42 8d 68 42 33 50-27 00 be 90 c0 e8 5e 4a   ..B.hB3P'.....^J
    0070 - 3b 88 7a bf 72 fb ff ea-c6 4d 6f 49 a1 3c c9 26   ;.z.r....MoI.<.&
    0080 - e3 9f 21 94 36 9a cc c6-e2 f7 f0 e7 08 0d f0 99   ..!.6...........
    0090 - 14 b2 ec 5f ab ab c0 42-23 bc ad 38 35 49 dc bb   ..._...B#..85I..
    00a0 - 70 f4 36 8f 79 e9 a3 38-aa ad 1f de f6 04 82 d6   p.6.y..8........
    00b0 - 86 bd ee 3b c8 ed 0e 59-5f b9 fa 20 b6 c6 2b 7c   ...;...Y_.. ..+|
    00c0 - ab 9b b2 a5 58 cc d7 9b-19 c6 45 fe ce f2 6b ca   ....X.....E...k.
    00d0 - d4 e4 43 bf 08 e8 c1 a3-ff cf a3 b1 70 2b 1f 0d   ..C.........p+..

    Start Time: 1758216151
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
8xCjnmgoKbGLhHFAZlGE5Tmu4M2tKJQo
Correct!
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx

closed

```
---
# Bandit Level 16 → Level 17
Level Goal

The credentials for the next level can be retrieved by submitting the password of the current level to a port on localhost in the range 31000 to 32000. First find out which of these ports have a server listening on them. Then find out which of those speak SSL/TLS and which don’t. There is only 1 server that will give the next credentials, the others will simply send back to you whatever you send to it.

Helpful note: Getting “DONE”, “RENEGOTIATING” or “KEYUPDATE”? Read the “CONNECTED COMMANDS” section in the manpage.

```zsh
bandit14@bandit:~$ nmap  -p 31000-32000 127.0.0.1
Nmap scan report for localhost (127.0.0.1)
PORT      STATE SERVICE
31046/tcp open  unknown
31518/tcp open  unknown
31691/tcp open  unknown
31790/tcp open  unknown
31960/tcp open  unknown
Nmap done: 1 IP address (1 host up) scanned in 0.06 seconds

bandit14@bandit:~$ ss -tlup
tcp            LISTEN          0               4096                            0.0.0.0:31518                           0.0.0.0:*
tcp            LISTEN          0               4096                            0.0.0.0:31790                           0.0.0.0:*
tcp            LISTEN          0               4096                            0.0.0.0:30001                           0.0.0.0:*     
tcp            LISTEN          0               5                               0.0.0.0:30000                           0.0.0.0:*                   
tcp            LISTEN          0               5                               0.0.0.0:30002                           0.0.0.0:*                   
tcp            LISTEN          0               64                                    *:31691                                 *:*
tcp            LISTEN          0               64                                    *:31046                                 *:*                   tcp            LISTEN          0               64                                    *:31960                                 *:*

bandit14@bandit:~$ openssl s_client -connect localhost:31790 --quiet
Can't use SSL_get_servername
depth=0 CN = SnakeOil
verify error:num=18:self-signed certificate
verify return:1
depth=0 CN = SnakeOil
verify return:1
kSkvUpMQ7lBYyCM4GBPvCvT1BfWRy0Dx
Correct!
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAvmOkuifmMg6HL2YPIOjon6iWfbp7c3jx34YkYWqUH57SUdyJ
imZzeyGC0gtZPGujUSxiJSWI/oTqexh+cAMTSMlOJf7+BrJObArnxd9Y7YT2bRPQ
Ja6Lzb558YW3FZl87ORiO+rW4LCDCNd2lUvLE/GL2GWyuKN0K5iCd5TbtJzEkQTu
DSt2mcNn4rhAL+JFr56o4T6z8WWAW18BR6yGrMq7Q/kALHYW3OekePQAzL0VUYbW
JGTi65CxbCnzc/w4+mqQyvmzpWtMAzJTzAzQxNbkR2MBGySxDLrjg0LWN6sK7wNX
x0YVztz/zbIkPjfkU1jHS+9EbVNj+D1XFOJuaQIDAQABAoIBABagpxpM1aoLWfvD
KHcj10nqcoBc4oE11aFYQwik7xfW+24pRNuDE6SFthOar69jp5RlLwD1NhPx3iBl
J9nOM8OJ0VToum43UOS8YxF8WwhXriYGnc1sskbwpXOUDc9uX4+UESzH22P29ovd
d8WErY0gPxun8pbJLmxkAtWNhpMvfe0050vk9TL5wqbu9AlbssgTcCXkMQnPw9nC
YNN6DDP2lbcBrvgT9YCNL6C+ZKufD52yOQ9qOkwFTEQpjtF4uNtJom+asvlpmS8A
vLY9r60wYSvmZhNqBUrj7lyCtXMIu1kkd4w7F77k+DjHoAXyxcUp1DGL51sOmama
+TOWWgECgYEA8JtPxP0GRJ+IQkX262jM3dEIkza8ky5moIwUqYdsx0NxHgRRhORT
8c8hAuRBb2G82so8vUHk/fur85OEfc9TncnCY2crpoqsghifKLxrLgtT+qDpfZnx
SatLdt8GfQ85yA7hnWWJ2MxF3NaeSDm75Lsm+tBbAiyc9P2jGRNtMSkCgYEAypHd
HCctNi/FwjulhttFx/rHYKhLidZDFYeiE/v45bN4yFm8x7R/b0iE7KaszX+Exdvt
SghaTdcG0Knyw1bpJVyusavPzpaJMjdJ6tcFhVAbAjm7enCIvGCSx+X3l5SiWg0A
R57hJglezIiVjv3aGwHwvlZvtszK6zV6oXFAu0ECgYAbjo46T4hyP5tJi93V5HDi
Ttiek7xRVxUl+iU7rWkGAXFpMLFteQEsRr7PJ/lemmEY5eTDAFMLy9FL2m9oQWCg
R8VdwSk8r9FGLS+9aKcV5PI/WEKlwgXinB3OhYimtiG2Cg5JCqIZFHxD6MjEGOiu
L8ktHMPvodBwNsSBULpG0QKBgBAplTfC1HOnWiMGOU3KPwYWt0O6CdTkmJOmL8Ni
blh9elyZ9FsGxsgtRBXRsqXuz7wtsQAgLHxbdLq/ZJQ7YfzOKU4ZxEnabvXnvWkU
YOdjHdSOoKvDQNWu6ucyLRAWFuISeXw9a/9p7ftpxm0TSgyvmfLF2MIAEwyzRqaM
77pBAoGAMmjmIJdjp+Ez8duyn3ieo36yrttF5NSsJLAbxFpdlc1gvtGCWW+9Cq0b
dxviW8+TFVEBl1O4f7HVm6EpTscdDxU+bCXWkfjuRb7Dy9GOtt9JPsX8MBTakzh3
vBgsyi/sN3RqRBcGU40fOoZyfAMT8s1m/uYv52O6IgeuZ/ujbjY=
-----END RSA PRIVATE KEY-----

```
---
Bandit Level 17 → Level 18
Level Goal

There are 2 files in the homedirectory: passwords.old and passwords.new. The password for the next level is in passwords.new and is the only line that has been changed between passwords.old and passwords.new

NOTE: if you have solved this level and see ‘Byebye!’ when trying to log into bandit18, this is related to the next level, bandit19

```zsh

sudo chmod 400 bandit17.key
ssh -i bandit17.key bandit17@bandit.labs.overthewire.org -p 2220

bandit17@bandit:~$ ls -lhas
total 36K
4.0K drwxr-xr-x   3 root     root     4.0K Aug 15 13:15 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
4.0K -rw-r-----   1 bandit17 bandit17   33 Aug 15 13:15 .bandit16.password
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -rw-r-----   1 bandit18 bandit17 3.3K Aug 15 13:15 passwords.new
4.0K -rw-r-----   1 bandit18 bandit17 3.3K Aug 15 13:15 passwords.old
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:15 .ssh


bandit17@bandit:~$ comm passwords.old passwords.new
CgmS55GVlEKTgx8xpW8HuWnHlBKP924b
KrGnm2FML9aEaLxuYVZfIQVYBfrKVVhQ
comm: file 1 is not in sorted order
A0AwBAziY854CevtUEbjCXcwPaTXIgow
ltSIfBAqpLUG5MMzWJUozlC7ZgDuSSEr
eplYeS11XumKc3QAj7MkrvhwHKC3wE3M
        	x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO
comm: file 2 is not in sorted order
	KrGnm2FML9aEaLxuYVZfIQVYBfrKVVhQ
	A0AwBAziY854CevtUEbjCXcwPaTXIgow
	ltSIfBAqpLUG5MMzWJUozlC7ZgDuSSEr
	eplYeS11XumKc3QAj7MkrvhwHKC3wE3M

```

---
# Bandit Level 18 → Level 19
Level Goal

The password for the next level is stored in a file readme in the homedirectory. Unfortunately, someone has modified .bashrc to log you out when you log in with SSH.

```zsh

ssh bandit18@bandit.labs.overthewire.org -p 2220
password: x2gLTTjFwMOhQ8oWNbMN362QKxfRqGlO
Enjoy your stay!

Byebye !
Connection to bandit.labs.overthewire.org closed.


kali@kali:~$ ssh bandit18@bandit.labs.overthewire.org -p 2220 ls -lhas
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-1
bandit18@bandit.labs.overthewire.org's password: 
total 24K
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:15 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r-----   1 bandit19 bandit18 3.8K Aug 15 13:15 .bashrc
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
4.0K -rw-r-----   1 bandit19 bandit18   33 Aug 15 13:15 readme


kali@kali:~/Desktop$ ssh bandit18@bandit.labs.overthewire.org -p 2220 cat readme
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-1
bandit18@bandit.labs.overthewire.org's password: 
cGWpMaKXVwDUNgPAVJbWYuGHVn9zl3j8
```
---
# Bandit Level 19 → Level 20
Level Goal

To gain access to the next level, you should use the setuid binary in the homedirectory. Execute it without arguments to find out how to use it. The password for this level can be found in the usual place (/etc/bandit_pass), after you have used the setuid binary.

```zsh

bandit19@bandit:~$ ls -lhas
total 36K
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:16 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
 16K -rwsr-x---   1 bandit20 bandit19  15K Aug 15 13:16 bandit20-do
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
bandit19@bandit:~$ file bandit20-do

bandit20-do: setuid ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, BuildID[sha1]=35d353cf6d732f515a73f50ed205265fe1e68f90, for GNU/Linux 3.2.0, not stripped

bandit19@bandit:~$ find / -user bandit20 -group bandit19 2>/dev/null
/home/bandit19/bandit20-do

bandit19@bandit:~$ find / -user bandit20 2>/dev/null
/sys/fs/cgroup/user.slice/user-11020.slice/user@11020.service
/sys/fs/cgroup/user.slice/user-11020.slice/user@11020.service/cgroup.procs
/sys/fs/cgroup/user.slice/user-11020.slice/user@11020.service/session.slice
.
.
.

/run/user/11020
/run/screen/S-bandit20
/dev/pts/32
/etc/bandit_pass/bandit20
/etc/dpkg/.info20.txt
/home/bandit19/bandit20-do

bandit19@bandit:~$ bandit20-do
bandit20-do: command not found
bandit19@bandit:~$ ./bandit20-do
Run a command as another user.
  Example: ./bandit20-do id
bandit19@bandit:~$ ./bandit20-do id
uid=11019(bandit19) gid=11019(bandit19) euid=11020(bandit20) groups=11019(bandit19)
bandit19@bandit:~$ ./bandit20-do cat /etc/bandit_pass/bandit20
0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO

```
---
# Bandit Level 20 → Level 21
Level Goal

There is a setuid binary in the homedirectory that does the following: it makes a connection to localhost on the port you specify as a commandline argument. It then reads a line of text from the connection and compares it to the password in the previous level (bandit20). If the password is correct, it will transmit the password for the next level (bandit21).

NOTE: Try connecting to your own network daemon to see if it works as you think
```zsh

bandit20@bandit:~$ ls -lhas
total 36K
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:16 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
 16K -rwsr-x---   1 bandit21 bandit20  16K Aug 15 13:16 suconnect
bandit20@bandit:~$ ./suconnect 
Usage: ./suconnect <portnumber>
This program will connect to the given port on localhost using TCP. If it receives the correct password from the other side, the next password is transmitted back.
bandit20@bandit:~$ ps aux
USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
bandit20 2796739  0.0  0.1   9204  5804 pts/21   Ss   04:59   0:00 -bash
bandit20 2819838  0.0  0.1  10884  4596 pts/21   R+   05:18   0:00 ps aux
bandit20 2857105  0.0  0.1   9292  5068 ?        Ss   Sep17   0:00 /usr/bin/dbus-daemon --session --address=systemd: --nofork -
bandit20@bandit:~$ nmap 127.0.0.1
Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-09-19 05:19 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.000099s latency).
Not shown: 993 closed tcp ports (conn-refused)
PORT      STATE SERVICE
22/tcp    open  ssh
1111/tcp  open  lmsocialserver
1840/tcp  open  netopia-vo2
4321/tcp  open  rwhois
8000/tcp  open  http-alt
30000/tcp open  ndmps
50001/tcp open  unknown
Nmap done: 1 IP address (1 host up) scanned in 0.05 seconds


bandit20@bandit:~$ echo "0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO" | nc 127.0.0.1 -p 44444
usage: nc [-46CDdFhklNnrStUuvZz] [-I length] [-i interval] [-M ttl]
	  [-m minttl] [-O length] [-P proxy_username] [-p source_port]
	  [-q seconds] [-s sourceaddr] [-T keyword] [-V rtable] [-W recvlimit]
	  [-w timeout] [-X proxy_protocol] [-x proxy_address[:port]]
	  [destination] [port]

bandit20@bandit:~$ echo "0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO" | nc 127.0.0.1:44444
nc: missing port number

bandit20@bandit:~$ echo "0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO" | nc 127.0.0.1 44444
bandit20@bandit:~$ ./suconnect 44444
Could not connect

bandit20@bandit:~$ echo "0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO" | nc -l -p 44444
^C
bandit20@bandit:~$ echo "0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO" | nc -l -p 44444 &
[1] 2825973

bandit20@bandit:~$ ./suconnect 44444
Read: 0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO
Password matches, sending next password
EeoULMCra2q0dSkYj561DX7s1CpBuOBt
[1]+  Done                    echo "0qXahG8ZjOVMN9Ghs7iOWsCfZyXOUbYO" | nc -l -p 44444

```
---

# Bandit Level 21 → Level 22
Level Goal

A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

```zsh

bandit21@bandit:~$ ls -lhas
total 36K
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:16 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
 16K -rwsr-x---   1 bandit21 bandit20  16K Aug 15 13:16 suconnect

bandit21@bandit:~$ file suconnect 
suconnect: setuid ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, BuildID[sha1]=a95f034b2749e585fbeed4f260f85a4b150934c2, for GNU/Linux 3.2.0, not stripped

bandit21@bandit:~$ ./suconnect 
Usage: ./suconnect <portnumber>
This program will connect to the given port on localhost using TCP. If it receives the correct password from the other side, the next password is transmitted back.



```
# Bandit Level 21 → Level 22
Level Goal

A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

```zsh 

bandit21@bandit:~$ ls -lhas
total 24K
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:16 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -r--------   1 bandit21 bandit21   33 Aug 15 13:16 .prevpass
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile

bandit21@bandit:~$ cd /etc/cron.d/

bandit21@bandit:/etc/cron.d$ ls
behemoth4_cleanup  cronjob_bandit22  cronjob_bandit24  leviathan5_cleanup    otw-tmp-dir
clean_tmp          cronjob_bandit23  e2scrub_all       manpage3_resetpw_job  sysstat

bandit21@bandit:/etc/cron.d$ cat otw-tmp-dir 
cat: otw-tmp-dir: Permission denied

bandit21@bandit:/etc/cron.d$ ls -lhas
total 60K
4.0K drwxr-xr-x   2 root root 4.0K Aug 15 13:19 .
 12K drwxr-xr-x 128 root root  12K Aug 29 21:51 ..
4.0K -r--r-----   1 root root   47 Aug 15 13:16 behemoth4_cleanup
4.0K -rw-r--r--   1 root root  123 Aug 15 13:09 clean_tmp
4.0K -rw-r--r--   1 root root  120 Aug 15 13:16 cronjob_bandit22
4.0K -rw-r--r--   1 root root  122 Aug 15 13:16 cronjob_bandit23
4.0K -rw-r--r--   1 root root  120 Aug 15 13:16 cronjob_bandit24
4.0K -rw-r--r--   1 root root  201 Apr  8  2024 e2scrub_all
4.0K -r--r-----   1 root root   48 Aug 15 13:17 leviathan5_cleanup
4.0K -rw-------   1 root root  138 Aug 15 13:17 manpage3_resetpw_job
4.0K -rwx------   1 root root   52 Aug 15 13:19 otw-tmp-dir
4.0K -rw-r--r--   1 root root  102 Mar 31  2024 .placeholder
4.0K -rw-r--r--   1 root root  396 Jan  9  2024 sysstat

bandit21@bandit:/etc/cron.d$ cron
cron                 cronjob_bandit22.sh  crontab  
  
bandit21@bandit:/etc/cron.d$ cronjob_bandit22.sh 
chmod: changing permissions of '/tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv': Operation not permitted
/usr/bin/cronjob_bandit22.sh: line 3: /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv: Permission denied
     
bandit21@bandit:/etc/cron.d$ cat cronjob_bandit22
@reboot bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
* * * * * bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null
          
bandit21@bandit:/etc/cron.d$ cat /tmp/t7O6lds9S0RqQh9aMcz6ShpAoZKF7fgv
tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q


```
---

# Bandit Level 22 → Level 23
Level Goal

A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

NOTE: Looking at shell scripts written by other people is a very useful skill. The script for this level is intentionally made easy to read. If you are having problems understanding what it does, try executing it to see the debug information it prints.

**review the code find odd **

```zsh
bandit22@bandit:~$ ls
bandit22@bandit:~$ cd /etc/cron.d
bandit22@bandit:/etc/cron.d$ ls -lhas
total 60K
4.0K drwxr-xr-x   2 root root 4.0K Aug 15 13:19 .
 12K drwxr-xr-x 128 root root  12K Aug 29 21:51 ..
4.0K -r--r-----   1 root root   47 Aug 15 13:16 behemoth4_cleanup
4.0K -rw-r--r--   1 root root  123 Aug 15 13:09 clean_tmp
4.0K -rw-r--r--   1 root root  120 Aug 15 13:16 cronjob_bandit22
4.0K -rw-r--r--   1 root root  122 Aug 15 13:16 cronjob_bandit23
4.0K -rw-r--r--   1 root root  120 Aug 15 13:16 cronjob_bandit24
4.0K -rw-r--r--   1 root root  201 Apr  8  2024 e2scrub_all
4.0K -r--r-----   1 root root   48 Aug 15 13:17 leviathan5_cleanup
4.0K -rw-------   1 root root  138 Aug 15 13:17 manpage3_resetpw_job
4.0K -rwx------   1 root root   52 Aug 15 13:19 otw-tmp-dir
4.0K -rw-r--r--   1 root root  102 Mar 31  2024 .placeholder
4.0K -rw-r--r--   1 root root  396 Jan  9  2024 sysstat

bandit22@bandit:/etc/cron.d$ cronjob_bandit23.sh 
Copying passwordfile /etc/bandit_pass/bandit22 to /tmp/8169b67bd894ddbb4412f91573b38db3

bandit22@bandit:~$ cat /usr/bin/cronjob_bandit23.sh 
#!/bin/bash

myname=$(whoami)
mytarget=$(echo I am user $myname | md5sum | cut -d ' ' -f 1)

echo "Copying passwordfile /etc/bandit_pass/$myname to /tmp/$mytarget"

cat /etc/bandit_pass/$myname > /tmp/$mytarget

bandit22@bandit:~$ cat /tmp/8169b67bd894ddbb4412f91573b38db3
tRae0UfB9v0UzbCdn9cY0gQnds9GF58Q  # current user password

bandit22@bandit:/etc/cron.d$ echo I am user bandit23 | md5sum | cut -d ' ' -f 1
8ca319486bfbbc3663ea0fbe81326349
bandit22@bandit:/etc/cron.d$ cat /tmp/8ca319486bfbbc3663ea0fbe81326349
0Zf11ioIjMVN551jX3CmStKLYqjk54Ga
```

---


# Bandit Level 23 → Level 24
Level Goal

A program is running automatically at regular intervals from cron, the time-based job scheduler. Look in /etc/cron.d/ for the configuration and see what command is being executed.

NOTE: This level requires you to create your own first shell-script. This is a very big step and you should be proud of yourself when you beat this level!

NOTE 2: Keep in mind that your shell script is removed once executed, so you may want to keep a copy around…
```zsh
bandit23@bandit:~$ cd /etc/cron.
cron.d/       cron.daily/   cron.hourly/  cron.monthly/ cron.weekly/  cron.yearly/  
bandit23@bandit:~$ cd /etc/cron.d/
bandit23@bandit:/etc/cron.d$ ls
behemoth4_cleanup  cronjob_bandit22  cronjob_bandit24  leviathan5_cleanup    otw-tmp-dir
clean_tmp          cronjob_bandit23  e2scrub_all       manpage3_resetpw_job  sysstat
bandit23@bandit:/etc/cron.d$ cat cronjob_bandit24
@reboot bandit24 /usr/bin/cronjob_bandit24.sh &> /dev/null
* * * * * bandit24 /usr/bin/cronjob_bandit24.sh &> /dev/null

bandit23@bandit:/etc/cron.d$ cat /usr/bin/cronjob_bandit24.sh 
#!/bin/bash

myname=$(whoami)

cd /var/spool/$myname/foo
echo "Executing and deleting all scripts in /var/spool/$myname/foo:"
for i in * .*;
do
    if [ "$i" != "." -a "$i" != ".." ];
    then
        echo "Handling $i"
        owner="$(stat --format "%U" ./$i)"
        if [ "${owner}" = "bandit23" ]; then
            timeout -s 9 60 ./$i
        fi
        rm -f ./$i
    fi
done

bandit23@bandit:/etc/cron.d$ cd /var/spool/
bandit23@bandit:/var/spool$ ls
bandit24  cron  mail  rsyslog
bandit23@bandit:/var/spool$ cd bandit24/
bandit23@bandit:/var/spool/bandit24$ ls
foo
bandit23@bandit:/var/spool/bandit24$ touch password
touch: cannot touch 'password': Operation not permitted
bandit23@bandit:/var/spool/bandit24$ cd foo/
bandit23@bandit:/var/spool/bandit24/foo$ touch password
bandit23@bandit:/var/spool/bandit24/foo$ nano password
Unable to create directory /home/bandit23/.local/share/nano/: No such file or directory
It is required for saving/loading search history or cursor positions.

bandit23@bandit:/var/spool/bandit24/foo$ ls 
ls: cannot open directory '.': Permission denied
bandit23@bandit:/var/spool/bandit24/foo$ touch password
bandit23@bandit:/var/spool/bandit24/foo$ mktemp -d
/tmp/tmp.GbBiFtkX7l
bandit23@bandit:/var/spool/bandit24/foo$ cd /tmp/tmp.GbBiFtkX7l
bandit23@bandit:/tmp/tmp.GbBiFtkX7l$ ls
bandit23@bandit:/tmp/tmp.GbBiFtkX7l$ touch password
bandit23@bandit:/tmp/tmp.GbBiFtkX7l$ echo "cp /etc/bandit_pass/bandit24 /tmp/tmp.GbBiFtkX7l/ && cat /etc/bandit_pass/bandit24 > /tmp/tmp.GbBiFtkX7l/password24 " > password 
bandit23@bandit:/tmp/tmp.GbBiFtkX7l$ ls
password
bandit23@bandit:/tmp/tmp.GbBiFtkX7l$ cat password 
cp /etc/bandit_pass/bandit24 /tmp/tmp.GbBiFtkX7l/ && cat /etc/bandit_pass/bandit24 > /tmp/tmp.GbBiFtkX7l/password24 
bandit23@bandit:/tmp/tmp.GbBiFtkX7l$ chmod 777 password


bandit24 :  gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8
```
--

# Bandit Level 24 → Level 25
Level Goal

A daemon is listening on port 30002 and will give you the password for bandit25 if given the password for bandit24 and a secret numeric 4-digit pincode. There is no way to retrieve the pincode except by going through all of the 10000 combinations, called brute-forcing.
You do not need to create new connections each time

```python3
import socket

# Server details
host = "127.0.0.1"
port = 30002
password = "gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8"

# Function to try a single pincode
def try_pincode(pin):
    try:
        # Create a socket connection
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)  # Set timeout to avoid hanging
        s.connect((host, port))
        
        # Receive initial prompt
        data = s.recv(1024).decode()
        
        # Send password and pincode
        s.sendall(f"{password} {pin}\n".encode())
        
        # Receive response
        response = s.recv(1024).decode()
        
        # Close connection
        s.close()
        
        # Check if the response indicates success
        if "Wrong!" not in response:
            print(f"Success! Pincode: {pin}")
            print(response)
            return True
        else:
            print(f"Failed: {pin}")
            return False
    except Exception as e:
        print(f"Error with pin {pin}: {e}")
        return False

# Iterate through all possible 4-digit pincodes
for i in range(10000):
    pin = f"{i:04d}"  # Format as 4-digit string (e.g., 0000, 0001, ..., 9999)
    if try_pincode(pin):
        break  # Stop if we find the correct pincode

print("Brute-force complete.")

```
this python3 file, i generate by gpt 

```zsh
bandit24@bandit:~$ nc 127.0.0.1 30002
I am the pincode checker for user bandit25. Please enter the password for user bandit24 and the secret pincode on a single line, separated by a space.
gb8KRRCsshuZXI0tUuR6ypOFjiZbf3G8 0000
Wrong! Please enter the correct current password and pincode. Try again.
^C
bandit24@bandit:~$ ls
bandit24@bandit:~$ ls -lhas
total 20K
4.0K drwxr-xr-x   2 root root 4.0K Aug 15 13:15 .
4.0K drwxr-xr-x 150 root root 4.0K Aug 15 13:18 ..
4.0K -rw-r--r--   1 root root  220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root root 3.8K Aug 15 13:09 .bashrc
4.0K -rw-r--r--   1 root root  807 Mar 31  2024 .profile
bandit24@bandit:~$ mktemp -d
/tmp/tmp.tFJ8kb8MLR
bandit24@bandit:~$ cd /tmp/tmp.tFJ8kb8MLR
bandit24@bandit:/tmp/tmp.tFJ8kb8MLR$ ls
bandit24@bandit:/tmp/tmp.tFJ8kb8MLR$ nano burte.py
Unable to create directory /home/bandit24/.local/share/nano/: No such file or directory
It is required for saving/loading search history or cursor positions.

bandit24@bandit:/tmp/tmp.tFJ8kb8MLR$ chmod 777 burte.py 
bandit24@bandit:/tmp/tmp.tFJ8kb8MLR$ python3  burte.py 
Failed: 0000
Failed: 0001
..
..
...
...
Success! Pincode: 4325
Correct!
The password of user bandit25 is iCi86ttT4KSNe1armKiwbQNmB3YJP3q4

```
---

#Bandit Level 25 → Level 26
Level Goal

Logging in to bandit26 from bandit25 should be fairly easy… The shell for user bandit26 is not /bin/bash, but something else. Find out what it is, how it works and how to break out of it.

```zsh
bandit25@bandit:~$ ls
bandit26.sshkey
bandit25@bandit:~$ ls  -lhas
total 40K
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:16 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
4.0K -rw-r-----   1 bandit25 bandit25   33 Aug 15 13:16 .bandit24.password
4.0K -r--------   1 bandit25 bandit25 1.7K Aug 15 13:16 bandit26.sshkey
4.0K -rw-r-----   1 bandit25 bandit25  151 Aug 15 13:16 .banner
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -rw-r-----   1 bandit25 bandit25   66 Aug 15 13:16 .flag
4.0K -rw-r-----   1 bandit25 bandit25    4 Aug 15 13:16 .pin
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
bandit25@bandit:~$ cat /etc/passwd | grep bandit26
bandit26:x:11026:11026:bandit level 26:/home/bandit26:/usr/bin/showtext
bandit25@bandit:~$ ls -lhas /usr/bin/showtext 
4.0K -rwxr-xr-x 1 root root 58 Aug 15 13:16 /usr/bin/showtext
bandit25@bandit:~$ cat  /usr/bin/showtext 
#!/bin/sh

export TERM=linux

exec more ~/text.txt
exit 0
```
```
bandit25@bandit:~$ ssh bandit26@localhost -i bandit26.sshkey  -p 2220
The authenticity of host '[localhost]:2220 ([127.0.0.1]:2220)' can't be established.
ED25519 key fingerprint is SHA256:C2ihUBV7ihnV1wUXRb4RrEcLfXC5CXlhmAAM/urerLY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Could not create directory '/home/bandit25/.ssh' (Permission denied).
Failed to add the host to the list of known hosts (/home/bandit25/.ssh/known_hosts).
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

!!! You are trying to log into this SSH server with a password on port 2220 from localhost.
!!! Connecting from localhost is blocked to conserve resources.
!!! Please log out and log in again.

backend: gibson-1

      ,----..            ,----,          .---.
     /   /   \         ,/   .`|         /. ./|
    /   .     :      ,`   .'  :     .--'.  ' ;
   .   /   ;.  \   ;    ;     /    /__./ \ : |
  .   ;   /  ` ; .'___,/    ,' .--'.  '   \' .
  ;   |  ; \ ; | |    :     | /___/ \ |    ' '
  |   :  | ; | ' ;    |.';  ; ;   \  \;      :
  .   |  ' ' ' : `----'  |  |  \   ;  `      |
  '   ;  \; /  |     '   :  ;   .   \    .\  ;
   \   \  ',  /      |   |  '    \   \   ' \ |
    ;   :    /       '   :  |     :   '  |--"
     \   \ .'        ;   |.'       \   \ ;
  www. `---` ver     '---' he       '---" ire.org


Welcome to OverTheWire!

If you find any problems, please report them to the #wargames channel on
discord or IRC.

--[ Playing the games ]--

  This machine might hold several wargames.
  If you are playing "somegame", then:

    * USERNAMES are somegame0, somegame1, ...
    * Most LEVELS are stored in /somegame/.
    * PASSWORDS for each level are stored in /etc/somegame_pass/.

  Write-access to homedirectories is disabled. It is advised to create a
  working directory with a hard-to-guess name in /tmp/.  You can use the
  command "mktemp -d" in order to generate a random and hard to guess
  directory in /tmp/.  Read-access to both /tmp/ is disabled and to /proc
  restricted so that users cannot snoop on eachother. Files and directories
  with easily guessable or short names will be periodically deleted! The /tmp
  directory is regularly wiped.
  Please play nice:

    * don't leave orphan processes running
    * don't leave exploit-files laying around
    * don't annoy other players
    * don't post passwords or spoilers
    * again, DONT POST SPOILERS!
      This includes writeups of your solution on your blog or website!

--[ Tips ]--

  This machine has a 64bit processor and many security-features enabled
  by default, although ASLR has been switched off.  The following
  compiler flags might be interesting:

    -m32                    compile for 32bit
    -fno-stack-protector    disable ProPolice
    -Wl,-z,norelro          disable relro

  In addition, the execstack tool can be used to flag the stack as
  executable on ELF binaries.

  Finally, network-access is limited for most levels by a local
  firewall.

--[ Tools ]--

 For your convenience we have installed a few useful tools which you can find
 in the following locations:

    * gef (https://github.com/hugsy/gef) in /opt/gef/
    * pwndbg (https://github.com/pwndbg/pwndbg) in /opt/pwndbg/
    * gdbinit (https://github.com/gdbinit/Gdbinit) in /opt/gdbinit/
    * pwntools (https://github.com/Gallopsled/pwntools)
    * radare2 (http://www.radare.org/)

--[ More information ]--

  For more information regarding individual wargames, visit
  http://www.overthewire.org/wargames/

  For support, questions or comments, contact us on discord or IRC.

  Enjoy your stay!

  _                     _ _ _   
___   __  
 | |                   | (_) | |
__ \ / /  
 | |__   __ _ _ __   __| |_| |_ 
  ) / /_  
 | '_ \ / _` | '_ \ / _` | | __|
 / / '_ \ 
 | |_) | (_| | | | | (_| | | |_ 
/ /| (_) |

...skipping 7 lines
Connection to localhost closed.
bandit25@bandit:~$ ssh bandit26@localhost -i bandit26.sshkey  -p 2220
The authenticity of host '[localhost]:2220 ([127.0.0.1]:2220)' can't be established.
ED25519 key fingerprint is SHA256:C2ihUBV7ihnV1wUXRb4RrEcLfXC5CXlhmAAM/urerLY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Could not create directory '/home/bandit25/.ssh' (Permission denied).
Failed to add the host to the list of known hosts (/home/bandit25/.ssh/known_hosts).
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

!!! You are trying to log into this SSH server with a password on port 2220 from localhost.
!!! Connecting from localhost is blocked to conserve resources.
!!! Please log out and log in again.

backend: gibson-1

      ,----..            ,----,          .---.
     /   /   \         ,/   .`|         /. ./|
    /   .     :      ,`   .'  :     .--'.  ' ;
   .   /   ;.  \   ;    ;     /    /__./ \ : |
  .   ;   /  ` ; .'___,/    ,' .--'.  '   \' .
  ;   |  ; \ ; | |    :     | /___/ \ |    ' '
  |   :  | ; | ' ;    |.';  ; ;   \  \;      :
  .   |  ' ' ' : `----'  |  |  \   ;  `      |
  '   ;  \; /  |     '   :  ;   .   \    .\  ;
   \   \  ',  /      |   |  '    \   \   ' \ |
    ;   :    /       '   :  |     :   '  |--"
     \   \ .'        ;   |.'       \   \ ;
  www. `---` ver     '---' he       '---" ire.org


Welcome to OverTheWire!

If you find any problems, please report them to the #wargames channel on
discord or IRC.

--[ Playing the games ]--

  This machine might hold several wargames.
  If you are playing "somegame", then:

    * USERNAMES are somegame0, somegame1, ...
    * Most LEVELS are stored in /somegame/.
    * PASSWORDS for each level are stored in /etc/somegame_pass/.

  Write-access to homedirectories is disabled. It is advised to create a
  working directory with a hard-to-guess name in /tmp/.  You can use the
  command "mktemp -d" in order to generate a random and hard to guess
  directory in /tmp/.  Read-access to both /tmp/ is disabled and to /proc
  restricted so that users cannot snoop on eachother. Files and directories
  with easily guessable or short names will be periodically deleted! The /tmp
  directory is regularly wiped.
  Please play nice:

    * don't leave orphan processes running
    * don't leave exploit-files laying around
    * don't annoy other players
    * don't post passwords or spoilers
    * again, DONT POST SPOILERS!
      This includes writeups of your solution on your blog or website!

--[ Tips ]--

  This machine has a 64bit processor and many security-features enabled
  by default, although ASLR has been switched off.  The following
  compiler flags might be interesting:

    -m32                    compile for 32bit
    -fno-stack-protector    disable ProPolice
    -Wl,-z,norelro          disable relro

  In addition, the execstack tool can be used to flag the stack as
  executable on ELF binaries.

  Finally, network-access is limited for most levels by a local
  firewall.

--[ Tools ]--
  _                     _ _ _   ___   __
 | |                   | (_) | |__ \ / /
 | |__   __ _ _ __   __| |_| |_   ) / /_
 | '_ \ / _` | '_ \ / _` | | __| / / '_ \
 | |_) | (_| | | | | (_| | | |_ / /| (_) |
 |_.__/ \__,_|_| |_|\__,_|_|\__|____\___/
~                                                                                                        
~                                                                                                        
~                                                                                                        
~                                                                                                     
~                                                                                                        
~                                                                                                        
  _                     _ _ _   ___   __
 | |                   | (_) | |__ \ / /
 | |__   __ _ _ __   __| |_| |_   ) / /_
 | '_ \ / _` | '_ \ / _` | | __| / / '_ \
 | |_) | (_| | | | | (_| | | |_ / /| (_) |
 |_.__/ \__,_|_| |_|\__,_|_|\__|____\___/ 
~                                                                                                        
~                                                                                                        
  _                     _ _ _   ___   __
 | |                   | (_) | |__ \ / /
 | |__   __ _ _ __   __| |_| |_   ) / /_
 | '_ \ / _` | '_ \ / _` | | __| / / '_ \
 | |_) | (_| | | | | (_| | | |_ / /| (_) |
 |_.__/ \__,_|_| |_|\__,_|_|\__|____\___/SDF
~                                                                                                        
~                                                                                                        
  _                     _ _ _   ___   __
 | |                   | (_) | |__ \ / /
 | |__   __ _ _ __   __| |_| |_   ) / /_
 | '_ \ / _` | '_ \ / _` | | __| / / '_ \
 | |_) | (_| | | | | (_| | | |_ / /| (_) |
 |_.__/ \__,_|_| |_|\__,_|_|\__|____\___/SDF
~                                                                                                        
~                                                                                                        
~                                                                                                        
~                                                                                                        
~                                                                                                        
~                                                                                                  
~                                                                                                        
:shell
[No write since last change]
bandit26@bandit:~$ ls
bandit27-do  text.txt
bandit26@bandit:~$ cat text.txt
  _                     _ _ _   ___   __  
 | |                   | (_) | |__ \ / /  
 | |__   __ _ _ __   __| |_| |_   ) / /_  
 | '_ \ / _` | '_ \ / _` | | __| / / '_ \ 
 | |_) | (_| | | | | (_| | | |_ / /| (_) |
 |_.__/ \__,_|_| |_|\__,_|_|\__|____\___/ 
bandit26@bandit:~$ cat /etc/bandit_pass/bandit26
s0773xxkk0MXfdqOfPRVr9L3jJBUOgCZ
bandit26@bandit:~$
```
# Bandit Level 26 → Level 27
Level Goal

Good job getting a shell! Now hurry and grab the password for bandit27!

```
bandit26@bandit:~$ ls
bandit27-do  text.txt

bandit26@bandit:~$ ls -lhas
total 44K
4.0K drwxr-xr-x   3 root     root     4.0K Aug 15 13:16 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
 16K -rwsr-x---   1 bandit27 bandit26  15K Aug 15 13:16 bandit27-do
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:16 .ssh
4.0K -rw-r-----   1 bandit26 bandit26  258 Aug 15 13:16 text.txt

bandit26@bandit:~$ file bandit27-do 
bandit27-do: setuid ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, BuildID[sha1]=35d353cf6d732f515a73f50ed205265fe1e68f90, for GNU/Linux 3.2.0, not stripped

bandit26@bandit:~$ ./bandit27-do cat /etc/bandit_pass/bandit27
upsNCc7vzaRDx6oZC6GiR6ERwe1MowGB

```

---
#  Bandit Level 27 → Level 28
Level Goal

There is a git repository at ssh://bandit27-git@localhost/home/bandit27-git/repo via the port 2220. The password for the user bandit27-git is the same as for the user bandit27.

Clone the repository and find the password for the next level.

```

bandit27@bandit:/tmp/dean27/repo$ cd 
bandit27@bandit:~$ ls
bandit27@bandit:~$ mkdir /tmp/krishna
bandit27@bandit:~$ ls
bandit27@bandit:~$ cd /tmp/krishna
bandit27@bandit:/tmp/krishna$ ls
bandit27@bandit:/tmp/krishna$ git clone ssh://bandit27-git@localhost:2220/home/bandit27-git/repo
Cloning into 'repo'...
The authenticity of host '[localhost]:2220 ([127.0.0.1]:2220)' can't be established.
ED25519 key fingerprint is SHA256:C2ihUBV7ihnV1wUXRb4RrEcLfXC5CXlhmAAM/urerLY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes     
Could not create directory '/home/bandit27/.ssh' (Permission denied).
Failed to add the host to the list of known hosts (/home/bandit27/.ssh/known_hosts).
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-1
bandit27-git@localhost's password: 
remote: Enumerating objects: 3, done.
remote: Counting objects: 100% (3/3), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (3/3), done.
bandit27@bandit:/tmp/krishna$ ls
repo
bandit27@bandit:/tmp/krishna$ cd repo
bandit27@bandit:/tmp/krishna/repo$ ls
README
bandit27@bandit:/tmp/krishna/repo$ cat README 
The password to the next level is: Yz9IpL0sBcCeuG7m9uQFt8ZNpS4HZRcN

```
---
# Bandit Level 28 → Level 29
Level Goal

There is a git repository at ssh://bandit28-git@localhost/home/bandit28-git/repo via the port 2220. The password for the user bandit28-git is the same as for the user bandit28.

Clone the repository and find the password for the next level.
```
bandit28@bandit:~$ ls
bandit28@bandit:~$ cd /tmp
bandit28@bandit:/tmp$ ls
ls: cannot open directory '.': Permission denied
bandit28@bandit:/tmp$ mkdir krishna1
bandit28@bandit:/tmp$ cd krishna1
bandit28@bandit:/tmp/krishna1$ ls
bandit28@bandit:/tmp/krishna1$ git clone ssh://bandit28-git@localhost:2220/home/bandit28-git/repo
Cloning into 'repo'...
The authenticity of host '[localhost]:2220 ([127.0.0.1]:2220)' can't be established.
ED25519 key fingerprint is SHA256:C2ihUBV7ihnV1wUXRb4RrEcLfXC5CXlhmAAM/urerLY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Could not create directory '/home/bandit28/.ssh' (Permission denied).
Failed to add the host to the list of known hosts (/home/bandit28/.ssh/known_hosts).
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-1
bandit28-git@localhost's password: 
remote: Enumerating objects: 9, done.
remote: Counting objects: 100% (9/9), done.
remote: Compressing objects: 100% (6/6), done.
remote: Total 9 (delta 2), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (9/9), done.
Resolving deltas: 100% (2/2), done.
bandit28@bandit:/tmp/krishna1$ ls
repo
bandit28@bandit:/tmp/krishna1$ cd repo/
bandit28@bandit:/tmp/krishna1/repo$ ls
README.md
bandit28@bandit:/tmp/krishna1/repo$ cat README.md 
# Bandit Notes
Some notes for level29 of bandit.

## credentials

- username: bandit29
- password: xxxxxxxxxx

bandit28@bandit:/tmp/krishna1/repo$ ls -lhas
total 16K
4.0K drwxrwxr-x 3 bandit28 bandit28 4.0K Sep 23 17:35 .
4.0K drwxrwxr-x 3 bandit28 bandit28 4.0K Sep 23 17:34 ..
4.0K drwxrwxr-x 8 bandit28 bandit28 4.0K Sep 23 17:35 .git
4.0K -rw-rw-r-- 1 bandit28 bandit28  111 Sep 23 17:35 README.md
bandit28@bandit:/tmp/krishna1/repo$ cd .git
bandit28@bandit:/tmp/krishna1/repo/.git$ ls
branches  config  description  HEAD  hooks  index  info  logs  objects  packed-refs  refs
bandit28@bandit:/tmp/krishna1/repo/.git$ ls -lhas
total 52K
4.0K drwxrwxr-x 8 bandit28 bandit28 4.0K Sep 23 17:35 .
4.0K drwxrwxr-x 3 bandit28 bandit28 4.0K Sep 23 17:35 ..
4.0K drwxrwxr-x 2 bandit28 bandit28 4.0K Sep 23 17:34 branches
4.0K -rw-rw-r-- 1 bandit28 bandit28  281 Sep 23 17:35 config
4.0K -rw-rw-r-- 1 bandit28 bandit28   73 Sep 23 17:34 description
4.0K -rw-rw-r-- 1 bandit28 bandit28   23 Sep 23 17:35 HEAD
4.0K drwxrwxr-x 2 bandit28 bandit28 4.0K Sep 23 17:34 hooks
4.0K -rw-rw-r-- 1 bandit28 bandit28  137 Sep 23 17:35 index
4.0K drwxrwxr-x 2 bandit28 bandit28 4.0K Sep 23 17:34 info
4.0K drwxrwxr-x 3 bandit28 bandit28 4.0K Sep 23 17:35 logs
4.0K drwxrwxr-x 4 bandit28 bandit28 4.0K Sep 23 17:34 objects
4.0K -rw-rw-r-- 1 bandit28 bandit28  114 Sep 23 17:35 packed-refs
4.0K drwxrwxr-x 5 bandit28 bandit28 4.0K Sep 23 17:35 refs
bandit28@bandit:/tmp/krishna1/repo/.git$ grep -i password
^C
bandit28@bandit:/tmp/krishna1/repo/.git$ cat config 
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = ssh://bandit28-git@localhost:2220/home/bandit28-git/repo
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
bandit28@bandit:/tmp/krishna1/repo/.git$ cat description 
Unnamed repository; edit this file 'description' to name the repository.
bandit28@bandit:/tmp/krishna1/repo/.git$ cat HEAD 
ref: refs/heads/master
bandit28@bandit:/tmp/krishna1/repo/.git$ tree
Command 'tree' not found, but can be installed with:
snap install tree  # version 2.1.3+pkg-5852, or
apt  install tree  # version 2.1.1-2
See 'snap info tree' for additional versions.
bandit28@bandit:/tmp/krishna1/repo/.git$ cd 
bandit28@bandit:~$ cd /tmp/krishna1/repo/
bandit28@bandit:/tmp/krishna1/repo$ ls
README.md
bandit28@bandit:/tmp/krishna1/repo$ git log
commit 710c14a2e43cfd97041924403e00efb00b3a956e (HEAD -> master, origin/master, origin/HEAD)
Author: Morla Porla <morla@overthewire.org>
Date:   Fri Aug 15 13:16:10 2025 +0000

    fix info leak

commit 68314e012fbaa192abfc9b78ac369c82b75fab8f
Author: Morla Porla <morla@overthewire.org>
Date:   Fri Aug 15 13:16:10 2025 +0000

    add missing data

commit a158f9a82c29a16dcea474458a5ccf692a385cd4
Author: Ben Dover <noone@overthewire.org>
Date:   Fri Aug 15 13:16:10 2025 +0000

    initial commit of README.md
bandit28@bandit:/tmp/krishna1/repo$ git commit 710c14a2e43cfd97041924403e00efb00b3a956e
error: pathspec '710c14a2e43cfd97041924403e00efb00b3a956e' did not match any file(s) known to git
bandit28@bandit:/tmp/krishna1/repo$ git commit 710c14a2e43cfd97041924403e00efb00b3a956e
error: pathspec '710c14a2e43cfd97041924403e00efb00b3a956e' did not match any file(s) known to git
bandit28@bandit:/tmp/krishna1/repo$ git show 710c14a2e43cfd97041924403e00efb00b3a956e
commit 710c14a2e43cfd97041924403e00efb00b3a956e (HEAD -> master, origin/master, origin/HEAD)
Author: Morla Porla <morla@overthewire.org>
Date:   Fri Aug 15 13:16:10 2025 +0000

    fix info leak

diff --git a/README.md b/README.md
index d4e3b74..5c6457b 100644
--- a/README.md
+++ b/README.md
@@ -4,5 +4,5 @@ Some notes for level29 of bandit.
 ## credentials
 
 - username: bandit29
-- password: 4pT1t5DENaYuqnqvadYs1oE4QLCdjmJ7
+- password: xxxxxxxxxx

```
# Bandit Level 29 → Level 30
Level Goal

There is a git repository at ssh://bandit29-git@localhost/home/bandit29-git/repo via the port 2220. The password for the user bandit29-git is the same as for the user bandit29.

Clone the repository and find the password for the next level. 

```
bandit29@bandit:~$ mkdir /tmp/krishna2
bandit29@bandit:~$ ls 
bandit29@bandit:~$ cd  /tmp/krishna2
bandit29@bandit:/tmp/krishna2$ ls
bandit29@bandit:/tmp/krishna2$ ssh://bandit29-git@localhost:2220/home/bandit29-git/repo
-bash: ssh://bandit29-git@localhost:2220/home/bandit29-git/repo: No such file or directory
bandit29@bandit:/tmp/krishna2$ git clone ssh://bandit29-git@localhost:2220/home/bandit29-git/repo
Cloning into 'repo'...
The authenticity of host '[localhost]:2220 ([127.0.0.1]:2220)' can't be established.
ED25519 key fingerprint is SHA256:C2ihUBV7ihnV1wUXRb4RrEcLfXC5CXlhmAAM/urerLY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Could not create directory '/home/bandit29/.ssh' (Permission denied).
Failed to add the host to the list of known hosts (/home/bandit29/.ssh/known_hosts).
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-1

bandit29-git@localhost's password: 
remote: Enumerating objects: 16, done.
remote: Counting objects: 100% (16/16), done.
remote: Compressing objects: 100% (11/11), done.
remote: Total 16 (delta 2), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (16/16), done.
Resolving deltas: 100% (2/2), done.
bandit29@bandit:/tmp/krishna2$ ls
repo

bandit29@bandit:/tmp/krishna2$ cd repo

bandit29@bandit:/tmp/krishna2/repo$ ls

README.md
bandit29@bandit:/tmp/krishna2/repo$ cat README.md

# Bandit Notes
Some notes for bandit30 of bandit.

## credentials

- username: bandit30
- password: <no passwords in production!>

bandit29@bandit:/tmp/krishna2/repo$ ls -lhas
total 16K
4.0K drwxrwxr-x 3 bandit29 bandit29 4.0K Sep 23 17:45 .
4.0K drwxrwxr-x 3 bandit29 bandit29 4.0K Sep 23 17:45 ..
4.0K drwxrwxr-x 8 bandit29 bandit29 4.0K Sep 23 17:45 .git
4.0K -rw-rw-r-- 1 bandit29 bandit29  131 Sep 23 17:45 README.md

bandit29@bandit:/tmp/krishna2/repo$ cd .git

bandit29@bandit:/tmp/krishna2/repo/.git$ ls
branches  config  description  HEAD  hooks  index  info  logs  objects  packed-refs  refs

bandit29@bandit:/tmp/krishna2/repo/.git$ cat *
cat: branches: Is a directory
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
[remote "origin"]
	url = ssh://bandit29-git@localhost:2220/home/bandit29-git/repo
	fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
	remote = origin
	merge = refs/heads/master
Unnamed repository; edit this file 'description' to name the repository.
ref: refs/heads/master
cat: hooks: Is a directory
DIRCh���
�oh���
�o��++���?�n��_�����	README.mdTREE1 0
+^Y-
�ikIٝ��'�V2Kb;��t�B��EIFy�*}֙�mcat: info: Is a directory
cat: logs: Is a directory
cat: objects: Is a directory
# pack-refs with: peeled fully-peeled sorted 
d9fa2d0412351c7fa4302313c61f965dbe3b78fc refs/remotes/origin/dev
873b7f66c519fabdfcbdde431d75921d2cea369d refs/remotes/origin/master
1cd92d39ebcce3cbea6c94798964e8d3e270d449 refs/remotes/origin/sploits-dev
cat: refs: Is a directory

bandit29@bandit:/tmp/krishna2/repo$ git show *
commit 873b7f66c519fabdfcbdde431d75921d2cea369d (HEAD -> master, origin/master, origin/HEAD)
Author: Ben Dover <noone@overthewire.org>
Date:   Fri Aug 15 13:16:12 2025 +0000

    fix username

diff --git a/README.md b/README.md
index 2da2f39..1af21d3 100644
--- a/README.md
+++ b/README.md
@@ -3,6 +3,6 @@ Some notes for bandit30 of bandit.
 
 ## credentials
 
-- username: bandit29
+- username: bandit30
 - password: <no passwords in production!>


bandit29@bandit:/tmp/krishna2/repo$ git checkout 
dev                  master               origin/HEAD          origin/sploits-dev   
HEAD                 origin/dev           origin/master        sploits-dev          
bandit29@bandit:/tmp/krishna2/repo$ git checkout dev
branch 'dev' set up to track 'origin/dev'.
Switched to a new branch 'dev'
bandit29@bandit:/tmp/krishna2/repo$ ls
code  README.md
bandit29@bandit:/tmp/krishna2/repo$ cat README.md 
# Bandit Notes
Some notes for bandit30 of bandit.

## credentials

- username: bandit30
- password: qp30ex3VLz5MDG1n91YowTv4Q8l7CDZL

bandit29@bandit:/tmp/krishna2/repo$ cd code/
bandit29@bandit:/tmp/krishna2/repo/code$ ls
gif2ascii.py
bandit29@bandit:/tmp/krishna2/repo/code$ cat gif2ascii.py
not things for you 

```
---

# Bandit Level 30 → Level 31
Level Goal

There is a git repository at ssh://bandit30-git@localhost/home/bandit30-git/repo via the port 2220. The password for the user bandit30-git is the same as for the user bandit30.

```
bandit30@bandit:~$ ls
bandit30@bandit:~$ cd /tmp/krishna2
-bash: cd: /tmp/krishna2: No such file or directory
bandit30@bandit:~$ mkdir /tmp/krishna2
bandit30@bandit:~$ cd /tmp/krishna2
bandit30@bandit:/tmp/krishna2$ ls
bandit30@bandit:/tmp/krishna2$ ls -lahs
total 1.3M
4.0K drwxrwxr-x    2 bandit30 bandit30 4.0K Sep 23 18:16 .
1.3M drwxrwx-wt 6740 root     root     1.3M Sep 23 18:17 ..
bandit30@bandit:/tmp/krishna2$ git clone ssh://bandit30-git@localhost:2220/home/bandit30-git/repo
Cloning into 'repo'...
The authenticity of host '[localhost]:2220 ([127.0.0.1]:2220)' can't be established.
ED25519 key fingerprint is SHA256:C2ihUBV7ihnV1wUXRb4RrEcLfXC5CXlhmAAM/urerLY.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Could not create directory '/home/bandit30/.ssh' (Permission denied).
Failed to add the host to the list of known hosts (/home/bandit30/.ssh/known_hosts).
                         _                     _ _ _   
                        | |__   __ _ _ __   __| (_) |_ 
                        | '_ \ / _` | '_ \ / _` | | __|
                        | |_) | (_| | | | | (_| | | |_ 
                        |_.__/ \__,_|_| |_|\__,_|_|\__|
                                                       

                      This is an OverTheWire game server. 
            More information on http://www.overthewire.org/wargames

backend: gibson-1
bandit30-git@localhost's password: 
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
Receiving objects: 100% (4/4), done.
bandit30@bandit:/tmp/krishna2$ ls
repo
bandit30@bandit:/tmp/krishna2$ cd repo/
bandit30@bandit:/tmp/krishna2/repo$ ls
README.md
bandit30@bandit:/tmp/krishna2/repo$ ls -lhas
total 16K
4.0K drwxrwxr-x 3 bandit30 bandit30 4.0K Sep 23 18:18 .
4.0K drwxrwxr-x 3 bandit30 bandit30 4.0K Sep 23 18:18 ..
4.0K drwxrwxr-x 8 bandit30 bandit30 4.0K Sep 23 18:18 .git
4.0K -rw-rw-r-- 1 bandit30 bandit30   30 Sep 23 18:18 README.md
bandit30@bandit:/tmp/krishna2/repo$ cd R
-bash: cd: R: No such file or directory
bandit30@bandit:/tmp/krishna2/repo$ cat README.md 
just an epmty file... muahaha
bandit30@bandit:/tmp/krishna2/repo$ ls -lhas
total 16K
4.0K drwxrwxr-x 3 bandit30 bandit30 4.0K Sep 23 18:18 .
4.0K drwxrwxr-x 3 bandit30 bandit30 4.0K Sep 23 18:18 ..
4.0K drwxrwxr-x 8 bandit30 bandit30 4.0K Sep 23 18:18 .git
4.0K -rw-rw-r-- 1 bandit30 bandit30   30 Sep 23 18:18 README.md
bandit30@bandit:/tmp/krishna2/repo$ git checkout 
HEAD            master          origin/HEAD     origin/master   secret          
bandit30@bandit:/tmp/krishna2/repo$ git checkout secret 
fatal: reference is not a tree: secret
bandit30@bandit:/tmp/krishna2/repo$ git log
commit de654f201881f820c364f176ffcdea2876431bee (HEAD -> master, origin/master, origin/HEAD)
Author: Ben Dover <noone@overthewire.org>
Date:   Fri Aug 15 13:16:14 2025 +0000

    initial commit of README.md
bandit30@bandit:/tmp/krishna2/repo$ git status
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
bandit30@bandit:/tmp/krishna2/repo$ git init
Reinitialized existing Git repository in /tmp/krishna2/repo/.git/
bandit30@bandit:/tmp/krishna2/repo$ ls
README.md
bandit30@bandit:/tmp/krishna2/repo$ tag secret
Command 'tag' not found, but there are 16 similar ones.
bandit30@bandit:/tmp/krishna2/repo$ git tag secret
fatal: tag 'secret' already exists
bandit30@bandit:/tmp/krishna2/repo$ git show secret
fb5S2xb7bRyFmAvQYQGEqsbhVyJqhnDy
```

#  Bandit Level 31 → Level 32
Level Goal

There is a git repository at ssh://bandit31-git@localhost/home/bandit31-git/repo via the port 2220. The password for the user bandit31-git is the same as for the user bandit31.

Clone the repository and find the password for the next level.
```



```
# Bandit Level 32 → Level 33
Level Goal

After all this git stuff, it’s time for another escape. Good luck!
```
WELCOME TO THE UPPERCASE SHELL
>> ls
sh: 1: LS: Permission denied
>> \ls
sh: 1: LS: Permission denied
>> LS
sh: 1: LS: Permission denied
>> exit
sh: 1: EXIT: Permission denied
>> logout
sh: 1: LOGOUT: Permission denied
>> 0
sh: 1: 0: Permission denied
>> $
sh: 1: $: Permission denied
>> $shell
WELCOME TO THE UPPERCASE SHELL
>> $exit
>> $ls
>> $(pwd)
sh: 1: PWD: Permission denied
>> $env
$printenv>> 
>> $env    
>> ls
sh: 1: LS: Permission denied
>> $0

$ ls
uppershell
$ ls -lhas
total 36K
4.0K drwxr-xr-x   2 root     root     4.0K Aug 15 13:16 .
4.0K drwxr-xr-x 150 root     root     4.0K Aug 15 13:18 ..
4.0K -rw-r--r--   1 root     root      220 Mar 31  2024 .bash_logout
4.0K -rw-r--r--   1 root     root     3.8K Aug 15 13:09 .bashrc
4.0K -rw-r--r--   1 root     root      807 Mar 31  2024 .profile
 16K -rwsr-x---   1 bandit33 bandit32  15K Aug 15 13:16 uppershell
$ cat uppershell
ELF4�64 
        (444``��� /�����DDP�td, ,,,,Q�tdR�td//lib/ld-linux.so.2GNU0cH{#ע[dı�X���GNU
                                                                                   �( 
                                                                                      �K��gUa4F&^-� !UM@_IO_stdin_usedfg����@�inputsexitfflushsystem__libc_start_mainprintftouppersetreuidgeteuidlibc.so.6GLIBC_2.0GLIBC_2.34__gmon_start__fii
�        �
$�
                                l��� 0h���F
                                                                J
                                                                 tx?�;*2$"$T
D��
 IuBuxu|��f
�����o��   �
�
8J0V�O_0f�l~(��� ��,���H�GCC: (Ubuntu 13.3.0-6ubuntu2~24.04) 13.3.0 ��
    crt1.o__abi_tag__wrap_maincrtstuff.cderegister_tm_clones__do_global_dtors_auxcompleted.0__do_global_dtors_aux_fini_array_entryframe_dummy__frame_dummy_init_array_entryupper.c__FRAME_END___DYNAMIC__GNU_EH_FRAME_HDR_GLOBAL_OFFSET_TABLE___libc_start_main@GLIBC_2.34__x86.get_pc_thunk.bxprintf@GLIBC_2.0fflush@GLIBC_2.0fgets@GLIBC_2.0_edata_finigeteuid@GLIBC_2.0__data_startputs@GLIBC_2.0system@GLIBC_2.0__gmon_start__exit@GLIBC_2.0__dso_handle_IO_stdin_usedsetreuid@GLIBC_2.0stdin@GLIBC_2.0_end_dl_relocate_static_pie_fp_hw__bss_starttoupper@GLIBC_2.0__TMC_END___init.symtab.strtab.shstrtab.interp.note.gnu.build-id.note.ABI-tag.gnu.hash.dynsym.dynstr.gnu.version.gnu.version_r.rel.dyn.rel.plt.init.text.fini.rodata.eh_frame_hdr.eh_frame.init_array.fini_array.dynamic.got.got.plt.data.bss.comment�#��$� D���o�$N
                                                                                            �V���^���o��k���o��0z     �B��� �  ���#���� +�,, ,�XX ��/�/��/���/4�((@0 �000+\0�	3\�5$ file uppershell
uppershell: setuid ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, BuildID[sha1]=306348187b23d7a25b64c4b18058180fe4cbc81e, for GNU/Linux 3.2.0, not stripped

$ ./uppershell cat /etc/bandit_pass/bandit33
WELCOME TO THE UPPERCASE SHELL
>> $0
$ cat /etc/bandit_pass/bandit33
tQdtbs5D5i2vJwkO8mEyYEyTL8izoeJ0

$ bash
bandit33@bandit:~$ cat /etc/bandit_pass/bandit33
tQdtbs5D5i2vJwkO8mEyYEyTL8izoeJ0
bandit33@bandit:~$

```

---
# Bandit Level 33 → Level 34

At this moment, level 34 does not exist yet
```

bandit33@bandit:~$ ls
README.txt
bandit33@bandit:~$ cat README.txt 
Congratulations on solving the last level of this game!

At this moment, there are no more levels to play in this game. However, we are constantly working
on new levels and will most likely expand this game with more levels soon.
Keep an eye out for an announcement on our usual communication channels!
In the meantime, you could play some of our other wargames.

If you have an idea for an awesome new level, please let us know!
bandit33@bandit:~$

```
