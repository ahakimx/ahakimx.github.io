---
layout: post
title: Amazon Q Developer for Infrastructure Troubleshooting
date: 2026-01-16T17:00:00
categories:
  - aws
  - amazon-q
comments: 'true'
---

# Overview

Amazon Q Developer isn't just for code generation - its infrastructure troubleshooting capabilities are incredibly powerful for DevOps and SRE engineers. This article focuses on using Amazon Q for debugging AWS services, Kubernetes issues, Terraform errors, and incident response.

## **Why Amazon Q for Troubleshooting?**

Traditional troubleshooting requires context switching between multiple tools and documentation. Amazon Q changes this paradigm by providing an AI assistant that natively understands AWS services.

## **AWS Troubleshooting with Amazon Q**

### **EC2 & Networking Issues**

```bash
# Scenario: EC2 instance not accessible via SSH

# Prompt to Amazon Q:
q "My EC2 instance i-0abc123 is not accessible via SSH. 
   Security group allows port 22, instance is running. 
   What should I check?"

# Amazon Q Response:
# Based on your description, here are the troubleshooting steps:
#
# 1. Check Network ACL (often overlooked):
aws ec2 describe-network-acls --filters "Name=vpc-id,Values=vpc-xxx" \
  --query 'NetworkAcls[*].Entries[?RuleNumber<=`100`]'

# 2. Verify route table has internet gateway:
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-xxx" \
  --query 'RouteTables[*].Routes'

# 3. Check if instance has public IP:
aws ec2 describe-instances --instance-ids i-0abc123 \
  --query 'Reservations[*].Instances[*].[PublicIpAddress,PrivateIpAddress]'

# 4. Verify instance status checks:
aws ec2 describe-instance-status --instance-ids i-0abc123

# 5. Check system logs for boot issues:
aws ec2 get-console-output --instance-id i-0abc123
```

### Lambda Troubleshooting

```bash
# Scenario: Lambda function timeout

# Prompt to Amazon Q:
q "My Lambda function 'order-processor' is timing out after 30 seconds.
   It processes SQS messages and writes to DynamoDB.
   CloudWatch shows high duration but low memory usage."

# Amazon Q Response with analysis:
```

```python
# Amazon Q will suggest checking these areas:

# 1. Check for cold start issues
# Prompt: "Show me how to analyze Lambda cold starts"

import boto3
import json
from datetime import datetime, timedelta

def analyze_lambda_performance(function_name, hours=24):
    """
    Analyze Lambda performance metrics to identify bottlenecks.
    Generated with Amazon Q assistance.
    """
    cloudwatch = boto3.client('cloudwatch')
    
    # Get duration metrics
    response = cloudwatch.get_metric_statistics(
        Namespace='AWS/Lambda',
        MetricName='Duration',
        Dimensions=[
            {'Name': 'FunctionName', 'Value': function_name}
        ],
        StartTime=datetime.utcnow() - timedelta(hours=hours),
        EndTime=datetime.utcnow(),
        Period=300,
        Statistics=['Average', 'Maximum', 'p99']
    )
    
    # Check for cold starts (Init Duration)
    init_response = cloudwatch.get_metric_statistics(
        Namespace='AWS/Lambda',
        MetricName='InitDuration',
        Dimensions=[
            {'Name': 'FunctionName', 'Value': function_name}
        ],
        StartTime=datetime.utcnow() - timedelta(hours=hours),
        EndTime=datetime.utcnow(),
        Period=300,
        Statistics=['Average', 'Count']
    )
    
    return {
        'duration_stats': response['Datapoints'],
        'cold_start_stats': init_response['Datapoints']
    }

# 2. Common fixes suggested by Amazon Q:
# - Increase timeout if processing is legitimately slow
# - Use provisioned concurrency to reduce cold starts
# - Check VPC configuration (ENI creation adds latency)
# - Optimize DynamoDB writes (batch operations)
# - Review SQS visibility timeout alignment
```

### RDS Connection Issues

