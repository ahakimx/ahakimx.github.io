---
layout: post
title: "Deploy Website Statis menggunakan AWS"
date: 2022-11-15 10:38:40 +0000
categories: []
tags: [aws, cloudfront, s3]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/DtDlVpy-vvQ/upload/c90a829b695ae4f5ada35572772dcfa2.jpeg
  alt: "Deploy Website Statis menggunakan AWS"
comments: true
---

## Overview

Project ini merupakan project pertama dari [Cloud DevOps Engineer Nanodegree Program](https://www.udacity.com/course/cloud-dev-ops-nanodegree--nd9991).

Cloud dapat digunakan untuk menghosting situs web statis dengan HTML,CSS dan JavaScript yang tidak memerlukan pemrosesan pada sisi server.

Pada project kali ini kita akan mendeploy sebuah website statis pada AWS, dengan langkah-langkah:

1\. Membuat S3 *bucket* secara publik

2\. Konfigurasi *bucket* dan mengamankannya menggunakan IAM policies

3\. Mempercepat pengiriman konten menggunakan jaringan distribusi konten AWS (CloudFront)

4\. Akses website menggunakan *endpoint* CloudFront

## Prasyarat:

* Akun AWS
    
* Code HTML, CSS dan Javascript.
    

## Langkah-langkah:

### Buat S3 Bucket

* Pertama kita akan membuat bucket dengan cara buka dashboard AWS kemudian arahkan ke pencarian, ketik s3 kemudian pilih s3
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9oS90w0VVUTDs_qQBHE4BSp5qoExftDWe7J3CMH9RlT2vAgqJmIcbnn-AbXuqYKsP45W21y7L4jT9kH-QklsZa95mRokPTk4PXJGyEyof43hKWbd2Bff2LHypMYy0Mgy3aIS3ykhnwXEjd1lsyvvNG1MhKyQfu-LO5S5fngxRdXsno0J_RBWoUrUpXw/w640-h240/ss1.png align="center")

* Klik create bucket
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhgzkSa1APPHO-VsK14YpL729eraURoINtXUknCwg31UgKsm_eYsEK_FJeR5T8QH33dgPyJabqx7X4GFLaVL5jzAcpcnMOo0luDVs_rUBGPYltss_rsueLPiNhmQoSeBOJancAM8iMN_LH79GomklNcYIz0_QwDF9zrdkZejQrsi44uX5PNQfa2CHjN1g/w640-h220/ss2.png align="center")

* Pada General Configuration, isi nama bucket dan AWS region. nama bucket harus unik.
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-Xst0BANKf80AcpvfLjuTYH2qdYQXd9gMXTJ1DUK5YO2rxtk65T5-ivunHxAHBv9V8c7cr1Hi9-AbPXbemb1ugyaOtJjiqokiULpcN7nxTamfOFNV9NlCSFMrkoY0H4X2_anX0c3pdtz2q5LqFE2OEWlCp4au7eiLP-Q5OBa798u1lXIsBeG1tVCHqw/w640-h430/ss3.png align="center")

* pada bagian Block Public Access settings for this bucket hilangkan centang *Block all public access*,
    
* kemudian centang *Turning off block all public access might result in this bucket and the objects within becoming public,*
    
* selanjutnya biarkan default
    
* kemudian klik create bucket
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiYh2bOaWmZzYPuWsxKOKZxbwhHY7uBV-uFrx-VS1hiL6wkCaOSN1fLGDfSWMrl6Nlut5pMua59DP25lReuC92wcLLCaVE1ODWQ01zzr7jBlgfkO83Td1jgT3EQAAGmXvtTh_vuBs141iFFgErpJqGMoOZnxyLKprkjMZY9qmOLcJt8yQPZ_t5Nh0m90w/w640-h506/ss4.png align="center")

5\. Jika berhasil maka akan tampil seperti gambar dibawah ini

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8A69iwYEishXHxAszrUoJeRk-l3xRI77kP-y4N-Zkj1Up4pX0r4D7Fa7hZcKiBqyfYGQfaN9Qi_MEI0USmhaLTysNpTuhbtlkMsMPrFtDlCfXqc5tACBvl-wgp9dYIAUTDo-gWEs0sCyyBLrsITBvuTwXkD11knbvITEogueK0Q7uPLtNXj71vmac1w/w640-h268/ss5.png align="center")

### Upload file ke S3 Bucket

* klik upload untuk mengupload file dan folder.
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgimQ_2xhgh2CfbIZGE2OnIHwfBHwpprqpEnewm52HIrzgyEoNvTEm4qU_F5oa_K1EERbdkSFOrlACSPifhIeO7nsLOa4fjIuC3lt-c1gSD22hPL9O45KzwfOK67SXLGXaqz9Fp2nwUK9cgnkxZeeGitQ4Zo3zh7_k9VrMbfCFrYBt3rzIZnJZbFmjz4w/w640-h274/ss6.png align="center")

