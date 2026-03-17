---
layout: post
title: TLS in Kubernetes - Cluster Setup and Hardening
date: 2026-02-02T03:33:00
description: TLS (Transport Layer Security) is the foundation of secure communication in Kubernetes. Think of TLS like a secret letter system in an ancient kingdom
categories:
  - kubernetes
tags:
  - kubernetes
image:
  path: https://picsum.photos/id/208/1920/1280.webp
  alt: Photo by Lorem Picsum
  lqip: ''
pin: false
toc: true
comments: true
math: false
mermaid: true
media_subpath: ''
render_with_liquid: true
---

## Introduction

TLS (Transport Layer Security) is the foundation of secure communication in Kubernetes. Think of TLS like a **secret letter system in an ancient kingdom** - every message is encrypted with a special code that only the legitimate recipient can read. Without TLS, all communication in a Kubernetes cluster is like speaking loudly in a public place - anyone can listen!

In the kubernetes security context, deep understanding of TLS is crucial because:

* All Kubernetes components communicate using TLS
    
* TLS misconfiguration is a commonly exploited security gap
    

Imagine a Kubernetes cluster as a **large office building** with many departments:

**TLS components are like the building's security system:**

1. **Certificate Authority (CA)** = Central Security Office
    
    * Issues ID cards (certificates) for all employees
        
    * Verifies identity before granting access
        
    * Maintains list of valid and revoked cards
        
2. **Server Certificate** = Room ID Card
    
    * Proves that the room (server) is authentic
        
    * Contains information: room name, manager, validity period
        
3. **Client Certificate** = Employee ID Card
    
    * Proves the employee's (client's) identity
        
    * Required to enter certain rooms
        
4. **Private Key** = Personal Key
    
    * Like an ATM PIN - only the owner should know
        
    * Used to prove certificate ownership
        

## TLS Components and Configuration

### 1\. API Server TLS Configuration

API Server is the most critical component as it's the main entry point to the cluster. Here are the important TLS flags:

```yaml
# /etc/kubernetes/manifests/kube-apiserver.yaml
apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - name: kube-apiserver
    command:
    - kube-apiserver
    
    # === TLS Server Configuration ===
    - --tls-cert-file=/etc/kubernetes/pki/apiserver.crt
    - --tls-private-key-file=/etc/kubernetes/pki/apiserver.key
    
    # Minimum TLS version (security best practice)
    - --tls-min-version=VersionTLS12
    
    # Cipher suites (restrict to secure ones)
    - --tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    
    # === Client Certificate Authentication ===
    - --client-ca-file=/etc/kubernetes/pki/ca.crt
    
    # === Kubelet Communication ===
    - --kubelet-client-certificate=/etc/kubernetes/pki/apiserver-kubelet-client.crt
    - --kubelet-client-key=/etc/kubernetes/pki/apiserver-kubelet-client.key
    
    # === etcd Communication ===
    - --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt
    - --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
    
    # === Service Account ===
    - --service-account-key-file=/etc/kubernetes/pki/sa.pub
    
    # === Front Proxy (Aggregation Layer) ===
    - --requestheader-client-ca-file=/etc/kubernetes/pki/front-proxy-ca.crt
    - --proxy-client-cert-file=/etc/kubernetes/pki/front-proxy-client.crt
    - --proxy-client-key-file=/etc/kubernetes/pki/front-proxy-client.key
```

### 2\. etcd TLS Configuration

etcd stores all cluster data, so its TLS security is critical:

```yaml
# /etc/kubernetes/manifests/etcd.yaml
apiVersion: v1
kind: Pod
metadata:
  name: etcd
  namespace: kube-system
spec:
  containers:
  - name: etcd
    command:
    - etcd
    
    # === Server TLS (for client connections) ===
    - --cert-file=/etc/kubernetes/pki/etcd/server.crt
    - --key-file=/etc/kubernetes/pki/etcd/server.key
    - --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --client-cert-auth=true
    
    # === Peer TLS (for etcd cluster communication) ===
    - --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt
    - --peer-key-file=/etc/kubernetes/pki/etcd/peer.key
    - --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --peer-client-cert-auth=true
    
    # === Disable auto TLS (security requirement) ===
    - --auto-tls=false
    - --peer-auto-tls=false
```

### 3\. Kubelet TLS Configuration

Kubelet runs on every node and needs proper TLS configuration:

```yaml
# /var/lib/kubelet/config.yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

# === Server TLS ===
tlsCertFile: /var/lib/kubelet/pki/kubelet.crt
tlsPrivateKeyFile: /var/lib/kubelet/pki/kubelet.key

# === Certificate Rotation ===
rotateCertificates: true
serverTLSBootstrap: true

# === Authentication ===
authentication:
  x509:
    clientCAFile: /etc/kubernetes/pki/ca.crt
  webhook:
    enabled: true
  anonymous:
    enabled: false

# === Authorization ===
authorization:
  mode: Webhook
```

