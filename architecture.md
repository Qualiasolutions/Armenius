# Voice Agent Architecture - Vapi Implementation

## System Overview
**Architecture Pattern:** Webhook-based Serverless  
**Primary Service:** Vapi.ai (Managed Voice Pipeline)  
**Compute:** Vercel Edge Functions  
**Database:** Supabase (PostgreSQL + Realtime)  
**Phone:** Twilio SIP Trunking  

## High-Level Architecture

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Customer   │──────▶│    Twilio    │──────▶│   Vapi.ai    │
│    Phone     │ PSTN  │  Phone No.   │ SIP   │   Platform   │
└──────────────┘       └──────────────┘       └──────────────┘
                                                      │
                                              ┌───────┼────────┐
                                              ▼       ▼        ▼
                                      ┌─────────┐ ┌──────┐ ┌─────────┐
                                      │OpenAI   │ │11Labs│ │Deepgram │
                                      │GPT-4o   │ │ TTS  │ │  STT    │
                                      └─────────┘ └──────┘ └─────────┘
                                              │
                                   ┌──────────▼──────────┐
                                   │   Webhook Events    │
                                   └──────────┬──────────┘
                                              │
                ┌─────────────────────────────▼─────────────────────────┐
                │             Vercel Edge Functions                     │
                │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
                │  │   Router    │  │  Functions  │  │    Cache    │  │
                │  │   Handler   │  │   Registry  │  │   Manager   │  │
                │  └─────────────┘  └─────────────┘  └─────────────┘  │
                └───────────────────────────┬───────────────────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        ▼                   ▼                   ▼
                ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                │  Supabase   │    │ Cloudflare  │    │   Upstash   │
                │  Database   │    │   R2/KV     │    │    Redis    │
                └─────────────┘    └─────────────┘    └─────────────┘
```

## Component Architecture

### 1. Vapi Configuration Layer

```javascript
// config/vapi-assistant.js
export const assistantConfig = {
  name: "Armenius Store Assistant",
  voice: {
    provider: "11labs",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
    settings: {
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.4,
      useSpeakerBoost: true
    }
  },
  model: {
    provider: "openai",
    model: "gpt-4o-mini",
    systemPrompt: `You are Maria, a helpful assistant at Armenius Store in Cyprus.
    You help customers with:
    - Product availability and pricing
    - Technical specifications
    - Store hours and location
    - Appointment booking
    - Order status
    
    Personality: Professional, friendly, knowledgeable about computers.
    Language: Respond in the same language as the customer (Greek or English).
    Always confirm important details like product models or appointment times.`,
    temperature: 0.7,
    maxTokens: 250,
    functions: [
      "checkInventory",
      "getProductPrice",
      "bookAppointment",
      "checkOrderStatus",
      "getStoreInfo"
    ]
  },
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "multi",
    smartFormat: true,
    keywords: ["RTX", "GeForce", "AMD", "Ryzen", "Intel", "Core"]
  },
  serverUrl: "https://armenius-voice.vercel.app/api/vapi",
  serverUrlSecret: process.env.VAPI_SERVER_SECRET
};
```

### 2. Webhook Handler Architecture

```javascript
// api/vapi/route.js (Vercel App Router)
import { assistantConfig } from '@/config/vapi-assistant';
import { FunctionRegistry } from '@/lib/functions';
import { CacheManager } from '@/lib/cache';
import { Analytics } from '@/lib/analytics';

