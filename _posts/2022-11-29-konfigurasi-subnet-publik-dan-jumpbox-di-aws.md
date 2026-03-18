---
layout: post
title: "Konfigurasi Subnet Publik dan Jumpbox di AWS"
date: 2022-11-29 06:49:31 +0000
categories: []
tags: [aws, networking, aws-networking]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/NqOInJ-ttqM/upload/dace69ee0c97fb44abf2d79e0dac8e8d.jpeg
  alt: "Konfigurasi Subnet Publik dan Jumpbox di AWS"
comments: true
---

## Overview:

Pada kali ini kita akan membuat public subnet dan jumpbox/bastion host pada VPC yang sebelumnya sudah dibuat pada tulisan [berikut](https://ahakim.hashnode.dev/implementasi-subnet-vpc-multi-tier-di-aws).

Adapun langkah-langkah yang akan kita lakukan adalah sebagai berikut:

1. Membuat internet gateway
    
2. Membuat route table
    
3. Konfigurasi route table
    
4. Konfigurasi subnet
    
5. Membuat jumpbox
    
6. Bersihkan sumber daya
    

## Prasyarat:

* Akun AWS
    
* VPC dan subnet (sebelumnya bisa lihat [disini](https://ahakim.hashnode.dev/implementasi-subnet-vpc-multi-tier-di-aws))
    

## Langkah-langkah:

### Membuat internet gateway

1. Buat internet gateway
    
    * Buka VPC
        
    * Klik Internet Gateways
        
    * Create internet gateway
        
    * Isi data
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjoQ4D1hXdgkpMV3wbjHSSAdJQeYSzyzvkc7T7feMLuZDPelPtFbt3v4yZoWt6sNpKA5upy3uCEO5Wd0rtt5ARhSWJy_YOpYI6KkQI2xjVdeRhZY_nSna9urCtBdWK2hc2H7AmKfN1qWSVPNjsO5Qoo0Mfvgd5F18rI87eYjLv_2bhs59JzhVM_wUgHRw/w640-h186/15.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgTYgnAmgdaB4O3bciZb-HFEoUaWMUNoH7grNxg6To75E4c3_4EkZytKPNwkKE5pzq76H7sKwT3Av6ygqOl_XHp1lekOrtknxIGdulFr1uw_XXN4ZZQxGm-pVtgyHj4q05KFZno4ULo5FU2L7kcf05-F8UvbfdZpazAxOTQWh8PIGMX9QxOujQb0F9MOQ/w640-h482/16.png align="center")
        
2. Attach internet gateway ke VPC
    
    * Klik Action
        
    * Attach to vpc
        
    * Pilih VPC yang sudah dibuat sebelumnya
        
    * Attach internet gateway
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNaPNIVyB_KFqmNqoOQat2k9ZVPVwZquOm3ddwlw0auInijIVXFW4MRniuPGlv7n2zCYndH2AccvOu_FTEplL8OiHNLh9puuwJVF8qgDxxy1R-QqJmaM3Y-QhGyOb9zw-kktUUKQZSZakHI9CkU34gCgq6cUMxHkaJ40G-RGoaBOgH-enWG0oVhrWFBg/w640-h228/17.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjqeu9C5TToSsGF29el0urjFuE7tgvTBCVmXEKgtqz1GtGaDbC1eCa6IINWd3neYl631I_2KKUIA4UJjmYU49wSpdeP-jyYEI4WPpJgAn0UvRzpP9wasMOPq4GPJ6MLkXcw1DLMhFs2MW7g0Dd-bIZDtOmwH4__0hWRbo-nYSAiZDxZJQ3nEtT9e7pAg/w640-h322/18.png align="center")
        

### Membuat route table

1. Buat route table
    
    * Klik route tables
        
    * Create route table
        
    * Isi name
        
    * name = aha-vpc1-rt-web
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqVcAIPpL8gVKF53OA9GVoiOd5lwvlonApDRXd2QuVDYworyF-kxv9lo3FHwY2wzoBY67K0cUqruRiTgtT4xRlurKgdCxC98G7fxdpNsYMAMO533PtsiPOuC96bQpo4yJk7ycVy3kL7X_B9gZeEDzALh_MQsPfhACiZa2PoCR5qL96Q0pIVk6-MV4iKQ/w640-h168/19.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKLhBaH3GyeMMIG9HQXQDzsMvBmgkRL-M1llxJCuYP7fXLzqjXizXClY0nZthlgF0AYqbxwk_ShxqjAStwsnehkfvwguRW1ejjy-EyPOE-fXTI8VCjI1LiCu23sISUuiCq1BhlUC5hrXtdvJwppC9Y3zuf79p1I7zMzRT-0qYOt1ssXnPp-dFJX3tfgQ/w640-h526/20.png align="center")
        
