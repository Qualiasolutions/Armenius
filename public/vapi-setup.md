# Secure Vapi Assistant Setup Guide

## Quick Start - Testing the Voice Agent

### ✅ Security-First Architecture

This system is designed with security best practices:
- **NO sensitive data exposed in frontend**
- **All API keys managed on backend only**
- **Secure session management**
- **Environment variables protected**

### 🚀 How to Test the Voice Agent

**Access the interface at:** https://your-deployment-url.vercel.app/test

### 🔧 Backend Configuration Required

All configuration is done through environment variables on the backend:

#### Required Environment Variables (Vercel Dashboard)

```bash
# Vapi Configuration (SECURE - Backend only)
VAPI_API_KEY=your_vapi_api_key
VAPI_PUBLIC_KEY=your_vapi_public_key  
VAPI_SERVER_SECRET=your_vapi_server_secret
VAPI_PHONE_NUMBER_ID=your_phone_number_id

# Database Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# AI Services
OPENAI_API_KEY=your_openai_key
DEEPGRAM_API_KEY=your_deepgram_key

# Cache (Optional)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### 🎛️ Vapi Assistant Configuration

Create your assistant in Vapi Dashboard with these settings:

```json
{
  "name": "Armenius Store Assistant",
  "model": {
    "provider": "openai",
    "model": "gpt-4o-mini"
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "21m00Tcm4TlvDq8ikWAM"
  },
  "serverUrl": "https://your-deployment-url.vercel.app/api/vapi"
}
```

**Important:** The system prompt and function definitions are automatically configured by the backend for security.

### 🧪 Testing Features

#### 1. Function Testing
- **Inventory Checks:** Test product availability
- **Price Queries:** Get real-time pricing
- **Appointments:** Book service appointments
- **Store Info:** Hours, location, contact details
- **Multi-language:** Greek and English support

#### 2. System Monitoring
- **Real-time Status:** API, database, cache health
- **Performance Metrics:** Response times, success rates
- **Cost Tracking:** Per-call cost estimates
- **Error Logging:** Comprehensive error handling

#### 3. Security Features
- **No Exposed Keys:** All sensitive data backend-only
- **Secure Sessions:** Temporary session tokens
- **Input Validation:** All inputs sanitized
- **Error Boundaries:** Graceful failure handling

### 📊 Available Test Scenarios

1. **English Tests:**
   - "Do you have RTX 4090 in stock?"
   - "What's the price of Intel i9?"
   - "I need to book a repair appointment"
   - "What are your store hours?"

2. **Greek Tests:**
   - "Έχετε διαθέσιμη την RTX 4090;"
   - "Ποια είναι η τιμή του Intel i9;"
   - "Θέλω να κλείσω ραντεβού επισκευής"
   - "Ποιες είναι οι ώρες λειτουργίας;"

### 🔍 API Endpoints

#### Public Endpoints (Safe)
- `GET /api/config` - Public configuration
- `GET /api/vapi/health` - System health check
- `POST /api/vapi/init` - Secure session initialization

#### Secured Endpoints (Backend Only)
- `POST /api/vapi` - Webhook handler
- All environment variables and API keys

### 📈 Monitoring & Analytics

#### System Health
- API endpoint status
- Database connectivity
- Function availability
- Response time monitoring

#### Usage Metrics
- Call volume and duration
- Function usage statistics
- Cost per call tracking
- Error rate monitoring

### 🚨 Security Notes

1. **Never expose API keys in frontend code**
2. **All sensitive operations handled on backend**
3. **Session-based authentication for voice calls**
4. **Input validation on all API endpoints**
5. **CORS properly configured**

### 🛠️ Development Workflow

1. **Configure Environment:** Set all env vars in Vercel
2. **Deploy Backend:** `vercel --prod`
3. **Test Functions:** Use `/test` interface
4. **Monitor Performance:** Check health endpoint
5. **Iterate:** Adjust configuration as needed

### 📞 Support

For technical issues:
- Check browser console for detailed error messages
- Verify all environment variables are set in Vercel
- Test API endpoints individually using the test interface
- Review Vercel logs: `vercel logs --follow`

### 🔐 Security Best Practices Implemented

- ✅ No credentials in frontend code
- ✅ Secure session management
- ✅ Input validation and sanitization
- ✅ Error handling without data leakage
- ✅ HTTPS-only communication
- ✅ Environment-based configuration
- ✅ Proper CORS configuration

This secure architecture ensures your API keys and sensitive data are never exposed while still providing a full-featured testing environment.