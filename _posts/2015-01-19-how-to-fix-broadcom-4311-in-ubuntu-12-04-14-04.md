---
categories:
- linux
- wireless
- broadcom
layout: post
title: How To Fix Broadcom 4311 in Ubuntu 12.04/ 14.04
date: 2015-01-19 05:01:00 +0000
comments: 'true'

---
Previously You check in terminal

    $ lspci | grep BCM

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585197492/myblog/Screenshot_-_190115_-_17_47_55_sdl0e7.png)  
04:00.0 Network controller: Broadcom Corporation BCM4311 802.11b/g WLAN (rev 01)

If yes,continue to process this

1. Remove the BCM driver (standart SAT) in the kernel.

   Go to terminal command:

       $ sudo apt-get remove bcmwl-kernel-source
2. Install alternative driver

       $ sudo apt-get install firmware-b43-installer b43-fwcutter
3. Restart Computer

       $ sudo reboot

Good luck..

***