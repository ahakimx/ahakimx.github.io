---
layout: post
title: 'Dashboard as Code: Managing Grafana Dashboards with Terraform'
date: 2026-06-30T08:04
description: A comprehensive guide to building a Dashboard-as-Code system using Terraform and Grafana. From local setup to a CI/CD pipeline for production
categories:
  - grafana, terraform, observability, sre, devops, infrastructure-as-code
tags:
  - grafana, terraform, observability, sre, devops, infrastructure-as-code
image:
  path: https://picsum.photos/id/802/1920/1280.webp
  alt: ''
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

Picture this scenario: Monday morning, 3:00 AM. An alert fires — there's an anomaly in production. You open Grafana, and the dashboard that was perfectly fine yesterday is now displaying incorrect data. Someone modified the query on the "HTTP Error Rate" panel directly from the UI on Friday afternoon, without telling anyone. No history, no review, no way to roll back except relying on memory.

This isn't a hypothetical scenario. This is a real experience that happens regularly on teams managing dozens to hundreds of dashboards without version control.

Over two years working as a Site Reliability Engineer at a large fintech company, I managed 50+ Grafana dashboards across 4 environments (dev, staging, production). Each dashboard had 10-20 panels. Do the math, that's 500+ panels that anyone could modify, at any time, with no clear audit trail.

Dashboard-as-Code is the solution to this problem. The concept is straightforward: **treat dashboards the same way you treat application code** stored in Git, reviewed through Pull Requests, and deployed through CI/CD pipelines.

### What We'll Build

In this article, we'll build a complete Dashboard-as-Code system:

1. **Local development stack** — Prometheus + Grafana + sample app using Docker Compose
2. **Terraform configurations** — Managing Grafana folders and dashboards declaratively
3. **Dashboard templates** — Reusable JSON templates with variables
4. **CI/CD pipeline** — Automated validation and deployment via GitHub Actions

### Who Should Read This?

- SRE/DevOps engineers already familiar with Grafana but haven't applied IaC to observability yet
- Teams with more than 10 dashboards that are starting to struggle with management
- Anyone who's ever lost a dashboard because someone "accidentally" deleted it

### Prerequisites

Before starting, make sure the following tools are installed:

- **Docker** & Docker Compose v2+ — for the local stack
- **Terraform** >= 1.5.0 — for Infrastructure as Code
- **Git** — for version control
- **curl** & **jq** — for interacting with APIs

> **Note:** This article targets macOS/Linux. If you're on Windows, use WSL2.

---

## Architecture

Before diving into the implementation, let's understand the overall architecture of the system we'll build:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Local Development                                │
│                                                                          │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│  │   Prometheus     │────▶│   Sample App    │     │     Grafana     │   │
│  │   :9090          │     │   :8080         │     │     :3000       │   │
│  │                  │────▶│                 │     │                 │   │
│  │  - scrape jobs   │     │  - /metrics     │     │  - dashboards   │   │
│  │  - 15s interval  │     │  - HTTP metrics │     │  - datasources  │   │
│  └────────┬─────────┘     └─────────────────┘     └────────┬────────┘   │
│           │                                                  │           │
│           └──────────── datasource ──────────────────────────┘           │
│                                                              ▲           │
│                                                              │           │
│                                                    ┌─────────┴────────┐  │
│                                                    │    Terraform     │  │
│                                                    │                  │  │
│                                                    │  - folders       │  │
│                                                    │  - dashboards    │  │
│                                                    │  - API calls     │  │
│                                                    └──────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         CI/CD Pipeline                                    │
│                                                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────────┐   │
│  │   Push   │───▶│ Validate │───▶│   Plan   │───▶│ Apply (on main)  │   │
│  │  to Git  │    │  fmt+val │    │  (on PR) │    │  (auto-approve)  │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**The flow:**

1. Prometheus scrapes metrics from all targets (itself, Grafana, sample app)
2. Grafana queries Prometheus as a datasource to render dashboards
3. Terraform communicates with the Grafana API to create/update folders and dashboards
4. The CI/CD pipeline automatically validates and deploys changes to Grafana

---

## Step 1: Repository Setup

A consistent project structure makes onboarding new team members easier and ensures everyone knows where to find things. We separate concerns: local infrastructure (Docker), Terraform configuration, dashboard templates, and documentation.

