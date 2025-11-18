---
id: "0003"
title: "Payment Processing Integration"
type: epic
priority: critical
status: in_progress
template_mode: comprehensive
tags: [payments, stripe, architecture, design]
---

# Payment Processing Integration - Technical RFC

## Overview

**System:** Stripe payment integration for subscription billing

**Goal:** Enable secure, PCI-compliant recurring payments with 99.9% uptime

**Scope:** Backend API, webhook handling, subscription management

## Architecture

### High-Level Design

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   React     │────▶│  Node.js API │────▶│   Stripe     │
│  Frontend   │     │   Backend    │     │     API      │
└─────────────┘     └──────────────┘     └──────────────┘
       │                    │                     │
       │                    ▼                     │
       │            ┌──────────────┐              │
       │            │  PostgreSQL  │              │
       │            │   Database   │              │
       │            └──────────────┘              │
       │                    ▲                     │
       └────────────────────┴─────────────────────┘
                     Webhook Events
```

### Components

#### 1. Payment API Service
**Responsibilities:**
- Create Stripe checkout sessions
- Manage subscriptions (create, update, cancel)
- Handle customer data
- Process webhook events

**Tech Stack:**
- Node.js + Express
- Stripe Node SDK v11.x
- PostgreSQL for data storage
- Redis for webhook idempotency

#### 2. Database Schema

```sql
-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_customer_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  plan_id VARCHAR(50) NOT NULL, -- 'monthly' or 'annual'
  status VARCHAR(50) NOT NULL,  -- 'active', 'canceled', 'past_due'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment Events (audit log)
