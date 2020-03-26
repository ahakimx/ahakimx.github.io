---
categories:
- linux
- locked
layout: post
title: Mengatasi Account Locked di Debian
date: 2018-10-13 05:01:00 +0000
comments: 'true'

---
![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585199209/myblog/1_ofn0pe.jpg)  
Awal nya ini terjadi pada linux saya setelah beberapa kali mengalami crash pada hardisk yang terkadang sering tidak terbaca. Meskipun kadang sempat kesal kenapa hal itu bisa terjadi, kemudian saya coba browsing-browsing di google dan berdiskusi di komunitas distronya ternyata belum mendapatkan solusi juga, bahkan saya sempat bertanya pada developernya yang berasal dari Italy, dia menyarankan agar saya mengupgrade OS saya ke versi terbaru, dan ternyata sama saja.  
  
Saya coba memahami apa yang sebenarnya terjadi setelah beberapa kali intall ulang.  
Saya coba bertanya kepada diri saya "kenapa tidak mengganti nama user yang baru ?" karena sebelumnya saya menggunakan nama user yang sama ketika menginstall ulang pada partisi yang sama. Kemudian setelah selesai proses intalasi linux akhirnya bisa berjalan secara normal kembali.  
  
  
Kemudian selang beberapa hari muncul lagi masalah yang sama yaitu account saya terkunci, kemudian saya terpikir untuk masuk kedalam console dan coba bertanya kepada diri saya "kenapa tidak masuk saja kedalam console dan mount partisi home nya". Setelah saya coba untuk masuk kedalam console dengan cara masuk ke menu grub kemudian menambahkan beberapa perintah didalamnya, sehingga saya berada dalam console, karena sebelumnya saya tidak bisa masuk kedalam console, dan hanya ada satu cara untuk masuk ke menu consolenya yaitu dengan mengedit file grubnya.

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585199238/myblog/2_hjwx76.jpg)  
![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585199259/myblog/4_krhmyc.jpg)  
kemudian saya menjalankan perintah mount untuk membuka partisi home saya,

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585199308/myblog/5_e8inca.jpg)  
kenapa itu saya lakukan ? karena saya berpikir bahwa ada yang aneh dengan home saya, dan beberapa kali clue yang saya temukan adalah home saya, maka dari itu saya terpikir untuk menjalankan perintah mount partisi home saya untuk membuka home saya agar tidak terkunci lagi.  
  
  
Begitulah beberapa masalah yang sering saya alami dengan mainan linux saya, mulai dari masalah yang datang tak diundang dan pulang tak diantar, masalah sepele hingga masalah yang mengharuskan saya untuk menginstall ulang semuanya.hehe  
  
saya percaya selama kita masih mau berusaha mencari solusi maka semua masalah akan terselesaikan -_-.

***