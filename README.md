# Lunch Loop - Office Lunch Budget Planner

A production-ready, feature-rich budget planner application built with Next.js, TypeScript, and modern web technologies. This portfolio demo showcases advanced patterns including schema-driven wizards, live-editable results, admin dashboards, and optional Supabase persistence with graceful fallbacks.

## Features

### Wizard Interface
- **Schema-Driven Steps**: All wizard steps are configured via a centralized schema
- **Strict Navigation**: Back and Next buttons on every step with proper state management
- **Auto-Advance**: Configurable per-step auto-advance for single-select options
- **Field Validation**: Real-time validation with custom patterns and error messages
- **Framer Motion Animations**: Smooth transitions between steps

### Steps
1. **Contact** - Email and phone validation with optional company name
2. **Team Size** - Interactive slider with configurable min/max/step values
3. **Frequency** - Single-select chips for days per week (1-7)
4. **Delivery Time** - 12-hour time picker with AM/PM (stored as 24h)
5. **Budget** - Preset plans (Basic/Standard/Premium) or custom amount
6. **Free Tasting** - Yes/No with auto-advance

### Results Page
- **Live Editing**: Edit all answers inline with instant recalculation
- **Cost Breakdown**: Per-person, daily, weekly, and monthly costs
- **Contact Display**: Shows configurable contact phone number
- **Finalize Action**: Submit and trigger webhook integration

### Admin Dashboard
- **Authentication**: Optional login (configurable via env)
- **Overview**: Statistics and submissions table with search
- **Submission Detail**: Full view with event timeline and webhook resend
- **Planner Editor**: Edit schema, pricing, and step configuration
- **Dark/Light Theme**: Next-themes integration

### Technical Features
- **Fallback System**: Never crashes if Supabase or env vars are missing
- **Schema Sources**: File → Database with localStorage overrides
- **Persistence Modes**: localStorage → Supabase with automatic fallback
- **Event Logging**: Full observability for debugging and analytics
- **n8n Integration**: Optional webhook with shared secret authentication
- **Mobile-First**: Responsive design with minimal taps
- **TypeScript**: Full type safety across the application

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animation**: Framer Motion
- **Theme**: next-themes (Dark + Light)
- **Database**: Supabase (optional)
- **Validation**: Custom patterns + Zod-ready

## Project Structure

```
lunch-loop/
├── app/
│   ├── dashboard/
│   │   ├── login/page.tsx           # Admin login
│   │   ├── planner-editor/page.tsx  # Schema editor
│   │   ├── submissions/[id]/page.tsx # Submission detail
│   │   └── page.tsx                 # Dashboard overview
│   ├── results/[id]/page.tsx        # Results with live editing
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Wizard
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── wizard/                      # Wizard step components
│   ├── DashboardLayout.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── config/
│   └── plannerSchema.ts             # Default schema
├── lib/
│   ├── auth.ts                      # Authentication helpers
│   ├── config.ts                    # Config resolution with fallbacks
│   ├── pricing.ts                   # Cost calculation logic
│   ├── storage.ts                   # Unified storage layer
│   ├── supabase.ts                  # Supabase client setup
│   ├── utils.ts                     # Utilities
│   └── webhook.ts                   # n8n integration
├── supabase/
│   └── schema.sql                   # Database schema + seed
├── types/
│   ├── schema.ts                    # Schema type definitions
│   └── submission.ts                # Submission types
├── .env.example                     # Environment variables template
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Schema source: "file" | "db" (default: file)
SCHEMA_SOURCE=file

# Config source: "dummy" | "env" | "db" (default: dummy)
CONFIG_SOURCE=dummy

# Persistence mode: "local" | "db" (default: local)
PERSISTENCE_MODE=local

# Supabase (optional - only needed if using db mode)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Contact phone (optional, fallback: +8801700000000)
CONTACT_PHONE=+8801700000000

# n8n webhook (optional)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/lunch-loop
N8N_SHARED_SECRET=your-shared-secret

# Admin authentication (default: false)
ADMIN_AUTH_ENABLED=false
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the wizard.

## Configuration Modes

The application supports three configuration layers with automatic fallbacks:

### Schema Source
- **file** (default): Uses `/config/plannerSchema.ts` with localStorage overrides
- **db**: Loads schema from Supabase `planner_schema` table

### Config Source
- **dummy** (default): Uses hardcoded fallback values
- **env**: Loads from environment variables
- **db**: Fetches from Supabase (future enhancement)

### Persistence Mode
- **local** (default): Stores submissions in localStorage
- **db**: Stores in Supabase with automatic fallback to local

## Supabase Setup (Optional)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

### 2. Run Schema Migration

1. Open Supabase SQL Editor
2. Copy contents of `supabase/schema.sql`
3. Run the SQL script
4. Verify tables: `planner_schema`, `submissions`, `events`

### 3. Update Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SCHEMA_SOURCE=db
PERSISTENCE_MODE=db
```

