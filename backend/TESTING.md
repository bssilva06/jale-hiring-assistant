# 🧪 Testing Guide - Jale Backend

## Quick Start Testing

### Step 1: Start the Server

Open a terminal and run:

```bash
cd /Users/jacobluna/Desktop/Jale/jale-hiring-assistant/backend
npm run dev
```

You should see:

```
🚀 Server running on http://localhost:5000
📋 Health check: http://localhost:5000/health
💼 Jobs API: http://localhost:5000/api/jobs
...
📅 Interview reminder cron job initialized (9:00 AM daily)
```

✅ **If you see this, the server is working!**

---

## Step 2: Test with Automated Script

Open a **NEW terminal** (keep the server running) and run:

```bash
cd /Users/jacobluna/Desktop/Jale/jale-hiring-assistant/backend
chmod +x test-api.sh
./test-api.sh
```

This will test all basic endpoints automatically.

---

## Step 3: Manual Testing (Recommended)

### Test 1: Health Check ✅

```bash
curl http://localhost:5000/health
```

**Expected Response:**

```json
{ "status": "OK", "message": "Jale Backend Running" }
```

---

### Test 2: Create a Job 💼

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
    "description": "Join our growing team!",
    "language": "en"
  }'
```

**Expected Response:**

```json
{
  "message": "Job created successfully",
  "job": {
    "id": "some-uuid",
    "title": "Warehouse Associate",
    "pay": 18.50,
    ...
  }
}
```

**✅ Save the job `id` from the response - you'll need it!**

---

### Test 3: Get All Jobs 📋

```bash
curl http://localhost:5000/api/jobs
```

**Expected Response:**

```json
[
  {
    "id": "uuid",
    "title": "Warehouse Associate",
    "company": "ABC Logistics",
    ...
  }
]
```

---

### Test 4: Submit a Candidate Application 👤

**Replace `YOUR_JOB_ID` with the actual job ID from Test 2:**

```bash
curl -X POST http://localhost:5000/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "YOUR_JOB_ID",
    "name": "Maria Garcia",
    "email": "maria@example.com",
    "phone": "555-1234",
    "skills": ["Forklift", "Inventory Management", "Shipping"],
    "experience_years": 5,
    "certifications": ["Forklift certified", "OSHA Safety"],
    "language_preference": "en"
  }'
```

**Expected Response:**

```json
{
  "id": "candidate-uuid",
  "application_id": "application-uuid",
  "status": "submitted",
  "created_at": "2025-10-25T..."
}
```

**✅ Save the candidate `id` - you'll need it for AI testing!**

---

### Test 5: AI Match Analysis 🤖

**Replace `CANDIDATE_ID` and `JOB_ID` with actual UUIDs:**

```bash
curl http://localhost:5000/api/candidates/CANDIDATE_ID/match/JOB_ID
```

**Expected Response:**

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

**✅ This proves Claude AI integration is working!**

---

### Test 6: AI Chatbot (English) 💬

**Replace `YOUR_JOB_ID` with actual job ID:**

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "YOUR_JOB_ID",
    "message": "What is the pay for this position?",
    "language": "en"
  }'
```

**Expected Response:**

```json
{
  "message": "This position pays $18.50 per hour. It's a full-time role with a Monday-Friday schedule from 8am to 5pm.",
  "job_title": "Warehouse Associate"
}
```

---

### Test 7: AI Chatbot (Spanish) 🇪🇸

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "YOUR_JOB_ID",
    "message": "¿Cuánto paga este trabajo?",
    "language": "es"
  }'
```

**Expected Response (in Spanish):**

```json
{
  "message": "Este puesto paga $18.50 por hora. Es un rol de tiempo completo...",
  "job_title": "Warehouse Associate"
}
```

**✅ This proves bilingual support is working!**

---

### Test 8: Schedule Interview 📅

**Replace the IDs with actual values:**

```bash
curl -X POST http://localhost:5000/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "application_id": "YOUR_APPLICATION_ID",
    "candidate_id": "YOUR_CANDIDATE_ID",
    "job_id": "YOUR_JOB_ID",
    "scheduled_at": "2025-10-30T14:00:00Z",
    "interview_type": "video",
    "meeting_link": "https://meet.jit.si/jale-test-123",
    "notes": "Initial screening"
  }'
