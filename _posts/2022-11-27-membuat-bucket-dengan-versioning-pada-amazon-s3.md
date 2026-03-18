---
layout: post
title: "Membuat Bucket dengan Versioning pada Amazon S3"
date: 2022-11-27 17:08:57 +0000
categories: []
tags: [amazon-s3, aws-s3-versioning]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/IF5G2tmZ7cg/upload/2c377c591dfc6edd6929ebf5510c5161.jpeg
  alt: "Membuat Bucket dengan Versioning pada Amazon S3"
comments: true
---

## Overview:

Pada artikel kali ini kita akan mencoba membuat versioning pada AWS S3. Adapun versioning pada AWS S3 yaitu*:*

> "Cara menyimpan berbagai varian objek dalam wadah yang sama. Kita dapat menggunakan fitur S3 Versioning untuk mempertahankan, mengambil, dan memulihkan setiap versi dari setiap objek yang disimpan di bucket. Dengan pembuatan versi, kita dapat memulihkan lebih mudah dari tindakan pengguna yang tidak diinginkan dan kegagalan aplikasi. Setelah penerapan versi diaktifkan untuk bucket, jika Amazon S3 menerima beberapa permintaan tulis untuk objek yang sama secara bersamaan, semua objek tersebut akan disimpan." lebih detail lihat [**disini**](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)

Adapun langkah-langkah yang akan kita lakukan pada artikel kali ini adalah, sebagai berikut:

1. Membuat Bucket
    
2. Konfigurasi Bucket
    
3. Upload Bucket
    
4. Mengakses Website Menggunakan Browser
    
5. Upload Object Kembali
    
6. Mengakses Website Menggunakan Browser
    
7. Delete Object
    
8. Mengakses Kembali Website Menggunakan Browser
    
9. Bersihkan Bucket
    

## Kebutuhan:

* Memiliki Akun AWS
    
* Region Virginia
    
* File Sample, [Github](https://github.com/ahakimx/s3-sample-code)
    

## Langkah-langkah:

#### Membuat Bucket

1. Masuk ke service S3
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwhmRogEtcRfnnLt9A3C7WgsRHgc_-vD9cKjP9dKyjGV7Ogc5nf_QSSR-MPDWLoo-7B-tbwkxJTIOh1ZxVGlz31-X3NwhCMdjUxwpMAhYrBmrJtQ3UWFHxg_DGL5cnZVFyCZILnp6LV-nGj8b7uJImrRWAnSed3KieGL0qgK03A4Itx3VAs9X27Sq5qw/w640-h282/1.png align="center")
    
2. Klik Create bucket
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-R06QsIg4mozKxX3Ek2qMv3T_Tf38L6V2oycfZ7YTXTqEf5Ve13h_cpKNjVBgI_Qej1pussp6XZV8dKkcAZaVg-L-_IKTKB-B_39sqAIW4lWc2a5rm4d8Na_csVDUTeyxtUTfsfeOwXDDR4ADqAXkPdS0MZXf62EKVYjbfrI2d63QSTAJMICjWOFo2g/w640-h164/2.png align="center")
    
3. Isi Data
    
    * Nama Bucket
        
    * Kosongkan Block all public access
        
    * Enable Bucket Versioning
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1sa0sQhzC8LORudG0T_Ljui2OB35yX3IibqHWAqmdHJvzkhwy3NQ_NDNEcUViWMv69vjUlnH4naS6FjmfWHbcdP5gLQCQle9cY1lnPDgG8ntwOgbVogUPtWELrKyOrikr2qtjC5RfNO1oiW46axrQ6bDWs8RBNf628CrwAUMziAj9kn6EnZDiRRVd8A/w640-h370/3.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi4w49XTk2eFoj__5Ri2_nsrnRVQCct8B-_y5f3wpLqxTrNBH-lO-VeseLIEwlbgWjq6X8Uo6rRLQ_TymHBvLfXPKP2ZgmRZbu3Tn8GtnKro6Nrz9plgAd6gv2-BqHqJEmue-3-ATJ4DOt-k9ca7NHhjEK28EXHGZn-Ba-7UuO4FXYDiiiYgK1dJ3LtKg/w640-h528/4.png align="center")
        

#### **Konfigurasi Bucket**