2. Asosiasi web subnet kedalam route tabel
    
    Selanjutnya yaitu mengasosiasikan web subnet sn-web-A, sn-web-B, sn-webC kedalam route tabel.
    
    * Pada tab subnet assosiations
        
    * Klik edit subnet associations
        
    * Pilih sn-web-A, sn-web-B, sn-web-C
        
    * Save associations
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSMFm7thXl1UZVBxm5cdiSKMcSsRNJySXvmrSY3m-oQMlAIvDRvLW3QKf1h-Oldk5LkESESTF1kVqPeXTxdEGkxTRlDMru9odZSsPbIKF0tSxvk_d03LINaY9_wK0SuMOlx0ei9P3bAAdJhA1Xyw81uCr6gyhQ6aMcCYAmqg4U8ep_I_7rHqlnPQ_nSQ/w640-h302/21.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvSjvz_usxs7J4F7BOtloNG4VtanULzJvet8HmmfY84rYjnDh5T5S_kuxOuOKrs3xvdxdWljlT5MqGhmhWYprJTFR--XnOdC0fCqRPdGLbSS-K_OT0NB5yQT3tzUJinzilEAL-XlAXNfogJIJqYIEPApHPV4pf2hoPmaJoS6surHkrYbirkwVN5Yl9BA/w640-h210/22.png align="center")
        

### Konfigurasi route table

Menambahkan untuk 2 default route pada IPv4 dan IPv6

1. Tambahkan 2 default route untuk IPv4 dan IPv6
    
    * Pada route aha-vpc1-web, 
        
    * Klik edit routes
        
    * Klik add route
        
    * Destination: 0.0.0.0/0
        
    * Target: internet gateway aha-vpc1-igw
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjBbQhHKkICxuctnhmiYvI6Ndso_URt4H9nQs06-R85OBQF6-AAFyjNOSPM3Mp0AAZiPA4yc02LczdYcnmpoUkTtF0flaFuua3ZrwsFEI5aLqseada66laqVp49n_j-eLOGFC2WrDk41bvsFKw0qkFjieSnnP0DdIkQtEVpophNFO-VAa3pUJLWnMrMpA/w640-h268/23.png align="center")
        
    * Klik add route
        
    * Destination= ::/0
        
    * Target: internet gateway aha-vpc1-igw
        
    * Save changes
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWpr0jcEmJuM18NPpM38OYO-HT-JQMW-RcG9MA-YGJVwTiQ3X0j2J6IySfNyA36j4dmh-5kBhg6L2JsYqnebgi0uiJXDQ8ejP_SvOUjj7cwSWYAEyNDMAm1-0sydp7FalcP0ZSGY60T6DLyM_6Dz22bFlglUMhagniyUXWZV6yRY4EasS90XNpROGwgQ/w640-h208/24.png align="center")
        
2. Perhatikan detail routes
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZ_-oy6y_XW-biPrgz6bIte76-oLCQviqKWT--5YWIESBEna2Q4Pema22yQJbCaS5wemUo5tqK9an3tZt2H4z7PqrBjhbL9zW_WLOvL1NkQhQ7euIbPA8dGwRqzc0xz-zrjn-6CUi3j3_vDNRs-pM0IYv_le9BSaoJn9-82kA12nxiPSO7HBQO-6NrOQ/w640-h176/25.png align="center")
    

### Konfigurasi subnet

1. Aktifkan auto-add IPv4 pada subnet web A,B,C 
    
    * Pada menu Subnets
        
    * Klik sn-web-A
        
    * Actions
        
    * Edit subnet setting
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhb8y1j17vc0wDTbeDYCtVzdTGOhdKZzr3hebiHrT61xT18dP4PNbT0OctZu3FV1LwDoDfz6rjh2pX76rqryY7xHfL2SQ-b-Q7R-rYTdt-rKqouBrIZVQ_apz4X_iTQs0DtAYqtu6DvGLSFmVAB2K4mPZ1TfV22pPILRb3hmUUoZl9o4Vx0vPK-oUO_gw/w640-h212/26.png align="center")
        
    * Enable auto-assign ipv4 address
        
    * Save
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhy7BZq7x3dsnf0Us7C_2pTema2GF4viM978YqcXrxMnXckhDbUkKYx5fDeo4lWMv8ac6sMjw9XU0ffLbmzWzJPX5ahgRZ2caWpP9b1ZcqLFVbC48vudIiy8IGBMxH7AdJoCE0WYV2zAQdV2eg_ry9XOV_ywdp9fHLGiXZb41lXtrRTT_Ig6iUR8mfOaw/w640-h328/27.png align="center")
        
    
    Lakukan hal yang sama sampai sn-subnet-C.
    