CREATE TABLE payment_events (
  id UUID PRIMARY KEY,
  stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_customers_stripe_id ON customers(stripe_customer_id);
CREATE INDEX idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX idx_events_type ON payment_events(event_type);
CREATE INDEX idx_events_processed ON payment_events(processed);
```

#### 3. API Endpoints

```
POST   /api/payments/checkout              Create checkout session
GET    /api/payments/subscription          Get user's subscription
POST   /api/payments/subscription/cancel   Cancel subscription
POST   /api/payments/subscription/resume   Resume canceled subscription
GET    /api/payments/invoices              List user's invoices
POST   /api/webhooks/stripe                Stripe webhook handler
```

### API Specifications

#### Create Checkout Session

**Endpoint:** `POST /api/payments/checkout`

**Request:**
```json
{
  "planId": "monthly",
  "successUrl": "https://app.example.com/success",
  "cancelUrl": "https://app.example.com/pricing"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Implementation:**
```javascript
async function createCheckoutSession(req, res) {
  const { planId, successUrl, cancelUrl } = req.body;
  const userId = req.user.id;

  // Get or create Stripe customer
  let customer = await getOrCreateCustomer(userId);

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customer.stripeCustomerId,
    mode: 'subscription',
    line_items: [{
      price: PLAN_PRICES[planId],
      quantity: 1
    }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId
    }
  });

  return res.json({
    sessionId: session.id,
    url: session.url
  });
}
```

### Webhook Handling

**Critical Events:**
1. `checkout.session.completed` - Subscription created
2. `customer.subscription.updated` - Status changed
3. `customer.subscription.deleted` - Canceled
4. `invoice.payment_succeeded` - Payment successful
5. `invoice.payment_failed` - Payment failed

**Idempotency Strategy:**
```javascript
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    WEBHOOK_SECRET
  );

  // Check if already processed (idempotency)
  const existing = await db.query(
    'SELECT id FROM payment_events WHERE stripe_event_id = $1',
    [event.id]
  );

  if (existing.rows.length > 0) {
    return res.json({ received: true });
  }

  // Store event
  await db.query(
    'INSERT INTO payment_events (stripe_event_id, event_type, payload) VALUES ($1, $2, $3)',
    [event.id, event.type, event]
  );

  // Process event
  await processEvent(event);

  return res.json({ received: true });
}
```

## Security

### PCI Compliance
- **No card data storage** - Stripe handles all sensitive data
- **Use Stripe Elements** - Pre-built, PCI-compliant UI components
- **HTTPS only** - All API calls over TLS
- **Webhook signature verification** - Prevent spoofing

### API Security
- **Authentication required** - JWT tokens for all endpoints
- **Rate limiting** - 100 requests/minute per user
- **Input validation** - Joi schemas for all inputs
- **SQL injection prevention** - Parameterized queries only

### Secrets Management
```bash
# Environment variables (never commit)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

## Error Handling

### Payment Failures
```javascript
try {
  const session = await stripe.checkout.sessions.create({...});
} catch (error) {
  if (error.type === 'StripeCardError') {
    // Card declined
    return res.status(400).json({
      error: 'Payment declined. Please try another card.'
    });
  } else if (error.type === 'StripeRateLimitError') {
    // Rate limited
    return res.status(429).json({
      error: 'Too many requests. Please try again.'
    });
  } else {
    // Unknown error
    logger.error('Stripe error:', error);
    return res.status(500).json({
      error: 'Payment processing failed. Please contact support.'
    });
  }
}
```

### Retry Strategy
- **Webhook failures:** Exponential backoff (1s, 2s, 4s, 8s, 16s)
- **API calls:** 3 retries with 1s delay
- **Database failures:** Circuit breaker pattern

## Performance

### Caching Strategy
- **Customer lookup:** Redis cache (TTL: 1 hour)
- **Subscription status:** Redis cache (TTL: 5 minutes)
- **Invalidation:** On webhook events

### Database Optimization
- Indexes on foreign keys
- Connection pooling (max 20 connections)
- Query timeout: 5 seconds

### Monitoring
```javascript
// Metrics to track
{
  "checkout_sessions_created": Counter,
  "webhooks_processed": Counter,
  "payment_failures": Counter,
  "api_latency": Histogram,
  "stripe_api_errors": Counter
}
```

## Testing Strategy

### Unit Tests
- Checkout session creation
- Webhook signature verification
- Database operations
- Error handling

### Integration Tests
- Stripe API mock responses
- Database transactions
- Webhook event processing
- End-to-end checkout flow

### Load Testing
- Target: 100 checkouts/minute
- Webhook processing: 1000 events/minute
- Database queries: <100ms p95

## Deployment

### Rollout Plan
1. **Week 1:** Deploy to staging
2. **Week 2:** Internal team testing
3. **Week 3:** Beta users (10% traffic)
4. **Week 4:** Gradual rollout (25%, 50%, 100%)

### Rollback Strategy
- Feature flag: `ENABLE_PAYMENTS`
- Database migrations reversible
- Stripe webhooks can be paused
- Rollback in <5 minutes

### Monitoring Alerts
- Payment success rate <95%
- Webhook processing delay >5 minutes
- API error rate >1%
- Database connection pool exhausted

## Alternatives Considered

### Alternative 1: Braintree
**Pros:** PayPal integration, good documentation
**Cons:** Higher fees, less flexible
**Decision:** Rejected - Stripe more developer-friendly

### Alternative 2: Build Custom Processor
**Pros:** Full control, lower fees
**Cons:** PCI compliance complexity, time to market
**Decision:** Rejected - Too risky, not core competency

## Open Questions

1. **Q:** How to handle failed webhook delivery?
   **A:** Stripe retries for 72 hours. We'll monitor and manually replay if needed.

2. **Q:** Support for annual plan discounts?
   **A:** Use Stripe Coupons API, defer to Phase 2.

3. **Q:** Handling subscription upgrades/downgrades?
   **A:** Proration enabled, changes effective immediately.

## Approval & Sign-off

- [x] **Engineering Lead** (Mike Ross) - Approved 2024-01-12
- [x] **Security** (Alex Kim) - Approved with conditions 2024-01-13
- [ ] **DevOps** (Sam Lee) - Pending infrastructure review
