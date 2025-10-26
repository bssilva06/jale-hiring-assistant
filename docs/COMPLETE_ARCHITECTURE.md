# Jale AI Hiring Assistant - Complete Architecture Diagram

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         JALE HIRING ASSISTANT                                │
│                    AI-Powered Recruitment Platform                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                                │
│                           Port 3000 - Client Side                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        EMPLOYER PORTAL                               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ 📋 Dashboard                                                         │   │
│  │  ├─► Active Jobs Overview                                           │   │
│  │  ├─► Pending Applications                                           │   │
│  │  ├─► Upcoming Interviews                                            │   │
│  │  └─► Quick Stats                                                    │   │
│  │                                                                       │   │
│  │ 📝 Job Posting (/jobs/new, /jobs/:id)                               │   │
│  │  ├─► Job Title                                                       │   │
│  │  ├─► Company Name ⭐ NEW                                            │   │
│  │  ├─► Description (Rich Text)                                        │   │
│  │  ├─► Pay Rate ($/hr)                                                │   │
│  │  ├─► Location                                                        │   │
│  │  ├─► Job Type (Full-time/Part-time/Contract) ⭐ NEW                │   │
│  │  ├─► Schedule (Days/Hours)                                          │   │
│  │  ├─► Requirements (Array)                                           │   │
│  │  ├─► Language (EN/ES)                                               │   │
│  │  └─► Edit/Update Existing Jobs ⭐ NEW                               │   │
│  │                                                                       │   │
│  │ 💼 Active Jobs (/jobs)                                              │   │
│  │  ├─► Filter: All/Active/Closed                                      │   │
│  │  ├─► Edit Job Postings ⭐ NEW                                       │   │
│  │  ├─► Close Job (Soft Delete)                                        │   │
│  │  └─► Delete Forever (Hard Delete)                                   │   │
│  │                                                                       │   │
│  │ 👥 Applications (/applications/:jobId)                              │   │
│  │  ├─► AI Match Score (0-100%)                                        │   │
│  │  ├─► Candidate Profile                                              │   │
│  │  ├─► Skills Analysis                                                │   │
│  │  ├─► Experience Timeline                                            │   │
│  │  ├─► Status: Submitted → Reviewed → Interview → Decision           │   │
│  │  └─► Schedule Interview                                             │   │
│  │                                                                       │   │
│  │ 📅 Interview Scheduling                                             │   │
│  │  ├─► Date/Time Picker                                               │   │
│  │  ├─► Duration Selection                                             │   │
│  │  ├─► Auto-Generate Jitsi Room                                       │   │
│  │  ├─► Send Email Notifications                                       │   │
│  │  └─► Calendar Integration                                           │   │
│  │                                                                       │   │
│  │ 🎥 Interview Room (/interview/:id)                                  │   │
│  │  ├─► Embedded Jitsi Video                                           │   │
│  │  ├─► Submit Feedback Form                                           │   │
│  │  ├─► Rating (1-5 stars)                                             │   │
│  │  ├─► Decision: Hire/Reject/Maybe                                    │   │
│  │  └─► Notes Section                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        CANDIDATE PORTAL                              │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ 🔍 Job Matcher (/apply/match) ⭐ ENHANCED                           │   │
│  │  ├─► Resume Upload & AI Parsing ⭐ NEW                              │   │
│  │  │   ├─► PDF/TXT Support                                            │   │
│  │  │   ├─► Claude AI Extraction                                       │   │
│  │  │   └─► Auto-Fill Form Fields                                      │   │
│  │  ├─► Personal Info (Name, Email, Phone)                             │   │
│  │  ├─► Preferences:                                                    │   │
│  │  │   ├─► Job Type (Full-time/Part-time) ⭐ ENHANCED                │   │
│  │  │   ├─► Pay Range ($min - $max)                                    │   │
│  │  │   ├─► Location                                                    │   │
│  │  │   └─► Preferred Field                                            │   │
│  │  ├─► Skills (Comma-separated)                                       │   │
│  │  ├─► Certifications                                                 │   │
│  │  ├─► Experience (Years)                                             │   │
│  │  └─► Match Results:                                                 │   │
│  │      ├─► Scoring Breakdown (120 pts, capped at 100%)                │   │
│  │      │   ├─► Schedule/Job Type: 30 pts ⭐ FIXED                     │   │
│  │      │   ├─► Skills: 30 pts (5 per match)                           │   │
│  │      │   ├─► Pay: 25 pts                                            │   │
│  │      │   ├─► Location: 20 pts                                       │   │
│  │      │   └─► Field: 15 pts                                          │   │
│  │      ├─► Match Reasons with Checkmarks ⭐ NEW                       │   │
│  │      └─► Sorted by Best Match                                       │   │
│  │                                                                       │   │
│  │ 📄 Application Form (/apply/:jobId)                                 │   │
│  │  ├─► Resume Upload & AI Parsing ⭐ NEW                              │   │
│  │  ├─► Personal Information                                           │   │
│  │  ├─► Skills & Experience                                            │   │
│  │  ├─► Certifications                                                 │   │
│  │  ├─► Language Preference                                            │   │
│  │  ├─► Duplicate Application Check ⭐ FIXED                           │   │
│  │  └─► AI Chatbot Access                                              │   │
│  │                                                                       │   │
│  │ 💬 AI Chatbot (Bottom-right overlay)                                │   │
│  │  ├─► Job-Specific Q&A                                               │   │
│  │  ├─► Bilingual: English/Spanish                                     │   │
│  │  ├─► Claude 3 Haiku Powered                                         │   │
│  │  ├─► Context-Aware Responses                                        │   │
│  │  └─► Conversation History                                           │   │
│  │                                                                       │   │
│  │ 🎥 Interview Room (Candidate View)                                  │   │
│  │  ├─► Join via Email Link                                            │   │
│  │  ├─► Jitsi Video Conference                                         │   │
│  │  └─► View Feedback After Interview                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

                                      ⬇️

┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Node.js + Express)                        │
│                              Port 5000 - API Server                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           API ROUTES                                 │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                       │   │
│  │ 📋 /api/jobs                                                         │   │
│  │  ├─► GET    /              → Get all jobs                           │   │
│  │  ├─► GET    /:id           → Get job by ID                          │   │
│  │  ├─► POST   /              → Create new job                         │   │
│  │  ├─► PUT    /:id           → Update job ⭐ NEW                      │   │
│  │  └─► DELETE /:id           → Delete job (soft/hard)                 │   │
│  │                                                                       │   │
│  │ 👥 /api/candidates                                                   │   │
│  │  ├─► GET    /              → Get all candidates                     │   │
│  │  ├─► GET    /:id           → Get candidate by ID                    │   │
│  │  ├─► POST   /              → Create application                     │   │
│  │  ├─► POST   /parse-resume-file → Parse PDF/TXT ⭐ NEW              │   │
│  │  ├─► POST   /parse-resume  → Parse text resume ⭐ NEW               │   │
│  │  └─► GET    /:cid/match/:jid → Get AI match score                  │   │
│  │                                                                       │   │
│  │ 📝 /api/applications                                                 │   │
│  │  ├─► GET    /job/:jobId    → Get applications for job               │   │
│  │  ├─► GET    /:id           → Get application details                │   │
│  │  └─► PUT    /:id/status    → Update application status              │   │
│  │                                                                       │   │
│  │ 📅 /api/interviews                                                   │   │
│  │  ├─► POST   /              → Schedule interview                     │   │
│  │  ├─► GET    /:id           → Get interview details                  │   │
│  │  ├─► PUT    /:id/feedback  → Submit interview feedback              │   │
│  │  └─► GET    /upcoming      → Get upcoming interviews                │   │
│  │                                                                       │   │
│  │ 💬 /api/chat                                                         │   │
│  │  └─► POST   /              → Chat with AI (job-specific)            │   │
│  │                                                                       │   │
│  │ ✉️  /api/test-email                                                  │   │
│  │  └─► POST   /              → Test email configuration               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         SERVICES & LOGIC                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                       │   │
│  │ 🤖 Claude AI Service (claudeService.js)                             │   │
│  │  ├─► getMatchScore(candidate, job)                                  │   │
│  │  │   ├─► Model: claude-3-haiku-20240307                             │   │
│  │  │   ├─► Temperature: 0.5 (nuanced matching)                        │   │
│  │  │   ├─► Analyzes: Description + Requirements text ⭐ FIXED         │   │
│  │  │   ├─► Scoring Weights:                                           │   │
│  │  │   │   ├─► Skills: 40 pts (highest priority)                      │   │
│  │  │   │   ├─► Experience: 25 pts                                     │   │
│  │  │   │   ├─► Certifications: 15 pts                                 │   │
│  │  │   │   ├─► Location/Schedule: 10 pts                              │   │
│  │  │   │   └─► Education/Language: 10 pts                             │   │
│  │  │   └─► Returns: score, reasoning, strengths, red_flags            │   │
│  │  │                                                                    │   │
│  │  ├─► getChatResponse(message, jobContext)                           │   │
│  │  │   ├─► Bilingual Support (EN/ES)                                  │   │
│  │  │   ├─► Job-Specific Context                                       │   │
│  │  │   └─► Helpful, Friendly Tone                                     │   │
│  │  │                                                                    │   │
│  │  └─► parseResume(resumeText) ⭐ NEW                                 │   │
│  │      ├─► Extracts: name, email, phone                               │   │
│  │      ├─► Extracts: skills, certifications                           │   │
│  │      ├─► Calculates: experience_years                               │   │
│  │      └─► Returns: Structured JSON                                   │   │
│  │                                                                       │   │
│  │ 📧 Notification Service (notificationService.js)                    │   │
│  │  ├─► Gmail SMTP (Nodemailer)                                        │   │
│  │  ├─► Interview Invitations                                          │   │
│  │  ├─► Application Confirmations                                      │   │
│  │  └─► Status Updates                                                 │   │
│  │                                                                       │   │
│  │ 📅 Scheduling Service (schedulingService.js)                        │   │
│  │  ├─► Create Interview Slots                                         │   │
│  │  ├─► Generate Jitsi Room URLs                                       │   │
│  │  └─► Send Email Notifications                                       │   │
│  │                                                                       │   │
│  │ ⏰ Cron Jobs (Interview Reminders)                                   │   │
│  │  ├─► Daily at 9:00 AM                                               │   │
│  │  ├─► Check upcoming interviews (24hr)                               │   │
│  │  └─► Send reminder emails                                           │   │
│  │                                                                       │   │
│  │ 📄 PDF Parser ⭐ NEW                                                 │   │
│  │  ├─► Library: pdf-parse                                             │   │
│  │  ├─► Extracts text from PDF                                         │   │
│  │  └─► Sends to Claude for parsing                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

                                      ⬇️

