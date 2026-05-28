---
layout: post
title: "Belajar SRE #16: SLO Dashboard Design"
date: 2026-06-13T09:00:00+0700
description: "Pelajari cara merancang SLO dashboard dengan error budget visualization, multi-window burn rate alerting, dan compliance heatmaps di Grafana."
categories:
  - sre
tags:
  - sre-series
  - sre-advanced
  - slo-dashboard
image:
  path: https://picsum.photos/id/16/1920/1280.webp
  alt: Advanced SRE - SLO Dashboard Design dengan Error Budget dan Burn Rate
  lqip: ''
pin: false
toc: true
comments: true
math: false
mermaid: true
media_subpath: ''
render_with_liquid: true
---

SLO dashboard mentransformasi raw SLI metrics menjadi actionable insights untuk berbagai stakeholder — dari executive leadership hingga on-call engineers. Berbeda dengan monitoring dashboard tradisional yang hanya memberi tahu "ada yang error", SLO dashboard memberikan konteks bisnis: seberapa banyak error budget tersisa, seberapa cepat budget terkonsumsi, dan kapan harus mengambil tindakan. Artikel ini membahas error budget visualization, multi-window burn rate alerting, SLO compliance heatmaps, dan dashboard-as-code practices.

> Jika Anda belum membaca artikel sebelumnya, mulai dari [Advanced SRE: Reliability Patterns](/posts/advanced-sre-reliability-patterns/).

## Prerequisites

- Pemahaman SLI, SLO, dan SLA — baca: [Advanced SRE: SLI, SLO, dan SLA](/posts/advanced-sre-sli-slo-dan-sla/)
- Pemahaman error budget — baca: [Advanced SRE: Error Budget](/posts/advanced-sre-error-budget/)
- Prometheus dan PromQL dasar (recording rules, alerting rules)
- Grafana dashboard basics (panels, variables, provisioning)

## Monitoring Dashboard vs SLO Dashboard

Monitoring dashboard tradisional menampilkan raw metrics — CPU 85%, error rate 0.5%, latency p99 450ms. Masalahnya: angka-angka ini tidak menjawab pertanyaan yang sebenarnya penting: "apakah user terdampak?" dan "perlu tindakan sekarang atau nanti?"

SLO dashboard menjawab pertanyaan itu langsung:

| Monitoring Dashboard | SLO Dashboard |
|---------------------|---------------|
| "CPU usage is 85%" — lalu kenapa? | "Error budget: 65% remaining" — kita sehat |
| "Error rate is 0.5%" — itu buruk? | "Burn rate: 3x normal" — perlu investigasi |
| "Latency p99 is 450ms" — harus khawatir? | "Budget habis dalam 8 hari" — saatnya bertindak |
| Fokus: infrastructure health | Fokus: user experience & business impact |

Intinya: monitoring menjawab "apa yang terjadi?", SLO dashboard menjawab "haruskah saya peduli, dan berapa banyak waktu yang tersisa?"

## Komponen Utama SLO Dashboard

| Komponen | Fungsi | Target Audience | Update Frequency |
|----------|--------|-----------------|------------------|
| **Error Budget Gauge** | Menampilkan sisa budget dalam persentase | Semua stakeholder | Real-time |
| **Burn Rate Chart** | Menampilkan kecepatan konsumsi budget | Engineering & On-call | Real-time |
| **Compliance Heatmap** | Menampilkan status SLO semua services | Executive & Management | Hourly |
| **Budget Burn-down** | Menampilkan proyeksi exhaustion | Engineering leads | Every 15 min |

## Burn Rate — Konsep Kunci

Burn rate mengukur seberapa cepat error budget dikonsumsi relatif terhadap rate normal. Burn rate 1x berarti budget akan habis tepat di akhir window (30 hari). Burn rate 10x berarti budget akan habis dalam 3 hari.

**Formula:** Burn Rate = Actual Error Rate / Allowed Error Rate

Contoh dengan SLO 99.9% (error budget = 0.1%):

| Actual Error Rate | Burn Rate | Budget Habis Dalam |
|-------------------|-----------|-------------------|
| 0.1% | 1x | 30 hari (normal) |
| 0.5% | 5x | 6 hari |
| 1.0% | 10x | 3 hari |
| 1.44% | 14.4x | ~50 jam |
| 5.0% | 50x | 14.4 jam |
| 10.0% | 100x | 7.2 jam |

## Multi-Window Multi-Burn-Rate (MWMBR) Alerting

Google SRE Book merekomendasikan multi-window multi-burn-rate alerting. Setiap alert menggunakan dua window: long window untuk mendeteksi trend dan short window untuk menghindari false positives setelah recovery.

| Severity | Long Window | Short Window | Burn Rate | Action |
|----------|-------------|--------------|-----------|--------|
| Critical | 1h | 5m | 14.4x | Page |
| Critical | 6h | 30m | 6x | Page |
| Warning | 1d | 2h | 3x | Ticket |
| Warning | 3d | 6h | 1x | Ticket |

