---
layout: post
title: "Membuat dan Mengonfigurasi AWS Organizations"
date: 2022-11-17 03:10:19 +0000
categories: []
tags: [aws, awsorganization]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/2RKhuWvrpIc/upload/9da7d625758c438ad053f654c160bb9a.jpeg
  alt: "Membuat dan Mengonfigurasi AWS Organizations"
comments: true
---

## Ikhtisar

AWS Organizations adalah layanan AWS yang memungkinkan pengguna dapat mengelola beberapa akun AWS sebagai satu kesatuan dengan memudahkan manajemen, pembayaran, dan keamanan.

AWS Organizations memungkinkan pengguna untuk membuat hierarki akun, yang disebut organisasi, yang terdiri dari master/management account dan satu atau lebih akun anggota.

Pada project kali ini kita akan menggunakan service Organizations yang ada pada cloud AWS. yang mana kita akan menambahkan akun kedalam organizations, dengan langkah-langkah:

1\. Menambahkan akun production kedalam organizations.

2\. Membuat roles agar akun management bisa mengakses akun production.

3\. Melakukan testing dengan cara masuk ke akun production melalui akun general.

4\. Membuat akun baru langsung dari organizations.

## Prasyarat:

* Akun iam biasa, general (management)
    

* Akun iam biasa, production
    

## Langkah-Langkah:

### Menambahkan akun production kedalam organizations

1\. Login ke aws akun general

2\. Search "aws organization"

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFj9uIkZ573pfnT86oklpNTWVntTeicIO5DJqNTG7OWrgWn_S3HOHl70Loaak-VzeJTSIYCOhZWaVrZ_kRPgQ2pUb-16Y9bjkeWSj__JF77d-FNFzD7eTMLJnpnxuDmRy3cne_XjonW2Z0zVWRcZgoCPppMqPIFiH-6jx0-k7rgg66EHjXmgAT83EHxg/w640-h186/ss2.png align="center")

3\. Klik create organization 

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgX_38-KkySQ0d6jcR-DI2wdeCUN1x2tC69OcCfwmfwS99tGo4mktCLfup_pdeuzk7We68Dsz30oToWCAvg-r2_9Vd7145jDGrTpU6c8vNCT6KIEkLBFP5R-0o245pAbQidcba4V2Jc4gHgHI09g0zaF8P4lV0zJwHf_THzBmRTQ-o57LQrcqQ9Jg0Ikw/w640-h213/ss3.png align="center")

4\. Perhatikan bahwa akun general merupakan akun management, klik add an aws account

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQZfadbW5DJd2qan4BehcBdcK9Z9CtbQsjydejQgxc3r0Prgwz4-mIvQRAaChBPIPZf3q03TJGWvHat0r00pvoUWWC8E6DAQmlX_I1iWkxhL6IHZ5aeI0fU_QTeiplM26_uOYT7yeMAtGEWSrl9qlcggmVoR21AXMuYmk7xu-PT-UqnfFr6KDo7B41_Q/w400-h234/ss4.png align="center")

1. Buka akun production, catat account ID
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEib-Tzae9JYsK-kejov-w8NB6cY8f853Bl9Jjgxf1BSjBVWb4Rey5teat8lqsMct9ZuVqqcehEggDC3y1GMmVZexURE6Ou1NdbUaOh2JEjv-5mE81R5b7qp_Iqjjv_sk4G0pJarcVgbDwSAVcm_Gn4NBZklb3CkXhdwsIa5z1TY6_cng4nFFtkb9jjbIQ/w324-h400/ss5.png align="center")

6\. Buka kembali tab akun general, klik invite an existing AWS account, fill account id or email, type message, klik send invitation.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4BNnGhqetA-YLaG_CxWobV2ML_EnkJt_NZ-KgVNwODQFpDTROarxbbc3wGiV8DUUjgZC9PaOR6n8ApGLnEy6qdwFLZDVF6ILk-wwdEauhFaQWv3NCLhCs2GclxgmWhX8FD-cO3fo5WHXM9QKEU3n8pdDIgPCYlQ4QfdxsB1g1ZB_wzqvInPTIMGAWOg/w640-h478/ss6.png align="center")

