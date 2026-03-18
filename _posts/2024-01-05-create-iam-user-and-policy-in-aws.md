---
layout: post
title: "Create IAM User and Policy in AWS"
date: 2024-01-05 10:54:40 +0000
categories: []
tags: [aws, aws-iam, iam-policy]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/odygPOn67bM/upload/119d6e103933d6ace3751e1b91e7fc70.jpeg
  alt: "Create IAM User and Policy in AWS"
comments: true
---

# Overview

An IAM user in AWS (Amazon Web Services) is an entity that represents an individual or application that interacts with AWS services. IAM (Identity and Access Management) users are used to grant specific permissions for accessing AWS resources and services. Here's an overview of how IAM users work:

1. **Creating IAM Users:**
    
    * IAM users are created within an AWS account.
        
    * Users can be created using the AWS Management Console, AWS CLI (Command Line Interface), or AWS SDKs (Software Development Kits).
        
2. **Assigning IAM Policies:**
    
    * Permissions for IAM users are defined using IAM policies. These policies are JSON documents that specify what actions a user is allowed or denied to perform on AWS resources.
        
    * Policies can be attached to IAM users directly or assigned through IAM groups.
        
3. **IAM Groups:**
    
    * IAM users can be organized into groups based on common roles or responsibilities.
        
    * Groups allow you to manage permissions for multiple users collectively. Permissions assigned to a group are inherited by all users in that group.
        
4. **Access Keys:**
    
    * IAM users can be assigned access keys (access key ID and secret access key) for programmatic access to AWS services through the AWS CLI, SDKs, or other tools.
        
    * Access keys are not required for IAM users accessing the AWS Management Console.
        
5. **IAM Roles:**
    
    * IAM roles define a set of permissions for making AWS service requests. Roles are not associated with a specific user or group but are assumed by entities such as IAM users, AWS services, or identity federation.
        
    * IAM roles are often used for cross-account access and temporary permissions.
        
6. **Authentication and Authorization:**
    
    * IAM users can authenticate themselves to AWS using a username and password for console access or using access keys for programmatic access.
        
    * Once authenticated, AWS checks the permissions associated with the user or the roles assumed by the user to determine if the requested action is allowed (authorization).
        
7. **MFA (Multi-Factor Authentication):**
    
    * IAM users can enable MFA to add an extra layer of security. MFA requires users to provide a second form of verification, such as a time-based one-time password (TOTP) from a hardware token or a virtual MFA device.
        

IAM users play a crucial role in managing access to AWS resources securely. By assigning granular permissions through IAM policies, organizations can ensure that users have the appropriate level of access without compromising security.

In this article, we will create an IAM user and then grant permission to the Amazon S3 resource. The steps to be taken are as follows:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704227838439/d5cf3795-9455-4e45-b6c1-4160c3562928.png align="center")

1. Create a user named "aha-staff"
    
2. Create a bucket named "aha-company"
    
3. Create objects named "images" and "web" in the bucket
    
4. Test Amazon S3 access
    
5. Create a policy
    
6. Grant the "aha-staff" user permission to view only the "aha-company/images" object
    
7. Test Amazon S3 access
    
8. Delete the Amazon S3 bucket
    
9. Delete the user
    

# Prerequisites

1. Akun AWS
    

# Steps

### Step 1 - Create a user

* Access the IAM console in your AWS account.
    
* Navigate to the "Users" section and click on "Add user."
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704390811852/33474254-6011-4cc0-ba6f-00447c821c4f.png align="center")

* Click "Next: Permissions."
    
* Click "Next: Review" to confirm the details and then click "Create user."
    
* Securely store the generated access key ID and secret access key, as they'll be needed for authentication.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704391260356/031123ce-cf7d-4179-bb15-fb27e0eb8ed2.png align="center")

### Step 2 - Create a bucket

* Access the S3 console.
    
* Click on "Create bucket."
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704391642679/2bc4dd9b-eab7-4454-9b88-43a5c7bba400.png align="center")

* Enter the bucket name "aha-company" and select the desired region.
    
* Choose appropriate settings for versioning, encryption, and other options as needed.
    
* Click "Create bucket."
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704391686852/d8d41505-c161-4b1e-b517-0b3db68b7343.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704391725828/4af2b836-fb9c-4485-8b00-2c432339255e.png align="center")

**Create folders:**

* Click on "Create folder."
    
* Enter the folder name web, images
    
* Click "Create folder."
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704391802629/3e3ac643-5e02-4b22-860e-a9431576f634.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704391831755/ff0affe1-04c6-40cb-8aa3-710f4cf31ba1.png align="center")

