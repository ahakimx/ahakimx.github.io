---
layout: post
title: "Membuat Enkripsi pada Object di AWS S3"
date: 2022-11-29 02:04:57 +0000
categories: []
tags: [aws-s3, s3-encryption]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/OjSG0E_qcbo/upload/2677b9965c744793a301f74c38a4021e.jpeg
  alt: "Membuat Enkripsi pada Object di AWS S3"
comments: true
---

## Overview:

Pada tulisan kali ini kita akan mencoba membuat enkripsi pada object yang ada di AWS S3, adapun langkah-langkah yang akan kita lakukan adalah:

1. Membuat bucket
    
2. Membuat Key Management Service (AWS KMS)
    
3. Upload file
    
4. Akses Object
    
5. Buat policy
    
6. Akses Kembali Object
    
7. Bersihkan S3 dan KMS
    

## Kebutuhan:

* Akun AWS
    
* File sampel, bisa ambil di [Github](https://github.com/ahakimx/s3-sample-code)
    

## Langkah-langkah:

### Membuat bucket

1. Buat bucket
    
    * Masuk ke service S3
        
    * Create bucket
        
    * Isi nama bucket dan region
        
    * Create bucket
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDwL4u_1hmyn0ksWVxw5eXcrQiLhZZO5fMVkq8XBMUJZro-eCFQ89FqO3jg_FzQ0wR2MX0PekM3-lZkgMC2EIMnrcS8GUlC5l5BZ_XZsdLXa90W4XULt2GqGaT68XmA_d-J79psJCUSZFGmX2kSB-AcUYoNh-zqUFRO0hABmFrrB7-6GpUH_7DBu4CHg/w640-h372/1.png align="center")
        

### Membuat Key Management Service (AWS KMS)

1. Buat KMS
    
    * Masuk ke service KMS, 
        
    * Create a key
        
    * Key type: symmetric
        
    * Key usage: Encrypt and decrypt
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhVK6LMYE3213pzKByt3TduyQQzfuAfnPH6rOwkJcpMMVOBfVQTv0Qx4xkV8ywFt40np4yxI1pmzYu9vooeJokAJtucnUaerQWxMsJirBFCTQ3pDJJJyeEM4LG8q7cl2R5hSgN2tfFqTpubmLH8F8CiqAD7a-gn6QXqbRrDKny8LvCbrCRY7UdOBJEibA/w640-h294/3.png align="center")
        
    * Key material origin: KMS
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrbOqqAM1AFBLEmpjF0Da2Cj69lkdwb4HqyMJnGlsAYVE2LyQB4vieYteQ6x66oikFqZH7ThA-vFJ2BlYGij3miM5IURRyPkNqghj5If8ubghkd7qMo7yyvn2ldQQTdja7_DOEwDRvQRpEzdQWE4xPmdjsm4oGigj3cuj74ey7k1JulkHyxfTbo91ZOQ/w640-h334/4.png align="center")
        
    * Isi alias
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjGCZJUXQRnT9gfZ8nUgf8CtWBIw6ne4JfHypMv00hko-BOfnxEpMo3Ds0bzGMUNFwoWT0r9Q0bWZg0TCdfRP52vTU8fwsQLaaCoODINzU6QLLaOIVe-MuB-ZkvQ3Mg5t0X_1W-cW33BqvvrAwuUSIuPrH9I1S7YOfak9pEA-BHZszJE0_KmDQBi7eVLg/w640-h328/5.png align="center")
        
    * Key deletion biarkan default
        
    * Next
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_RkZm1-3FnjSdGxist3p2yW3o7u9Ge9ZyO2nTbT15_Fy2PQqs16P3UtzFsMhuyZGzIqwNwCyNxDfaj-CHdkvc3O3n-bdVPxl6_cDS4A1ufmf-oQPvgsqU3DMEgD4R7Chm1RUrUUOyY0CCWexMfid70FjQcmNENsTy8qjEtLQMF71HKM42jC41D9QRfA/w640-h158/6.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi8PQ5kR1S6F_kt8ufUu5miws8wEu9y0LB_ykmo01UE_MjROLH8T7bhG86nQMlests77ZHUe5l1aJ9hVCo9v8WRZtkYJuOpv1Qd0qcKRMF0w6wJRnkC8H_aVbhFCyVbo-eXWKDPRzIIAqSLYc_mtZRVfr3_lHPd3ylm9M9YJTvyOvIRVrrKE0RSNxVNwQ/w640-h234/7.png align="center")
        
    * Key policy biarkan default
        
    * Next
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhR1LUcGSYA0k5B5WqhtY0Y5GoUOBd0KoSvTyW1aY8RaQCQdWY4HMnOaHyA_gKJW46oJTKZ3WqNZ9nDpApHY4tZhBG3ELIdJU0HqB7oOZNvKT-DTYcm6rBMCWApOZE30lPWoRbiYchSTPqawZk0VbwEFEzR7Hx2psZMsnb2Lg2yj4w0Jv_Go-6KBz1Bzg/w640-h372/8.png align="center")
        

