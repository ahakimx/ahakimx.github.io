---
layout: post
title: "Service Control Policies pada AWS Organizations"
date: 2022-11-18 12:24:31 +0000
categories: []
tags: [awsorganization, aws-service-control-policies]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/0zRt0bQysMw/upload/676b9d76c640f7d0e9b6ca7eaf627d60.jpeg
  alt: "Service Control Policies pada AWS Organizations"
comments: true
---

### Overview

Pada tulisan kali ini kita akan membuat control policies dengan membuat organizational unit production dan development.

Jika sebelumnya kita sudah membuat [organization](https://ahakim.hashnode.dev/membuat-dan-mengonfigurasi-aws-organizations), kali ini kita akan membuat policy yang bisa diterapkan kedalam akun. Lebih detail mengenai Service Control Policies bisa dilihat [disini](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)

### Kebutuhan:

* Akun AWS
    
* AWS organizations, [disini](https://ahakim.hashnode.dev/membuat-dan-mengonfigurasi-aws-organizations)
    

### Langkah-langkah:

1. Masuk ke akun general, search organization
    
2. Centang root, kemudian klik action, create new
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSnmlpVm7volDYz1SFkRIRPf8sS4SliWxZb6eMm9jRuOIQsDJflf8lR7kDrFti8SXtBrr5HcKxO1ZIo1eHb5OEzWdKm8S2Fh-wr1kIUq70Fysj4LSVrnwOwDg-YT1fYCbQGHetqkBrMVk2bL2mNT7F92XyduJnC64RDVRGpvYmZErmQ3mZ2BKaL8KzWQ/w640-h334/2.png align="center")
    
3. Organizational unit name, PROD, create organization unit
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhZhwLm-6qnXN78Ckdi2jXB_amscSpUkQrlHPwiNvm2pu_yfbme8gcND7fVILzYcK5dJoVhPUqKnjFDyd4w8uUAr7UmRg6n7GLT_2kQKJAQ1PeEGkiGfhRtFwUeKStlqDTait6WcHavMEE2aWVQ9aMcfd52cFtW2aSTlIq0ju5OpGj1npCTEnMh_6Aq2A/w640-h318/3.png align="center")
    
4. Centang root, kemudian klik action, create new
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgULPYQ5m5I0YtewbiKgW2kUeKgBubJ4Min4uVnPu80wzGMTio6bGA_tOybFjNPhSskkKSavOjyytaJUGduMBcsCOFvmtnlsSFG9lqamekOA8ebtt63ceZ-ujNn1OlrP9usS57Vj6kJ6FPjHtXput32ywjh1Lmlz8YUvqgjfuoxapu0t7aafLfiO2T0jg/w640-h334/4.png align="center")
    
5. Organizational unit name, DEV, create organization unit
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgULPYQ5m5I0YtewbiKgW2kUeKgBubJ4Min4uVnPu80wzGMTio6bGA_tOybFjNPhSskkKSavOjyytaJUGduMBcsCOFvmtnlsSFG9lqamekOA8ebtt63ceZ-ujNn1OlrP9usS57Vj6kJ6FPjHtXput32ywjh1Lmlz8YUvqgjfuoxapu0t7aafLfiO2T0jg/w640-h334/4.png align="center")
    
6. Pindahkan production akun ke PROD OU, centang production akun, action, move
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgz-2DqiFsTL2XdMIh2SaXTMtk3x4SAbcG0sQHDCtV2tDNGtwlfgKLlja3n_ig1XZXZH9SuBmsp0uMl_FY9EUttvZ1bKhX7Un88MAkeAfjgcmDPKlrtQE-I-TgIY03QvZjPOGkG0L8Pvp0rlUmuglPW3fWqU4C__ddfcomm8_QlE-f0TNL-Tc-ZqA9p2Q/w640-h362/6.png align="center")
    
