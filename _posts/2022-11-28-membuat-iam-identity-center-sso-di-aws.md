---
layout: post
title: "Membuat IAM Identity Center (SSO) di AWS"
date: 2022-11-28 15:51:45 +0000
categories: []
tags: [aws, aws-sso, awsidentitycenter]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/rBW861ic2Hs/upload/b5ae45a0d969696c8d5d3469cf582ba0.jpeg
  alt: "Membuat IAM Identity Center (SSO) di AWS"
comments: true
---

## Overview:

Pada tulisan kali ini kita akan membuat IAM Identity Center (SSO) yang mana berfungsi untuk pengguna external bisa mengakses akun di organization AWS kita dengan menetapkan hak akses apa saja yang akan diberikan, kemudian mencoba mengakses resources yang sudah diberikan. Adapun langkah yang akan dibuat pada artikel ini adalah sebagai berikut:

1. Membuat Akses Administrator
    
2. Membuat Akses ViewOnly
    
3. Membuat Akses PowerUserAccess
    
4. Membuat Akses Billing
    
5. Membuat User Baru
    
6. Membuat Group Baru
    
7. Menetapkan Group Billing ke Akun Organisasi
    
8. Login ke User Portal
    

## Kebutuhan:

* Login menggunakan iam admin
    
* Region menggunakan region virginia
    
* Memiliki AWS organization (jika belum bisa ikuti artikel [berikut](https://www.theha.kim/2022/11/aws-organizations.html))
    

## Langkah-langkah:

### Membuat Akses Administrator

1. Cari service SSO
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOaE1iEKP-UkvesTcssO27oqlmyqva-7kcxs5ee-Axf-0LDs7Wck5FX5Ri7lsw2drJ-zKwoDQ2UnH25Gt_w0WLw07uvrasvmU0l0iTGeOXhWe2NOiwe6T_L90zbav1J3wFKFmmfpRQQiycW79ZeWFL_fByLK08Ecz1lFWmYS-FW1pdK0aVNGDxxZIVtw/w640-h342/1.png align="center")
    
2. Klik Enable
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi0WqdRGB3-6neIFy1TC71eFsfWNLy5ktYzACiQwoTeUrhsvRfGMgoFGY6STyue-Fjb-W7ER8xaMakRvUqDB-SgH-Tx5w2QLvCYR5m6XqZAnL8NGTMw510R0720P3QdAzNX_QraNi8AMr9VhKOuMvFFIUkPxrBrHSdHxD1v6CTmlq88jCHLAQo12tPKBw/w640-h244/2.png align="center")
    
3. Pada dashboard, klik customize, untuk mengubah alamat URL
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4j6TT-enLPeEvKvCXJNT7Y3wIIaX0vDpPooZqEBYkYrwvqOFDwVxAWhEWPVD2fFkIhGdDpvC2nkJOV36PQt27T15RNlNxkFnPWDGPUYfOZgFw3gF6gYhcklutQ17YtX2B7oq7-rDt9Gvw_STLENkfXuXcJB7vbmrWAYj0HXpMSqNcIl7wgX2tG9fByw/w640-h240/3.png align="center")
    
4. Isi URL, klik save
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjPcdMcpKOOeSu5UJn9cHBQ1uIiepypobN6A-ZpX8flHCpxFk36AmbRYSizlGmtJcm5ERI1k6OzLCp3pjd3oDNb6bH6qxpxv1_qtss61-GBHHr4d4N-Y_dlCogVcI-7iL5ApUWJuTTChtBkQxN8uMUWEHkWYzRfXJ_eYJXfV27rjU7rgbZtk_Y5mM5XBA/w640-h410/4.png align="center")
    
