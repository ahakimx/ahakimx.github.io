---
layout: post
title: Default Bridge Network on Docker Networking
date: 2019-07-22T05:01:00.000+00:00
categories: docker network
comments: 'true'

---
> _In terms of networking, a bridge network is a Link Layer device which forwards traffic between network segments. A bridge can be a hardware device or a software device running within a host machine’s kernel._

> _In terms of Docker, a bridge network uses a software bridge which allows containers connected to the same bridge network to communicate, while providing isolation from containers which are not connected to that bridge network. The Docker bridge driver automatically installs rules in the host machine so that containers on different bridge networks cannot communicate directly with each other._

_Bridge networks apply to containers running on the **same** Docker daemon host. For communication among containers running on different Docker daemon hosts, you can either manage routing at the OS level, or you can use an_ [_overlay network_](https://docs.docker.com/network/overlay/)_._

_When you start Docker, a default bridge network (also called `bridge`) is created automatically, and newly-started containers connect to it unless otherwise specified. You can also create user-defined custom bridge networks. **User-defined bridge networks are superior to the default `bridge` network.** source:_ [_https://docs.docker.com/network/bridge/_](https://docs.docker.com/network/bridge/ "https://docs.docker.com/network/bridge/")

**view docker network**

    sudo docker network ls

**run apline container**

    sudo docker run -dit — name alpine1 alpine ashsudo docker run -dit — name alpine2 alpine ash

**view container list**

    sudo docker container ls

**view network bridge details**

    sudo docker network inspect bridge

**Enter to the alpine1 container**

    sudo docker network inspect bridge

see ip address

    # ip add

Test ping to the internet

    # ping -c 3 8.8.8.8

Test to alpine2 container

    # ping -c 3 172.17.0.3

Exit the alpine1 container without close the shell

> _press the ctrl+p, ctrl+q button_

Remove the two containers

    sudo docker container rm -f alpine1 alpine2

reference : [https://docs.docker.com/network/bridge/](https://docs.docker.com/network/bridge/ "https://docs.docker.com/network/bridge/")