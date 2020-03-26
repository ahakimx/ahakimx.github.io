---
categories:
- linux
- " ubuntu"
- reset
- password
layout: post
title: How To Reset Root Password on Ubuntu 16.04
date: 2016-09-08 05:01:00 +0000
comments: 'true'

---
![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585198061/myblog/Screenshot_at_2018-09-08_14-20-45_qaifo0.png)

1. Edit Grub Menu with press "e"

   ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585198131/myblog/Screenshot_at_2018-09-08_14-28-21_ph2qol.png)
2. Find the line "linux" and add script below at the end of that line

       rw init=/bin/bash

   ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585198393/myblog/Screenshot_at_2018-09-08_13-51-27_tjdtex.png)
3. Mount with to see read/write flags

       root@(none):/# mount | grep -w /

   ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585198438/myblog/Screenshot_at_2018-09-08_14-16-29_tk4s7w.png)
4. Reset password with command below

       root@(none):/# passwd
       

   ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585198464/myblog/Screenshot_at_2018-09-08_14-17-21_tbfdo8.png)
5. Reboot your system

       root@(none):/# exec /sbin/init
       

   ***