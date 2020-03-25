---
layout: post
title: Use Volume Driver on Docker
date: 2020-03-21 05:01:00 +0000
categories: docker volume

---
We will use volume driver on Docker

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585143544/myblog/1_MmU4OPG3DKW3W8NgW2bDCA_zavxgn.png)  
![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585143568/myblog/1_EJpPsq0eR5tw1zZ-c2lk9w_owqdpl.png)  
I use two instance for volume driver

**SSH to pod67-node1 floating IP from pod67-node0**

    ssh -l ubuntu 10.1.1.13

**create /share directory**

    sudo mkdir /share

**change directory permission**

    sudo chmod 777 /share

**exit from pod67-node1**

    exit

**Install plugin sshfs**

    sudo docker plugin install --grant-all-permissions vieux/sshfs

**View plugins**

    sudo docker plugin ls

**Disable plugin**

    sudo docker plugin disable [PLUDIN ID]

**Set plugin**

    sudo docker plugin set vieux/sshfs sshkey.source=/root/.ssh/

**Enable plugin**

    sudo docker plugin enable 86d094668892

**View plugins**

    sudo docker plugin ls

**Create volume with driver sshfs**

    sudo docker volume create — driver vieux/sshfs -o sshcmd=root@10.1.1.13:/share -o allow_other sshvolume

**run container with volume**

    sudo docker run -d — name=nginxtest-ssh -p 8090:80 -v sshvolume:/usr/share/nginx/html nginx:latest

**SSH to pod67-node1**

    ssh -l 10.1.1.13

**Add text to file index.html**

    sudo sh -c "echo 'Hello, I am hakim' > /share/index.html"

**See index contents**

    sudo cat /share/index.html

**exit from pod67-node1**

    exit

**Docker ps**

    sudo docker ps

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585143629/myblog/1_yegckxnuddmiR08xIiAV2g_uoyn7v.png)  
**test the container**

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585143685/myblog/1_kxxAG8_NXMRiENm-IyL7jw_vewups.png)

***

let’s back to [part 1](https://medium.com/@ahakimx/introduction-to-the-docker-volumes-248e1d98948f), introduction to docker volumes