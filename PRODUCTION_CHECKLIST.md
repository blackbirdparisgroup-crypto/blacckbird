# 📋 Production Deployment Checklist

## ✅ Pre-Deployment (24 hours before)

### Code Quality
- [ ] All tests passing (100% green CI)
- [ ] Code coverage >= 80%
- [ ] No lint warnings
- [ ] No TypeScript errors
- [ ] All dependencies up-to-date
- [ ] Security audit clean (npm audit)

### Documentation
- [ ] README updated
- [ ] API documentation complete
- [ ] Database migrations documented
- [ ] Deployment guide up-to-date
- [ ] CHANGELOG updated

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables configured
- [ ] OWASP Top 10 review done
- [ ] SQL injection tests pass
- [ ] XSS prevention verified
- [ ] CORS properly configured
- [ ] JWT/Auth configured
- [ ] Rate limiting enabled

### Performance
- [ ] Load testing completed (1000+ req/s)
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] CDN configured
- [ ] Bundle size < 5MB
- [ ] Response time < 500ms (p95)

### Infrastructure
- [ ] Docker image builds successfully
- [ ] docker-compose.prod.yml tested
- [ ] Health checks configured
- [ ] Monitoring/logging setup
- [ ] Backup strategy in place
- [ ] Disaster recovery plan ready

---

## ✅ Staging Deployment (test in staging first)

### Deployment
- [ ] Pull latest code
- [ ] Run migrations: `npm run migrate`
- [ ] Build Docker image: `docker build -t blackbird:latest .`
- [ ] Deploy to staging: `docker-compose -f docker-compose.prod.yml up -d`
- [ ] Verify all services running: `docker ps`

### Validation
- [ ] Health check passes: `curl https://staging.blackbird.example.com/health`
- [ ] API endpoints responding
- [ ] Database connected
- [ ] Authentication working
- [ ] File uploads working
- [ ] Email notifications working
- [ ] Error logging working

### Testing in Staging
- [ ] Smoke tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Performance tests pass
- [ ] Load test (500 req/s)
- [ ] Security scan (OWASP)

### Monitoring
- [ ] Error rate < 0.1%
- [ ] Response time < 500ms (p95)
- [ ] Database query performance good
- [ ] Memory usage stable
- [ ] CPU usage normal
- [ ] No memory leaks detected

---

## ✅ Production Deployment (during maintenance window)

### Pre-Deployment Window
- [ ] Notify users of maintenance
- [ ] Enable maintenance mode
- [ ] Backup database: `pg_dump > backup.sql`
- [ ] Backup config files
- [ ] Create recovery point

### Deployment
- [ ] Pull latest code from main
- [ ] Run pre-deployment checks
- [ ] Build Docker image
- [ ] Stop old containers (with grace period)
- [ ] Start new containers
- [ ] Run database migrations
- [ ] Verify all services healthy

### Post-Deployment Validation
- [ ] Health check passes
- [ ] All APIs responding
- [ ] Authentication working
- [ ] User flows working end-to-end
- [ ] Error rate normal
- [ ] Performance metrics normal
- [ ] Database integrity verified
- [ ] Logs showing normal activity

### Monitoring (First Hour)
- [ ] Monitor error logs closely
- [ ] Monitor performance metrics
- [ ] Monitor resource usage
- [ ] Check for any exceptions
- [ ] Verify user traffic normal
- [ ] Verify database performance

### Communication
- [ ] Notify team of deployment
- [ ] Enable monitoring alerts
- [ ] Disable maintenance mode
- [ ] Update status page
- [ ] Send user notification (if needed)

---

## ✅ Post-Deployment (Next 24 hours)

### Monitoring
- [ ] Error rate stable (< 0.1%)
- [ ] Performance stable
- [ ] No memory leaks
- [ ] Database replication healthy
- [ ] Backups running successfully
- [ ] Alerts configured correctly

### Verification
- [ ] User reports: no major issues
- [ ] Analytics showing normal traffic
- [ ] Revenue/business metrics normal
- [ ] Third-party integrations working
- [ ] Email deliverability good

### Documentation
- [ ] Update deployment log
- [ ] Document any issues/resolutions
- [ ] Update runbooks if needed
- [ ] Document configuration changes

---

## 🆘 Rollback Plan (if issues detected)

```bash
# 1. Stop current containers
docker-compose down

# 2. Restore from backup
psql -U blackbird_user -d blackbird_prod < backup.sql

# 3. Start previous version
docker-compose up -d

# 4. Verify
curl -f https://blackbird.example.com/health

# 5. Notify team
# Alert: rollback completed, investigating issue
```

### Rollback Triggers
- Error rate > 1%
- Response time > 2s (p95)
- Database connection errors
- Authentication failures > 5%
- Memory leak detected
- Critical security issue

---

## 📊 Production Metrics to Monitor

```
Performance:
  - Response Time (p50/p95/p99)
  - Error Rate
  - Throughput (req/s)
  - Database Query Time

Resources:
  - CPU Usage
  - Memory Usage
  - Disk I/O
  - Network I/O

Business:
  - Active Users
  - Transactions/s
  - Revenue Impact
  - User Satisfaction

Security:
  - Failed Login Attempts
  - Rate Limit Hits
  - Suspicious IPs
  - Error Rate by Type
```

---

## 🔗 Important URLs

- **Production**: https://blackbird.example.com
- **Staging**: https://staging.blackbird.example.com
- **Health Check**: https://blackbird.example.com/health
- **Monitoring Dashboard**: https://monitoring.example.com
- **Error Tracking**: https://sentry.example.com/blackbird
- **Analytics**: https://analytics.example.com

---

## 📞 Emergency Contacts

- **DevOps Lead**: [contact info]
- **On-Call Engineer**: [rotation schedule]
- **Product Manager**: [contact info]
- **Security Team**: [contact info]

---

**Last Updated**: 2026-09-05  
**Status**: ✅ Ready for Production
