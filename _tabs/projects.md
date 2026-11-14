---
layout: page
title: Projects
icon: fas fa-project-diagram
order: 5
---

A collection of hands-on projects I've built and documented. Each project includes architecture decisions, implementation details, and lessons learned.

<!-- Kartu dan daftar di halaman ini ditata oleh assets/css/lab.css (bagian "halaman Projects"). Satu baris = satu proyek. -->

## Featured

<div class="proj-featured">
<a class="proj-card" href="/posts/build-sre-agent-incident-response-chatops-on-eks/"><span class="proj-card__img" style="background-image:url('/uploads/diagram.drawio.png')" aria-hidden="true"></span><span class="proj-card__body"><span class="proj-card__title">Build SRE Agent: Incident Response &amp; ChatOps on EKS</span><span class="proj-card__desc">A Python-based SRE agent with ChatOps commands for incident response, running on Amazon EKS.</span><span class="proj-tags"><i>SRE</i><i>AI agent</i><i>EKS</i><i>ChatOps</i></span></span></a>
<a class="proj-card" href="/posts/building-a-rag-powered-sre-knowledge-base-with-amazon-bedrock/"><span class="proj-card__img" style="background-image:url('/uploads/pasted-image-1776934011325.png')" aria-hidden="true"></span><span class="proj-card__body"><span class="proj-card__title">RAG-Powered SRE Knowledge Base with Amazon Bedrock</span><span class="proj-card__desc">An end-to-end RAG system that lets SRE engineers query their operational knowledge base in natural language through a Slack bot.</span><span class="proj-tags"><i>AWS</i><i>Amazon Bedrock</i><i>RAG</i><i>Slack</i></span></span></a>
<a class="proj-card" href="/posts/building-an-ai-powered-english-interview-prep-app-a-complete-technical-deep-dive/"><span class="proj-card__img" style="background-image:url('/assets/img/posts/building-an-ai-powered-english-interview-prep-app-a-complete-technical-deep-dive/cover.png')" aria-hidden="true"></span><span class="proj-card__body"><span class="proj-card__title">AI-Powered English Interview Prep App on AWS</span><span class="proj-card__desc">A full-stack web app that uses AI to simulate English job interviews.</span><span class="proj-tags"><i>AWS</i><i>AI</i><i>Full-stack</i></span></span></a>
<a class="proj-card" href="/posts/dashboard-as-code-managing-grafana-dashboards-with-terraform/"><span class="proj-card__img" style="background-image:url('/assets/img/posts/dashboard-as-code-managing-grafana-dashboards-with-terraform/cover.png')" aria-hidden="true"></span><span class="proj-card__body"><span class="proj-card__title">Dashboard as Code: Grafana Dashboards with Terraform</span><span class="proj-card__desc">A Dashboard-as-Code system with Terraform and Grafana, from local setup to a CI/CD pipeline for production.</span><span class="proj-tags"><i>Grafana</i><i>Terraform</i><i>Observability</i><i>CI/CD</i></span></span></a>
</div>

## Hands-on labs

<ul class="proj-list">
<li><a class="proj-link" href="/posts/lab-shared-dataset-across-azs-amazon-efs-access-points-posix/">A Shared Dataset Across AZs with Amazon EFS</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">One Regional EFS file system for two teams in two AZs, with four layers of access control. <a class="proj-alt" href="/posts/lab-dataset-bersama-lintas-az-dengan-amazon-efs-access-point-dan-izin-posix/" hreflang="id">versi Indonesia</a></span><span class="proj-tags"><i>AWS</i><i>EFS</i><i>IAM</i></span></li>
<li><a class="proj-link" href="/posts/chaos-engineering-on-amazon-eks-using-aws-fault-injection-service-fis/">Chaos Engineering on Amazon EKS with AWS FIS</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Run Fault Injection Service experiments on an EKS cluster to test application resilience.</span><span class="proj-tags"><i>AWS</i><i>EKS</i><i>Chaos engineering</i></span></li>
<li><a class="proj-link" href="/posts/devops-homelab-1-install-gitlab-server-runner/">DevOps Homelab #1: GitLab Server &amp; Runner</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">GitLab CE and GitLab Runner with Docker Compose, part one of an on-premise CI/CD pipeline.</span><span class="proj-tags"><i>GitLab</i><i>CI/CD</i><i>Docker</i></span></li>
</ul>

