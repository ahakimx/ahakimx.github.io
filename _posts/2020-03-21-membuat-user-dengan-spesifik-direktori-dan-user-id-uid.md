---
layout: post
title: Membuat User dengan Spesifik Home Direktori dan User ID (UID)
date: 2020-03-22T06:00:00.000+00:00
categories: linux
comments: 'true'
categorie:
- linux

---
Kali ini kita akan membuat user dengan nama yousuf, kemudian kita akan mengeset `UID` nya menjadi `1656` dan home direktorinya di `/var/www/yousuf`

1. Buat terlebih dahulu direktori `/var/www/yousuf`

       mkdir -p /var/www/yousuf
2. Kemudian buat user yousuf

       useradd -m -u 1656 -d /var/www/yousuf
3. Kemudian verifikasi user yousuf dengan home direktori dan UID yang telah di buat sebelumnya.

       cat /etc/passwd | grep yousuf
       yousuf:x:1656:1656::/var/www/yousuf/:/bin/bash