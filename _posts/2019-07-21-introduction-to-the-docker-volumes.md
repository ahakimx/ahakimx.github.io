---
layout: post
title: Introduction to the Docker Volumes
date: 2019-07-21 06:00:00 +0000
categories: docker volume

---
Volumes are the preferred mechanism for persisting data generated by and used by Docker containers. While [bind mounts](https://docs.docker.com/storage/bind-mounts/) are dependent on the directory structure of the host machine, volumes are completely managed by Docker. Volumes have several advantages over bind mounts:

* Volumes are easier to back up or migrate than bind mounts.
* You can manage volumes using Docker CLI commands or the Docker API.
* Volumes work on both Linux and Windows containers.
* Volumes can be more safely shared among multiple containers.
* Volume drivers let you store volumes on remote hosts or cloud providers, to encrypt the contents of volumes, or to add other functionality.
* New volumes can have their content pre-populated by a container.

In addition, volumes are often a better choice than persisting data in a container’s writable layer, because a volume does not increase the size of the containers using it, and the volume’s contents exist outside the lifecycle of a given container. source: [https://docs.docker.com/storage/volumes/](https://docs.docker.com/storage/volumes/ "https://docs.docker.com/storage/volumes/")

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585142797/myblog/0_EZB6_VkcFdOospgK_xdehwg.png)

Create docker volume:

    sudo docker volume create test-volume

see volumes

    sudo docker volume ls

see volume detail

    sudo docker volume inspect test-volume

run container with volume

    sudo docker run -d — name=nginxtest -v test-volume:/usr/share/nginx/html nginx:latest

see IP address container

    sudo docker inspect nginxtest | grep -i ipaddress

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585143150/myblog/1_roRR4E1hjgxGb3aJHijJHw_cmc29m.png)  
Test browsing app

curl http:172.17.0.3

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585143185/myblog/1_BFWs-wRIer548OP02Qz-EQ_ojcyar.png)  
Create file index.html and move to source volume directory

    sudo echo "This is from test-volume source directory." > index.html
    sudo mv index.html /var/lib/docker/volumes/test-volume/_data

Then test again

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585143231/myblog/1_ADb5o0f8kA0NmCIXHyqKcA_vrrgir.png)  
Run container with read only volume

    sudo docker run -d — name=nginxtest-rovol -v test-volume:/usr/share/nginx/html:ro nginx:latest

view nginx container detail

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585143286/myblog/1_lIznb8Zd4vHDuaOhQW3k4Q_dfrqhv.png)

***

Let’s move on to [part 2 volume driver ](https://ahakimx.github.io/docker/volume/2020/03/21/use-volume-driver-on-docker.html)is here.

reference : [https://docs.docker.com/storage/volumes/](https://docs.docker.com/storage/volumes/ "https://docs.docker.com/storage/volumes/")