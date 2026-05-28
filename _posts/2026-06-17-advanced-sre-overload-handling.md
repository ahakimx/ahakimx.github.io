---
layout: post
title: "Belajar SRE #18: Overload Handling"
date: 2026-06-17T09:00:00+0700
description: "Pelajari strategi overload handling: load shedding, rate limiting, dan graceful degradation untuk menjaga sistem tetap berfungsi saat traffic spike."
categories:
  - sre
tags:
  - sre-series
  - sre-advanced
  - overload-handling
image:
  path: https://picsum.photos/id/18/1920/1280.webp
  alt: Advanced SRE - Overload Handling dengan Load Shedding dan Rate Limiting
  lqip: ''
pin: false
toc: true
comments: true
math: false
mermaid: false
media_subpath: ''
render_with_liquid: true
---

Overload handling adalah kemampuan sistem untuk tetap berfungsi (meskipun dalam kapasitas terbatas) ketika menerima traffic yang melebihi kapasitasnya. Google SRE Book Chapter 21 menegaskan bahwa sistem yang baik harus bisa menolak sebagian request dengan graceful daripada collapse sepenuhnya. Dalam dunia nyata, overload bisa terjadi karena flash sale, viral moment, DDoS attack, atau cascading failure. Artikel ini membahas tiga strategi utama: load shedding, rate limiting/throttling, dan graceful degradation.

> Jika Anda belum membaca artikel sebelumnya, mulai dari [Advanced SRE: On-Call Automation & Runbook](/posts/advanced-sre-on-call-automation-runbook/).

## Prerequisites

- Pemahaman SLI/SLO/SLA — baca: [Advanced SRE: SLI, SLO, dan SLA](/posts/advanced-sre-sli-slo-dan-sla/)
- Pemahaman reliability patterns — baca: [Advanced SRE: Reliability Patterns](/posts/advanced-sre-reliability-patterns/)
- Pemahaman capacity planning — baca: [Advanced SRE: Capacity Planning](/posts/advanced-sre-capacity-planning/)
- Familiar dengan Kubernetes (HPA, resource limits)
- Familiar dengan Envoy proxy atau Istio service mesh

## Mengapa Overload Handling Penting?

Tanpa overload handling, sistem mengalami cascading collapse:

**TANPA Overload Handling** (spike 5000 req/s):

- Database MAX CONN EXHAUSTED
- Timeout → Retry storm → More load
- → TOTAL COLLAPSE
- **RESULT: 0% requests succeed (total outage)**

**DENGAN Overload Handling:**

- API Gateway RATE LIMIT 2000 req/s
- Order Service LOAD SHED by priority
- 2000 req/s → processed successfully ✅
- 3000 req/s → rejected with 429 (Too Many Requests)
- **RESULT: 40% requests succeed (2000/5000)**

> Lebih baik serve 40% dengan baik daripada 0% total collapse

## Tiga Strategi Overload Handling

| Strategy | Apa yang Dilakukan | Kapan Digunakan | Contoh |
|----------|-------------------|-----------------|--------|
| **Load Shedding** | Menolak excess requests berdasarkan priority | Saat system mendekati capacity limit | Drop low-priority requests |
| **Rate Limiting** | Membatasi jumlah requests per time window | Mencegah abuse dan protect backend | Max 100 req/s per user |
| **Graceful Degradation** | Mengurangi fitur untuk mempertahankan core | Saat load tinggi tapi semua request penting | Disable recommendations |

## Load Shedding

### Priority-Based Shedding

**Priority-Based Shedding:**

| Priority | Level | Services | Rule |
|----------|-------|----------|------|
| 1 | Critical | Payment, Auth | ALWAYS serve |
| 2 | High | Order, Inventory | Serve if load < 80% |
| 3 | Medium | Search, Browse | Serve if load < 60% |
| 4 | Low | Analytics, Reco | Serve if load < 40% |

- **Load 90%:** Shed P4 + P3 → serve P1 + P2 only
- **Load 95%:** Shed P4 + P3 + P2 → serve P1 only

**CoDel (Controlled Delay):**

- Monitor queue latency, bukan queue length
- Jika request sudah di queue > threshold → drop
- Cocok untuk: real-time systems, user-facing APIs

### Load Shedding Middleware (Go)

