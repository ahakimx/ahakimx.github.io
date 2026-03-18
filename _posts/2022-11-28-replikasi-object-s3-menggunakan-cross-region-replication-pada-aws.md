---
layout: post
title: "Replikasi Object S3 Menggunakan Cross-Region Replication pada AWS"
date: 2022-11-28 10:25:39 +0000
categories: []
tags: [aws-s3, s3-replication]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/M4G5BSUo1p4/upload/7d3856d8697ab2bd025b7d0653613bb0.jpeg
  alt: "Replikasi Object S3 Menggunakan Cross-Region Replication pada AWS"
comments: true
---

## Overview:

Pada tulisan kali ini kita akan melakukan replikasi pada object yang ada di S3 menggunakan replikasi antar region (Cross-Region Replication), yang mana ini akan menyalin object ke antar region.

1. Membuat dan konfigurasi bucket pada region virginia
    
2. Membuat dan konfigurasi bucket pada region california
    
3. Aktifkan replication pada bucket region virginia
    
4. Upload file website
    
5. Mengakses website
    
6. Upload kembali object
    
7. Bersihkan S3 bucket
    

## Kebutuhan:

* Akun AWS
    
* Region Virginia
    
* Region California
    
* File sample, [Github](https://github.com/ahakimx/s3-sample-code)
    

## Langkah-langkah:

### Membuat dan konfigurasi bucket pada region virginia

1. Buat bucket pada region virginia
    
    Untuk memudahkan penamaan, kita akan membuat nama bucket pada region virginia ini dengan nama source-bucket-\*\*
    
    * Masuk ke service S3
        
    * Create bucket
        
    * Isi nama bucket
        
    * Pastikan region virginia
        
    * Kosongkan Block all public access
        
    * Create bucket
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEggPHJnO03cacG0hOx8jgiOjaKz73T4TDexaRQ0JY1RZipC3jlB8hMn9wlJ5WE-q8W7sJL52txgI1VsMmPl1-0IpIZNH5SdpkfY-r5QKAQ5zyokAJmn6BJen1OzxyuftN-aujDCHmVkEgHuFFTgEHBLQKBRfMcApMSKzwngqBXElVSrRzVeAcXBJ4GpZQ/w640-h374/1.png align="center")
        
2. Aktifkan static website hosting
    
    * Buka bucket
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6oqUOvO5IySyfCrcnCcFPO6TCtndMvbCUcSshX7ZYLEbit8DfSNZqlvWjIT6-8J23gg8zn1vg5xn9oo1v3g6rZEMinabJjr-ISIf6FxvhR9SycP6ClJDDKQUz5fIoaB2yj46852144vqcGvLLleDRG9YPNOuO6wC51EjDwi4-AONEw7sAhbFv9XgiDw/w640-h212/2.png align="center")
        
    * Klik tab properties
        
    * Pada Static website hosting klik Edit
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhestmQsjaaKpkwyTDajwVKfDC6CApfFnW83yp7pi3CIDz7VVCuAXI9vITfacC8v-EyMf9xCW7K8hZtTwXV1Wz1XLKlhJp6lDfdPVK1dbEzeGgpF1l5HFsV0qPyjz1yCl4Q2-LNdqGTun7zA4xCggYm4Un4E9b-0V_w1MQzMLU6RuC8lYqHnUHF-ltSVA/w640-h158/3.png align="center")
        
    * Enable static website hosting
        
    * Isi document dengan index.html
        
    * Save changes
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSm3xoNM1f1up8OHrLLKs9f8gaXozf2rXEBwrIrh-XeA2nML3YpTXhCsb5126pQdcpSG9koVYIzcN-74f0g3E92_faOHh77Ixhzy3-DXMXHLGIWLemwPjWpf78hjzAzH9vTr1_KskIEEQYBCt9VUwW8V1eya_Bw_OnRlEpyC3uLf_QoMQcBDFTE6vDsA/w640-h518/4.png align="center")
        