### Implementation

```bash
# Clone repository
git clone https://github.com/ahakimx/observability-as-code.git
cd observability-as-code
```

Or if starting from scratch:

```bash
mkdir -p observability-as-code/{prometheus,grafana/provisioning/datasources,terraform/environments,dashboards/templates,.github/workflows}
cd observability-as-code
git init
```

The target directory structure:

```
observability-as-code/
├── README.md
├── docker-compose.yaml
├── prometheus/
│   └── prometheus.yaml
├── grafana/
│   └── provisioning/datasources/prometheus.yaml
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── folders.tf
│   ├── dashboards.tf
│   ├── outputs.tf
│   └── environments/
│       ├── local.tfvars
│       └── prod.tfvars
├── dashboards/
│   └── templates/
│       └── infrastructure-overview.json
├── .github/
│   └── workflows/
│       └── deploy.yaml
└── .gitignore
```

### Explanation

- **`prometheus/`** — Prometheus configuration (scrape targets)
- **`grafana/provisioning/`** — Auto-provisioning datasource when Grafana starts
- **`terraform/`** — All Terraform configuration for Grafana
- **`terraform/environments/`** — Variable files per environment
- **`dashboards/templates/`** — Dashboard JSON templates (separated from Terraform so they can be shared)
- **`.github/workflows/`** — CI/CD pipeline

> **Note:** We deliberately separate dashboard JSON from Terraform config. This is intentional — JSON templates can be generated from other tools (Grafonnet, grafana-dashboard-builder) in the future without modifying the Terraform config.

---

## Step 2: Local Observability Stack

Before managing dashboards as code, we need a Grafana instance to target. Docker Compose provides a reproducible environment, every team member gets an identical setup with a single command.

We also need a metrics source (Prometheus) and a sample application that exposes metrics, so the dashboard we create displays real data rather than blank panels.

### Implementation

Create the `docker-compose.yaml` file:

```yaml
# docker-compose.yaml
version: "3.8"

services:
  prometheus:
    image: prom/prometheus:v2.53.0
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/prometheus.yaml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=15d"
      - "--web.enable-lifecycle"
    networks:
      - observability
    restart: unless-stopped

  grafana:
    image: grafana/grafana:11.1.0
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin123
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Viewer
    volumes:
      - ./grafana/provisioning:/etc/grafana/provisioning:ro
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
    networks:
      - observability
    restart: unless-stopped

  sample-app:
    image: quay.io/brancz/prometheus-example-app:v0.5.0
    container_name: sample-app
    ports:
      - "8080:8080"
    networks:
      - observability
    restart: unless-stopped

volumes:
  prometheus_data:
  grafana_data:

networks:
  observability:
    driver: bridge
```

Prometheus configuration to scrape all targets:

```yaml
# prometheus/prometheus.yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_timeout: 10s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]
        labels:
          environment: "local"

  - job_name: "grafana"
    static_configs:
      - targets: ["grafana:3000"]
        labels:
          environment: "local"

  - job_name: "sample-app"
    static_configs:
      - targets: ["sample-app:8080"]
        labels:
          environment: "local"
          service: "example-app"
```

Auto-provision Prometheus as a datasource in Grafana:

```yaml
# grafana/provisioning/datasources/prometheus.yaml
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: false
    jsonData:
      timeInterval: "15s"
      httpMethod: POST
    version: 1
```

### Verification

```bash
# Start all services
docker compose up -d

# Wait until all containers are running
docker compose ps

# Expected output:
# NAME          IMAGE                                        STATUS
# grafana       grafana/grafana:11.1.0                      Up (healthy)
# prometheus    prom/prometheus:v2.53.0                     Up
# sample-app    quay.io/brancz/prometheus-example-app:v0.5.0  Up
```

Verify each service:

```bash
# Prometheus - check targets
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets | length'
# Expected: 3

# Grafana - check that the datasource is provisioned
curl -s http://localhost:3000/api/datasources \
  -u admin:admin123 | jq '.[].name'
# Expected: "Prometheus"

# Sample app - check metrics endpoint
curl -s http://localhost:8080/metrics | head -5
```

### Explanation

A few important design decisions:

