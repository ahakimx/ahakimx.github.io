---
layout: post
title: "Implementasi Subnet VPC Multi-Tier di AWS"
date: 2022-11-29 07:54:50 +0000
categories: []
tags: [aws, aws-vpc]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/zMbxBDg4qBc/upload/4b48528e0978ed1ba746c860a4932017.jpeg
  alt: "Implementasi Subnet VPC Multi-Tier di AWS"
comments: true
---

## Overview:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg85McpnwwCZGcVdOcM0bBf_kPHwc2XcJPL5ndz6ybZ4UQPXy2poPRQzpGJVLC0MbyYncSKugIDlW_4t06UrqkcgNlCfjenGszWzjRmfMNC0ELYc3xoRIMSRs68fLFgHg0IUDEvlHEC3iO24ShhllDz35PvXbNoNv5ziqX3A14HxnmaWdQoyWZsHVm7xw/s16000/vpc-subnet.png align="center")

Pada artikel kali ini kita akan membuat multi-tier VPC subnet pada AWS yang mana kita akan membuat VPC dan subnet dengan cara manual agar memudahkan kita untuk memahami langkah demi langkah dalam membuat VPC. Jika ingin menggunakan script otomatis bisa menggunakan terraform yang terdapat repo [Github](https://github.com/ahakimx/terraform-aws).

Sebelum kita memulai dengan cara manual kita akan melihat kebutuhan terkait dengan network terlebih dahulu, seperti dibawah ini:

* Database
    
* App
    
* Web
    
* Subnet khusus (untuk kebutuhan yang akan datang).
    

| NAME | CIDR | AZ | CustomIPv6Value |
| --- | --- | --- | --- |
| sn-db-A | 10.16.16.0/20 | AZA | IPv6 |
| sn-app-A | 10.16.32.0/20 | AZA | IPv6 |
| sn-web-A | 10.16.48.0/20 | AZA | IPv6 |
| sn-reserved-B | 10.16.64.0/20 | AZB | IPv6 |
| sn-db-B | 10.16.80.0/20 | AZB | IPv6 |
| sn-app-B | 10.16.96.0/20 | AZB | IPv6 |
| sn-web-B | 10.16.112.0/20 | AZB | IPv6 |
| sn-reserved-C | 10.16.128.0/20 | AZC | IPv6 |
| sn-db-C | 10.16.144.0/20 | AZC | IPv6 |
| sn-app-C | 10.16.160.0/20 | AZC | IPv6 |
| sn-web-C | 10.16.176.0/20 | AZC | IPv6 |

Adapun langkah-langkah yang akan dilakukan adalah:

1. Membuat VPC
    
2. Konfigurasi VPC
    
3. Membuat subnet baru
    

## Kebutuhan:

* Akun AWS ( bisa menggunakan [free tier](https://aws.amazon.com/free/))
    

## Langkah-langkah:

### Membuat VPC

1. Masuk ke VPC
    
    * Klik your VPC
        
    * Create VPC
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjVc0vpks39iZIFu1j5henkb92mX_Za638-YGpogbAIZWvXbO9R1MP0je3tPjg1RHya2E62UqixB4a9V842w4JFrE9wsQPlrJNcLWybGg28B9fSbSWSBWPwDZIySVO9N1Ay_712-PoYthhvch7XVIj3UhlIPiOvF6UWJyhrwYarI0b46ZohqVTQoIf0Gg/w640-h204/1.png align="center")
        
    * Pilih VPC only
        
    * Isi VPC, pada kali ini saya mengisi seperti berikut:
        
        * name = aha-vpc1
            
        * ipv4 cidr = 10.16.0.0/16
            
        * ipv6 cidr block = amazon-provided ipv6 cidr block
            
        * tenancy =default
            
    * Create VPC
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgS0lBR0pqCPK7bqO8VXkeH6OyZjk9afjDyiOi5eHbbWIrwCalD9Q1M6NRSWr5Tdk_WG_tLazeNIsuk2w3SOUroDYU-70viVrCpggBDdK022oJt-xFspLmdI4PlhlCFcYIvV6UTow0qsY3xal7COWF4rmfrvDaGgnVSjfVMUeRe0SdCqY7FSBDN8B_0KQ/w640-h528/2.png align="center")
        
2. Lihat detail VPC
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEioea-hB-fzITG4-ZTuPRVKBW6AfOWQXxMo63uTAWqirMCVuYUxn_Fy5lzTt2I5RO7Dh1J9iyBCLwj-mrir-Rv6viyIbjbRHkEYSsxH9kyoPbEDBZfWedmS2HdyhzfZnUYx5in8QBPIe86JLLcuDIS101OCAsurUX3EcmCYpU5Oyns3YcD6o9o145VtRw/w640-h228/3.png align="center")
    

### Konfigurasi VPC