1. Konfigurasi enable static
    
    * Klik bucket
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgjONyGFAD__VH99q-EDo1bmRlb6viFcjjab8m1YPk-h-UoFthAoxecNwcUeZCtYp99b7_N4Sj7uXgKFfC-DAzrkyJxmAHXvP62HVpZvhHyshT-_i_6pBCalCZwoCs6A2_TIWGt6m-czYESTp_nhhuXnmL6k3kDlDPZXCAd6kgxqs_A5ePS798Me-3kVA/w640-h226/6.png align="center")
        
    * Properties tab
        
    * Klik Edit pada Static web hosting
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEihK-dEi_nAP9Nsg9PxgqiYuyovoDyb1ytr72Wh5B-k5-TX9RBD1JM9pPsR2CkEMxUMxTLcw8KVR5PAO05GNssZ5k0r86wZcmmsMsmrRKw-7AEv-HIV3_sRbiA3p7qkJocLQFugmzi0DAy_-H_kZ7NJm387kxgrigL00mX7cuy3D6YYyOobmNFJdUuw8w/w640-h156/7.png align="center")
        
    * Klik Enable pada static website hosting
        
    * Isi Index document dan error document
        
    * Save changes
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXbdNt1EckHSAhhjxUq9b72SSSS16GrjKXkXjxDR6HVrfpM6LBCADUTN87guujs0KD7DdvIRP666JagMK_00ZXaJ_6_B7Am9zWd8BFeHpHh32SAQAWtqtKSVnbkIcatBpdFWUbBXh7GMmlhWgmgNn2MUPfAs5BG0oprqr7GMYXkLjDe0lrzMNfS3FLcQ/w640-h516/8.png align="center")
        
2. Tambahkan permission publik pada bucket
    
    * Ke tab permission
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQxzjJgoXb2pL_2hvpAhCGmd0FS6-iG9wiabhYe-XA1e7J5GPWt_ctot5kqfLCQ6QYr3EC0fVUZbSRw3Qj9b-h63UuXVmDbZdqZQITmw6eavIEYIQWlCFLaswDuWBI3U2TNT9noF_agGJIGiIY8_0ATwBcVOQOAUxlt2DzcWnrK-xHTkp5rclFFzYR5g/w640-h150/9.png align="center")
        
    * Klik Edit pada bucket policy
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2k_x9eDxjWpwggCWol4a1ykqKefcE-1id1jWgn1Mza67ZKBwGrZQk3FXmkLW9bx_bn7kt5nZ1neKFW16humoRDSC6NqIJdnKg2qmR70GulsCBoq9FjIt4GVRbrOVh9duogTQ6GGoRODexxH1FuWHTsF1BG4YysEu7Nx3UCsnSGuMu18E3E6NpvGfXcQ/w640-h290/10.png align="center")
        
    * Tambahkan policy untuk akses publik
        
        ```bash
        {
            "Version":"2012-10-17",
            "Statement":[
              {
                "Sid":"PublicRead",
                "Effect":"Allow",
                "Principal": "*",
                "Action":["s3:GetObject"],
                "Resource":["arn:aws:s3:::aha-cats-12121200/*"]
              }
            ]
          }
        ```
        
    * Save changes
        

#### Upload File Bucket

1. Upload bucket
    
    * Pada tab Object
        
    * Klik Upload
        
    * Add files
        
    * Upload file and folder
        
    * Klik Upload
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSHTPHKYo4gOYtcOdiGtasiSuyEcxYfG9ffRM5y_R2JA5l0L9N8ERbaHM7KnOs60gFdtcWbE7_NgU_uho2MgdQNiRaLnuaKBRUdoortr1_wREYDh-97y2amcJgx02HcnNIb5rRGpaxzAzRn2Xees1bOjIXfwpbFPgI8GIYeIcRhHiOEG_worTht4r83g/w640-h370/14.png align="center")
        
2. Lihat detail versioning
    
    * Pada tab bucket
        
    * Centang Show versions
        
    * Perhatikan version ID yang terdapat pada object
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh3krXIS1R90Rsh-HhmdW58xO1tb909F7Ee_xt7IF_7BgfyHkfw7QZW_qnr7p-Ex-iwExDwgSPhqWQEpTtUmMh1SciEEOk1jARQ8P5UZurmuJOa5Fnychxv4l1pNH_umqAsDgY6Yk0CqDOLVvuzhB-Quela8sUU9YSGie-ZC-PvgAHu94i8J0lbQcoslw/w640-h164/17.png align="center")
        

#### Mengakses Website Menggunakan Browser

1. Pada tab Properties
    
    * Akses website URL
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh3yo-7RryfI7dIvxuZUinCjmZa-FjoO39cUqVmQR_psFPmUO7c5B7ezFlryuQZYs3oOa39jVfXWNwVn8vJo_hWGb7StZ60QF929V-hDQ8pY6qH_Mf498riW-3lM7d80i-E0DiQ6o2mH5KesF1hH2oeicYf8ULzlraCsdpBoFI4oHW5GL0D5JrqCttoFg/w640-h420/16.png align="center")
        

#### Upload File Object Kembali

