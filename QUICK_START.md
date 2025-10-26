# Quick Start Guide

This guide provides step-by-step instructions for running the Jale AI Hiring Assistant locally.

## Prerequisites

- Node.js 18+ and npm
- Supabase account ([sign up free](https://supabase.com))
- Anthropic API key ([get here](https://console.anthropic.com))

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/bssilva06/jale-hiring-assistant.git
cd jale-hiring-assistant
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:

```env
REACT_APP_SUPABASE_URL=your-supabase-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
REACT_APP_API_URL=http://localhost:5000
```

### 3. Backend Setup

```bash
cd ../backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
ANTHROPIC_API_KEY=your-claude-api-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend server will run at `http://localhost:5000`

### Start the Frontend

In a separate terminal:

```bash
cd frontend
npm start
```

The frontend application will open at `http://localhost:3000`

## Available Routes

### Employer Portal

- `/dashboard` - Main dashboard with stats and metrics
- `/jobs/new` - Create new job posting
- `/jobs` - View all active jobs
- `/candidates` - Browse candidate applications
- `/interviews` - Manage scheduled interviews
- `/interviews/room/:id` - Video interview room

### Candidate Portal

- `/apply` - Browse available jobs
- `/apply/:jobId` - Apply to specific job
- `/matcher` - AI-powered job matching tool

## Troubleshooting

### Port Already in Use

If port 3000 is in use:

```bash
PORT=3001 npm start
```

### Missing Dependencies

```bash
npm install
```

### CORS Errors

Ensure the backend has CORS configured for `http://localhost:3000`:

```javascript
// backend/src/server.js
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
```

### API Connection Issues

1. Verify backend is running at `http://localhost:5000/health`
2. Check `REACT_APP_API_URL` in frontend `.env.local`
3. Review browser console for error messages

### Tailwind Styles Not Loading

Restart the development server:

```bash
# Press Ctrl+C to stop, then:
npm start
```

## Testing Without Full Backend

The frontend can be tested independently by using mock data:

```javascript
// Example: Mock data in Dashboard.jsx
const fetchDashboardData = async () => {
  setStats({
    totalJobs: 5,
    totalApplications: 12,
    interviewsScheduled: 3,
    hired: 2
  });
  setLoading(false);
};
```

## Mobile Testing

### Local Network Testing

1. Find the local IP address:
   ```bash
   # Windows
   ipconfig

   # macOS/Linux
   ifconfig
   ```

2. Access from mobile device:
   ```
   http://YOUR-IP-ADDRESS:3000
   ```

### Browser DevTools

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select a mobile device profile

## Key Dependencies

The project uses the following major dependencies:

**Frontend:**
- React 19.2.0
- React Router 7.9.4
- Tailwind CSS 3
- Axios 1.12.2
- Supabase JS 2.76.1
- Jitsi React SDK 1.4.4
- React Hook Form 7.65.0
- Zod 4.1.12

**Backend:**
- Express.js
- Supabase SDK 2.45.4
- Anthropic Claude SDK
- Nodemailer
- Multer 2.0.2
- pdf-parse 1.1.1
- node-cron

## NPM Scripts

### Frontend

```bash
npm start       # Start development server
npm run build   # Build for production
npm test        # Run tests
```

### Backend

```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

## Development Tips

### Auto-Reload

Both frontend and backend support hot-reload during development. File changes will automatically trigger a reload.

### React DevTools

Install the React Developer Tools extension:
- [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Clean Installation

If experiencing dependency issues:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Additional Resources

- [Setup Guide](docs/SETUP.md) - Detailed configuration instructions
- [API Reference](docs/API_REFERENCE.md) - Complete API documentation
- [Frontend Guide](docs/FRONTEND.md) - Frontend architecture and components
- [Component Library](docs/COMPONENTS.md) - Visual component reference
- [Architecture Overview](docs/ARCHITECTURE_MERMAID.md) - System design with diagrams

## Support

For issues or questions:
- Check the [troubleshooting section](#troubleshooting)
- Review browser console logs (F12)
- Verify environment variables are correctly configured
- Ensure all required services (Supabase, backend) are running