```bash
# Scenario: Application getting "too many connections" error

# Prompt to Amazon Q:
q "RDS PostgreSQL showing 'FATAL: too many connections for role app_user'.
   Current max_connections is 100. We have 5 application pods."

# Amazon Q Response:
# The issue is connection pool exhaustion. Here's the analysis:
#
# Current state:
# - max_connections: 100
# - Application pods: 5
# - If each pod uses default pool size (usually 10-20), you're at limit
#
# Solutions:

# 1. Check current connections:
psql -h your-rds-endpoint -U admin -d postgres -c "
SELECT 
    usename,
    count(*) as connections,
    state
FROM pg_stat_activity 
GROUP BY usename, state 
ORDER BY connections DESC;"

# 2. Identify connection leaks:
psql -c "
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    now() - query_start as duration
FROM pg_stat_activity 
WHERE state != 'idle'
ORDER BY duration DESC
LIMIT 20;"

# 3. Recommended fixes:
# Option A: Use RDS Proxy for connection pooling
# Option B: Reduce pool size per pod (e.g., 10 connections × 5 pods = 50)
# Option C: Scale RDS to larger instance with higher max_connections
```

---

## Kubernetes Debugging

### Pod Troubleshooting

```bash
# Scenario: Pod stuck in CrashLoopBackOff

# Prompt to Amazon Q:
q "My pod 'payment-service-7d8f9' is in CrashLoopBackOff.
   kubectl logs shows 'Error: Cannot connect to Redis'.
   Redis is running in the same namespace."

# Amazon Q will guide through systematic debugging:
```

```bash
# Step 1: Check pod events and status
# Amazon Q suggests:

# Get detailed pod info
kubectl describe pod payment-service-7d8f9 -n production

# Check previous container logs (crashed container)
kubectl logs payment-service-7d8f9 -n production --previous

# Step 2: Verify service discovery
# Amazon Q explains DNS resolution in K8s:

# Test DNS from debug pod
kubectl run debug --rm -it --image=busybox -- nslookup redis-service.production.svc.cluster.local

# Step 3: Check network policies
# Amazon Q suggests checking if NetworkPolicy blocks traffic:

kubectl get networkpolicies -n production -o yaml

# Step 4: Verify Redis service
kubectl get svc redis-service -n production
kubectl get endpoints redis-service -n production
```

```python
# Amazon Q can also generate debugging scripts:

#!/usr/bin/env python3
"""
Kubernetes Pod Debugger - Generated with Amazon Q
Automates common debugging steps for CrashLoopBackOff
"""

import subprocess
import json
import sys

def debug_crashloop_pod(pod_name, namespace="default"):
    """Debug pod stuck in CrashLoopBackOff."""
    
    results = {
        "pod_name": pod_name,
        "namespace": namespace,
        "checks": []
    }
    
    # Check 1: Get pod status
    print(f"🔍 Checking pod status for {pod_name}...")
    pod_json = subprocess.run(
        ["kubectl", "get", "pod", pod_name, "-n", namespace, "-o", "json"],
        capture_output=True, text=True
    )
    
    if pod_json.returncode == 0:
        pod_data = json.loads(pod_json.stdout)
        container_statuses = pod_data.get("status", {}).get("containerStatuses", [])
        
        for container in container_statuses:
            restart_count = container.get("restartCount", 0)
            last_state = container.get("lastState", {})
            
            results["checks"].append({
                "check": "container_status",
                "container": container.get("name"),
                "restart_count": restart_count,
                "last_termination_reason": last_state.get("terminated", {}).get("reason"),
                "exit_code": last_state.get("terminated", {}).get("exitCode")
            })
    
    # Check 2: Get recent logs
    print(f"📋 Fetching recent logs...")
    logs = subprocess.run(
        ["kubectl", "logs", pod_name, "-n", namespace, "--tail=50", "--previous"],
        capture_output=True, text=True
    )
    
    if logs.returncode == 0:
        results["checks"].append({
            "check": "previous_logs",
            "content": logs.stdout[-500:]  # Last 500 chars
        })
    
    # Check 3: Resource constraints
    print(f"💾 Checking resource constraints...")
    describe = subprocess.run(
        ["kubectl", "describe", "pod", pod_name, "-n", namespace],
        capture_output=True, text=True
    )
    
    if "OOMKilled" in describe.stdout:
        results["checks"].append({
            "check": "oom_killed",
            "status": True,
            "recommendation": "Increase memory limits or optimize application memory usage"
        })
    
    return results

if __name__ == "__main__":
    pod = sys.argv[1] if len(sys.argv) > 1 else "my-pod"
    ns = sys.argv[2] if len(sys.argv) > 2 else "default"
    
    result = debug_crashloop_pod(pod, ns)
    print(json.dumps(result, indent=2))
```

### Node Issues