1. **`--web.enable-lifecycle`** on Prometheus — Allows config reload without restart (`curl -X POST http://localhost:9090/-/reload`)
2. **`GF_AUTH_ANONYMOUS_ENABLED=true`** — For development, this makes access easier without repeated logins. **Do not enable this in production.**
3. **Volume mounting `:ro`** — Config files are mounted read-only. If Grafana/Prometheus needs to modify config, that's a code smell.
4. **Named volumes** (`prometheus_data`, `grafana_data`) — Data persists across `docker compose down` and `up`. Use `docker compose down -v` for a clean slate.

---

## Step 3: Grafana API Key

Terraform communicates with Grafana through its HTTP API. This requires authentication. Grafana supports several methods:

- **API Key** — Simple, scoped per organization (legacy, but still widely used)
- **Service Account Token** — Recommended for Grafana 9+. Can be assigned to a specific role.
- **Basic Auth** — Username/password. Not recommended for automation.

For this lab we'll use an API Key because it's the most straightforward. In production, use a Service Account Token.

### Implementation

```bash
# Create an API key with Admin role
API_KEY=$(curl -s -X POST http://localhost:3000/api/auth/keys \
  -H "Content-Type: application/json" \
  -u admin:admin123 \
  -d '{"name":"terraform-local","role":"Admin","secondsToLive":86400}' \
  | jq -r '.key')

echo "API Key: $API_KEY"

# Store as an environment variable
export TF_VAR_grafana_api_key="$API_KEY"
```

> **⚠️ Warning:** The API key is only displayed once at creation time. Store it securely. For production, use a secret manager (Vault, AWS Secrets Manager, etc.).

### Verification

```bash
# Test the API key
curl -s http://localhost:3000/api/org \
  -H "Authorization: Bearer $TF_VA...key" | jq '.name'
# Expected: "Main Org."
```

### Explanation

The `secondsToLive: 86400` parameter makes the key expire in 24 hours. This is a best practice for development — you won't forget to delete unused keys because they automatically expire.

In production, Service Account Tokens can be created without expiry (for CI/CD) or with a longer expiry (30-90 days) with automated rotation.

---

## Step 4: Terraform Configuration

Terraform is an Infrastructure as Code tool that uses a **declarative** approach, you define the *desired state*, and Terraform determines the steps needed to achieve it. This is different from an imperative approach (scripting curl commands against the Grafana API).

Advantages of Terraform for Grafana:

1. **State management** — Terraform knows which resources have already been created
2. **Plan before apply** — You can always preview changes before executing them
3. **Dependency graph** — Terraform knows the order of resource creation (folder first, then dashboard)
4. **Idempotent** — Applying multiple times produces the same state

### Implementation

#### Provider Configuration

```hcl
# terraform/main.tf
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = "~> 3.7.0"
    }
  }

  # Uncomment for remote state in production
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "observability/grafana/terraform.tfstate"
  #   region         = "ap-southeast-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-locks"
  # }
}

provider "grafana" {
  url  = var.grafana_url
  auth = var.grafana_api_key
}
```

#### Variables

```hcl
# terraform/variables.tf
variable "grafana_url" {
  description = "URL of the Grafana instance"
  type        = string
  default     = "http://localhost:3000"
}

variable "grafana_api_key" {
  description = "API key or service account token for Grafana"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Deployment environment (local, staging, prod)"
  type        = string
  default     = "local"

  validation {
    condition     = contains(["local", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: local, staging, prod."
  }
}

variable "dashboard_folder_prefix" {
  description = "Prefix for dashboard folder names to support multi-env"
  type        = string
  default     = ""
}
```

#### Folders

```hcl
# terraform/folders.tf
resource "grafana_folder" "infrastructure" {
  title = "${var.dashboard_folder_prefix}Infrastructure"
}

resource "grafana_folder" "application" {
  title = "${var.dashboard_folder_prefix}Application"
}

resource "grafana_folder" "slos" {
  title = "${var.dashboard_folder_prefix}SLOs"
}
```

#### Dashboards

```hcl
# terraform/dashboards.tf
resource "grafana_dashboard" "infrastructure_overview" {
  folder      = grafana_folder.infrastructure.id
  config_json = file("${path.module}/../dashboards/templates/infrastructure-overview.json")

  overwrite = true
  message   = "Deployed via Terraform - ${var.environment}"
}
```

#### Outputs

