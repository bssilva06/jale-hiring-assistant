# Backend API Requirements for Frontend

Hey Backend Dev! 👋 Here's what the frontend needs from you.

## 🔌 Required API Endpoints

### 1. Jobs API

#### `POST /api/jobs`

Create a new job posting

**Request Body:**

```json
{
  "title": "Warehouse Associate",
  "description": "We are looking for...",
  "pay": 18.5,
  "location": "Miami, FL",
  "schedule": "Monday-Friday, 8am-5pm",
  "requirements": ["Forklift certified", "2+ years experience"],
  "language": "en"
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Warehouse Associate",
  "status": "active",
  "created_at": "2025-10-24T..."
}
```

#### `GET /api/jobs`

List all jobs

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "Warehouse Associate",
    "pay": 18.5,
    "location": "Miami, FL",
    "status": "active",
    "application_count": 5
  }
]
```

#### `GET /api/jobs/:id`

Get job details

**Response:**

```json
{
  "id": "uuid",
  "title": "Warehouse Associate",
  "description": "...",
  "pay": 18.5,
  "location": "Miami, FL",
  "schedule": "Monday-Friday, 8am-5pm",
  "requirements": ["Forklift certified"],
  "language": "en",
  "status": "active"
}
```

---

### 2. Candidates API

#### `POST /api/candidates`

Submit candidate application

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "skills": ["Forklift operation", "Inventory management"],
  "experience_years": 3,
  "certifications": ["Forklift certified"],
  "language_preference": "en",
  "resume_url": "https://...",
  "job_id": "uuid"
}
```

**Response:**

```json
{
  "candidate_id": "uuid",
  "application_id": "uuid",
  "match_score": 85,
  "status": "submitted"
}
```

#### `GET /api/candidates`

List all candidates

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["Forklift operation"],
    "experience_years": 3
  }
]
```

#### `POST /api/candidates/match`

Get match score for candidate/job pair

**Request Body:**

```json
{
  "candidate_id": "uuid",
  "job_id": "uuid"
}
```

**Response:**

```json
{
  "match_score": 85,
  "reasoning": "Strong fit based on forklift experience...",
  "strengths": ["Certified forklift operator", "3+ years experience"],
  "red_flags": [],
  "recommendation": "proceed_to_interview"
}
```

---

### 3. Applications API

#### `GET /api/applications`

List all applications

**Query Params (optional):**

- `job_id` - Filter by job
- `status` - Filter by status

**Response:**

```json
[
  {
    "id": "uuid",
    "job_id": "uuid",
    "candidate_id": "uuid",
    "status": "submitted",
    "match_score": 85,
    "strengths": ["..."],
    "red_flags": [],
    "candidate": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-123-4567",
      "skills": ["Forklift operation"]
    },
    "job": {
      "title": "Warehouse Associate",
      "pay": 18.5
    },
    "created_at": "2025-10-24T..."
  }
]
```

#### `GET /api/applications/:id`

Get application details

**Response:** Same as array item above

#### `PATCH /api/applications/:id`

Update application status

**Request Body:**

```json
{
  "status": "interview_scheduled"
}
```

---

### 4. Interviews API

#### `POST /api/interviews`

Schedule a new interview

**Request Body:**

```json
{
  "application_id": "uuid",
  "scheduled_time": "2025-10-25T14:00:00Z",
  "duration_minutes": 30
}
```

**Response:**

```json
{
  "id": "uuid",
  "application_id": "uuid",
  "scheduled_time": "2025-10-25T14:00:00Z",
  "duration_minutes": 30,
  "jitsi_room_id": "jale-interview-uuid",
  "status": "scheduled",
  "reminder_24h_sent": false,
  "reminder_1h_sent": false
}
```

#### `GET /api/interviews`

List all interviews

**Response:**

```json
[
  {
    "id": "uuid",
    "scheduled_time": "2025-10-25T14:00:00Z",
    "status": "scheduled",
    "jitsi_room_id": "jale-interview-uuid",
    "application": {
      "id": "uuid",
      "match_score": 85,
      "candidate": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "job": {
        "title": "Warehouse Associate"
      }
    }
  }
]
```

#### `GET /api/interviews/:id`

Get interview details

**Response:** Same as array item above, plus:

```json
{
  "decision": "hire",
  "rating": 4.5,
  "notes": "Great candidate, strong communication skills"
}
```

#### `PATCH /api/interviews/:id`

Update interview (feedback, decision)

**Request Body:**

```json
{
  "decision": "hire",
  "rating": 4.5,
  "notes": "Great candidate..."
}
```

---

### 5. Chat API

#### `POST /api/chat`

Send message to AI chatbot

**Request Body:**

```json
{
  "message": "¿Cuánto paga este trabajo?",
  "job_id": "uuid",
  "application_id": "uuid"
}
```

**Response:**

```json
{
  "response": "Este puesto de Warehouse Associate paga $18.50 por hora. ¿Tienes alguna otra pregunta?"
}
```

**Important:**

- Must detect language from message
- Respond in same language
- Use Claude API for responses
- Include job context in prompt

---

## 🔧 Technical Requirements

### CORS Configuration

```javascript
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