7. Centang PROD, move aws account
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiX620czZnhMgPPee2edO0Haj3ji6IZI3opZjVnkdovlSlEGDX7lsrabMVPov2961wtg44h_R3eWBUtG9h8IcnwouIIMcqyZ7hv5Kmi4s7W3zuws-duUQaVBNiQYjqWmoqAkCYBqdZEwS1HMvt6XjPDi6siLVoW9p_entxBwheWswy0bmsMDO6aZ_Ynkw/w640-h384/7.png align="center")
    
8. Akun production akan berpindah ke dalam folder PROD
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEje1ronnuklfwRW_phhuVCRtQGdlXYsMN4vJjGVYA7pLusrIoSbu3cfVqED9zmZB_K2cZwksCdqOLaZBs_-JBJn_U38jGF3Xo1OisleFCI9YdCOAnD6L2vG309zc4XRGTWTSXtvOv3G0NUqTwKPX03NI8xMqfm-XG1KJQfHZpALnynO7qanO0V4P1cHcA/w640-h294/8.png align="center")
    
9. Pindahkan development akun ke DEV OU, centang production akun, action, move
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3tjKXRtIAkMRWuhijC5aT2KGYXk3M3gQ_FOsrqPPJOID1SH6enZxH513BYv5npt5MG4M8-zlyx3vJ5paBBnZIjKr4Ur2Gzj09OTgQxK6OzDyzgclEiybpF3V4wDlQjdDhG-Ei4cfQd-IhP2_-270YvpE25Bx-T7okdohdpNTi7fCNDEBviZIK7V0UDQ/w640-h280/9.png align="center")
    
10. Centang DEV, move aws account
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgAFumzwNJJW5PnCTgMCYiW4l2wLday0HZGyW-H9cf8WwlLBNFK8H-oNoMCOr0oj_eRwN0ABY3cMyEOvNUNFzZ88U85vUe83AVUA2A5GpmBBz-uI_z5mYZ73-k9iTpdAXdB6lwje7vWz_KoW4lVuBOFxLN930Mz4EzLd8HrdTfiYpqANvZNP8K24454qQ/w640-h392/10.png align="center")
    
11. Perhatikan hirarki dari folder DEV
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBYX6Iy3siAaiA_bsiZHtlD0vqwxIeE23hCfufpqtDoVWx7tKBK5EniAJkIW5lmViGi0QLE4sTqVKooOMDFK3cVAO4MZ4D7EMpjAhYkVYRz5xRQOs1CgrgZsJwNW7Q-q7ZdKbNPgZ1vKYuPDpiRkGLYLJWINZHH6g9-aBNIJamCnvJKOMrobNqfUTxlg/w640-h248/11.png align="center")
    
12. Switch role ke akun production
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhaqArDtjWmlaFiXu_A482K-FGHHYykP_WIla3DhPQuQ_dqzotgcVs6rUB2D7Dlcvix-2_zIb8CEmEkBGbDeidzMPq24Y7vtDeXxNf5I9VyR4syYkxwCme7jF1BtESAOX6PicGb49iepm8-hhrjhgjSOsoNHNxzIumWYBmTRBOJeVKohtiuqdekOz8G4w/w320-h267/12.png align="center")
    
13. Kemudian buat S3 bucket dan upload file, kemudian akses file.
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-djYJicmENAvkuSC0OcEu83AZkFEbnntLbMoKCQ8kXbQLT1emkCJSxykk1zuiJboUkyWesY0HsuzEzsDk-wJIBcJOyUachVKEMYiV883B68qEDl2IVk1befDI0WmLrf5T2XDct3jvthwBUDWCb6penVn-mS4Y8YAdoFUxPJr8PZWUFrw6rf6Dwo7pQQ/w640-h332/13-1.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhxPsrpyF5HV_rh1AbMwEOZOOaUNQqunfkoIqGbvPUTUHehtxHXJ0TPEcauVMwEGUdJf2KLfe0G6Y_4H0fgoppnC88xh-uR-eI-6q8LaPPwU_KcZADpfUIazHCSppuEiu-Pvu9zcAYIQp9BZY13pmFlsdOchuz7cJFsxoEHugFlRWJL7T7FEEqPDUhUxw/w640-h180/13-2.png align="center")
    
