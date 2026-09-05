#!/bin/bash

# 🔧 Production Environment Setup
# Run this on the production server once

set -e

echo "🔧 Setting up production environment..."

# Create directories
mkdir -p /app
mkdir -p /backups
mkdir -p /var/log/blackbird
mkdir -p /etc/blackbird/certs

# Create deploy user
if ! id -u deploy > /dev/null 2>&1; then
    useradd -m -s /bin/bash deploy
    echo "✅ Created deploy user"
else
    echo "ℹ️  Deploy user already exists"
fi

# Setup SSH keys (must be done manually)
echo "⚠️  SSH Setup (manual):"
echo "1. Generate SSH key: ssh-keygen -t ed25519 -f ~/.ssh/id_deploy"
echo "2. Copy public key to .ssh/authorized_keys"
echo "3. Set permissions: chmod 600 ~/.ssh/authorized_keys"

# Install Docker & Docker Compose
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker deploy
    rm get-docker.sh
    echo "✅ Docker installed"
else
    echo "ℹ️  Docker already installed"
fi

if ! command -v docker-compose &> /dev/null; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed"
else
    echo "ℹ️  Docker Compose already installed"
fi

# Setup SSL certificates (Let's Encrypt)
echo "🔒 SSL Certificate Setup:"
echo "1. Install certbot: sudo apt-get install certbot"
echo "2. Generate certificate: sudo certbot certonly --standalone -d blackbird.example.com"
echo "3. Configure renewal: sudo systemctl enable certbot.timer"

# Setup firewall
echo "🔥 Firewall Setup:"
if command -v ufw &> /dev/null; then
    sudo ufw default deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    sudo ufw enable
    echo "✅ UFW firewall configured"
fi

# Setup log rotation
sudo tee /etc/logrotate.d/blackbird > /dev/null <<EOF
/var/log/blackbird/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        docker-compose -f /app/docker-compose.prod.yml restart app
    endscript
}
EOF
echo "✅ Log rotation configured"

# Setup systemd service
sudo tee /etc/systemd/system/blackbird.service > /dev/null <<EOF
[Unit]
Description=Blackbird Application
After=docker.service
Requires=docker.service

[Service]
Type=forking
User=deploy
WorkingDirectory=/app
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload
sudo systemctl enable blackbird.service
echo "✅ Systemd service configured"

# Setup monitoring (if available)
echo "📊 Monitoring Setup (optional):"
echo "1. Setup Prometheus for metrics"
echo "2. Setup Grafana for dashboards"
echo "3. Setup ELK Stack for logging"
echo "4. Configure Sentry for error tracking"

# Verify setup
echo ""
echo "✅ Production environment setup complete!"
echo ""
echo "📋 Remaining manual steps:"
echo "1. Configure SSL certificates"
echo "2. Setup backup schedule"
echo "3. Configure monitoring"
echo "4. Setup database replication (if needed)"
echo "5. Configure CDN"
echo "6. Setup load balancing"
echo ""
echo "🚀 Ready for first deployment!"
