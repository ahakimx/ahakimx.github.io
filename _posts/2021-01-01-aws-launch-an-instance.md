---
layout: post
title: "AWS — Launch an Instance"
date: 2021-01-01 21:38:20 +0000
categories: []
tags: []
image:
  path: https://cdn-images-1.medium.com/max/800/1*g98Ebdxrfypi_4uZNTALkQ.png
  alt: "AWS — Launch an Instance"
comments: true
---

### AWS — Launch an Instance
This is a tutorial step by step to launch an instance in AWS

> Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides secure, resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers. Amazon EC2’s simple web service interface allows you to obtain and configure capacity with minimal friction. It provides you with complete control of your computing resources and lets you run on Amazon’s proven computing environment. > [docs](https://aws.amazon.com/ec2/?ec2-whats-new.sort-by=item.additionalFields.postDateTime&ec2-whats-new.sort-order=desc)
1. Login in AWS account and go to the AWS Management Console > select the EC2 service.
![image](https://cdn-images-1.medium.com/max/800/0*vQ5JA5hyLABea7KY)
2. Launch a instance, click on button Launch instance
![image](https://cdn-images-1.medium.com/max/800/0*p6nrS_PkJ1qzcLHS)
3. Choose an Amazon Machine Image (AMI)In this case i’ am choose the one available under the free-tier option. Amazon Linux 2 AMI

![image](https://cdn-images-1.medium.com/max/800/0*rAedX63pBiXnL_-y)
4. Choose an instance typeIn this case iam choose instance type is t2.micro and then click Next: Configure Instance Detail

![image](https://cdn-images-1.medium.com/max/800/0*WyY9KXHJO8gpuA1z)
5. Configure Instance Detail
![image](https://cdn-images-1.medium.com/max/800/0*OiZoT_HOgkgDJh-M)
6. Add Storage
![image](https://cdn-images-1.medium.com/max/800/0*UAGM9sgoFyIispdu)
7. Add TagsTags can as a label, tagging helps in easy search and grouping resources for various purposes.

![image](https://cdn-images-1.medium.com/max/800/0*-Ncs-95sMjP0GROK)
8. Configure Security GroupAttach a set of firewall rules to your instance, then click Review and Launch

![image](https://cdn-images-1.medium.com/max/800/0*E-fHwZvBCGKLWl-u)
9. Review InstanceReview the instance and if ok, Launch the instance

![image](https://cdn-images-1.medium.com/max/800/0*F-Rag_3lJWulKudy)
10. Download Key PairDownload a key pair to connect your instance, choose `create a new key pair`, put `key pair name` then click `Download Key Pair` button > Launch Instance

![image](https://cdn-images-1.medium.com/max/800/0*A5t8Gnsj9AULHRxh)
11. Launch Status
![image](https://cdn-images-1.medium.com/max/800/0*3gS4oGNdKTmPdFCw)
12. View InstanceView instance detail such public IPv4 address, Public IPv4 DNS, security, networking and etc.

![image](https://cdn-images-1.medium.com/max/800/0*S0bex1s9ayNn3iQY)