5. Pada menu Multi-account permissions, klik Permission sets
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMgc5w47pPHsl7KSWoFZSv8M6a81vyzcY9GqQ8d84-rrFu_icdLb10ybGserjXGPHA4bsiuZx1shGsKJdcbp4sa4owSh1Z6xSOJ6Wu2sP_ClBYFlolfhy8MxgU6XYp96yQVkw5lcgEZ6mZLW1aJEpgOI8cA4lMmMIYUaor0VItopBDoQ7BnjPGmDdnjw/w217-h400/5.png align="center")
    
    Klik Create permission set
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhNk11GTF1V8Pjiwbs-o1RmM8oUqpR9-sIhettMJ7AYsttWeZ3h_7uNtWhbAwuV0lLrAE5Zh7mL6ki9SglIxL7Q6Q0gmYaPOjmzqEdoFXIAfS3FvIMbIm1CQH5bzxHOjWwm7sHkGtOG9_5GPyi61cntqvl37cNqGvZyL-Jg76fpewhckHRN3sK13n32lw/w640-h248/5-2.png align="center")
    
6. Pilih type
    
    * Predefined permission set,
        
    * Pilih AdministratorAccess,
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjh-6ksm7ajufXNSoEfq6UY9d7_qbcNspxM97OrPNRlVDg09qw7kSj9j_bgp9AmMqSAMbrwkdOgzhWbUomqIafSUVLJiex353naiYucJ5RKoJEIdDSdNBbJM_6pmtguBqzw2jgXEvKyXaZmVQdfPUJMV4fpBYgLvmaPIwJ-XJKTAoUWNRoEl5P2VLGoFA/w640-h516/6.png align="center")
        
7. Isi permission set details
    
    * Isi Permission set name
        
    * Session duration, 4 hour
        
    * Next
        
    * Create
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgazvT3cVpsjek5-4EX4V2xDGvdotJSkq6DMESXg-B3sta8whOHHm6l8mttmcNj_3IU69OSTD_yjlNKqETISZc0leOAndJ158pedHeAswUjfm-9LIGgdBPiIpH7p0ELiGaI24qHFi2c0TdQR2zODiBKMPwCL___uvIhEpjffLUbCrbSnUhepyux1AN_Yw/w640-h510/7.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXQf3XN7DLJgCvS4oybSZRfVVSarNlcIEvhqHsUFkRZLYi3o5TIW8CouiUS4i8oi5QYcuBHWxriEkTrM9e4XvStQX94LWNi4GGLAy6dGjEU_WN_K78PtoL5BcK7aApWb0anK69DAXJp0sdL48DryIEmEktHbmp7W1YNAEeopy-KcoLL7jvHYGWjgpi8g/w640-h448/7-2.png align="center")
        
8. View Permission set
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMZP82LzapCGuS0O7dUPA057FIkOnJdpf1IZ8J7yGB6RXzqsXknGI_w8carKCYEJ-7yRBWVHkqHB-u8OB97AIx0UCys7chHCL5l0OD201kmH2ER9TrDHnS3E2kw3apuoFwtAeptuyipqKHubWDPFQbmuqGCc8gvUkKpBD7m4-dpCG0UtparxEtvB3ndQ/w640-h224/8.png align="center")
    

### Membuat Akses ViewOnly

1. Create permission set
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5sqhcKtPghZYi_jCOMKnm6EzesJIWgblR-fDW885HHYDB6HdnoT9xwsVIGKu1P3zIM9qGUrsXzP8IDFt2Ro2ZcOqk_2ioRRxqqUOHbnreRjCEJfKqB_fPX4HJXyk0nkhdMvTISEQBfmpUXhTvVyRCVfarfU2FqUkJx24khsTs_L8wijBHGxk3UgeP7w/w640-h218/9.png align="left")
    
2. 2\. Pilih type
    
    * Predefined permission set,
        
    * Pilih ViewOnlyAccess,
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyohN4H_-inCPTlHxw9Mmf3yVaeAsxZBwPhZ0jxi0292GUwsvvz-ar650cYRQQlksybgNEJ3-UduhBiadzyv8o0zaEj2-Ep-mYs3-Yi7ZQGKnMeXKdX65ZWAFOV809eErnKNWcE4fJ5JogiLcIVQ3Yfo4CqSeddK_4JZJBj64JWr-2k_krWmAXlq05bw/w640-h334/10.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-TGw75WApwhWUUyx4SPTeNFAKg0sx9qUduGkdvntthfZVLZO6PxRl2svVVtWaQevT1DXhtxItg79SxYPpmUYJsAwqDg5zb4rjN0atP_bAATuHEunlSmwSJ_ltYD0m2tp8BbNOdVwIcIly9H9I2pu8JguzzUyN_3MtJJhEdPZF2vIrBZvdZcSkmGIVjw/w640-h276/10-2.png align="center")
        