### 4. Test the Connection

The app will automatically:
- Load schema from database
- Store submissions in Supabase
- Log events to database
- Fall back to localStorage if connection fails

## n8n Webhook Integration

### Setup

1. Create an n8n workflow with a Webhook trigger
2. Configure the webhook URL in `.env.local`
3. Optional: Add shared secret for authentication

### Webhook Payload

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
  "timestamp": "2024-01-01T12:00:00Z"
}
```

Headers:
- `Content-Type: application/json`
- `x-shared-secret: your-secret` (if configured)

### Event Logging

All webhook attempts are logged:
- `n8n.webhook.sent` - Success/Failed/Skipped
- `n8n.webhook.rerun` - Manual resend from dashboard

## Admin Dashboard

### Access

- URL: `/dashboard`
- Default credentials: `admin` / `admin`
- Auth can be disabled via `ADMIN_AUTH_ENABLED=false`

### Features

1. **Overview** - Statistics and submissions list with search
2. **Submission Detail** - Full details with event timeline
3. **Webhook Resend** - Manually trigger webhook for any submission
4. **Planner Editor** - Edit schema configuration:
   - Enable/disable steps
   - Configure employee range (min/max/step/default)
   - Set delivery time default
   - Edit budget presets (Basic/Standard/Premium)
   - Configure peak time window
   - Set off-peak modifier

### Schema Editor Persistence

- **File mode**: Saves to localStorage
- **DB mode**: Saves new version to Supabase

## Pricing Logic

```typescript
delivery_modifier = isOffPeak ? offpeak_modifier : 0
cost_per_person = budget_per_person + delivery_modifier
daily_cost = cost_per_person * employees_count
weekly_cost = daily_cost * days_per_week
monthly_cost = weekly_cost * 4.33
```

Peak time is configurable (default: 11:00-13:30)

## Navigation Rules

1. **Back Button**: Visible on all steps, disabled on first step
2. **Next Button**: Disabled until step is valid
3. **Auto-Advance**: Only on single-select steps (days, budget presets, tasting)
4. **Never Auto-Advance**: Text fields, sliders, time pickers

## Validation

- **Email**: RFC-compliant pattern
- **Phone**: International format support
- **Required Fields**: Enforced before enabling Next
- **Real-Time**: Validation happens on change
- **Error Display**: Clear messages below fields

## Event Types

- `submission.created` - New submission saved
- `pricing.calculated` - Costs computed
- `n8n.webhook.sent` - Webhook attempt (success/failed/skipped)
- `n8n.webhook.rerun` - Manual webhook resend

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Environment Variables

Set all required env vars in Vercel dashboard.

### Database

Deploy Supabase schema before first deployment.

## Development

### Adding New Steps

1. Add step definition to `config/plannerSchema.ts`
2. Create step component in `components/wizard/`
3. Add case to `renderStep()` in `app/page.tsx`
4. Update types in `types/schema.ts` if needed

### Modifying Pricing

Edit the `calculateCosts()` function in `lib/pricing.ts` or use the Planner Editor in the dashboard.

### Custom Validation

Add validation patterns in schema fields:

```typescript
{
  name: "field_name",
  validation: {
    pattern: "regex_pattern",
    message: "Error message"
  }
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Code splitting per route
- Lazy loading for large components
- Optimized animations with Framer Motion
- Efficient re-renders with React best practices

## Security

- No sensitive data in client-side code
- Environment variables for secrets
- Supabase RLS policies enabled
- Optional admin authentication
- Input validation and sanitization

## License

MIT License - See LICENSE file for details

## Author

Created as a production-style portfolio demo showcasing:
- Advanced Next.js patterns
- Schema-driven architecture
- Graceful degradation
- Real-world database integration
- Webhook/API integration
- Modern UI/UX practices

## Support

For issues or questions, please create an issue in the repository.

---

Built with Next.js, TypeScript, Tailwind CSS, and modern web technologies.