* klik add file dan add folder, untuk mengupload file index.html dan klik add folder untuk mengupload folder css, img dan
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPs23DCbm7VcwM-cXSVa5MtZ4EWmovznMG-dTkfBqzEmMjGZq2CPIpVU0Hh_r5K_D88x3qoXdhjRpxgo0pJafSJNRaJa3BiWdGtBesYvqlAKMPTNMl7xRnBUgfhOGtUxdtXMr3oPNKu-mdNcj9ncXHNKOVTkXZ4JWmIQk1BkViak7782EbqAHgpqi7Ig/w640-h428/ss7.png align="center")

* Setelah mengupload file dan folder maka hasilnya akan terlihat seperti ini.
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjpVaDP0W_hPegX_cbJga4gTEpzz0m7GMGaP_T3gVioecoPFWYGKO2X1hl4F0kcu6hj7f1SMplrj6VnwTXmPeAUE_ncSFjuvYrMFWgkAAjsLAEGsEpoQNMk_r40tnjTfCoOL096JC9dLfyWnHqVPxOBZNDSnDIN4FbymrHKW4r09p1hvXXXMl5PyiRiHg/w640-h262/ss8.png align="center")

### Mengamankan Bucket menggunakan IAM

* klik pada permissions tab
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiLCaIymLHuzesJwZL_vhI4-4XJiJ_HVEX0hqlQl1cRabfzhK_Nme142v37OQhn0NNNLRgrGMee5JgB5bLx_45NbXWt3HEJA5RvV02cmfBEYKBrt4mEA758HRO6CGCBzNzbv8wOyWyT4OUQURZyjknFKlZl_0YfgFBTjcAmgidUKjIMNwsvFyKbV37dSw/w640-h348/ss9.png align="center")

* Pada bagian bucket policy, klik edit kemudian tambahkan policy dibawah ini
    

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkDIuNyILoB2Uc50Lmzo2K0vYd_bZJ7xFfV_thPPgidTPE_UFr0BxmsSuFxIBQ31ovDNtBFLkE5RomaOSFS9kzq9GNlBnEe1SdbPk12gooAjrdNkrhyb2MyYwgsMqysUh4HmPynjfKnPA4PTOLBeojU0mvwLMy3jUKDLTvU8Dk1b2RGVJMj6bZKlFHlg/w640-h216/ss10.png align="center")

```json
{
"Version":"2012-10-17",
"Statement":[
 {
   "Sid":"AddPerm",
   "Effect":"Allow",
   "Principal": "*",
   "Action":["s3:GetObject"],
   "Resource":["arn:aws:s3:::your-website/*"]
 }
]
}
```

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg8QtZ3xlpvqGLjm_fP2Zdr342NqMnoRwUr9jyUhmqbsuJje4Pc3_KTcXtAESrBZCW5E55Q5IYPVnutXthbJTJVxv6rGmJElGiswStJpe412rIYSdRtecr84o1KlW_CVLkxQNZeRPwEFlb4JUlWJ4Vor7cvh9uCz4SRPv2MC6IH3KkmL-t18rrCTmMCxQ/w640-h294/ss11.png align="center")

Pada bagian "Resource" di line 9 sesuaikan dengan Bucket ARN, kemudian klik save changes.

### Konfigurasi S3 Bucket

1\. Pada menu properties, klik edit, pada bagian static website hosting

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8XZ-Ch6mjXcmEQgS59xA5mwvJoALIKSx64CzXlodNqKwBpesmztZ2zwwZcybsSk9RJCgmdRdTTvKsH1pn_XrC51xDwi6ouAVj0HTQfrXcYQL9pHfFZj5trSk728K1Ys98Q4nMzAfNUUgYKCJlA0jT-6fJtQn0cusBzHNsfhmAqzxt9RjIGaQeQFEoWg/w640-h178/ss12.png align="center")

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgaLucf0lRSyEYAsXLGqDCYxVZHcqEaxtQh-vlEeTbieRL1-9vNX_6GTkhmU1cr3RJQBVaOQAU2_Z024ymM2St0UApzYrgJrsjW8GB03J0lOhtdQ9rt2fNgCVKDjHNnJOyjR_wAcprhLeUZ71bx00evMG-Eo-a5lGo_PxuRupPqzFfi7Om2EP_VbfF0vQ/w640-h60/ss13.png align="center")

