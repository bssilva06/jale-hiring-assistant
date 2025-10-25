# Jale Backend API

Complete backend implementation for the Jale AI Hiring Assistant.

## 🚀 Features Implemented

### Core Functionality

- ✅ **Job Management** - Full CRUD operations for job postings
- ✅ **Candidate Management** - Application submissions and profile management
- ✅ **AI-Powered Matching** - Claude AI integration for candidate-job matching
- ✅ **Bilingual Chatbot** - AI assistant for candidate questions (English/Spanish)
- ✅ **Interview Scheduling** - Schedule, update, and cancel interviews
- ✅ **Email Notifications** - Automated emails for applications and interviews
- ✅ **Automated Reminders** - Daily cron job for interview reminders

### Tech Stack

- **Framework**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: Anthropic Claude (Haiku model for speed)
- **Email**: Nodemailer
- **Scheduling**: node-cron

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── claude.js          # Claude AI configuration
│   │   └── supabase.js        # Supabase client setup
│   ├── controllers/
│   │   ├── candidateController.js  # Candidate CRUD + matching
│   │   ├── chatController.js       # AI chatbot endpoints
│   │   ├── interviewController.js  # Interview management
│   │   └── jobController.js        # Job CRUD operations
│   ├── middleware/
│   │   ├── auth.js            # Authentication (TODO)
│   │   └── errorHandler.js    # Global error handling
│   ├── routes/
│   │   ├── candidates.js      # Candidate routes
│   │   ├── chat.js            # Chat routes
│   │   ├── interviews.js      # Interview routes
│   │   └── jobs.js            # Job routes
│   ├── services/
│   │   ├── claudeService.js        # Claude AI interactions
│   │   ├── matchingService.js      # Candidate-job matching logic
│   │   ├── notificationService.js  # Email notifications
│   │   └── schedulingService.js    # Interview scheduling + cron
│   ├── utils/
│   │   ├── embeddings.js      # Vector embeddings (placeholder)
│   │   └── prompts.js         # AI system prompts
│   └── server.js              # Express app entry point
├── .env.example               # Environment variables template
└── package.json
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `ANTHROPIC_API_KEY` - Your Anthropic Claude API key

Optional (for email notifications):

- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`

### 3. Run the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Jobs (`/api/jobs`)

- `POST /api/jobs` - Create new job posting
- `GET /api/jobs` - Get all jobs (supports `?status=active` and `?language=en` filters)
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Close job (soft delete)
- `GET /api/jobs/:id/applications` - Get all applications for a job

### Candidates (`/api/candidates`)

- `POST /api/candidates` - Submit candidate application
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/:id` - Get specific candidate
- `GET /api/candidates/:candidate_id/match/:job_id` - Get AI match analysis

### Interviews (`/api/interviews`)

- `POST /api/interviews` - Schedule interview
- `GET /api/interviews` - Get all interviews (supports `?status=scheduled` and `?date=2024-01-01` filters)
- `GET /api/interviews/:id` - Get specific interview
- `GET /api/interviews/candidate/:candidate_id` - Get candidate's interviews
- `PUT /api/interviews/:id` - Update interview
- `POST /api/interviews/:id/cancel` - Cancel interview

### Chat (`/api/chat`)

- `POST /api/chat` - Send message and get AI response
- `GET /api/chat/:job_id/:candidate_id` - Get chat history

### Health Check

- `GET /health` - Server health status

## 🤖 AI Features

### 1. Candidate Matching

Uses Claude AI to analyze candidate profiles against job requirements:

- Skills matching
- Experience evaluation
- Certification verification
- Language compatibility
- Returns match score (0-100) with detailed reasoning

### 2. Bilingual Chatbot

AI assistant that helps candidates with questions:

- Automatically detects language (English/Spanish)
- Answers questions about pay, location, schedule, requirements
- Maintains conversation context
- Encourages application

### 3. Smart Recommendations

- Finds best candidates for each job
- Suggests suitable jobs for candidates
- Stores match results in database for quick retrieval

## 📧 Email Notifications

Automated emails are sent for:

- ✅ Application confirmation
- ✅ Interview scheduled
- ✅ Interview reminder (24h before)
- ✅ Interview cancellation

Configure email settings in `.env` to enable notifications.

## ⏰ Scheduled Tasks

**Daily Interview Reminders** (9:00 AM)

- Automatically checks for interviews happening in 24 hours
- Sends reminder emails to candidates
- Initialized on server startup

## 🔒 Security Notes

### Current Status

- ⚠️ **No authentication implemented yet** - Add JWT or session-based auth
- ⚠️ **CORS is wide open** - Restrict in production
- ⚠️ **No rate limiting** - Add rate limiting for API endpoints

### Recommended Additions

1. Implement `auth.js` middleware with JWT
2. Add request validation (use `express-validator`)
3. Implement rate limiting (use `express-rate-limit`)
4. Set up proper CORS origins in production
5. Add API key authentication for sensitive endpoints

## 🧪 Testing

Currently no tests implemented. Recommended:

- Unit tests for services (Jest)
- Integration tests for API endpoints (Supertest)
- E2E tests for critical workflows

## 🐛 Known Issues / TODOs

1. **Vector Embeddings**: `embeddings.js` is a placeholder - implement actual embeddings for semantic search
2. **Authentication**: No auth middleware implemented
3. **Rate Limiting**: No protection against abuse
4. **Input Validation**: Limited validation on request bodies
5. **File Uploads**: Resume upload not implemented
6. **Webhooks**: No webhook support for Supabase real-time events

## 📊 Database Schema Requirements

Ensure your Supabase database has these tables:

- `jobs` - Job postings
- `candidates` - Candidate profiles
- `applications` - Job applications
- `interviews` - Interview records
- `chat_messages` - Chat history
- `matches` - AI match results

Refer to the Supabase migration files or documentation for exact schema.

## 🚀 Deployment

### Environment Variables in Production

Make sure to set all required environment variables in your hosting platform.

### Recommended Platforms

- Railway
- Render
- Heroku
- AWS/GCP/Azure

### Health Check

Use `/health` endpoint for monitoring and load balancer health checks.

## 📝 Development Notes

### Adding New Features

1. Create controller in `src/controllers/`
2. Create route file in `src/routes/`
3. Add route to `server.js`
4. Update this README

### AI Prompt Engineering

All AI prompts are centralized in `src/utils/prompts.js` for easy tweaking.

### Error Handling

Global error handler in `src/middleware/errorHandler.js` catches all errors.

## 📞 Support

For issues or questions, refer to the main project README or documentation.

---

**Built for hackathon - Ready for production with minor security enhancements!** 🎉