14. Perhatikan iam roles yang terdapat pada OrganizationAccountAccessRole, disana terdapat AdministratorAccess sehingga kita dapat membuat s3 bucket.
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiTCKVRydEWJgMBesrTjqkmmF8JaCdACjOrvKDpovAKYOA7D0PhwAyDkcwvA89f7qj5a-MOz6d7WxpsMtC40iDNjtS4AXwxgBOeLtaf_qODsLTlcQIK4WEQ3D5UaUOgddmN2d2BnpPRW6i06ecr-_UuKA9jK2h1qQe9mB803AkB5ZaBkUagckdY2WR2hA/w640-h162/14.png align="center")
    
15. Buat policies dengan, switch kembali ke akun general
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYAVp3JiH2FMAP1ZCMp8qxDBDVg2Kfc5UGnpEtj_7xzzuwqr0GjHzjBZns2YMDMCEUSiRGIbkmj7J7Z4797QMnBfAXUNVK24VvGi_L7XCaHoT4f_n6ALhWeYXfCvAdZIzODB-_jkSbS8yoiwuIHchbk5L0B4xjU8UCCsDtQYMu_hImkt-ExJ6ss70Agw/w640-h298/16-1.png align="center")
    
16. Pilih organizations, pilih menu policies, klik service control policies, enable service control policies
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjYAVp3JiH2FMAP1ZCMp8qxDBDVg2Kfc5UGnpEtj_7xzzuwqr0GjHzjBZns2YMDMCEUSiRGIbkmj7J7Z4797QMnBfAXUNVK24VvGi_L7XCaHoT4f_n6ALhWeYXfCvAdZIzODB-_jkSbS8yoiwuIHchbk5L0B4xjU8UCCsDtQYMu_hImkt-ExJ6ss70Agw/w640-h298/16-1.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEglsJnhf9_khwOYoIsYOjKGv04JDfyBgiulk9C93jUjO1oXaf3ho0722cLv4qLDk0fzu-jz_DYpCk_Qp5Y5XL2TQZDp3dQ1hwB1NLqccvGz_OZ9LK6135AANOSasYWKsLf2SdXh-LRx2KhelKOXzf99AxMs81Un6v9EkSTiFmlrKZMNOvtzksKxuPqCsQ/w640-h142/16-2.png align="center")
    
17. Klik fullAWSAccess, perhatikan polies yang ada
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj927Y1uFXn23ppDCKys7PT425JBpYjK5d4X_wzDzlhMkk8yO4iry71OiKaBa6mIMZQwafpyYlFU0QtqGO4_3Aa5CnlPvFW1T2EmI2Yu7Y2wqd1NNHTyOsEUFXgzgGv1X9MrBZP6Fh9G-3jWDjaIwDUqGmRu_iqzBASE4OwLMNGjbpuf_FLDK4uHcuahA/w640-h230/17-1.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjEl9jW-0jtvS5dluxAp_aZ7Hllu3PeYJEd5NXW_gcoXpAm4DY08ifFaP_dZVgbQRDZhXLpcdmDZAS5vzBTGwaVRibYpCw0Kt2IxsgeY5hPYWYp0sGJQb3qDZYJK9QrRRgExrXIHf93sTZSwOqIQ-g7wnRb7t46AXe3Bp7pCJu2U_QntGOaWnrUoRqVrA/w640-h280/17-2.png align="center")
    
18. Buat policies baru, yang bertujuan untuk organization tidak bisa menggunakan resource s3, dengan cara create policy
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_MllNHsOVT14hAnnbh_EXlswsrXJr4ANLTQXvQDwveLghFH_2hzjTpQdrQlxrpvfxY49kz07c2bo3aRDOx4bs5YBQj-d1CaQyD_kUqp47b39iGLwjkuQDXmKflcSJMJDuFipqYErfbQJPzGufbuMwJM_HAm7veprSvVXiYHnWPi5Sa2tHqeSc6_7hQQ/w640-h240/18.png align="center")
    
    * Policy name, allow all except s3, isi description
        
    * Replace policy yang ada seperti dibawah ini, kemudian create policy
        
        ```bash
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": "*",
                    "Resource": "*"
                },
                {
                    "Effect": "Deny",
                    "Action": "s3:*",
                    "Resource": "*"
                }
            ]
        }
        ```
        