7\. Buka email invitation di akun production kemudian klik accept invitation 

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_v1OhGqH6kbvfEZxtyRM_31SyoGuwb-BANWyI8RPVKtjafJDqklRSs5U9nrDxJUlbVg_7AzFUE9UO3RiRd2HdwIUmX_TdeIUmGPIG8MRS6hhpjzO7wID886rIExcjj3ExW--tv74lVJhpNpgOXzubF3xmdE5EAZuXIlfJgg16xF7gsDy6v3hD9zQL2Q/w640-h434/ss7.png align="center")

1. Klik accept invitation
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEif-wO6uLOL6tEQuQCt5v5o_AeFI3CD7bsOiw7yWP_LQPO0wC_Q2HHR0MFzLa47q7oHGIowO2qdnRr5vESG7nJ_fdBNftq7eVQUapC21pHvhzGsSrmwxlVUgUl34jjMUmPvdmrjD5aW-M3jhD7X84XHoOG4MOkJd1I8npOLARG1iKixSgV72fSxoGglCw/w640-h320/ss8.png align="center")
    

9\. Masuk kembali ke akun general, kemudian lihat list akun yang ada di organization, seharusnya sudah terlihat akun production didalamnya.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEivLkBu7ysPPFStvGcSk_JaOTJhsDyL9nRK3W3W3tbhxoN4mzDAQhVggZ_b5qqU452DQPJ3wKTJ7BPE3GticgRhYXjOEldgt5tOAymA7l9HD2sF-8dZznU-kOIrn8agEuvN1bUeHM3KEaNeCM4CTIwiC8m-jJriRE9_6WegObLIbO5mUg8CUchCd1aLsA/w640-h352/ss9.png align="center")

**Note:** 

Ketika add organization bisa dengan 2 cara:

1\. Invite existing account (need manually add this role) yang dilakukan pada akun production

2\. Create account within organization. (role akan dibuat ke akun tersebut) yang dilakukan pada akun development.

### Cara membuat roles untuk organizations:

1\. Masuk ke akun production

2\. Masuk ke iam, pilih roles, create roles

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgp3lMAg35nYGIJ6PGhZyBVvenMOT5eus9wcrEq14L5leEXNe5WoyTQeIGYkSEA-CV3Z0ToFAk9mukyOKMtegYFE3_jVNa1kN9scsIdCJP8-QiF6IsoAa-OC42zlhcipi1RccMMl9CEJ1_2fcRIzsjeKDM9tBfs2vxrSRoma8pYEpP7qpIPC0uspJ9FHw/w640-h162/b2.png align="center")

3\. Pilih aws account, pilih another aws account, masukkan account id general, klik next 

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjip9dd7N5BHfbm6NagpzgBehhYiMI4AU6NhZnEScpJBHIC-eDdsEmRnTDPVNeuxedLRLhzgrzbZrIZQvwLiSx32nW_t0wm2zHKNbh73Ggf0BcFF44P7gZOfCVL2cimlAIj-Tnag3S6uvd2jS7oP_pHAyiIFhbm7pCyZxu_d9pEfug7HOnGxeHojGdy-g/w640-h346/b3.png align="center")

4\. Pilih administratorAccess, klik next  

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZ0p9Ar9Jkc7nMBz35qlj_Aezm5O_JEm4BMEbQZ-PJeRjF36ajxwWS_4-QOyjtRr1ehML-Q5wgsIzuNGX15IXzZ4t-6Qcl3h4Ru0lXt3djmRKGoS6dCLJHEOZXiSyM5zQHt9IAiLYnWGiIA1jTCPq5r9PeblDYlaEXhqSnSIWs3xCVWMDjDeBVGq972A/w640-h162/b4.png align="center")

