---
layout: post
title: "Membuat EBS Volume di Amazon Web Services"
date: 2022-12-02 01:39:58 +0000
categories: []
tags: [aws, aws-ebs]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/S0j-5wSN3YQ/upload/50e453d9f9cdc1807d5e5b54bc000c18.jpeg
  alt: "Membuat EBS Volume di Amazon Web Services"
comments: true
---

## Overview:

Pada tulisan kali ini kita akan membuat EBS volume pada AWS, dengan beberapa skenario. EBS merupakan block storage yang ada pada service AWS, ia digunakan pada EC2 instance seperti hardisk yang bisa dicabut colok. EBS ini merupakan storage yang fleksibel yang mana kita bisa menambahkan kapasitas volume, mengubah kapasitas IOPS dan sebagainya. Adapun penjelasan lebih detail mengenai EBS Volume pada AWS bisa dibaca [disini](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html). Untuk langkah-langkah yang akan kita lakukan adalah sebagi berikut:

1. Membuat instance
    
2. Membuat EBS volume
    
3. Attach volume ke instance-0 (AZ-A)
    
4. Masuk kedalam instance
    
5. Attach volume ke instance-1 (AZ-A)
    
6. Masuk ke instance 2
    
7. Snapshot volume
    
8. Buat volume baru dari snapshot
    
9. Attach volume snapshot ke instance-2 (AZ-B)
    
10. Clean up (bersihkan sumber daya)
    

## Prasyarat:

* Akun AWS
    
* Terraform
    
* Region: us-east-1
    