---

## **Certificate Management**

### Creating Certificates with OpenSSL

Here are the steps to create certificates manually:

```bash
# === Step 1: Generate Private Key ===
openssl genrsa -out server.key 2048

# === Step 2: Create Certificate Signing Request (CSR) ===
openssl req -new -key server.key -out server.csr \
  -subj "/CN=my-server/O=my-organization"

# === Step 3: Sign Certificate with CA ===
openssl x509 -req -in server.csr \
  -CA /etc/kubernetes/pki/ca.crt \
  -CAkey /etc/kubernetes/pki/ca.key \
  -CAcreateserial \
  -out server.crt \
  -days 365 \
  -extensions v3_req \
  -extfile <(cat <<EOF
[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = my-server
DNS.2 = my-server.default.svc
IP.1 = 10.96.0.1
EOF
)
```

### Using Kubernetes CSR API

Kubernetes provides an API for managing Certificate Signing Requests:

```bash
# === Step 1: Generate Key and CSR ===
openssl genrsa -out user.key 2048
openssl req -new -key user.key -out user.csr -subj "/CN=new-user/O=developers"

# === Step 2: Encode CSR to Base64 ===
CSR_BASE64=$(cat user.csr | base64 | tr -d '\n')

# === Step 3: Create CSR Object ===
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: new-user-csr
spec:
  request: ${CSR_BASE64}
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 86400  # 1 day
  usages:
  - client auth
EOF

# === Step 4: Approve CSR ===
kubectl certificate approve new-user-csr

# === Step 5: Get Signed Certificate ===
kubectl get csr new-user-csr -o jsonpath='{.status.certificate}' | base64 -d > user.crt
```

---

## Certificate Rotation

Certificates have expiration dates and need to be rotated periodically. Kubernetes provides automatic mechanisms for this:

### Automatic Certificate Rotation

```bash
# === Check Certificate Expiration ===
kubeadm certs check-expiration

# Output example:
# CERTIFICATE                EXPIRES                  RESIDUAL TIME
# admin.conf                 Jan 15, 2026 10:00 UTC   364d
# apiserver                  Jan 15, 2026 10:00 UTC   364d
# apiserver-etcd-client      Jan 15, 2026 10:00 UTC   364d
# ...

# === Renew All Certificates ===
sudo kubeadm certs renew all

# === Renew Specific Certificate ===
sudo kubeadm certs renew apiserver
sudo kubeadm certs renew apiserver-kubelet-client

# === Restart Control Plane Components ===
sudo systemctl restart kubelet

# for static pods, move back manifest
sudo mv /etc/kubernetes/manifests/kube-apiserver.yaml /tmp/
sudo mv /tmp/kube-apiserver.yaml /etc/kubernetes/manifests/
```

### Kubelet Certificate Rotation

```yaml
# /var/lib/kubelet/config.yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

# Enable automatic certificate rotation
rotateCertificates: true

# Enable server TLS bootstrap
serverTLSBootstrap: true
```

---

## Security Best Practices

Here are the security best practices for TLS in Kubernetes:

### 1\. Minimum TLS Version

```yaml
# Use minimum TLS 1.2
- --tls-min-version=VersionTLS12

# Or better TLS 1.3 if supported
- --tls-min-version=VersionTLS13
```

### 2\. Strong Cipher Suites

```yaml
# Only use strong cipher suites
- --tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
```

### 3\. File Permissions

```bash
# Private keys must be 600 (only owner can read)
chmod 600 /etc/kubernetes/pki/*.key
chmod 600 /etc/kubernetes/pki/etcd/*.key

# Certificates can be 644
chmod 644 /etc/kubernetes/pki/*.crt
chmod 644 /etc/kubernetes/pki/etcd/*.crt

# Ownership must be root:root
chown root:root /etc/kubernetes/pki/*
chown root:root /etc/kubernetes/pki/etcd/*
```

### 4\. Certificate Validation

```bash
# Verify certificate is valid
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout

# Verify certificate chain
openssl verify -CAfile /etc/kubernetes/pki/ca.crt /etc/kubernetes/pki/apiserver.crt

# Check expiration
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -dates
```

### 5\. Disable Auto TLS

```yaml
# etcd - disable auto TLS
- --auto-tls=false
- --peer-auto-tls=false
```

---

## 🔗 Referensi / References

* [Kubernetes PKI Certificates](https://kubernetes.io/docs/setup/best-practices/certificates/)
    
* [Certificate Management with kubeadm](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
    
* [TLS Bootstrapping](https://kubernetes.io/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