19. Pada menu aws account, pilih folder PROD OU, tab policies klik atttach, pilih policy allow all except s3, attach policy
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjMx9ZPks9UICjOZBe0oKJSNSbLewP_ey25t8xgtOmjN_ENAc1mB7oDdlDfC8p6UV9j9m7QrL1Enmk4SUM2o2gz3yeSuV6Fy3ptqXo4-qoQwMKiH4HmiQle_wHTeOQf7RnIkGUTnDNaTMUUmc5CYxcaHV26jMTb_TydDTS3Yu5rtnI_JyI96oQxuR9dUw/w640-h328/19-1.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgi_T7HRn7V9a1Qf7ArGNZuT8y7Xdas4BfXEyUoOCYB3TUxMOrpdpJjEgKDtGymAVr4RmppfVfJB5WGVs6ruiLMHTqY151CNOeN4Bzo2JA0osQtGi73GsDV6sgYe214oidzxCpnQ5H1AlyaTOnF3c7k5hOL9Xt7C9es_EYcmzIgZTyth9NVuk1G-cuqgQ/w640-h352/19-2.png align="center")
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgH2B_6qsVV5FZiCvugwpvW7H4m52gOHwiEDVJiXkIdTvlKKkSe8cGJPcWGpqPRk5ws3pfIWeNj-HjZpQb4A21yikG_4HPVD1ONS66_UuwbEuW4LEYXPELadzWCquYgYx985UfqLQLl1bJHf6YktUVYx5WyeS_1GbRhI4CLwu6aWwn4PjggRph11gknCg/w640-h194/19-3.png align="center")
    
20. Perhatikan list policies, policy allow all except s3 sudah terpasang
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEigF7PVpe2L9vdi0DWO-fYwpgIToiFPPf5txP-O2jCD_Kq0fwgoTK19F13no2u1at2NgmdOqNqpkh14cdALJ955FtBI9Bo83Z8XqLv8uqiC8BgCPiOUkf855Lx0QlhD-xOTLzKCikfDUtvFOCp-iQ-8JTIIskWGNrqwSbtAXf-v36raRreaqD-XrzkTjQ/w640-h376/20.png align="left")
    
21. Detach fullAWSAccess policies yang source directly
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhbDV3U3HUV-a333EmTfxqlTtYj8_bzi_TBStatjCjawafzJ99lbboMAHDOJD4VmmfTQBxDBhj9uColqhq8wDwc70PuqFxsSDo9_LsUby7WJRp0d68jz6KXzCKAS_yoeFYUtXbsQN4IsWVJSVDTDx8cbIo6BI5dqNkpcXLjk-DO1t1Na_S9hK4t-jiG1g/w640-h378/21.png align="left")
    
22. Switch ke akun production, kemudian buka service s3, buka salah satu menu, seharusnya tidak ada permision, karena kita sudah menggunakan explicit deny pada s3
    
    ![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgMDtPnwTc0VTsOBkw-0QaVxQswKvMQ5wXyH5hRozr1414Cnul0HoSivW2WQT-mVx02GT256Rqas9vh1EXG8m_Bv2YFtYtbwJIiaUbatISw9jwEz_vdQFtflIz3dW2-TIazJjBBkrAFGFshONf1rXcJEVUi6aIhIOm3buwWGJ6Pp_i5wumUmpt6R-jvBw/w640-h292/22.png align="left")
    

Terima kasih.

Referensi:

* [https://docs.aws.amazon.com/organizations/latest/userguide/orgs\_manage\_policies\_scps.html](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html)
    
* [learn cantrill - aws sysops training](https://learn.cantrill.io/)
