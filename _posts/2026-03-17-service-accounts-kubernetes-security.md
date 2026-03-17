---
layout: post
title: Service Accounts - Kubernetes Security
date: 2026-02-01T12:32:00
description: A Service Account is an identity used by processes running inside a Pod to interact with the Kubernetes API Server.
categories:
  - kubernetes
tags: []
image:
  path: https://picsum.photos/id/41/1920/1280.webp
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

# Introduction

A Service Account is an identity used by processes running inside a Pod to interact with the Kubernetes API Server. Unlike user accounts used by humans, Service Accounts are specifically designed for applications and workloads running within the cluster.

# Service Account Components

### 1\. Service Account Object

A Service Account is a Kubernetes object representing an identity for processes running in a Pod.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-app-sa
  namespace: production
  labels:
    app: my-application
# Kubernetes 1.24+: Token is not automatically created as Secret
automountServiceAccountToken: true  # Default: true
```

### 2\. Token Types

**Difference between Legacy vs Bound Tokens:**

| Aspect | Legacy Token | Bound Token (1.24+) |
| --- | --- | --- |
| Validity | Never expires | Has expiration time |
| Storage | Stored in Secret | Projected volume |
| Audience | No binding | Bound to specific audience |
| Security | High risk if leaked | More secure, auto-rotate |
| Rotation | Manual | Automatic |

### 3\. Token Projection

Projected Service Account Token is a modern mechanism for providing tokens to Pods with better security features.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: my-app-sa
  containers:
  - name: app
    image: my-app:latest
    volumeMounts:
    - name: token
      mountPath: /var/run/secrets/tokens
      readOnly: true
  volumes:
  - name: token
    projected:
      sources:
      - serviceAccountToken:
          path: api-token
          expirationSeconds: 3600    # 1 hour
          audience: api              # Audience binding
```

---

## Service Account Security Best Practices

### 1\. Disable Auto-Mount Token

By default, Kubernetes automatically mounts Service Account tokens to every Pod. This can be a security risk if the Pod doesn't need API Server access.

```yaml
# Option 1: Disable at ServiceAccount level
apiVersion: v1
kind: ServiceAccount
metadata:
  name: no-api-access-sa
  namespace: production
automountServiceAccountToken: false

---
# Option 2: Disable at Pod level
apiVersion: v1
kind: Pod
metadata:
  name: isolated-pod
spec:
  serviceAccountName: default
  automountServiceAccountToken: false  # Override SA setting
  containers:
  - name: app
    image: nginx
```

### 2\. Use Dedicated Service Accounts

Don't use the `default` Service Account. Create dedicated Service Accounts for each application with minimal permissions.

```yaml
# BAD: Using default service account
apiVersion: v1
kind: Pod
metadata:
  name: bad-pod
spec:
  # serviceAccountName: default (implicit)
  containers:
  - name: app
    image: nginx

---
# GOOD: Using dedicated service account
apiVersion: v1
kind: ServiceAccount
metadata:
  name: nginx-sa
  namespace: production
automountServiceAccountToken: false

---
apiVersion: v1
kind: Pod
metadata:
  name: good-pod
spec:
  serviceAccountName: nginx-sa
  automountServiceAccountToken: false
  containers:
  - name: app
    image: nginx
```

### 3\. Principle of Least Privilege

Grant only the permissions that the application actually needs. Use Role and RoleBinding to limit access.

```yaml
# Service Account with minimal permissions
apiVersion: v1
kind: ServiceAccount
metadata:
  name: configmap-reader-sa
  namespace: production

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: configmap-reader
  namespace: production
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["app-config"]  # Only specific configmap
  verbs: ["get", "watch"]        # Only read operations

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: configmap-reader-binding
  namespace: production
subjects:
- kind: ServiceAccount
  name: configmap-reader-sa
  namespace: production
roleRef:
  kind: Role
  name: configmap-reader
  apiGroup: rbac.authorization.k8s.io
```

---

## References

* [Kubernetes Service Accounts Documentation](https://kubernetes.io/docs/concepts/security/service-accounts/)
    
* [Configure Service Accounts for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)
    
* [TokenRequest API](https://kubernetes.io/docs/reference/kubernetes-api/authentication-resources/token-request-v1/)
