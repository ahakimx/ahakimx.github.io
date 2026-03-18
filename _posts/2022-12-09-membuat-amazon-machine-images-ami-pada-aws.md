---
layout: post
title: "Membuat Amazon Machine Images (AMI) pada AWS"
date: 2022-12-09 23:37:26 +0000
categories: []
tags: [aws, aws-ami]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/2ta8OjluZuI/upload/718ecebe90d61b5df9023da8b103bd03.jpeg
  alt: "Membuat Amazon Machine Images (AMI) pada AWS"
comments: true
---

## Overview:

Pada tulisan kali ini kita akan membuat image yang sudah terinstall wordpress, sehingga image tersebut dapat digunakan untuk beberapa instance. Adapun langkah-langkah yang akan kita lakukan adalah sebagai berikut:

1\. Membuat instance

2\. Install wordpress, bisa dilihat pada tulisan sebelumnya

3\. Install cowsay

4\. Stop instance 

5\. Buat Image

6\. Launch instance

## Prasyarat:

* Akun AWS
    
* Wordpress
    
* Terraform
    

## Langkah-langkah: 

### Membuat Instance

Pada langkah ini bisa mengikuti menggunakan kode terraform untuk membuat instance, [disini](https://github.com/ahakimx/terraform-aws)

### Install Wordpress

Pada langkah ini bisa melihat pada tulisan sebelumnya, [disini](https://www.theha.kim/2022/12/instalasi-wordpress-di-ec2-instance-aws.html)

### Install cowsay

```bash
sudo yum install -y cowsay
```

edit header, jadi seperti ini:

```bash
sudo vi /etc/update-motd.d/40-cow
```

```bash
...
#!/bin/bash
echo "Amazon Linux 2 - Welcome"
...
```

```bash
sudo chmod 755 /etc/update-motd.d/40-cow
```

```bash
sudo rm /etc/update-motd.d/30-banner
```

```bash
sudo update-motd
```

```bash
sudo reboot
```

Login kembali ke instance, perhatikan bannernya sudah berubah seperti ini

```bash
Amazon Linux 2 - Welcome
```

### Stop Instance

Stop instance sebelum membuat image.

### Create Image

* Klik kanan pada instance
    
* Pilih image and templates
    
* Pilih create image 
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHVl8ivrvbkrWW7-4hFqoePDDL_b_4YqaJAxZRRn56k6NdkMpsAaMMri_TWQm3WpuyUBV5qCbCs45w6LYisH2TGAfhDybq5XAUkdYEa_CZE1HJNM8c-UqZbrDhc3UeHpc-CIVkcsav5DDUBjN6RiO0DdWsjxzRqiej0Hle-Ppbsusw9BThaXRnkCdYqA/w640-h240/1.png align="left")
    
* Isi detail image
    
* AhaTemplateWordpress
    
* Klik Create Image
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhbDZZG1rU63C2kTIDmTua3H_YSsl0h0wPtTgmTmodRq2rd2Esx8KwZH6KpuV6sEI3-Gg08wvohugEHBWbVlOaBoLcjmoIZ2ywNDGP-XNqasrWQaDorU-dWlmr9WOYas_3Nzo6gedNZYklfy_S_EO6bXbLyK9cbyiBxtPInQkja94z4CY6-JUQq3ZjMuQ/w640-h280/2.png align="left")
    

Kemudian lihat snapshot

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEho3XQHJQayIP1oGXQd7YG2Iur51X9-EQ_p_7UMJMLAKeKDnL6boH-ufn7U1TLoHZL5vO0ffkycCmXukDZFjmLWjIhAp2cvBfM8rgu_jO4LweuoAmY9JLXR5_zBTQeTiiiWJ0LCRqqxdCk-6jDeVGqMxfL0fB07iVi5NWCa36IR8IaOanaVKDtieQSSkg/w640-h253/3.png align="left")

Lihat AMI

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgzAWaJlyusnO7-yY1SYyh4YE11CtHehvbqMXcd0n7hWPbblPdkGAAzia61nzKJTsKY1qCMnnXcd9t5aUH25k5d7dJkQvu-ck_xoY87goDzmV3hgOlw71UGJsfdmd5mxTVKVsDKEgEziNXnXuMh20eTLxXEanTIQeVodv5ZBe3YdNFHqfR4G-m40xLufw/w640-h258/4.png align="left")

### Launch Instance

* Klik kanan ami
    
* Klik launch instance from ami
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiM1K9udavL6-d_mKikicTHCVlYupKf-9Wd8vMKoSGj_xSu7eubHhqlhVZ-kvb3zaiTvhF9Z6LlGFJmYdW15RDZZD5Q87xOwUUyJk5uQQ0lZdLX9XRqGKIRhETZhaBmfM7DJxna1bqNlOc3hCogY3-ukoUFuUXR2Xwbutn_sqb1VyjC92J5V9aE9YDGfA/w640-h244/5.png align="left")
    
* isi detail instance
    
* launch instance 
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSbhRNdn_WIsqBiZV5hLLU1ty03DQQyup0-_XNFZqhxRbdZ6O-rxHdJcfNLIRm8dNgK3KWPNVRhFApCXx09R1VhW6nzFZ0Ajo3JfWPzFggt29fTebvOguJQ_U28e8iI3GBi2hKkalHe2aR-FQnyt8wRZlNWIXL_PJggSTug_l-VuLjQ9T4nbYGVT2qbQ/w640-h364/6.png align="left")
    

Masuk kedalam instance

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjMbhxd_VffeEnIra7B918_uFz0_1KQrrLRO15jvvZhj9n9Fy_4o_fR0NBHvBFmflDMvs281FoEuTOy6iZgBr6Xut_ze9_nW7-XzeeXJslTuRPt-SQSKufbEzwjw044banofZkkTnDzGAvj_K9J-r4QEKRNdt7MVutNPQ59YgVAIywG8N8dz2fKOSZgug/w640-h93/7.png align="center")

---

### Hapus sumber daya

Hapus sumberdaya yang sudah dibuat, mulai dari snapshot, image dan instance.

### Referensi

[AWS SysOps Training](https://learn.cantrill.io/)

Resource: Terraform Code [Github](https://github.com/ahakimx/terraform-aws)