```

**Expected Response:**

```json
{
  "message": "Interview scheduled successfully",
  "interview": {
    "id": "interview-uuid",
    "scheduled_at": "2025-10-30T14:00:00.000Z",
    "status": "scheduled",
    ...
  }
}
```

---

### Test 9: Get All Interviews 📋

```bash
curl http://localhost:5000/api/interviews
```

**Expected Response:**

```json
[
  {
    "id": "uuid",
    "scheduled_at": "2025-10-30T14:00:00.000Z",
    "status": "scheduled",
    "candidate": {
      "name": "Maria Garcia",
      "email": "maria@example.com"
    },
    "job": {
      "title": "Warehouse Associate"
    }
  }
]
```

---

## 🎯 What to Look For

### ✅ Success Indicators:

- Server starts without errors
- All endpoints return 200-level status codes
- Claude AI returns match scores and chat responses
- Data is properly stored in Supabase
- No error messages in console

### ❌ Common Issues:

#### 1. "Missing Supabase environment variables"

**Fix:** Check your `.env` file has `SUPABASE_URL` and `SUPABASE_ANON_KEY`

#### 2. "Error getting match score from Claude"

**Fix:** Verify `ANTHROPIC_API_KEY` in `.env` is correct

#### 3. "Job not found" or "Candidate not found"

**Fix:** Make sure you're using actual UUIDs from previous test responses

#### 4. Database errors (23xxx codes)

**Fix:** Your Supabase tables might not exist. Run the SQL from QUICKSTART.md

#### 5. CORS errors in browser

**Fix:** This is expected - CORS is enabled. Test with curl or Postman

---

## 🔍 Checking Logs

Watch the server terminal for logs. You should see:

```
Error in createJob: ... ← Indicates an issue
Email sent: ... ← Email notifications working
Running scheduled interview reminder job... ← Cron job working
```

---

## 📊 Verify in Supabase

1. Go to your Supabase dashboard
2. Open Table Editor
3. Check these tables have data:
   - `jobs` - Should have your test job
   - `candidates` - Should have your test candidate
   - `applications` - Should link candidate to job
   - `matches` - Should have AI match results
   - `chat_messages` - Should have chat history
   - `interviews` - Should have interview records

---

## 🚀 Advanced Testing

### Test Error Handling

```bash
# Should return 404
curl http://localhost:5000/api/invalid-route

# Should return 400 (bad request)
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Test Query Filters

```bash
# Filter jobs by status
curl http://localhost:5000/api/jobs?status=active

# Filter jobs by language
curl http://localhost:5000/api/jobs?language=en

# Filter interviews by date
curl "http://localhost:5000/api/interviews?date=2025-10-30"
```

---

## 🎉 Success Checklist

- [ ] Server starts without errors
- [ ] Health check responds
- [ ] Can create jobs
- [ ] Can get jobs list
- [ ] Can submit candidate application
- [ ] AI matching returns scores (tests Claude)
- [ ] AI chat responds in English
- [ ] AI chat responds in Spanish
- [ ] Can schedule interviews
- [ ] Can get interviews list
- [ ] Data appears in Supabase tables
- [ ] No errors in server logs

**If all checked, your backend is 100% working! 🎊**

---

## 🐛 Getting Help

If something doesn't work:

1. Check server logs for specific error messages
2. Verify `.env` has all required keys
3. Confirm Supabase tables exist
4. Test Claude API key at console.anthropic.com
5. Make sure you're using actual UUIDs, not "test-job-id"

---

## 💡 Pro Tips

1. **Use Postman or Insomnia** - Easier than curl for testing
2. **Check Network Tab** - In browser DevTools if testing from frontend
3. **Pretty Print JSON** - Pipe curl output through `| python -m json.tool`
4. **Save Test Data** - Keep track of UUIDs in a text file
5. **Test One Flow** - Job → Application → Match → Interview

---

Ready to test! 🚀