3. Isi permission set details
    
    * Isi Permission set name
        
    * Session duration, 4 hour
        
    * Next
        
    * Create
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLbYEiwLETNci6WH-Xp6jlb0zaZtp8Ru6boybr-kuJvN0xiyBX5rH0P48zBlIyebbTcvyE0MNASwa75usVja_PsFxKrs_SGDPa_zWGK2tiCdaZSTjvUyxIh12yPU0z3PFUx-eeTx3ZXd9_Fs0h_edAA7QRJU4xW6DzmcCRV-wS1HbdN4uVKfbxb8Vydw/w640-h512/11.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjdPqzkASUPjqGfWVVRvnR9mEavvEQJR80EL-8zh7XFPPISElFtajcQx5ZEyGoThggqKpuikNHmwqdGqqbzszVR6nJsGSiKHRRxb3vU-SAcNv4GjPbDGrDdW5LZ49WhBUahv8bzpqj7iuKCWAxJekQvv7SzJlcbubSxrZ00UJ4IY2-IVONrYhLrZeHl4A/w640-h238/12.png align="center")
        

### Membuat Akses PowerUserAccess

1. Create permission set
    
2. Pilih type
    
    * Predefined permission set,
        
    * Pilih PowerUserAccess,
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvV9OY8h-g3gCDVeOq1NwFoKVvaA5S5wEaiFumX0mRB0qCoohd9qKNot6mN9bBcou1lRuZQdX6C-NhBgHYDHZ-0zDrWYFCx1_PyKYHm349nAcw_5sbpVz1q0E5AKGVmFkA3USZv58lo6Ppe3OCr02m1_Ks5eWxuGf0Oue7wCXkyGbKDzP6v0ccgB736g/w640-h334/14.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhuHMjD7LDVYqhNFz22WwGzWn6p8EfwZDKPC9v4bk0NT1yU8jsRKA08-dFJ4tJcn4PWqPCspaIgc7eacSbyidphtWV9qzUFqkD8cpUw9-mzh__kOJhS2SlkX2raw7o582CtQOmdL7sdJn9cQcSci6GjZVdXiKFEf7cimR_Zs-_neJV-IN-SQPACW-yGBA/w640-h542/15.png align="center")
        
3. Isi permission set details
    
    * Isi Permission set name
        
    * Session duration, 4 hour
        
    * Next
        
    * Create
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhc7tRIBp4NCfJoI6F3r98edXEba6bXOEBBZUyILsET9YSdpM8ArNg0ikIFSNqiYtixWq1CABQo2xGiOW9C6fOnVnOpB_YcZk8E0yN0kQ7h9BbFsTo54mgNWixZf1BP1pqIDKSgJ_OILEOXfFYQjjHO8e6-82ncs0F8Kni83CGbu7tQ4uyFgSDKGgOPVw/w640-h512/16.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgG-Kph7S8YSF37V7M4_4PEFjVB2YUbbwy43bZ0q_M3m6a7Fj1xFx-MlmnfA7RiBVxIstjTkIGgw5EzNAd9OcfhUHdNZfmCiWU4CpDqG-_tgGRNC_hHjWMCxvNiNUDgq_kYYK28SFLGZLHWKdpFtXCi4wITsSxge-QwModjBxaLIqnSVD2n8eN1VPNwCw/w640-h238/12.png align="center")
        

### Membuat Akses Billing

1. Create permission set
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhKNMaZAKOcsolgaJhg7wiQ2FIwHyM6_tX2Lgs4DbJS2KKPuQ3JQOhAcGr7Tcdw14Td51Qm7jz2FfXZSRlG_UGYutbS3h8jDKXJ8To-Ph1qYYPMgJR8TX3xTKiGsHLHPWm0mdO5-5RXTO6h5FaWq0Xq2z7QN80nICB8zcgJvqvwrUjXaK-YNj4IHZHP-A/w640-h258/17.png align="center")
    
