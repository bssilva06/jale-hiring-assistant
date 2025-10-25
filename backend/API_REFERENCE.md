# Jale Backend - API Reference

Base URL: `http://localhost:5000`

---

## 🏥 Health Check

### Check Server Status

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "message": "Jale Backend Running"
}
```

---

## 💼 Jobs API

### Create Job

```http
POST /api/jobs
Content-Type: application/json

{
  "title": "Warehouse Associate",
  "company": "ABC Logistics",
  "location": "Dallas, TX",
  "pay": 18.50,
  "schedule": "Monday-Friday, 8am-5pm",
  "requirements": ["Forklift certified", "2+ years experience"],
  "description": "Join our growing team!",
  "language": "en"
}
```

### Get All Jobs

```http
GET /api/jobs
GET /api/jobs?status=active
GET /api/jobs?language=es
```

### Get Job by ID

```http
GET /api/jobs/:id
```

### Update Job

```http
PUT /api/jobs/:id
Content-Type: application/json

{
  "pay": 20.00,
  "status": "active"
}
```

### Close Job

```http
DELETE /api/jobs/:id
```

### Get Job Applications

```http
GET /api/jobs/:id/applications
```

---

## 👤 Candidates API

### Submit Application

```http
POST /api/candidates
Content-Type: application/json

{
  "job_id": "uuid-here",
  "name": "Maria Garcia",
  "email": "maria@example.com",
  "phone": "555-1234",
  "skills": ["Forklift", "Inventory Management", "Shipping"],
  "experience_years": 5,
  "certifications": ["Forklift certified", "OSHA Safety"],
  "language_preference": "es"
}
```

**Response:**

```json
{
  "id": "candidate-uuid",
  "application_id": "application-uuid",
  "status": "submitted",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get All Candidates

```http
GET /api/candidates
```

### Get Candidate by ID

```http
GET /api/candidates/:id
```

### Get Match Analysis

```http
GET /api/candidates/:candidate_id/match/:job_id
```

**Response:**

```json
{
  "match_score": 85,
  "reasoning": "Strong match with 5 years of experience and required certifications",
  "strengths": [
    "Has required forklift certification",
    "Experience exceeds minimum requirements",
    "Relevant inventory management skills"
  ],
  "red_flags": [],
  "recommendation": "proceed_to_interview"
}
```

---

## 📅 Interviews API

### Schedule Interview

```http
POST /api/interviews
Content-Type: application/json

{
  "application_id": "uuid-here",
  "candidate_id": "uuid-here",
  "job_id": "uuid-here",
  "scheduled_at": "2024-03-15T14:00:00Z",
  "interview_type": "video",
  "meeting_link": "https://meet.jit.si/jale-interview-123",
  "notes": "Phone screen completed"
}
```

### Get All Interviews

```http
GET /api/interviews
GET /api/interviews?status=scheduled
GET /api/interviews?date=2024-03-15
```

### Get Interview by ID

```http
GET /api/interviews/:id
```

### Get Candidate Interviews

```http
GET /api/interviews/candidate/:candidate_id
```

### Update Interview

```http
PUT /api/interviews/:id
Content-Type: application/json

{
  "status": "completed",
  "notes": "Great interview, moving forward"
}
```

### Cancel Interview

```http
POST /api/interviews/:id/cancel
Content-Type: application/json

{
  "reason": "Position filled"
}
```

---

## 💬 Chat API

### Send Message (Get AI Response)

```http
POST /api/chat
Content-Type: application/json

{
  "job_id": "uuid-here",
  "candidate_id": "uuid-here",
  "message": "¿Cuánto paga este trabajo?",
  "language": "es"
}
```

**Response:**

```json
{
  "message": "Este trabajo paga $18.50 por hora. Es un puesto de tiempo completo con horario de lunes a viernes.",
  "job_title": "Warehouse Associate"
}
```

### Get Chat History

```http
GET /api/chat/:job_id/:candidate_id
```

**Response:**

```json
[
  {
    "id": "uuid",
    "sender": "candidate",
    "message": "What are the hours?",
    "created_at": "2024-01-01T10:00:00Z"
  },
  {
    "id": "uuid",
    "sender": "ai",
    "message": "The schedule is Monday-Friday, 8am-5pm. It's a full-time position.",
    "created_at": "2024-01-01T10:00:01Z"
  }
]
```

---

## 🚨 Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error message"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found",
  "message": "Route /api/invalid not found"
}
```

### 409 Conflict

```json
{
  "error": "You have already applied for this job."
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## 📝 Query Parameters

### Jobs

- `status` - Filter by status (active, closed)
- `language` - Filter by language (en, es)

### Interviews

- `status` - Filter by status (scheduled, completed, cancelled)
- `date` - Filter by date (YYYY-MM-DD format)

---

## 🔐 Authentication (Not Implemented)

Currently, all endpoints are public. For production:

1. Add JWT authentication
2. Protect admin endpoints
3. Add API key for webhook endpoints

---

## 💡 Tips

### Testing with curl

```bash
# Pretty print JSON responses
curl http://localhost:5000/api/jobs | python -m json.tool

# Save response to file
curl http://localhost:5000/api/jobs > jobs.json
```

### Testing with Postman

1. Import this API reference
2. Set base URL as environment variable
3. Create test collection for all endpoints

### Testing with VS Code REST Client

Create a `.http` file:

```http
### Get all jobs
GET http://localhost:5000/api/jobs

### Create job
POST http://localhost:5000/api/jobs
Content-Type: application/json

{
  "title": "Test Job",
  "company": "Test Co",
  ...
}
```

---

## 🎯 Common Use Cases

### 1. Complete Application Flow

```
1. GET /api/jobs (browse jobs)
2. POST /api/candidates (submit application)
3. GET /api/candidates/:id/match/:job_id (check match)
4. POST /api/interviews (schedule if good match)
5. GET /api/interviews/candidate/:id (view schedule)
```

### 2. Chat Flow

```
1. GET /api/jobs/:id (get job details)
2. POST /api/chat (ask questions)
3. POST /api/chat (ask follow-up)
4. GET /api/chat/:job_id/:candidate_id (review history)
```

### 3. Hiring Manager Flow

```
1. POST /api/jobs (create job)
2. GET /api/jobs/:id/applications (view applicants)
3. GET /api/candidates/:id/match/:job_id (review matches)
4. POST /api/interviews (schedule top candidates)
5. PUT /api/interviews/:id (update after interview)
```

---

Ready to build! 🚀