export async function POST(request) {
  const payload = await request.json();
  
  // Verify webhook signature
  if (!verifyVapiSignature(request, payload)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const { type, call, functionCall, transcript } = payload;
  
  switch(type) {
    case 'function-call':
      return handleFunctionCall(functionCall, call);
    
    case 'conversation-update':
      return handleConversationUpdate(transcript, call);
    
    case 'call-ended':
      return handleCallEnded(call);
    
    case 'transfer-destination-request':
      return handleTransferRequest(call);
    
    default:
      return new Response('OK', { status: 200 });
  }
}

async function handleFunctionCall(functionCall, call) {
  const { name, parameters } = functionCall;
  const functionHandler = FunctionRegistry.get(name);
  
  if (!functionHandler) {
    return Response.json({ 
      error: "Function not found",
      fallback: "I'll check that for you manually."
    });
  }
  
  try {
    // Check cache first
    const cacheKey = `${name}:${JSON.stringify(parameters)}`;
    const cached = await CacheManager.get(cacheKey);
    
    if (cached) {
      Analytics.track('cache_hit', { function: name });
      return Response.json({ result: cached });
    }
    
    // Execute function
    const result = await functionHandler.execute(parameters, call);
    
    // Cache result
    await CacheManager.set(cacheKey, result, functionHandler.ttl);
    
    // Track analytics
    Analytics.track('function_call', {
      function: name,
      duration: Date.now() - functionCall.timestamp,
      callId: call.id
    });
    
    return Response.json({ result });
    
  } catch (error) {
    console.error(`Function ${name} failed:`, error);
    return Response.json({
      error: error.message,
      fallback: functionHandler.fallbackResponse
    });
  }
}
```

### 3. Function Registry Implementation

```javascript
// lib/functions/index.js
export class FunctionRegistry {
  static functions = new Map();
  
  static register(name, handler) {
    this.functions.set(name, handler);
  }
  
  static get(name) {
    return this.functions.get(name);
  }
}

// lib/functions/inventory.js
import { supabase } from '@/lib/supabase';

FunctionRegistry.register('checkInventory', {
  ttl: 300, // Cache for 5 minutes
  fallbackResponse: "I'm having trouble checking inventory. Please call us directly.",
  
  async execute(params) {
    const { product_name, category } = params;
    
    // First try exact match
    let { data, error } = await supabase
      .from('products')
      .select('name, sku, stock_quantity, price')
      .ilike('name', `%${product_name}%`)
      .gt('stock_quantity', 0)
      .limit(5);
    
    if (error) throw error;
    
    if (data.length === 0) {
      return {
        available: false,
        message: `I couldn't find ${product_name} in stock. Would you like me to check similar products?`,
        suggestions: await this.getSimilarProducts(product_name)
      };
    }
    
    if (data.length === 1) {
      const product = data[0];
      return {
        available: true,
        message: `Yes! ${product.name} is in stock. We have ${product.stock_quantity} units available at €${product.price}. Would you like me to reserve one for you?`,
        product: product
      };
    }
    
    // Multiple matches
    return {
      available: true,
      message: `I found ${data.length} products matching "${product_name}". Let me list them for you...`,
      products: data
    };
  },
  
  async getSimilarProducts(productName) {
    // Use embeddings or simple keyword matching
    const { data } = await supabase
      .from('products')
      .select('name, price')
      .textSearch('name', productName.split(' ').join(' | '))
      .limit(3);
    
    return data || [];
  }
});

// lib/functions/appointments.js
FunctionRegistry.register('bookAppointment', {
  ttl: 0, // Don't cache appointments
  fallbackResponse: "I'll have someone call you back to schedule the appointment.",
  
  async execute(params) {
    const { service_type, preferred_date, customer_phone, customer_name } = params;
    
    // Check availability
    const slot = await checkAvailableSlot(preferred_date, service_type);
    
    if (!slot) {
      const alternatives = await getAlternativeSlots(preferred_date, service_type);
      return {
        booked: false,
        message: `${preferred_date} is fully booked. I have availability on ${alternatives[0]} or ${alternatives[1]}. Which would you prefer?`,
        alternatives
      };
    }
    
    // Create appointment
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        service_type,
        appointment_time: slot,
        customer_phone,
        customer_name,
        status: 'confirmed',
        created_via: 'voice_ai'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Send SMS confirmation
    await sendSMSConfirmation(customer_phone, data);
    
    return {
      booked: true,
      message: `Perfect! I've booked your ${service_type} appointment for ${formatDate(slot)}. You'll receive an SMS confirmation shortly.`,
      appointment: data
    };
  }
});
```

### 4. Caching Strategy

```javascript
// lib/cache/index.js
import { Redis } from '@upstash/redis';
import { LRUCache } from 'lru-cache';

export class CacheManager {
  static redis = Redis.fromEnv();
  static memory = new LRUCache({
    max: 500,
    ttl: 1000 * 60 * 5 // 5 minutes default
  });
  
  static async get(key) {
    // L1: Memory cache
    const memCached = this.memory.get(key);
    if (memCached) return memCached;
    
    // L2: Redis cache
    try {
      const redisCached = await this.redis.get(key);
      if (redisCached) {
        this.memory.set(key, redisCached);
        return redisCached;
      }
    } catch (error) {
      console.error('Redis error:', error);
    }
    
    return null;
  }
  
  static async set(key, value, ttl = 300) {
    // Set in both caches
    this.memory.set(key, value);
    
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }
  
  // Pre-cache common responses
  static async warmup() {
    const commonQueries = [
      { key: 'store:hours', value: 'We are open Monday to Friday 9am-7pm, Saturday 9am-2pm' },
      { key: 'store:location', value: 'We are located at 171 Makarios Avenue in Nicosia' },
      { key: 'store:phone', value: 'You can also reach us at 77-111-104' }
    ];
    
    for (const { key, value } of commonQueries) {
      await this.set(key, value, 86400); // Cache for 24 hours
    }
  }
}
```

### 5. Database Schema (Supabase)

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  brand VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  specifications JSONB,
  embedding vector(1536), -- For semantic search
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create full text search
ALTER TABLE products ADD COLUMN fts tsvector 
  GENERATED ALWAYS AS (to_tsvector('english', name || ' ' || COALESCE(brand, '') || ' ' || COALESCE(category, ''))) STORED;
CREATE INDEX products_fts_idx ON products USING GIN(fts);

-- Conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vapi_call_id VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  transcript JSONB,
  summary TEXT,
  sentiment VARCHAR(20),
  resolution_status VARCHAR(50),
  cost DECIMAL(10,4),
  metadata JSONB
);

-- Appointments table  
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_phone VARCHAR(20) NOT NULL,
  customer_name VARCHAR(200),
  service_type VARCHAR(100) NOT NULL,
  appointment_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(50) DEFAULT 'confirmed',
  created_via VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  conversation_id UUID REFERENCES conversations(id),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  properties JSONB
);

-- Real-time views
CREATE VIEW daily_stats AS
SELECT 
  DATE(started_at) as date,
  COUNT(*) as total_calls,
  AVG(duration_seconds) as avg_duration,
  SUM(cost) as total_cost,
  COUNT(CASE WHEN resolution_status = 'resolved' THEN 1 END) as resolved_calls
FROM conversations
GROUP BY DATE(started_at);
```

### 6. Cost Optimization Layer

```javascript
// lib/optimization/index.js
export class CostOptimizer {
  static async preprocessResponse(text) {
    // Shorten common responses to save TTS costs
    const shortcuts = {
      'Thank you for calling Armenius Store': 'Thanks for calling Armenius',
      'Let me check that for you right away': 'Let me check that',
      'Is there anything else I can help you with today?': 'Anything else?'
    };
    
    let optimized = text;
    for (const [long, short] of Object.entries(shortcuts)) {
      optimized = optimized.replace(long, short);
    }
    
    return optimized;
  }
  
  static async shouldUseCache(functionName, params) {
    // Determine if we should use cached response
    const cacheablePatterns = [
      /store (hours|location|phone)/i,
      /return policy/i,
      /warranty information/i,
      /payment methods/i
    ];
    
    const query = JSON.stringify(params).toLowerCase();
    return cacheablePatterns.some(pattern => pattern.test(query));
  }
  
  static async selectModel(complexity) {
    // Dynamic model selection based on query complexity
    if (complexity === 'simple') {
      return 'gpt-3.5-turbo'; // Cheaper for simple queries
    }
    return 'gpt-4o-mini'; // Better for complex queries
  }
}

// Middleware to track costs
export async function trackCosts(call, usage) {
  const costs = {
    tts: usage.ttsCharacters * 0.00018, // €0.18 per 1K chars
    stt: usage.sttSeconds * 0.0004,     // ~€0.024 per minute
    llm: usage.llmTokens * 0.000002,    // GPT-4o-mini pricing
    vapi: usage.vapiMinutes * 0.05      // Vapi per-minute cost
  };
  
  const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
  
  await supabase
    .from('conversations')
    .update({ 
      cost: totalCost,
      metadata: { costs }
    })
    .eq('vapi_call_id', call.id);
  
  // Alert if cost exceeds threshold
  if (totalCost > 2) {
    await sendCostAlert(call, totalCost);
  }
  
  return totalCost;
}
```

### 7. Monitoring & Analytics

```javascript
// lib/monitoring/index.js
export class Monitor {
  static async trackEvent(eventType, properties = {}) {
    // Send to multiple destinations
    await Promise.all([
      this.sendToSupabase(eventType, properties),
      this.sendToPostHog(eventType, properties),
      this.sendToVercelAnalytics(eventType, properties)
    ]);
  }
  
  static async sendToSupabase(eventType, properties) {
    await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        properties,
        conversation_id: properties.conversationId
      });
  }
  
  static getDashboardMetrics() {
    return {
      realtime: 'https://app.supabase.com/project/[id]/editor',
      analytics: 'https://posthog.com/[project]',
      costs: 'https://platform.openai.com/usage',
      vapi: 'https://dashboard.vapi.ai/analytics'
    };
  }
}

// Alert configuration
export const alerts = {
  highLatency: {
    threshold: 1000, // ms
    action: 'email'
  },
  highCost: {
    threshold: 2, // EUR per call
    action: 'slack'
  },
  errorRate: {
    threshold: 0.05, // 5%
    action: 'pagerduty'
  }
};
```

### 8. Deployment Configuration

```yaml
# vercel.json
{
  "functions": {
    "api/vapi/route.js": {
      "maxDuration": 300,
      "memory": 1024
    }
  },
  "env": {
    "VAPI_API_KEY": "@vapi-api-key",
    "VAPI_SERVER_SECRET": "@vapi-server-secret",
    "SUPABASE_URL": "@supabase-url",
    "SUPABASE_ANON_KEY": "@supabase-anon-key",
    "UPSTASH_REDIS_URL": "@upstash-redis-url",
    "TWILIO_ACCOUNT_SID": "@twilio-account-sid",
    "TWILIO_AUTH_TOKEN": "@twilio-auth-token"
  },
  "crons": [
    {
      "path": "/api/cron/warmup-cache",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/daily-report",
      "schedule": "0 20 * * *"
    }
  ]
}
```

```javascript
// package.json dependencies
{
  "dependencies": {
    "@supabase/supabase-js": "^2.45.0",
    "@upstash/redis": "^1.34.0",
    "@vapi-ai/server-sdk": "^1.0.0",
    "twilio": "^5.2.0",
    "zod": "^3.23.0",
    "lru-cache": "^10.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.12.0",
    "typescript": "^5.5.0",
    "vitest": "^2.0.0"
  }
}
```

## Environment Variables

```bash
# .env.local
# Vapi Configuration
VAPI_API_KEY=va_xxxxxxxxxxxx
VAPI_PUBLIC_KEY=pk_xxxxxxxxxxxx
VAPI_SERVER_SECRET=ss_xxxxxxxxxxxx
VAPI_PHONE_NUMBER_ID=pn_xxxxxxxxxxxx

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxx
SUPABASE_SERVICE_KEY=eyJxxxxxxxxxxxxx

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+357xxxxxxxx

# Monitoring
POSTHOG_API_KEY=phc_xxxxxxxxxxxxx
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Feature Flags
ENABLE_GREEK_LANGUAGE=true
ENABLE_APPOINTMENT_BOOKING=true
ENABLE_COST_OPTIMIZATION=true
MAX_CALL_DURATION_MINUTES=15
```

## Testing Strategy

```javascript
// tests/vapi-webhook.test.js
import { describe, it, expect } from 'vitest';
import { POST } from '@/api/vapi/route';

describe('Vapi Webhook Handler', () => {
  it('handles function calls correctly', async () => {
    const request = new Request('http://localhost/api/vapi', {
      method: 'POST',
      headers: { 'x-vapi-secret': process.env.VAPI_SERVER_SECRET },
      body: JSON.stringify({
        type: 'function-call',
        functionCall: {
          name: 'checkInventory',
          parameters: { product_name: 'RTX 4090' }
        },
        call: { id: 'call_123' }
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.result).toHaveProperty('available');
    expect(data.result).toHaveProperty('message');
  });
  
  it('uses cache for repeated queries', async () => {
    // First call - should hit database
    const response1 = await callFunction('checkInventory', { product_name: 'RTX 4090' });
    
    // Second call - should hit cache
    const response2 = await callFunction('checkInventory', { product_name: 'RTX 4090' });
    
    expect(response1.latency).toBeGreaterThan(response2.latency);
  });
});
```

## Performance Benchmarks

```yaml
Target Metrics:
  Response Latency:
    - P50: <300ms
    - P95: <500ms
    - P99: <1000ms
  
  Concurrent Calls:
    - Minimum: 20
    - Target: 50
    - Maximum: 100
  
  Cost per Call:
    - Simple Query: €0.10-0.20
    - Complex Query: €0.30-0.50
    - Average Target: <€0.40
  
  Success Rate:
    - Function Execution: >99%
    - Call Completion: >95%
    - Customer Resolution: >70%
```

## Deployment Checklist

### Pre-Launch
- [ ] Vapi assistant configured and tested
- [ ] Twilio phone number configured
- [ ] Vercel project deployed
- [ ] Supabase database migrated
- [ ] Redis cache configured
- [ ] Environment variables set
- [ ] Webhook URL registered in Vapi
- [ ] Test calls successful

### Launch Day
- [ ] Monitor first 10 calls closely
- [ ] Check latency metrics
- [ ] Verify cost tracking
- [ ] Test all functions
- [ ] Confirm SMS notifications working

### Post-Launch
- [ ] Daily cost review
- [ ] Weekly performance optimization
- [ ] Monthly feature updates
- [ ] Quarterly architecture review

---

**Architecture Version:** 1.0  
**Stack:** Vapi.ai + Vercel + Supabase  
**Estimated Monthly Cost:** €300-400  
**Development Time:** 2 weeks  
**Maintenance:** 5 hours/month