```hcl
# terraform/outputs.tf
output "infrastructure_overview_url" {
  description = "URL to the Infrastructure Overview dashboard"
  value       = "${var.grafana_url}${grafana_dashboard.infrastructure_overview.url}"
}

output "folder_ids" {
  description = "Map of folder names to their IDs"
  value = {
    infrastructure = grafana_folder.infrastructure.id
    application    = grafana_folder.application.id
    slos           = grafana_folder.slos.id
  }
}

output "environment" {
  description = "Current deployment environment"
  value       = var.environment
}
```

#### Environment Files

```hcl
# terraform/environments/local.tfvars
grafana_url             = "http://localhost:3000"
environment             = "local"
dashboard_folder_prefix = ""
```

```hcl
# terraform/environments/prod.tfvars
grafana_url             = "https://grafana.example.com"
environment             = "prod"
dashboard_folder_prefix = ""
```

### Verification

```bash
cd terraform

# Initialize - download provider
terraform init

# Validate syntax
terraform validate
# Expected: Success! The configuration is valid.

# Format check
terraform fmt -check
# No output = all files are already formatted correctly

# Preview changes
terraform plan -var-file=environments/local.tfvars
```

The plan output should show:

```
Plan: 4 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + environment              = "local"
  + folder_ids               = {
      + application    = (known after apply)
      + infrastructure = (known after apply)
      + slos           = (known after apply)
    }
  + infrastructure_overview_url = (known after apply)
```

### Explanation

A few important points:

1. **`sensitive = true`** on `grafana_api_key` — Terraform will not display this value in logs/output
2. **`validation` block** on `environment` — Prevents typos that could cause deployment to the wrong environment
3. **`overwrite = true`** on the dashboard — If someone modifies the dashboard via the UI, Terraform will revert it to the state defined in code
4. **`file()` function** — Reads the JSON template from a separate file, keeping Terraform config clean

---

## Step 5: Dashboard Template

### Context (Why)

Dashboard JSON is Grafana's native format for defining dashboards. Every panel, query, and visualization is defined in a single JSON file. The advantages of storing them as templates:

- Version controllable (diff-able)
- Reusable across environments with variables
- Can be generated programmatically (Grafonnet, Go SDK)
- Can be validated before deploy (valid JSON, required fields)

### Implementation

Our "Infrastructure Overview" dashboard has 7 panels:

1. **Targets Status** (Stat) — Displays UP/DOWN status for all scrape targets
2. **Scrape Duration** (Stat) — How long Prometheus takes to scrape each target
3. **HTTP Request Rate** (Time Series) — Rate of HTTP requests to the sample app
4. **Memory Usage** (Time Series) — Resident memory (RSS) per process
5. **CPU Usage** (Time Series) — CPU seconds consumed per process
6. **Goroutines** (Time Series) — Number of active goroutines (Go runtime health)
7. **Scrape Samples** (Time Series) — Number of samples scraped per target

> **Tip:** Dashboard JSON files can be quite long. The best approach for creating dashboard JSON:
> 1. Build the dashboard in the Grafana UI
> 2. Export as JSON (Share → Export → Save to file)
> 3. Clean up auto-generated fields (`id`, `version`, etc.)
> 4. Add template variables (`$datasource`, `$job`)
> 5. Save to `dashboards/templates/`

