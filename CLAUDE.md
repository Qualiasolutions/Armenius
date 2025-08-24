# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Armenius Store Voice Assistant** - Production-ready AI voice agent for customer service automation using Vapi.ai  
**Client:** Armenius Store Cyprus (Electronics & Computer Hardware Store)  
**Developer:** Qualia Solutions  
**Architecture:** Webhook-based serverless with dual-runtime compatibility (Edge + Node.js)
**Status:** ✅ PRODUCTION READY - Database complete, all functions implemented, cost target achieved (€0.32/call)

## Core Tech Stack

- **Voice Pipeline:** Vapi.ai (Deepgram STT + GPT-4o-mini + 11Labs TTS)
- **Compute:** Vercel Edge Functions with Node.js wrapper
- **Database:** Supabase PostgreSQL with vector embeddings + FTS
- **Phone:** Twilio SIP Trunking
- **Cache:** Two-tier (Upstash Redis + LRU memory cache)
- **Frontend:** React + TypeScript + Vite + Tailwind + shadcn/ui
- **AI Models:** OpenAI GPT-4o-mini, 11Labs TTS (Rachel voice), Deepgram Nova-2

## Project Structure

```
/
├── api/
│   ├── vapi/                  # Main webhook handlers (Edge Runtime)
│   │   ├── route.js          # Primary webhook handler
│   │   ├── health.js         # Health check endpoint
│   │   ├── init.js           # Initialization endpoint  
│   │   └── index.js          # Fallback handler
│   ├── vapi.js               # Node.js wrapper for compatibility
│   ├── cron/                 # Scheduled tasks
│   └── config.js             # API configuration
├── config/
│   ├── vapi-assistant.js     # Complete Vapi assistant configuration
│   └── mcp-config.js         # MCP integration settings
├── lib/
│   ├── functions/            # Function registry for voice commands
│   │   ├── index.js          # Registry and execution engine
│   │   ├── inventory.js      # Product search and availability
│   │   ├── appointments.js   # Service booking system
│   │   ├── orders.js         # Order status and tracking
│   │   └── store-info.js     # Store information (hours, location)
│   ├── cache/index.js        # Two-tier caching (LRU + Redis)
│   ├── supabase/client.js    # Database client and queries
│   ├── optimization/index.js # Cost optimization utilities
│   └── monitoring/index.js   # Analytics and alerting
├── frontend/                 # React dashboard for call analytics
│   ├── src/
│   │   ├── pages/            # Dashboard pages
│   │   ├── components/       # Reusable UI components
│   │   └── lib/              # Frontend utilities
│   └── package.json          # Frontend dependencies
├── tests/                    # Test suites
│   ├── webhook.test.js       # Webhook handler tests
│   └── mcp-integration.test.js # MCP integration tests
├── migrations/               # Database schema migrations
├── supabase/                 # Supabase configuration and migrations
└── vercel.json              # Vercel deployment configuration
```

## Development Commands

```bash
# Install dependencies (root + frontend)
npm install
cd frontend && npm install

# Development
npm run dev                    # Frontend dev server (Vite)
cd frontend && npm run dev     # Alternative frontend command

# Testing
npm test                       # Run all Vitest tests
npm run test:watch            # Watch mode tests
npm run test:coverage         # Generate coverage report

# Code Quality
npm run lint                   # ESLint on all JS/TS files
npm run lint:fix              # Auto-fix ESLint issues
npm run type-check            # TypeScript type checking
cd frontend && npm run build   # Build frontend for production

# Database Operations
npm run db:migrate            # Apply database migrations (supabase db push)
npm run db:reset              # Reset database to clean state
npm run cache:warm            # Pre-warm cache with common queries

# Deployment & Monitoring
npm run deploy                # Deploy to Vercel production
npm run logs                  # View recent logs (vercel logs --follow)
vercel logs --follow          # Monitor real-time logs
```

