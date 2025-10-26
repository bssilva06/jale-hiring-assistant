# Setup Guide

Comprehensive setup instructions for the Jale AI Hiring Assistant.

## Prerequisites

### Required Software
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** (for cloning the repository)

### Required Services
- **Supabase Account** - [Create free account](https://supabase.com)
- **Anthropic API Key** - [Get API key](https://console.anthropic.com)

### Optional Services
- **Gmail Account** - For email notifications (SMTP)
- **n8n** - For workflow automation
- **Twilio Account** - For SMS notifications (optional)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/bssilva06/jale-hiring-assistant.git
cd jale-hiring-assistant
```

### 2. Supabase Setup

#### Create a New Project

1. Log in to [Supabase](https://supabase.com)
2. Click "New Project"
3. Enter project details:
   - Name: `jale-hiring-assistant`
   - Database Password: (save this securely)
   - Region: (select closest to you)
4. Wait for project creation (2-3 minutes)

#### Create Database Tables

Run the following SQL in the Supabase SQL Editor:

```sql
-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  pay DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  schedule TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  job_type TEXT NOT NULL DEFAULT 'full-time',
  language TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  skills TEXT[] NOT NULL,
  experience_years INTEGER,
  certifications TEXT[],
  education TEXT,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

-- Interviews table
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  meeting_link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  decision TEXT,
  rating DECIMAL(2,1),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL,
  reasoning TEXT,
  strengths TEXT[],
  red_flags TEXT[],
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat history table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  sender TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX idx_matches_job_id ON matches(job_id);
CREATE INDEX idx_matches_candidate_id ON matches(candidate_id);
```

#### Get API Credentials

1. Navigate to Project Settings > API
2. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`, keep this secret!)

### 3. Anthropic Claude Setup

1. Visit [Anthropic Console](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Click "Create Key"
5. Copy the API key (starts with `sk-ant-...`)

### 4. Frontend Configuration

```bash
cd frontend
npm install
```

Create `.env.local` in the `frontend` directory:

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_API_URL=http://localhost:5000
```

**Important:** Replace the placeholder values with your actual credentials.

### 5. Backend Configuration

```bash
cd ../backend
npm install
```

Create `.env` in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# Anthropic Claude AI
ANTHROPIC_API_KEY=your-claude-api-key

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# n8n Automation (Optional)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-webhook-id

# Twilio SMS (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google Account
2. Go to Google Account > Security > App Passwords
3. Generate an app password for "Mail"
4. Use this 16-character password in `SMTP_PASS`

### 6. n8n Setup (Optional)

n8n enables workflow automation for email/SMS notifications.

#### Install n8n

```bash
npm install -g n8n
```

#### Start n8n

```bash
n8n
```

Access n8n at `http://localhost:5678`

#### Import Workflows

1. In n8n, click "Workflows" > "Import from File"
2. Import workflows from `n8n-workflows/` directory:
   - `interview-reminders.json`
   - `application-notifications.json`

#### Configure Webhooks

1. Open each workflow
2. Copy the webhook URL
3. Update `N8N_WEBHOOK_URL` in backend `.env`

## Running the Application

### Start All Services

#### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
Connected to Supabase
```

#### Terminal 2: Frontend

```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

#### Terminal 3: n8n (Optional)

```bash
n8n
```

Access n8n dashboard at `http://localhost:5678`

## Verification

### Test Backend Health

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-25T..."
}
```

### Test Frontend

1. Open `http://localhost:3000`
2. Verify landing page loads
3. Navigate to `/dashboard` (employer portal)
4. Navigate to `/apply` (candidate portal)

### Test Database Connection

1. Create a test job posting
2. Verify it appears in Supabase database
3. Check the `jobs` table in Supabase dashboard

### Test AI Integration

1. Navigate to a job posting
2. Open the chatbot
3. Ask a question in English
4. Verify AI response
5. Try again in Spanish

## Troubleshooting

### Backend Won't Start

**Error:** `EADDRINUSE: Port 5000 already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Frontend Build Errors

**Error:** `Module not found: Can't resolve 'react'`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Supabase Connection Failed

**Error:** `fetch failed` or `Invalid API key`

**Solution:**
1. Verify `SUPABASE_URL` and keys are correct
2. Check Supabase project is active
3. Ensure no trailing slashes in URL

### CORS Errors

**Error:** `Access-Control-Allow-Origin`

**Solution:**
Ensure backend has CORS enabled in `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Email Not Sending

**Error:** `Invalid login` or `Authentication failed`

**Solution:**
1. Verify Gmail app password is correct
2. Ensure 2FA is enabled on Google Account
3. Check `SMTP_USER` and `SMTP_PASS` in `.env`
4. Try sending test email:
   ```bash
   curl -X POST http://localhost:5000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"to":"your-email@example.com"}'
   ```

### Claude API Errors

**Error:** `401 Unauthorized` or `Invalid API key`

**Solution:**
1. Verify `ANTHROPIC_API_KEY` starts with `sk-ant-`
2. Check API key is active in Anthropic Console
3. Ensure you have credits/quota available

## Production Deployment

### Environment Variables

Update for production:

```env
NODE_ENV=production
REACT_APP_API_URL=https://your-api-domain.com
```

### Frontend Deployment

#### Build for Production

```bash
cd frontend
npm run build
```

#### Deploy Options

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Backend Deployment

#### Recommended Platforms

- **Render** - Easy Node.js deployment
- **Railway** - Simple with database support
- **Heroku** - Classic PaaS
- **AWS EC2** - Full control

#### Deploy to Render

1. Push code to GitHub
2. Connect Render to repository
3. Add environment variables
4. Deploy

### Database

Supabase automatically handles:
- Backups
- Scaling
- Security
- SSL

No additional configuration needed.

## Security Best Practices

### Protect API Keys

- Never commit `.env` files
- Add `.env` to `.gitignore`
- Use different keys for dev/prod
- Rotate keys regularly

### Database Security

Enable Row-Level Security (RLS) in Supabase:

```sql
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
```

### HTTPS

Use HTTPS in production:
- Frontend: Handled by Vercel/Netlify
- Backend: Use nginx or platform SSL

## Monitoring

### Recommended Tools

- **Supabase Logs** - Database queries
- **Anthropic Dashboard** - AI API usage
- **Google Analytics** - User tracking
- **Sentry** - Error tracking

## Backup

### Database Backups

Supabase provides automatic daily backups.

Manual backup:
1. Supabase Dashboard > Database > Backups
2. Click "Download Backup"

### Code Backup

```bash
git push origin main
```

Recommended: Enable GitHub Actions for automated backups.

## Next Steps

After setup:

1. **Create Test Data** - Add sample jobs and candidates
2. **Test All Flows** - Employer and candidate workflows
3. **Configure Branding** - Update colors and logos
4. **Set Up Monitoring** - Add analytics and error tracking
5. **Review Security** - Implement authentication

## Getting Help

- **Documentation:** Check `docs/` folder
- **API Reference:** See `docs/API_REFERENCE.md`
- **Architecture:** See `docs/ARCHITECTURE.md`
- **GitHub Issues:** [Report bugs](https://github.com/bssilva06/jale-hiring-assistant/issues)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [n8n Documentation](https://docs.n8n.io)
