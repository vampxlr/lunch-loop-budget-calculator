# Lunch Loop - Feature Documentation

Complete feature list and technical details.

## Core Features

### 1. Schema-Driven Wizard

**Description**: Entire wizard flow is configured via a centralized schema, making it easy to modify without touching component code.

**Technical Details**:
- Schema stored in `/config/plannerSchema.ts`
- Can be overridden by database or localStorage
- Type-safe with TypeScript interfaces
- Hot-reloadable in development

**Configuration**:
```typescript
{
  steps: [
    {
      id: "contact",
      title: "Contact Information",
      enabled: true,
      fields: [...],
      autoAdvance: false
    }
  ],
  pricing: {
    basic_budget: 220,
    standard_budget: 280,
    premium_budget: 350,
    peak_start: "11:00",
    peak_end: "13:30",
    offpeak_modifier: 10
  }
}
```

### 2. Strict Navigation System

**Description**: Every step has both Back and Next buttons with intelligent state management.

**Rules**:
- Back button visible on all steps
- Back disabled only on first step
- Next disabled until step is valid
- Validation happens in real-time
- Navigation state persists

**Auto-Advance**:
- Enabled only for single-select steps
- Never on text inputs or sliders
- Configurable per step
- 300ms delay for smooth UX

### 3. Multi-Source Configuration

**Description**: Three-tier fallback system ensures the app never crashes.

**Schema Sources**:
1. **file** (default): Local TypeScript file
2. **db**: Supabase database
3. **localStorage**: User overrides

**Fallback Chain**:
```
db → file → hardcoded defaults
```

**Config Sources**:
1. **dummy**: Hardcoded safe defaults
2. **env**: Environment variables
3. **db**: Database configuration

**Persistence Modes**:
1. **local**: Browser localStorage
2. **db**: Supabase with localStorage fallback

### 4. Live-Editable Results

**Description**: Results page allows inline editing of all submission fields with instant recalculation.

**Features**:
- Edit contact details (email, phone, company)
- Edit order details (employees, days, time, budget)
- Edit tasting interest (yes/no)
- Real-time cost recalculation
- Auto-save on edit completion
- Visual feedback for changes

**Technical**:
- Optimistic updates
- Debounced save operations
- Rollback on error
- Event logging for changes

### 5. Dynamic Pricing Engine

**Description**: Sophisticated pricing calculation with configurable rules.

**Formula**:
```typescript
delivery_modifier = isOffPeak ? offpeak_modifier : 0
cost_per_person = budget_per_person + delivery_modifier
daily_cost = cost_per_person * employees_count
weekly_cost = daily_cost * days_per_week
monthly_cost = weekly_cost * 4.33
```

**Configurable Parameters**:
- Budget presets (Basic/Standard/Premium)
- Peak time window (start/end)
- Off-peak modifier
- Monthly calculation multiplier

**Features**:
- Peak/off-peak detection
- Real-time recalculation
- Currency formatting
- Breakdown display

### 6. Admin Dashboard

**Description**: Full-featured admin panel with authentication, analytics, and management tools.

**Pages**:

**Overview** (`/dashboard`)
- Total submissions count
- Total monthly revenue
- Average employees
- Tasting interest percentage
- Searchable submissions table
- Quick view/detail links

**Submission Detail** (`/dashboard/submissions/[id]`)
- Complete submission information
- Cost breakdown
- Event timeline
- Webhook resend button
- Tasting interest indicator

**Planner Editor** (`/dashboard/planner-editor`)
- Enable/disable steps
- Configure employee range
- Set delivery time default
- Edit budget presets
- Configure peak time window
- Set off-peak modifier
- Save to file or database

**Authentication**:
- Optional (configurable)
- Session-based
- Configurable credentials
- Auto-redirect if enabled

### 7. Event Logging System

**Description**: Complete observability for debugging and analytics.

**Event Types**:
- `submission.created` - New submission saved
- `pricing.calculated` - Costs computed
- `n8n.webhook.sent` - Webhook sent (success/failed/skipped)
- `n8n.webhook.rerun` - Manual webhook resend

**Event Structure**:
```typescript
{
  id: string,
  created_at: string,
  submission_id: string,
  event_type: string,
  source: string,
  status: "success" | "failed" | "skipped",
  message?: string,
  payload_json?: any
}
```

**Storage**:
- Database or localStorage
- Automatic fallback
- Queryable by submission
- Timeline view in dashboard

### 8. n8n Webhook Integration

**Description**: Optional webhook integration for automation and CRM integration.

**Features**:
- Configurable endpoint
- Shared secret authentication
- Automatic retry logic
- Event logging
- Manual resend from dashboard
- Graceful failure handling

**Payload**:
```json
{
  "submission_id": "uuid",
  "email": "customer@example.com",
  "phone": "+880 1700-123456",
  "company_name": "Company Name",
  "answers_json": { ... },
  "cost_per_person": 280.00,
  "daily_cost": 14000.00,
  "weekly_cost": 70000.00,
  "monthly_cost": 303100.00,
  "free_tasting_interest": true,
  "timestamp": "2024-01-01T12:00:00Z",
  "rerun": false
}
```

**Headers**:
- `Content-Type: application/json`
- `x-shared-secret: secret` (if configured)