## Cloud & AWS

<ul class="proj-list">
<li><a class="proj-link" href="/posts/mengelola-aws-ec2-menggunakan-lambda/">Manage EC2 with Lambda</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Automate EC2 start/stop/protect using AWS Lambda.</span><span class="proj-tags"><i>AWS</i><i>Lambda</i><i>EC2</i></span></li>
<li><a class="proj-link" href="/posts/implementasi-subnet-vpc-multi-tier-di-aws/">VPC Multi-Tier Subnet</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Design and implement multi-tier VPC architecture.</span><span class="proj-tags"><i>AWS</i><i>VPC</i><i>Networking</i></span></li>
<li><a class="proj-link" href="/posts/replikasi-object-s3-menggunakan-cross-region-replication-pada-aws/">S3 Cross-Region Replication</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Set up cross-region replication for disaster recovery.</span><span class="proj-tags"><i>AWS</i><i>S3</i></span></li>
<li><a class="proj-link" href="/posts/service-control-policies-pada-aws-organizations/">AWS Organizations &amp; SCP</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Implement organizational policies with SCPs.</span><span class="proj-tags"><i>AWS</i><i>Organizations</i><i>Security</i></span></li>
<li><a class="proj-link" href="/posts/membuat-iam-identity-center-sso-di-aws/">IAM Identity Center (SSO)</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Configure single sign-on across AWS accounts.</span><span class="proj-tags"><i>AWS</i><i>IAM</i><i>SSO</i></span></li>
<li><a class="proj-link" href="/posts/migrasi-database-kedalam-aws-menggunakan-aws-dms-database-migration-service/">Database Migration with DMS</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Migrate databases using AWS DMS.</span><span class="proj-tags"><i>AWS</i><i>DMS</i><i>Database</i></span></li>
<li><a class="proj-link" href="/posts/integrating-aws-vpc-with-amazon-s3-using-gateway-endpoints/">VPC Gateway Endpoints for S3</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Private connectivity between VPC and S3.</span><span class="proj-tags"><i>AWS</i><i>VPC</i><i>S3</i></span></li>
<li><a class="proj-link" href="/posts/monitoring-aws-vpc-traffic-with-vpc-flow-logs/">VPC Flow Logs Monitoring</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Monitor and analyze VPC network traffic.</span><span class="proj-tags"><i>AWS</i><i>VPC</i><i>Monitoring</i></span></li>
</ul>

## Kubernetes & Containers

<ul class="proj-list">
<li><a class="proj-link" href="/posts/membuat-cluster-eks-dengan-eksctl/">EKS Cluster with eksctl</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Provision production-ready EKS cluster.</span><span class="proj-tags"><i>AWS</i><i>EKS</i><i>Kubernetes</i></span></li>
<li><a class="proj-link" href="/posts/menginstall-amazon-ebs-csi-driver-di-cluster-eks/">EBS CSI Driver on EKS</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Persistent storage for EKS workloads.</span><span class="proj-tags"><i>EKS</i><i>Storage</i><i>CSI</i></span></li>
<li><a class="proj-link" href="/posts/how-to-install-aws-load-balancer-controller-using-helm-in-amazon-eks-cluster/">AWS Load Balancer Controller</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Ingress management with ALB on EKS.</span><span class="proj-tags"><i>EKS</i><i>Helm</i><i>Networking</i></span></li>
<li><a class="proj-link" href="/posts/install-kubernetes-high-availabilty-with-multi-master/">Kubernetes HA Multi-Master</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">High availability Kubernetes cluster setup.</span><span class="proj-tags"><i>Kubernetes</i><i>HA</i></span></li>
<li><a class="proj-link" href="/posts/tls-in-kubernetes-cluster-setup-and-hardening/">TLS in Kubernetes</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Kubernetes cluster security hardening.</span><span class="proj-tags"><i>Kubernetes</i><i>TLS</i><i>Security</i></span></li>
<li><a class="proj-link" href="/posts/default-bridge-network-on-docker-networking/">Docker Networking Deep Dive</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Explore Docker bridge, overlay, and custom networks.</span><span class="proj-tags"><i>Docker</i><i>Networking</i></span></li>
<li><a class="proj-link" href="/posts/introduction-to-the-docker-volumes/">Docker Volumes</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Persistent data management in Docker.</span><span class="proj-tags"><i>Docker</i><i>Storage</i></span></li>
<li><a class="proj-link" href="/posts/introduction-to-docker-compose/">Docker Compose</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Multi-container application orchestration.</span><span class="proj-tags"><i>Docker</i><i>Compose</i></span></li>
</ul>

