# Jale Backend - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

### Step 2: Set Up Environment Variables

1. Copy the example file:

```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:

```env
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Optional (for emails)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Getting API Keys:**

- **Supabase**: Go to [supabase.com](https://supabase.com) → Your Project → Settings → API
- **Anthropic**: Sign up at [console.anthropic.com](https://console.anthropic.com)
- **Gmail**: Use [App Passwords](https://support.google.com/accounts/answer/185833) for EMAIL_PASSWORD

### Step 3: Run the Server

```bash
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:5000
📋 Health check: http://localhost:5000/health
💼 Jobs API: http://localhost:5000/api/jobs
👤 Candidates API: http://localhost:5000/api/candidates
📅 Interviews API: http://localhost:5000/api/interviews
💬 Chat API: http://localhost:5000/api/chat
📅 Interview reminder cron job initialized (9:00 AM daily)
```

### Step 4: Test It!

Open a new terminal and test the health endpoint:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{ "status": "OK", "message": "Jale Backend Running" }
```

## 📝 Database Setup

Make sure your Supabase database has these tables. You can run this SQL in the Supabase SQL editor:

```sql
-- Jobs table
CREATE TABLE jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    pay DECIMAL NOT NULL,
    schedule TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    description TEXT,
    language TEXT DEFAULT 'en',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Candidates table
CREATE TABLE candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    skills TEXT[] DEFAULT '{}',
    experience_years INTEGER DEFAULT 0,
    certifications TEXT[] DEFAULT '{}',
    language_preference TEXT DEFAULT 'en',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(job_id, candidate_id)
);

-- Interviews table
CREATE TABLE interviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP NOT NULL,
    interview_type TEXT DEFAULT 'video',
    meeting_link TEXT,
    notes TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Matches table (for storing AI match results)
CREATE TABLE matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    match_score INTEGER NOT NULL,
    reasoning TEXT,
    strengths TEXT[] DEFAULT '{}',
    red_flags TEXT[] DEFAULT '{}',
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(candidate_id, job_id)
);

-- Create indexes for performance
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON interviews(status);
CREATE INDEX idx_chat_messages_job_candidate ON chat_messages(job_id, candidate_id);
CREATE INDEX idx_matches_candidate_job ON matches(candidate_id, job_id);
```

## 🧪 Quick API Tests

### Create a Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Warehouse Associate",
    "company": "ABC Logistics",
    "location": "Dallas, TX",
    "pay": 18.50,
    "schedule": "Monday-Friday, 8am-5pm",
    "requirements": ["Forklift certified", "2+ years experience"],
    "description": "Join our team!",
    "language": "en"
  }'
```

### Get All Jobs

```bash
curl http://localhost:5000/api/jobs
```

### Submit Application

```bash
curl -X POST http://localhost:5000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "your-job-id-here",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "skills": ["Forklift", "Inventory"],
    "experience_years": 3,
    "certifications": ["Forklift certified"],
    "language_preference": "en"
  }'
```

### Chat with AI

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "your-job-id-here",
    "message": "What is the pay for this position?",
    "language": "en"
  }'
```

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Make sure you've created `.env` file with `SUPABASE_URL` and `SUPABASE_ANON_KEY`

### Issue: "Error getting match score from Claude"

**Solution**: Verify your `ANTHROPIC_API_KEY` is correct and you have API credits

### Issue: Email notifications not working

**Solution**: This is optional. Set `EMAIL_*` variables in `.env` to enable. Works fine without it.

### Issue: Port 5000 already in use

**Solution**: Change `PORT=5001` in your `.env` file

## 📚 Next Steps

1. **Test all endpoints** using the API examples above
2. **Connect your frontend** - Update frontend API URLs to `http://localhost:5000`
3. **Add sample data** - Create a few jobs and candidates for testing
4. **Set up email** - Configure email settings for notifications (optional)
5. **Deploy** - Ready to deploy to Railway, Render, or Heroku!

## 🎯 What's Working

✅ Job posting CRUD  
✅ Candidate applications  
✅ AI-powered matching with Claude  
✅ Bilingual chatbot (English/Spanish)  
✅ Interview scheduling  
✅ Email notifications (if configured)  
✅ Automated reminders  
✅ Error handling  
✅ CORS enabled

## 💡 Tips for Hackathon

- **Demo Mode**: Works without email configuration
- **Fast AI**: Using Claude Haiku (fastest model)
- **Bilingual**: Chatbot auto-detects English/Spanish
- **Ready to Present**: Clean API responses, good error messages

---

Need help? Check the main README or API documentation! 🚀