The full file is in the repository: [`dashboards/templates/infrastructure-overview.json`](https://github.com/ahakimx/observability-as-code/blob/main/dashboards/templates/infrastructure-overview.json)

Key sections of the dashboard JSON:

```json
{
  "templating": {
    "list": [
      {
        "name": "datasource",
        "type": "datasource",
        "query": "prometheus"
      },
      {
        "name": "job",
        "type": "query",
        "datasource": {"uid": "${datasource}"},
        "definition": "label_values(up, job)",
        "includeAll": true,
        "multi": true
      }
    ]
  }
}
```

### Verification

```bash
# Validate JSON syntax
python3 -m json.tool dashboards/templates/infrastructure-overview.json > /dev/null
echo $?  # Expected: 0

# Check required fields
jq '{title: .title, uid: .uid, panels_count: (.panels | length), tags: .tags}' \
  dashboards/templates/infrastructure-overview.json
```

Expected output:

```json
{
  "title": "Infrastructure Overview",
  "uid": "infra-overview",
  "panels_count": 7,
  "tags": ["infrastructure", "overview", "terraform-managed"]
}
```

### Explanation

Some best practices for dashboard templates:

- **Descriptive UID** (`infra-overview`) — Makes referencing in Terraform and URLs easier
- **`terraform-managed` tag** — Visual indicator in Grafana UI that this dashboard is managed by code
- **`$datasource` template variable** — Dashboard can be used in any environment (each env may have a different datasource)
- **`$job` template variable** — Filter per service, very useful when troubleshooting a specific target
- **`$__rate_interval`** — A Grafana built-in variable that automatically adjusts the interval based on the scrape interval and resolution

---

## Step 6: Deploy with Terraform

### Context (Why)

This is the moment of truth — we'll apply all the configuration we've built to the Grafana instance. Terraform `apply` will:

1. Create 3 folders (Infrastructure, Application, SLOs)
2. Upload the dashboard JSON to the Infrastructure folder
3. Store the state for future tracking

### Implementation

```bash
cd terraform

# Make sure the API key is set
echo $TF_VAR_grafana_api_key | head -c 10
# Should display some characters (not empty)

# Apply!
terraform apply -var-file=environments/local.tfvars
```

Terraform will display the plan and ask for confirmation:

```
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes
```

Type `yes` and press enter.

### Verification

```bash
# Check Terraform outputs
terraform output

# Verify via Grafana API - folders
curl -s http://localhost:3000/api/folders \
  -H "Authorization: Bearer $TF_VA...key" | jq '.[].title'
# Expected: "Infrastructure", "Application", "SLOs"

# Verify via Grafana API - dashboard
curl -s http://localhost:3000/api/dashboards/uid/infra-overview \
  -H "Authorization: Bearer $TF_VA...key" | jq '.meta.folderTitle'
# Expected: "Infrastructure"
```

Open your browser to the URL shown in the output (typically `http://localhost:3000/d/infra-overview/infrastructure-overview`). The dashboard should display real-time data from Prometheus.

### Explanation

After apply, Terraform creates a `terraform.tfstate` file containing the mapping between resources in code and actual resources in Grafana. This file is **critically important**:

- Don't commit it to Git (already in `.gitignore`)
- In production, store it in a remote backend (S3, GCS, Terraform Cloud)
- Don't edit it manually — let Terraform manage it

State allows Terraform to know that the "Infrastructure" folder it created has a specific ID in Grafana. Without state, Terraform would try to create a new folder on every apply.

---

## Step 7: CI/CD Pipeline

### Context (Why)

With everything working locally, we need an automated pipeline so that dashboard changes can be reviewed and deployed consistently. Our pipeline follows this pattern:

- **Pull Request** → validate + plan (preview changes)
- **Merge to main** → auto-apply to production

This provides a safety net: every change is reviewed by the team before reaching production, and the plan output shows exactly what will change.

### Implementation

```yaml
# .github/workflows/deploy.yaml
name: Deploy Grafana Dashboards

on:
  pull_request:
    branches: [main]
    paths:
      - "terraform/**"
      - "dashboards/**"
  push:
    branches: [main]
    paths:
      - "terraform/**"
      - "dashboards/**"

env:
  TF_VERSION: "1.7.5"
  TF_WORKING_DIR: "./terraform"

jobs:
  validate:
    name: Validate & Plan
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Terraform Format Check
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform fmt -check -recursive

      - name: Terraform Init
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform init -backend=false

      - name: Terraform Validate
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform validate

      - name: Validate Dashboard JSON
        run: |
          for f in dashboards/templates/*.json; do
            echo "Validating $f..."
            python3 -m json.tool "$f" > /dev/null || exit 1
          done
          echo "All dashboard JSON files are valid."

  plan:
    name: Terraform Plan
    runs-on: ubuntu-latest
    needs: validate
    if: github.event_name == 'pull_request'
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Terraform Init
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform init

      - name: Terraform Plan
        working-directory: ${{ env.TF_WORKING_DIR }}
        id: plan
        run: |
          terraform plan \
            -var-file=environments/prod.tfvars \
            -var="grafana_api_key=${{ secrets.GRAFANA_API_KEY }}" \
            -no-color \
            -out=tfplan

      - name: Comment Plan on PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            const output = `#### Terraform Plan 📋
            \`\`\`
            ${{ steps.plan.outputs.stdout }}
            \`\`\`
            *Pushed by: @${{ github.actor }}*`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: output
            });

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: validate
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    environment: production
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: ${{ env.TF_VERSION }}

      - name: Terraform Init
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform init

      - name: Terraform Apply
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: |
          terraform apply \
            -var-file=environments/prod.tfvars \
            -var="grafana_api_key=${{ secrets.GRAFANA_API_KEY }}" \
            -auto-approve

      - name: Output Dashboard URLs
        working-directory: ${{ env.TF_WORKING_DIR }}
        run: terraform output -json