### Membuat Jumpbox

1. Buat instance jumpbox menggunakan subnet sn-web-A
    
    * Ke service EC2
        
    * Launch Instance
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjndz_dIPkG7li3tfePgB2848vanLt6QVmDLPABcjL3_Hllx2ny3cM4pBM0iperhF5TsegeMtMjbeIVm1QuHryB-zmhE8gUIVzvaj1w_ZSguKu0FiMLvTLAfUZzAZ4A5vhPUvEeCgnXN90Gp1jV4nJXqnUzkIO_oWjuZ8oKxAHo1ZZdTp263agCAr4jlA/w640-h370/28.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi__ih92Dx9h_To9n1smdCXucOMmYEJfodK9NvLLsj3l-Re0nUY0vi1XkCDVrkHMY4gwKiGw3RkHbF-9zlviQFalQgE3XTfYsXya5UCmgaIF1rmEzdQLmNA7lcyX__G9vlxrQcTdwpJP0q8RTORbIqjf_spPvzG3z1MhT_KgT9xmEr0Ddz52dy1lD4eSw/w640-h368/29.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjuuSBBaOZfFVf-B76GwbcG-nvweeK3lLLcOSLQg9G4XgvzJxtRz33DFqMSguYAJ6r2nJzeGL-NLV6US6u9UJ8VPPIpx4atrVdU71ZHn41-DsRw_G5sW5xccTj6ytYDJKCw_1gI007ZcT0V41Bks9RDM131bZ5k9JOTDCO0xIrwOGbL-10KpemVElWNcg/w640-h304/30.png align="center")
        
2. Lihat detail instance
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgnHZSvc_BQ2KpSci0VXp1JDWt268ovBv3SJXuYHX9IdxV6iTpktFgJtG36vvd7Uo2DT2XMYZNmemczVvhj6ysOyysbHbem-PAznl62VVguEscjfMUGoCbi1sozHoIUChqKYTcre6_tirflP6L9B_ahLcwFHuedQdwZ9xUIyeqLWymNjCP2cSPG-cICBQ/w640-h266/31.png align="center")
    
3. Verifikasi dengan masuk kedalam instance
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4adfNmep0e5hXay_R9sQERDjJtpQj_XWW9-l_xKZFeSG2W9qI7hdpqAHx8h8x0YlzypRDTL_6nxethXe0k6SKsuyy5NtKcf2CJKqi-7cHoynDwFVQ5C0E0G7IAfOIufMBmQ7e-wXEb5BHph4bSehlWPD1mOxWD1GSGy6SKXgSccuidEJMgWRfYAIu0w/w640-h136/32.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1xC5OlU7rdpYPnIvmpYLYACohrxtU4GdwguynsCClm7uCCpJQJlj6RRVh0AfXIFMF5Ub5nM2FomGxgZKdyBbjvsjz96deGF1dtm-MMvPYWYO3sRaHTESluSDQa2gfN1pNE30TJn0tugNvB6IvJTYpHf4Hjjgdl3zMI68ZIRh3-ndRzp2N6QxPuDf-WA/w640-h466/33.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-59qfF9A-9aYpm6r82J-eB6KwETzFtVkLTbu60W-ed18DD4vOr3FTHw2EfyBsqk4D5bjA5zCBeLOFAb14FtdCKSwdxQ2nqRdvzoWG0NwyzEy4RhTeEDMkXkPAGsTvsVtumubgeHzQifk9Ec2nMBqpYgB9r1f6o8iWq5HiohV3_BudozCByHtSK81sLw/w640-h234/34.png align="center")
    

### Bersihkan Sumber Daya

Terminate instance yang sudah dibuat sebelumnya.

Thanks.

Code:

[https://github.com/ahakimx/terraform-aws](https://github.com/ahakimx/terraform-aws)

Referensi:

[learn cantrill - aws sysops training](https://learn.cantrill.io/)
