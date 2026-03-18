---
layout: post
title: "Migrasi Database kedalam AWS menggunakan AWS DMS (Database Migration Service)"
date: 2023-03-09 05:56:55 +0000
categories: []
tags: [aws, aws-database, aws-dms]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/faCwTallTC0/upload/9d61ee11642d1da6001b6f863945afd8.jpeg
  alt: "Migrasi Database kedalam AWS menggunakan AWS DMS (Database Migration Service)"
comments: true
---

## Ikhtisar

AWS DMS (Database Migration Service) dapat digunakan untuk migrasi relasional database, data warehouse, NoSQL dan lainnya kedalam AWS. untuk lebih detailnya bisa dibaca [disini](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html).

Pada tulisan kali ini kita akan melakukan simulasi migrasi web apps yang ada di on-premises kedalam AWS menggunakan AWS DMS.

![AWS DMS](https://docs.aws.amazon.com/images/dms/latest/userguide/images/datarep-Welcome.png align="center")

## Prasyarat

* Akun AWS
    
* Biaya
    

## Langkah-langkah

### Provisioning resource

Provisioning resource menggunakan AWS CloudFormation dengan template berikut ini: [template](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/quickcreate?templateURL=https://learn-cantrill-labs.s3.amazonaws.com/aws-dms-database-migration/DMS.yaml&stackName=DMS)

### Buat VPC Peering

* klik VPC
    
* pilih `Peering connections`
    
* klik `create peering connection`
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678072196664/b720d2a4-8797-44ef-9c1e-f67ea0a0a5a5.png align="center")

* isi name
    
* VPC ID (Requester): onpremVPC
    
* Account: My account
    
* Region: This Region
    
* VPC ID (Acepter): awsVPC
    
* klik create connection
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678072435763/be78ec50-8f50-41b6-95dc-e74ed8b193d0.png align="center")
    
* klik Accept request
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678072532893/fc777cca-d23c-4563-b0a7-a00dea6a6c9d.png align="center")
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678072565008/39b932d9-5e14-4f99-9c65-579b3de9f24e.png align="center")
    
    ### Buat Route Table
    
    1. **Add route tables pada**`onpremPublicRT`
        
        * pilih menu route tables
            
        * pilih `onpremPublicRT`
            
        * pada tab Routes, klik Edit routes
            
            ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678073077217/3f3f0683-9e22-4d03-bd15-402dea17155e.png align="center")
            
        * klik Add route
            
        * Destination: isi IPv4 CIDR awsVPC `10.16.0.0/16`
            
        * Target: peering connection `A4L-ON-PREMISES-TO-AWS`
            
        * klik Save changes
            
            ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678073438668/4e62ad26-a238-4920-aa58-e709e58937fa.png align="center")
            
    2. **Buat route table pada**`awsPublicRT`
        
        * pilih `awsPublicRT`
            
        * pada tab Routes, klik Edit routes
            
            ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678074002173/7c372ab3-7240-49c2-b9c6-b69824e1eca2.png align="center")
            
        * klik add route
            
        * Destination: isi IPv4 CIDR onpremVPC `192.168.10.0/24`
            
        * Target: peering connection `A4L-ON-PREMISES-TO-AWS`
            
        * klik save changes
            
            ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678074128517/78b863fa-64eb-4419-b134-3decc4ac5476.png align="center")
            
    3. **Buat route table pada**`awsPrivateRT`
        
        * pilih `awsPrivateRT`
            
        * pada tab routes, klik Edit routes
            
            ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678074567278/5fab74d7-2f10-4c36-9e90-c41bacc2f40b.png align="center")
            
        * klik add route
            
        * Destination: isi IPv4 CIDR onpremVPC `192.168.10.0/24`
            
        * Target: peering connection `A4L-ON-PREMISES-TO-AWS`
            
        * klik save changes
            
            ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678074601015/b5387f82-7da0-4e93-9931-0d9d22c3a228.png align="center")
            

### Buat RDS Database

1. **Buat subnet group**
    
    * klik subnet groups
        
    * klik create DB subnet group
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678076044089/ce4c48f7-1d81-4284-af48-c4a968ce6135.png align="center")
        
    * name: `A4LDBSNGROUP`
        
    * Description: `A4LDBSNGROUP`
        
    * VPC: `awsVPC`
        
    * Availability Zones: `us-east-1` dan `us-east-1b`
        
    * Subnets: privateA `10.16.32.0/20`, privateB `10.16.96.0/20`
        
    * klik create
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678076936335/c26041ca-7647-446b-a47d-71d1c484a9fa.png align="center")
        