3. Tambahkan policy ke bucket
    
    * Tab permissions
        
    * klik edit bucket policy
        
    * Isi policy, seperti dibawah ini
        
        ```bash
        {
            "Version":"2012-10-17",
            "Statement":[
              {
                "Sid":"PublicRead",
                "Effect":"Allow",
                "Principal": "*",
                "Action":["s3:GetObject"],
                "Resource":["arn:aws:s3:::source-bucket-2133123/*"]
              }
            ]
          }
        ```
        
    * Klik Save change
        

### Membuat dan konfigurasi bucket pada region california

1. Buat Bucket
    
    Untuk memudahkan penamaan, kita akan membuat nama bucket pada region california ini dengan nama destination-bucket-\*\*. Langkah-langkah yang dilakukan kurang lebih sama dengan yang diatas, yang menjadi perbedaan adalah nama bucket dan region.
    
    * Masuk ke service S3
        
    * Create bucket
        
    * Isi nama bucket
        
    * Pilih region california
        
    * Kosongkan Block all public access
        
    * Create bucket
        
2. Aktifkan static website hosting
    
    * Buka bucket
        
    * Klik tab properties
        
    * Pada Static website hosting klik Edit
        
    * Enable static website hosting
        
    * Isi document dengan index.html
        
    * Save changes
        
3. Tambahkan policy ke bucket
    
    * Tab permissions
        
    * klik edit bucket policy
        
    * Isi policy, seperti dibawah ini
        
    
    ```bash
    {
        "Version":"2012-10-17",
        "Statement":[
          {
            "Sid":"PublicRead",
            "Effect":"Allow",
            "Principal": "*",
            "Action":["s3:GetObject"],
            "Resource":["arn:aws:s3:::destination-bucket-2483920/*"]
          }
        ]
      }
    ```
    

### Aktifkan replication pada bucket region virginia

1. Aktifkan replication
    
    * Masuk ke source bucket
        
    * Pada tab management
        
    * Klik create replication rule
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhcMEISG7qNrNbfQxjYmLeBAMzHmYkEYy85qzlLt2ux10gQBUey5m1iASvdJhKonzqBjOyjkI14DRDgJ8kqopdJGVfuRYkEiMDHf4n5AlLHomQBJSrVk5nyvpEQe5_S2Q6AClnSEc51j252-r6opSxVTH9ONhJUSSH4STAxKe0XDdCOu2mJMnaoZbNp9Q/w640-h170/9.png align="center")
        
    * Enable bucket versioning
        
    * Isi replication rule name
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEisZF-xBu_3qQZz6_GZhZRGLa1Q2bpaztSVeR3mkJLC7MFSFgkrZgQjIoz9yN9zCKksAXCu9Z1s-aLFdAyY3JRXRCFNWrqelLse6A2fF_beLxSTxqzh4N3Zl5zobQ5SeHfV282rQg8cb2N9w_NQXqmCl8suakgpSnctum_gPUdbThFIAYv53NNCizS0ZA/w640-h434/10.png align="center")
        
    * Pada source bucket pilih apply to all objects in the bucket
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8fXJ56hrDyyziVuzV7EjySGK3sqmVK2-68fTBce1_BJ7E6XaMU5P8ZO-LJTZ1Wa4IBBQsDvqnbT2-HfOkzbUM8sWlsNnyVD2eLwxw1rE9zJMF_0Afp4vGATjAtQ6FsfwPdys_SsfELXYhlI0rx3psU4fw_Ngupz3DphXqXxGlsrbzV5wkhw4eFHVDRw/w640-h246/11.png align="center")
        
    * Pada destination bucket pilih
        
        * Destination bucket yang sudah dibuat sebelumnya pada region california
            
        * Enable versioning
            
            ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjR6YGGY9V1o0uk03Z9vmGzhgPShru6XjdaWNq6P2tsudLYxjAGhdLoxvXiQOPU2_UBYlcOPI0mQLa4x1l-EdjC22fd1i-akkqg2FyGjYl0cwr_XaWQB53r2oY_etm0m7yrLJT7-IZrHPgpShRl3vd9FO2aOrztJ9_GMIb0maKFQQiiaor_32pS1p4V-A/w640-h400/12.png align="center")
            
    * Pada IAM Role, create new IAM Role
        
    * Save
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4xBe79iYRFPAMpGL9ir2ySI1g3_uYCcxKdbkk_VCb_qH4K4lNSA2k9uH-SgpQuvArOaChRh1x18Y9c4yf1bvTuyXIujScD9cfYN0HGqv0-7WnF86FSiZcbP11z9Rk4DG9w2P0LYcYILIp1X4EdpRXhxvtXdw84SM4TguRXBBmiGrWtQ18Rk8hJSmGjw/w640-h306/13.png align="center")
        