2. Pilih type
    
    * Predefined permission set,
        
    * Pilih Billing,
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxEh9QG3BXbo4Q2bxAtHUtrUxuLfCSb8Fj9bU5RidqVwr6JdLTusYl0CGEJdgk3WUaKTEutE2-BwIx5BRqUEVOoEArj8oGXqLa4nGZos-m_3DSh6yggErWmYCzOB9zPA7EwoAfZPy_Vz6kOARUkkJjOcEv3DxiULD2fyprODLB3QoGcXgUh4xy1bEe6Q/w640-h334/14.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj1FtPWZNnJQOdb7Uw79W6SIkI7bPZPrQA1iHxC-_e6XeusQDI9Q_AH8fwdzyxqNly1fRpN44VhL9OyASwYs1TramtY34nyKRvK74v7ExxZd-IcqFDEdu7olUiJPbd0N1wEyN6aNVTFfRacyKDh-xF_uhSVQUG_LkbLnATovHmKNfAGydozh_R8KUMf9A/w640-h444/18.png align="center")
        
3. Isi permission set details
    
    * Isi Permission set name
        
    * Session duration, 4 hour
        
    * Next
        
    * Create
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiV7opCBiBbgc2qcfFSvwSQuCuGNPS-EfyBwbfJVChLFY9CAiNCn9Gh_BOvtaQlAq3uyk3ou2Q1sjD2BRHc5IuW9IyK9rVOuYaIy3GS7d-NI4JFLJZMXh6pv92VBQIQ9W3jvmTQKF5T6KRW63Je3qRxCxX1UEAnWEHIkkvsXoJvKrQ02Cq1jCj85xUJYA/w640-h500/19.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgIOGtMWnLGQx4wnL7EB5MeKgJFvAPmhF23PpJz2qAEZOISIju1QSceYKjod6FxuyoBRmssVhDzy8tbFKj8l0KArSowPmr4kRaEPSovOOS2PY52GC3DmBYtJEmTl3wa_AKO0N_LhpdO16yQU0ocx6f4qMW5xKlTH31kf_ZwptSBkHLDAsoJC3SnMRCdew/w640-h238/12.png align="center")
        
4. List Permission
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEihEkOXmo_ygQU4gvtPRh6wyzh8qdtsT69xzrCnMolD8_ZR7ypZ71ym4EILa3yIl5FnPfigAGberl1MOBBXLFD2xdIDgcSmdVJMYqygCuKRPpcIya_q55MOD34lcf8nzJkAYuGJ5j9jlcscTFcLZk2NqsCTxcDcLOGz8iLosq8JVyD0EsbYQ47L28K1gA/w640-h272/20.png align="center")
    

### **Membuat User Baru**

1. Masuk ke menu users
    
    * Add user
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2BAJi57a_ouHdLoRo4t_w3wf3PCi0ke-lS--Fiw1YAfOD8GYfpezylYb2-UVX_ZotxMYtbwr257l33fmhbh0DoPs9fJE65Vm0SCGQD3KxsXjv-q9qO5bPN-IL0tUeiOyC_xr6ZdQ_i6k8Q2puV4bT9JuGyJ85nNM4IR2NHZKy0uitu449ojfywPKl5g/w640-h154/21.png align="center")
        
2. Isi Informasi User
    
    * Isi Username
        
    * Check Generate a one-time password that you can share with this user.
        
    * Isi Email
        
    * First Name
        
    * Last Name
        
    * Display Name
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEife3aFpTFKTCiEqvlOK_Cbv2MqdXR_Iw5m55g2mFJJT8rrcElHtMtD9_1zWf1HjHmiR2cIJbhjL0_aSaEX3Um6v4BMF9vfhvb-vGe2OtR8msmFNIu1NzhjCl2h8Bwro6ZHjesUhT_oiXeitpXFu7NYZYfRuuJw6vvLIWBF50MtwBWEeb7ngbzuYvhcFA/w640-h554/22.png align="center")
        

