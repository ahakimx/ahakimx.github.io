---
layout: post
title: 'DevOps Homelab #1 - Install GitLab Server & Runner'
date: 2026-07-22T10:31
description: Install GitLab CE and GitLab Runner using Docker Compose on Ubuntu Server. Part one of building a complete CI/CD pipeline on-premise from scratch.
categories:
  - devops, gitlab,ci/cd
tags:
  - devops, gitlab, ci/cd
image:
  path: https://picsum.photos/id/444/1920/1280.webp
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

## Prerequisites

- docker
- docker compose
- virtual machine linux ubuntu 24.04

![](/uploads/gitlab-server-runner-setup.png)

## A. Install Gitlab Server

### Step 1: Prepare Environment

Explanation: We need to prepare directories for GitLab data storage and ensure the system is ready.

Commands:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Create GitLab home directory
sudo mkdir -p /srv/gitlab/{config,logs,data}

# Set environment variable
export GITLAB_HOME=/srv/gitlab
echo "export GITLAB_HOME=/srv/gitlab" >> ~/.bashrc

# Verify Docker is running
docker --version
docker compose version
```

Expected Output:

```bash
Docker version 24.0.x, build xxxxx
Docker Compose version v2.x.x
```

### Step 2: Create Docker Compose File

Explanation: The Docker Compose file defines how the GitLab container will be configured and run.

Command:

```bash
# Create gitlab-server directory
mkdir -p ~/gitlab-server && cd ~/gitlab-server
```

Create docker-compose.yml:

```yaml
services:
  gitlab:
    image: gitlab/gitlab-ce:18.11.7-ce.0
    container_name: gitlab
    restart: always
    hostname: 'gitlab.local'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        # External URL - replace with your server IP/domain
        external_url 'http://YOUR_SERVER_IP'
        
        # SSH port
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        
        # Timezone
        gitlab_rails['time_zone'] = 'Asia/Jakarta'
        
        # Disable built-in registry (we use Harbor)
        registry['enable'] = false
        
        # Disable strict origin check (required for GitLab 18.x)
        gitlab_rails['action_controller_forgery_protection_origin_check'] = false
        
        # Performance tuning for 8GB RAM
        puma['worker_processes'] = 2
        sidekiq['max_concurrency'] = 10
        postgresql['shared_buffers'] = "256MB"
        
        # Prometheus monitoring
        prometheus_monitoring['enable'] = true
        
    ports:
      - '80:80'
      - '443:443'
      - '2222:22'
    volumes:
      - '/srv/gitlab/config:/etc/gitlab'
      - '/srv/gitlab/logs:/var/log/gitlab'
      - '/srv/gitlab/data:/var/opt/gitlab'
    shm_size: '256m'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/-/health"]
      interval: 60s
      timeout: 30s
      retries: 5
      start_period: 300s
```

> Replace YOUR_SERVER_IP with your actual server IP address!
{: .prompt-warning }

### Step 3: Start GitLab

Explanation: Start the GitLab container. The first-time initialization takes approximately 5-10 minutes.

Command:

```bash
# Start GitLab
docker compose up -d

# Watch logs
docker logs -f gitlab
```

Expected Output:

```bash
Creating network "gitlab-server_default" with the default driver
Creating gitlab ... done
```

Verification:

```bash
# Check container status
docker ps