```go
// load_shedder.go — Priority-based load shedding middleware
package middleware

import (
    "net/http"
    "sync/atomic"
)

type LoadShedder struct {
    maxConcurrent int64
    current       int64
    priorities    map[string]int
}

func NewLoadShedder(maxConcurrent int64) *LoadShedder {
    return &LoadShedder{
        maxConcurrent: maxConcurrent,
        priorities: map[string]int{
            "/api/payment":  1, // Critical — never shed
            "/api/auth":     1, // Critical — never shed
            "/api/order":    2, // High — shed at 80%
            "/api/search":   3, // Medium — shed at 60%
            "/api/recommend": 4, // Low — shed at 40%
        },
    }
}

func (ls *LoadShedder) Middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        current := atomic.LoadInt64(&ls.current)
        loadPercent := float64(current) / float64(ls.maxConcurrent) * 100
        priority := ls.getPriority(r.URL.Path)

        if ls.shouldShed(loadPercent, priority) {
            w.Header().Set("Retry-After", "5")
            http.Error(w, "Service overloaded", http.StatusServiceUnavailable)
            return
        }

        atomic.AddInt64(&ls.current, 1)
        defer atomic.AddInt64(&ls.current, -1)
        next.ServeHTTP(w, r)
    })
}

func (ls *LoadShedder) shouldShed(loadPercent float64, priority int) bool {
    switch priority {
    case 1: return false              // Never shed critical
    case 2: return loadPercent > 80   // Shed high at 80%
    case 3: return loadPercent > 60   // Shed medium at 60%
    case 4: return loadPercent > 40   // Shed low at 40%
    default: return loadPercent > 50
    }
}
```

## Rate Limiting & Throttling

### Rate Limiting Algorithms

| Algorithm | Burst | Smoothing | Use Case |
|-----------|-------|-----------|----------|
| Token Bucket | Yes | No | API rate limiting |
| Sliding Window | No | Yes | Fair usage enforcement |
| Leaky Bucket | No | Yes | Constant output rate |

### Multi-Layer Rate Limiting

1. **Layer 1: CDN/WAF (CloudFront, AWS WAF)**
   - Global rate limit: 10,000 req/s
   - Per-IP rate limit: 100 req/s
   - DDoS protection (automatic)

2. **Layer 2: API Gateway / Load Balancer**
   - Per-API rate limit: 5,000 req/s
   - Per-user/tenant rate limit: 500 req/s
   - Burst allowance: 2x for 10 seconds

3. **Layer 3: Service Mesh (Istio/Envoy sidecar)**
   - Per-service rate limit: 1,000 req/s
   - Circuit breaker: open at 50% error rate
   - Connection pool limits

4. **Layer 4: Application (middleware)**
   - Per-endpoint rate limit
   - Priority-based load shedding
   - Adaptive throttling based on backend health

5. **Layer 5: Database/Backend**
   - Connection pool limits
   - Query timeout
   - Read replica routing for read-heavy traffic

### Envoy Rate Limit Configuration

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: EnvoyFilter
metadata:
  name: rate-limit-filter
  namespace: istio-system
spec:
  workloadSelector:
    labels:
      istio: ingressgateway
  configPatches:
    - applyTo: HTTP_FILTER
      match:
        context: GATEWAY
        listener:
          filterChain:
            filter:
              name: "envoy.filters.network.http_connection_manager"
              subFilter:
                name: "envoy.filters.http.router"
      patch:
        operation: INSERT_BEFORE
        value:
          name: envoy.filters.http.local_ratelimit
          typed_config:
            "@type": type.googleapis.com/udpa.type.v1.TypedStruct
            type_url: type.googleapis.com/envoy.extensions.filters.http.local_ratelimit.v3.LocalRateLimit
            value:
              stat_prefix: http_local_rate_limiter
              token_bucket:
                max_tokens: 5000
                tokens_per_fill: 5000
                fill_interval: 1s
```

## Graceful Degradation

### Degradation Levels

**LEVEL 0: NORMAL** (load < 70%)

- Semua fitur aktif

**LEVEL 1: LIGHT DEGRADATION** (load 70-85%)

- Disable real-time recommendations → serve cached
- Disable personalization → serve generic content
- Core: payment, order, auth tetap full

**LEVEL 2: MODERATE DEGRADATION** (load 85-95%)

- Disable search filters (only basic search)
- Serve fully cached product pages
- Reduce image quality
- Core: payment, order, auth tetap full

**LEVEL 3: HEAVY DEGRADATION** (load > 95%)

- Static product pages only
- Queue-based ordering (async confirmation)
- Simplified checkout flow
- Core: payment processing tetap prioritas utama

### Feature Flags untuk Degradation

```yaml
# degradation-config.yaml
degradation_levels:
  level_0:
    trigger: "load < 70%"
    features:
      recommendations: true
      personalization: true
      full_search: true
      image_quality: "high"

  level_1:
    trigger: "load >= 70% AND load < 85%"
    features:
      recommendations: false
      personalization: false
      full_search: true
      image_quality: "high"

  level_2:
    trigger: "load >= 85% AND load < 95%"
    features:
      recommendations: false
      personalization: false
      full_search: false
      image_quality: "medium"

  level_3:
    trigger: "load >= 95%"
    features:
      recommendations: false
      personalization: false
      full_search: false
      image_quality: "low"
      async_ordering: true
