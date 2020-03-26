---
categories:
- linux
- mariadb
- reset password
layout: post
title: Cara Reset Password Root di MariaDB Linux
date: 2018-04-25 05:01:00 +0000
comments: 'true'

---
1. Matikan service mysql

       $ sudo /etc/init.d/mysql stop
2. Jalankan safe mode di mariadb untuk masuk kedalam database tanpa menggunakan password

       $ sudo mysqld_safe --skip-grant-tables &
       

       [1] 24361 
       $180426 10:20:56 mysqld_safe Logging to syslog.
       180426 10:20:57 mysqld_safe Starting mysqld daemon with databases from /var/lib/mysql 
3. Jalankan mariadb

       $ mysql -u root
       Welcome to the MariaDB monitor.  Commands end with ; or \g.
       Your MariaDB connection id is 1
       Server version: 5.5.33a-MariaDB MariaDB Server
       
       Copyright (c) 2000, 2013, Oracle, Monty Program Ab and others.
       
       Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
       MariaDB >
4. Reset password mariadb

       MariaDB [(none)]> use mysql;
       Reading table information for completion of table and column names
       You can turn off this feature to get a quicker startup with -A
       Database changed
       
       MariaDB [mysql]> update user set password=PASSWORD("new_password;") where User='root';
       Query OK, 1 row affected (0.01 sec)
       Rows matched: 1  Changed: 1  Warnings: 0
       
       MariaDB [mysql]> flush privileges;
       Query OK, 0 rows affected (0.00 sec)
       
       MariaDB [mysql]> quit
       Bye
5. Restart mariadb

       $ sudo /etc/init.d/mysql restart
       

   Selesai. Sekarang coba masuk kedalam mariadb menggunakan password yang baru kita ubah tadi

       # mysql -u root -p
       Enter password: 
       Welcome to the MariaDB monitor.  Commands end with ; or \g.
       Your MariaDB connection id is 4
       Server version: 10.1.29-MariaDB-6 Debian buildd-unstable
       
       Copyright (c) 2000, 2017, Oracle, MariaDB Corporation Ab and others.
       
       Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
       
       MariaDB [(none)]>

   Jika masih gagal untuk masuk dengan menampilkan pesan error seperti dibawah ini :

       ERROR 1698 (28000): Access denied for user 'root'@'localhost'
       

   Lakukan proses yang sama hingga langkah 3 diatas kemudian lakukan perintah dibawah ini :

       MariaDB [(none)]> use mysql;
       Reading table information for completion of table and column names
       You can turn off this feature to get a quicker startup with -A
       Database changed
       
       Database changed
       MariaDB [mysql]> UPDATE user SET plugin="";
       Query OK, 1 row affected (0.00 sec)
       Rows matched: 1  Changed: 1  Warnings: 0
       
       MariaDB [mysql]> flush privileges;
       Query OK, 0 rows affected (0.00 sec)
       
       MariaDB [mysql]> quit
       Bye

   Kemudian coba lagi untuk masuk kedalam MariaDB.

      
   Semoga Berhasil...

   ***