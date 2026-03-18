---
layout: post
title: "How to Install AWS Load Balancer Controller using Helm in Amazon EKS Cluster"
date: 2023-12-17 17:00:00 +0000
categories: []
tags: [eks, aws-eks]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/Nr5TYxCuwc8/upload/4382a8ca1f8ad240bdd8d74ca3950d06.jpeg
  alt: "How to Install AWS Load Balancer Controller using Helm in Amazon EKS Cluster"
comments: true
---

# Overview

The AWS Load Balancer Controller is a tool provided by Amazon Web Services (AWS) that enables to manage and configure AWS Load Balancers using Kubernetes.

In Kubernetes, load balancers are used to distribute incoming network traffic across multiple targets, such as pods or instances, to ensure high availability and scalability of applications. AWS provides various types of load balancers, such as Classic Load Balancer, Application Load Balancer (ALB), and Network Load Balancer (NLB), each suited for different use cases.

The AWS Load Balancer Controller simplifies the process of provisioning and managing AWS load balancers within Kubernetes clusters. It integrates with Kubernetes Ingress resources, allowing to define routing rules and expose services to the internet.

The controller translates Kubernetes Ingress objects into AWS load balancer configurations, automatically creating or updating the corresponding load balancers and listeners in AWS.

By using the AWS Load Balancer Controller, we can leverage AWS load balancing features seamlessly within your Kubernetes environment, enabling efficient and reliable traffic distribution for your applications running on AWS infrastructure.

The steps to be taken are as follows:

1. Create IAM policy
    
2. Create IAM role & service account
    
3. Install ALB controller using helm
    
4. Verify ALB deployment and webhook service
    
5. Clean up resources
    

# Prerequisites

* EKS cluster
    

# Steps

### Step 1 - Create IAM policy

* Download iam policy json
    

```bash
curl -o iam_policy_latest.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
ls -lrta
```

* Create an IAM policy using the policy downloaded
    

```bash
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy_latest.json
```

* The output like this below, get the `Arn` section
    

```json
{
    "Policy": {
        "PolicyName": "AWSLoadBalancerControllerIAMPolicy",
        "PolicyId": "ANPAWZ6A3ANHXTU2DNC5G",
        "Arn": "arn:aws:iam::<AWS-Account-ID>:policy/AWSLoadBalancerControllerIAMPolicy",
        "Path": "/",
        "DefaultVersionId": "v1",
        "AttachmentCount": 0,
        "PermissionsBoundaryUsageCount": 0,
        "IsAttachable": true,
        "CreateDate": "2023-12-10T08:21:21+00:00",
        "UpdateDate": "2023-12-10T08:21:21+00:00",
        "Tags": []
    }
}
```

### Step 2 - Create IAM role and Service Account

* Create IAM role & service account with eksctl
    

```bash
eksctl create iamserviceaccount \
  --cluster=aha-eks-demo \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::<AWS-Account-ID>:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve
```

* verify using eksctl
    

```bash
eksctl get iamserviceaccount --cluster aha-eks-demo
```

* verify service account using kubectl
    

```bash
kubectl get sa -n kube-system
kubectl get sa aws-load-balancer-controller -n kube-system
kubectl describe sa aws-load-balancer-controller -n kube-system
```

### Step 3 - Install ALB controller using helm

* install helm: [https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/)
    
* Get image repo: [https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html](https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html)
    
* add eks repository
    

```bash
helm repo add eks https://aws.github.io/eks-charts
```

* update repo
    

```bash
helm repo update
```

* get the VPC ID with aws command
    

```json
aws eks describe-cluster --name aha-eks-demo | grep -I vpc
```

* the output as below
    

```json
 "vpcId": "vpc-073d36b8757xxxx",
```

* install the AWS load balancer controller, get the image url using this [link](https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html).
    

```bash
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=aha-eks-demo \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=us-east-1 \
  --set vpcId=vpc-073d36b875767xxxx \
  --set image.repository=602401143452.dkr.ecr.us-east-1.amazonaws.com/amazon/aws-load-balancer-controller
```

### Step 4 - Verify ALB deployment and webhook service

* verify controller installed
    

```bash
kubectl -n kube-system get deployment 
kubectl -n kube-system get deployment aws-load-balancer-controller
kubectl -n kube-system describe deployment aws-load-balancer-controller
```

* verify AWS load balancer controller webhook service created
    

```bash
kubectl -n kube-system get svc 
kubectl -n kube-system get svc aws-load-balancer-webhook-service
kubectl -n kube-system describe svc aws-load-balancer-webhook-service
```

* verify AWS load balancer controller logs
    

```bash
kubectl get pods -n kube-system

kubectl -n kube-system logs -f <CONTROLLER-POD-NAME>
```

### Step 5 - Create IngressClass

* Create IngressClass Resource,
    

```yaml
$ vi ingressclass.yaml
...
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: aha-aws-ingress-class
  annotations:
    ingressclass.kubernetes.io/is-default-class: "true"
spec:
  controller: ingress.k8s.aws/alb
...
```

```json
kubectl apply -f ingressclass.yaml
```

* Verify IngressClass Resource
    

```json
kubectl get ingressclass
```

* Describe IngressClass Resource
    

```json
kubectl describe ingressclass aha-aws-ingress-class
```

### Step 6 - Clean Up

* delete ingressclass
    

```bash
kubectl delete -f ingressclass.yaml
```

```bash
kubectl get ingressclass
```

* Uninstall the AWS Load Balancer Controller
    

```bash
helm uninstall aws-load-balancer-controller -n kube-system
```

```bash
kubectl get pods -n kube-system
```

* delete service account
    

```bash
eksctl delete iamserviceaccount --namespace=kube-system aws-load-balancer-controller --cluster aha-eks-demo
```

* Delete IAM policy
    

```bash
aws iam delete-policy --policy-arn arn:aws:iam::<AWS-ACCOUNT-ID>:policy/AWSLoadBalancerControllerIAMPolicy
```

## Referensi:

* [https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
    
* [https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html](https://docs.aws.amazon.com/eks/latest/userguide/add-ons-images.html)
    
* [https://docs.aws.amazon.com/eks/latest/userguide/helm.html](https://docs.aws.amazon.com/eks/latest/userguide/helm.html)