# Wait for GitLab to be ready (check health)
docker inspect gitlab --format='{{.State.Health.Status}}'
```

Expected Output:

```bash
CONTAINER ID   IMAGE                          STATUS                    PORTS
xxxxxxxxxxxx   gitlab/gitlab-ce:18.11.7-ce.0   Up X minutes (healthy)    0.0.0.0:80->80/tcp...
```

### Step 4: Wait for GitLab Initialization

Explanation: GitLab requires time for initialization. We need to wait until all services are ready.

Command:

```bash
# Check GitLab status
docker exec gitlab gitlab-ctl status
```

Expected Output (when ready):

```bash
run: alertmanager: (pid 1234) 300s; run: log: (pid 1235) 300s
run: gitaly: (pid 1236) 300s; run: log: (pid 1237) 300s
run: gitlab-exporter: (pid 1238) 300s; run: log: (pid 1239) 300s
run: gitlab-workhorse: (pid 1240) 300s; run: log: (pid 1241) 300s
run: logrotate: (pid 1242) 300s; run: log: (pid 1243) 300s
run: nginx: (pid 1244) 300s; run: log: (pid 1245) 300s
run: postgres-exporter: (pid 1246) 300s; run: log: (pid 1247) 300s
run: postgresql: (pid 1248) 300s; run: log: (pid 1249) 300s
run: prometheus: (pid 1250) 300s; run: log: (pid 1251) 300s
run: puma: (pid 1252) 300s; run: log: (pid 1253) 300s
run: redis: (pid 1254) 300s; run: log: (pid 1255) 300s
run: redis-exporter: (pid 1256) 300s; run: log: (pid 1257) 300s
run: sidekiq: (pid 1258) 300s; run: log: (pid 1259) 300s
run: sshd: (pid 1260) 300s; run: log: (pid 1261) 300s
```

### Step 5: Get Initial Root Password

Explanation: GitLab automatically generates a root password during the first run.

Command:

```bash
# Get initial root password
docker exec gitlab grep 'Password:' /etc/gitlab/initial_root_password
```

Expected Output:

```bash
Password: xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> Important:
> Save this password immediately!.
> The password file is automatically deleted after 24 hours. 
> Change the password right after your first login
{: .prompt-warning }

### Step 6: Access GitLab Web Interface

Explanation: Access GitLab through your browser.

Steps:

    Open your browser
    Navigate to http://YOUR_SERVER_IP
    Log in with:
        Username: root
        Password: (from Step 5)

Expected Result:

img

### Step 7: Verify Installation

Explanation: Ensure all GitLab components are running properly.

Commands:

```bash
# Run GitLab check
docker exec gitlab gitlab-rake gitlab:check SANITIZE=true

# Check environment info
docker exec gitlab gitlab-rake gitlab:env:info
```

Expected Output:

```bash
Checking GitLab subtasks ...

Checking GitLab Shell ...
GitLab Shell: ... GitLab Shell version >= 14.x.x ? ... yes
Running /opt/gitlab/embedded/service/gitlab-shell/bin/check
Internal API available: OK
...

Checking Gitaly ...
Gitaly: ... default ... OK

Checking Sidekiq ...
Sidekiq: ... Running? ... yes
...

Checking GitLab App ...
Git configured correctly? ... yes
Database config exists? ... yes
...

Checking GitLab subtasks ... Finished
```

## B. SSL Configuration

Use this option for development or internal networks.

### Step 1: Create SSL Directory

```bash
# Create SSL directory
sudo mkdir -p /srv/gitlab/config/ssl
cd /srv/gitlab/config/ssl
```

### Step 2: Generate Self-Signed Certificate

Explanation: We will create a certificate valid for 365 days with Subject Alternative Names (SANs). Modern browsers require SANs for certificate validation.

Command:

```bash
# Generate private key and certificate with SANs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout gitlab.key \
  -out gitlab.crt \
  -subj "/C=ID/ST=Jakarta/L=Jakarta/O=Company/OU=IT/CN=gitlab.local" \
  -addext "subjectAltName=DNS:gitlab.local,IP:YOUR_SERVER_IP"
```

```bash
# Set proper permissions
sudo chmod 600 gitlab.key
sudo chmod 644 gitlab.crt
```

> Replace YOUR_SERVER_IP with your actual server IP address (e.g., IP:192.168.1.100).
{: .prompt-info }

Expected Output:

```bash
Generating a RSA private key
...+++++
...+++++
writing new private key to 'gitlab.key'
```

### Step 3: Update GitLab Configuration

Explanation: Update docker-compose.yml to use HTTPS.

Edit docker-compose.yml:

```yaml
services:
  gitlab:
    image: gitlab/gitlab-ce:18.11.7-ce.0
    container_name: gitlab
    restart: always
    hostname: 'gitlab.local'
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        # HTTPS URL
        external_url 'https://gitlab.local'
        
        # SSL Configuration
        nginx['redirect_http_to_https'] = true
        nginx['ssl_certificate'] = "/etc/gitlab/ssl/gitlab.crt"
        nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/gitlab.key"
        
        # SSH port
        gitlab_rails['gitlab_shell_ssh_port'] = 2222
        
        # Timezone
        gitlab_rails['time_zone'] = 'Asia/Jakarta'
        
        # Disable built-in registry
        registry['enable'] = false
        
        # Disable strict origin check (required for GitLab 18.x)
        gitlab_rails['action_controller_forgery_protection_origin_check'] = false
        
        # Performance tuning
        puma['worker_processes'] = 2
        sidekiq['max_concurrency'] = 10
        
    ports:
      - '80:80'
      - '443:443'
      - '2222:22'
    volumes:
      - '/srv/gitlab/config:/etc/gitlab'
      - '/srv/gitlab/logs:/var/log/gitlab'
      - '/srv/gitlab/data:/var/opt/gitlab'
    shm_size: '256m'
```

### Step 4: Restart GitLab

```bash
# Restart GitLab
docker compose down
docker compose up -d

# Wait for reconfiguration
docker logs -f gitlab
```

## Step 5: Verify HTTPS

```bash
# Test HTTPS (ignore certificate warning for self-signed)
curl -k https://gitlab.local

# Or access via browser
# https://gitlab.local (accept certificate warning)
# Make sure gitlab.local is in your /etc/hosts
```

## C. Initial Setup

### Step 1: Change Root Password

Explanation: The auto-generated root password must be changed immediately.

Via Web UI:

1. Log in to GitLab as root
2. Click avatar in the top right → Edit profile
3. In the left sidebar, click Password
4. Enter:

- Current password: (initial password)
- New password: (a strong new password)
- Password confirmation: (repeat new password)

5. Click Save password

Via Rails Console:

```bash
# Access Rails console
docker exec -it gitlab gitlab-rails console

# Change root password
user = User.find_by(username: 'root')
user.password = 'NewSecurePassword123!'
user.password_confirmation = 'NewSecurePassword123!'
user.save!
exit
```

> Replace `NewSecurePassword123!` with your own strong password.
{: .prompt-warning }

### Step 2: Create Admin User

Explanation: Best practice: don't use root for daily operations. Create a separate admin user.

Via Web UI:

1. Log in as root
2. Go to Admin Area (wrench icon)
3. Click Users → New user
4. Fill in:

    - Name: Admin User
    - Username: admin
    - Email: admin@company.com
    - Access level: Admin

5. Click Create user
6. Click Edit → Set password

Via Rails Console:

```bash
docker exec -it gitlab gitlab-rails console

# Create admin user
admin = User.new(
  username: 'admin',
  email: 'admin@company.com',
  name: 'Admin User',
  password: 'SecureAdminPass123!',
  password_confirmation: 'SecureAdminPass123!',
  admin: true
)
admin.skip_confirmation!
admin.save!
exit
```

### Step 3: Disable Sign-Up

Explanation: For on-premises deployments, public sign-up should be disabled.

Via Web UI:

1. Go to Admin Area → Settings → General
2. Expand Sign-up restrictions
3. Uncheck Sign-up enabled
4. Click Save changes

Via gitlab.rb (in docker-compose.yml):

Add to GITLAB_OMNIBUS_CONFIG:

```bash
# Disable sign-up
gitlab_rails['gitlab_signup_enabled'] = false
```

Then reconfigure:

```bash
docker compose down
docker compose up -d
```

### Step 4: Configure Password Policy

Via Web UI:

1. Go to Admin Area → Settings → General
2. Expand Sign-in restrictions
3. Set:

    - Minimum password length: 12
    - Require numbers: 
    - Require uppercase: 
    - Require lowercase: 
    - Require symbols: 

4. Click Save changes

### Step 5: Enable Two-Factor Authentication (2FA)

For Individual User:

1. Log in to GitLab
2. Click avatar → Edit profile
3. Click Account in the sidebar
4. Click Enable Two-factor Authentication
5. Scan QR code with an authenticator app (Google Authenticator, Authy, etc.)
6. Enter verification code
7. Save recovery codes!

Enforce 2FA for All Users:

1. Go to Admin Area → Settings → General
2. Expand Sign-in restrictions
3. Check Require all users to set up two-factor authentication
4. Set grace period (e.g., 3 days)
5. Click Save changes

### Step 6: Configure Session Settings

Via Web UI:

1. Go to Admin Area → Settings → General
2. Expand Sign-in restrictions
3. Set:

- Session duration: 10080 (7 days in minutes)
- Or shorter for higher security: 1440 (24 hours)

4. Click Save changes

### Step 7: Configure Visibility Settings

Explanation: Set default visibility for new projects.

Via Web UI:

1. Go to Admin Area → Settings → General
2. Expand Visibility and access controls
3. Set:

- Default project visibility: Private
- Default snippet visibility: Private
- Default group visibility: Private
- Restricted visibility levels: Check Public (disable public projects)

4. Click Save changes

### Step 8: Configure Rate Limiting

Via Web UI (recommended for GitLab 18.x):

1. Go to Admin Area → Settings → Network
2. Expand User and IP rate limits
3. Set:

    - Unauthenticated API requests per period: 3600
    - Authenticated API requests per period: 7200
    - Period in seconds: 60

4. Click Save changes

Via gitlab.rb (in docker-compose.yml):

Add to GITLAB_OMNIBUS_CONFIG:

```bash
# Rate limiting
gitlab_rails['rate_limiting_response_text'] = "Too many requests. Please try again later."
```

Then reconfigure:

```bash
docker compose down
docker compose up -d
```

### Step 9: Create Initial Groups and Projects

Create Group:

1. Click Groups → New group
2. Fill in:

- Group name: engineering
- Group URL: engineering
- Visibility: Private

3. Click Create group

Create Subgroups:

```bash
engineering/
├── backend/
├── frontend/
└── devops/
```

Create Test Project:

1. Go to group engineering/devops
2. Click New project
3. Select Create blank project
4. Fill in:

- Project name: ci-cd-templates
- Visibility: Private

5. Click Create project

### Step 10: Configure Protected Branches

For the test project:

1. Go to project → Settings → Repository
2. Expand Protected branches
3. Add protection for main:

    - Branch: main
    - Allowed to merge: Maintainers
    - Allowed to push: No one

4. Click Protect

### Step 11: Verify Security Settings

Run Security Check:

```bash
# Check GitLab configuration
docker exec gitlab gitlab-rake gitlab:check SANITIZE=true
```

Verify Settings via API:

```bash
# Get current settings (requires admin token)
curl -k --header "PRIVATE-TOKEN: <your-token>" \
"https://gitlab.local/api/v4/application/settings" | jq .
```

## D. Install Runner
### Step 1: Update System

Explanation: Before installation, make sure the system is up-to-date to avoid dependency issues.

Command:
```bash
sudo apt update && sudo apt upgrade -y
```
Expected Output:
```bash
Reading package lists... Done
Building dependency tree... Done
...
0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
```
Verification:
```bash
cat /etc/os-release | grep VERSION
```
Expected:
```bash
VERSION="22.04.3 LTS (Jammy Jellyfish)"
VERSION_ID="22.04"
```
### Step 2: Install Dependencies

GitLab Runner requires several dependencies to run properly.

Command:
```bash
sudo apt install -y curl git ca-certificates gnupg lsb-release
```
Expected Output:
```bash
Reading package lists... Done
Building dependency tree... Done
...
Setting up curl (7.81.0-1ubuntu1.x) ...
```

Verification:
```bash
curl --version | head -1
git --version
```

Expected:
```bash
curl 7.81.0 (x86_64-pc-linux-gnu)
git version 2.34.1
```

### Step 3: Add GitLab Runner Repository
We will add the official GitLab Runner repository to get the latest version.

Command:
```bash
# Download and run the repository script
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
```

