---
layout: post
title: "Belajar SRE #19: Data Integrity"
date: 2026-06-19T09:00:00+0700
description: "Pelajari data integrity dan backup strategy: PITR, recovery testing automation, data validation, dan 3-2-1 backup rule untuk production systems."
categories:
  - sre
tags:
  - sre-series
  - sre-advanced
  - data-integrity
image:
  path: https://picsum.photos/id/19/1920/1280.webp
  alt: Advanced SRE - Data Integrity dan Backup Strategy untuk Reliability
  lqip: ''
pin: false
toc: true
comments: true
math: false
mermaid: false
media_subpath: ''
render_with_liquid: true
---

Data integrity adalah aspek reliability yang sering diabaikan sampai terjadi data loss atau corruption. Google SRE Book Chapter 26 menegaskan bahwa data loss adalah salah satu failure mode paling berbahaya, berbeda dengan downtime yang bersifat sementara, data loss bisa bersifat permanen dan irreversible. Dalam praktik SRE, data integrity bukan hanya tentang "punya backup" — ini tentang memastikan backup benar-benar bisa di-restore, data yang di-read konsisten dengan data yang di-write, dan recovery process sudah teruji. Prinsip utamanya: **backup yang tidak pernah di-test sama dengan tidak punya backup**.

> Jika Anda belum membaca artikel sebelumnya, mulai dari [Advanced SRE: Overload Handling](/posts/advanced-sre-overload-handling/).

## Prerequisites

- Pemahaman SLI/SLO/SLA — baca: [Advanced SRE: SLI, SLO, dan SLA](/posts/advanced-sre-sli-slo-dan-sla/)
- Pemahaman postmortem — baca: [Advanced SRE: Postmortem Culture](/posts/advanced-sre-postmortem-culture/)
- Familiar dengan AWS RDS, S3, dan IAM
- Familiar dengan PostgreSQL administration basics

## Data Integrity Dimensions

1. **Freshness** — Data yang dibaca adalah data terbaru. "Apakah read saya mengembalikan write terakhir?"
2. **Completeness** — Tidak ada data yang hilang. "Apakah semua records yang seharusnya ada, ada?"
3. **Consistency** — Data tidak contradictory. "Apakah balance = sum(credits) - sum(debits)?"
4. **Durability** — Data yang di-write tidak hilang. "Apakah data yang saya tulis kemarin masih ada?"
5. **Correctness** — Data sesuai dengan business rules. "Apakah semua constraints terpenuhi?"

**Defense in Depth:**

1. Application validation (input sanitization)
2. Database constraints (FK, unique, check)
3. Replication (multi-AZ, read replicas)
4. Backups (automated, point-in-time)
5. Cross-region copies (disaster recovery)
6. Immutable audit logs (compliance)

## RPO & RTO

| Metric | Definisi | Pertanyaan |
|--------|----------|-----------|
| **RPO** | Berapa banyak data yang boleh hilang | "Berapa menit data loss yang acceptable?" |
| **RTO** | Berapa lama downtime yang boleh terjadi | "Berapa cepat kita harus recover?" |

| RPO/RTO Target | Strategy | Relative Cost |
|----------------|----------|---------------|
| RPO: 24h | Daily backup | $ |
| RPO: 1h | Hourly snapshot | $$ |
| RPO: 5min | Point-in-time (PITR) | $$$ |
| RPO: 0 (zero) | Synchronous replica | $$$$ |
| RTO: 24h | Manual restore | $ |
| RTO: 1h | Automated restore | $$ |
| RTO: 5min | Hot standby/failover | $$$ |
| RTO: 0 (zero) | Active-active | $$$$ |

## Backup Strategies

**1. Full Backup** — Complete copy of all data.
- Pros: Simple restore, self-contained
- Cons: Slow, expensive storage
- Schedule: Weekly (off-peak hours)

**2. Incremental Backup** — Only changes since last backup.
- Pros: Fast, minimal storage
- Cons: Restore requires full + all incrementals
- Schedule: Every 6 hours

**3. Point-in-Time Recovery (PITR)** — Continuous WAL/binlog archiving.
- Pros: Restore to any second, minimal data loss
- Cons: Storage cost for WAL archives
- AWS RDS: Enabled by default, 5-min granularity

**Recommended (3-2-1 Rule):**
- 3 copies of data (production + 2 backups)
- 2 different storage media (EBS + S3)
- 1 copy offsite (cross-region S3 replication)

## AWS Backup Strategy (Terraform)

