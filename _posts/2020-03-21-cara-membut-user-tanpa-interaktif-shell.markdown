---
layout: post
title: Cara Membuat User tanpa Interaktif Shell di Linux
date: 2020-03-21 07:00:00 +0000
categories: linux

---
Kali ini kita akan membuat sebuah user baru tanpa interaktif shell pada linux

    sudo adduser -r -s /sbin/nologin siva

Kemudian verifikasi:

    $ sudo cat /etc/passwd /etc/shadow | grep siva
    siva:x:1002:1002::/home/siva:/sbin/nologin
    siva:!!:18342:0:99999:7:::
    