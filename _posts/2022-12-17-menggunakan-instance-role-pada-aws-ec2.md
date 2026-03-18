---
layout: post
title: "Menggunakan Instance Role pada AWS EC2"
date: 2022-12-17 08:09:03 +0000
categories: []
tags: [aws]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/upload/v1671264213577/ZQtawEOqM.jpeg
  alt: "Menggunakan Instance Role pada AWS EC2"
comments: true
---

## Overview:

Pada tulisan kali ini kita akan membuat IAM role dan memberikan akses kedalam EC2 Instance agar bisa mengakses service AWS S3 dengan akses read. Adapun langkah-langkah yang akan dilakukan adalah sebagi berikut:

1.  Membuat instance
    
2.  Masuk kedalam instance
    
3.  Membuat role baru
    
4.  Attach role kedalam instance
    
5.  Masuk kembali kedalam instance
    
6.  Hapus sumber daya
    

## Kebutuhan:

*   Akun AWS
    
*   Terraform
    

## Langkah-langkah:

#### Membuat Instance

Pada langkah ini kita akan membuat *instance* menggunakan terraform, untuk *script* kodenya bisa dilihat di repo [Github](https://github.com/ahakimx/terraform-aws/tree/master/ec2).

Clone project, kemudian jalankan command seperti berikut:

```bash
terraform init
terraform plan
terraform apply
```

#### Masuk kedalam Instance

Setalah masuk kedalam instance coba jalankan *command* AWS S3, seperti berikut:

```bash
[ec2-user@ip-10-16-58-154 ~]$ aws s3 ls
Unable to locate credentials. You can configure credentials by running "aws configure".
```

Perhatikan hasil diatas, kita harus set credentials sebelum menjalankan perintah aws.

#### Membuat Role baru

*   Masuk ke service IAM
    
*   Klik Roles
    
*   Create role
    
*   Pada bagian Trusted entity type pilih **AWS service**
    
*   Pada bagian Use case pilih **EC2**
    
*   Klik Next
    
*   Pada bagian Permissions policies pilih **AmazonS3ReadOnlyAccess**
    
*   Klik Next
    
*   Isi Role name, pada kasus ini kita memberi nama: AhaInstanceRole
    
*   Klik Create role
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1671263402648/MMffWfF8U.png align="center")

#### Attach Role kedalam instance

*   Masuk ke service EC2
    
*   klik kanan Instance
    
*   Pilih security &gt; Pilih Modify IAM Role
    
*   Pada bagian IAM role, pilih AhaInstanceRole
    
*   Klik Update IAM role
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1671263537345/IKy8zAV8d.png align="center")

#### Masuk kembali ke instance

Jalankan *command* aws, karena kita spesifik memberikan akses ke S3, maka coba dengan menjalankan perintah

```bash
[ec2-user@ip-10-16-58-154 ~]$ aws s3 ls
2022-12-17 07:57:11 aha-bucket-3244352
```

*   Perhatikan hasilnya, sekarang kita sudah bisa melihat S3 bucket setelah menambahkan IAM role kedalam instance EC2.
    
*   Melihat *credential* melalui metadata.
    

```bash
[ec2-user@ip-10-16-58-154 ~]$ curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
AhaInstanceRole
```

*   Melihat detail *credentials*
    

```bash
[ec2-user@ip-10-16-58-154 ~]$ curl http://169.254.169.254/latest/meta-data/iam/security-credentials/AhaInstanceRole
{
  "Code" : "Success",
  "LastUpdated" : "2022-12-17T07:52:14Z",
  "Type" : "AWS-HMAC",
  "AccessKeyId" : "ASIAWZ6A3ANH5F",
  "SecretAccessKey" : "93dx/6SJLqkkWkp1Lo+V....",
  "Token" : "IQoJb3JpZ2luX2VjEPD//////////wEaCXVzLWVhc3QtMSJHMEUCICFW50V/zATqSE2pLGvXbPi7wh472bLoeD0Ja0WBElP6AiEAtxA0zITXwFpPK0ltbwhVxQxgbfbZM0cnw6wMV6E....",
  "Expiration" : "2022-12-17T14:27:40Z"
}
```

Perhatikan hasil diatas, kita bisa melihat detail dari credentials, mulai dari code sampai expiration dari credentials tersebut.

Perlu diketahui, credentials diatas akan di renew otomatis ketika expiration nya akan berakhir.

#### Hapus Resources

*   Hapus role
    
*   Detach IAM role dari instance
    
*   Hapus instance, jika menggunakan terraform, bisa menjalankan command destroy, seperti berikut: `terraform destroy`
    

Jadi seperti itulah kurang lebih cara kerja instance role yang sudah di praktekkan. Adapun untuk penggunaan yang lain bisa dilakukan eksplorasi lebih lanjut.

Sekian & Thanks.

Referensi:

[https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html)

[AWS Certified SysOps Administrator - Associate Course](https://learn.cantrill.io/)

Resource: [Github](https://github.com/ahakimx/terraform-aws/tree/master/ec2)
