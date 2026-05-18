---
layout: post
title: "Belajar SRE #1: Apa Itu Site Reliability Engineering"
date: 2026-05-19T01:30:00
description: "Pelajari apa itu Site Reliability Engineering, perbedaan dengan traditional ops, dan konsep dasar toil. Panduan foundation untuk memulai SRE."
categories:
  - sre
tags:
  - sre-series
  - sre-foundation
  - what-is-sre
image:
  path: https://picsum.photos/id/2/1920/1280.webp
  alt: Foundation SRE - Pengantar Site Reliability Engineering
  lqip: ''
pin: false
toc: true
comments: true
math: false
mermaid: true
media_subpath: ''
render_with_liquid: true
---

Site Reliability Engineering (SRE) adalah disiplin engineering yang menerapkan prinsip software engineering pada masalah infrastruktur dan operasional. Diperkenalkan oleh Google pada awal 2000-an, SRE memberikan framework untuk menyeimbangkan kecepatan pengembangan fitur (velocity) dan keandalan sistem (reliability). Artikel ini membahas fondasi SRE — mulai dari definisi, perbedaan dengan traditional operations, hingga pengenalan konsep toil.

## Prerequisites

- Pemahaman dasar Linux dan command line
- Familiar dengan konsep dasar containers
- Tidak memerlukan pengalaman SRE sebelumnya — artikel ini adalah starting point

## Apa Itu Site Reliability Engineering?

SRE adalah pendekatan engineering untuk mengelola production systems yang reliable, scalable, dan efficient. Alih-alih mengandalkan manual processes dan tribal knowledge, SRE menggunakan automation, measurement, dan engineering rigor.

Ben Treynor Sloss mendefinisikan SRE sebagai *"what happens when you ask a software engineer to design an operations function."*

### Core Principles SRE

1. **Engineering Approach to Operations**
   - Treat operations as a software problem
   - Automate repetitive tasks (reduce toil)
   - Apply software engineering practices to infra

2. **Service Level Objectives (SLOs)**
   - Define measurable reliability targets
   - Use data to make decisions
   - Balance reliability vs feature velocity

3. **Error Budgets**
   - 100% reliability is the wrong target
   - Error budget = acceptable unreliability
   - Budget habis → freeze features, fokus reliability

4. **Toil Reduction**
   - Identify manual, repetitive operational work
   - Automate toil systematically
   - Target: max 50% time on toil, 50% on engineering

5. **Blameless Postmortems**
   - Learn from failures, don't blame individuals
   - Focus on systemic improvements
   - Share learnings across organization

### Definisi Kunci dalam SRE

| Term | Definisi | Contoh |
|------|----------|--------|
| **Reliability** | Kemampuan sistem untuk berfungsi sesuai harapan | Uptime 99.9% per bulan |
| **SLI** (Service Level Indicator) | Metric yang mengukur level layanan | % requests yang berhasil |
| **SLO** (Service Level Objective) | Target untuk SLI | 99.9% availability per bulan |
| **SLA** (Service Level Agreement) | Kontrak formal dengan konsekuensi | 99.9% uptime atau refund |
| **Error Budget** | Jumlah unreliability yang diizinkan | 0.1% = 43.8 menit downtime/bulan |
| **Toil** | Pekerjaan manual, repetitif, automatable | Manual deployment, manual scaling |
| **Postmortem** | Analisis setelah incident tanpa blame | "Mengapa database crash?" bukan "Siapa yang salah?" |

### Pilar-Pilar SRE

```mermaid
flowchart TD
    A[RELIABILITY<br/>The most important feature of any system] --> B[Measure]
    A --> C[Respond]
    A --> D[Improve]
    B --> B1[SLIs]
    B --> B2[SLOs]
    B --> B3[Error Budgets]
    C --> C1[Incident Management]
    C --> C2[On-call]
    C --> C3[Postmortems]
    D --> D1[Toil Reduction]
    D --> D2[Automation]
    D --> D3[Capacity Planning]
```

## SRE vs Traditional Operations

Perbedaan antara SRE dan traditional operations bukan hanya soal tools atau job title — ini adalah perbedaan filosofi dan pendekatan terhadap masalah operasional.

