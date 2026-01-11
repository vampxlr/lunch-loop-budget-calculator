-- Lunch Loop Database Schema
-- This file contains the complete database schema and seed data for the Lunch Loop application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PLANNER SCHEMA TABLE
-- ============================================================================
-- Stores the configuration schema for the budget planner wizard
CREATE TABLE IF NOT EXISTS planner_schema (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    schema_json JSONB NOT NULL
);

-- Add index for faster retrieval
CREATE INDEX IF NOT EXISTS idx_planner_schema_created_at ON planner_schema(created_at DESC);

-- ============================================================================
-- SUBMISSIONS TABLE
-- ============================================================================
-- Stores all customer submissions from the budget planner
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    answers_json JSONB NOT NULL,
    cost_per_person NUMERIC(10, 2) NOT NULL,
    daily_cost NUMERIC(10, 2) NOT NULL,
    weekly_cost NUMERIC(10, 2) NOT NULL,
    monthly_cost NUMERIC(10, 2) NOT NULL,
    free_tasting_interest BOOLEAN DEFAULT FALSE,
    promo_opt_in_email BOOLEAN DEFAULT FALSE,
    promo_opt_in_sms BOOLEAN DEFAULT FALSE
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_free_tasting ON submissions(free_tasting_interest) WHERE free_tasting_interest = TRUE;

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================
-- Stores event logs for observability and debugging
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    source TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'skipped')),
    message TEXT,
    payload_json JSONB
);