2\. pada bagian static website hosting pilih Enable, isi index.html pada index document dan error document kemudian klik save

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhkeTvTMI7acndBaWmba6k4OjQWJ4AdjDdX03EXOmPIH1TeH8cN8s_gPSoCP4lkvOL3HWg-Vs4Ri0L7t1gDEFxz4C52NOGtR8zcYPZKbRhuWJ_RCBQC67o0COxM4tRUgxtagZK-w1mTl8xropQLGt2E69YjpCkEIXm0zBr7h518UXHW3S0zgk_T61p7_A/w640-h488/ss14.png align="center")

3\. Pada bagian properties akan terlihat url endpoint, seperti dibawah ini, pada bagian Bucket website endpoint

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhAR0zmsCaC1iHAaPGQVXlBN-4fEo9wzfTys0jqzCeFBO6Vp0TxjGA4wfv5yizXEDfIS2ypNGnnXmqAgKpMLdMW96FoyIL-4Ug2pO60mLoSh2NurqUHhJ6emIwBHX2c5MpO7xNn9BNDfBPFPNyj1XAMU1VkTgBNgNKVj0h1waoi4NFkPTwFRLBvRPwVXg/w640-h290/ss15.png align="center")

### Distibusi Website melalui CloudFront

1\. Pada tab search ketik CloudFront

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZgjPdIdq8lErvVR5ZUaMvR7M0T28-USatA9UxlndeIPdU6NjTnHXEgoFqkdT5NVHd4N_fSi62Uku45BVwUcy8yD12_ryqq3fZ_c31KZfBS2zyzqgSpg0KTupns--aqnTQhw3pubp_Ia-uQpBW4cJSty6yc6QKznitHCqdkS56DbfLNrHfju8mo7Nc7w/w640-h138/ss16.png align="center")

2\. Kemudian klik Create a CloudFront distribution

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiJHdbyup0dFdUCuHdLG1psUbSeoD-S8qP4-I7NCEbszMTA71Wgmv_RY5SwmQp0oEwDPHVav5iVf9zkCNVR9WKYJLvRxmMhUAmdgyo865sgt-WnRjXMpYP5nIzNjlrnv6kYXVKdy-qVnCQxiAXcg6_ZsszpRLwDwqExXSYAq7s7rypjz0qb6F8uWgsSsg/w640-h146/ss17.png align="center")

3\. Pada bagian Origin domain isi endpoint bucket yang sebelumnya dibuat pada S3, selain itu biarkan default

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-019HdXImcvM2G89zvs6ib0cd8NmZ8cHzyiAZS_r9Mqg3e6wExno1f-x96-nuzmWWF0VEHnAQt-QRMCHeCO5DH0tIHyZ3pIiSb8GSMxX0YkBJT9085EtH0KhpN_2Jwoo7UQS7plRKHVreh1x0fWEB4EprgzAHntyg39iIY3BMOzXO6pmS_QXjCPMfbg/w640-h530/ss18.png align="center")

4\. kemudian klik Create distribution, biarkan proses deploy selesai, kemudian catat domain name.

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwfNLBSJAQDjjaupepxa5evTlfvoDvl-dw1jfHv-V4RT0vYLXskaAIEfnL_6dtzFcAQk6tAwdx_0P5IjajBdpyINbzx8Qbd-1r2d5bnGbrehfXPJKWB3JzXngPMqfWy9ClnejzAOPuGatwoCt7eFquy028pPknOIaKd4l40TGNgmIt2BE6yoqxgBTZXA/w640-h96/ss19.png align="center")

Jika sudah berhasil maka domain name akan terlihat seperti berikut:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcMWSJdnbu18wSA8h2I6ysH6Z5ahNrjyn6CmN3OBCJVC2GI-fQSKH2KJWdGkjZTpABvXHkG9PRSkhfXD0ia3JyrPrfa_sZJpjYyFWJXiWczKvux-mSPNEHXFzQCovYiPBKUS5a66nr-7nwCaabu2xVfjAK5bMBZErpdO19gjr6aaA_9oEK5Fkawj-HOA/w640-h108/ss20.png align="center")

### Akses Website pada Browser

Akses domain name CloudFront yang sudah dibuat sebelumnya, seperti berikut:

![](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiG0sJUQKuMKjE-8QFrYQD5gXFxhtdCn41jSGjeg54AeHRjSAd--BhWZ3_mrFFmaHdsbPkWFscFZK640OYdjuCHRroNMXiwDcADgl3jMt-RTNMpTb82p6eJeOJZR6Nkj32_F-YukfCV77O36hPK__rKMlk3Er-P060tdE8WPa4cXip0zDnYdSp7ZCiIyA/w640-h284/ss21.png align="center")

Referensi:

[https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-serve-static-website/](https://aws.amazon.com/premiumsupport/knowledge-center/cloudfront-serve-static-website/)
