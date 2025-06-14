# Neural Web Labs Deployment Guide

## Prerequisites

### Environment Requirements
- Node.js 18 or higher
- PostgreSQL database (Neon recommended)
- Git for version control

### Required Environment Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your-secure-session-secret-minimum-32-characters
NODE_ENV=production
```

### Optional Environment Variables
```env
COINBASE_API_KEY=your-coinbase-api-key
COINBASE_SECRET=your-coinbase-secret
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
```

## Local Development Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd neural-web-labs
npm install
```

### 2. Database Setup
```bash
# Push schema to database
npm run db:push

# Verify database connection
npm run test:db
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Replit Deployment

### 1. Environment Configuration
Set the following secrets in Replit:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `SESSION_SECRET`: Generate using `openssl rand -base64 32`

### 2. Database Migration
Run the following in Replit Shell:
```bash
npm run db:push
```

### 3. Deploy
Click the "Deploy" button in Replit to create an autoscale deployment.

## Production Deployment

### 1. Build Application
```bash
npm run build
```

### 2. Database Preparation
```bash
# Run migrations
npm run db:push

# Seed initial data (if needed)
npm run db:seed
```

### 3. Start Production Server
```bash
npm start
```

## Database Schema

### Core Tables
The platform uses the following main tables:

#### users
- User authentication and profiles
- Session management
- Role-based access control

#### ai_operators
- 6 specialized AI agents
- Performance metrics
- Task tracking

#### projects
- Client project management
- Progress tracking
- AI operator assignments

#### sessions
- Secure session storage
- Automatic cleanup

### Database Maintenance

#### Backup
```bash
pg_dump $DATABASE_URL > neural_backup_$(date +%Y%m%d).sql
```

#### Restore
```bash
psql $DATABASE_URL < neural_backup_20250613.sql
```

#### Clean Duplicate Data
```sql
-- Remove duplicate AI operators (if any)
DELETE FROM ai_operators 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM ai_operators 
  GROUP BY name
);

-- Add unique constraint
ALTER TABLE ai_operators 
ADD CONSTRAINT unique_operator_name UNIQUE (name);
```

## Performance Optimization

### Database Optimization
- Connection pooling configured for Neon serverless
- Indexes on frequently queried columns
- Automatic session cleanup

### Frontend Optimization
- Vite build optimization
- Code splitting by routes
- Asset compression

### Server Optimization
- Express.js with compression middleware
- Static asset caching
- Session store optimization

## Monitoring and Health Checks

### Health Check Endpoint
```bash
curl https://your-domain.replit.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-06-13T23:45:30.000Z"
}
```

### System Monitoring
Monitor these key metrics:
- Neural efficiency (target: >90%)
- Response time (target: <100ms)
- Database connections
- Session count
- AI operator performance

### Log Monitoring
Key log locations:
- Application logs: Console output
- Database logs: Neon dashboard
- Error logs: Browser console for frontend issues

## Security Configuration

### Session Security
- Secure cookies in production
- HttpOnly flag enabled
- SameSite protection
- 7-day session expiration

### Database Security
- Connection string encryption
- Environment variable protection
- SQL injection prevention via Drizzle ORM

### API Security
- Rate limiting configured
- Input validation
- Session-based authentication

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection
npm run test:db
```

#### Session Not Persisting
- Verify SESSION_SECRET is set
- Check cookie settings in browser
- Ensure HTTPS in production

#### AI Operators Not Loading
```bash
# Check database seeding
curl https://your-domain.replit.app/api/ai-operators

# Re-seed if empty
npm run db:seed
```

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 401 | No active neural connection | User needs to log in |
| 500 | Neural matrix connection failed | Check database connection |
| 503 | Quantum backup systems active | Temporary service interruption |

## Scaling Considerations

### Horizontal Scaling
- Stateless application design
- Session store in database
- Load balancer ready

### Database Scaling
- Neon autoscaling enabled
- Connection pooling optimized
- Read replica support

### Performance Targets
- Response time: <100ms average
- Uptime: >99.9%
- Neural efficiency: >94%
- Concurrent users: 1000+

## Backup and Recovery

### Automated Backups
Neon provides automatic backups with point-in-time recovery.

### Manual Backup
```bash
# Create backup
npm run backup:create

# List backups
npm run backup:list

# Restore from backup
npm run backup:restore <backup-id>
```

### Disaster Recovery
1. Verify backup integrity
2. Provision new database
3. Restore from latest backup
4. Update connection strings
5. Restart application

## Maintenance Windows

### Regular Maintenance
- Database optimization: Monthly
- Dependency updates: Bi-weekly
- Security patches: As needed

### Update Procedure
1. Create backup
2. Test in staging environment
3. Schedule maintenance window
4. Deploy updates
5. Verify functionality
6. Monitor for 24 hours

## Support and Monitoring

### Application Monitoring
- System health dashboard: `/neural-analytics`
- Real-time metrics: WebSocket connection
- Performance tracking: Built-in analytics

### Alert Configuration
Set up alerts for:
- Database connection failures
- High response times (>500ms)
- Low neural efficiency (<90%)
- Authentication failures

### Contact Information
For deployment issues:
- Check system status at `/neural-analytics`
- Review logs in deployment dashboard
- Contact platform administrators

---

Neural Web Labs Deployment Guide v1.0
Last updated: June 13, 2025