## Key Implementation Files

### Core Architecture
- **Webhook Handler:** `api/vapi/route.js` - Edge Runtime webhook processor with dual-runtime support
- **Node Wrapper:** `api/vapi.js` - Node.js compatibility wrapper for Vercel serverless functions
- **Assistant Config:** `config/vapi-assistant.js` - Complete Vapi.ai assistant configuration (voice, model, prompts)
- **Function Registry:** `lib/functions/index.js` - Maps voice commands to business logic handlers
- **Cache Manager:** `lib/cache/index.js` - Two-tier caching (LRU memory + Redis)

### Business Functions
- **Inventory:** `lib/functions/inventory.js` - Product availability and search
- **Appointments:** `lib/functions/appointments.js` - Service booking system
- **Orders:** `lib/functions/orders.js` - Order status and tracking
- **Store Info:** `lib/functions/store-info.js` - Location, hours, contact info

### Database & Utils
- **Supabase Client:** `lib/supabase/client.js` - Database connection and queries
- **Cost Optimizer:** `lib/optimization/index.js` - Response optimization for TTS costs
- **Monitoring:** `lib/monitoring/index.js` - Analytics and performance tracking

### Frontend
- **Dashboard:** `frontend/src/` - React management interface for call analytics
- **Config:** `public/config.js` - Client-side configuration
- **Test Interface:** `public/test.html` - Quick testing interface

## Critical Business Logic

### Function Handlers
Voice commands are mapped to specific handlers in the Function Registry:
- `checkInventory` - Product availability queries
- `getProductPrice` - Pricing with promotions
- `bookAppointment` - Service appointment scheduling
- `checkOrderStatus` - Order tracking
- `getStoreInfo` - Hours, location, contact

### Caching Strategy
- **L1 Memory Cache:** 5-minute TTL for frequent queries
- **L2 Redis Cache:** Configurable TTL per function
- **Pre-warmed Responses:** Common queries cached on startup

### Cost Optimization
- Dynamic model selection (GPT-3.5 for simple, GPT-4o-mini for complex)
- Response text optimization to reduce TTS costs
- Aggressive caching for predictable queries
- Call duration limits (15 minutes max)

## Environment Configuration

### Required Environment Variables
```bash
# Vapi.ai Voice Service
VAPI_API_KEY=32b555af-1fbc-4b6c-81c0-c940b07c6da2
VAPI_SERVER_SECRET=your_webhook_secret_here

# Supabase Database (Production Ready)
SUPABASE_URL=https://pyrcseinpwjoyiqfkrku.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=service_role_key_here

# AI Services
OPENAI_API_KEY=sk-proj-your_openai_key_here
DEEPGRAM_API_KEY=0b41f3f40316f3cf2a97025cd87d02a15abaf01c

# Caching & Storage
UPSTASH_REDIS_REST_URL=redis_rest_url_here
UPSTASH_REDIS_REST_TOKEN=redis_token_here

# Phone Service
TWILIO_ACCOUNT_SID=account_sid_here
TWILIO_AUTH_TOKEN=auth_token_here

# Deployment
VERCEL_URL=armenius-voice.vercel.app
NODE_ENV=production
MAX_CALL_DURATION_MINUTES=15
```

### Testing URLs and Endpoints
- **Frontend Dashboard:** http://localhost:5173 (dev)
- **Test Interface:** `public/test.html` (quick voice testing)
- **Health Check:** `/api/vapi/health`
- **Webhook Endpoint:** `/api/vapi` or `/api/vapi/route`

### Database Connection
The system uses Supabase PostgreSQL with:
- **Vector embeddings** for semantic product search
- **Full-text search** for Greek/English product queries
- **Row Level Security** policies for data protection
- **Real-time subscriptions** for live dashboard updates

## Testing Approach

