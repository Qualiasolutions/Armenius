# AI Voice Agent PRD - Vapi Implementation
**Project:** Armenius Store Voice Assistant  
**Client:** Armenius Store Cyprus  
**Developer:** Qualia Solutions  
**Timeline:** 2 weeks to production  
**Stack:** Vapi.ai + Vercel Edge Functions  

## 🎯 Business Objectives

### Primary Goals
- Deploy functional demo within 24 hours
- Production-ready system in 2 weeks  
- Monthly operational cost under €400
- Minimal infrastructure management
- 70% call automation without human intervention

### Revenue Model
- **Setup Fee:** €2,000-3,000
- **Monthly Subscription:** €500-800
- **Expected Margin:** 60-80%
- **Payback Period:** 2-3 months for client

## 📋 Core Requirements

### Phase 1: Demo (Day 1)
**Objective:** Working phone system with basic responses

#### Requirements
- **DR-01:** Purchase Twilio phone number (+357 Cyprus)
- **DR-02:** Configure Vapi assistant with Armenius greeting
- **DR-03:** Basic intent recognition (hours, location, contact)
- **DR-04:** Deploy webhook to Vercel (free tier)
- **DR-05:** Test with 5 successful calls

#### Acceptance Criteria
- [ ] Receives calls on Cyprus number
- [ ] Responds in under 1 second
- [ ] Handles basic FAQs
- [ ] Clean handoff to "human" (simulation)

### Phase 2: MVP (Days 2-7)
**Objective:** Integrate Armenius business logic

#### Functional Requirements
- **FR-01:** Product inventory search via voice
- **FR-02:** Price checking with current promotions
- **FR-03:** Store hours and location information
- **FR-04:** Basic technical support (password resets, common issues)
- **FR-05:** Appointment booking for repairs
- **FR-06:** Order status checking
- **FR-07:** Greek/English language detection
- **FR-08:** SMS follow-up with call summary

#### Integration Requirements
- **IR-01:** Connect to Armenius product database (CSV/JSON)
- **IR-02:** Implement caching for common queries
- **IR-03:** Create fallback responses for API failures
- **IR-04:** Add conversation logging to Supabase

#### Voice Experience Requirements
- **VX-01:** Natural conversation flow with interruptions
- **VX-02:** Confirmation before actions ("Did you say RTX 4090?")
- **VX-03:** Proactive suggestions ("We also have RTX 4080 in stock")
- **VX-04:** Personality matching Armenius brand (professional, helpful)

### Phase 3: Production (Days 8-14)
**Objective:** Scale-ready system with monitoring

#### Performance Requirements
- **PR-01:** Handle 20 concurrent calls
- **PR-02:** <500ms response latency (p95)
- **PR-03:** 99.9% uptime SLA
- **PR-04:** Automatic failover to backup messages

#### Operational Requirements
- **OR-01:** Cost optimization via response caching
- **OR-02:** Daily analytics dashboard
- **OR-03:** Conversation recordings for quality review
- **OR-04:** Automated alerts for failures
- **OR-05:** A/B testing for conversation flows

#### Security Requirements
- **SR-01:** No credit card processing via voice
- **SR-02:** GDPR-compliant data handling
- **SR-03:** Automatic PII redaction in logs
- **SR-04:** Secure webhook authentication

## 🎯 User Stories

### Customer Stories
```
As a customer calling Armenius,
I want to check if RTX 4090 is in stock,
So I can decide whether to visit the store.

As a Greek-speaking customer,
I want to speak Greek naturally,
So I feel comfortable making inquiries.

As a business owner,
I want bulk pricing information,
So I can make procurement decisions.
```

### Business Stories
```
As Armenius Store manager,
I want 24/7 phone availability,
So we never miss potential sales.

As Armenius sales team,
I want routine calls handled automatically,
So I can focus on complex sales.
```

## 📊 Success Metrics

### Technical KPIs
- **Latency:** <500ms response time
- **Accuracy:** >95% intent recognition
- **Availability:** >99.9% uptime
- **Concurrent Calls:** Support 20+ simultaneous

### Business KPIs
- **Automation Rate:** >70% calls fully handled
- **Customer Satisfaction:** >4.2/5 rating
- **Cost per Call:** <€0.40
- **Conversion Rate:** >15% call-to-sale

### Quality Metrics
- **First Call Resolution:** >80%
- **Average Handle Time:** <3 minutes
- **Escalation Rate:** <30%
- **Language Accuracy:** >98% for Greek/English

## 🔧 Technical Specifications