Cara bacanya:
- 14.4x burn rate = 2% budget terkonsumsi dalam 1 jam — harus ditangani sekarang
- 6x burn rate = 5% budget terkonsumsi dalam 6 jam — masih urgent
- 3x burn rate = 10% budget terkonsumsi dalam 1 hari — perlu investigasi
- 1x burn rate = budget on track habis di akhir bulan — perlu perhatian

## Error Budget Visualization

### Error Budget Remaining

PromQL untuk menghitung error budget remaining:

```promql
# Error Budget Remaining (%) for availability SLO
(
  (
    slo_target - (1 - slo:error_ratio:rate30d{service="$service"})
  ) / (1 - slo_target)
) * 100
```

Panel type: **Stat panel** dengan color thresholds:
- Green: > 50%
- Yellow: 25-50%
- Orange: 10-25%
- Red: < 10%

### Budget Exhaustion Forecasting

```promql
# Hours until budget exhaustion at current burn rate
(
  (
    slo_target - (1 - slo:error_ratio:rate30d{service="$service"})
  ) / (1 - slo_target)
) / (
  slo:burn_rate:1h{service="$service"}
) * (30 * 24)
```

## Fast-Burn Alert (1h Window)

Fast-burn alert mendeteksi outage besar yang mengkonsumsi error budget dengan cepat:

```promql
# Fast-burn: 1h long window, 5m short window
# Burn rate threshold: 14.4x (2% budget in 1 hour)
(
  (1 - (
    sum(rate(http_requests_total{status!~"5..",service="$service"}[1h]))
    / sum(rate(http_requests_total{service="$service"}[1h]))
  )) / (1 - $slo_target)
) > 14.4
and
(
  (1 - (
    sum(rate(http_requests_total{status!~"5..",service="$service"}[5m]))
    / sum(rate(http_requests_total{service="$service"}[5m]))
  )) / (1 - $slo_target)
) > 14.4
```

## Slow-Burn Alert (6h Window)

Slow-burn alert mendeteksi degradasi gradual:

```promql
# Slow-burn: 6h long window, 30m short window
# Burn rate threshold: 6x (5% budget in 6 hours)
(
  (1 - (
    sum(rate(http_requests_total{status!~"5..",service="$service"}[6h]))
    / sum(rate(http_requests_total{service="$service"}[6h]))
  )) / (1 - $slo_target)
) > 6
and
(
  (1 - (
    sum(rate(http_requests_total{status!~"5..",service="$service"}[30m]))
    / sum(rate(http_requests_total{service="$service"}[30m]))
  )) / (1 - $slo_target)
) > 6
```

## Dashboard Audience Design

### Executive Dashboard

Fokus pada high-level compliance dan business impact:

| Panel | Type | Content |
|-------|------|---------|
| Overall SLO Score | Stat (large) | Traffic-weighted compliance % |
| Service Status Grid | Status map | RED/YELLOW/GREEN per service |
| Monthly Trend | Time series | 30-day rolling compliance |
| Error Budget Summary | Table | Budget remaining per tier |

### Engineering Dashboard

Fokus pada detailed burn rate dan error budget per service:

| Panel | Type | Content |
|-------|------|---------|
| Error Budget Gauge | Gauge | Budget remaining % per service |
| Burn Rate (1h/6h) | Time series | Real-time burn rate |
| Budget Burn-down | Time series | Monthly burn-down chart |
| Exhaustion Forecast | Stat | Hours until budget exhaustion |
| Recent Deployments | Annotations | Deploy markers on charts |

### On-Call Dashboard

Fokus pada real-time alerts dan actionable context:

| Panel | Type | Content |
|-------|------|---------|
| Active Alerts | Alert list | Current firing alerts |
| Current Burn Rate | Stat (large) | Real-time burn rate multiplier |
| Error Rate (5m) | Time series | Last 1 hour, 5m resolution |
| Dependency Health | Status map | Upstream/downstream status |
| Runbook Links | Text/HTML | Quick links per service |

## Recording Rules untuk SLO Metrics

```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: slo-recording-rules
  namespace: monitoring
spec:
  groups:
  - name: slo:sli:availability
    interval: 30s
    rules:
    - record: slo:http_requests:rate5m
      expr: |
        sum(rate(http_requests_total[5m])) by (service, namespace)

    - record: slo:http_requests_success:rate5m
      expr: |
        sum(rate(http_requests_total{status!~"5.."}[5m])) by (service, namespace)

    - record: slo:error_ratio:rate5m
      expr: |
        1 - (
          slo:http_requests_success:rate5m
          / slo:http_requests:rate5m
        )

  - name: slo:burn_rate
    interval: 30s
    rules:
    - record: slo:burn_rate:1h
      expr: |
        (
          1 - (
            sum(rate(http_requests_total{status!~"5.."}[1h])) by (service, namespace)
            / sum(rate(http_requests_total[1h])) by (service, namespace)
          )
        ) / on(service) group_left()
        (1 - slo:target{slo_type="availability"})

    - record: slo:burn_rate:6h
      expr: |
        (
          1 - (
            sum(rate(http_requests_total{status!~"5.."}[6h])) by (service, namespace)
            / sum(rate(http_requests_total[6h])) by (service, namespace)
          )
        ) / on(service) group_left()
        (1 - slo:target{slo_type="availability"})

  - name: slo:error_budget
    interval: 60s
    rules:
    - record: slo:error_budget:remaining
      expr: |
        (
          (
            slo:target{slo_type="availability"}
            - (1 - slo:error_ratio:rate30d)
          ) / (1 - slo:target{slo_type="availability"})
        ) * 100
```