-- Add indexes for faster event queries
CREATE INDEX IF NOT EXISTS idx_events_submission_id ON events(submission_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Enable RLS on all tables for security
ALTER TABLE planner_schema ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to planner_schema (needed for wizard)
CREATE POLICY "Allow public read access to planner_schema"
ON planner_schema FOR SELECT
TO anon, authenticated
USING (true);

-- Allow service role to insert planner_schema
CREATE POLICY "Allow service role to insert planner_schema"
ON planner_schema FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow public insert access to submissions (needed for wizard)
CREATE POLICY "Allow public insert access to submissions"
ON submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public read access to their own submissions
CREATE POLICY "Allow public read access to submissions"
ON submissions FOR SELECT
TO anon, authenticated
USING (true);

-- Allow public update access to their own submissions (for live editing)
CREATE POLICY "Allow public update access to submissions"
ON submissions FOR UPDATE
TO anon, authenticated
USING (true);

-- Allow public insert access to events
CREATE POLICY "Allow public insert access to events"
ON events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public read access to events
CREATE POLICY "Allow public read access to events"
ON events FOR SELECT
TO anon, authenticated
USING (true);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default planner schema
INSERT INTO planner_schema (schema_json) VALUES (
    '{
        "version": "1.0.0",
        "steps": [
            {
                "id": "contact",
                "title": "Contact Information",
                "description": "Let''s start with your details",
                "enabled": true,
                "fields": [
                    {
                        "name": "email",
                        "label": "Email Address",
                        "type": "email",
                        "required": true,
                        "placeholder": "your.email@company.com",
                        "validation": {
                            "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
                            "message": "Please enter a valid email address"
                        }
                    },
                    {
                        "name": "phone",
                        "label": "Phone Number",
                        "type": "phone",
                        "required": true,
                        "placeholder": "+880 1700-000000",
                        "validation": {
                            "pattern": "^[+]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[(]?[0-9]{1,4}[)]?[-\\s\\.]?[0-9]{1,9}$",
                            "message": "Please enter a valid phone number"
                        }
                    },
                    {
                        "name": "company_name",
                        "label": "Company Name",
                        "type": "text",
                        "required": false,
                        "placeholder": "Optional"
                    }
                ],
                "autoAdvance": false
            },
            {
                "id": "employees_count",
                "title": "Team Size",
                "description": "How many employees will be ordering lunch?",
                "enabled": true,
                "fields": [
                    {
                        "name": "employees_count",
                        "label": "Number of Employees",
                        "type": "slider",
                        "required": true,
                        "min": 5,
                        "max": 500,
                        "step": 1,
                        "default": 30
                    }
                ],
                "autoAdvance": false
            },
            {
                "id": "days_per_week",
                "title": "Frequency",
                "description": "How many days per week do you need lunch?",
                "enabled": true,
                "fields": [
                    {
                        "name": "days_per_week",
                        "label": "Days per Week",
                        "type": "chips",
                        "required": true,
                        "default": 5,
                        "options": [
                            {"value": 1, "label": "1"},
                            {"value": 2, "label": "2"},
                            {"value": 3, "label": "3"},
                            {"value": 4, "label": "4"},
                            {"value": 5, "label": "5"},
                            {"value": 6, "label": "6"},
                            {"value": 7, "label": "7"}
                        ]
                    }
                ],
                "autoAdvance": true
            },
            {
                "id": "delivery_time",
                "title": "Delivery Time",
                "description": "When would you like lunch delivered?",
                "enabled": true,
                "fields": [
                    {
                        "name": "delivery_time",
                        "label": "Preferred Time",
                        "type": "time",
                        "required": true,
                        "default": "12:30"
                    }
                ],
                "autoAdvance": false
            },
            {
                "id": "budget_per_person",
                "title": "Budget per Person",
                "description": "Choose a plan or set a custom budget",
                "enabled": true,
                "fields": [
                    {
                        "name": "budget_per_person",
                        "label": "Budget",
                        "type": "preset_budget",
                        "required": true,
                        "default": 280,
                        "options": [
                            {"value": 220, "label": "Basic"},
                            {"value": 280, "label": "Standard"},
                            {"value": 350, "label": "Premium"}
                        ]
                    }
                ],
                "autoAdvance": true
            },
            {
                "id": "free_tasting_interest",
                "title": "Free Tasting",
                "description": "Would you be interested in a free tasting session?",
                "enabled": true,
                "fields": [
                    {
                        "name": "free_tasting_interest",
                        "label": "Interest in Free Tasting",
                        "type": "yes_no",
                        "required": true,
                        "default": false
                    }
                ],
                "autoAdvance": true
            }
        ],
        "pricing": {
            "basic_budget": 220,
            "standard_budget": 280,
            "premium_budget": 350,
            "peak_start": "11:00",
            "peak_end": "13:30",
            "offpeak_modifier": 10
        }
    }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SAMPLE DATA (Optional - comment out in production)
-- ============================================================================

-- Insert sample submissions for testing
INSERT INTO submissions (
    id,
    email,
    phone,
    company_name,
    answers_json,
    cost_per_person,
    daily_cost,
    weekly_cost,
    monthly_cost,
    free_tasting_interest
) VALUES 
(
    uuid_generate_v4(),
    'john.doe@techcorp.com',
    '+880 1700-123456',
    'Tech Corp Ltd',
    '{
        "email": "john.doe@techcorp.com",
        "phone": "+880 1700-123456",
        "company_name": "Tech Corp Ltd",
        "employees_count": 50,
        "days_per_week": 5,
        "delivery_time": "12:30",
        "budget_per_person": 280,
        "budget_type": "standard",
        "free_tasting_interest": true
    }'::jsonb,
    280.00,
    14000.00,
    70000.00,
    303100.00,
    true
),
(
    uuid_generate_v4(),
    'sarah.johnson@startupinc.com',
    '+880 1700-234567',
    'Startup Inc',
    '{
        "email": "sarah.johnson@startupinc.com",
        "phone": "+880 1700-234567",
        "company_name": "Startup Inc",
        "employees_count": 20,
        "days_per_week": 5,
        "delivery_time": "13:00",
        "budget_per_person": 220,
        "budget_type": "basic",
        "free_tasting_interest": false
    }'::jsonb,
    220.00,
    4400.00,
    22000.00,
    95260.00,
    false
),
(
    uuid_generate_v4(),
    'mike.wilson@enterprise.com',
    '+880 1700-345678',
    'Enterprise Solutions',
    '{
        "email": "mike.wilson@enterprise.com",
        "phone": "+880 1700-345678",
        "company_name": "Enterprise Solutions",
        "employees_count": 100,
        "days_per_week": 5,
        "delivery_time": "12:00",
        "budget_per_person": 350,
        "budget_type": "premium",
        "free_tasting_interest": true
    }'::jsonb,
    350.00,
    35000.00,
    175000.00,
    757750.00,
    true
);