┌─────────────────────────────────────────────────────────────────────────────┐
│                       DATABASE (Supabase PostgreSQL)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  📊 Tables & Relationships:                                                  │
│                                                                               │
│  ┌──────────────┐                                                            │
│  │    JOBS      │                                                            │
│  ├──────────────┤                                                            │
│  │ • id         │ ─────┐                                                    │
│  │ • title      │      │                                                     │
│  │ • company    │ ⭐ NEW                                                     │
│  │ • description│      │                                                     │
│  │ • pay        │      │                                                     │
│  │ • location   │      │                                                     │
│  │ • job_type   │ ⭐ NEW (Full-time/Part-time)                              │
│  │ • schedule   │      │                                                     │
│  │ • requirements│     │                                                     │
│  │ • status     │      │                                                     │
│  │ • language   │      │                                                     │
│  │ • created_at │      │                                                     │
│  └──────────────┘      │                                                     │
│                        │                                                     │
│                        ▼                                                     │
│  ┌──────────────┐   ┌────────────────┐                                      │
│  │ CANDIDATES   │   │ APPLICATIONS   │                                      │
│  ├──────────────┤   ├────────────────┤                                      │
│  │ • id         │──►│ • id           │                                      │
│  │ • name       │   │ • job_id       │ (FK → jobs)                          │
│  │ • email      │   │ • candidate_id │ (FK → candidates)                    │
│  │ • phone      │   │ • status       │ (submitted/reviewed/interview...)    │
│  │ • skills     │   │ • match_score  │ (0-100, AI calculated)               │
│  │ • experience │   │ • created_at   │                                      │
│  │ • certs      │   │ • updated_at   │                                      │
│  │ • education  │   └────────────────┘                                      │
│  │ • language   │           │                                                │
│  │ • resume_url │           │                                                │
│  └──────────────┘           │                                                │
│                             ▼                                                │
│                   ┌──────────────────┐                                       │
│                   │   INTERVIEWS     │                                       │
│                   ├──────────────────┤                                       │
│                   │ • id             │                                       │
│                   │ • application_id │ (FK → applications)                   │
│                   │ • scheduled_time │                                       │
│                   │ • duration_min   │                                       │
│                   │ • jitsi_room_id  │                                       │
│                   │ • status         │                                       │
│                   │ • decision       │ (hire/reject/maybe)                   │
│                   │ • rating         │ (1-5 stars)                           │
│                   │ • notes          │                                       │
│                   │ • created_at     │                                       │
│                   └──────────────────┘                                       │
│                                                                               │
│  🔐 Row-Level Security: Enabled                                              │
│  🔄 Real-time Subscriptions: Available                                       │
│  📦 Storage: Resume files (future enhancement)                               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

                                      ⬇️

┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INTEGRATIONS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🤖 Anthropic Claude AI                                                      │
│  ├─► Model: claude-3-haiku-20240307                                         │
│  ├─► Use Cases:                                                              │
│  │   ├─► Candidate-Job Matching (AI Scoring)                                │
│  │   ├─► Resume Parsing & Data Extraction ⭐ NEW                            │
│  │   └─► Chatbot Conversations                                              │
│  └─► API Key: ANTHROPIC_API_KEY (env)                                       │
│                                                                               │
│  📧 Gmail SMTP (Nodemailer)                                                  │
│  ├─► Interview Invitations                                                   │
│  ├─► Application Confirmations                                               │
│  ├─► Daily Reminders                                                         │
│  └─► Config: EMAIL_USER, EMAIL_PASS (env)                                   │
│                                                                               │
│  🎥 Jitsi Meet                                                               │
│  ├─► Auto-generated room IDs                                                 │
│  ├─► Embedded video conferencing                                             │
│  └─► No API key required (open source)                                       │
│                                                                               │
│  🗄️ Supabase                                                                 │
│  ├─► PostgreSQL Database                                                     │
│  ├─► Authentication (future)                                                 │
│  ├─► File Storage (future)                                                   │
│  └─► Config: SUPABASE_URL, SUPABASE_KEY (env)                               │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features Summary

### ⭐ Recently Added Features

1. **Resume Upload & AI Parsing**

   - PDF/TXT file support
   - Claude AI extracts structured data
   - Auto-fills application forms
   - Available in both Application Form and Job Matcher

2. **Job Type Field**

   - Dropdown: Full-time, Part-time, Contract, Temporary, Seasonal
   - Replaces text-based schedule confusion
   - Integrated into matching algorithm (30 points)
   - Clear display in job listings

3. **Company Name Field**

   - Required field in job postings
   - Displays in all job cards
   - Helps candidates identify employers

4. **Edit Job Functionality**

   - Update existing job postings
   - Pre-fills form with current data
   - Maintains application history

