# 🚀 Quick Start - Run the Frontend

## ⚡ Super Quick Start (3 Steps)

### Step 1: Configure Environment

```bash
cd frontend
```

Edit `.env.local` with your credentials:

```env
REACT_APP_SUPABASE_URL=your-supabase-url-here
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key-here
REACT_APP_API_URL=http://localhost:5000
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the App

```bash
npm start
```

✅ App will open at `http://localhost:3000`

---

## 📋 Pre-Flight Checklist

Before running, make sure:

- [ ] **Node.js installed** (v16+)

  ```bash
  node --version
  ```

- [ ] **Backend is running** (or ready to mock)

  ```bash
  # In another terminal
  cd backend
  npm run dev
  ```

- [ ] **Environment variables set** in `.env.local`

- [ ] **Supabase project created** (if using real data)

---

## 🔧 Troubleshooting

### "Cannot find module 'react'"

```bash
cd frontend
npm install
```

### "Port 3000 is already in use"

```bash
# Kill the process or change port
PORT=3001 npm start
```

### "CORS error" in browser console

Your backend needs CORS enabled:

```javascript
// backend/src/server.js
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

### Tailwind styles not showing

```bash
# Restart the dev server
# Press Ctrl+C, then:
npm start
```

### "Network Error" when calling API

- Check backend is running: `http://localhost:5000/health`
- Verify `REACT_APP_API_URL` in `.env.local`

---

## 🧪 Test Without Backend

You can test the UI without a backend by:

1. Comment out API calls temporarily
2. Use mock data in components
3. Test navigation and UI interactions

Example mock:

```javascript
// In Dashboard.jsx, temporarily replace:
const fetchDashboardData = async () => {
  // Mock data for testing
  setStats({
    totalJobs: 5,
    totalApplications: 12,
    interviewsScheduled: 3,
    hired: 2,
  });
  setLoading(false);
};
```

---

## 📱 View on Mobile

### Using Same Network

1. Find your computer's IP:

   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address
   ```

2. On your phone, visit:
   ```
   http://YOUR-IP-ADDRESS:3000
   ```

### Using Chrome DevTools

1. Open browser DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select mobile device to test

---

## 🎯 Available Routes

Once running, you can navigate to:

### Candidate Portal

- `http://localhost:3000/apply` - Main application page
- `http://localhost:3000/apply/[job-id]` - Apply to specific job

### Hiring Manager

- `http://localhost:3000/dashboard` - Main dashboard
- `http://localhost:3000/jobs/new` - Post new job
- `http://localhost:3000/candidates` - View candidates
- `http://localhost:3000/interviews` - Manage interviews

---

## 📦 What Gets Installed

Running `npm install` will install:

- **react** (19.2.0) - UI framework
- **react-router-dom** - Navigation
- **tailwindcss** - Styling
- **axios** - API requests
- **@supabase/supabase-js** - Database
- **@jitsi/react-sdk** - Video calls
- **lucide-react** - Icons
- **date-fns** - Date formatting
- **react-hook-form** - Form handling
- **zod** - Validation

Total size: ~500MB (with node_modules)

---

## 🎨 Available NPM Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test

# Eject from Create React App (don't do this unless necessary!)
npm run eject
```

---

## 🔥 Hot Tips

### 1. Auto-Reload

Changes to files will automatically reload the browser!

### 2. Browser Console

Press **F12** to see:

- Network requests
- Console logs
- React DevTools

### 3. React DevTools

Install browser extension:

- Chrome: [React Developer Tools](https://chrome.google.com/webstore)
- Firefox: [React Developer Tools](https://addons.mozilla.org)

### 4. Clean Install

If things break:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎬 Demo Preparation

### Before Demo Day:

1. **Test all flows** (at least 3 times!)
2. **Prepare mock data** in database
3. **Test on mobile** device
4. **Check video** works (Jitsi)
5. **Have backup** screenshots

### Mock Data to Prepare:

- 3-5 job postings
- 10-15 candidate applications
- Mix of match scores (high, medium, low)
- 2-3 scheduled interviews
- At least 1 "hired" candidate

### Quick Test Checklist:

- [ ] Post a job
- [ ] Submit application
- [ ] Open chatbot (ask question)
- [ ] View candidates list
- [ ] Filter by match score
- [ ] Schedule interview
- [ ] Join video call
- [ ] Submit feedback

---

## 📞 Need Help?

### Check These First:

1. Console errors (F12)
2. Network tab (see API requests)
3. `.env.local` file is correct
4. Backend is running

### Common Issues:

- **Blank screen** → Check browser console
- **Styles broken** → Restart dev server
- **API errors** → Verify backend URL
- **Module errors** → Run `npm install`

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just run:

```bash
cd frontend
npm install
npm start
```

**Good luck with your demo!** 🚀✨

---

## 📚 More Resources

- `FRONTEND_README.md` - Detailed setup guide
- `FRONTEND_COMPLETE.md` - Full feature overview
- `COMPONENT_SHOWCASE.md` - Visual component guide
- `BACKEND_API_REQUIREMENTS.md` - API specs for backend teammate

**Questions?** Check these files or the code comments! 💡