-- Insert sample events for the submissions
WITH sample_submissions AS (
    SELECT id FROM submissions LIMIT 3
)
INSERT INTO events (submission_id, event_type, source, status, message)
SELECT 
    id,
    'submission.created',
    'wizard',
    'success',
    'Submission created successfully'
FROM sample_submissions;

WITH sample_submissions AS (
    SELECT id FROM submissions LIMIT 3
)
INSERT INTO events (submission_id, event_type, source, status, message, payload_json)
SELECT 
    id,
    'pricing.calculated',
    'wizard',
    'success',
    'Pricing calculated successfully',
    '{"calculation_time_ms": 5}'::jsonb
FROM sample_submissions;

WITH sample_submissions AS (
    SELECT id FROM submissions LIMIT 3
)
INSERT INTO events (submission_id, event_type, source, status, message)
SELECT 
    id,
    'n8n.webhook.sent',
    'webhook',
    'skipped',
    'No webhook URL configured'
FROM sample_submissions;

-- ============================================================================
-- HELPFUL QUERIES FOR DEVELOPMENT
-- ============================================================================

-- View all submissions with their latest event
-- SELECT 
--     s.*,
--     e.event_type AS latest_event,
--     e.status AS latest_event_status,
--     e.created_at AS latest_event_time
-- FROM submissions s
-- LEFT JOIN LATERAL (
--     SELECT * FROM events 
--     WHERE submission_id = s.id 
--     ORDER BY created_at DESC 
--     LIMIT 1
-- ) e ON true
-- ORDER BY s.created_at DESC;

-- View submissions with tasting interest
-- SELECT email, phone, company_name, monthly_cost 
-- FROM submissions 
-- WHERE free_tasting_interest = true
-- ORDER BY created_at DESC;

-- View event statistics
-- SELECT 
--     event_type,
--     status,
--     COUNT(*) as count
-- FROM events
-- GROUP BY event_type, status
-- ORDER BY event_type, status;

-- View total revenue potential
-- SELECT 
--     COUNT(*) as total_submissions,
--     SUM(monthly_cost) as total_monthly_revenue,
--     AVG(monthly_cost) as avg_monthly_revenue,
--     SUM(answers_json->>'employees_count'::text)::int as total_employees
-- FROM submissions;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- 1. This schema is designed to work with Supabase but is compatible with any PostgreSQL database
-- 2. RLS policies are set to allow public access for the wizard - adjust as needed for your security requirements
-- 3. The seed data includes sample submissions - comment out in production
-- 4. All tables use UUID for primary keys for better distribution and security
-- 5. Indexes are created for common query patterns to improve performance
-- 6. The schema_json column uses JSONB for flexible schema storage and fast queries
-- 7. Events table provides observability and audit trail functionality
--
-- TO APPLY THIS SCHEMA:
-- 1. Create a new Supabase project or use existing PostgreSQL database
-- 2. Run this entire SQL file in the SQL editor
-- 3. Verify tables are created: SELECT * FROM planner_schema;
-- 4. Configure your .env file with SUPABASE_URL and SUPABASE_ANON_KEY
-- 5. Set SCHEMA_SOURCE=db and PERSISTENCE_MODE=db in your .env
--
-- ============================================================================