The folder has been created.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704391860966/a3bc106b-505d-4b3c-90ed-17fa937611c7.png align="center")

### Step 3 - Create objects named "images" and "web" in the bucket

* Access the S3 console and navigate to the "aha-company" bucket.
    
* Click on "Upload" and select the files you want to upload, naming them "images" and "web" accordingly.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704392254274/b1831c61-fdaf-4f67-a08c-4e118de06cef.png align="center")

* Click "Upload" to complete the process.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704392306982/5525d1d5-638f-4866-a791-cf8a9d48456b.png align="center")

### Step 4 - Test Amazon S3 access

* Use either the AWS CLI or an S3 client to attempt to list the contents of the "aha-company" bucket using the "aha-staff" user's credentials.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704392514308/5c9eb607-99fe-4f56-bf69-a1e0336349f8.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704392741925/6afbef99-22f1-4bf7-a320-3a883c432951.png align="center")

* Verify that we can't successfully list the objects.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704392843549/3e1f97a5-91ff-4270-8f53-0da43e5f5a4e.png align="center")

### Step 5 - Create a policy

* Access the IAM console and navigate to the "aha-staff" user's permissions.
    
* Click on "Add inline policy."
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704393002273/07bfc7f0-950b-4a0f-9582-b16b0334daf3.png align="center")

* In the JSON editor, add this line
    

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AllowS3",
			"Effect": "Allow",
			"Action": ["s3:*"],
			"Resource": ["*"]
		},
		{
			"Sid": "DenyBucket",
			"Effect": "Deny",
			"Action": ["s3:*"],
			"Resource": ["arn:aws:s3:::aha-company/web/","arn:aws:s3:::aha-company/web/*"]
		}
	]
}
```

* Review and apply the policy.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704393430414/eae1bfad-8066-44be-9875-c61cceb1386f.png align="center")

### Step 6 - Grant the "aha-staff" user permission to view only the "aha-company/images" object

* Access the IAM console and navigate to the "aha-staff" user.
    
* Click on the "Permissions" tab.
    
* Click on "Add permissions."
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704393637775/54bc163b-3b2c-4080-8024-a3facc334c07.png align="center")

* Choose either "Attach existing policies directly" to attach a pre-existing policy
    
* Select the appropriate policy for the user's required permissions.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704393745303/b756380f-b187-4445-8308-08f5ae0b4632.png align="center")

* Click on "Attach policy." and click Next
    
* Click add permissions
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704393768067/44b87102-74fc-4d88-b999-fac206b82a63.png align="center")

### Step 7 - Test Amazon S3 access

* Repeat the access test, but this time verify that the "aha-staff" user can only view the "images" object and not the "web" object.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704393837757/b3d69676-cd52-4919-94be-5925adf345a7.png align="center")

* Open the object
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704394158303/70fcbfcc-c09c-4907-b3ce-ac686931fa07.png align="center")

* The object has successfully access.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704394202669/9f3bfdc0-cc84-4a33-bc2e-43a869aac3d4.png align="center")

* Testing to open the web object
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704394250688/bb423fc7-e509-4d00-94ed-02debf1de688.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704394270968/d6911872-ec7e-40c6-a8e3-2e072d212728.png align="center")

It appears that the user "aha-staff" cannot be granted permission to access objects in the "web" folder.

### Step 8 - Delete the Amazon S3 bucket

* Access the S3 console and navigate to the "aha-company" bucket.
    
* Click on "Empty bucket"
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704394374402/ad6832a1-de51-4cfc-bc4c-2869c9fec5f5.png align="center")

* Click on "Delete bucket."
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704394465058/3a190d5e-c3a0-47a6-b5dc-af4ceb8d0cb6.png align="center")

* Confirm the deletion.
    

### Step 9 - **Delete the user**

* Access the IAM console and navigate to the "aha-staff" user.
    
* Click on "Delete user."
    
* Confirm the deletion.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704394527991/2875591d-f50f-4366-b078-1385df068fd5.png align="center")

* Delete policy to navigate to policies IAM
    
* Click the AllowImagesS3Bucket then click "Delete"
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704394599026/fc57c061-79bd-4805-9a20-72cc2a371314.png align="center")

The user and policy has been deleted.

Thank you.

---

# References

[https://docs.aws.amazon.com/IAM/latest/UserGuide/intro-structure.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/intro-structure.html)

[https://docs.aws.amazon.com/IAM/latest/UserGuide/access\_policies\_create-console.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html)

[https://docs.aws.amazon.com/IAM/latest/UserGuide/when-to-use-iam.html](https://docs.aws.amazon.com/IAM/latest/UserGuide/when-to-use-iam.html)