## Studi Kasus: TechStartup Indonesia

### Konteks

TSI pada Scale Phase (2022 Q1) membangun SLO dashboards untuk 15+ services, menggantikan threshold-based monitoring dengan error budget-driven observability.

Kondisi sebelumnya:
- 47 Grafana dashboards yang sebagian besar abandoned
- 120+ alert rules dengan 60% noisy
- Tidak ada SLO-specific visualization
- CTO tidak bisa menjawab "apakah kita reliable?"
- On-call engineer tidak punya context saat alert bunyi
- Engineering tidak tahu kapan harus freeze deployment

### Apa yang Dilakukan

TSI mengimplementasikan SLO dashboard ecosystem:

1. **3 Tiered Dashboards** — Executive (merah/hijau/kuning), Engineering (burn rate detail), On-Call (real-time alerts + runbook links)
2. **Dashboard-as-Code** — Grafana provisioning via Terraform, no manual dashboard creation
3. **Multi-Window Burn Rate Alerting** — Menggantikan 120+ threshold-based alerts dengan 24 burn rate rules
4. **Recording Rules** — Pre-compute semua SLI metrics untuk performance dan konsistensi

### Metrics Improvement

| Metric | Sebelum | Sesudah | Perubahan |
|--------|---------|---------|-----------|
| MTTR | 35 min | 12 min | -65% |
| False positive alerts | 60% | 8% | -87% |
| Alert-to-action time | 15 min | 3 min | -80% |
| Alert rules (total) | 120+ (noisy) | 24 burn rate rules | -80% |
| SLO visibility | 0 dashboards | 3 tiered dashboards | Full coverage |
| Deployment decisions | Subjective | Data-driven (error budget) | Eliminated conflicts |

### Lessons Learned

**Yang Berhasil:**
- Membuat 3 dashboard terpisah per audience — satu dashboard untuk semua orang tidak pernah berhasil karena kebutuhan informasi berbeda
- Recording rules untuk pre-compute SLI — query performance naik 10x dan konsistensi terjaga across dashboards dan alerts
- Burn rate alerting menggantikan threshold-based alerts — false positive turun dari 60% ke 8%
- Dashboard-as-code dari awal — tidak ada drift antara environments

**Yang Perlu Dihindari:**
- Dashboard terlalu detail untuk executive — CTO hanya butuh "merah/hijau/kuning", bukan burn rate per endpoint
- Refresh interval tidak tepat — on-call dashboard butuh 30 detik, executive dashboard cukup 1 jam
- Lupa include deployment annotations — tanpa correlation antara deploy dan burn rate spike, root cause analysis tetap lambat

## Best Practices

- **Design dashboard per audience** — executive, engineering, dan on-call membutuhkan informasi berbeda
- **Gunakan recording rules** — pre-compute SLI dan burn rate untuk konsistensi dan performance
- **Implement multi-window burn rate alerting** — balance antara sensitivity dan specificity
- **Include deployment annotations** — correlate burn rate spikes dengan recent deploys
- **Automate dashboard provisioning** — dashboard-as-code via Terraform atau Grafana provisioning
- **Set refresh interval yang tepat** — on-call: 30s, engineering: 5m, executive: 1h
- **Gunakan traffic-weighted aggregation** — service dengan traffic tinggi harus punya bobot lebih besar

## Selanjutnya

Artikel berikutnya: [Advanced SRE: On-Call Automation & Runbook](/posts/advanced-sre-on-call-automation-runbook/) — pelajari cara mengautomasi response terhadap SLO alerts yang dihasilkan dashboard ini, termasuk runbook-as-code dan graduated auto-remediation.

Topik terkait yang bisa Anda eksplorasi:
- On-Call Automation — automasi respons terhadap burn rate alerts
- Chaos Engineering — validasi SLO dashboards dengan failure injection
- Capacity Planning — gunakan SLO data untuk forecasting

## References

- [Google SRE Workbook — Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)
- [Grafana Documentation — SLO](https://grafana.com/docs/grafana/latest/slo/)
- [Prometheus Recording Rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/)
- [Sloth SLO Framework](https://sloth.dev/)
- [OpenSLO Specification](https://openslo.com/)

---

## Navigasi Series

⬅️ **Sebelumnya:** [Advanced SRE: Reliability Patterns](/posts/advanced-sre-reliability-patterns/)

➡️ **Selanjutnya:** [Advanced SRE: On-Call Automation & Runbook](/posts/advanced-sre-on-call-automation-runbook/)