5\. Isi role name "OrganizationAcountAccessRole", klik create role

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiy299CO2zkgs1ckQGT5bCXEfUhqiTCFDrEvwKWPhbS0hOpd5ZBfwKyHN3ARYJkmJHDHy3oLruFFvGFyjvK0n_a1oZojlXkY8RBX7UwW9qY58gcrT5hcpzcbvsBh5tw1aWkQSwzMQGoRFiTLF8HGZW6dYX-tkLV_Ij-nhgJcUxgC7anYNc3ukRdpm1xYg/w640-h262/b5.png align="center")

1. Lihat detail roles yang sudah dibuat, pilih menu Trust relationship, perhatikan account id general user
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmnxoFopN1X8by6O080-v6bN-_scwK_2plX0SpFOTwsBcAC2ZNTYZ8clj8NKAB6RmyejMxKuc1Y9HPawjspw5uynDrZYXd9KylW98ce3UQRKANleA6pX5lY1a6TCKmFnu_Zxhv1ZSOb8_WRu-DC-zrRhC7M6TXBujd2RpOE-230oEmTSLr7umScDnnfQ/w640-h244/b6.png align="center")
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgIy-o8zQVrCch_IfQbu7MLHYh_jUXZ7ec7kEInRJqrzUNiaglrzL-uuzjb2bcaK8x5AVub8UX0-SaJpdzlmm1No35R6GIDhv8zSFfj-AXP5LGqX5wCiPJyJln_2PByBJsf3zeymBYykc8xfyTpjGGhUCQhSGMqrwO105r-3leMwJwyEmeEqY_gSKfXGA/w640-h190/b6-1.png align="center")

### Melakukan testing dengan cara masuk ke akun production melalui akun general.

1\. Masuk ke akun general, arahkan ke dropdown akun, klik swith role

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjS9tn1SmtkOSyL5Rxu1ehI2pYjcp07fOGq-yOZzpOHAvG1kfiX0Bw4_kwCUiXdHKcz717Twsvv4jjY-gezYjtf8CGXJ2brgdjtQWMLdD6aFMN1Kn5NOkq9i49p2jfiI9oydysCkYvzqrwMB1Gl2dIl4CAsq37ZmzyOu6zP74Wr-wqFt0Y9Bu5Y1pGaLQ/w398-h400/c1.png align="center")

2\. Klik Switch role

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEijW22ts-pfxa5efO13ojDyw0q7dr2VMpc5t4CysnY4lWjkIV7fSZq2twalSrvRkN0BuSHPiDNqOgy12WP4xPl1dqY_4ks1ZrWUz6QovKhn33Be_xWRwS024ZH-dctqMznvwyclEeiXGTundxQX58RMJMhEXwmxySLuIKcaa04yGvJdlVcZnK0GYP2XlA/w640-h280/c2.png align="center")

3\. Isi account = production account ID, Role = OrganizationAccountAccessRole, display name = PRODUCTION, color pilih warna, kemudian klik swith role.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZ74I2EM44pfZrqSCXuqPEZb6ScYJFE68mW9XJFwLeVsIFyH15ZgJQcgtIeGklx4RzjAqrZZ0uFKEetmUC0ri8m9yoEPdQOMiZSUYSL8J5Gfp3vwAvHOkihWOU134U2gRI_TrNYP9xMLRPKDxsYs6HOOWe5HVabO0S3X96d8mkmmK107eykNf6p6D8oQ/w640-h184/c3.png align="center")

4\. Selanjutnya akan diarahkan ke akun production

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEho585gyvcIdacerzrpp3mkz6yfujGDUKMcCRQp1XkcGT31GxvLTu11gdIOZnBSTGzb-RQy__MXlvd8Qf5dGx4P7tviasizoQ4xUnuSXzF7Ym0DUn2picZv2_RpKwYSwMv_KhBZ5LWtW4Hl4KZjT3YduyARhluXdW9LC82xxbzs9sHWcAFoPXXHXmocHw/w640-h332/c4.png align="center")