* VPC default atau VPC yang sudah dibuat sebelumnya [disini](https://ahakimx.hashnode.dev/implementasi-subnet-vpc-multi-tier-di-aws)
    
* Availability Zone: us-east-1a (instance-1-2)
    
* Availability Zone: us-east-1b (instance3)
    
* Kode terraform, [disini](https://github.com/ahakimx/terraform-aws/tree/master/ec2)
    

## Langkah-langkah:

### Membuat Instance

Pada bagian ini kita akan membuat instance sebanyak 3 instance dengan detail:

* ebs-test-instance-0 (availability zone A)
    
* ebs-test-instance-1 (availability zone A
    
* ebs-test-instance-2 (availability zone B)
    

Pada langkah ini kita menggunakan tool terraform untuk membuat instance. Adapun langkah-langkahnya bisa dilihat di repo [Github](https://github.com/ahakimx/terraform-aws/tree/master/ec2). Jika ingin membuat manual juga bisa dilakukan, namun kali ini kita akan membuat instance dengan script terraform.

### Mambuat EBS

1. Buat instance
    
    * Pilih menu volumes yang ada pada EBS
        
    * Klik create volume
        
    * Isi detail volume
        
    * Isi size 5 GiB
        
    * Pilih Availability Zone: us-east-1a
        
    * Klik Create volume
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692667520834/01dd75ea-1604-4f26-b743-1b9700a500fb.png align="center")
        
2. Attach volume ke instance-0
    
    * Klik kanan EBSTest
        
    * Klik Attach volume
        
    * Pilih instance-0
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692667527769/27164aa4-9604-49b7-a874-d4297f966c02.png align="center")
        

### Masuk ke dalam Instance

1. Masuk kedalam instance-0, jalankan command berikut:
    
    ```bash
    [ec2-user@ip-10-16-55-192 ~]$ lsblk
    NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
    xvda    202:0    0   8G  0 disk 
    └─xvda1 202:1    0   8G  0 part /
    xvdf    202:80   0   5G  0 disk 
    [ec2-user@ip-10-16-55-192 ~]$ sudo file -s /dev/xvdf
    /dev/xvdf: data
    ```
    
    ```bash
    [ec2-user@ip-10-16-55-192 ~]$ sudo mkfs -t xfs /dev/xvdf
    meta-data=/dev/xvdf              isize=512    agcount=4, agsize=327680 blks
             =                       sectsz=512   attr=2, projid32bit=1
             =                       crc=1        finobt=1, sparse=0
    data     =                       bsize=4096   blocks=1310720, imaxpct=25
             =                       sunit=0      swidth=0 blks
    naming   =version 2              bsize=4096   ascii-ci=0 ftype=1
    log      =internal log           bsize=4096   blocks=2560, version=2
             =                       sectsz=512   sunit=0 blks, lazy-count=1
    realtime =none                   extsz=4096   blocks=0, rtextents=0
    [ec2-user@ip-10-16-55-192 ~]$ sudo file -s /dev/xvdf
    /dev/xvdf: SGI XFS filesystem data (blksz 4096, inosz 512, v2 dirs)
    ```
    
    ```bash
    [ec2-user@ip-10-16-55-192 ~]$ sudo mkdir /ebstest
    [ec2-user@ip-10-16-55-192 ~]$ sudo mount /dev/xvdf /ebstest
    [ec2-user@ip-10-16-55-192 ~]$ df -k
    Filesystem     1K-blocks    Used Available Use% Mounted on
    devtmpfs          485312       0    485312   0% /dev
    tmpfs             494456       0    494456   0% /dev/shm
    tmpfs             494456     468    493988   1% /run
    tmpfs             494456       0    494456   0% /sys/fs/cgroup
    /dev/xvda1       8376300 1635808   6740492  20% /
    tmpfs              98892       0     98892   0% /run/user/0
    tmpfs              98892       0     98892   0% /run/user/1000
    /dev/xvdf        5232640   38244   5194396   1% /ebstest
    [ec2-user@ip-10-16-55-192 ~]$ cd /ebstest
    ```
    
    ```bash
    [ec2-user@ip-10-16-55-192 ebstest]$ sudo bash -c  "echo Test file > testfile.txt"
    [ec2-user@ip-10-16-55-192 ebstest]$ ls
    testfile.txt
    [ec2-user@ip-10-16-55-192 ebstest]$ cat testfile.txt 
    Test file
    ```
    
    Reboot Instance
    
    ```bash
    [ec2-user@ip-10-16-55-192 ebstest]$ sudo reboot
    ```
    
2. Masuk ke instance-0 kembali
    
    ```bash
    [ec2-user@ip-10-16-55-192 ~]$ df -k
    Filesystem     1K-blocks    Used Available Use% Mounted on
    devtmpfs          485312       0    485312   0% /dev
    tmpfs             494456       0    494456   0% /dev/shm
    tmpfs             494456     440    494016   1% /run
    tmpfs             494456       0    494456   0% /sys/fs/cgroup
    /dev/xvda1       8376300 1639020   6737280  20% /
    tmpfs              98892       0     98892   0% /run/user/1000
    ```
    
    Terlihat pada hasil diatas, mountingan /ebstest terlepas, karena tidak di set auto mount, sehingga ketika di restart maka disk tidak persistent.
    
3. Set auto mount pada filesystem, catat UUID
    
    ```bash
    [ec2-user@ip-10-16-55-192 ~]$ sudo blkid /dev/xvdf
    /dev/xvdf: UUID="35cff01e-2e03-4f68-8fec-34e79d60c013" TYPE="xfs"
    ```
    
    Edit file /etc/fstab
    
    ```bash
    [ec2-user@ip-10-16-55-192 ~]$ sudo vi /etc/fstab
    ...
    UUID=35cff01e-2e03-4f68-8fec-34e79d60c013    /ebstest    xfs   defaults,nofile
    ...
    ```
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692667830854/1b575881-d576-432c-860b-116b530a9272.png align="center")
    
    ```bash
    [ec2-user@ip-10-16-55-192 ~]$ sudo mount -a
    ```
    
4. Stop instance-0
    

### Attach Volume ke instance-1

1. Detach volume, detach EBS volume dari instance-0
    
    * Klik kanan volume EBSTest
        
    * Klik Detach
        
2. Attach volume ke instance-1, masuk ke dalam instance -1, jalankan perintah berikut:
    
    ```bash
    [ec2-user@ip-10-16-54-184 ~]$ lsblk
    NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
    xvda    202:0    0   8G  0 disk 
    └─xvda1 202:1    0   8G  0 part /
    xvdf    202:80   0   5G  0 disk 
    [ec2-user@ip-10-16-54-184 ~]$ sudo file -s /dev/xvdf
    /dev/xvdf: SGI XFS filesystem data (blksz 4096, inosz 512, v2 dirs)
    [ec2-user@ip-10-16-54-184 ~]$ sudo mkdir /ebstest
    [ec2-user@ip-10-16-54-184 ebstest]$ sudo mount /dev/xvdf /ebstest
    [ec2-user@ip-10-16-54-184 ebstest]$ df -k
    Filesystem     1K-blocks    Used Available Use% Mounted on
    devtmpfs          485312       0    485312   0% /dev
    tmpfs             494456       0    494456   0% /dev/shm
    tmpfs             494456     412    494044   1% /run
    tmpfs             494456       0    494456   0% /sys/fs/cgroup
    /dev/xvda1       8376300 1638788   6737512  20% /
    tmpfs              98892       0     98892   0% /run/user/1000
    /dev/xvdf        5232640   38248   5194392   1% /ebstest
    [ec2-user@ip-10-16-54-184 ~]$ cd /ebstest/
    [ec2-user@ip-10-16-54-184 ebstest]$ ls /ebstest/
    testfile.txt
    [ec2-user@ip-10-16-54-184 ebstest]$ cat testfile.txt 
    Test file
    ```
    
    Pada hasil diatas kita bisa lihat bahwa file testfile.txt yang sebelumnya kita buat diinstance-0 masih ada, itu dikarenakan EBS volume ini bersifat persistent, selama datanya tidak dihapus datanya masih tetap ada.
    
3. Stop instance-1
    
4. Detach volume dari instance-1
    

### Snapshot Volume

Snapshot pada volume EBSTest ini kita lakukan agar instance-2 pada availability\_zone B bisa menggunakan volume yang sebelumnya sudah kita buat.

Lantas kenapa harus menggunakan snapshot ?

Jawabannya adalah, karena kita tidak bisa menempelkan volume yang ada di avaialability zone A ke instance-2 yang berada pada availability zone B. EBS volume hanya bisa di attach pada availability zone yang sama, seperti yang sudah kita contohkan pada instance-0 dan instance-1 diatas, sehingga tidak bisa di attach ke instance-2 karena berbeda availability zone.

Nah, untuk itulah kita lakukan snapshot terlebih dahulu, kemudian kita buat volume dari snapshot tersebut untuk diarahkan ke availability zone B, tempat dimana instance-2 berada.

Adapun cara kerja dari snapshot ini adalah ia akan mereplikasi datanya ke availability zone yang lain di dalam region yang sama. Snapshot memungkinkan kita untuk membuat volume di satu AZ kemudian dapat dipindahkan ke Availability Zone yang lain.

1. Buat snapshot
    
    * klik kanan volume EBSTest
        
    * Klik create snapshot
        
    * Isi deskripsi
        
    * Klik Create snapshot
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692668167980/e83cf11c-abc7-4944-95e3-9650feca7c26.png align="center")
        

