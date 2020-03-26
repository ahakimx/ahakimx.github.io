---
categorie:
- linux
layout: post
title: Membuka Port Menggunakan Firewalld Linux
date: 2020-03-25 05:01:00 +0000
comments: 'true'
categories:
- linux
- firewall

---
**`Octopus`** system admins team just deployed a web UI application for their backup utility running on **`Octopus backup server`** in **`SC Datacenter`**. The application is running on port **`6400`** . They have **`firewalld`** installed on that server. Some requirements have came up as mentioned below:

Open all incoming connection on **`6400/tcp`** port. Zone should be **`public`**.

Pada kasus diatas kita di suruh untuk membuka sebuah port 6400/tcp pada sebuah server backup storage dengan zone public.

Maka langkah -langkah yang akan kita lakukan adalah :

1. Masuk dahulu ke server backup storage

       ssh alex@172.16.10.10
2. Cek firewalld pada server backup

       systemctl status firewalld
       ● firewalld.service - firewalld - dynamic firewall daemon
          Loaded: loaded (/usr/lib/systemd/system/firewalld.service; enabled; vendor preset: enabled)
          Active: active (running) since Wed 2020-03-25 04:53:09 UTC; 15min ago
            Docs: man:firewalld(1)
        Main PID: 24 (firewalld)
          CGroup: /docker/9e72dcf0b4e914317520145a319b5715a306b3379723337a3e55cf3029227e16/system.slice/firewalld.service
                  └─24 /usr/bin/python2 -Es /usr/sbin/firewalld --nofork --nopid
       
       Mar 25 04:53:07 stbkp01 systemd[24]: Executing: /usr/sbin/firewalld --nofork --nopid
       Mar 25 04:53:09 stbkp01 systemd[1]: firewalld.service's D-Bus name org.fedoraproje...1.1
       Mar 25 04:53:09 stbkp01 systemd[1]: firewalld.service changed start -> running
       Mar 25 04:53:09 stbkp01 systemd[1]: Job firewalld.service/start finished, result=done
       Mar 25 04:53:09 stbkp01 systemd[1]: Started firewalld - dynamic firewall daemon.
       Mar 25 04:53:19 stbkp01 firewalld[24]: WARNING: ebtables not usable, disabling ethe...l.
       Mar 25 04:53:30 stbkp01 systemd[1]: Trying to enqueue job firewalld.service/start/...ace
       Mar 25 04:53:30 stbkp01 systemd[1]: Installed new job firewalld.service/start as 96
       Mar 25 04:53:30 stbkp01 systemd[1]: Enqueued job firewalld.service/start as 96
       Mar 25 04:53:30 stbkp01 systemd[1]: Job firewalld.service/start finished, result=done
       Hint: Some lines were ellipsized, use -l to show in full.
3. Mengecek port berapa saja yang sudah terbuka

       firewall-cmd --list-port

   Hasilnya kosong, karena belum ada port yang terbuka
4. Sekarang kita buka port 6400 pada zone public tanpa membuatnya permanent.

       $ firewall-cmd --zone=public --add-port=6400/tcp
       success
5. Kemudian cek list port yang sudah dibuka

       firewall-cmd --list-port
       6400/tcp

   Maka hasilnya adalah port 6400 telah terbuka .