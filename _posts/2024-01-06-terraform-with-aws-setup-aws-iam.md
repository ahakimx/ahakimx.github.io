---
layout: post
title: "Terraform with AWS -Setup AWS IAM"
date: 2024-01-06 04:43:09 +0000
categories: []
tags: [terraform, aws-iam]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/B7FN7ZSmXB4/upload/b9ea35e1569386a009cdc2d9527221b8.jpeg
  alt: "Terraform with AWS -Setup AWS IAM"
comments: true
---

# Prerequisites

* AWS account ([free tier](https://aws.amazon.com/free/))
    
* Install [terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
    
* Install [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
    
* Configure AWS on machine as `access_key, secret_key` and `region`
    

# Scopes:

* Create IAM users
    
* Create IAM policies
    
* IAM group
    

## Terraform Intro

> “HashiCorp Terraform is an infrastructure as code tool that lets you define both cloud and on-prem resources in human-readable configuration files that you can version, reuse, and share.” more detail about terraform [here](https://www.terraform.io/intro)

## Let’s create IAM user

%[https://gist.github.com/ahakimx/5a0bc49e1b34813078d542a7bc29b2e4] 

#### Run terraform command

```bash
terraform init
terraform fmt
terraform validate

terraform plan
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704514658424/6f18407e-4fdb-4127-80d4-edfcac4bb0e2.png align="center")

```bash
$ terraform apply
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704514700316/9eed679a-74f8-4b92-bfb2-64b3cee862fd.png align="center")

#### Check IAM list with aws-cli command

```bash
$ aws iam list-users
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704514746233/251265cf-66a5-4633-b7e4-9f4c4a7d07fc.png align="center")

Ok. user has been created with terraform. then we will create iam policies to user was created.

## Create IAM policies with terraform

%[https://gist.github.com/ahakimx/b87e90101547801a3cce5d8033bb88a3] 

create iam policy, then attach policy to user

* create admin-policy.json file
    

%[https://gist.github.com/ahakimx/06c77c12bfb3374912e6c531bd18c5e9] 

above file is policy to user was created

* Run terraform again
    

```bash
$ terraform plan
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704514948808/39f0a069-c57d-4a18-bd8c-11e36f2d061c.png align="center")

```bash
$ terraform apply
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704514984710/0d902672-5d74-4810-9a15-0500f194d45b.png align="center")

#### Check IAM policies

```bash
$ aws iam list-attached-user-policies --user-name ha
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704515015118/356da0ed-855c-4da8-b1cb-57701be0338c.png align="center")

IAM policies has been created. Then we will update user to use password.

#### Add user login profile

use`aws_iam_user_login_profile` resource.

```bash
...
resource "aws_iam_user_login_profile" "userLogin" {
  user = aws_iam_user.admin_user.name
}
```

```bash
output "password" {
  value = aws_iam_user_login_profile.userLogin.password
}
...
```

* run terraform plan and apply again.
    

```bash
$ terraform plan
$ terraform apply --auto-approve
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704515054982/84481d09-56e6-4c6c-8776-34ff233b84ce.png align="center")

We can login to AWS dashboard. Don’t share your password. for safe you can use PGP to encrypt the password.

To destroy IAM user we can use terraform destroy

```bash
$ terraform destroy --auto-approve
```

to make sure user was deleted we can check user with aws-cli command

```bash
$ aws iam list-users
```

#### Full Code for IAM user:

%[https://gist.github.com/ahakimx/55e6f6ca75acd158184bd84723c0a0c6] 

---

## Create IAM with multiple users

How to create multiple users with terraform?

OK let’s we create:

* create variable, [variable.tf](http://variable.tf)
    

%[https://gist.github.com/ahakimx/a9649f0e2a1b273ae3fcc318db07109b] 

The above we make three users with named “ha”, “lucy”,”john”. We will use `for_each` on terraform, more detail about for\_each [here](https://www.terraform.io/language/meta-arguments/for_each).

update [main.tf](https://www.terraform.io/language/meta-arguments/for_each) file as below:

```bash
resource "aws_iam_user" "admin_user" {
  name     = each.value
  for_each = toset(var.admin_users)
  tags = {
    Description = "Tech Lead"
  }
}

resource "aws_iam_user_login_profile" "userLogin" {
  for_each = aws_iam_user.admin_user
  user     = each.value.name
}

resource "aws_iam_policy" "adminUser" {
  name   = "AdminUsers"
  policy = file("admin-policy.json")
}

resource "aws_iam_user_policy_attachment" "admin-access" {
  for_each   = aws_iam_user.admin_user
  user       = each.value.name
  policy_arn = aws_iam_policy.adminUser.arn
}

output "password" {
  value = {
    for k, v in aws_iam_user_login_profile.userLogin : k => v.password
  }
}
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704515302327/3f4f3d15-78bf-48dc-8d88-c03baa6d0fba.png align="center")

check with aws-cli command

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704515334008/b73d9d7b-32c6-470c-a62f-bf712194c356.png align="center")

ok, try to login with dashboard. Don’t share your password. To destroy the resource use this command:

```bash
$ terraform destroy
```

#### Full Code for IAM users:

* main.tf
    

```bash
resource "aws_iam_user" "admin_user" {
  name     = each.value
  for_each = toset(var.admin_users)
  tags = {
    Description = "Tech Lead"
  }
}

resource "aws_iam_user_login_profile" "userLogin" {
  for_each = aws_iam_user.admin_user
  user     = each.value.name
}

resource "aws_iam_policy" "adminUser" {
  name   = "AdminUsers"
  policy = file("admin-policy.json")
}

resource "aws_iam_user_policy_attachment" "admin-access" {
  for_each   = aws_iam_user.admin_user
  user       = each.value.name
  policy_arn = aws_iam_policy.adminUser.arn
}

output "password" {
  value = {
    for k, v in aws_iam_user_login_profile.userLogin : k => v.password
  }
}
```

* admin-policy.json
    

```bash
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

* variable.tf
    

```bash
variable "admin_users" {
  type    = list(string)
  default = ["ha", "lucy", "john"]
}
```

---

#### Setup IAM Grup

* update [main.tf](http://main.tf) file. add `aws_iam_group`and `aws_iam_group_membership`resource. 
    

```bash
resource "aws_iam_group" "tech-lead" {
  name = "Tech-Lead"
}
```

```bash
resource "aws_iam_group_membership" "team" {
  name     = "tech-lead-group-membership"
  for_each = aws_iam_user.admin_user
  users    = [each.value.name]
  group    = aws_iam_group.tech-lead.name
}
```

* terraform plan
    

```bash
$ terraform plan
```

* terraform apply
    

```bash
$ terraform apply --auto-approve
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704515680647/31fedcec-c163-44f3-82d0-2088b9de65a3.png align="center")

* add group policy attachment
    

```bash
resource "aws_iam_group_policy_attachment" "tech_lead_group_policy" {
  group      = aws_iam_group.tech-lead.name
  policy_arn = aws_iam_policy.adminUser.arn
}
```

* terraform plan
    

```bash
$ terraform plan
```

* terraform apply
    

```bash
$ terraform apply --auto--aprove
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704515762878/8668fc90-f57e-4fbe-b2f1-45108614d223.png align="center")

* Check iam user with root account in AWS dashboard.
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1704515901022/31440f23-a12a-4144-a794-79b74292dc22.png align="center")

To destroy resources, run terraform destroy

```bash
$ terraform destroy
```

#### Full Code for IAM group:

%[https://gist.github.com/ahakimx/9fb59ac78358b524129152e8d29acd0b] 

### Repository:

[https://github.com/ahakimx/terraform-aws](https://github.com/ahakimx/terraform-aws)

## References:

[https://developer.hashicorp.com/terraform/language/meta-arguments/for\_each](https://developer.hashicorp.com/terraform/language/meta-arguments/for_each)  
[https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam\_user](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_user)
