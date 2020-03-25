---
layout: post
title: Overlay Network without Swarm mode
date: 2019-07-22 05:02:00 +0000
categories: docker networking

---
> _The `overlay` network driver creates a distributed network among multiple Docker daemon hosts. This network sits on top of (overlays) the host-specific networks, allowing containers connected to it (including swarm service containers) to communicate securely. Docker transparently handles routing of each packet to and from the correct Docker daemon host and the correct destination container. see detail_ [_https://docs.docker.com/network/overlay/_](https://docs.docker.com/network/overlay/ "https://docs.docker.com/network/overlay/")

This way of using overlay networks is not recommended for most Docker users. It can be used with standalone swarms and may be useful to system developers building solutions on top of Docker. It may be deprecated in the future. source: [https://docs.docker.com/v17.09/engine/userguide/networking/#an-overlay-network-without-swarm-mode](https://docs.docker.com/network/overlay/ "https://docs.docker.com/network/overlay/")

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585144873/myblog/1_qb-KM7dRM7ZqmuJj0ZI5NA_ms5vdn.png)  
**On pod67-node0 run key-value store consul**

    sudo docker run -d -p 8500:8500 -h consul --name consul progrium/consul -server -bootstrap

**On pod67-node1 and pod67-node2 disable docker service and run docker from CLI**

    sudo systemctl stop docker
    sudo systemctl status docker
    sudo dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock --cluster-advertise ens3:2375 --cluster-store consul://10.1.67.100:8500 &

**On pod67-node1 create overlay network**

    sudo docker network create -d overlay --subnet=192.168.67.0/24 my-overlay

**View networks**

    sudo docker network ls

**on pod67-node1 create container alpine1 connect to my-overlay network**

    sudo docker run -dit --name alpine1 --network my-overlay alpine ash

**On pod67-node2 create container alpine2 connect to my-overlay network**

    sudo docker run -dit --name alpine2 --network my-overlay alpine ash

**On pod67-node2, view my-overlay network details**

    sudo docker network inspect my-overlay

**On pod67-node2 enter the alpine2 container and ping to the IP address alpine1 container**

    sudo docker attach alpine2
    ping -c 3 192.168.67.2
    ping -c 3 alpine1

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585144926/myblog/1_lmsfUsujZTpTI-fhDcPjsg_msa0sg.png)

***

Reference :

[https://docs.docker.com/v17.09/engine/userguide/networking/#an-overlay-network-without-swarm-mode](https://docs.docker.com/v17.09/engine/userguide/networking/#an-overlay-network-without-swarm-mode "https://docs.docker.com/v17.09/engine/userguide/networking/#an-overlay-network-without-swarm-mode")

[https://docs.docker.com/network/bridge/](https://docs.docker.com/v17.09/engine/userguide/networking/#an-overlay-network-without-swarm-mode "https://docs.docker.com/v17.09/engine/userguide/networking/#an-overlay-network-without-swarm-mode")