5. **Enhanced Job Matching**

   - Fixed schedule/job type matching (30 points)
   - Improved skills matching (searches text fields)
   - Clear match reasons with checkmarks
   - Better scoring breakdown

6. **Duplicate Application Prevention**
   - Early detection before database insert
   - User-friendly error messages
   - Prevents wasted submissions

---

## 🔄 Data Flow Examples

### Example 1: Candidate Application with Resume Upload

```
1. Candidate uploads PDF resume
   ↓
2. Backend extracts text with pdf-parse
   ↓
3. Claude AI parses resume → JSON
   {
     name: "John Doe",
     email: "john@email.com",
     skills: ["forklift", "warehouse"],
     experience_years: 5
   }
   ↓
4. Frontend auto-fills form fields
   ↓
5. Candidate reviews & submits
   ↓
6. Backend checks for duplicate application
   ↓
7. Claude AI calculates match score
   Candidate skills vs Job requirements
   ↓
8. Application saved with match_score
   ↓
9. Employer sees application with AI analysis
```

### Example 2: Job Matching Algorithm

```
1. Candidate fills Job Matcher form
   - Job Type: Full-time
   - Skills: forklift, warehouse
   - Pay: $18-$22/hr
   ↓
2. Fetch all active jobs from database
   ↓
3. For each job, calculate score:
   - Job Type match? +30 pts ✓
   - Skills match? +30 pts (5 per skill)
   - Pay in range? +25 pts ✓
   - Location match? +20 pts
   - Field match? +15 pts
   ↓
4. Sort by match score (descending)
   ↓
5. Display with reasons:
   "✓ Job Type: Full-time matches your Full-time preference"
   "✓ Skills: 2 match (forklift, warehouse)"
   "✓ Pay: $20/hr is within your $18-$22 range"
```

---

## 📊 Technology Stack

| Layer           | Technology            | Purpose                          |
| --------------- | --------------------- | -------------------------------- |
| **Frontend**    | React 19.2.0          | UI Components & State Management |
| **Routing**     | React Router v6       | Client-side navigation           |
| **Styling**     | Tailwind CSS          | Utility-first styling            |
| **Icons**       | Lucide React          | Consistent icon library          |
| **Backend**     | Node.js + Express     | REST API server                  |
| **Database**    | Supabase (PostgreSQL) | Data persistence                 |
| **AI**          | Claude 3 Haiku        | Matching, parsing, chatbot       |
| **PDF Parsing** | pdf-parse             | Resume text extraction           |
| **Email**       | Nodemailer + Gmail    | Notifications                    |
| **Video**       | Jitsi Meet            | Interview conferencing           |
| **Scheduling**  | node-cron             | Daily reminders                  |
| **File Upload** | Multer                | Resume file handling             |

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SETUP                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React)                                            │
│  ├─► Vercel / Netlify                                        │
│  ├─► Environment: REACT_APP_API_URL                          │
│  └─► CDN: Static assets                                      │
│                                                               │
│  Backend (Node.js)                                           │
│  ├─► Heroku / Railway / Render                               │
│  ├─► Environment Variables:                                  │
│  │   ├─► ANTHROPIC_API_KEY                                   │
│  │   ├─► SUPABASE_URL                                        │
│  │   ├─► SUPABASE_KEY                                        │
│  │   ├─► EMAIL_USER                                          │
│  │   └─► EMAIL_PASS                                          │
│  └─► Port: 5000 (configurable)                               │
│                                                               │
│  Database                                                     │
│  └─► Supabase Cloud (managed PostgreSQL)                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Future Enhancements

- [ ] User authentication (employer/candidate roles)
- [ ] Resume storage in Supabase Storage
- [ ] DOC/DOCX resume support
- [ ] Email template builder
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Background job processing
- [ ] Multi-language support (beyond EN/ES)
- [ ] Calendar integrations (Google/Outlook)
- [ ] Salary negotiation AI assistant

---

**Generated:** October 25, 2025
**Version:** 2.0 (Complete Feature Set)