### Membuat Volume dari Snapshot

* Masuk ke snapshot
    
* Klik kanan snapshot
    
* Klik Create volume from snapshot
    
* Pilih Availability Zone B
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692668225242/aa893c9f-285b-45ea-b1e8-f519fcf4b7f1.png align="center")
    

### Attach Volume ke instance-2

1. Attach volume
    
    * Masuk ke volumes
        
    * Klik kanan volume
        
    * Attach ke instance-2 di availability zone B
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1692668276941/7cc614a2-ed30-4b19-b970-9ee5c214b28f.png align="center")
        
2. Masuk kedalam instance-2, jalankan perintah berikut:
    
    ```bash
    [ec2-user@ip-10-16-113-66 ~]$ lsblk
    NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
    xvda    202:0    0   8G  0 disk 
    └─xvda1 202:1    0   8G  0 part /
    xvdf    202:80   0   5G  0 disk 
    [ec2-user@ip-10-16-113-66 ~]$ sudo file -s /dev/xvdf
    /dev/xvdf: SGI XFS filesystem data (blksz 4096, inosz 512, v2 dirs)
    [ec2-user@ip-10-16-113-66 ~]$ sudo mkdir /ebstest
    [ec2-user@ip-10-16-113-66 ~]$ sudo mount /dev/xvdf /ebstest
    [ec2-user@ip-10-16-113-66 ~]$  cd /ebstest
    [ec2-user@ip-10-16-113-66 ebstest]$ ls
    testfile.txt
    [ec2-user@ip-10-16-113-66 ebstest]$ cat testfile.txt
    Test file
    ```
    
    Dari hasil diatas bisa dilihat bahwa data dari volume sebelumnya masih ada, sehingga instance dari availability zone yang berbeda dapat mengakses data tersebut dengan di snapshot terlebih dahulu.
    

3\. Stop Instance

4\. Detach volume

### Clean Up

* Hapus snapshot
    
* Hapus volume
    
* Hapus Instance (jika menggunakan terraform bisa dilihat pada repo [Github](https://github.com/ahakimx/terraform-aws))
    

Terraform code:  [https://github.com/ahakimx/terraform-aws](https://github.com/ahakimx/terraform-aws)

Referensi: [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volumes.html)
