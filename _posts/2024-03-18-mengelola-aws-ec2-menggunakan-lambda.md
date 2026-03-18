---
layout: post
title: "Mengelola AWS EC2 Menggunakan Lambda"
date: 2024-03-18 17:00:00 +0000
categories: []
tags: [ec2, aws, aws-lambda]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/6liebVeAfrY/upload/7db69e081d01c389c0a50a59fe2cc07b.jpeg
  alt: "Mengelola AWS EC2 Menggunakan Lambda"
comments: true
---

# Overview

AWS Lambda adalah layanan komputasi tanpa server yang memungkinkan untuk menjalankan kode tanpa harus memprovision atau mengelola server. Lambda mengelola semua kapasitas infrastruktur dan skala secara otomatis, sehingga kita bisa fokus pada penulisan kode tanpa harus khawatir tentang perawatan server. Lambda juga memungkinkan kita untuk menjalankan kode secara event-driven, artinya kode hanya dijalankan saat dipicu oleh suatu kejadian atau event yang telah ditentukan sebelumnya.

Dengan menggunakan AWS Lambda, kita dapat mempercepat waktu pengembangan dan mengurangi biaya operasional, karena infrastruktur server akan diatur secara otomatis oleh AWS Lambda. Dalam tulisan ini, kita akan menggunakan AWS Lambda untuk mengontrol instances pada Amazon EC2, yaitu menghentikan, memulai dan melindungi instances.

Adapun langkah-langkah yang akan dilakukan adalah sebagai berikut:

1. Membuat instance pada EC2, bisa menggunakan terraform.
    
2. Membuat IAM Role
    
3. Membuat lambda function untuk stop instance
    
4. Membuat lambda function untuk start instance
    
5. Hapus sumber daya
    

# Prasyarat

1. Terraform (optional)
    
2. Akun AWS
    

# Langkah-langkah

### Step 1 - Buat Instance pada EC2

Untuk membuat instance pada AWS EC2, kita akan menggunakan terraform untuk provisioning EC2 pada repo github berikut: [Github](https://github.com/ahakimx/terraform-aws/tree/master/ec2-lambda)

Jika belum pernah menggunakan terraform bisa dari AWS console.

* buka AWS Management Console, lalu pilih EC2. Klik "Launch Instance" dan pilih Amazon Machine Image (AMI)
    
* Pilih instance type dan konfigurasikan security group.
    
* Llik "Review and Launch"
    
* klik "Launch" untuk menyelesaikan proses.
    

### Step 2 - Buat IAM Role

Untuk membuat IAM Role

* buka AWS Management Console dan pilih "IAM".
    
* Pilih "Roles" dan klik "Create role".
    
* Pilih "AWS service" dan pilih service "Lambda" klik next
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1707765379763/15424e5b-af84-453c-b5e8-4dad9c3d8164.png align="center")
    
* Selanjutnya buat policy, dan beri nama pada role tersebut.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709547662076/99d4f30c-bbfc-49bc-9850-b32f4304e691.png align="center")
    
* selanjutnya pilih JSON
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709547701043/ece2ac27-eb40-49fd-822a-f48fc373de74.png align="center")
    
* isi sebagai berikut:
    
    ```json
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ],
          "Resource": "arn:aws:logs:*:*:*"
        },
        {
          "Effect": "Allow",
          "Action": [
            "ec2:Start*",
            "ec2:Stop*"
          ],
          "Resource": "*"
        }
      ]
    }
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709552345994/43e31d44-02db-4ff3-bebd-0bd95072373b.png align="center")
    

### Step 3 - Membuat lambda function untuk stop instance

Membuat Lambda function untuk menghentikan instance,

* buka AWS Management Console dan pilih "Lambda".
    
* Klik "Create Function".
    
* Pilih "Author from scratch",
    
* beri nama pada function, pilih runtime python, selanjutnya klik create function
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709551933783/2108a399-4c68-47b4-8f00-b5db7384dfa3.png align="center")
    
* Pada permission, pilih "use an execution role", dan pilih existing role.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709551956283/27b51981-f245-4d74-bf32-cce714281f13.png align="center")
    
* Selanjutnya, tambahkan script python untuk menghentikan instance dan klik deploy
    
    ```python
    import boto3
    import os
    import json
    
    region = 'us-east-1'
    ec2 = boto3.client('ec2', region_name=region)
    
    def lambda_handler(event, context):
        instances=os.environ['EC2_INSTANCES'].split(",")
        ec2.stop_instances(InstanceIds=instances)
        print('stopped instances: ' + str(instances))
    ```
    
* ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709552071375/7b7c1c37-3ddd-4c34-8559-e83398a8e4bc.png align="center")
    
* tambahkan environment variable
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709552120706/1a363864-3f40-4d4e-a483-95d024563f30.png align="center")
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709552143704/7662fb45-e1f7-47bc-895f-bd81ad919992.png align="center")
    
* Test event, klik tab Test
    
* Create new event kemudian klik Test
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729276320923/5cc3f3c1-8a21-4673-9a2b-46e32136ea95.png align="center")
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729276679287/bce28744-be49-4ab5-a1ec-0afb150de328.png align="center")
    
* Lihat list instance apakah sudah berhasil distop, terlihat instance sudah berhasil distop.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729276806799/12b17c99-5940-45cd-9785-20fca6ddbf7d.png align="center")
    
* ![dddd](https://cdn.hashnode.com/res/hashnode/image/upload/v1729276635060/d18ce73e-1b57-4124-b6d5-698396fcb284.png align="center")
    

### Step 4 - Membuat lambda function untuk start instance

Sekarang kita akan membuat Lambda function untuk menjalankan instance,

* buka AWS Management Console dan pilih "Lambda".
    
* Klik "Create Function".
    
* Pilih "Author from scratch",
    
* beri nama pada function, pilih runtime python, selanjutnya klik create function
    
* Pada permission, pilih "use an execution role", dan pilih existing role.
    
* Selanjutnya, tambahkan script python untuk menghentikan instance dan klik deploy
    
* ```python
    import boto3
    import os
    import json
    
    region = 'us-east-1'
    ec2 = boto3.client('ec2', region_name=region)
    
    def lambda_handler(event, context):
        instances=os.environ['EC2_INSTANCES'].split(",")
        ec2.start_instances(InstanceIds=instances)
        print('started instances: ' + str(instances))
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729458631318/72dcd6ed-2c71-43f2-976f-60b7b0ff766b.png align="center")
    
* tambahkan environment variable
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709552120706/1a363864-3f40-4d4e-a483-95d024563f30.png align="center")
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1709552143704/7662fb45-e1f7-47bc-895f-bd81ad919992.png align="center")
    
* Test event, klik tab Test
    
* Create new event kemudian klik Test
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729276320923/5cc3f3c1-8a21-4673-9a2b-46e32136ea95.png align="center")
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729458844810/0d8682ea-73f2-43b5-bc3f-a967f6cdb432.png align="center")
    
* Lihat list instance apakah statunya running, terlihat instance sudah berhasil runnning dimana sebelumnya statusnya masih stopped.
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729276806799/12b17c99-5940-45cd-9785-20fca6ddbf7d.png align="center")
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1729458955923/8c4343db-679c-47dd-938a-540c9ffd538f.png align="center")

### Step 5 - Hapus sumber daya

* Hapus lambda yang sudah dibuat sebelumnya
    
* Hapus kedua instances
    

### Referensi:

* [https://aws.amazon.com/lambda/](https://aws.amazon.com/lambda/)
    
* [https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-managing-instances.html](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/ec2-example-managing-instances.html)
