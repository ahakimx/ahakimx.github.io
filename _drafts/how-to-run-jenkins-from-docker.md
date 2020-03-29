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
How to Run Jenkins from Docker on Centos OS

First install docker on centos 7

Add docker repository

    $ sudo yum install -y yum-utils \
      device-mapper-persistent-data \
      lvm2
    
     $ sudo yum-config-manager \
        --add-repo \
        https://download.docker.com/linux/centos/docker-ce.repo

Install docker

    $ sudo yum -y install docker-ce docker-ce-cli containerd.io

    $ systemctl start docker
    $ systemctl enable docker
    $ systemctl status docker
    
    $ usermod -aG docker nanox

### Install Docker Centos

    $ sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    
    $ chmod +x /usr/local/bin/docker-compose
    $ docker-compose -v