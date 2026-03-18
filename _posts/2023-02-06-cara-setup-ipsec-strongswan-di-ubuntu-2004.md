---
layout: post
title: "Cara Setup IPSec Strongswan di Ubuntu 20.04"
date: 2023-02-06 19:02:31 +0000
categories: []
tags: [vpn, ipsec]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/SjAlldS_6r8/upload/bd739102582be8f512678b1d9cc080be.jpeg
  alt: "Cara Setup IPSec Strongswan di Ubuntu 20.04"
comments: true
---

## Kebutuhan:

| Nama node | IP publik | IP private | Subnet |
| --- | --- | --- | --- |
| node1 | 34.229.xx.xx | 172.31.34.3 | 172.31.34.3/16 |
| node2 | 54.196.xx.xx | 10.16.49.219 | 10.16.49.219/16 |

Pastikan firewall sudah terbuka untuk port `500` dan `4500` pada protocol UDP.

## Setup:

### Lakukan di kedua node

1. Install strongswan
    

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install strongswan -y
```

1. Lihat status ipsec, pastikan running.
    

```bash
sudo systemctl status ipsec
```

1. Setup forwarding
    

```bash
sudo vim /etc/sysctl.conf
...
net.ipv4.ip_forward = 1 
net.ipv6.conf.all.forwarding = 1 
net.ipv4.conf.all.accept_redirects = 0 
net.ipv4.conf.all.send_redirects = 0
...
```

1. Load perubahan
    

```bash
$ sudo sysctl -p
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
```

### Setting IPSec di node1

1. Tambahkan konfigurasi ipsec pada file `/etc/ipsec.conf`
    

```bash
sudo vi /etc/ipsec.conf
...
config setup
        charondebug="all"
        uniqueids=yes

# Sample VPN connections
conn node1-to-node2
        type=tunnel
        auto=start
        keyexchange=ikev2
        authby=secret
        left=%defaultroute
        leftid=34.229.xx.xx
        leftsubnet=172.31.34.3/16
        right=54.196.xx.xx
        rightsubnet=10.16.49.219/16
        ike=aes256-sha1-modp1024!
        esp=aes256-sha1!
        aggressive=no
        keyingtries=%forever
        ikelifetime=28800s
        lifetime=3600s
        dpddelay=30s
        dpdtimeout=120s
        dpdaction=restart
...
```

1. Konfigurasi PSK untuk Peer-to-Peer Authentication
    

```bash
$ head -c 24 /dev/urandom | base64
kU9tF2ClzAKI9V8d+YJwJlAlOP0cgTkF
```

1. Tambahkan PSK ke file `/etc/ipsec.secrets`
    

```bash
$ sudo vi /etc/ipsec.secrets
...
# <IP Publik node1> <IP Publik node2> : PSK "secret"

34.229.xx.xx 54.196.xx.xx : PSK "kU9tF2ClzAKI9V8d+YJwJlAlOP0cgTkF"
...
```

1. Restart IPSec
    

```bash
$ sudo ipsec restart
Stopping strongSwan IPsec...
Starting strongSwan 5.9.5 IPsec [starter]...
```

1. Lihat status IPSec
    

```bash
$ sudo ipsec status
Security Associations (1 up, 0 connecting):
node1-to-node2[1]: ESTABLISHED 26 minutes ago, 172.31.34.3[34.229.40.23]...54.196.39.43[54.196.39.43]
node1-to-node2{1}:  INSTALLED, TUNNEL, reqid 1, ESP in UDP SPIs: cb558209_i ce392e5f_o
node1-to-node2{1}:   172.31.0.0/16 === 10.16.0.0/16
```

Pada status diatas terlihat bahwa ipsec sudah **ESTABLISHED**, yang mana koneksi ipsec dari node1 ke node2 sudah tersambung.

### Setting IPSec di node2

1. Tambahkan konfigurasi ipsec pada file `/etc/ipsec.conf`
    

```bash
$ ssh node2
$ sudo vi /etc/ipsec.conf
...
config setup
        charondebug="all"
        uniqueids=yes

# Sample VPN connections
conn node2-to-node1
        type=tunnel
        auto=start
        keyexchange=ikev2
        authby=secret
        left=%defaultroute
        leftid=54.196.xx.xx
        leftsubnet=10.16.49.219/16
        right=34.229.xx.xx
        rightsubnet=172.31.34.3/16
        ike=aes256-sha1-modp1024!
        esp=aes256-sha1!
        aggressive=no
        keyingtries=%forever
        ikelifetime=28800s
        lifetime=3600s
        dpddelay=30s
        dpdtimeout=120s
        dpdaction=restart
