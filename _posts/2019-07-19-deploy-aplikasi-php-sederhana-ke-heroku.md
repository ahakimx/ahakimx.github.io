---
layout: post
title: "Deploy Aplikasi PHP Sederhana ke Heroku"
date: 2019-07-19 17:55:58 +0000
categories: []
tags: []
image:
  path: https://cdn-images-1.medium.com/max/800/1*qK8OEhg2KdznL4QDM-joTA.png
  alt: "Deploy Aplikasi PHP Sederhana ke Heroku"
comments: true
---

### Deploy Aplikasi PHP Sederhana ke Heroku
**Buat akun Heroku**

Sebelum mendeploy aplikasi ke heroku kita harus membuat akun terlebih dahulu. ini adalah link untuk mendaftar ke heroku [**https://signup.heroku.com/login**](https://signup.heroku.com/login)

![image](https://cdn-images-1.medium.com/max/800/0*v7ltHj82iyH24AoZ.png)
**Buat Project Baru**

![image](https://cdn-images-1.medium.com/max/800/0*U3etye2lgiRtSWdH.png)
**Masuk ke menu Deploy**

![image](https://cdn-images-1.medium.com/max/800/0*IWjfqoWKv7k3pGV4.png)

![image](https://cdn-images-1.medium.com/max/800/0*-dC9dHeA1_ip14FK.png)
Ini adalah langkah- langkah yang akan dilakukan untuk mendeploy aplikasi kita ke heroku, namun sebelumnya kita harus menginstall heroku CLI terlebih dahulu. Bisa klik link ini [**Heroku CLI**](https://devcenter.heroku.com/articles/heroku-cli)

![image](https://cdn-images-1.medium.com/max/800/0*SydvVq3nUzsaSmIV.png)
Pilihan sistem operasi untuk menginstall Heroku CLI

Kemudian saya akan membuat sebuah file PHP yang bernama index.php

![image](https://cdn-images-1.medium.com/max/800/0*k__NhQhFASsVsRyy.png)
Kemudian saya masuk ke heroku dengan cara dibawah ini: heroku login

![image](https://cdn-images-1.medium.com/max/800/0*QmqyNZAu7iC5W8Kj.png)
Kemudian saya initialize project saya git init

![image](https://cdn-images-1.medium.com/max/800/0*mneUDxMdD0JtFpzN.png)
Setelah itu lakukan remote ke project kita, sesuaikan dengan nama project kita masing-masing

heroku git:remote -a hakim

![image](https://cdn-images-1.medium.com/max/800/0*AkYlFjOuiPX6dasj.png)
Setelah itu lakukan perintah git add [nama file] pada kasus ini saya hanya ingin menambahkan file index.php, sesuaikan dengan nama file yang akan di deploy.

![image](https://cdn-images-1.medium.com/max/800/0*jZU-OtjACCfjYwXT.png)
Setelah itu lakukan commit

git commit -am “Deploy PHP file to Heroku”

![image](https://cdn-images-1.medium.com/max/800/0*C5FxpdD0lJ2aibWs.png)
Setelah itu baru push ke heroku master, dengan cara:

git push heroku master

![image](https://cdn-images-1.medium.com/max/800/0*Uq0KxwparivLZ3N4.png)
Kemudian kita cek apakah aplikasi sudah berhasil di deploy ke heroku dengan memasukkan alamat url project kita, pada project saya kali ini ialah dengan url sebagai berikut: [https://hakim.herokuapp.com/](https://ahakimx.herokuapp.com/)

![image](https://cdn-images-1.medium.com/max/800/0*PILxtPVCOYsFYpeJ.png)
File PHP telah berhasil di deploy ke Heroku

Sekian dan terimakasih.. -_-
