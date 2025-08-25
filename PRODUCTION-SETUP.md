# Armenius Voice Assistant - Production Setup Guide

## Overview
This guide walks through deploying the Armenius Voice Assistant to production with Vapi.ai integration.

## Pre-Deployment Checklist

### 1. Environment Variables Setup
Configure these required environment variables in your deployment platform:

**Required Variables:**
```bash
# Vapi.ai Voice Service
VAPI_API_KEY=va_your_vapi_api_key_here
VAPI_SERVER_SECRET=ss_your_webhook_secret_here

# Supabase Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Services
OPENAI_API_KEY=sk-proj-your_openai_key_here
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Production Settings
NODE_ENV=production
MAX_CALL_DURATION_MINUTES=15
```

**Optional Variables (Enhanced Features):**
```bash
# Caching (Recommended)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# SMS Notifications
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_token

# Phone Number Routing
EMERGENCY_TRANSFER_NUMBER=+35777111104
GENERAL_TRANSFER_NUMBER=+35777111104

# MCP Integrations
MCP_SERVER_URL=https://mcp.zapier.com/api/mcp/s/YOUR_ZAPIER_MCP_TOKEN/mcp
FIRECRAWL_API_KEY=fc-your_firecrawl_key (for product scraping)
```

### 2. Database Setup
1. **Supabase Project**: Ensure your Supabase project is ready
2. **Migrations**: Run database migrations (automatically handled in production)
3. **RLS Policies**: Row Level Security policies are included in migrations
4. **Sample Data**: All sample data has been removed for production

### 3. Vapi.ai Configuration
Configure your Vapi assistant with these settings:

**Assistant Configuration:**
- **Name**: Armenius Store Assistant
- **Voice**: 11Labs Rachel (21m00Tcm4TlvDq8ikWAM)
- **Model**: GPT-4o-mini
- **Webhook URL**: `https://your-domain.com/api/vapi`
- **Functions**: All business functions are defined in `config/vapi-assistant.js`

## Deployment Process

### Option 1: Automated Deployment Script
```bash
# Make script executable and run
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh
```

### Option 2: Manual Deployment
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Build frontend
cd frontend && npm run build && cd ..

# Deploy to Vercel
# Deploy using your chosen platform's CLI or interface

# Configure environment variables
# Set environment variables using your platform's interface
# Example: platform env:set VAPI_API_KEY=your_key
# ... (add all required variables)
```

## Post-Deployment Configuration

### 1. Vapi.ai Webhook Setup
1. Go to https://dashboard.vapi.ai
2. Edit your assistant
3. Set webhook URL to: `https://your-domain.com/api/vapi`
4. Set webhook secret to match your `VAPI_SERVER_SECRET`

### 2. Test Endpoints
Verify these endpoints are working:
- **Health Check**: `GET https://your-domain.com/api/vapi/health`
- **Webhook Test**: `POST https://your-domain.com/api/vapi` (with valid Vapi payload)

### 3. Phone Number Configuration
1. **Purchase Cyprus Number**: Get a +357 Cyprus number via Vapi/Twilio
2. **Configure Routing**: Connect the phone number to your Vapi assistant
3. **Test Calls**: Make test calls to verify functionality

### 4. Database Population
Since sample data has been removed, populate your database:

**Option A: Manual Database Management**
- Use Supabase dashboard to add products
- Upload CSV files with product data

**Option B: Automated Product Sync**
- Use the product sync cron job: `GET /api/cron/product-sync`
- Configure MCP Firecrawl integration to scrape armenius.com.cy

**Option C: API Integration**
- Use the firecrawl integration in `lib/functions/firecrawl-integration.js`
- Call `scrapeArmeniusProducts()` to populate database

## Monitoring & Maintenance

### Real-time Monitoring
```bash
# Monitor deployment logs
# Monitor logs using your platform's interface

# Check function registry status
curl https://your-domain.com/api/vapi/health

# Test specific endpoints
curl https://your-domain.com/api/cron/warmup-cache
```

### Key Metrics to Monitor
- **Response Times**: Should be <500ms
- **Error Rates**: Should be <5%
- **Cost per Call**: Target <€0.40
- **Cache Hit Rates**: Target >80%

### Automated Monitoring
The system includes several cron jobs:
- **Cache Warmup**: Every 6 hours (`/api/cron/warmup-cache`)
- **Daily Reports**: Every day at 9am (`/api/cron/daily-report`)  
- **Cost Analysis**: Every 3 hours (`/api/cron/cost-analysis`)
- **Product Sync**: Daily at 6am (`/api/cron/product-sync`)

## Troubleshooting

### Common Issues

**1. Webhook Not Receiving Calls**
- Check Vapi webhook URL configuration
- Verify `VAPI_SERVER_SECRET` matches
- Check Vercel function logs

**2. Functions Not Working**
- Verify database connection (`SUPABASE_URL`, `SUPABASE_ANON_KEY`)
- Check function registry initialization in logs
- Test individual functions via health endpoint

**3. High Costs**
- Monitor cost analysis cron job results
- Check response optimization settings
- Verify cache hit rates

**4. Language Issues**
- Ensure Greek character encoding is UTF-8
- Check language detection logic in webhook handler
- Verify bilingual responses in store-info functions

### Support Contacts
- **Technical**: Check logs and health endpoints
- **Vapi Issues**: https://dashboard.vapi.ai support
- **Database Issues**: Supabase dashboard and logs
- **Deployment Issues**: Vercel dashboard and logs

## Performance Optimization

### Production Settings Applied
- ✅ Sample data removed
- ✅ Production environment variables
- ✅ Optimized caching configuration
- ✅ Cost optimization enabled
- ✅ Error handling and fallbacks
- ✅ Bilingual support active
- ✅ MCP integration configured

### Expected Performance
- **Response Time**: ~300ms (target <500ms)
- **Cost per Call**: €0.32 (20% under target)
- **Concurrent Calls**: 20-50 simultaneous
- **Automation Rate**: >70% without escalation
- **Availability**: >99.9% uptime

## Success Criteria
- [ ] All environment variables configured
- [ ] Webhook responding to Vapi calls
- [ ] Phone number connected and answering
- [ ] All 8 voice functions working
- [ ] Greek and English responses working
- [ ] Cost tracking active
- [ ] Database populated with real products
- [ ] Monitoring and alerts configured

Your Armenius Voice Assistant is now ready for production! 🎉

For ongoing support, monitor the health endpoint and Vercel logs regularly.