```mermaid
flowchart LR
    subgraph Traditional Ops
        A1[Dev Team] -->|Here's the code| A2[Ops Team]
    end
    subgraph SRE Approach
        B1[Dev Team] <-->|Shared Ownership| B2[SRE Team]
    end
```

### Perbandingan Detail

| Aspek | Traditional Ops | SRE |
|-------|----------------|-----|
| **Mindset** | "Keep it running" | "Engineer reliability" |
| **Reliability Target** | 100% uptime (unrealistic) | SLO-based (e.g., 99.9%) |
| **Failure Response** | Blame individuals | Blameless postmortems |
| **Manual Work** | Accepted as normal | Classified as "toil", harus dikurangi |
| **Deployment** | Manual, ticket-based | Automated, CI/CD pipeline |
| **Monitoring** | Reactive alerting | Proactive SLO-based alerting |
| **Decision Making** | Gut feeling, experience | Data-driven (metrics, SLIs) |
| **Change Management** | Resist change (risk) | Embrace change (with error budget) |

### Mengapa 100% Reliability Bukan Target yang Tepat?

Salah satu insight paling penting dari SRE: **100% reliability bukanlah target yang benar**.

1. **User tidak bisa membedakan 99.99% vs 100%** — ISP, device, dan network juga punya downtime
2. **Cost meningkat eksponensial** — dari 99% ($) ke 99.99% ($$$$) ke 100% (∞)
3. **Menghambat innovation** — 100% target berarti tidak boleh ada perubahan

Solusinya adalah **error budget**: SLO 99.9% memberikan error budget 0.1% (43.8 menit/bulan). Selama budget tersedia, tim boleh deploy fitur baru. Budget habis → fokus reliability.

## Reliability Mindset

Transisi dari traditional ops ke SRE dimulai dari perubahan mindset:

### Hope is Not a Strategy

```bash
# Traditional Ops approach:
# "Semoga deployment malam ini tidak break production..."
# → Manual deployment, no rollback plan

# SRE approach:
# "Kita punya automated rollback jika error rate > 1%"
# → Canary deployment, automated monitoring, defined rollback criteria
```

### Embrace Risk

SRE tidak berusaha menghilangkan semua risiko — SRE mengelola risiko secara terukur melalui tiga tahap: **Identify** (apa yang bisa fail?), **Measure** (seberapa buruk dampaknya?), dan **Manage** (bagaimana menanganinya?).

### Measure Everything

| Apa yang Diukur | Mengapa Penting | Tool Modern |
|-----------------|-----------------|-------------|
| **Availability** | Apakah user bisa mengakses service? | Prometheus, OpenTelemetry |
| **Latency** | Apakah response cukup cepat? | Prometheus histograms |
| **Error Rate** | Berapa banyak request yang gagal? | Prometheus counters |
| **Saturation** | Seberapa penuh resource kita? | node_exporter, cAdvisor |
| **Toil** | Berapa banyak waktu untuk manual work? | Time tracking |

> OpenTelemetry (OTel) telah menjadi standar industri untuk instrumentasi observability, menyediakan unified API untuk metrics, traces, dan logs.

## Pengenalan Konsep Toil

Toil adalah pekerjaan yang terkait dengan menjalankan production service yang bersifat **manual, repetitif, automatable, tactical, tanpa enduring value, dan bertumbuh linear seiring pertumbuhan service**.

### Toil vs Engineering Work

**Toil (Harus Dikurangi):**
- Manual deployment ke production
- Restart service yang crash secara manual
- Copy-paste konfigurasi antar environment
- Manual scaling saat traffic naik
- Respond alert yang sama berulang kali

**Engineering Work (Harus Ditingkatkan):**
- Membangun CI/CD pipeline
- Menulis auto-scaling policies
- Membuat self-healing mechanisms
- Menulis runbooks dan automation scripts

> **Target Google SRE:** Max 50% waktu untuk toil, min 50% untuk engineering work.

### Cara Mengidentifikasi Toil