```

### GitHub Setup

Before the pipeline can run, you need to configure:

1. **Repository Secrets:**
   - `GRAFANA_API_KEY` — Service account token for the production Grafana instance
   - `TF_API_TOKEN` — (Optional) If using Terraform Cloud as a backend

2. **Environment Protection:**
   - Create a "production" environment under Settings → Environments
   - Enable "Required reviewers" — add at least 1 reviewer
   - This provides an approval gate before deploying to production

### Verification

After pushing to GitHub, create a PR with a small change:

```bash
git checkout -b test/verify-pipeline
# Make a small edit, for example add a tag to the dashboard
git add .
git commit -m "test: verify CI pipeline"
git push -u origin test/verify-pipeline
```

On GitHub, create a Pull Request. The pipeline will automatically:

1. Validate format and syntax
2. Validate dashboard JSON
3. Post the plan output as a PR comment

### Explanation

Some design decisions:

1. **`paths` filter** — The pipeline only triggers when there are changes in `terraform/` or `dashboards/`. README changes don't need to trigger a deploy.
2. **`-backend=false` in validate** — For the validation job, we don't need to connect to the remote backend. This makes validation faster and doesn't require credentials.
3. **Environment protection** — `environment: production` on the deploy job ensures there's manual approval before applying to production.
4. **Plan as PR comment** — Reviewers can see exactly what will change without having to run Terraform locally.

---

## Step 8: End-to-End Verification

### Complete Workflow

Let's verify the entire workflow from start to finish:

```bash
# 1. Make sure the stack is running
docker compose ps

# 2. Open Grafana
open http://localhost:3000

# 3. Navigate to the Infrastructure folder
# Click the hamburger menu → Dashboards → Infrastructure → Infrastructure Overview

# 4. The dashboard should display:
#    - Target Status: all UP (green)
#    - Scrape Duration: < 1 second
#    - HTTP Request Rate: traffic from Prometheus scraping
#    - Memory Usage: stable upward graph
#    - CPU Usage: low but with activity
#    - Goroutines: stable

# 5. Test idempotency - re-apply should result in no changes
cd terraform
terraform apply -var-file=environments/local.tfvars
# Expected: "No changes. Your infrastructure matches the configuration."

# 6. Test drift detection - modify the dashboard via UI, then apply
# (Open Grafana UI, edit a panel title to "Modified Title", save)
terraform plan -var-file=environments/local.tfvars
# Expected: "1 to change" - Terraform detects the drift!
terraform apply -var-file=environments/local.tfvars
# Dashboard reverts to the state defined in code
```

### Generate Traffic for the Dashboard

To see the HTTP Request Rate panel working, generate some requests to the sample app:

```bash
# Simple load test
for i in $(seq 1 100); do
  curl -s http://localhost:8080/ > /dev/null
  curl -s http://localhost:8080/err > /dev/null 2>&1
  sleep 0.1
