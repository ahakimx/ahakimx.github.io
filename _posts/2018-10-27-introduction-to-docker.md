---
categories:
- docker
layout: post
title: Introduction to Docker
date: 2018-10-27 05:01:00 +0000
comments: 'true'

---
What is Docker ?

Docker is a platform for developers and sysadmins to **develop, deploy, and run** applications with containers. The use of Linux containers to deploy applications is called _containerization_. Containers are not new, but their use for easily deploying applications is.

  
Images and Containers

A container is launched by running an image. An **image** is an executable package that includes everything needed to run an application--the code, a runtime, libraries, environment variables, and configuration files.

A **container** is a runtime instance of an image--what the image becomes in memory when executed (that is, an image with state, or a user process). You can see a list of your running containers with the command, `docker ps`, just as you would in Linux.

Containers and Virtual Machines

A **container** runs _natively_ on Linux and shares the kernel of the host machine with other containers. It runs a discrete process, taking no more memory than any other executable, making it lightweight.

By contrast, a **virtual machine** (VM) runs a full-blown “guest” operating system with _virtual_ access to host resources through a hypervisor. In general, VMs provide an environment with more resources than most applications need.

![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585200064/myblog/Container_2x_zomoat.png)![](https://res.cloudinary.com/dhcy32o8d/image/upload/v1585200078/myblog/images_1_ruzqdg.png)  
Benefit of Docker:

1. **Reproducibility**: Similar to a Java application, which will run exactly the same on any device capable of running a Java Virtual Machine, a Docker container is guaranteed to be identical on any system that can run Docker. The exact specifications of a container are stored in a Dockerfile. By distributing this file among team members, an organization can guarantee that all images built from the same Dockerfile will function identically. In addition, having an environment that is constant and well-documented makes it easier to keep track of your application and identify problems.
2. **Isolation**: Dependencies or settings within a container will not affect any installations or configurations on your computer, or on any other containers that may be running. By using separate containers for each component of an application (for example a web server, front end, and database for hosting a web site), you can avoid conflicting dependencies. You can also have multiple projects on a single server without worrying about creating conflicts on your system.
3. **Security**: With important caveats (discussed below), separating the different components of a large application into different containers can have security benefits: if one container is compromised the others remain unaffected.
4. **Docker Hub:** For common or simple use cases, such as a LAMP stack, the ability to save images and push them to Docker Hub means that there are already many well-maintained images available. Being able to quickly pull a premade image or build from an officially-maintained Dockerfile can make this kind of setup process extremely fast and simple.
5. **Environment Management**: Docker makes it easy to maintain different versions of, for example, a website using nginx. You can have a separate container for testing, development, and production on the same Linode and easily deploy to each one.
6. **Continuous Integration**: Docker works well as part of continuous integration pipelines with tools like Travis, Jenkins, and Wercker. Every time your source code is updated, these tools can save the new version as a Docker image, tag it with a version number and push to Docker Hub, then deploy it to production.

Source:

[https://www.docker.com](https://www.docker.com "https://www.docker.com")

[https://www.linode.com/docs/applications/containers/when-and-why-to-use-docker/](https://www.docker.com "https://www.docker.com")

***