2. **Buat database**
    
    * pada menu databases
        
    * klik create database
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678078992944/1afcbf6f-deb3-4649-a1af-5714543adb80.png align="center")
        
    * Choose a database creation method: Standard create
        
    * Engine type: MariaDB
        
    * Templates: Free tier
        
    * DB instance identifier: `a4lwordpress`
        
    * Master password: `cats-dogs-rabbits-chickens`
        
    * Confirm master password: `cats-dogs-rabbits-chickens`
        
    * Connectivity, Virtual private cloud (VPC): `awsVPC`
        
    * DB subnet group: a4ldbsngroup
        
    * Existing VPC security groups: `DMS-awsSecurityGroupDB`
        
    * Expand additional configuration
        
    * Initial database name: `a4lwordpress`
        
    * klik create database
        
3. **Buat EC2 Instance**
    
    * masuk ke EC2
        
    * launch instance
        
    * name: awsCatWeb
        
    * Amazon Machine Image: Amazon Linux 2 AMI (HVM)
        
    * instance type: t2.micro
        
    * Network setting klik edit
        
    * VPC: awsVPC
        
    * subnet: aws-publicA
        
    * Firewall (security groups): Select an existing security group
        
    * Common security groups: DMS-awsSecurityGroupWeb
        
    * pilih Advanced details
        
    * IAM instance profile: DMS-awsInstanceProfile-
        
    * klik Launch instance
        
4. **Install wordpress requirements**
    
    * konek ke ec2
        
    * jalankan perintah dibawah ini
        
        ```bash
        yum -y update
        yum -y install httpd mariadb
        amazon-linux-extras install -y lamp-mariadb10.2-php7.2 php7.2
        
        systemctl enable httpd
        systemctl start httpd
        ```
        
5. **Setup SSH**
    
    * enable password authentication
        
        ```bash
        sudo vi /etc/ssh/sshd_config
        ...
        PasswordAuthentication yes
        ...
        ```
        
    * change `ec2-user` password, masukkan DBPassword sebelumnya: `cats-dogs-rabbits-chickens`
        
        ```bash
        passwd ec2-user
        ```
        
    * restart ssh
        
        ```bash
        systemctl restart sshd
        ```
        
6. **Tes konek ke server awsCatWeb (aws) dari catWeb (on-premises)**
    
    * pada instance catWeb, konek menggunakan session manager
        
        ```bash
        sudo bash
        cd /var/www
        ```
        
    * copy html directory ke `awsCatWeb` pada directory /ec2-user/home/
        
        ```bash
        scp -rp html ec2-user@10.16.51.36:/home/ec2-user
        ```
        
7. **Pindahkan asset ke direktori html**
    
    * masuk ke instance awsCatWeb
        
        ```bash
        cd /home/ec2-user
        cd html
        cp * -R /var/www/html/
        ```
        
8. **Set permissions and access wordpress**
    
    * set permission
        
        ```bash
        usermod -a -G apache ec2-user   
        chown -R ec2-user:apache /var/www
        chmod 2775 /var/www
        find /var/www -type d -exec chmod 2775 {} \;
        find /var/www -type f -exec chmod 0664 {} \;
        sudo systemctl restart httpd
        ```
        
9. **Akses wordpress, lihat publik IP awsCatWeb**
    
    ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678104304977/5e0546e0-70b2-4d8a-a260-b9057fa25cc7.png align="center")
    

### **Create DMS subnet**

1. **Buat subnet group**
    
    * Masuk ke DMS
        
    * pilih subnet group
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678107291597/6df57f41-3403-4bf1-a2a2-a07a7e464558.png align="center")
        
    * Isi name and description
        
    * vpc: awsVCP
        
    * subnet: aws-privateA and aws-privateB
        
    * klik Create subnet group
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678107428725/6878f6a0-61e1-464b-b795-2303bdde7322.png align="center")
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678107700446/a29428f8-1309-4464-bbc4-1a522126a092.png align="center")
        
2. **Create replication instance**
    
    * pilih Replication instance
        
    * klik Create replication instance
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678107870353/cf2b6308-7be5-4c4e-be76-4d8afe45f052.png align="center")
        
    * isi name and description: `A4LONPREMTOAWS`
        
    * Instance class: dms.t3.micro
        
    * Multi AZ: dev or test workload (single AZ)
        
    * vpc: awsVPC
        
    * Replication subnet group: a4ldmssngroup
        
    * VPC security groups: DMS-awsSecurityGroupDB-
        
    * klik create replication
        
3. **Create DMS endpoint**
    
    * pada menu endpoint
        
    * klik create endpoint
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678108982286/6648f3bf-b0c1-4e0a-aca4-95b9f224fc7a.png align="center")
        
    * endpoint type: source endpoint
        
    * Endpoint identifier: CatDBOnpremises
        
    * Source engine: mariadb
        
    * Access to endpoint database: Provide access information manually
        
    * Server name: 192.168.10.80
        
    * port: 3306
        
    * user name: a4lwordpress
        
    * Password: cats-dogs-rabbits-chickens
        
    * klik create endpoint
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678109825936/e48cdd6f-a05c-45d4-a528-b88b334c96ed.png align="center")
        
