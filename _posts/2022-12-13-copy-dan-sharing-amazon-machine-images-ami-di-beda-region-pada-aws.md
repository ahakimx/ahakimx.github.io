---
layout: post
title: "Copy dan Sharing Amazon Machine Images (AMI) di beda Region pada AWS"
date: 2022-12-13 02:10:48 +0000
categories: []
tags: [aws, aws-ami]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/FKetb2QJzEo/upload/2f676b5ff2205aeae1961bb1dea18d1a.jpeg
  alt: "Copy dan Sharing Amazon Machine Images (AMI) di beda Region pada AWS"
comments: true
---

# Overview

Pada tulisan kali ini kita akan menyalin dan *sharing* ami antar *region*, pada kasus ini AMI yang ada di *region* Virginia akan di *copy* ke *region* Ohio. Karena AMI pada AWS ini melekat pada setiap region maka jika kita ingin menggunakan AMI berbeda region bisa menggunakan cara yang akan kita praktekkan pada tulisan ini. Adapun langkah-langkah yang akan dilakukan adalah sebagai berikut:

1\. Copy AMI dari region virginia ke region Ohio

2\. Sharing AMI

3\. Hapus sumber daya

# Prasyarat

* Akun AWS
    
* AMI yang sudah di kustom dengan menginstall [wordpres](https://ahakimx.hashnode.dev/membuat-amazon-machine-images-ami-pada-aws)
    

# Langkah-langkah

### Salin AMI

* Klik kanan pada AMI
    
* Klik Copy AMI
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692669860730/5c447a0d-2d6f-4f9b-86e9-0892861ab3fc.png align="center")
    
* Pada destination: ohio
    
* check encrypt
    
* kms key: aws/ebs
    
* copy AMI
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692669914962/cf0249f6-cc0f-41df-8ac2-bc4976549c2e.png align="center")
    
    Check pada region Ohio, lihat AMI sudah tercopy ke dalam region tersebut, pindah ke region Ohio kemudian perhatikan isi dari AMI.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692669931544/3d2b0129-7a7a-4f8b-93c5-2800d15a96e1.png align="center")
    

### Sharing AMI

Sekarang edit AMI menjadi publik, kembali ke region Virginia

* Klik kanan AMI
    
* Klik edit AMI permissions
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692669980202/a388246e-9e65-442c-854c-c8b9fe68e613.png align="center")
    
* pada AMI availability pilih public
    
* Klik save changes 
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692670020318/f66ba2cf-b6bf-4f68-af27-b947c15d56d2.png align="center")
    
    Perhatikan visibility pada AMI, visibility pada sudah berubah menjadi publik. Perlu di ketahui, disaat kita menyalin AMI secara default akan menjadi private, jika ingin menjadi publik bisa melakukan langkah-langkah seperti diatas.
    

### Hapus sumber daya

* Deregister AMI di region ohio
    
* Deregister AMI di region virginia
    
* Hapus snapshot di region Ohio
    
* Hapus snapshot di region Virginia
    

### Referensi:

* [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/CopyingAMIs.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/CopyingAMIs.html)
    
* [AWS SysOps Training](https://learn.cantrill.io/)