```hcl
# aws-backup-plan.tf
resource "aws_backup_plan" "production_db" {
  name = "production-database-backup"

  # Rule 1: Continuous backup (PITR) — RPO 5 minutes
  rule {
    rule_name         = "continuous-pitr"
    target_vault_name = aws_backup_vault.production.name
    schedule          = "cron(0 */1 * * ? *)"
    enable_continuous_backup = true

    lifecycle {
      delete_after = 35
    }
  }

  # Rule 2: Daily snapshot — retained 30 days
  rule {
    rule_name         = "daily-snapshot"
    target_vault_name = aws_backup_vault.production.name
    schedule          = "cron(0 3 * * ? *)"

    lifecycle {
      delete_after = 30
    }

    copy_action {
      destination_vault_arn = aws_backup_vault.dr_region.arn
      lifecycle {
        delete_after = 30
      }
    }
  }

  # Rule 3: Weekly full backup — retained 90 days
  rule {
    rule_name         = "weekly-full"
    target_vault_name = aws_backup_vault.production.name
    schedule          = "cron(0 2 ? * SUN *)"

    lifecycle {
      cold_storage_after = 30
      delete_after       = 90
    }
  }

  # Rule 4: Monthly backup — retained 1 year (compliance)
  rule {
    rule_name         = "monthly-compliance"
    target_vault_name = aws_backup_vault.compliance.name
    schedule          = "cron(0 1 1 * ? *)"

    lifecycle {
      cold_storage_after = 30
      delete_after       = 365
    }
  }
}
```

## Recovery Testing

### Mengapa Recovery Testing Wajib?