## CI/CD & Automation

<ul class="proj-list">
<li><a class="proj-link" href="/posts/how-to-run-jenkins-from-docker/">Jenkins from Docker</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Containerized Jenkins setup.</span><span class="proj-tags"><i>Jenkins</i><i>Docker</i><i>CI/CD</i></span></li>
<li><a class="proj-link" href="/posts/introduction-to-jenkins-install-jenkins/">Jenkins Installation Guide</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Complete Jenkins setup and configuration.</span><span class="proj-tags"><i>Jenkins</i><i>CI/CD</i></span></li>
<li><a class="proj-link" href="/posts/terraform-with-aws-setup-aws-iam/">Terraform AWS IAM</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Infrastructure as Code for AWS IAM.</span><span class="proj-tags"><i>Terraform</i><i>AWS</i><i>IaC</i></span></li>
</ul>

## Monitoring & Observability

<ul class="proj-list">
<li><a class="proj-link" href="/posts/monitoring-prometheus-dengan-grafana/">Prometheus + Grafana</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Full monitoring stack setup.</span><span class="proj-tags"><i>Prometheus</i><i>Grafana</i><i>Monitoring</i></span></li>
<li><a class="proj-link" href="/posts/introduction-elk-stack-to-get-logs/">ELK Stack</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Centralized logging with Elasticsearch, Logstash, Kibana.</span><span class="proj-tags"><i>ELK</i><i>Logging</i></span></li>
<li><a class="proj-link" href="/posts/getting-started-with-apache-kafka-your-first-producer-and-consumer/">Apache Kafka</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Event streaming platform setup.</span><span class="proj-tags"><i>Kafka</i><i>Streaming</i></span></li>
<li><a class="proj-link" href="/posts/install-kafka-cluster-and-zookeeper-with-high-availability/">Kafka HA Cluster</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">High availability Kafka with Zookeeper.</span><span class="proj-tags"><i>Kafka</i><i>HA</i></span></li>
</ul>

## Networking & Other

<ul class="proj-list">
<li><a class="proj-link" href="/posts/cara-setup-ipsec-strongswan-di-ubuntu-2004/">IPSec StrongSwan VPN</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Site-to-site VPN setup on Ubuntu.</span><span class="proj-tags"><i>VPN</i><i>IPSec</i><i>Networking</i></span></li>
<li><a class="proj-link" href="/posts/deploy-openstack-all-in-one-with-kolla-ansible/">OpenStack with Kolla-Ansible</a><span class="proj-lang" title="English">EN</span><span class="proj-desc">Deploy private cloud with OpenStack.</span><span class="proj-tags"><i>OpenStack</i><i>Ansible</i></span></li>
<li><a class="proj-link" href="/posts/deploy-aplikasi-php-sederhana-ke-heroku/">Deploy PHP to Heroku</a><span class="proj-lang" title="Bahasa Indonesia">ID</span><span class="proj-desc">Simple app deployment to PaaS.</span><span class="proj-tags"><i>Heroku</i><i>PHP</i></span></li>
</ul>

---

> This page is regularly updated as I complete new projects. Check back often or subscribe via RSS.
{: .prompt-info }