| Karakteristik | Pertanyaan | Jika Ya = Toil |
|---------------|-----------|----------------|
| **Manual** | Apakah harus dilakukan oleh manusia? | Ya |
| **Repetitive** | Apakah dilakukan berulang kali? | Ya |
| **Automatable** | Bisakah diotomasi dengan script/tool? | Ya |
| **Tactical** | Apakah bersifat reaktif, bukan proaktif? | Ya |
| **No Enduring Value** | Apakah tidak menghasilkan improvement permanen? | Ya |
| **O(n) with Service Growth** | Apakah bertambah seiring pertumbuhan service? | Ya |

> Tidak semua manual work adalah toil. Meeting, planning, dan strategic thinking bukan toil — itu bagian penting dari engineering work.

## SLO dan Error Budget

### Hubungan SLI → SLO → SLA → Error Budget

```mermaid
flowchart TD
    A[SLI - Service Level Indicator<br/>Apa yang kita ukur?] --> B[SLO - Service Level Objective<br/>Berapa target internal kita?]
    B --> C[SLA - Service Level Agreement<br/>Apa yang kita janjikan ke customer?]
    B --> D[Error Budget<br/>Berapa kegagalan yang diizinkan?]
```

- **SLI**: Metric yang mengukur level layanan (contoh: % request berhasil)
- **SLO**: Target reliability internal (contoh: 99.9% request harus berhasil per bulan)
- **SLA**: Kontrak formal dengan customer (biasanya lebih longgar dari SLO)
- **Error Budget**: 100% - SLO = jumlah kegagalan yang masih diizinkan

### Cara Menghitung Error Budget

Asumsi 1 bulan = 30 hari = 43.200 menit:

| SLO | Error Budget | Downtime Diizinkan/Bulan |
|-----|-------------|--------------------------|
| 99% | 1% | 432 menit (7 jam 12 menit) |
| 99.5% | 0.5% | 216 menit (3 jam 36 menit) |
| 99.9% | 0.1% | 43.2 menit |
| 99.95% | 0.05% | 21.6 menit |
| 99.99% | 0.01% | 4.32 menit |

### Error Budget Policy

| Sisa Error Budget | Status | Tindakan |
|-------------------|--------|----------|
| > 50% | Healthy | Deploy normal, eksperimen diizinkan |
| 25% - 50% | Warning | Deploy dengan extra review |
| 5% - 25% | Critical | Hanya deploy bug fixes |
| < 5% | Exhausted | Freeze semua deployment, fokus reliability |

## Hands-on: Basic Reliability Assessment

Sebelum memperbaiki reliability, Anda perlu tahu posisi saat ini.

### Service Inventory

```bash
# Template: Service Inventory
cat << 'EOF' > service-inventory.csv
Service Name,Type,Owner,Criticality,Current Monitoring
api-gateway,Web Service,Platform Team,Critical,Basic health check
user-service,Microservice,Backend Team,High,Logs only
payment-service,Microservice,Payment Team,Critical,APM + Logs
database,PostgreSQL,DBA,Critical,CloudWatch
cache,Redis,Platform Team,Medium,None
EOF
```

### Simple Availability Calculator

```bash
#!/bin/bash
# simple-availability-calc.sh
echo "=== Simple Availability Calculator ==="
read -p "Total jam dalam periode (e.g., 720 untuk 1 bulan): " total_hours
read -p "Total jam downtime dalam periode: " downtime_hours

availability=$(echo "scale=4; ($total_hours - $downtime_hours) / $total_hours * 100" | bc)
echo "Availability: ${availability}%"
```

## 🏢 Studi Kasus: TechStartup Indonesia

TechStartup Indonesia (TSI) adalah startup e-commerce dengan 50.000 DAU yang di awal 2020 menghadapi growing pains — downtime yang sering, firefighting konstan, dan arsitektur monolith pada Node.js yang mulai tidak mampu menangani pertumbuhan 20%/bulan. Tim terdiri dari 15 developer dan 5 DevOps engineer, dengan deployment manual via SSH dan monitoring hanya CloudWatch basic.

Setelah "Monday Morning Incident" pada Januari 2020 yang menyebabkan 3.5 jam downtime dan kerugian Rp 35 juta (database connection pool exhausted + memory leak), CTO memutuskan untuk memulai perjalanan SRE secara bertahap selama 4 minggu. Sebelumnya, 95% waktu tim DevOps dihabiskan untuk toil — firefighting (65%), manual deployment (20%), dan manual monitoring (10%).

