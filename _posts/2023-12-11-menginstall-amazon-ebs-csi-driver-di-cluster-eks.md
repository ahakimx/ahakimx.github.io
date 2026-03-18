---
layout: post
title: "Menginstall Amazon EBS CSI Driver di Cluster EKS"
date: 2023-12-11 04:41:13 +0000
categories: []
tags: [aws]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/j-0olYcaihg/upload/12075fa1466b0b028999ddd2b0715901.jpeg
  alt: "Menginstall Amazon EBS CSI Driver di Cluster EKS"
comments: true
---

# Ikhtisar

Amazon EBS CSI *driver* digunakan untuk mengelola *lifecycle* pada EBS volume sebagai penyimpanan pada kubernetes. Driver ini memungkinkan kita untuk menggunakan volume EBS dalam aplikasi Kubernetes tanpa perlu melakukan perubahan apa pun pada kode aplikasi.

Driver ini terdiri dari dua komponen utama:

* **Controller:** Komponen ini bertanggung jawab untuk membuat, menghapus, dan memodifikasi volume EBS.
    
* **Node:** Komponen ini bertanggung jawab untuk memasang dan melepaskan volume EBS ke node Kubernetes.
    

Adapun langkah-langkah yang akan dilakukan pada tulisan ini adalah sebagai berikut:

1. Membuat IAM policy
    
2. Attach policy
    
3. Deploy amazon EBS CSI driver
    
4. Hapus Resource
    

# Prasyarat

* Cluster EKS, jika belum membuat cluster bisa lihat [**disini**](https://ahakimx.com/membuat-cluster-eks-dengan-eksctl)
    

# Langkah-langkah

### Step 01 - Membuat IAM policy

* Ke Services -&gt; IAM
    
* Klik Create a Policy
    
* Pilih tab JSON dan copy json dibawah ini
    

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AttachVolume",
        "ec2:CreateSnapshot",
        "ec2:CreateTags",
        "ec2:CreateVolume",
        "ec2:DeleteSnapshot",
        "ec2:DeleteTags",
        "ec2:DeleteVolume",
        "ec2:DescribeInstances",
        "ec2:DescribeSnapshots",
        "ec2:DescribeTags",
        "ec2:DescribeVolumes",
        "ec2:DetachVolume"
      ],
      "Resource": "*"
    }
  ]
}
```

* Klik Next
    
* **Policy Name:** Amazon\_EBS\_CSI\_Driver
    
* **Description:** Policy for EC2 Instances to access Elastic Block Store for EKS
    
* Klick **Create Policy**
    

### Step 02 - Attach Policy

* Catat IAM role
    

```bash
kubectl -n kube-system describe configmap aws-auth
```

Berikut contoh outputnya :

```bash
rolearn: arn:aws:iam::180789647333:role/eksctl-eksdemo1-nodegroup-eksdemo-NodeInstanceRole-IJXXXXX
```

* Masuk ke menu Services -&gt; IAM -&gt; Roles
    
* Cari nama role **eksctl-eksdemo1-nodegroup-eksdemo-NodeInstanceRole-IJXXXXX**
    
* Klik pada tab **Permissions**
    
* Klik **Attach Policies**
    
* Cari **Amazon\_EBS\_CSI\_Driver** dan klik **Attach Policy**
    

### Step 3 - Deploy amazon EBS CSI Driver

* Verifikasi versi kubectl
    

```bash
kubectl version --client --short
```

* Deploy Amazon EBS CSI Driver
    

```bash
kubectl apply -k "github.com/kubernetes-sigs/aws-ebs-csi-driver/deploy/kubernetes/overlays/stable/?ref=master"
```

* Verifikasi ebs-csi pods sudah running
    

```bash
kubectl get pods -n kube-system
```

Berikut contoh outputnya:

```bash
NAME                                  READY   STATUS    RESTARTS   AGE
aws-node-5rbxn                        1/1     Running   0          34m
aws-node-kgcst                        1/1     Running   0          34m
coredns-7975d6fb9b-4bq22              1/1     Running   0          46m
coredns-7975d6fb9b-v2542              1/1     Running   0          46m
ebs-csi-controller-7bb8f9f7bc-mlpnn   6/6     Running   0          23s
ebs-csi-controller-7bb8f9f7bc-vwcsw   6/6     Running   0          23s
ebs-csi-node-dtjt8                    3/3     Running   0          19s
ebs-csi-node-swmxt                    3/3     Running   0          19s
kube-proxy-226z7                      1/1     Running   0          34m
kube-proxy-zl8p2                      1/1     Running   0          34m
```

### Referensi:

* [https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html](https://docs.aws.amazon.com/eks/latest/userguide/ebs-csi.html)
    
* [https://github.com/kubernetes-sigs/aws-ebs-csi-driver](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)