### Upload File

1. Upload file tanpa menggunakan enkripsi
    
    *  Upload file
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigw4q44HzD-4vxcrWAZgpIs9sClXU5gPaRvqwGTCzv7jl-cAH24hOHcLzwP21LW4nfaYhQavmD41IFaIwiEsAhViIBu8YSahw3LWMzVxqUGUvFg27eVvZUxN8XnVv7DhQErtG5_F2r5aO3EztcUXgexMPyZtULRnUOZDy5ZRKHkLicRbEKoVZNz7m86w/w640-h524/9.png align="center")
        
2. Upload file menggunakan encryption key SSE-S3
    
    * Upload file menggunakan enkripsi
        
    * Klik Upload
        
    * Klik pada bagian Properties
        
    * Server-side encryption pilih specify an encryption key
        
    * Encryption key type pilih SSE-S3
        
    * Upload
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi2HsT80KWwwlB64VvX5q5t3gC8GXl07XaQTiPoZQgB2nc0vzNKAKwSrvgpeuM1o2IjVlzth0coRdUt9OJlkj6YB9k3IinM6jtNVJDCDKiqc7hUM-kBwm-XsmU64u7MkWKP-NUVdIHLpHtDGrUJeNuZE2OXIMb1HMJC2C-nfke5g7ZaO7NxaTPmebPTmw/w640-h278/11.png align="center")
        
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
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbzEnXb9hJ6QwoCxaKVUQk74QBKbtKfMtcWEfUWUb-sMFkaNzNksvuPsf7lore9lUF4jT7bbIOe7W3N2Li7tBq4xWvtyTWWESRsFc4QiNc7vY8Ihcv2MZlGdBAyEJhgAhHH9OL3PRiU5PKKHfO2FrblzeUkdQfV3NhOq81YkPLN9ibN6Pe5Gl3E9vUDg/w640-h312/12.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBNYf3gZKtymC9AQEsU-KUnusvq5zwzOSH3P-FARulTo6mGL0xKN1tXsITn9JdGBwp_szEEUjtdOsybku_GLaHek5-vePxBzfx4cvpsStoEuhEzMzfg5zbwNEGzprdjB7qhGXYZnfZglWmp5XYUd9_EFGxOZ9PJb0h4b1s7TNeHlWJ7wzl5-DcfWjaRA/w640-h556/13.png align="center")
        
4. Lihat Object
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhY8eYMeQb1XI1X1BML8ab9l24L75X2C79cbFEBg7ef-XXcyNdfVTkxC41fs-VSLfB8P3UOWZiEYCynj5hRsECrq3-AGfNEbxbqU5TtA4h3izds3zirlWoRDO5iLaNTsFUKLoc2WA2VoKu4ZKP06Zyqd_OyfK1qyuT92WO-vWH_MVGUT77VdAwXA7UdIA/w640-h138/14.png align="center")
    

### Lihat File Object

1. Lihat file object tanpa menggunakan enkripsi
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgz09vDy5osEFnIX0fY3OUox81oMB_3oBGsbaceJWaebHpOEv03vA8zt7vaV6-wVUDP-3U5fQ2r5g3CdXQK_Av-MUs7_2FtKiaLAT1pxfNxEIidj4wwBFb6ucB0ndXc7Rq0aujRGsY_x7F9ktdV5KwDQT9Jo1azrfa5aLmEiLhMiQF_MD3MWgX758bXkg/w640-h410/15.png align="center")
    
2. Lihat file object menggunakan enkripsi SSE-S3
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgGhWhLDGkrhF0-rE12wKFZFx-wvLe6OF-Er15oVebvxb1I5LdrUnK0DZKzpNzey3fAdgUr8G2uyQ5Y9gwC2-ORxnpzwo4fzoNA6KC8p89AKLS0w78dzRYL4RkbL1furig_W-MTBOB0j9DtjgMkjIKnFMDnehVFb0WLxkSfBNbGZ3cw5Nm7DMS-VmddOA/w640-h408/16.png align="center")
    
3. Lihat file object menggunakan enkripsi SSE-KMS
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8-hSaaHqnoLfeDS0Mo5H5669q4b5OsIdrriXRqB9OAm0JhrsOjyzx9mYdCaIbACJ_lakqgpoR56cxZM36P6ndEHyDM-umlWBfBZ5ElXUXJ30EjWDYDbjy13kitUtJd22mpZfwykfjOCyuq_5AZuPg3JySCxfBh6jWNTPsucV6v8NG3gp0fRujDg4cLA/w640-h406/17.png align="center")
    