### **Membuat Group Baru**

1. Create group
    
    * Isi Detail Group
        
    * Isi name
        
    * Isi Description (optional)
        
    * Klik Create group
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3oZMYYK44cZZBox5wOCZO9BcpfQnBAyIAZy1dvdt1ISsqkJcLp6oThQ5XSR9rDZ180O7PyHQHbGLKMs8kZDkK3J_O7dSx8fGOAOo_5GiTTAyDNI0cz6NKu3KuyPGdIWpoZhfo7xqH-GaJtla8Qnr7UCC_MTWxPo7EX6by0z_kNQ3IvjF5X4i0hOgCQg/w640-h318/23.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbWPUp0xuovzBNndEPNUjPRnKvT9x702EJkbyOv7FvuGQoyYW041fHhv4ekPQvuhSLECwM8M4rK2MrDnhyHOkHcfA-0MGJEP0UpD50Q9E_t8AibYMxMpohPKaQmVEjmr6RDMhHhAfEWrG78SwDHiXk4gK8hkTgd_2m5Q6jF-S4QrhFM3iwx0X7JMVF-g/w640-h388/24.png align="center")
        
2. Kembali ke tab user
    
    * Klik refresh
        
    * Centang group billing
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEji3jth3cH3wooGuEWjbd_-lKMP1g8gbIqsHmwcQ9BdIfxowkJP7Nl9723kZTbTZdbtaa_9tRNW4-vTFwP7X6YQiR4gCxoI41D87hOpzj2W7lpeWzd6LqlLRlWHmBtNQ9f8ipAeETaiGRVto3-qjbPPAG3aHJoXXtjz_3n3WHO2E34YwK7zUHvbsu8d8A/w640-h234/25.png align="center")
        
3. Add user ke dalam group
    
    * Perhatikan group
        
    * Add user
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2d0CpRHQrOIX6FPY1mpy9TVZP0ZMkYMNJ73et1BaYoxlQFHnfTiiW62yf7jh0fIiyb-noqZODqC2UcDbsxSF7nTKiEggAuGFFn_AgZulvOfdhq1Sc4iWdC8xXvaILWV_elRcLz1YaLATBrU4UH__3vwhF9257ikzAoY1YGUzJ1Hk5fDLtO0JMHQ3YfQ/w640-h522/26.png align="center")
        
4. Credensial akses login
    
    Perhatikan dan simpan URL dan credential akses login ke AWS yang baru dibuat.
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMSd3wsI4XtMORYFistSubDb-Jxo-QFHZMepgsS8wIQBY--DJXHW9796T2SGriT03X3kh4qdqFqDx5b7DeAtdMH4KkbXsMLMUIPJrao5m5y09L_4jqIQ__V_ZEqzOCaJPfGPoE3p687z1cgK2atCrvh-YhudwGiua0YfN0J6Rjk6Q3yzKfi55H7KgOOA/w640-h586/27.png align="center")
    

### **Menetapkan Group Billing ke Organization**

1. Ke menu AWS accounts
    
    * Pilih akun general, production, development
        
    * Klik Assign users or groups
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgRPYVCaxMsZOYPpcOTjYo_9ciohuLmKFxrXZGX82d5v3IPqBDXxXXBdUAg54etvuonjo-VDtdHcG67RxRfyBmDgEemTtwL4lYL-ih5g0bgV2Pm_AkjLImHo65yFFGqLuBh59PiBe9T2S1NiC1IpGAs953mQXz5uUjWAUPIWEWDIhvqViLTSO7TL4Jb9g/w640-h238/31.png align="center")
        
2. Pilih User
    
    * Pilih user hakim
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirkyfUf8latbpVYUrQC9xjzP62P470syq_SR6TV9Atl_1_uYY1MzpVDR1nR9_WLNTw-vG0oS-La3hqz8vsN_o-dppbkUtzh9GxljPr0VkBWW_TtanvFvra_usU5zsQzWk-PIRX8pXSB9f6zub8qRwL-PnNYUPmtJ-MHQPaZ4pwwcmgsiQo8laAWNFr1A/w640-h318/32.png align="center")
        