TSI menjalankan empat fase implementasi: (1) reliability assessment yang menghasilkan skor 3/20 — Critical, (2) setup monitoring dasar dengan Prometheus dan Grafana, (3) pembuatan runbook pertama untuk masalah memory leak yang terjadi 3x/minggu, dan (4) toil audit formal yang mengungkap bahwa 12 jam per minggu per engineer dihabiskan untuk pekerjaan yang seharusnya bisa diotomasi. Prioritas automation ditentukan berdasarkan formula frequency × time: manual deployment (135 min/minggu), log checking (150 min/minggu), dan app restart (45 min/minggu).

### Metrics Improvement

| Metric | Sebelum | Sesudah | Perubahan |
|--------|---------|---------|-----------|
| Availability | ~95% | ~98.5% | +3.5% |
| MTTD (detect) | 30 min | 5 min | -83% |
| MTTR (recover) | 3.5 hrs | 45 min | -79% |
| Incidents/month | 12 | 6 | -50% |
| Toil % (per engineer) | 65% | 40% | -25pp |

### Lessons Learned

**Yang Berhasil:**
- **Start Small, Show Value Fast** — Mulai dari monitoring basic dan satu runbook, bukan overhaul besar-besaran
- **Use Real Incidents as Motivation** — Monday Morning Incident menjadi catalyst untuk perubahan
- **Toil Audit Opens Eyes** — Ketika tim melihat 65% waktu mereka adalah toil, motivasi untuk berubah meningkat drastis
- **CTO Buy-in is Critical** — Dukungan leadership membuat perubahan cultural lebih mudah

**Yang Perlu Dihindari:**
- Jangan coba ubah semuanya sekaligus — TSI fokus pada 4 hal dalam 4 minggu
- Jangan skip assessment — tanpa data baseline, Anda tidak tahu apakah ada improvement
- Jangan blame individuals — postmortem pertama TSI hampir menjadi blame session sebelum CTO intervensi

## Best Practices

- **Mulai dari assessment** — ukur kondisi saat ini sebelum membuat perubahan apapun
- **Definisikan reliability dari perspektif user** — "Apakah user bisa checkout?" bukan "Apakah CPU < 80%?"
- **Buat runbook untuk masalah yang sering terjadi** — dokumentasi langkah penanganan incident mengurangi MTTR
- **Lakukan postmortem tanpa blame** — fokus pada systemic improvement, bukan mencari siapa yang salah
- **Track toil secara regular** — identifikasi dan prioritaskan automation berdasarkan frequency × time
- **Mulai kecil dan iterate** — satu service, satu runbook, satu dashboard, lalu expand
- **Dapatkan leadership buy-in** — dukungan management membuat perubahan cultural lebih mudah

## Selanjutnya

Artikel berikutnya: [Foundation SRE: Monitoring Basics](/posts/foundation-sre-monitoring-basics/) — membahas dasar-dasar monitoring dari perspektif SRE, termasuk four golden signals dan setup observability stack.

Topik terkait yang bisa Anda eksplorasi:
- Konsep four golden signals (latency, traffic, errors, saturation)
- OpenTelemetry sebagai standar observability modern
- Incident response dan komunikasi saat incident

## References

- [Google SRE Book — Introduction](https://sre.google/sre-book/introduction/) — Definisi original SRE oleh Ben Treynor Sloss
- [Google SRE Book — Embracing Risk](https://sre.google/sre-book/embracing-risk/) — Mengapa 100% bukan target yang tepat
- [Google SRE Book — Eliminating Toil](https://sre.google/sre-book/eliminating-toil/) — Framework untuk mengidentifikasi dan mengurangi toil
- [Google SRE Workbook](https://sre.google/workbook/table-of-contents/) — Panduan praktis implementasi SRE
- [OpenTelemetry Documentation](https://opentelemetry.io/docs/) — Standar modern untuk observability (OTel)
- [Prometheus Documentation](https://prometheus.io/docs/) — Monitoring dan alerting toolkit
- [Grafana Documentation](https://grafana.com/docs/grafana/latest/) — Visualization dan dashboarding (Grafana 11+)

---

## Navigasi Series

➡️ **Selanjutnya:** [Foundation SRE: Monitoring Basics](/posts/foundation-sre-monitoring-basics/)