1. Aktifkan DNS Resolution
    
    * Klick action
        
    * Edit DNS resolution
        
    * Enable dns resolution
        
    * Save changes
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyzQgJ1cKbaulHLSQuLzBleYSpsxeUYNZDxuDAQ31EOqewBIEU_geC0cLFTJalftJ0p6oWvbhZvp6p__Y5AfHOeUI0pm4vPsgaOogkfRxup0h3KhTkTaAcSLzfGZ39mE-InV3kv6I6dG9W8zGJA4PfRXiLcsDdeYTnuuH4PPShyOdb5QSrDL19jkm2pQ/w640-h243/4.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhTZOIH0AZXka_62JZNd9f8XH679oiawquW7SAl7wUHOdZCV7R0c-2Mrb2TvHurLjPq4CDaEa5vngrK0NUVUU-P0sTtFWuKY11dDCdg0qhcuQ7NTIir6vZS9HQpbCj8LZbROdzme8A9NABV6p2r2Phokk5p5mt7_-ii9J-g9EDP-LCtU_r4GR-nvr4Bhw/w640-h388/5.png align="center")
        
2. Aktifkan DNS Hostname
    
    * Klick action
        
    * Edit DNS hostname
        
    * Enable dns hostname
        
    * Save changes
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEghOF2Wq2S6511G2jZd1Nj0tbfJMMtlKVGSVtFJvQNEHRqCS41-mPFQPKh7LM9xtdpSgMxGQQoqAFK5bV4ciYWiNLtmt_GAj7dheowhef_05HoGMKyazmi5zcDLxQ9Ou9ASHlre1F32AgU_Em6EqBoe4xEjUdBtpi3vCaz3yO-5r55WJt1-KwE0oR6Ykg/w640-h234/6.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjsfmKVdgciXVei_5kEtPziSXKwbMtoTy3ch0myrW2xfr7SSU7BL0MNDtduG44tazGhmSzfxk01wW5guAFq0ZWRhWGkvv3U7phqT6Z-kw2w9Gjfkt9KhBoK8PRpBLhjDSqHKLQsDhfVkAyuu-tCu_H-g3-9fBtreEo9A-iEWy_vcj2xN3nE9rpIFZDqg/w640-h404/7.png align="center")
        

### Membuat Subnet Baru

1. Buat subnet
    
    * Your VPCs
        
    * Subnets
        
    * Create subnet
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh501NtduREZWN_cqfpmA89lQW0C4t-Zew1sxJ6AFPr0PGSqP8vkF44ASAnMl7xxqGTir6oCCBCdVuPSpn-9TuqpvBnTCTjTOwGfyWgAvhV2feAn1ZZd2LMhd7d9wywEb_dpfowdTMi278pyRgA0je2pb8H7pJSKLpQ6F3nGMXxfr6TtTqjrB_6AYQH-Q/w640-h152/8.png align="center")
        
    * Pilih VPC ID
        
    * Isi detail subnet
        
        * Subnet name, IP masukkan list subnet yang sudah disusun diatas
            
        * klik add new subnet
            
        * Isi semua subnet
            
            ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjco5Ge9j8ttMwAyJ_tWBgn7bY19U9tSubZTSM-kAJa4HFhI05xHbtbZSAzjKhQyA8lNlTFJeRCSR4t3_3ng2zRl3uju1loyb1N86AJXthqzFEdX3oTRgvUj0V4Yk-bGtMoZegEvmypPBAYA2kfhlmrpMyjf6eCay2t7m-DS866oaGMUBOa0Y-VDLLNLA/w640-h290/9.png align="center")
            
            ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikJBWizyKPl6g5cF_YJO7qwKrF-sGc5NncHuzua8XI53OB-6hcz1qZNv1xT7QiZBzEo0PrumXWN-gRlhCVnPytE0chZ4uO-OE4PTjLvtCOLEH1Xwrunb_lu6PGI0VEqE9tUER41RLx8sSKB0QxvXRBVIcE9ppF-K_xOkFhYh6xQP8xQ2eNdzphjxb4HA/w626-h640/11.png align="center")
            
2. Konfigurasi subnet
    
    Enable auto-assign IPv6 pada semua subnet.
    
    * Checklist subnet
        
    * Klik Action
        
    * Edit subnet settings
        
    * Enable auto-assign ipv6 address
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgysBGYsLswpw-JshRZOYDP719Pyd9CBmGPv37JU7FNyEkxLAyvHksvHI4CkYQRkzgjQkS_hNdziv5QNKn9F-cpjZBhFwHWYGt2RdwN0gG7qZve1ATw5RCqdbYLeIbLpQopuCN0NE43a4MuoEupGEYXT_idTkNaWEulG3T3aXPOJmVVoK10QWjVGKtyfA/w640-h188/13.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgUiDhp8rAqydmL7pqiCiPZfhrRqclhINea8DMZ8vzixHmD-ovNhJkSgKfwqy6hVuuq9zeqmqEtyZUbFwUtvpWCyiMqu2QwzX7coaRI8lgplFmgnwtdW-Ap3w2sYiB7uFtDSUp1TpSYzp3VPDR_3IVFiYHQJaIV8N4SHJjxafhpmTZVIq8-xgSsex3jQA/w640-h516/14.png align="center")
        

Thanks.

Terraform code: [https://github.com/ahakimx/terraform-aws](https://github.com/ahakimx/terraform-aws)

**Referensi:**

[https://www.site24x7.com/tools/ipv4-subnetcalculator.html](https://www.site24x7.com/tools/ipv4-subnetcalculator.html)

[learn cantrill - aws sysops training](https://learn.cantrill.io/)