done
```

After a few minutes, the HTTP Request Rate panel will display the traffic pattern.

---

## Real-World Considerations

Now that you understand the fundamentals, here are important considerations when implementing Dashboard-as-Code in a real production environment.

### State Management

In production, Terraform state **must** be stored in a remote backend. Some options:

| Backend | Pros | Cons |
|---------|------|------|
| S3 + DynamoDB | Cheap, reliable, native locking | Manual setup |
| Terraform Cloud | Free tier, built-in locking + UI | Vendor lock-in |
| GCS | Reliable, built-in locking | GCP only |

Example S3 backend configuration:

```hcl
backend "s3" {
  bucket         = "mycompany-terraform-state"
  key            = "observability/grafana/terraform.tfstate"
  region         = "ap-southeast-1"
  encrypt        = true
  dynamodb_table = "terraform-locks"
}
```

> **Important:** The state file can contain sensitive data. Always enable encryption (`encrypt = true`) and restrict access to the bucket.

### Secrets Management

Never hardcode API keys in the repository. Recommended options:

1. **Environment Variables** (Development)
   ```bash
   export TF_VAR_grafana_api_key="glsa_xxxx"
   ```

2. **CI/CD Secrets** (GitHub Actions, GitLab CI)
   ```yaml
   -var="grafana_api_key=${{ secrets.GRAFANA_API_KEY }}"
   ```

3. **Secret Manager** (Production)
   ```hcl
   # Terraform data source from AWS Secrets Manager
   data "aws_secretsmanager_secret_version" "grafana" {
     secret_id = "observability/grafana-api-key"
   }

   provider "grafana" {
     auth = data.aws_secretsmanager_secret_version.grafana.secret_string
   }
   ```

### Drift Detection

"Drift" occurs when the state in Grafana differs from what's defined in code. Common causes:

- Someone edits a dashboard via the Grafana UI
- An automated process (provisioning plugin) modifies resources
- A Grafana upgrade changes the schema

How to detect drift:

```bash
# Scheduled check (can be run via cron in CI)
terraform plan -var-file=environments/prod.tfvars -detailed-exitcode
# Exit code 0 = no changes
# Exit code 2 = drift detected!
```

Example cron job in GitHub Actions for drift detection:

```yaml
on:
  schedule:
    - cron: '0 8 * * 1-5'  # Every weekday at 8 AM
```

> **Tip from experience:** Don't auto-fix drift immediately. Notify the team first via Slack/Teams. Sometimes there are legitimate urgent changes made via the UI (during an incident). A good process: detect → notify → discuss → decide (fix or adopt).

### Team Workflow

When working in a team, some important conventions:

1. **Branch naming**: `feat/add-payment-dashboard`, `fix/adjust-cpu-threshold`
2. **PR template** with checklist:
   - [ ] Dashboard JSON valid
   - [ ] Terraform plan reviewed
   - [ ] Tested locally with `docker compose up`
   - [ ] No sensitive data in code
3. **Code owners** for the dashboard directory:
   ```
   # .github/CODEOWNERS
   /dashboards/ @sre-team
   /terraform/  @sre-team @platform-team
   ```
4. **Dashboard UID convention**: `<team>-<service>-<purpose>`
   - `sre-infra-overview`
   - `backend-payment-latency`
   - `platform-k8s-cluster`

### Scaling Tips

When dashboard count grows (50+), some patterns that help:

1. **Modularize Terraform** — Split by team/domain:
   ```
   terraform/
   ├── modules/
   │   ├── sre-dashboards/
   │   ├── backend-dashboards/
   │   └── platform-dashboards/
   └── main.tf
   ```

2. **Dashboard Generation** — For repetitive dashboards (per-service), use templating:
   ```bash
   # Using Jsonnet/Grafonnet
   jsonnet -J vendor service-dashboard.jsonnet \
     --tla-str service=payment > dashboards/templates/payment.json
   ```

3. **Import Existing Dashboards** — If you already have many dashboards in Grafana:
   ```bash
   # Export all dashboards
   for uid in $(curl -s $GRAFANA_URL/api/search | jq -r '.[].uid'); do
     curl -s "$GRAFANA_URL/api/dashboards/uid/$uid" | \
       jq '.dashboard' > "dashboards/templates/${uid}.json"
   done
   
   # Import into Terraform state
   terraform import grafana_dashboard.existing_dashboard "$uid"
   ```

---

## Troubleshooting

### Common Issues

#### 1. "Error: Provider produced inconsistent result"

```
Error: Provider produced inconsistent result after apply
```

**Cause:** Grafana modifies the dashboard JSON after save (adding `version`, `id`, etc.).

**Solution:** Make sure the JSON template doesn't include `id` and `version` fields. Use `lifecycle { ignore_changes = [...] }` if needed:

```hcl
resource "grafana_dashboard" "example" {
  config_json = file("...")
  
  lifecycle {
    ignore_changes = [config_json]  # Be careful, this disables drift detection
  }
}
```

#### 2. "Error: status: 401 Unauthorized"

**Cause:** API key expired or incorrect.

**Solution:**
```bash
# Check if the key is still valid
curl -s http://localhost:3000/api/org \
  -H "Authorization: Bearer $TF_VA...key"

