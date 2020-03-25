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

       vi /etc/ssh/ssh_config
       ...
       Banner /etc/motd
       ...
       systemctl restart sshd
3. Kemudian coba login ke server tersebut

       Last login: Sun Mar 22 11:31:37 2020 from jump_host.linuxbanner_db_net
       #####################################
       Ini adalah contoh banner
       #####################################