4. **Create target endpoint**
    
    * pada menu endpoint
        
    * klik create endpoint
        
    * endpoint type: target endpoint
        
    * Endpoint identifier: a4lwordpress
        
    * Source engine: mariadb
        
    * Access to endpoint database: Provide access information manually
        
    * Server name: a4lwordpress.cipytdpxpa94.us-east-1.rds.amazonaws.com
        
    * port: 3306
        
    * user name: a4lwordpress
        
    * Password: cats-dogs-rabbits-chickens
        
    * klik create endpoint
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678111011566/18809298-a804-4ecc-b31d-2f9734472dce.png align="center")
        
5. **Test connection**
    
    * klik aws
        
    * klik test connection
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678111608982/d0ccbf06-a1be-4e72-b177-cc9189cbaedc.png align="center")
        
    * klik run test, pastikan status successfull
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678111619405/d72f9651-7a7e-4198-bc8d-e70110944dcf.png align="center")
        
6. **Create migration task**
    
    * pada menu Database migration tasks
        
    * klik create task
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678197108328/3c38d58f-7e4e-4c45-8380-d2e51c75bca4.png align="center")
        
    * Task identifier: A4LONPREMTOAWSWORDPRESS
        
    * Replication instance: a4lonpremtoaws
        
    * Source database endpoint: catdbonpremises
        
    * Target database endpoint: a4lwordpress
        
    * Migration type: Migrate Existing data
        
    * Table mappings: Klik add new selection rule
        
    * Schema: Enter a schema
        
    * Source name: a4lwordpress
        
    * Klik Create task
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678234644886/5cbb273b-eab9-454c-838a-e8354e4d890d.png align="center")
        
7. Edit Config database
    
    * masuk ke instance awsCatWeb
        
    * ubah konfig pada file `wp-config.php`
        
    * edit DB Host menjadi endpoint RDS
        
        ```bash
        cd /var/www/html
        vi wp-config.php
        ...
        /** MySQL hostname */
        define( 'DB_HOST', 'a4lwordpress.cipytdpxpa94.us-east-1.rds.amazonaws.com' );
        ...
        ```
        
8. Jalankan script untuk update database dengan DNS name instance yang baru.
    
    ```bash
    #!/bin/bash
    source <(php -r 'require("/var/www/html/wp-config.php"); echo("DB_NAME=".DB_NAME."; DB_USER=".DB_USER."; DB_PASSWORD=".DB_PASSWORD."; DB_HOST=".DB_HOST); ')
    SQL_COMMAND="mysql -u $DB_USER -h $DB_HOST -p$DB_PASSWORD $DB_NAME -e"
    OLD_URL=$(mysql -u $DB_USER -h $DB_HOST -p$DB_PASSWORD $DB_NAME -e 'select option_value from wp_options where option_id = 1;' | grep http)
    HOST=$(curl http://169.254.169.254/latest/meta-data/public-hostname)
    $SQL_COMMAND "UPDATE wp_options SET option_value = replace(option_value, '$OLD_URL', 'http://$HOST') WHERE option_name = 'home' OR option_name = 'siteurl';"
    $SQL_COMMAND "UPDATE wp_posts SET guid = replace(guid, '$OLD_URL','http://$HOST');"
    $SQL_COMMAND "UPDATE wp_posts SET post_content = replace(post_content, '$OLD_URL', 'http://$HOST');"
    $SQL_COMMAND "UPDATE wp_postmeta SET meta_value = replace(meta_value,'$OLD_URL','http://$HOST');"
    ```
    
9. Stop instance on-premises, untuk melakukan ujicoba
    
    * stop instance catWeb
        
    * stop instance catDB
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678235653907/71f0e97b-96ac-4f17-b02c-26164644de44.png align="center")
        
10. Akses Wordpress pada instance awsCatWeb
    
    * akses Public IPv4 DNS
        
        ![](https://cdn.hashnode.com/res/hashnode/image/upload/v1678235779358/a49dbaf4-d3bd-4cae-8cd2-d8e504b0a504.png align="center")
        
    * Pada gambar diatas terlihat bahwa website sudah bisa diakses, migrasi sudah berhasil dilakukan menggunakan service Database Migration Service.
        

### Destroy Resources

Jangan lupa untuk menghapus sumber daya yang tidak digunakan lagi, agar menghindari tagihan di waktu yang akan datang. Adapun sumber daya yang akan dihapus adalah:

1. Hapus instance
    
2. Hapus RDS
    
3. Hapus Database migration tasks
    
4. Hapus Endpoints
    
5. Hapus replication instances
    
6. Hapus route table entry
    
7. Hapus peering connection
    
8. Hapus CloudFormation stack
    

Thanks.

---

Referensi:

[https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html)
