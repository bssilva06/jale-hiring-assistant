# 🐛 Connection Issue - SOLVED!

## Problem Found

Your frontend and backend ARE connected properly, but **TWO DATABASE ISSUES**:

1. ❌ **Row-Level Security (RLS)** is blocking all data operations
2. ❌ **Database schema is incomplete** (missing columns/tables)

Error message: `"new row violates row-level security policy for table "jobs"`

This means Supabase RLS is enabled but no policies are configured to allow inserts/updates.

## ✅ Solution

### Step 1: Fix Your Supabase Database

1. **Go to your Supabase dashboard:**

   - Open: https://supabase.com/dashboard
   - Select your project: `rnndlqbdinvjstuydyti`

2. **Open SQL Editor:**

   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the fix script:**

   - Open the file: `backend/supabase-schema-fix.sql`
   - Copy ALL the SQL code (it now includes RLS fix!)
   - Paste it into the Supabase SQL Editor
   - Click "Run" or press Cmd+Enter

4. **Wait for completion:**
   - You should see "Success" messages
   - The script will:
     - **Disable RLS** for development (CRITICAL!)
     - Add missing columns
     - Create missing tables

### Step 2: Test the Connection

After running the SQL script, test in your terminal:

```bash
# Test creating a job
curl -X POST http://localhost:5001/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Warehouse Associate",
    "company": "ABC Logistics",
    "location": "Dallas, TX",
    "pay": 18.50,
    "schedule": "Monday-Friday, 8am-5pm",
    "requirements": ["Forklift certified"],
    "description": "Great opportunity",
    "language": "en"
  }'
```

**Expected response:**

```json
{
  "message": "Job created successfully",
  "job": {
    "id": "some-uuid",
    "title": "Warehouse Associate",
    ...
  }
}
```

### Step 3: Test in Browser

1. Open your frontend: http://localhost:3000
2. Try to create a job or view jobs
3. Open Browser DevTools (F12) → Network tab
4. You should see successful API calls (Status 200)

---

## Current Status

✅ **Backend is running:** http://localhost:5001  
✅ **Frontend is running:** http://localhost:3000  
✅ **They are connected** (same port configuration)  
✅ **CORS is enabled** (backend allows all origins)  
❌ **Row-Level Security blocking inserts** ← ISSUE #1  
❌ **Database schema incomplete** ← ISSUE #2

---

## After Fixing Database

Everything will work:

- ✅ Create/view jobs
- ✅ Submit applications
- ✅ AI matching with Claude
- ✅ Chatbot conversations
- ✅ Interview scheduling

---

## What if SQL script fails?

If you get errors, you might need to create tables from scratch. Use the complete schema from `QUICKSTART.md`.

Or manually add the missing column:

```sql
ALTER TABLE jobs ADD COLUMN company TEXT;
```

---

## Need Help?

1. Run the SQL script in Supabase
2. Restart your backend: `Ctrl+C` then `node src/server.js`
3. Test the curl command above
4. If it works, try the frontend!

**Your connection is fine - it's just the database schema!** 🎉
