---
layout: post
title: Introduction to the Dockerfile
date: 2019-07-19T05:01:00.000+00:00
categories: docker linux
comments: 'true'
categorie:
- docker
- dockerfile

---
> _Docker can build images automatically by reading the instructions from a `Dockerfile`. A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image. source:_ [_Dockerfile_](https://docs.docker.com/engine/reference/builder/)

create Dockerfile

    vim Dockerfile

The content Dockerfile

    FROM docker/whalesay:latest
    RUN apt -y update && apt install -y fortunes
    CMD /usr/games/fortune -a | cowsay

The `FROM` instruction initializes a new build stage and sets the [_Base Image_](https://docs.docker.com/engine/reference/glossary/#base-image) for subsequent instructions. As such, a valid `Dockerfile` must start with a `FROM` instruction. The image can be any valid image – it is especially easy to start by **pulling an image** from the [_Public Repositories_](https://docs.docker.com/engine/tutorials/dockerrepos/).

RUN has 2 forms:

* `RUN <command>` (_shell_ form, the command is run in a shell, which by default is `/bin/sh -c` on Linux or `cmd /S /C` on Windows)
* `RUN ["executable", "param1", "param2"]` (_exec_ form)

The `RUN` instruction will execute any commands in a new layer on top of the current image and commit the results. The resulting committed image will be used for the next step in the `Dockerfile`.

The `CMD` instruction has three forms:

* `CMD ["executable","param1","param2"]` (_exec_ form, this is the preferred form)
* `CMD ["param1","param2"]` (as _default parameters to ENTRYPOINT_)
* `CMD command param1 param2` (_shell_ form)

There can only be one `CMD` instruction in a `Dockerfile`. If you list more than one `CMD` then only the last `CMD` will take effect.

Build the Dockerfile

    sudo docker build -t docker-whale .

see docker image

    sudo docker image ls

![](/uploads/1_lR14Bb-YLZmsMxNRz0w4nw.png)  
Then run image docker-whale

    sudo docker run docker-whale

![](/uploads/1_Ui8A_FJAgxKTnbqXDOLfug.png)  
Reference : [https://docs.docker.com/engine/reference/builder/](https://docs.docker.com/engine/reference/builder/ "https://docs.docker.com/engine/reference/builder/")