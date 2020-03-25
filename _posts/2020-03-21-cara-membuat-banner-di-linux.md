---
layout: post
title: Cara Membuat Banner di Linux
date: 2020-03-21 17:00:00 +0000
categories: linux

---
Kali ini kita akan membuat banner di linux

Langkah-langkahnya yaitu:

1. Buat file banner di `etc/motd`

       #####################################
       Ini adalah contoh banner
       #####################################
2. Edit configurasi di file `/etc/ssh/ssh_config`

       $ vi /etc/ssh/ssh_config
       ...
       Banner /etc/motd
       ...
       
3. Kemudian restart service sshd

       $ systemctl restart sshd
4. Kemudian coba login ke server tersebut

       $ ssh alex@192.168.10.10
       
       Last login: Sun Mar 22 11:31:37 2020 from jump_host.linuxbanner_db_net
       #####################################
       Ini adalah contoh banner
       #####################################
       