```bash
# Run all tests
npm test                       # Run all Vitest tests

# Test specific files
npm test webhook.test.js       # Test webhook handlers
npm test mcp-integration.test.js # Test MCP integration

# Watch mode and coverage
npm run test:watch            # Watch mode tests
npm run test:coverage         # Generate coverage report
```

## Deployment Workflow

1. **Development:** Test webhook handlers locally with ngrok
2. **Staging:** Deploy to Vercel preview environment
3. **Production:** Promote to production with monitoring

## Performance Targets

- **Response Latency:** <500ms (p95)
- **Concurrent Calls:** 20-50 simultaneous
- **Cost per Call:** <€0.40 average
- **Automation Rate:** >70% without escalation

## Common Development Tasks

### Adding a New Voice Function
1. Create handler in `lib/functions/[feature].js`
2. Register in Function Registry
3. Add to Vapi assistant config
4. Test with mock webhook payload
5. Deploy and update Vapi dashboard

### Modifying Conversation Flow
1. Update system prompt in `config/vapi-assistant.js`
2. Adjust response templates
3. Test conversation scenarios
4. Monitor customer satisfaction metrics

### Optimizing Costs
1. Analyze call logs for patterns
2. Identify cacheable responses
3. Implement caching rules
4. Monitor cost reduction metrics

## Monitoring & Debugging

- **Real-time Logs:** `vercel logs --follow`
- **Vapi Dashboard:** https://dashboard.vapi.ai
- **Supabase Studio:** Project dashboard for database queries
- **Cost Tracking:** Conversations table includes per-call costs

## Architecture Patterns

### Dual-Runtime Compatibility
- **Edge Runtime:** `api/vapi/route.js` for optimal performance
- **Node.js Wrapper:** `api/vapi.js` for Vercel serverless compatibility
- **Request Transformation:** Automatic conversion between runtime formats

### Function Registry Pattern
- **Dynamic Loading:** Functions loaded at runtime from `/lib/functions/`
- **Caching Integration:** Automatic cache key generation and TTL management
- **Error Boundaries:** Fallback responses for each function type
- **Execution Tracking:** Performance metrics and error logging

### Multi-Tier Caching Strategy
- **L1 Memory Cache:** LRU cache for immediate response (5-minute TTL)
- **L2 Redis Cache:** Persistent cache for cross-request data
- **Cache Warming:** Pre-populate common queries via cron jobs
- **Smart Invalidation:** Context-aware cache expiration

## Production Considerations

### Security & Reliability
- **Webhook Signature Verification:** HMAC SHA-256 validation for all Vapi requests
- **Row Level Security:** Database policies enforce data access controls  
- **Input Sanitization:** All user inputs validated before processing
- **Graceful Fallbacks:** Every function has default error responses
- **Rate Limiting:** Built-in protection against abuse
- **PII Protection:** Phone numbers encrypted, call logs sanitized

### Performance Optimization
- **Response Time Target:** <500ms (currently achieving ~300ms)
- **Cost Optimization:** Response text shortening for TTS efficiency
- **Language Detection:** Automatic Greek/English support
- **Call Duration Limits:** 15-minute maximum with graceful handoff
- **Concurrent Call Support:** 20-50 simultaneous calls tested

### Monitoring & Alerting
- **Real-time Metrics:** Call volume, duration, success rates
- **Cost Tracking:** Per-call cost analysis with €2.00 alert threshold
- **Error Rate Monitoring:** Automatic alerts when error rate >5%
- **Performance Degradation:** Response time threshold monitoring
- **Database Performance:** Multiple permissive RLS policies need optimization

### Known Issues & Maintenance
- **Database RLS Optimization:** Multiple permissive policies detected on tables (performance impact)
- **Cache Hit Rate:** Monitor and optimize for >80% hit rate
- **Language Model Costs:** Balance between GPT-3.5-turbo and GPT-4o-mini based on query complexity
- **Greek Character Encoding:** Ensure proper UTF-8 handling in all components