```bash
# Scenario: Node showing NotReady status

# Prompt to Amazon Q:
q "EKS node ip-10-0-1-50 is NotReady. 
   kubectl describe shows 'NodeStatusUnknown'.
   Other nodes in the same AZ are fine."

# Amazon Q Response:
# NodeStatusUnknown typically indicates kubelet communication issues.
# Here's the debugging approach:

# 1. Check node conditions
kubectl describe node ip-10-0-1-50 | grep -A 20 "Conditions:"

# 2. Check kubelet status (if you have SSH access)
# For EKS managed nodes, use SSM:
aws ssm start-session --target i-0abc123

# Once connected:
sudo systemctl status kubelet
sudo journalctl -u kubelet --since "10 minutes ago"

# 3. Check for resource pressure
kubectl describe node ip-10-0-1-50 | grep -E "(MemoryPressure|DiskPressure|PIDPressure)"

# 4. Common causes Amazon Q identifies:
# - Disk full (especially /var/lib/docker or /var/lib/containerd)
# - Memory exhaustion
# - Network connectivity to API server
# - Certificate expiration
# - Instance health check failure

# 5. Quick remediation:
# If disk full:
kubectl get pods --all-namespaces -o wide --field-selector spec.nodeName=ip-10-0-1-50
# Identify and clean up unused images/containers
```

---

## Terraform Error Resolution

### Common Terraform Errors

```bash
# Scenario: Terraform apply fails with dependency error

# Prompt to Amazon Q:
q "Terraform apply fails with:
   'Error: error creating Security Group: InvalidGroup.Duplicate'
   But I'm using create_before_destroy lifecycle."

# Amazon Q Response:
```

```bash
# Amazon Q explains the issue and provides solution:

# Problem: Security Group names must be unique, and create_before_destroy
# creates new resource before destroying old one, causing name conflict.

# Solution 1: Use name_prefix instead of name
resource "aws_security_group" "app" {
  name_prefix = "app-sg-"  # AWS will append unique suffix
  vpc_id      = var.vpc_id
  
  lifecycle {
    create_before_destroy = true
  }
  
  # ... rules
}

# Solution 2: Use random suffix
resource "random_id" "sg_suffix" {
  byte_length = 4
  
  keepers = {
    # Regenerate when VPC changes
    vpc_id = var.vpc_id
  }
}

resource "aws_security_group" "app" {
  name   = "app-sg-${random_id.sg_suffix.hex}"
  vpc_id = var.vpc_id
  
  lifecycle {
    create_before_destroy = true
  }
}
```

### State Issues

```bash
# Scenario: Terraform state lock stuck

# Prompt to Amazon Q:
q "Terraform plan shows 'Error acquiring the state lock' 
   with DynamoDB. Previous apply was interrupted.
   Lock ID: 12345-abcd-6789"

# Amazon Q Response:
# State lock is stuck from interrupted operation. Here's how to resolve:

# 1. First, verify no other operations are running
# Check if any CI/CD pipelines are running terraform

# 2. Force unlock (use with caution!)
terraform force-unlock 12345-abcd-6789

# 3. If that doesn't work, manually remove from DynamoDB:
aws dynamodb delete-item \
  --table-name terraform-state-lock \
  --key '{"LockID": {"S": "your-state-file-path"}}'

# 4. Prevention: Add timeout to your CI/CD
# Example GitHub Actions:
# - name: Terraform Apply
#   run: terraform apply -auto-approve
#   timeout-minutes: 30

# 5. Better approach - use lock timeout:
terraform apply -lock-timeout=5m
```

## Best Practices

### Effective Prompting for Troubleshooting

```bash
# ❌ Bad Prompt (too vague)
q "My service is slow"

# ✅ Good Prompt (specific with context)
q "My payment-service API latency increased from 200ms to 2000ms.
   Environment: EKS prod-app, namespace production
   Current metrics:
   - RDS CPU: 85%
   - Pod memory: 70%
   - Request rate: 500 req/s
   Recent changes: None in last 24 hours
   Error logs show: 'connection pool exhausted'
   What are the likely causes and investigation steps?"
```

### Security Considerations

```bash
# DO NOT share with Amazon Q:
- Actual credentials or secrets
- Customer PII data
- Internal IP addresses (use placeholders)
- Sensitive business logic details

# SAFE to share:
- Error messages (sanitized)
- Configuration structures (without values)
- Architecture descriptions
- Metric patterns
```

## Summary

Amazon Q Developer is a powerful tool for infrastructure troubleshooting that can:

* Empower junior engineers to handle complex issues
    
* Reduce context switching with single-interface troubleshooting
    
* Improve knowledge sharing through prompt templates
