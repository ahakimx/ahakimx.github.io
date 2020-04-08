---
categories:
- blog
- jekyll
layout: post
title: Membuat Blog Pribadi dengan Github dan Jekyll
date: 2020-04-08 05:01:00 +0000
comments: 'true'

---
Kali saya akan menulis langkah-langkah untuk membuat blog pribadi dengan github dan jekyll.

Langkah yang harus dilakukan adalah:

1. Masuk ke akun github, kalau belum ada daftar terlebih dahulu [disini](https://github.com/join?source=header-home)
2. Buat repository bernama username_anda.github.io
3. Buat folder di lokal komputer 

       mkdir ahakimx.github.io
       cd ahakimx.github.io/
       ls
       bundle update
       jekyll serve
       
       git status 
       git init 
       git status 
       
       jekyll serve
       
       git status 
       
       git add -A
       git commit -m "initial commit"
       git remote add origin https://github.com/ahakimx/ahakimx.github.io.git
       git push -u origin master
       
4. Gunakan forestry.io untuk membuat konten CMS, daftar terlebih dahulu [disini](https://app.forestry.io/signup)
5. Integrasi dengan comment Qiscus, buat akun terlebih dahulu di [sini](https://disqus.com/profile/signup/), saya menggunakan versi yang gratis
6. Edit file `_layouts/post.html` , tambahkan code berikut:

       {% if page.comments %}
         <div id="disqus_thread" style="margin-top:25px"></div>
         <script>
           var disqus_shortname = 'myblog-qtlmkgifef';
           var disqus_config = function () {
             this.page.url = '{{ page.url | absolute_url }}';
             this.page.identifier = '{{ page.url | absolute_url }}';
           };
           (function () {
             var d = document, s = d.createElement('script');
             s.src = '//' + disqus_shortname + '.disqus.com/embed.js';
             s.setAttribute('data-timestamp', +new Date());
             (d.head || d.body).appendChild(s);
           })();
         </script>
         <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments
             powered by Disqus.</a></noscript>
         {%- endif -%}
       </div>
7. Kemudian push ke repositori.
8. Akses post dari url, kemudian terlihat komentar dari disqus

   ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1586318747/myblog/Screenshot_at_2020-04-08_11-03-53_jhqeyt.png)  
   Sekian dan terimakasih.

***