### Upload File Website

1. Upload object pada source bucket di region virginia
    
    * Pada tab Objects
        
    * Klik Upload
        
    * Add file dan folder
        
    * Upload
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEinsUZJicN1hjOuMWCughYZMcN8eEs3We_CWhIfW8Hgdt-UBfObh1BfBzhlZvCNEsyaKDIVKSLVAvdLvkgpwpPx68N_0B2KNnt8eEc7ygXVTdzmZgixAWRlkdfRtxfhZeMC5KgOptlnr6cRQkCpBDLvlyj17q0S3p7vetlToDNlayCNqIJCeXZ9VK39Xg/w640-h264/6.png align="center")
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjX744R43BFHaiiRoRHbfY7qoN_Sy0--OrbtdFNnAWjUMe-ia2DMEBPjJF8VPFCEFT4uGPjRuGQbqx-a55U3rpk4SrlI4UAeIjVAsTOrBG-6JLcc_jjCpqyu0A53pixCNxt1kCmllHrvWBDr7LD6AagqiLEBRQjfkfli8iFsAZDnGM9_V0w-ecAj8Ktzg/w640-h394/7.png align="center")
        
2. Perhatikan isi dari object destination bucket
    
    Seharusnya data dari bucket source (region virginia) sudah ter replikasi pada bucket destination (region california), proses ini bisa membutuhkan waktu, jika sudah maka hasilnya terlihat seperti dibawah ini:
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjCc1vxRRDNzOxxcg40KQL7Zzo2By3bg25OUOBR2-B4pNBEbTnXnoaS3TJjfr9yy9khjbVPbwg3Za3uOF6tukmFD0QSgfCDo2llvRytmpQuB2QtbxFXhkIBEC7wxbkO3AZza3OZ6Rmn4BvyZ9dL3Juya_S1tNvTsVasXgA3_QbqmG2Y1CPeIZ5nsebGUA/w640-h232/14.png align="center")
    

### Akses Website

1. Akses static website pada region virginia
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAp_Aw8ifaBKzSZnRFZ0Lx7w9uJSNEQgow-4Vt4MBDi6KNNu5ceEcMG6HAma8XJdliFbzzAIq4SNsn_fWZuLHOlsAhWonHxT8f3bLxQyDqb7Pog5UNrCw-ck85eFi2jiRZJtEvhC0ZFzENq1iBNSpUzSkp4c-EHmhkRU4bDAweh-4gnRpNCfobpXoS3Q/w640-h412/15.png align="center")
    
2. Akses website pada region california
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiDlDMjJqkQEAmIhr7tP9vwKkQdO5Vodri1mHjvNUMQEy9-blzEMR7WjLm5OuT5Zpk09AfFQ-qNhGd5Kt2FFa0X12e_1PnPXOUcog8Fhnr9zbND_bXDo1XwAty2iPYqiVsqQmJUBGnF93gWyHrdABiwUBRe3_8sZ63eRuHXddLKqrmW1bMLhonusgWAJA/w640-h460/16.png align="center")
    

### Upload Kembali Object

