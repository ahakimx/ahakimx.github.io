---
layout: post
title: "Membuat Enkripsi pada Object di AWS S3"
date: 2022-11-28 23:26:09 +0000
categories: []
tags: [aws, aws-kms, aws-s3]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/tqbE33Z1qzw/upload/f6c151963b0eeee8db58176b9d74d2f8.jpeg
  alt: "Membuat Enkripsi pada Object di AWS S3"
comments: true
---

# Overview:

Pada tulisan kali ini kita akan membuat enkripsi pada object yang ada di AWS S3, adapun langkah-langkah yang akan kita lakukan adalah:

1. Membuat bucket
    
2. Membuat Key Management Service (AWS KMS)
    
3. Upload file
    
4. Akses Object
    
5. Buat policy
    
6. Akses Kembali Object
    
7. Bersihkan S3 dan KMS
    

# Kebutuhan:

* Akun AWS
    
* File sampel, bisa ambil di [Github](https://github.com/ahakimx/s3-sample-code)
    

# Langkah-langkah:

### Membuat bucket

* Masuk ke service S3
    
* Create bucket
    
* Isi nama bucket dan region
    
* Create bucket
    
    ![1.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669720967332/i3iZIeuuO.png align="center")
    

### Membuat Key Management Service (AWS KMS)

* Masuk ke service KMS,
    
* Create a key
    
* Key type: symmetric
    
* Key usage: Encrypt and decrypt
    
    ![3.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669721152410/yZC1qchhA.png align="center")
    
* Key material origin: KMS
    
* Next
    
    ![4.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669721179447/QGD4sPuIF.png align="center")
    
* Isi alias
    
    ![5.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669721231476/-zXHzSHEw.png align="center")
    
* Pada Key deletion biarkan default tercentang
    
* Klik Next
    
* Klik Next
    
    ![6.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669721460553/-nJvOuc3N.png align="center")
    
    ![7.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669721463347/cE5ZVLAUL.png align="center")
    
* Key policy biarkan default
    
* Next
    
    ![8.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1669721275121/TDLjaR7y4.png align="center")
    

## Upload File

1. Upload file tanpa menggunakan enkripsi
    
    * Upload file
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618059151/afc77152-ed69-47dd-a304-fc4cd55a5508.png align="center")
        
2. Upload file menggunakan encryption key SSE-S3
    
    * Upload file menggunakan enkripsi
        
    * Klik Upload
        
    * Klik pada bagian Properties
        
    * Server-side encryption pilih specify an encryption key
        
    * Encryption key type pilih SSE-S3
        
    * Upload
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618164285/3540fcf8-ea75-4ca1-a6bf-0552b799c48d.png align="center")
        
3. Upload file menggunakan encryption key SSE-KMS
    
    * Upload file menggunakan enkripsi
        
    * Klik Upload
        
    * Add files
        
    * Klik pada bagian Properties
        
    * Server-side encryption pilih specify an encryption key
        
    * Encryption key type pilih SSE-S3
        
    * AWS KMS key pilih choose from your AWS KMS keys
        
    * Pilih KMS yang sudah kita buat sebelumnya
        
    * Upload
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618272377/f976c308-0791-4673-9ed9-5e0c6076773d.png align="center")
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618238058/a0255d7f-ed07-4ac0-ae3b-ce0d458190f2.png align="center")
        
4. Lihat Object
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618294830/9c4944f8-38af-4948-b0e6-d59090d54b16.png align="center")
    

### Lihat File Object

1. Lihat file object tanpa menggunakan enkripsi
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618415116/70dff337-5194-4c13-b9d3-918fcd21b94f.png align="center")
    
2. Lihat file object menggunakan enkripsi SSE-S3
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618424202/faf5428c-64c6-45ff-a16b-d7aebab5abd9.png align="center")
    
3. Lihat file object menggunakan enkripsi SSE-KMS
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618431070/d90f7c03-8647-4833-abe1-ee4c11db7d62.png align="center")
    

### Buat policy

Buat policy untuk mencegah akses ke kms

* Ke IAM
    
* Pilih Users
    
* Pada bagian user pilih iamadmin
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618497586/f5c9f465-cea9-4ebf-b8b1-8fd2524735f6.png align="center")
    
* Klik add inline policy
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618519691/aa4abec1-085b-4ba4-9bbc-df9faa778b1b.png align="center")
    
* Isi Json file
    
    ```bash
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "Denykms",
                "Effect": "Deny",
                "Action": "kms:*",
                "Resource": "*"
            }
        ]
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618564088/6081cacc-a7ce-4eb2-8a9f-c5f9a79b8a81.png align="center")
    
* Review policy
    
* Isi nama denyKMS
    
* Create policy
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618594580/9ba92098-813d-4ef0-9052-6802d0ef22e8.png align="center")
    

### Akses Kembali Object

1. Lihat file object tanpa menggunakan enkripsi
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618639265/ce9c5279-aae9-452b-be60-5acf5134c487.png align="center")
    
2. Lihat file object menggunakan enkripsi SSE-S3
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618711993/40f427b5-c57c-4e4d-9313-7f1bb95c67b4.png align="center")
    
3. Lihat file object menggunakan enkripsi SSE-KMS
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692618746620/83af4f8c-1b78-4d41-bd2e-f7689a873be5.png align="center")
    
    Terlihat pada pesan error diatas kita tidak diberikan akses terhadap file tersebut, karena sebelumnya kita sudah membuat policy untuk tidak mengijinkan akses kedalam service KMS.
    

### Bersihkan S3 dan KMS

1\. Hapus Bucket

2\. Hapus Inline policy (denyKMS)

3\. Hapus KMS

### Referensi:

[https://docs.aws.amazon.com/kms/latest/developerguide/services-s3.html](https://docs.aws.amazon.com/kms/latest/developerguide/services-s3.html)

[learn cantrill - aws sysops training](https://learn.cantrill.io/)

Repository: [GitHub](https://github.com/ahakimx/s3-sample-code)