Expected Output:
```bash
Detected operating system as Ubuntu/jammy.
Checking for curl...
Detected curl...
...
The repository is setup! You can now install packages.
```

Verification:
```bash
# Check repository has been added
cat /etc/apt/sources.list.d/runner_gitlab-runner.list
```

Expected:
```bash
deb https://packages.gitlab.com/runner/gitlab-runner/ubuntu/ jammy main
deb-src https://packages.gitlab.com/runner/gitlab-runner/ubuntu/ jammy main
```

### Step 4: Install GitLab Runner

Explanation: Now we install GitLab Runner from the repository we just added.

Command:
```bash
sudo apt update
sudo apt install -y gitlab-runner
```

Expected Output:
```bash
Reading package lists... Done
...
Setting up gitlab-runner (18.x.x) ...
...
GitLab Runner installed successfully!
```

Verification:
```bash
gitlab-runner --version
```

Expected:
```bash
Version:      18.x.x
Git revision: xxxxxxxx
Git branch:   18-x-stable
GO version:   go1.23.x
Built:        2026-xx-xxTxx:xx:xxZ
OS/Arch:      linux/amd64
```

### Step 5: Verify Service Status

Explanation: GitLab Runner runs as a systemd service. Make sure the service is running.

Command:
```bash
sudo systemctl status gitlab-runner
```

Expected Output:
```bash
● gitlab-runner.service - GitLab Runner
     Loaded: loaded (/etc/systemd/system/gitlab-runner.service; enabled; vendor preset: enabled)
     Active: active (running) since Mon 2026-xx-xx xx:xx:xx UTC; 1min ago
   Main PID: xxxx (gitlab-runner)
      Tasks: 8 (limit: 4915)
     Memory: 20.0M
        CPU: 100ms
     CGroup: /system.slice/gitlab-runner.service
             └─xxxx /usr/bin/gitlab-runner run --working-directory /home/gitlab-runner --config /etc/gitlab-runner/config.toml
```

Verification:
```bash
# Check service enabled on boot
sudo systemctl is-enabled gitlab-runner
```
Expected:
```
enabled
```

### Step 6: Add gitlab-runner to Docker Group

Explanation: For the Runner to use the Docker executor, the gitlab-runner user needs access to the Docker daemon.

Command:
```
sudo usermod -aG docker gitlab-runner
```

Verification:
```bash
# Check group membership
groups gitlab-runner
```
Expected:
```bash
gitlab-runner : gitlab-runner docker
```
Restart Service:
```bash
sudo systemctl restart gitlab-runner
```
### Step 7: Verify Docker Access

Explanation: Make sure the gitlab-runner user can run Docker commands.

Command:
```bash
sudo -u gitlab-runner docker ps
```
Expected Output:
```bash
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

> If you get a "permission denied" error, restart the server or logout/login.
{: .prompt-info }

### Step 8: Check Directory Structure

Explanation: Understand the GitLab Runner directory structure for troubleshooting.

Command:
```bash
# Config directory
ls -la /etc/gitlab-runner/

# Home directory
ls -la /home/gitlab-runner/

# Builds directory (will be created when the first job runs)
ls -la /home/gitlab-runner/builds/ 2>/dev/null || echo "Builds directory does not exist yet"
```
Expected Output:
```bash
# /etc/gitlab-runner/
total 12
drwxr-xr-x   2 root root 4096 xxx xx xx:xx .
drwxr-xr-x 100 root root 4096 xxx xx xx:xx ..
-rw-------   1 root root    0 xxx xx xx:xx config.toml

# /home/gitlab-runner/
total 20
drwxr-xr-x 2 gitlab-runner gitlab-runner 4096 xxx xx xx:xx .
drwxr-xr-x 4 root          root          4096 xxx xx xx:xx ..
-rw-r--r-- 1 gitlab-runner gitlab-runner  220 xxx xx xx:xx .bash_logout
-rw-r--r-- 1 gitlab-runner gitlab-runner 3771 xxx xx xx:xx .bashrc
-rw-r--r-- 1 gitlab-runner gitlab-runner  807 xxx xx xx:xx .profile
```