Upload file image kembali pada folder /img dengan image yang berbeda tetapi dengan nama yang sama, agar memudahkan untuk melakukan pengujian.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEip6PshYnZUM3UsSAGkk8JMqM4f4rdqJqDRVkhhQC-FqcCILeOQ032qTsF14gxjyoywv0xPWuxZ9kEhgC_81vgi3dMyEj4UX8Sfs7Gyeryk3EKrPsztxN6PjMWtbf0sVo8fpnbnU72uUw85MAbV24AVSIErlb_x2Iw_HHP5EplSyenqEy_z8e7kQT997Q/w640-h196/18.png align="center")

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbHBUwZ821SIyR1xxoVGzcQx1Cd5ehCk1D_3YXq3_k8jneX7kZqcyeN0uaqDywGgGf6t-fJnz3fig4dVYzK9l4FszifR-E_aTrvjdCqOdBO9LLbbe_LU-zVgBqjwFGwM8fiN-J-IlodZOPrBwP7HIyNwqWNP4ZfTDlBOl4K-Tk8Spb-ZMXtQXCK9arPQ/w640-h346/19.png align="center")

#### Mengakses Kembali Website Menggunakan Browser

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEixO5imqK9HrCNgdqSVHGmz3GxTitS1gphZnDhGA0ns8_YoGbcDu2sBuXQTnsxdM_M0AwGEVLjEwMJwykFckp03bv8sSpZwWQO-aET6MhLwH4IWiEPfxRxklYnefZvBhcu1Vc7se1JpFt_nD7CzQfhYa74qKvchzewM3ENKG-9z5jYmsNWMjih3Jt-VGw/w640-h472/20.png align="center")

Perhatikan hasilnya, berbeda dengan gambar pertama, dikarenakan kita baru saja mengupload file dengan objek yang sama namun version yang berbeda. AWS S3 versioning akan melakukan replace pada object yang terakhir diupload, sehingga kita melihat gambar yang terakhir diupload.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhDPM0jPaVA8HtWl71olCKWozl0UkwewkPktXZvaa9R4WjiQQvV5gQPUWvZye3CdQ3IXRezIp5WBJ7qOOtlIPqGFiziqztk6qYm0czUAQmxr10AbjYr3IdiPERBiXGpWyeZrv5IS1Wn6qz_EIvXpTBZjT6pYUVbAw_EFzynNeegu-CAGrr6VfFtZcqTMQ/w640-h152/21.png align="center")

Perhatikan kembali object, dengan mencentang toogle see version, maka ada dua file yang akan terlihat dengan nama object yang sama, namun version ID yang berbeda. Dibagian atas adalah file yang terakhir diupload, sedangkan pada posisi bawah adalah file asli yang pertama kali diupload.

#### Delete Object

1. Delete object cat.jpg
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEip5SZoQrvYKAd-JtLU9-Sdzqz9WESgQKFg2B6fVbWQE1cismhUiqGtjxYBJpJ0YVjWcbn1Y8nUKaeKPSx0EjEq5eOtX1JZ43g2OV_nsG7GN7iOkZWIJoxQ4ZtNqKYZNHP1p4_B3CvMxy3zpPax3bSxr87EZnMcGd5jpsI4n_hVaYmnPs6c_cFQPiOdGQ/w640-h114/22.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8WLSL1HjIppuZsLocjlv-UhcvdEugUNwNpsupeae4gTZ8indCcVVpkMB8KOQ9HIKr7JBQeHb2-ygu8WREroSvfRW_XyfmWRqd7qzLbgMsbXLALrn_4-XQ0JXtGpbnF9sWDEJxerkwk9cdefJlwAzliQRjiiQ34QFo89IEJ4k-tOb1T_l4CBddp8W5Tw/w640-h524/23.png align="center")
    
2. Perhatikan kembali object, lihat type dan version ID yang ada. terlihat object tidak dihapus, tetapi hanya di tandai menjadi Delete marker.
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEisFOJo0r8BavOhwQ6ECc73Ek223gwPjlYBrI1E7uA8Zhbdx5du-3XQqk0-LtV1ESVIBa8P4MoKqp_ylkrqBmevYq2MFiQAHg4QeL1dQaj01Js2bvGr0IzQm3gN2c5UkyIW3sCaeNY3O5PYVcAXwmDpjlVuF2i8VmcEMeoV3RmcBtNFTf1uqEHyffX-nA/w640-h174/24.png align="center")
    
    Terlihat pada gambar diatas, object tidak dihapus secara permanen, namun hanya di tandai sebagai delete marker, begitulah cara kerja versioning, urutan filenya yaitu file nomor urut 2 adalah file yang terakhir diupload sedangkan file nomor urut ketiga adalah file asli (yang pertama kali diupload).
    
