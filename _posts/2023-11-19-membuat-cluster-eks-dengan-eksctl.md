---
layout: post
title: "Membuat Cluster EKS dengan eksctl"
date: 2023-11-19 02:29:35 +0000
categories: []
tags: [aws, kubernetes, aws-eks]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/9cXMJHaViTM/upload/3df4e7cf901a6362779971b38e2ddbd1.jpeg
  alt: "Membuat Cluster EKS dengan eksctl"
comments: true
---

# Overview

Amazon EKS (Elastic Kubernetes Service) merupakan *managed service* yang ada pada AWS yang mana pengguna tidak perlu menginstall, mengoperasikan dan melakukan *maintenance* pada komponen-komponen kubernetes. Adapun informasi detail mengenai aws eks bisa dilihat [disini](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html).

Pada tulisan kali ini kita akan membuat cluster di eks. Adapun langkah-langkah yang akan dilakukan adalah sebagai berikut:

1. Membuat keypair
    
2. Membuat eks cluster
    
3. Membuat eks managed group & IAM OIDC provider
    
4. Membuat Node Group dengan Private Subnets
    
5. Verifikasi eks cluster
    
6. Hapus Cluster
    

# Prasyarat

1. Install [aws cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
    
2. Install [kubectl](https://docs.aws.amazon.com/eks/latest/userguide/install-kubectl.html)
    
3. Install [eksctl](https://eksctl.io/introduction/#installation)
    

# Langkah-langkah

### Buat keypair

Buat keypair pada menu EC2 &gt; key pairs &gt; create key pair

isi name, type & format &gt; create key pair

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1700360102380/4416f821-cb14-404b-8c37-21753813d2fd.png align="center")

### **Membuat eks cluster**

* membuat cluster tanpa nodegroup
    

```bash
eksctl create cluster --name=aha-eks-demo \
                          --region=us-east-1 \
                          --zones=us-east-1a,us-east-1b \
                          --without-nodegroup
```

* melihat cluster
    

```bash
eksctl get cluster
```

### Membuat eks managed group & IAM OIDC provider

```bash
eksctl utils associate-iam-oidc-provider \
        --region us-east-1 \
        --cluster aha-eks-demo \
        --approve
```

### Membuat Node Group dengan Private Subnets

```bash
eksctl create nodegroup --cluster=aha-eks-demo \
                    --region=us-east-1 \
                    --name=aha-eks-nodegroup \
                    --node-type=t3.medium \
                    --nodes=2 \
                    --nodes-min=2 \
                    --nodes-max=4 \
                    --node-volume-size=20 \
                    --ssh-access \
                    --ssh-public-key=aha-eks-keypair \
                    --managed \
                    --asg-access \
                    --external-dns-access \
                    --full-ecr-access \
                    --appmesh-access \
                    --alb-ingress-access \
                    --node-private-networking
```

### Verifikasi eks cluster

* list cluster
    

```bash
eksctl get cluster
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1713764325388/9b3c1c76-2706-4505-b3f1-0e0b8c02083e.png align="center")

* list nodegroup
    

```bash
eksctl get nodegroup --cluster=aha-eks-demo
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1713764219002/f3164f75-95ce-44ab-908d-b7e172ade584.png align="center")

* list nodes
    

```bash
kubectl get nodes
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1713764488831/0a35bfd8-71e3-4a1e-9465-db31f00fb73c.png align="center")

###   
Hapus Cluster

Untuk menghindari biaya dari pemakain yang sudah tidak digunakan lagi, maka kita perlu untuk menghapus resource EKS, seperti berikut:

* Hapus node group
    

```bash
eksctl get nodegroup --cluster=aha-eks-demo
```

```bash
eksctl delete nodegroup --cluster=aha-eks-demo --name=aha-eks-nodegroup
```

* Hapus Cluster
    

```bash
eksctl get cluster
```

```bash
eksctl delete cluster aha-eks-demo
```

# Referensi:

[https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html)