### Error Handling

All endpoints should return errors in this format:

```json
{
  "error": "Error message",
  "details": "Additional info (optional)"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad request
- `404` - Not found
- `500` - Server error

---

## 🎯 Priority Order

### Phase 1 (Minimum for demo)

1. ✅ `POST /api/jobs` - Create jobs
2. ✅ `GET /api/jobs` - List jobs
3. ✅ `POST /api/candidates` - Submit applications
4. ✅ `GET /api/applications` - List applications
5. ✅ `POST /api/chat` - Chatbot

### Phase 2 (Nice to have)

6. ✅ `POST /api/interviews` - Schedule interviews
7. ✅ `PATCH /api/interviews/:id` - Update feedback
8. ✅ `POST /api/candidates/match` - Match scoring

### Phase 3 (If time)

9. ✅ Real-time updates via Supabase
10. ✅ n8n workflows for reminders
11. ✅ Email notifications

---

## 🧪 Testing Endpoints

Use this to test your API:

```bash
# Health check
curl http://localhost:5000/health

# Create job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Job",
    "description": "Test",
    "pay": 20,
    "location": "Miami, FL",
    "schedule": "9-5",
    "requirements": ["Test"],
    "language": "en"
  }'

# Get jobs
curl http://localhost:5000/api/jobs

# Test chatbot
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the pay?",
    "job_id": "your-job-id"
  }'
```

---

## 📦 Sample Response Data

For quick testing, you can return mock data:

**Mock Job:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Warehouse Associate",
  "description": "Great opportunity for experienced warehouse workers",
  "pay": 18.5,
  "location": "Miami, FL",
  "schedule": "Monday-Friday, 8am-5pm",
  "requirements": ["Forklift certified", "2+ years experience"],
  "status": "active"
}
```

**Mock Application:**

```json
{
  "id": "app-123",
  "match_score": 85,
  "status": "submitted",
  "strengths": ["Certified forklift operator", "3+ years warehouse experience"],
  "red_flags": [],
  "candidate": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0100",
    "skills": ["Forklift operation", "Inventory management"]
  },
  "job": {
    "title": "Warehouse Associate",
    "pay": 18.5
  }
}
```

---

## 🤝 Let's Sync!

### Questions for Backend Dev:

1. When will the basic endpoints be ready?
2. Do you need help with Claude API integration?
3. Should we mock the data for initial testing?
4. What's the database schema status?

### From Frontend Dev:

- Frontend is 100% complete ✅
- Ready to test integration anytime
- Can provide more sample data if needed
- Available to help debug API issues

---

**Let's build something awesome together!** 🚀