3. Pilih Billing
    
    * Pilih Billing
        
    * Submit
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJucupE3LEjm-I2QCu0s1ZnXT1T4o48IfNVjz0V9oOyDvtqqNB-D9jnd-Oe5USqjDwZa-kJ7zYRHY0iuJkfayrX2Re8jG3Y7IGibJzjRIFYZKuLiXzHa4WLnuaLh0Qc_Qv38ZQ2af1b1LLKRsUOdG2m-2_nJDTbkM4CCwGAbjdqSLflAxAPd5EkBGaLA/w640-h524/33.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEguD9yNqsWFdWJ0HQwykaKxrbW0uoOrEvvC8VaQpvw6WYTT-ThpkqQyiwZOlPnIrEgsSw1_cVoejm2JtQ0INnQ6lmfI4XVgisWcyYAWk-VzK1xBS8DND9aFF6lPQwAPweM8rAMrEbxjiPVlZhGys2wYSXhCIE8AkDiURz8E7aXxnoAW9DzTmmpNvXYQ7w/w640-h472/34.png align="center")
        

### Login ke User Portal

1. Akses portal url
    
    Login menggunakan user yang sudah dibuat (lihat pada poin 4)
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1RrYX4e3JtAUpGd1SbAPMxGPlhaqqIarx7KOuiS5qjua1fQbAs4rQ7na1U2DN77lvm6VKCPoPyTmxiXOHm1NLFCvGbQumVryQDZiQgLSzkmZD7uNAsw__9_u_h21F3WALdp3LxMahEknV0xwp3BueoR6TVzahn4LM_33l2Zb34cJhLiAZRORwKm8L-w/w640-h556/28.png align="center")
    
2. Perhatikan aws account, klik management console
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5XBdCOD7EMt3mgu2m8y6qWbgECMltXNiJr89vyk6fuWQ1xlrLbb5ofhlkmhT7BawAgeZx-Rc6n8AV-woK4usKZJOm02z5J-wVINb3CKdgiFYKPexjVMKO9psB4BEvaOabLAHIwlvd2lKB7WQl84mEm1ZgQzI5VsZ3aiqR1JxnaJ3SGA49YJLIwoMpbw/w640-h228/35.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDILD0sgT8p-5b58Cz2CuZdiEC3eltzhnXEmIu3drt1gBI08vG2Dui9R4lk_0Q6YgpUYqzZWwdoRV5ZF_41VG9ZmioqDD6bbZvVisoWDjvSEJvOLzF1Dgjn4QuQUt3SVK8bysrOgp0yUM9yr7UPzIthTlyg3w6H-kt8SsS-Tu_Mu7P831ZpkxjDeyUig/w640-h344/36.png align="center")
    
    Pada gambar diatas terlihat akun dari organization AWS, serta akses ke group yang telah dibuat sebelumnya. Sekarang kita akan mengakses Billing dengan mengakses halaman console, maka hasilnya akan terlihat seperti dibawah ini:
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGTecICEzH3ST5CAplVX1cf7T3ba0xmrWpHAGE1KU_tgZRhlQrzMpTqxZWitdYawmTReV6ol7sFbGEqREJ6rGiCP-z9LA12E00myz5amCNa-6vb4pMDIEZsKF8S2lCMjnt7QVMn8sE2ksBcH-hjwZAMCgF3q9nrUs_Ok2l0KoXYgkKGqRqu9Rb0Lj6Dw/w640-h266/37.png align="center")
    
    Jika ingin melakukan hal yang sama untuk membuat group yang lain bisa mengikuti cara yang sama pada poin ke 4 membuat group, kemudian add user ke dalam group dan menetapkan group kedalam organization seperti pada poin ke 6.
    
    Kita juga bisa menambahkan fitur seperti MFA (Multi Factor Authentication) kedalam user yang sudah dibuat.
    

Sekian & Thanks.

### **Referensi:**

[https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html)
