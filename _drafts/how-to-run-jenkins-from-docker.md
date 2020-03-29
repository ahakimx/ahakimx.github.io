---
categories:
- jenkins
- ci/cd
- docker
layout: post
title: How to Run Jenkins from Docker
date: 2020-03-29 16:58:00 +0000
comments: 'true'

---
#### First install docker on centos 7

* Add docker repository

      $ sudo yum install -y yum-utils \
        device-mapper-persistent-data \
        lvm2
      
      $ sudo yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo
          


* Install docker

      $ sudo yum -y install docker-ce docker-ce-cli containerd.io
      
      $ systemctl start docker
      $ systemctl enable docker
      $ systemctl status docker
      
      $ usermod -aG docker nanox


* Install Docker Compose

      $ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      
      $ chmod +x /usr/local/bin/docker-compose
      $ docker-compose -v


* Download jenkins docker image

      $ docker pull jenkins/jenkins
      
      $ docker info | grep -i root
       Docker Root Dir: /var/lib/docker
      
      $ du -sh /var/lib/docker
      586M	/var/lib/docker
* Create a docker compose file for jenkins

      $ mkdir jenkins-data
      $ mkdir jenkins_home
      $ cd jenkins-data
      $ vi docker-compose.yml
      ...
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
        ...
        
* Create a docker container for jenkins

      $ sudo chown 1000:1000 jenkins_home -R
      $ docker-compose up -d
      $ docker ps
      CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
      cdcd15d0b313        jenkins/jenkins     "/sbin/tini -- /usr/…"   21 seconds ago      Up 19 seconds       0.0.0.0:8080->8080/tcp, 50000/tcp   jenkins
      
      $ docker logs -f jenkins
      
* Save password, example:

      1c94a093462e46cab76f33c30ae732ae
      

  Access your ip on the browser: 

  http://192.168.88.24:8080

  ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585502093/myblog/Screenshot_at_2019-12-18_21-54-24_oe3dka.png)

    
    
    
  ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585146747/myblog/1_6sWVsmIEpOdqmMaKQYz1cg_hao1j1.png)  
  ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585146766/myblog/1_DMYCZw1wOOoUElHVV4AdTA_cuueiz.png)  
  ![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585146792/myblog/1_a-2W_ZpOIxW6UzZ_SCE-Sw_fs0hl9.png)

  ***