### Buat akun development langsung dari organizations

1\. Masuk ke akun general

2\. Pilih service organization, add an aws account

3\. Create an aws account, isi aws account name, AHA-AWS-DEVELOPMENT, email [emailxxx@gmail.com](mailto:emailxxx@gmail.com), iam role name = OrganizationAccountAccessRole, klik create aws account  

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi7PJwi79nr1Z9BFo7ZiZVRR-e4MOBDc_6BoavvvDbprsT8LPbfbJzEf10gyyvM82qujS2rLzsm8Rd_3IyGAgROKzClNCv4JbggK03wVFj6hmiqlM1KL-3-HA1yWPtNBIxyz_WElmucVj0t8t0k43TdGFrKVqgqsI4DrkbW_uclm5-afRe038NiGfsTIA/w640-h484/d3.png align="center")

4\. Tunggu proses create akun sampai selesai

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgIv_a_7XnHuhP7aA9Ji_sg9DX2iUdUMitGkOj1ma3vo8VP_1EE4FWHsUxi9EeBEc_jf1bMap87WAQBdIthG9RQQXLpSGW3m94V4zyhQEVX8PzZcXGCUsgbgJaorF9oZAptVEeUd-1Nk1SfCxtLSMFS8FshYpfojOmVCE4hvqhw3me__8JZVzsYPVRITQ/w640-h88/d4.png align="center")

5\. Jika sudah selesai maka akun baru akan terlihat di dalam list organizations

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEith2PJY1nOIu3lg7Wtg3uJon7KYeZAXob551FvwYtKRCPKgq--fb6ZIInn6azdtygwCPclLB05OC-UQyRQ2JLRD1kBE2VuoG1uHOzcQCjt5oniCNId6XADSdlW6mFLHEsD3F1cbD796iFynjG4kjKZFEHhSarVa8cl0sIwgEjVtMJVl9fYz2Y08FIzyA/w640-h368/d5.png align="center")

6\. Switch role ke akun development, lakukan cara yang sama seperti switch ke akun production diatas.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjDOAeG6wkwfBwTDRyrFn_EFRSlwThMs6Pj788S9T08b1jrAIaBFNAkh-4nV2vbTDIzCLDvlyzguST8V5Gtj-3rdP9D3yEGa3GXsFMKBjojEVF6PHSQ62pA9fMYfroquiwu-POL9lD0hka3U6SUWjvJ3SrpU-PHvpJOKt5hMYCmeWHleVxggIyP0-j3Q/w302-h320/d6.png align="center")

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiLRXqK1aJ_bmdD83yNl2AeOrSOULhKHkSyKTW0jBUN_WRZgl5w5BFU8S901V-LOLgW09gB62cK8afzukhyDWxtmKbpCgB8GMTwRm4YS-RVlTkPQJfBYtVkhM0YRC-cDqW36kA_HxfKn-1BPDKxxSZrjlWKOIQPbOICoW4o5nMET7pLIzHYAgNgJPaQnA/w640-h182/d6-2.png align="center")

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2EOxMJu7NrZArJJjR7ED0H6vU4saov8mmY83cIJPlZrawvnsOGl8A4B86iyJKA54jGNy423y-TX0xzBK8KLjPfEet43EfwCYmG1mUnog6qAZk4EtswNDjKe_l4UjEX6F7Lw3ecKH3JfrY9T_VBjFa_TbGNFjVd2SiWNL8DR3SO33BpxNU_lHl_sziLA/w400-h355/d6-3.png align="center")

**Referensi:**

[https://aws.amazon.com/premiumsupport/knowledge-center/organizations-member-account-access/](https://aws.amazon.com/premiumsupport/knowledge-center/organizations-member-account-access/)

[learn.cantrill.io](https://learn.cantrill.io/)
