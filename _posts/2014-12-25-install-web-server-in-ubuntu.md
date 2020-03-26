---
categories:
- webserver
- apache
layout: post
title: Install Web Server on Ubuntu
date: 2014-12-25 05:01:00 +0000
comments: 'true'

---
1. Install Apache

       $ sudo apt-get install apache2
2. Install php

       $ sudo apt-get install php5 libapache2-mod-php5

   You can save the content in a file phpinfo.php and place it under DocumentRoot directory of apache2 webserver

       $ sudo nano /var/www/html/phpinfo.php

   To verify your installation, you must add script below

       <?php
       phpinfo();
       ?>

   Then we must restart apache afterwards

       $ sudo service apache2 restart
3. Install MySQL

       $ sudo apt-get install mysql-server

   As of Ubuntu 12.04, MySQL 5.5 is installed by default. Whilst this is 100% compatible with MySQL 5.1 should you need to install 5.1 (for example to be a slave to other MySQL 5.1 servers) you can install the mysql-server-5.1 package instead.

   During the installation process you will be prompted to enter a password for the MySQL root user.

   Once the installation is complete, the MySQL server should be started automatically. You can run the following command from a terminal prompt to check whether the MySQL server is running:

       sudo netstat -tap | grep mysql

   When you run this command, you should see the following line or something similar:

       tcp        0      0 localhost:mysql         *:*                LISTEN      2556/mysqld

   If the server is not running correctly, you can type the following command to start it:  
   then restart mysql :

       $ sudo service mysql restart
4. Install phpmyadmin

       $ sudo apt-get install phpmyadmin

   If you're using Ubuntu 7.10 (Gutsy) or later select **Apache2** from the "Configuring phpmyadmin" dialog box.

   To set up under Apache all you need to do is include the following line in /etc/apache2/apache2.conf.

       $ sudo nano /etc/apache2/apache2.conf

   Add the script below in the last line

       Include /etc/phpmyadmin/apache.conf

   Then run webserver on browser

   http://localhost

   ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585196337/myblog/Screenshot_at_2018-04-26_11-54-51_owen6c.png)

   http://localhost/phpmyadmin

   ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585196365/myblog/Screenshot_at_2018-04-26_11-55-27_v0g8f6.png)

   Finish. Happy Learning.. Hope help you.

***