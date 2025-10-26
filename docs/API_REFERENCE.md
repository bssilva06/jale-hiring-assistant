# API Reference

Complete reference documentation for the Jale AI Hiring Assistant REST API.

## Base URL

```
http://localhost:5000
```

## Authentication

Currently, the API does not require authentication. JWT authentication infrastructure is in place for future implementation.

## Common Response Formats

### Success Response

```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": "Additional information (optional)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Jobs API

### Create Job

Create a new job posting.

**Endpoint:** `POST /api/jobs`

**Request Body:**

```json
{
  "title": "Warehouse Associate",
  "company": "ABC Logistics",
  "description": "We are looking for an experienced warehouse worker...",
  "pay": 18.5,
  "location": "Miami, FL",
  "schedule": "Monday-Friday, 8am-5pm",
  "requirements": [
    "Forklift certification",
    "2+ years warehouse experience"
  ],
  "job_type": "full-time",
  "language": "en"
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Warehouse Associate",
  "company": "ABC Logistics",
  "status": "active",
  "created_at": "2025-10-25T12:00:00Z"
}
```

### List Jobs

Retrieve all job postings.

**Endpoint:** `GET /api/jobs`

**Query Parameters:**

- `status` (optional) - Filter by status (`active`, `closed`)

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "Warehouse Associate",
    "company": "ABC Logistics",
    "pay": 18.5,
    "location": "Miami, FL",
    "status": "active",
    "application_count": 5,
    "created_at": "2025-10-25T12:00:00Z"
  }
]
```

### Get Job Details

Retrieve a specific job posting.

**Endpoint:** `GET /api/jobs/:id`

**Response:**

```json
{
  "id": "uuid",
  "title": "Warehouse Associate",
  "company": "ABC Logistics",
  "description": "We are looking for...",
  "pay": 18.5,
  "location": "Miami, FL",
  "schedule": "Monday-Friday, 8am-5pm",
  "requirements": ["Forklift certification", "2+ years experience"],
  "job_type": "full-time",
  "language": "en",
  "status": "active",
  "created_at": "2025-10-25T12:00:00Z",
  "updated_at": "2025-10-25T12:00:00Z"
}
```

### Update Job

Update an existing job posting.

**Endpoint:** `PUT /api/jobs/:id`

**Request Body:** Same as Create Job

**Response:** Updated job object

### Delete Job

Delete a job posting (soft delete by default).

**Endpoint:** `DELETE /api/jobs/:id`

**Query Parameters:**

- `hard` (optional) - Set to `true` for hard delete

**Response:**

```json
{
  "message": "Job deleted successfully"
}
```

---

## Candidates API

### Create Application

Submit a candidate application.

**Endpoint:** `POST /api/candidates`

**Request Body:**

```json
{
  "job_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "skills": ["Forklift operation", "Inventory management"],
  "experience_years": 3,
  "certifications": ["Forklift certified"],
  "education": "High School",
  "language_preference": "en"
}
```

**Response:**

```json
{
  "candidate_id": "uuid",
  "application_id": "uuid",
  "match_score": 85,
  "status": "submitted",
  "message": "Application submitted successfully"
}
```

### List Candidates

Retrieve all candidates.

**Endpoint:** `GET /api/candidates`

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "skills": ["Forklift operation", "Inventory management"],
    "experience_years": 3,
    "certifications": ["Forklift certified"],
    "language_preference": "en",
    "created_at": "2025-10-25T12:00:00Z"
  }
]
```

### Get Candidate Details

Retrieve a specific candidate.

**Endpoint:** `GET /api/candidates/:id`

**Response:** Same as list item with additional application history

### Parse Resume (File Upload)

Parse a resume file (PDF or TXT) and extract structured data.

**Endpoint:** `POST /api/candidates/parse-resume-file`

**Request:** Multipart form data with `resume` file

**Response:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "skills": ["Forklift operation", "Inventory management", "Safety compliance"],
  "experience_years": 3,
  "certifications": ["Forklift certified", "OSHA 10"],
  "education": "High School Diploma"
}
```

### Parse Resume (Text)

Parse resume text and extract structured data.

**Endpoint:** `POST /api/candidates/parse-resume`

**Request Body:**

```json
{
  "resume_text": "John Doe\nEmail: john@example.com\n..."
}
```

**Response:** Same as Parse Resume (File Upload)

### Get Match Score

Calculate match score between a candidate and job.

**Endpoint:** `GET /api/candidates/:candidateId/match/:jobId`

**Response:**

```json
{
  "match_score": 85,
  "reasoning": "Strong fit based on forklift certification and warehouse experience...",
  "strengths": [
    "Certified forklift operator",
    "3+ years warehouse experience",
    "Strong safety record"
  ],
  "red_flags": [],
  "recommendation": "proceed_to_interview"
}
```

---

## Applications API

### List Applications

Retrieve all applications.

**Endpoint:** `GET /api/applications`

**Query Parameters:**

- `job_id` (optional) - Filter by job
- `status` (optional) - Filter by status

**Response:**

