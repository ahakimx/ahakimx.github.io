---
layout: post
title: "Integrating Amazon VPC with Amazon S3 Using Gateway Endpoints"
date: 2024-12-31 13:24:32 +0000
categories: []
tags: [aws, vpc-endpoints]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/9i3HoE7zryI/upload/37f26eba90293aa8e903301ace5b05be.jpeg
  alt: "Integrating Amazon VPC with Amazon S3 Using Gateway Endpoints"
comments: true
---

# **What is a VPC Gateway Endpoint?**

A VPC Gateway Endpoint is a feature that allows EC2 instances within VPC to connect privately to specific AWS services, namely S3 and DynamoDB, without traversing the public internet. This means network traffic between VPC and S3 remains within the AWS network, enhancing security and reducing latency. Gateway Endpoints operate at the network routing layer, unlike Interface Endpoints, which use Elastic Network Interfaces (ENIs).

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1735622112544/dbe11188-59ce-49f7-b245-6a9d9a314fa1.png align="center")

# **Key Benefits of Integrating with S3 Using Gateway Endpoints**

* **Enhanced Security:** Traffic not traversing the public internet reduces the risk of data interception, DDoS attacks, and other security threats. This is crucial for applications handling sensitive data.
    
* **Improved Performance:** Because traffic stays within the AWS network, latency is significantly reduced, and throughput is increased. This is essential for applications requiring fast access to data in S3.
    
* **Cost Savings:** Using Gateway Endpoints is *free*. You are not charged for data transfer between VPC and S3 that goes through the Gateway Endpoint. This differs from using NAT Gateways or NAT Instances, which incur data transfer charges.
    
* **Easy Configuration:** Configuring Gateway Endpoints is relatively straightforward, involving adding a route to VPC route table.
    

# Hands-on: Integrating VPC with S3 Using Gateway Endpoints

Here are the steps to integrate VPC with S3 using a Gateway Endpoint:

## Create VPC and Subnet

1. **Open the AWS Console and navigate to the VPC service.**
    
2. **In the navigation pane, choose "Your VPCs".**
    
3. **Click "Create VPC".**
    
4. **On the "Create VPC" page, configure the following:**
    
    * **VPC settings:** Select “VPC only”
        
    * **IPv4 CIDR block**: Select “IPv4 CIDR manual input”
        
    * **IPv4 CIDR**: Enter IPv4, ex: “10.0.0.0/16”
        
    * **IPv6 CIDR block**: Select “No IPv6 CIDR block”
        
    * **Click “Create VPC”**
        
5. **In the navigation pane, choose "Subnets".**
    
6. **Click "Create subnet".**
    
7. **On the "Create subnet" page, configure the following:**
    
    * **VPC ID:** Select VPC you configured in the previous steps.
        
    * **Subnet settings**:
        
        * **IPv4 subnet CIDR block**: Enter subnet name
            
        * **Availability Zone**: Select AZ, ex: us-east-1a
            
        * **IPv4 VPC CIDR block**: select IPv4 CICR block default
            
        * **IPv4 subnet CIDR block**: Enter your IPv4 subnet
            
    * **Click “Create subnet”**
        

## Create S3

1. **Open the AWS Console and navigate to the S3 service.**
    
2. **In the navigation pane, choose "General purpose buckets".**
    
3. **Click "Create bucket".**
    
4. **On the "Create bucket" page, configure the following:**
    
    * **Bucket type:** Select “Bucket type”.
        
    * **Bucket name:** Enter your bucket name.
        
    * **Object Ownership:** Select “ACLs disabled (recommended)”
        
    * **Block public access:** Select “Block all public access”
        
    * **Click “Create bucket”**
        

## Create IAM Role

1. **Open the AWS Console and navigate to the IAM.**
    
2. **In the navigation pane, choose "Roles".**
    
3. **Click "Create role".**
    
4. **On the "Create role" page, configure the following:**
    
    * **Trusted entity type:** Select “AWS service”
        
    * **Use case:** Select “EC2”
        
    * **Click Next**
        
    * **Permissions policies:** Select “AmazonS3FullAccess”. In this case we has full access to S3. to spesific S3 bucket create a custom policy.
        
    * **Role name:** Enter role name
        
    * **Click “Create role”**
        

## Create Gateway Endpoint

1. **Open the AWS Console and navigate to the VPC service.**
    
2. **In the navigation pane, choose "Endpoints".**
    
3. **Click "Create Endpoint".**
    
4. **On the "Create Endpoint" page, configure the following:**
    
    * **Service category:** Select "AWS services".
        
    * **Service name:** Select "s3".
        
    * **Type:** Ensure "Gateway" is selected.
        
    * **VPC:** Choose the VPC you want to integrate with S3.
        
    * **Route tables:** Select the route table(s) that your EC2 instances will use. Ensure this route table is associated with the subnet(s) where your EC2 instances reside.
        
    * **Policy:** choose the *Full Access* policy or create a custom policy to restrict access to specific S3 buckets (highly recommended for security reasons). Example custom policy:
        

```bash
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowAccessToSpecificBucket",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

5. **Click "Create Endpoint".**
    

**Verifying the Configuration:**

After the Gateway Endpoint is created, verify the configuration by doing the following:

1. **Launch an EC2 instance in a subnet associated with the route table you configured in the previous steps.**
    
2. **Connect to the EC2 instance.**
    
3. **Try accessing internet, with ping google.com**. You no has internet connection.
    

```bash
ping google.com
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1735867835904/7efb7989-33ad-4409-a090-fde87a82bbd7.png align="center")

4. **Try accessing S3 bucket using the AWS CLI or SDK.** Example using the AWS CLI:
    

```bash
aws s3 ls s3://your-bucket-name

aws s3 cp s3://your-bucket-name/test.txt test.txt
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1735866127116/415ae24c-9743-4800-a009-71a589058c7f.png align="center")

If the configuration is successful, we will be able to see the contents of S3 bucket without going through the public internet. We can further verify this by checking the routes in route table. There will be a route with the *Destination* `pl-xxxxxxxx` (prefix list for S3) and the *Target* as the newly created Endpoint.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736654602811/a8c4d724-730a-4aab-80db-c7c39da67527.png align="center")

## **Conclusion:**

Integrating VPC with Amazon S3 using Gateway Endpoints is a highly effective way to improve security, performance, and cost efficiency. With a relatively simple configuration, we can ensure that traffic between VPC and S3 remains within the secure and high-performing AWS network. It is highly recommended to leverage this feature in cloud architecture.

## Resource:

[https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html)