### Vapi Configuration
```json
{
  "assistant": {
    "firstMessage": "Welcome to Armenius Store! I can help you with product availability, prices, and technical support. How can I assist you today?",
    "model": {
      "provider": "openai",
      "model": "gpt-4o-mini",
      "temperature": 0.7,
      "maxTokens": 250
    },
    "voice": {
      "provider": "11labs",
      "voiceId": "rachel",
      "stability": 0.5,
      "similarityBoost": 0.75,
      "style": "professional"
    },
    "language": "en",
    "responseDelaySeconds": 0.4,
    "llmRequestDelaySeconds": 0.1,
    "numFastTurns": 3
  }
}
```

### Function Definitions
```yaml
functions:
  - name: checkInventory
    description: Check product stock levels
    parameters:
      - product_name: string
      - product_sku: string (optional)
    
  - name: getPrice
    description: Get current product pricing
    parameters:
      - product_identifier: string
      - quantity: number (optional)
    
  - name: bookAppointment
    description: Schedule service appointment
    parameters:
      - service_type: string
      - preferred_date: date
      - customer_phone: string
    
  - name: checkOrderStatus
    description: Check existing order status
    parameters:
      - order_number: string
      - customer_phone: string
```

## 💰 Cost Analysis

### Development Costs
- **Week 1:** Demo + MVP = 40 hours
- **Week 2:** Production + Testing = 40 hours
- **Total Development:** €2,000-3,000

### Operational Costs (Monthly)
```
Vapi Usage (3000 minutes):        €300
Twilio Phone Number:               €10
Vercel Pro Hosting:                €20
Supabase Database:                 €0 (free tier)
Monitoring & Analytics:            €0 (free tier)
----------------------------------------
Total Monthly Cost:                €330
Client Price:                      €500-800
Profit Margin:                     €170-470
```

### Cost Optimization Strategies
1. **Cache Common Responses:** Save 40% on TTS costs
2. **Use GPT-4o-mini:** 10x cheaper than GPT-4
3. **Batch Analytics Queries:** Reduce database costs
4. **CDN for Audio Assets:** Minimize bandwidth

## 🚀 Implementation Phases

### Day 1: Foundation
- [ ] Vapi account setup
- [ ] Twilio phone configuration  
- [ ] Basic webhook deployment
- [ ] First successful call

### Days 2-3: Core Features
- [ ] Product search implementation
- [ ] Inventory checking
- [ ] Price quotes
- [ ] Multi-language support

### Days 4-5: Business Logic
- [ ] Appointment booking
- [ ] Order status tracking
- [ ] FAQ responses
- [ ] Hours/location info

### Days 6-7: Polish
- [ ] Conversation flow optimization
- [ ] Error handling
- [ ] Caching layer
- [ ] Testing scenarios

### Days 8-10: Production Prep
- [ ] Load testing
- [ ] Monitoring setup
- [ ] Analytics dashboard
- [ ] Documentation

### Days 11-14: Go-Live
- [ ] Client training
- [ ] Soft launch with limited hours
- [ ] Performance monitoring
- [ ] Quick fixes and adjustments

## ✅ Acceptance Criteria

### Demo Acceptance
- [ ] Receives calls successfully
- [ ] Basic conversation works
- [ ] No major errors in 10 test calls

### MVP Acceptance  
- [ ] All core features functional
- [ ] 50 test calls completed
- [ ] <2% error rate
- [ ] Client approval on voice/personality

### Production Acceptance
- [ ] 100 calls handled successfully
- [ ] Monitoring dashboard operational
- [ ] Cost per call <€0.50
- [ ] Customer satisfaction >4/5
- [ ] Documentation complete

## 🚨 Risk Mitigation

### Technical Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Vapi service outage | High | Fallback to voicemail with callback |
| High latency | Medium | Cache responses, optimize webhooks |
| Language detection fails | Low | Manual language selection option |

### Business Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Low adoption rate | High | Training sessions, gradual rollout |
| Negative customer feedback | Medium | Quick iteration, human fallback |
| Cost overrun | Low | Usage alerts, spending caps |

## 📚 Documentation Requirements

### For Qualia Solutions
- [ ] Technical architecture document
- [ ] API endpoint documentation
- [ ] Deployment runbook
- [ ] Cost optimization guide

### For Armenius Store
- [ ] User guide for monitoring dashboard
- [ ] FAQ for common issues
- [ ] Escalation procedures
- [ ] Monthly report template

---

**Document Version:** 1.0  
**Last Updated:** August 2025  
**Status:** Ready for Implementation  
**Next Review:** Post-Demo Completion