### 9. Wizard Steps

#### Step 1: Contact Information
- Email validation (RFC-compliant)
- Phone validation (international format)
- Optional company name
- Real-time error display
- Back disabled, Next enabled when valid

#### Step 2: Team Size
- Interactive slider
- Configurable range (default 5-500)
- Large number display
- Min/max indicators
- Default value support

#### Step 3: Frequency
- Single-select chips
- Options 1-7 days
- Visual selection feedback
- Auto-advance enabled
- Mobile-optimized layout

#### Step 4: Delivery Time
- 12-hour format picker
- Hour selection (1-12)
- Minute selection (00/15/30/45)
- AM/PM toggle
- Converts to 24h internally
- Large time display

#### Step 5: Budget per Person
- Preset plan buttons
- Shows price on buttons
- Custom amount option
- Auto-advance for presets
- Manual entry for custom
- Currency formatting

#### Step 6: Free Tasting
- Large Yes/No buttons
- Visual icons
- Description text
- Auto-advance enabled
- No follow-up questions

### 10. Theme System

**Description**: Full dark/light mode support with system preference detection.

**Features**:
- System preference detection
- Manual toggle
- Persistent selection
- Smooth transitions
- Optimized colors for both modes
- Tailwind CSS integration

**Implementation**:
- next-themes provider
- CSS variables for colors
- Class-based switching
- No flash on load

### 11. Responsive Design

**Description**: Mobile-first design that works on all screen sizes.

**Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Features**:
- Touch-optimized controls
- Minimal taps required
- Readable text sizes
- Appropriate spacing
- Collapsible navigation
- Grid layouts adapt

### 12. Type Safety

**Description**: Full TypeScript coverage with strict mode enabled.

**Benefits**:
- Compile-time error detection
- IntelliSense support
- Refactoring confidence
- Self-documenting code
- Type inference

**Key Types**:
- `PlannerSchema` - Schema structure
- `StepConfig` - Step configuration
- `Submission` - Submission data
- `Event` - Event log entries
- `ComputedCosts` - Cost breakdown

### 13. Performance Optimizations

**Description**: Fast load times and smooth interactions.

**Techniques**:
- Code splitting per route
- Lazy loading components
- Optimized animations
- Debounced operations
- Efficient re-renders
- Memoization where needed

**Metrics**:
- FCP < 1.5s
- TTI < 3s
- CLS < 0.1
- Smooth 60fps animations

### 14. Error Handling

**Description**: Graceful degradation and user-friendly error messages.

**Strategies**:
- Try-catch blocks
- Fallback values
- Console warnings
- User notifications
- Recovery options
- Event logging

**Examples**:
- Database unavailable → localStorage
- Schema load error → default schema
- Webhook failure → logged and skipped
- Validation error → clear message

### 15. Accessibility

**Description**: WCAG 2.1 AA compliance for inclusive design.

**Features**:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast
- Screen reader support

**Testing**:
- Keyboard-only navigation
- Screen reader compatibility
- Color blindness simulation
- High contrast mode

## Feature Flags

Control features via environment variables:

```env
SCHEMA_SOURCE=file|db
CONFIG_SOURCE=dummy|env|db
PERSISTENCE_MODE=local|db
ADMIN_AUTH_ENABLED=true|false
```

## Extensibility

### Adding New Steps

1. Define in schema
2. Create component
3. Add to renderer
4. Update types

### Custom Validation

Add patterns to field definitions:

```typescript
validation: {
  pattern: "regex",
  message: "error"
}
```

### Custom Pricing Rules

Modify `calculateCosts()` function:

```typescript
export function calculateCosts(
  answers: SubmissionAnswers,
  pricingConfig: PricingConfig
): ComputedCosts {
  // Add custom logic here
}
```

### New Event Types

Add to event logging:

```typescript
await logEvent(
  submissionId,
  "custom.event",
  "source",
  "success"
);
```

## Integration Points

### 1. CRM Integration
- Webhook payload contains all data
- Can trigger workflows in Zapier, n8n, Make.com
- Real-time notifications possible

### 2. Analytics
- Event logging provides audit trail
- Can export to analytics platforms
- Custom tracking easily added

### 3. Email Marketing
- Collect email addresses
- Tasting interest flag
- Can sync to Mailchimp, SendGrid, etc.

### 4. Payment Processing
- Cost calculations ready
- Can integrate Stripe, PayPal
- Monthly cost for subscriptions

## Security Features

1. **Input Validation**: All inputs validated client and server-side
2. **Environment Variables**: Secrets never in code
3. **RLS Policies**: Supabase row-level security
4. **HTTPS Only**: Force secure connections
5. **XSS Protection**: React automatic escaping
6. **CSRF Protection**: Next.js built-in
7. **Rate Limiting**: Can add Vercel rate limiting

## Browser Compatibility

- Chrome/Edge 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- iOS Safari 14+ ✓
- Chrome Mobile ✓

## Future Enhancements

Potential additions:
- [ ] Multi-language support
- [ ] PDF export of results
- [ ] Email confirmations
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] A/B testing
- [ ] Custom branding
- [ ] White-label mode
- [ ] API endpoints
- [ ] Mobile apps

---

This is a production-ready application showcasing modern web development best practices.
