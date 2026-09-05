#!/bin/bash

# 🚀 Production Deployment Script
# Usage: ./scripts/deploy.sh [staging|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-staging}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
APP_DIR="/app"
BACKUP_DIR="/backups"

log_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Pre-deployment checks
pre_deploy_checks() {
    log_info "Running pre-deployment checks..."

    # Check git status
    if ! git diff-index --quiet HEAD --; then
        log_error "Uncommitted changes detected. Please commit first."
        exit 1
    fi

    # Check tests
    if ! npm test; then
        log_error "Tests failed. Fix them before deploying."
        exit 1
    fi

    # Check coverage
    if [ -f coverage/coverage-summary.json ]; then
        coverage=$(grep -o '"lines":{[^}]*"pct":[0-9.]*' coverage/coverage-summary.json | head -1 | grep -o '[0-9.]*$')
        if (( $(echo "$coverage < 80" | bc -l) )); then
            log_warn "Coverage below 80%: $coverage%"
        fi
    fi

    log_info "✅ Pre-deployment checks passed"
}

# Build Docker image
build_docker() {
    log_info "Building Docker image..."

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    IMAGE_TAG="blackbird:$ENVIRONMENT-$TIMESTAMP"

    docker build \
        -t "$IMAGE_TAG" \
        -t "blackbird:$ENVIRONMENT-latest" \
        -f Dockerfile \
        .

    if [ $? -eq 0 ]; then
        log_info "✅ Docker image built: $IMAGE_TAG"
    else
        log_error "Docker build failed"
        exit 1
    fi
}

# Backup database
backup_database() {
    log_info "Backing up database..."

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/blackbird-$ENVIRONMENT-$TIMESTAMP.sql"

    mkdir -p "$BACKUP_DIR"

    if [ "$ENVIRONMENT" = "production" ]; then
        ssh -i ~/.ssh/deploy_key "$DEPLOY_USER@$PROD_HOST" \
            "pg_dump -U \$DB_USER -d \$DB_NAME > $BACKUP_FILE"
        log_info "✅ Database backed up to $BACKUP_FILE"
    else
        docker-compose exec -T postgres pg_dump \
            -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_FILE"
        log_info "✅ Database backed up to $BACKUP_FILE"
    fi
}

# Deploy with docker-compose
deploy() {
    log_info "Deploying to $ENVIRONMENT..."

    if [ "$ENVIRONMENT" = "production" ]; then
        log_warn "⚠️  PRODUCTION DEPLOYMENT - This is permanent!"
        read -p "Type 'DEPLOY' to confirm: " confirm
        if [ "$confirm" != "DEPLOY" ]; then
            log_error "Deployment cancelled"
            exit 1
        fi

        # Production deployment via SSH
        ssh -i ~/.ssh/deploy_key "$DEPLOY_USER@$PROD_HOST" <<EOF
            set -e
            cd $APP_DIR

            # Pull latest
            git pull origin main

            # Build & deploy
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d

            # Run migrations
            docker-compose exec -T app npm run migrate

            echo "✅ Production deployment complete"
EOF
    else
        # Staging deployment locally
        docker-compose -f docker-compose.prod.yml pull
        docker-compose -f docker-compose.prod.yml up -d

        # Wait for services
        sleep 5

        # Run migrations
        docker-compose exec -T app npm run migrate || true

        log_info "✅ Staging deployment complete"
    fi
}

# Health check
health_check() {
    log_info "Running health checks..."

    if [ "$ENVIRONMENT" = "production" ]; then
        URL="https://blackbird.example.com/health"
    else
        URL="http://localhost:3000/health"
    fi

    max_attempts=10
    attempt=1

    while [ $attempt -le $max_attempts ]; do
        log_info "Health check attempt $attempt/$max_attempts..."

        if curl -f -s "$URL" > /dev/null 2>&1; then
            log_info "✅ Health check passed"
            return 0
        fi

        sleep 5
        ((attempt++))
    done

    log_error "Health check failed after $max_attempts attempts"
    exit 1
}

# Smoke tests
smoke_tests() {
    log_info "Running smoke tests..."

    # Test API endpoints
    if curl -f -s http://localhost:3000/api/health > /dev/null; then
        log_info "✅ API health endpoint responding"
    else
        log_error "API health endpoint failed"
        exit 1
    fi

    log_info "✅ Smoke tests passed"
}

# Rollback function
rollback() {
    log_error "Deployment failed. Rolling back..."

    if [ "$ENVIRONMENT" = "production" ]; then
        ssh -i ~/.ssh/deploy_key "$DEPLOY_USER@$PROD_HOST" \
            "cd $APP_DIR && docker-compose down && docker-compose up -d"
    else
        docker-compose down
        docker-compose up -d
    fi

    log_info "✅ Rollback complete"
    exit 1
}

# Main execution
main() {
    log_info "🚀 Starting $ENVIRONMENT deployment..."

    pre_deploy_checks || rollback
    backup_database || rollback
    build_docker || rollback
    deploy || rollback
    health_check || rollback
    smoke_tests || rollback

    log_info "✅ $ENVIRONMENT deployment successful!"
    log_info "📊 URL: https://blackbird.example.com"
    log_info "📊 Health: https://blackbird.example.com/health"
}

# Trap errors
trap 'rollback' ERR

# Run main
main