# If 401, create a new key
curl -s -X POST http://localhost:3000/api/auth/keys \
  -H "Content-Type: application/json" \
  -u admin:admin123 \
  -d '{"name":"terraform-new","role":"Admin"}'
```

#### 3. "Error: Folder not found" when deploying dashboard

**Cause:** Dashboard is being deployed before the folder is created.

**Solution:** Make sure the dependency is correct. Terraform should handle this automatically since `grafana_folder.infrastructure.id` is referenced in the dashboard resource. If the error persists, add an explicit dependency:

```hcl
resource "grafana_dashboard" "infrastructure_overview" {
  depends_on = [grafana_folder.infrastructure]
  # ...
}
```

#### 4. Docker Compose: Grafana "datasource not found"

**Cause:** Grafana starts before Prometheus is ready.

**Solution:** Container dependency is already handled in `docker-compose.yaml` with `depends_on`. If the issue persists, restart Grafana:

```bash
docker compose restart grafana
```

#### 5. Dashboard panels showing "No Data"

**Common causes:**
- Prometheus hasn't scraped the target yet (wait 15-30 seconds)
- Datasource misconfigured
- Query syntax error

**Debug steps:**
```bash
# 1. Check if Prometheus has data
curl -s 'http://localhost:9090/api/v1/query?query=up' | jq '.data.result'

# 2. Check the datasource in Grafana
curl -s http://localhost:3000/api/datasources \
  -u admin:admin123 | jq '.[0].url'
# Should be "http://prometheus:9090" (not localhost!)

# 3. Test query via Grafana proxy
curl -s 'http://localhost:3000/api/datasources/proxy/1/api/v1/query?query=up' \
  -u admin:admin123 | jq '.data.result | length'
```

---

## Cleanup

When you're done with this lab:

```bash
# Remove Terraform resources from Grafana
cd terraform
terraform destroy -var-file=environments/local.tfvars

# Stop and remove Docker containers + volumes
cd ..
docker compose down -v

# (Optional) Remove the entire project
cd ..
rm -rf observability-as-code
```

---

## Summary

In this article, we've built a complete Dashboard-as-Code system:

| Component | Tool | Purpose |
|-----------|------|---------|
| Local Stack | Docker Compose | Development environment |
| Metrics | Prometheus | Data source |
| Visualization | Grafana | Dashboard rendering |
| IaC | Terraform + Grafana Provider | Dashboard management |
| CI/CD | GitHub Actions | Automated deployment |

**Key takeaways:**

1. **Dashboard = Code** — Treated the same as application code (versioned, reviewed, tested)
2. **Terraform state** — The single source of truth for the mapping between code and reality
3. **CI/CD pipeline** — A safety net that prevents unreviewed changes from reaching production
4. **Drift detection** — A mechanism to detect changes made outside of Terraform

---

## What's Next: Alerts as Code (Part 2)

In the next article, we'll continue with **Alerts-as-Code** - managing Grafana alerting rules using Terraform. We'll cover:

- Grafana Alerting (Unified Alerting) architecture
- Contact points & notification policies as code
- Alert rules with multi-dimensional queries
- Silence and mute timing management
- Integration with PagerDuty/Slack/OpsGenie
- Testing alerts before deployment (alert simulation)

Stay tuned! Follow this blog or star the repository for update notifications.

---

## Resources

- **Repository:** [github.com/ahakimx/observability-as-code](https://github.com/ahakimx/observability-as-code)
- **Terraform Grafana Provider:** [registry.terraform.io/providers/grafana/grafana](https://registry.terraform.io/providers/grafana/grafana/latest/docs)
- **Grafana Provisioning:** [grafana.com/docs/grafana/latest/administration/provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/)
- **Prometheus Configuration:** [prometheus.io/docs/prometheus/latest/configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
- **Grafonnet (Jsonnet):** [grafana.github.io/grafonnet/](https://grafana.github.io/grafonnet/)

---

*This article is part of the **Observability as Code** series on [ahakimx.id](https://ahakimx.id). This series covers how to apply Infrastructure-as-Code principles to the entire observability stack: dashboards, alerts, SLOs, and monitoring configuration.*