### Buat policy

Buat policy untuk mencegah akses ke kms 

* Ke IAM
    
* Users
    
* Pilih iamadmin
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEga5k_YA_2mczGUjQnY5Ulhy0N0-M0E9RhEF89O7kzGhOSUb5HrzjUBakaYGI3yaWXmJ5_oRgrdZpmt1I-GRpeHbINzii2Wie3ngFewQT29b5aX0r3Ll2f7HGrvPY7HS6oIc5OOhkK8eZxF1Pn4xJsTKh06FzvWCLSdhZeSiH5HKFNYO425VpD2n_fjCw/w640-h192/20.png align="center")
    
* Klik add inline policy
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEin3F4-_6ujpp4y7skTQlxNvZ8QX8oTyedx437lE_ojy_e1jJIk8baQATP3iPagx-7b7FOzwWwEnPb_ftrC9D6g1JAxPSPHq7WrXCQKx4UiGp9Ls9AHWuIaKavBfWXwII3b6Uqvq-VgXS85aBgA-ysz8RIb3EWeRrFZ_QbXOKbu-JYSiBMB9MXkKcyokw/w640-h242/21.png align="center")
    
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
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGStUULetySQUxt3F79KfTLeu6Ul0fGqhk5544GK2-QlAZVTcSXenWnEKdDJIit87XtztWrNoHvDFHUh0DIUlvi6JneMaJGXQ5AHQ3XK_7ZZR90dPecYUjmzhoUU130zZ8MYWwYeATOT8TGKl_-iHw0RVbxuMnQY6t9g_UJadki1erj1AF3UJY9aykjA/w640-h332/22.png align="center")
    
* Review policy
    
* Isi nama denyKMS
    
* Create policy
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwTsGPrnhc-3KVhOu8EFUeEO-QJ6g0qyjydFC1vENrlOZYmedLDonZCnEROSHLNlRCC1S18tVXGudlGmG-MJBN70CakvuQg5R6V60FcTVQQBBO_VQ-lDBwwdjc7W9_N7vc-67EXDMoFUQ3uucBIjcOBnJkjqHhMxM3hfzHmJG_zMvqsj2uwkr0LgL_6g/w640-h224/23.png align="center")
    

### Akses Kembali Object

1. Lihat file object tanpa menggunakan enkripsi
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1csoqmcY6yymhcZ-Yex8ZF3kQ1143Gdh47Ulfi0nQL0UKwETCAYUANFgzACodkNbs2hpF6p_wLDg9vM8of3GUxxIQDmvCZOKjCKGDemMDAk_4Eco7jJn0KADWOmCahRtQBTHW6hx8k8XOOZtB7utPgdu_v1niYLsYCoqvW9Iic7SYW6-ctWX4Ai5DLA/w640-h408/18.png align="center")
    
2. Lihat file object menggunakan enkripsi SSE-S3
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEicTNckble-cyV46XpnaeZt79cPWq_GlCZ1QVekxU0Ex8vt_kYybYZVXMt9sDJkhl15enmhrUTe8hn0_U18KGo3SPMiOzidiZnFPCzpPUXe5Dnx9EhpxrcrQuZabmBRxu6950v__UDUfnnNnS2vkFrnEAGGkBhYefAb_qwFhuwFJ8mCDM27U-Jf8oIkVQ/w640-h408/19.png align="center")
    
3. Lihat file object menggunakan enkripsi SSE-KMS
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7D8EODT13qlI6247tsrlGwtAJBfK-d5zUdc-XabY4aP-UGCpDUnalB6B7Y8DMk1La9xHynD6jL6biM1mHoiafq5VeqAy5Q9Pl8qQZmu6craxIRyswOg9O0zMT22ZFs4XQdb3DcH1GqIjI9LzcPE3MBrAO9k5O-udoLqN7BVWnzhlS_3f447h76k99ng/w640-h230/24.png align="center")
    
    Terlihat pada pesan error diatas kita tidak diberikan akses terhadap file tersebut, karena sebelumnya kita sudah membuat policy untuk tidak mengijinkan akses kedalam service KMS.
    

### Bersihkan S3 dan KMS

1. Hapus Bucket
    
2. Hapus Inline policy (denyKMS)
    
3. Hapus KMS
    

Referensi:

[https://docs.aws.amazon.com/kms/latest/developerguide/services-s3.html](https://docs.aws.amazon.com/kms/latest/developerguide/services-s3.html)

[learn cantrill - aws sysops training](https://learn.cantrill.io/)