Menurut berbagai survey industri:
- [33% organisasi jarang atau tidak pernah test disaster recovery](https://www.kaseya.com/blog/backup-testing/) (Kaseya, 2025)
- [31% gagal recover data saat ransomware menyerang](https://www.kaseya.com/blog/backup-testing/), meskipun 92% klaim punya backup
- [37% tidak bisa recover dalam RTO yang ditargetkan](https://gitnux.org/disaster-recovery-statistics/) karena backup missing atau untested (Gitnux, 2026)
- [89% hanya test DR setahun sekali atau tidak sama sekali](https://www.cioinsight.com/news-trends/many-backup-recovery-systems-go-untested/) (CIO Insight)

### Automated Recovery Testing Script

```bash
#!/bin/bash
# recovery-test.sh — Automated weekly recovery testing
set -euo pipefail

DB_IDENTIFIER="production-db"
TEST_DB_IDENTIFIER="recovery-test-$(date +%Y%m%d)"
RESTORE_TIMESTAMP=$(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ)

echo "[1/5] Restoring from PITR to ${RESTORE_TIMESTAMP}..."
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier "${DB_IDENTIFIER}" \
  --target-db-instance-identifier "${TEST_DB_IDENTIFIER}" \
  --restore-time "${RESTORE_TIMESTAMP}" \
  --db-instance-class "db.t3.medium" \
  --no-multi-az

echo "[2/5] Waiting for restore to complete..."
aws rds wait db-instance-available \
  --db-instance-identifier "${TEST_DB_IDENTIFIER}"

echo "[3/5] Running data validation..."
ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier "${TEST_DB_IDENTIFIER}" \
  --query 'DBInstances[0].Endpoint.Address' --output text)

USERS_COUNT=$(psql -h "${ENDPOINT}" -U admin -d production \
  -t -c "SELECT COUNT(*) FROM users;")
echo "Users: ${USERS_COUNT}"

echo "[4/5] Validating data integrity..."
INTEGRITY_CHECK=$(psql -h "${ENDPOINT}" -U admin -d production -t -c "
  SELECT CASE
    WHEN (SELECT COUNT(*) FROM orders WHERE user_id NOT IN (SELECT id FROM users)) = 0
    AND (SELECT COUNT(*) FROM payments WHERE order_id NOT IN (SELECT id FROM orders)) = 0
    THEN 'PASS'
    ELSE 'FAIL'
  END AS integrity_status;
")

echo "[5/5] Cleaning up test instance..."
aws rds delete-db-instance \
  --db-instance-identifier "${TEST_DB_IDENTIFIER}" \
  --skip-final-snapshot

echo "Recovery test completed: ${INTEGRITY_CHECK}"
```

## Continuous Data Validation

```yaml
# data-validation-checks.yaml
checks:
  - name: orphaned_orders
    query: "SELECT COUNT(*) FROM orders WHERE user_id NOT IN (SELECT id FROM users)"
    expected: 0
    severity: critical
    schedule: "*/15 * * * *"

  - name: negative_balance
    query: "SELECT COUNT(*) FROM wallets WHERE balance < 0"
    expected: 0
    severity: critical
    schedule: "*/5 * * * *"

  - name: stale_inventory
    query: "SELECT COUNT(*) FROM products WHERE updated_at < NOW() - INTERVAL '1 hour'"
    threshold: 100
    severity: medium
    schedule: "*/30 * * * *"

  - name: replica_lag
    query: "SELECT EXTRACT(EPOCH FROM (NOW() - pg_last_xact_replay_timestamp()))"
    threshold: 60
    severity: high
    schedule: "*/1 * * * *"
```

## Studi Kasus: TechStartup Indonesia

### Konteks

TSI pada Q3 2021 mengalami database corruption incident.

Incident detail:
- Migration script yang salah mengupdate 15,000 order records (wrong JOIN condition)
- Corruption terdeteksi 30 menit kemudian dari customer complaints — bukan dari monitoring
- Tim harus melakukan PITR restore, tapi belum pernah test restore process sebelumnya
- Hasil: 5 jam downtime, 45 menit data loss, Rp 45 juta revenue loss

### Apa yang Dilakukan

Setelah postmortem, TSI membangun comprehensive data integrity framework:

1. **Automated Weekly PITR Restore + Validation** — Test restore setiap minggu, validasi data integrity
2. **Mandatory Snapshot Sebelum Migration** — Rollback point selalu tersedia
3. **Continuous Data Validation Checks** — Referential integrity check setiap 5 menit
4. **Migration Review Process** — PR + staging test mandatory sebelum production
5. **Cross-Region Backup Copies** — 3-2-1 rule: 3 copies, 2 media, 1 offsite

### Metrics Improvement

| Metric | Sebelum | Sesudah | Perubahan |
|--------|---------|---------|-----------|
| RPO (actual) | Unknown | 5 min | Defined |
| RTO (actual) | 5 hours | 30 min | -83% |
| Recovery test frequency | Never | Weekly | ∞ |
| Data validation checks | 0 | 12 | +12 |
| Migration incidents | 3/year | 0/year | -100% |
| Time to detect corruption | 30 min | 5 min | -83% |
| Restore confidence | Low | High | ↑↑↑ |

### Lessons Learned

**Yang Berhasil:**
- Weekly automated PITR restore + validation — confidence level naik drastis; tim tahu pasti backup bisa di-restore
- Mandatory snapshot sebelum setiap migration — rollback point selalu tersedia; migration incident berikutnya di-resolve dalam 15 menit
- Continuous data validation checks (referential integrity setiap 5 menit) — corruption terdeteksi dalam menit, bukan jam
- Migration review process (PR + staging test mandatory) — zero migration incidents setelah implementasi

**Yang Perlu Dihindari:**
- Hanya test restore di staging — production database 100x lebih besar, restore time berbeda signifikan
- PITR retention terlalu pendek (7 hari default) — satu corruption terdeteksi setelah 5 hari; dinaikkan ke 35 hari
- Lupa include application-level validation — database-level checks saja tidak cukup; business logic consistency check menangkap issues yang referential integrity miss

## Best Practices

- **Test backups regularly** — weekly automated restore + validation
- **Define RPO/RTO per service** — different services need different targets
- **Automate recovery process** — runbook + scripts, bukan manual steps
- **Implement continuous data validation** — detect corruption early, before it spreads
- **Cross-region backup copies** — protect against regional disasters
- **Snapshot before migrations** — always have rollback point
- **Implement immutable audit logs** — track all data changes for forensics

## Selanjutnya

Artikel berikutnya: [Advanced SRE: Release Engineering](/posts/advanced-sre-release-engineering/) — pelajari release engineering practices termasuk progressive delivery, canary deployments, dan automated rollback untuk meminimalkan risiko deployment.

Topik terkait yang bisa Anda eksplorasi:
- Release Engineering — safe deployment practices
- Chaos Engineering — testing failure scenarios including data loss
- Postmortem Culture — learning from data incidents

## References

- [Google SRE Book — Chapter 26: Data Integrity](https://sre.google/sre-book/data-integrity/)
- [AWS RDS Point-in-Time Recovery](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)
- [AWS Backup Documentation](https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html)
- [PostgreSQL Backup & Recovery](https://www.postgresql.org/docs/current/backup.html)
- [3-2-1 Backup Rule — Backblaze](https://www.backblaze.com/blog/the-3-2-1-backup-strategy/)

---

## Navigasi Series

⬅️ **Sebelumnya:** [Advanced SRE: Overload Handling](/posts/advanced-sre-overload-handling/)

➡️ **Selanjutnya:** [Advanced SRE: Release Engineering](/posts/advanced-sre-release-engineering/)