```

1. Konfigurasi PSK untuk Peer-to-Peer Authentication
    

```bash
$ head -c 24 /dev/urandom | base64
kU9tF2ClzAKI9V8d+YJwJlAlOP0cgTkF
```

1. Tambahkan PSK ke file `/etc/ipsec.secrets`
    

```bash
$ sudo vi /etc/ipsec.secrets
...
# <IP Publik node1> <IP Publik node2> : PSK "secret"

54.196.39.43 34.229.40.23 : PSK "kU9tF2ClzAKI9V8d+YJwJlAlOP0cgTkF"
...
```

1. Restart IPSec
    

```bash
$ sudo ipsec restart
Stopping strongSwan IPsec...
Starting strongSwan 5.9.5 IPsec [starter]...
```

1. Lihat status IPSec
    

```bash
$ sudo ipsec status
Security Associations (1 up, 0 connecting):
node2-to-node1[2]: ESTABLISHED 9 seconds ago, 10.16.49.219[54.196.39.43]...34.229.40.23[34.229.40.23]
node2-to-node1{1}:  INSTALLED, TUNNEL, reqid 1, ESP in UDP SPIs: ce392e5f_i cb558209_o
node2-to-node1{1}:   10.16.0.0/16 === 172.31.0.0/16
```

Pada status diatas terlihat bahwa ipsec sudah established, yang mana koneksi ipsec sudah tersambung.

### Verifikasi dengan ping kedua node

1. ping dari node1 ke node2
    

```bash
$ date; ping 10.16.49.219
Sat Feb  4 16:58:57 UTC 2023
PING 10.16.49.219 (10.16.49.219) 56(84) bytes of data.
64 bytes from 10.16.49.219: icmp_seq=1 ttl=64 time=0.681 ms
64 bytes from 10.16.49.219: icmp_seq=2 ttl=64 time=0.658 ms
64 bytes from 10.16.49.219: icmp_seq=3 ttl=64 time=0.714 ms
64 bytes from 10.16.49.219: icmp_seq=4 ttl=64 time=0.671 ms
64 bytes from 10.16.49.219: icmp_seq=5 ttl=64 time=0.723 ms
^C
--- 10.16.49.219 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4082ms
rtt min/avg/max/mdev = 0.658/0.689/0.723/0.025 ms
```

1. Ping dari node2 ke node1
    

```bash
$ ping 172.31.34.3
PING 172.31.34.3 (172.31.34.3) 56(84) bytes of data.
64 bytes from 172.31.34.3: icmp_seq=1 ttl=64 time=0.733 ms
64 bytes from 172.31.34.3: icmp_seq=2 ttl=64 time=0.730 ms
64 bytes from 172.31.34.3: icmp_seq=3 ttl=64 time=0.719 ms
64 bytes from 172.31.34.3: icmp_seq=4 ttl=64 time=1.46 ms
64 bytes from 172.31.34.3: icmp_seq=5 ttl=64 time=0.982 ms
64 bytes from 172.31.34.3: icmp_seq=6 ttl=64 time=0.753 ms
64 bytes from 172.31.34.3: icmp_seq=7 ttl=64 time=0.806 ms
64 bytes from 172.31.34.3: icmp_seq=8 ttl=64 time=0.730 ms
^C
--- 172.31.34.3 ping statistics ---
8 packets transmitted, 8 received, 0% packet loss, time 7070ms
rtt min/avg/max/mdev = 0.719/0.864/1.464/0.240 ms
```

Jika ping telah berhasil maka koneksi tunnel IPSec telah berhasil.

### Troubleshoot:

Jika mengalami kendala pada instalasi bisa melakukan pengecekan pada file konfigurasi dan melihat detail log di file `tail -f /var/log/syslog | grep charon` seperti berikut:

```bash
tail -f /var/log/syslog | grep charon
```

Terima kasih.

### Referensi:

[How to Set Up IPsec-based VPN with Strongswan on Debian and Ubuntu](https://www.tecmint.com/setup-ipsec-vpn-with-strongswan-on-debian-ubuntu/)

[https://docs.strongswan.org/docs/5.9/index.html](https://docs.strongswan.org/docs/5.9/index.html)