1. Upload kembali file image padafolder /img pada source bucket dengan nama yg sama, namun memiliki isi yang berbeda, seperti pada contoh ini cat.jpg
    
    * Pada folder img
        
    * Klik Upload
        
    * Pilih file dengan nama yg sama, namun isi dari gambarnya berbeda
        
    * Upload
        
        ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBdyQYyDnDJKtM7pDm_NSpbLntWr-v3bmODQFt8I8shAApQwr5kjqrWA8Y5pJPsNZ87_tTN1Id8_YzdJNwVX-giyoHReA6A2v5kGtcFl_ZwtJmy0Jc3MwxfwbeAJEry5FamoTErMhyWjlfV1DUSOqplldNoQjmjdy73zzMP3db2xCzp_24G5nb_t2wFw/w640-h318/18.png align="center")
        
2. Perhatikan object
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_TkFm8znGXo_o7CPHxN25nCWaLvdMDkimjP0w8vXOmTII5R2Pytxiy29-lhXwcVu-khOowgH9JUL5La0wuTIUsUUGU3iEOk09FlxvZgKxdLR3-SR4hcsj6h5EXU0w5KkNGgG1S_Pep1P9YR7rYj4bBozQhalkps5_9668wE-LYMlKNiF-PTbMRi88Uw/w640-h186/19.png align="center")
    
    Pada gambar diatas terlihat bahwa ada 2 object yang memiliki nama yang sama, namun memiliki version ID yang berbeda, itu karena kita telah mengaktifkan versioning pada bucket kita.
    
3. Akses kembali website dari source bucket
    
    Perhatikan isinya seharusnya isi dari gambar tersebut sudah berganti, seperti dibawah ini:
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfNcLfPFAbP8CEE8HVqtO_eYh-QdvxS1fCyMPocy-jEJyFrIEn_gXfb2GIBpYQqicF4EuSk-SeQpXbCl-QRSK9-Rmh2ogl5TqGdmA0PC7BjCQGKWVWZOrnWzMF1KfGKNDFkCkEbk-FKrtZU8BBJpOouDFOMsNN0YYx8_48xB4rxhvve2W6ro4h-IXs5w/w640-h476/20.png align="center")
    
4. Lihat object pada destionation bucket
    
    Perhatikan isinya seharusnya ada object baru yang terdapat pada bucket kita dengan nama yang sama namun memilki version ID yang berbeda. Jika belum tunggu terlebih dahulu, karena replikasi ini membutuhkan proses.
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgsI3o4AJ5jcNthVjS9C0wi-iatOFrHa9pBPv29Aj1RHFNHwaHo7bOmAz1noh_mRZNnqBk2mjU7GkQW2Vt5hGVbe3cb3C54jhEdz3KF8EaOU5iIe8NJ6hZUntTJf5LuMSvIXLoJLllvDor_Kob2cRdwMjR3ozGqqxfyQDfo9gNOFPjBMuVXMjAVwN_lEQ/w640-h214/21.png align="center")
    
5. Akses website dari destination bucket
    
    Perhatikan isinya seharusnya isi dari gambar tersebut juga sudah berganti, seperti dibawah ini:
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4piUK8rKt_tsQ1B838H-zf16h3JkGuLKAmvXV4mJ6j1Xx8Rui325aH4dqwr6Gjdlq1rAHMZZGAVRJcrhtCf2DQu-w3Elt7QQQLxU8RYG-EToY7UL8h0Wln_Q5TAK_zeN3p85hi4V8Kq_hKehs2hvFhHV7_cUo9sIprCU2LC3goQ8VrxkjjoN66psoMg/w640-h452/22.png align="center")
    
    Berdasarkan langkah-langkah yang telah kita buat, jadi seperti itulah cara kerja replikasi antar-region pada S3, untuk lebih lanjutnya bisa melakukan percobaan-percobaan yang lain pada fitur replication S3.
    

### Bersihkan S3 Bucket

Sekarang hapus bucket yang sudah dibuat sebelumnya pada region virginia dan california, agar menghindari penagihan pada object yang sudah tidak digunakan lagi.

Referensi:

[https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html#crr-scenario](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html#crr-scenario)