```

## Kubernetes-Native Overload Protection

### HPA dengan Custom Metrics

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: payment-service-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: payment-service
  minReplicas: 3
  maxReplicas: 50
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 30
      policies:
        - type: Percent
          value: 100
          periodSeconds: 30
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 300
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "100"
```

## Studi Kasus: TechStartup Indonesia

### Konteks

TSI pada Q4 2021 mengadakan flash sale akhir tahun yang diproyeksikan menghasilkan 10-15x traffic spike. Flash sale sebelumnya menyebabkan total outage 45 menit dan revenue loss Rp 800 juta.

### Apa yang Dilakukan

TSI mengimplementasikan multi-layer overload handling:

1. **CloudFront + WAF** — Bot blocking, per-IP rate limit 200 req/s
2. **API Gateway Envoy Rate Limiting** — Global 10K req/s, per-user 50 req/s
3. **Application-Level Priority Load Shedding** — Payment always served, recommendations disabled saat overload
4. **Graceful Degradation via Feature Flags** — Progressive feature reduction berdasarkan load level
5. **Pre-Scaling** — Scale up 2 jam sebelum flash sale dimulai

Hasilnya: flash sale dengan peak 12,500 req/s (12.5x normal) berhasil tanpa downtime.

### Metrics Improvement

| Metric | Sebelum | Sesudah | Perubahan |
|--------|---------|---------|-----------|
| Peak traffic handled | 3,000 req/s | 8,500 req/s | +183% |
| Downtime during sale | 45 min | 0 min | -100% |
| Checkout success rate | 62% | 99.2% | +37pp |
| Revenue during sale | Rp 800M | Rp 2.1B | +163% |
| Customer complaints | 1,200 | 85 | -93% |
| P1 incidents | 3 | 0 | -100% |

### Lessons Learned

**Yang Berhasil:**
- Multi-layer protection (WAF → Gateway → App → Feature Flags) — setiap layer menangani jenis overload yang berbeda
- Priority-based load shedding — checkout flow tetap 99.2% success rate meskipun total traffic melebihi capacity 56%
- Pre-scaling 2 jam sebelum flash sale — menghilangkan cold start delay dari autoscaling
- Proper HTTP status codes (429 + Retry-After header) — client-side backoff bekerja, mencegah retry storm

**Yang Perlu Dihindari:**
- Rate limit per-IP terlalu ketat (50 req/s) — banyak corporate users di belakang NAT terdampak; dinaikkan ke 200 req/s
- Tidak test load shedding dengan realistic traffic pattern — staging test hanya uniform load, production punya bursty pattern
- Graceful degradation tanpa komunikasi ke user — tambahkan banner "Flash Sale Mode: some features temporarily simplified"

## Best Practices

- **Implement multi-layer rate limiting** — CDN, gateway, app, dan database level
- **Gunakan priority-based load shedding** — critical requests (payment) harus selalu di-serve
- **Return proper HTTP status codes** — 429 dan 503 dengan Retry-After header
- **Test overload handling regularly** — load test sampai breaking point
- **Implement graceful degradation progressively** — reduce features bertahap, bukan all-or-nothing
- **Pre-scale sebelum expected spike** — flash sale, campaign launch → scale up sebelum event
- **Monitor shedding/limiting metrics** — track berapa request yang di-reject

## Selanjutnya

Artikel berikutnya: [Advanced SRE: Data Integrity](/posts/advanced-sre-data-integrity/) — pelajari strategi backup, recovery testing, dan data validation untuk melindungi data saat dan setelah incident.

Topik terkait yang bisa Anda eksplorasi:
- Data Integrity — protecting data during and after incidents
- Capacity Planning — sizing infrastructure untuk handle expected load
- Reliability Patterns — circuit breaker dan bulkhead untuk isolasi failure

## References

- [Google SRE Book — Chapter 21: Handling Overload](https://sre.google/sre-book/handling-overload/)
- [Google SRE Book — Chapter 22: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)
- [Envoy Proxy — Rate Limiting](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/rate_limit_filter)
- [Istio — Rate Limiting](https://istio.io/latest/docs/tasks/policy-enforcement/rate-limit/)
- [AWS WAF Rate-Based Rules](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html)

---

## Navigasi Series

⬅️ **Sebelumnya:** [Advanced SRE: On-Call Automation & Runbook](/posts/advanced-sre-on-call-automation-runbook/)

➡️ **Selanjutnya:** [Advanced SRE: Data Integrity](/posts/advanced-sre-data-integrity/)