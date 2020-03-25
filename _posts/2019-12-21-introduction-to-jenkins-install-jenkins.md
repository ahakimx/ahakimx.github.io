---
layout: post
title: Introduction to Jenkins - Install Jenkins
date: 2019-12-21T05:01:00.000+00:00
categories: ci jenkins
comments: 'true'
categorie:
- ci
- jenkins

---
**install docker on centos**

    $ sudo yum install -y yum-utils \ 
    	device-mapper-persistent-data \ 
    	lvm2
    
    $ sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    
    $ sudo yum -y install docker-ce docker-ce-cli containerd.io 
    
    $ sudo systemctl start docker
    $ sudo systemctl enable docker
    $ sudo systemctl status docker 
    
    $ usermod -aG docker nanox 

**Install Docker Compose**

    $ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    $ chmod +x /usr/local/bin/docker-compose
    $ docker-compose -v

**Downloading the jenkins docker image**

    $ docker pull jenkins/jenkins
    $ docker info | grep -i root 
    Docker Root Dir: /var/lib/docker
    
    $ du -sh /var/lib/docker 
    586M /var/lib/docker

**create a docker compose file for jenkins**

    $ mkdir jenkins-data
    $ mkdir jenkins_home
    $ cd jenkins-data
    $ vi docker-compose.yml
    
    version: '3'
    services:
     jenkins:
     container_name: jenkins
     image: jenkins/jenkins
     ports:
     - "8080:8080"
     volumes:
     - $PWD/jenkins_home:/var/jenkins_home
     networks:
     - net
    networks:
     net:

**Create a Docker container for jenkins**

    $ sudo chown 1000:1000 jenkins_home -R
    $ docker-compose up -d
    $ docker ps
    CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
    cdcd15d0b313 jenkins/jenkins “/sbin/tini — /usr/…” 21 seconds ago Up 19 seconds 0.0.0.0:8080->8080/tcp, 50000/tcp jenkins
    
    $ docker logs -f jenkins
    save password -> 
    1c94a093462e46cab76f33exxxx

open browser [http://192.168.88.24:8080](http://192.168.88.24:8080/)

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585146694/myblog/1_b6aKQObKFwHAX0RfmFDCsQ_mgqven.png)  
Install suggested plugins

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585146747/myblog/1_6sWVsmIEpOdqmMaKQYz1cg_hao1j1.png)  
![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585146766/myblog/1_DMYCZw1wOOoUElHVV4AdTA_cuueiz.png)  
![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585146792/myblog/1_a-2W_ZpOIxW6UzZ_SCE-Sw_fs0hl9.png)

***

Thanks..

Reference: [https://docs.docker.com/install/linux/docker-ce/centos/](https://docs.docker.com/install/linux/docker-ce/centos/ "https://docs.docker.com/install/linux/docker-ce/centos/")