---
layout: post
title: "Getting Started with Apache Kafka: Your First Producer and Consumer"
date: 2025-07-12 15:12:07 +0000
categories: []
tags: [kafka]
image:
  path: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/srgUf2-Qcms/upload/196e6c342e066927de23a66736f2ee9a.jpeg
  alt: "Getting Started with Apache Kafka: Your First Producer and Consumer"
comments: true
---

# What is Apache Kafka?

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1752332879624/9f3ef911-07ef-4f24-bd3b-48e731798895.png align="center")

> Apache Kafka is an open-source distributed event streaming platform used by thousands of companies for high-performance data pipelines, streaming analytics, data integration, and mission-critical applications. [https://kafka.apache.org/](https://kafka.apache.org/)

# **Core Purpose**

Kafka acts as a distributed message broker that can publish, subscribe to, store, and process streams of records in real-time. It's designed to handle massive amounts of data with low latency and high availability.

# **Key Components**

* **Producers**: Applications that publish data to Kafka topics
    
* **Consumers**: Applications that read data from Kafka topics
    
* **Topics**: Categories or feeds where records are published
    
* **Partitions**: Topics are divided into partitions for scalability and parallelism
    
* **Brokers**: Kafka servers that store and serve data
    
* **Zookeeper/KRaft**: Coordination service for managing cluster metadata
    

# Understanding Kafka Producers

A **Kafka Producer** is a client application that publishes (writes) records to Kafka topics. Here's how it works:

* Producers send data to topics without needing to know which consumers will read it
    
* They can choose which partition to send data to (or let Kafka decide)
    
* Producers can send data synchronously or asynchronously
    
* They handle serialization of keys and values before sending
    

# Key Producer Configurations:

* `bootstrap.servers`: List of Kafka brokers to connect to
    
* `key.serializer`: How to serialize the message key
    
* `value.serializer`: How to serialize the message value
    
* `acks`: Number of acknowledgments the producer requires
    
* `batch.size`: Size of batches for sending messages
    

# **Hands-on: Create a kafka producer**

## Requirements

* docker
    
* docker-compose
    

## Why Use Docker?

We're using Docker to simplify the setup process. Instead of installing Kafka and Zookeeper locally, Docker containers provide a clean, isolated environment that's easy to manage and reproduce.

## **Step 1: Create docker compose**

Create a file named `docker-compose.yml`:

```yaml
version: '2.1'

services:
  zookeeper1:
    image: confluentinc/cp-zookeeper:7.3.2
    hostname: zookeeper1
    container_name: zookeeper1
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_SERVER_ID: 1
      ZOOKEEPER_SERVERS: zookeeper1:2888:3888


  kafka1:
    image: confluentinc/cp-kafka:7.3.2
    hostname: kafka1
    container_name: kafka1
    ports:
      - "9092:9092"
      - "29092:29092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka1:19092,EXTERNAL://${DOCKER_HOST_IP:-127.0.0.1}:9092,DOCKER://host.docker.internal:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL:PLAINTEXT,DOCKER:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_ZOOKEEPER_CONNECT: "zookeeper1:2181"
      KAFKA_BROKER_ID: 1
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper1
```

## **Step 2: Run docker compose**

```bash
docker compose up
```

**Expected Output:**

```bash
Creating network "kafka_default" with the default driver
Creating zookeeper1 ... done
Creating kafka1     ... done
```

Wait for about 30 seconds to ensure all services are fully started.

## Step 3: Create a kafka topic

```bash
docker exec -it kafka1 kafka-topics --bootstrap-server kafka1:19092 \
             --create \
             --topic test-topic \
             --replication-factor 1 \
             --partitions 1
```

**Expected Output:**

```bash
Created topic test-topic.
```

**Parameter Explanation:**

* `--bootstrap-server`: Kafka broker address
    
* `--create`: Command to create a new topic
    
* `--topic`: Name of the topic
    
* `--replication-factor`: Number of replicas (1 for single broker)
    
* `--partitions`: Number of partitions for the topic
    

## Step 4: Produce message to a topic

Open a new terminal and start the producer:

```bash
docker exec -it kafka1 kafka-console-producer --bootstrap-server kafka1:19092 \
                       --topic test-topic
```

Expected Output:

```bash
>
```

Now you can type messages. Each line you type will be sent as a message to the topic:

```bash
>Hello Kafka!
>This is my first message
>Testing Kafka producer
```

## Step 5: Consume message from a topic

Open another terminal and start the consumer:

```bash
docker exec -it kafka1 kafka-console-consumer --bootstrap-server kafka1:19092 \
                       --topic test-topic \
                       --from-beginning
```

**Expected Output:**

```bash
Hello Kafka!
This is my first message
Testing Kafka producer
```

**Parameter Explanation:**

* `--from-beginning`: Read all messages from the beginning of the topic
    
* Without this flag, consumer only reads new messages
    

**To exit the consumer:** Press `Ctrl+C`

## Testing Your Setup

1. Keep the consumer running in one terminal
    
2. Start the producer in another terminal
    
3. Type messages in the producer terminal
    
4. Watch them appear in real-time in the consumer terminal
    

## Cleanup

To stop and remove all containers:

```bash
docker-compose down
```

To remove volumes as well:

```bash
docker-compose down -v
```

# Conclusion

You've successfully set up a Kafka environment and created your first producer and consumer! This foundation gives you the basics of how Kafka works and how applications can communicate through event streaming.

Kafka's power lies in its ability to handle high-throughput, fault-tolerant, and scalable event streaming - making it perfect for modern distributed systems and real-time applications.

# **Resources**

* [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)
    
* [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
    
* [https://kafka-tutorials.confluent.io/](https://kafka-tutorials.confluent.io/)
