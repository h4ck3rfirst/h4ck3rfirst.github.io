---
title: Bloodhound CE in kali linux 
description: Guide for BloodHound Community Edition without docker complete installation on kali linux 
date: 2025-07-28
categories: [Learning]
tags: [kali, Bloodhound, docker, without, AD, Active Directory, neo4j, server, sudo, apt, Sharphound, azurehound, os , window, linux, CE, python3, SpecterOps, BloodHound Enterprise, Collector ]
author: h4ck3rfirst
---

# BloodHound Installation Guide

Multiple guides and methods can help you set up and install BloodHound on your host machine with docker. We’ll follow the official documentation from BloodHound’s GitHub while refining the process and try to install without docker.

Before moving install any tool on your Linux machine, make sure to **update and upgrade** your software packages

```bash
sudo apt update && sudo apt upgrade
```
Also, if Java isn’t already installed, install it to proceed.

```bash
sudo apt install openjdk-21-j*

```
BloodHound’s configuration involves three steps: the BloodHound GUI, a data collector (ingestor), and the Neo4j database.

## Install BloodHound GUI and Neo4j

```bash
sudo apt update
sudo apt install bloodhound
```
This command also installs Neo4j as a dependency. If it doesn't, install it manually:
```bash
sudo apt install neo4j
```
### Setting Up Neo4j Remote Access
Start the Neo4j console to enable the web interface (runs on port 7474 by default):

```bash
sudo neo4j console
```

### Open the displayed URL (usually http://localhost:7474) in a web browser.

Log in with default credentials (username: neo4j, password: neo4j).

You will be prompted to change the password on first login.

Set a new password of your choice.

You will see the Dashboard

then Edit ```/etc/bhapi/bhapi.json``` this configuaration file which stored the neo4j server's login and password 

```bash
sudo nano /etc/bhapi/bhapi.json
```
```bash
  GNU nano 8.7 /etc/bhapi/bhapi.json                                                                       
{
  "database": {
    "addr": "localhost:5432",
    "username": "_bloodhound",
    "secret": "bloodhound",
    "database": "bloodhound"
  },
  "neo4j": {
    "addr": "localhost:7687",
    "username": "neo4j",
    "secret": "Your new password"
  },
  "default_admin": {
    "principal_name": "admin",
    "password": "admin",
    "first_name": "Bloodhound",
    "last_name": "Kali"
  }
}


```
save it using control + o then enter 

control + x

### Running BloodHound GUI

On a new terminal Launch BloodHound:
```bash
bloodhound
```

you will see the 
```bash
─(kali㉿kali)-[~]
└─$ bloodhound 
[sudo] password for kali: 

 Starting neo4j
Directories in use:
home:         /usr/share/neo4j
config:       /usr/share/neo4j/conf
logs:         /etc/neo4j/logs
plugins:      /usr/share/neo4j/plugins
import:       /usr/share/neo4j/import
data:         /etc/neo4j/data
certificates: /usr/share/neo4j/certificates
licenses:     /usr/share/neo4j/licenses
run:          /var/lib/neo4j/run
Starting Neo4j.
Started neo4j  . It is available at http://localhost:7474
There may be a short delay until the server is ready.
.........................................................................................................
 Bloodhound will start

 IMPORTANT: It will take time, please wait...

{"time":"2025-12-12T02:29:58.290030412-05:00","level":"INFO","message":"Reading configuration found at /etc/bhapi/bhapi.json"}
{"time":"2025-12-12T02:29:58.290652098-05:00","level":"INFO","message":"Logging configured","log_level":"INFO"}
{"time":"2025-12-12T02:29:58.419111375-05:00","level":"INFO","message":"No database driver has been set for migration, using: neo4j"}
{"time":"2025-12-12T02:29:58.419334435-05:00","level":"INFO","message":"Connecting to graph using Neo4j"}
{"time":"2025-12-12T02:29:58.419654036-05:00","level":"INFO","message":"Starting daemon Tools API"}
{"time":"2025-12-12T02:29:58.490023535-05:00","level":"INFO","message":"No new SQL migrations to run"}
{"time":"2025-12-12T02:30:02.749624528-05:00","level":"ERROR","message":"Error generating AzureHound manifest file: error reading downloads directory /etc/bloodhound/collectors/azurehound: open /etc/bloodhound/collectors/azurehound: no such file or directory"}
{"time":"2025-12-12T02:30:02.749717759-05:00","level":"ERROR","message":"Error generating SharpHound manifest file: error reading downloads directory /etc/bloodhound/collectors/sharphound: open /etc/bloodhound/collectors/sharphound: no such file or directory"}
{"time":"2025-12-12T02:30:02.777034571-05:00","level":"INFO","message":"Analysis requested by init"}
{"time":"2025-12-12T02:30:02.80513329-05:00","level":"INFO","message":"Starting daemon API Daemon"}
{"time":"2025-12-12T02:30:02.805277954-05:00","level":"INFO","message":"Starting daemon Data Pruning Daemon"}
{"time":"2025-12-12T02:30:02.805497749-05:00","level":"INFO","message":"Starting daemon Changelog Daemon"}
{"time":"2025-12-12T02:30:02.806702691-05:00","level":"INFO","message":"Starting daemon Data Pipe Daemon"}
{"time":"2025-12-12T02:30:02.806750827-05:00","level":"INFO","message":"Server started successfully"}
{"time":"2025-12-12T02:30:02.826974906-05:00","level":"INFO","message":"Running OrphanFileSweeper for path /var/lib/bhe/work/tmp"}
{"time":"2025-12-12T02:30:02.885258663-05:00","level":"INFO","message":"Graph Analysis","measurement_id":1}
{"time":"2025-12-12T02:30:03.226179403-05:00","level":"INFO","message":"GET /","proto":"HTTP/1.1","referer":"","user_agent":"curl/8.17.0","request_bytes":0,"response_bytes":38,"status":301,"elapsed":0.800848,"request_id":"67286ab5-e028-400e-b195-ef473534d000","request_ip":"127.0.0.1","remote_addr":"127.0.0.1:59396"}

 opening http://127.0.0.1:8080
                                
```
## Bloodhound setup

Open the displayed URL (usually http://localhost:8080) in a web browser.

You will be prompted to change the password on first login.

Log in with default credentials (username: admin, password: admin). Or the password is give on terminal after start of bloodhound check their.

After login Set a new password of your choice.

You will see the Dashboard


## Extra things or Troubles

If you change your ne04j password.

After login. At dashboard their is a feature like terminal/console. Enter this command 
```bash
ALTER USER neo4j SET PASSWORD '<new-password>'
```
Successfully password changed