```json
[
  {
    "id": "uuid",
    "job_id": "uuid",
    "candidate_id": "uuid",
    "status": "submitted",
    "match_score": 85,
    "strengths": ["Certified forklift operator", "3+ years experience"],
    "red_flags": [],
    "candidate": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-123-4567",
      "skills": ["Forklift operation"]
    },
    "job": {
      "title": "Warehouse Associate",
      "company": "ABC Logistics",
      "pay": 18.5
    },
    "created_at": "2025-10-25T12:00:00Z"
  }
]
```

### Get Application by Job

Retrieve applications for a specific job.

**Endpoint:** `GET /api/applications/job/:jobId`

**Response:** Array of applications (same format as List Applications)

### Get Application Details

Retrieve a specific application.

**Endpoint:** `GET /api/applications/:id`

**Response:** Same as list item with full details

### Update Application Status

Update the status of an application.

**Endpoint:** `PUT /api/applications/:id/status`

**Request Body:**

```json
{
  "status": "reviewed"
}
```

**Valid Status Values:**
- `submitted`
- `reviewed`
- `interview_scheduled`
- `interviewed`
- `offer_extended`
- `hired`
- `rejected`

**Response:**

```json
{
  "message": "Application status updated",
  "application": { ... }
}
```

---

## Interviews API

### Schedule Interview

Create a new interview.

**Endpoint:** `POST /api/interviews`

**Request Body:**

```json
{
  "application_id": "uuid",
  "scheduled_at": "2025-10-26T14:00:00Z",
  "duration": 30
}
```

**Response:**

```json
{
  "id": "uuid",
  "application_id": "uuid",
  "scheduled_at": "2025-10-26T14:00:00Z",
  "duration": 30,
  "meeting_link": "https://meet.jit.si/jale-interview-uuid",
  "status": "scheduled",
  "created_at": "2025-10-25T12:00:00Z"
}
```

### List Interviews

Retrieve all interviews.

**Endpoint:** `GET /api/interviews`

**Query Parameters:**

- `status` (optional) - Filter by status (`scheduled`, `completed`, `cancelled`)

**Response:**

```json
[
  {
    "id": "uuid",
    "application_id": "uuid",
    "scheduled_at": "2025-10-26T14:00:00Z",
    "duration": 30,
    "meeting_link": "https://meet.jit.si/jale-interview-uuid",
    "status": "scheduled",
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
    },
    "created_at": "2025-10-25T12:00:00Z"
  }
]
```

### Get Upcoming Interviews

Retrieve upcoming scheduled interviews.

**Endpoint:** `GET /api/interviews/upcoming`

**Response:** Array of interviews (same format as List Interviews)

### Get Interview Details

Retrieve a specific interview.

**Endpoint:** `GET /api/interviews/:id`

**Response:**

```json
{
  "id": "uuid",
  "application_id": "uuid",
  "scheduled_at": "2025-10-26T14:00:00Z",
  "duration": 30,
  "meeting_link": "https://meet.jit.si/jale-interview-uuid",
  "status": "completed",
  "decision": "hire",
  "rating": 4.5,
  "notes": "Great candidate, strong communication skills",
  "created_at": "2025-10-25T12:00:00Z",
  "updated_at": "2025-10-26T14:30:00Z"
}
```

### Submit Interview Feedback

Update interview with feedback and decision.

**Endpoint:** `PUT /api/interviews/:id/feedback`

**Request Body:**

```json
{
  "decision": "hire",
  "rating": 4.5,
  "notes": "Great candidate, strong communication skills"
}
```

**Valid Decision Values:**
- `hire`
- `maybe`
- `reject`

**Response:**

```json
{
  "message": "Interview feedback submitted",
  "interview": { ... }
}
```

---

## Chat API

### Send Message

Send a message to the AI chatbot.

**Endpoint:** `POST /api/chat`

**Request Body:**

```json
{
  "message": "¿Cuánto paga este trabajo?",
  "job_id": "uuid",
  "language": "es"
}
```

**Response:**

```json
{
  "response": "Este puesto de Warehouse Associate paga $18.50 por hora. ¿Tienes alguna otra pregunta?",
  "language": "es"
}
```

**Features:**
- Automatic language detection (English/Spanish)
- Context-aware responses based on job details
- Conversation history tracking
- Encourages applications

---

## Utility Endpoints

### Health Check

Check server status.

**Endpoint:** `GET /health`

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-25T12:00:00Z"
}
```

### Test Email

Test email configuration.

**Endpoint:** `POST /api/test-email`

**Request Body:**

```json
{
  "to": "test@example.com"
}
```

**Response:**

```json
{
  "message": "Test email sent successfully"
}
```

---

## CORS Configuration

The API is configured to accept requests from the frontend:

```javascript
cors({
  origin: "http://localhost:3000",
  credentials: true
})
```

---

## Rate Limiting

Currently, no rate limiting is implemented. This should be added for production deployment.

---

## Error Handling

All endpoints implement consistent error handling:

```json
{
  "error": "Error message",
  "details": "Additional context about the error"
}
```

Common errors:
- Missing required fields
- Invalid job/candidate/application ID
- Database connection errors
- External API failures (Claude, Supabase)
