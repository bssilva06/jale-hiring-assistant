# Jale Frontend - Quick Start Guide

## 🎉 Frontend Setup Complete!

The frontend is now fully built with all components and pages ready to go!

## 📁 What's Been Created

### ✅ Core Setup

- ✅ Environment configuration (`.env.local`)
- ✅ Tailwind CSS styling with custom utilities
- ✅ React Router for navigation
- ✅ API service layer (Axios)
- ✅ Supabase client
- ✅ Helper utilities and constants

### ✅ Shared Components

- ✅ `Button` - Reusable button with variants
- ✅ `Modal` - Modal dialog component
- ✅ `Card` - Card container component

### ✅ Layout Components

- ✅ `Navbar` - Top navigation bar
- ✅ `Sidebar` - Collapsible sidebar menu

### ✅ Hiring Manager Components

- ✅ `JobPostForm` - Create new job postings
- ✅ `CandidateList` - Display and filter candidates
- ✅ `InterviewScheduler` - Schedule interviews

### ✅ Candidate Components

- ✅ `ApplicationForm` - Submit job applications
- ✅ `ChatBot` - AI chatbot widget (bilingual)

### ✅ Pages

- ✅ `Dashboard` - Hiring manager dashboard with stats
- ✅ `JobPosting` - Job posting page
- ✅ `CandidatePortal` - Candidate application portal
- ✅ `InterviewRoom` - Video interview room with Jitsi

## 🚀 Next Steps

### 1. Configure Environment Variables

Edit `frontend/.env.local` and add your API keys:

```env
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_API_URL=http://localhost:5000
```

### 2. Install Dependencies (if not done)

```bash
cd frontend
npm install
```

### 3. Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🧭 Navigation & Routes

### Candidate Routes

- `/apply` - Job application portal
- `/apply/:jobId` - Apply for specific job

### Hiring Manager Routes

- `/dashboard` - Main dashboard with stats
- `/jobs/new` - Post a new job
- `/candidates` - View all candidates
- `/interviews` - Manage interviews
- `/interviews/schedule/:applicationId` - Schedule interview
- `/interviews/room/:interviewId` - Video interview room

## 🎨 Key Features

### For Candidates

1. **Application Form** - Submit applications with skills and experience
2. **AI Chatbot** - Ask questions about jobs in English or Spanish
3. **Job Details** - View job requirements, pay, location, schedule

### For Hiring Managers

1. **Dashboard** - Stats overview (jobs, applications, interviews, hires)
2. **Job Posting** - Create jobs with automated outreach
3. **Candidate Matching** - View match scores and filtering
4. **Interview Scheduling** - Schedule with automatic reminders
5. **Video Interviews** - Jitsi integration with feedback forms

## 🔌 Backend Integration

The frontend is configured to connect to the backend at `http://localhost:5000`.

**Make sure your teammate has:**

1. Backend server running on port 5000
2. API endpoints implemented for:
   - `/api/jobs` (GET, POST)
   - `/api/candidates` (GET, POST)
   - `/api/applications` (GET, POST)
   - `/api/interviews` (GET, POST, PATCH)
   - `/api/chat` (POST)

## 🛠️ Tech Stack Used

- **React 19** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP requests
- **Supabase** - Database client
- **Jitsi Meet** - Video interviews
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📱 Mobile Responsive

All components are built mobile-first with Tailwind's responsive classes. Test on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Demo Flow

1. **Hiring Manager** creates job → `/jobs/new`
2. **System** sends automated outreach (n8n workflow)
3. **Candidate** applies → `/apply/:jobId`
4. **AI** calculates match score (Claude)
5. **Hiring Manager** reviews candidates → `/candidates`
6. **Hiring Manager** schedules interview → `/interviews/schedule/:id`
7. **System** sends reminders (n8n workflow)
8. **Video Interview** → `/interviews/room/:id`
9. **Hiring Manager** submits feedback
10. **System** updates candidate status

## 🎨 Customization

### Colors (in `tailwind.config.js`)

```javascript
colors: {
  primary: '#3B82F6',   // Blue
  secondary: '#10B981', // Green
  accent: '#F59E0B',    // Amber
}
```

### Custom CSS Classes (in `index.css`)

- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.badge-green` - Green badge
- `.badge-yellow` - Yellow badge
- `.badge-red` - Red badge
- `.input-field` - Standard input field

## 🐛 Troubleshooting

### Tailwind styles not working

- Restart dev server: `npm start`
- Check `tailwind.config.js` content paths

### API errors

- Verify backend is running: `http://localhost:5000/health`
- Check `.env.local` has correct `REACT_APP_API_URL`

### Supabase connection issues

- Verify Supabase credentials in `.env.local`
- Check Supabase project is active

### Jitsi not loading

- Check internet connection
- Verify Jitsi domain in code (defaults to `meet.jit.si`)

## 📞 Working with Your Backend Teammate

**Tell them you need these API endpoints:**

1. **POST /api/jobs** - Create job
2. **GET /api/jobs** - List jobs
3. **GET /api/jobs/:id** - Get job details
4. **POST /api/candidates** - Submit application
5. **GET /api/candidates** - List candidates
6. **POST /api/candidates/match** - Get match score
7. **GET /api/applications** - List applications
8. **GET /api/applications/:id** - Get application details
9. **POST /api/interviews** - Schedule interview
10. **GET /api/interviews** - List interviews
11. **PATCH /api/interviews/:id** - Update interview
12. **POST /api/chat** - Send chat message to AI

## ✨ You're Ready!

The frontend is complete and ready to demo! Just make sure:

1. ✅ Environment variables configured
2. ✅ Backend API running
3. ✅ Supabase database set up
4. ✅ Dependencies installed

**Start the app:** `npm start`

Good luck with your hackathon! 🚀
