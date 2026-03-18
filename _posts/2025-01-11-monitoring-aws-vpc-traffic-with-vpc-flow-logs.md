---
layout: post
title: "Monitoring AWS VPC Traffic with VPC Flow Logs"
date: 2025-01-11 05:33:10 +0000
categories: []
tags: [aws, vpc, cloudwatch-logs]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/a4uPQcJkAL8/upload/3763aa1ae0b64356d972d3f12a157f72.jpeg
  alt: "Monitoring AWS VPC Traffic with VPC Flow Logs"
comments: true
---

## **What are AWS VPC Flow Logs?**

> VPC Flow Logs are a feature that enables to record metadata about the IP traffic going through network interfaces in VPC.

These logs record information such as source and destination IP addresses, ports, protocols, the number of packets, and bytes transferred. This information can assist with various tasks, from diagnosing connectivity issues to identifying potential security threats. This data is collected out-of-band of your network traffic, so it does not affect network performance.

**Flow logs can create for:**

* **VPC:** Records all traffic going through all network interfaces in the VPC.
    
* **Subnet:** Records traffic going through network interfaces in a specific subnet.
    
* **Network interface:** Records traffic going through a specific network interface (e.g., an EC2 instance interface).
    

**What Does VPC Flow Logs Record?**

Each flow log record contains the following information:

* **version:** The version of the record format.
    
* **account-id:** The AWS account ID.
    
* **interface-id:** The network interface ID.
    
* **source-address:** The source IP address.
    
* **destination-address:** The destination IP address.
    
* **source-port:** The source port.
    
* **destination-port:** The destination port.
    
* **protocol:** The IP protocol (e.g., TCP, UDP, ICMP).
    
* **packets:** The number of packets transferred.
    
* **bytes:** The number of bytes transferred.
    
* **start:** The start time of the data collection interval (in Unix seconds).
    
* **end:** The end time of the data collection interval (in Unix seconds).
    
* **action:** The action taken (ACCEPT or REJECT).
    
* **log-status:** The log status (OK or NODATA).
    

**These logs can then be sent to:**

* **Amazon CloudWatch Logs:** For near real-time analysis and monitoring (although with slight latency). We can use CloudWatch Logs Insights to query and analyze log data.
    
* **Amazon S3:** For long-term storage and batch analysis. This is beneficial for forensic analysis or compliance audits.
    
* **Amazon Kinesis Data Firehose:** For streaming log data to other real-time analytics services.
    

**Real-World Use Cases:**

* **Detecting Port Scanning:** If someone attempts to scan open ports on our instances, Flow Logs will record connection attempts to various ports, which can be an indicator of suspicious activity.
    
* **Verifying Security Rule Effectiveness:** can verify whether Security Group and Network ACL rules are functioning as intended by examining accepted and rejected traffic.
    
* **Analyzing Inter-Instance Communication:** Understand how instances communicate with each other within the VPC, which is useful for troubleshooting multi-tier applications.
    

**Key Considerations:**

* **Cost:** Using Flow Logs incurs costs based on the volume of data processed and stored.
    
* **Performance:** The impact on network performance is generally minimal but should be considered.
    
* **Not Fully Real-Time:** There is slight latency in data collection and delivery.
    

## **Hands-on: Enabling VPC Flow Logs and Analyzing with CloudWatch Logs Insights**

Now that we understand the concept, let's practice enabling them and analyzing the logs using CloudWatch Logs Insights.

**Step 1: Create or Ensure a VPC and EC2 Instance**

Ensure we have a running VPC and at least one EC2 instance within it. If not, create a simple VPC and instance. This will generate traffic for the Flow Logs to capture.

**Step 2: Create an IAM Role for Flow Logs**

Flow Logs need permissions to write logs to CloudWatch Logs, follow these steps:

1. Open the IAM console.
    
2. Select "Roles" and click "Create role".
    
3. Choose "AWS service" as the trusted entity type and select "EC2" as the service that will use this role. Click "Next".
    
4. Search for and select the "**CloudWatchLogsFullAccess**" policy (or a more restrictive policy if we want to grant more limited permissions). Click "Next".
    
5. Give the role a name, e.g., "**vpc-flow-logs-role**", and click "Create role".
    

**Step 3: Create VPC Flow Logs**

1. Open the Amazon VPC console.
    
2. In the navigation pane, choose "**Your VPCs**".
    
3. Select the VPC we want to monitor.
    
4. Choose the "**Flow Logs**" tab.
    
5. Click "**Create flow log**".
    

**Step 4: Configure the Flow Log**

On the "Create flow log" page, configure the following options:

* **Filter:** Choose "All" to record all traffic. We can also select "Accept" or "Reject" to filter for accepted or rejected traffic only.
    
* **Maximum aggregation interval:** Choose the log collection interval. "1 minute" provides better detail but generates more data. For this demo, "1 minute" is sufficient.
    
* **Destination:** Choose "Send to CloudWatch Logs".
    
* **Destination log group:** We can select an existing log group or create a new one. If creating a new one, give it a descriptive name, e.g., "/aws/vpc/flow-logs/\[VPC-ID\]".
    
* **IAM role:** Select the IAM role we created earlier (e.g., "vpc-flow-logs-role").
    

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736570784875/483d4ff5-6b23-4a77-988e-46304e7970a0.png align="center")

* **Click** "Create flow log".
    

**Step 5: Generate Traffic**

To see logs, we need to generate some traffic in VPC. We can ping our EC2 instance from computer, ssh, or access a web server running on the instance (if any).

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736570085473/b3210107-b481-4d3b-ae72-0e45287f4240.png align="center")

**Step 6: Analyze Logs with CloudWatch Logs Insights**

1. Open the CloudWatch console.
    
2. In the navigation pane, choose "Logs" and then "Logs Insights".
    
3. Select the log group we specified when creating the Flow Log (e.g., "/aws/vpc/flow-logs/\[VPC-ID\]").
    

Now we can run queries to analyze the logs. Here are some example queries:

* **Display all logs:**
    

```bash
fields @timestamp, @message
| sort @timestamp desc
| limit 20
```

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736570053186/200d6b08-2f45-48e9-a31b-b8748d29bd8c.png align="center")

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736573162779/3ad86954-f84c-464f-b300-7187fd173e02.png align="center")

* **Display logs for a specific source IP address:**
    

```bash
fields @timestamp, @message
| filter srcAddr = "OUR-IP-ADDRESS"
| sort @timestamp desc
| limit 20
```

Replace `OUR-IP-ADDRESS` with our computer's IP address.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1736573248312/fedde5ab-0eca-4f28-88fd-5bd0995b10cd.png align="center")

* **Display logs for destination port 80 (HTTP):**
    

```bash
fields @timestamp, @message
| filter dstPort = 22
| sort @timestamp desc
| limit 20
```

We'll see logs containing information about the traffic we generated. Note the fields like `srcaddr`, `dstaddr`, `srcport`, `dstport`, `protocol`, `packets`, and `bytes`.

**Cleanup**

To avoid unnecessary costs, we can delete the Flow Log and the CloudWatch log group after finish this hands-on.

**Conclusion:**

VPC Flow Logs are an invaluable tool for monitoring and analyzing network traffic in AWS VPC. By understanding how they work and how to utilize them, we can enhance security, optimize performance, and troubleshoot connectivity issues more effectively.

**Resources:**

* [https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html)