3. Delete file secara permanen
    
    * Pilih file cat.img pada urutan pertama yang memiliki type Delete marker
        
    * klik Delete
        
    * isi permanently delete
        
    * Delete Objects
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHVp-VD17TUXJN3LfyMvRmxHvLY4SsW3wERIyFntILVX_csJqnLlkHZFCwnXun3g0NJ8Twfp41zeH-qVKKLAdHG6bQpyCjLfdnBe1RW2n7YXLnwKmhCK-PHbwiNVBBuCndXriL813A8w8uN5Yc_4tLemAkd3LQNdocA1yF9dZe2FPquAXmgIv3UXazSQ/w640-h194/25.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjDxVrYfUXKVhbEPIkvP0kOUgH7RzIeOMgzIN717KdLo1kWhuRJTZ9W33y_iwFfGTiuDkt8-QnXydY6GlfeBw-RdBlGyQvAIUmscCRhGntAaYo9kg-apfljyDO3j3m91mdx8_88b9DVWj2FqJp00HRoYWr6f3Vzuk9N5Km2QJj7H_CFPscI2h92-ZxyZg/w640-h518/26.png align="center")
        

#### Mengakses Kembali Website Menggunakan Browser

1. Akses kembali website
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiUvwF4gOVh4QdkZ8GeKxPxXBgqk3sX7DMWcLCEgD30MrUXmIzlOKEKHYhSKQFFZb4QD1Vulri1Va0QfhKRj-b85pMmW0XoOW-_XwEAVFyohhgRC6uIQcmQLqFlgE2mdeNrZMllfGuabC2GU-ay_GEte6YEP03wj3cbox-MwYdv4C5361WjYRqBLE2keg/w640-h490/27.png align="center")
    
    Terlihat gambar masih tetap menampilkan gambar yang terakhir. Sekarang coba untuk menampilkan gambar yang aslinya, yaitu gambar yang pertama kali diupload.
    
2. Delete object secara permanent, yaitu file yang terakhir diupload, karena itu bukanlah gambar yang asli
    
    * Centang file cat.img yang paling atas
        
    * Klik Delete
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwjQNKfCs9iy_nicngINuKm0aWwnT1mqHqzKD2ltzU7B0-DF5OuLwIzNcZEUHysd5aPIWJbNbPYPjvF34ZVTQZ2zhwkl4a5VyV7jRfFViiM4Mj2efpNtKzkwcAoYnm0bBtiurnxEZL1t8Qm4AjrZRY30dY9lhXbWPvoX71fK68GsSLHmW8eaTR1IKONg/w640-h184/28.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjem9vEBy8sQfiHhgGTTsksQGiXBJzAgb7X6hLSgjNhVw4lZbe_94ZtQgU5iUTZ7BT7fX6IDKFv-TtVYZDxM3i6eSR0K7wET6mjkgFNbHNtvFEb6yNFJGBQZIDqVSgCqEyGCj4jIouh6Zm6rIk1IOwILMkliZP4rOU-qq5HcTfW6VjHL73kB8ko6LA3hg/w640-h522/29.png align="center")
        
3. Kemudian lihat kembali object, terlihat ini merupakan object yang asli yang pertama kali di upload
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiv3D0YdlHW0zcfXxJXV9mOFq6HtUysKAvV8l1CkVgK1iAon2r1fdYtcslE6RcxUCVkrpnIfWdQekOdf29Xeq9-FDhOdMt0qQdBGJAP9ArSaWjPPk7ayRaZTIgJ9Q3StjrSLIOOfjyoztkZ4FPBQ_MWywO5t1bSRWCXkRz7tXu0_EnTbX4vt7XHOf_emQ/w640-h172/30.png align="center")
    
4. Akses kembali website, seharunya gambar yang asli yang akan terlihat
    
    ![gambar asli sudah terlihat](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_5rAaZCKT0r1nb2yK--y5uAAONw1rBJ8h1Bn2fj7zuJvIA7G-w6zu3UqV7Tl-_cn4t_OokZJvKMTZ7lXvm_1Vj96PENLu4nas-6ioKUUzIJaSRFMYCrtf53Y8gkoD0WPqvR8D7NVngLxK7bMraswBhJR1YmiaxXU9bZTGZ3KcLPAWDXNgpbJ2-FlBFQ/w640-h478/31.png align="center")
    

#### Bersihkan Bucket

Bersihkan bucket dengan menghapus semua object agar tidak terkena biaya dari layanan AWS S3.

Catatan: 

Ketika versioning sudah di enable, bucket tidak bisa di disable, hanya bisa di suspend, sehingga object yang baru diupload tidak memiliki version ID, namun tidak akan menghapus version ID pada object yang sebelumnya sudah memiliki version ID.

Referensi: 

[https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html)

[learn cantrill - aws sysops training](https://learn.cantrill.io/)
