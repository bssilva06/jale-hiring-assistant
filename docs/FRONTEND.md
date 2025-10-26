# Frontend Architecture

Complete documentation for the Jale AI Hiring Assistant frontend application.

## Overview

The frontend is a modern React single-page application (SPA) built with React 19, React Router 7, and Tailwind CSS. It provides separate portals for employers and job seekers, featuring AI-powered candidate matching, bilingual support, and video interview capabilities.

## Technology Stack

- **Framework:** React 19.2.0
- **Routing:** React Router 7.9.4
- **Styling:** Tailwind CSS 3 with PostCSS and Autoprefixer
- **UI Components:** Lucide Icons, Headless UI, Hero Icons
- **Form Management:** React Hook Form 7.65.0 with Zod 4.1.12 validation
- **HTTP Client:** Axios 1.12.2
- **Database:** Supabase JS 2.76.1
- **AI Integration:** Anthropic Claude SDK 0.67.0
- **Video:** Jitsi React SDK 1.4.4
- **Date Handling:** date-fns 4.1.0
- **Build Tool:** Create React App with React Scripts 5.0.1

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── shared/         # Reusable UI components
│   │   ├── layout/         # Navigation and layout components
│   │   ├── hiring/         # Employer-specific components
│   │   └── candidate/      # Job seeker components
│   ├── pages/              # Route-level page components
│   ├── services/           # API and external service clients
│   ├── utils/              # Helper functions and constants
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   └── index.css           # Global styles and Tailwind imports
├── public/                 # Static assets
├── .env.local              # Environment variables
└── package.json            # Dependencies and scripts
```

## Core Features

### 1. Employer Portal

#### Dashboard (`/dashboard`)
- Real-time statistics display
  - Active job postings count
  - Total applications received
  - Scheduled interviews
  - Candidates hired
- Recent job listings
- Quick action buttons
- Application overview with filtering

#### Job Management
- **Job Posting** (`/jobs/new`) - Create and publish job listings
  - Job title, company name, and description
  - Pay rate (hourly)
  - Location and work schedule
  - Requirements list
  - Job type selection (full-time, part-time, contract)
  - Language support (English/Spanish)
- **Active Jobs** (`/jobs`) - View and manage posted jobs
- **Job Editing** - Update existing job postings
- **Job Deletion** - Soft or hard delete options

#### Candidate Management (`/candidates`)
- Browse all applications
- AI-powered match score display (0-100%)
- Filter by match score tiers:
  - Excellent (80%+)
  - Good (60-79%)
  - Poor (<60%)
- View detailed candidate profiles
- Skills analysis
- Experience timeline
- Application status tracking

#### Interview Management
- **Interview Scheduling** (`/interviews`)
  - Date and time selection with calendar picker
  - Duration configuration (15, 30, 45, 60 minutes)
  - Automatic Jitsi room generation
  - Email notification automation
- **Interview Room** (`/interviews/room/:id`)
  - Embedded Jitsi video conferencing
  - Candidate information sidebar
  - Real-time feedback form
  - Hiring decision input (Hire/Maybe/Reject)
  - 5-star rating system
  - Notes section

### 2. Candidate Portal

#### Job Browser (`/apply`)
- Browse available job listings
- View detailed job information
- Filter and search capabilities
- Quick apply functionality

#### AI Job Matcher (`/matcher`)
- Resume upload and parsing
  - PDF and TXT support
  - AI extraction of:
    - Personal information
    - Skills and certifications
    - Years of experience
    - Education level
- Personal information form
- Job preferences input
- Smart matching algorithm
- Top job recommendations with match breakdown

#### Application Process
- Resume upload with AI-powered parsing
- Personal information form
- Skills input (multi-line)
- Experience and certifications
- Language preference (English/Spanish)
- Duplicate application prevention
- Application status tracking

#### Bilingual AI Chatbot
- Floating chat widget (bottom-right)
- Automatic language detection (English/Spanish)
- Job-specific contextual responses
- Question and answer interface
- Conversation history
- Suggested questions for common inquiries
- Application encouragement

### 3. Shared Features

#### Navigation
- **Navbar** - Top navigation with branding and primary actions
- **Sidebar** - Role-based navigation menu (employer/candidate)
- Mobile-responsive hamburger menu
- Role selection on landing page

#### UI Components
- **Button** - 5 variants (primary, secondary, success, danger, outline)
- **Card** - Hoverable containers for content grouping
- **Modal** - Dialog boxes for confirmations and forms
- **Badge** - Color-coded status indicators
- **Form Inputs** - Consistent styling across all forms

## API Integration

### Services Layer

#### API Service (`services/api.js`)
Centralized Axios client with:
- Base URL configuration from environment
- Request/response interceptors
- Error handling
- Authentication header injection (prepared for JWT)

#### Supabase Service (`services/supabase.js`)
Supabase client configuration:
- Database queries
- Real-time subscriptions
- Authentication (prepared for future implementation)

#### Claude Service (`services/claude.js`)
Placeholder for direct Claude API calls from frontend (if needed)

### API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/jobs` | GET | List all jobs |
| `/api/jobs` | POST | Create job |
| `/api/jobs/:id` | GET | Get job details |
| `/api/jobs/:id` | PUT | Update job |
| `/api/jobs/:id` | DELETE | Delete job |
| `/api/candidates` | POST | Submit application |
| `/api/candidates/parse-resume-file` | POST | Parse PDF/TXT resume |
| `/api/candidates/:candidateId/match/:jobId` | GET | Get match score |
| `/api/applications` | GET | List applications |
| `/api/applications/job/:jobId` | GET | Get job applications |
| `/api/applications/:id/status` | PUT | Update application |
| `/api/interviews` | POST | Schedule interview |
| `/api/interviews/:id` | GET | Get interview details |
| `/api/interviews/:id/feedback` | PUT | Submit feedback |
| `/api/chat` | POST | AI chatbot messages |

## State Management

### Current Approach
- Component-level state with `useState`
- Prop drilling for shared state
- React Hook Form for form state

### Prepared for Future Enhancement
- Context API structure in place for global state
- Custom hooks directory for reusable stateful logic

## Routing Structure

```javascript
/                    → LandingPage (role selection)

# Employer Routes
/dashboard           → Dashboard
/jobs                → ActiveJobs
/jobs/new            → JobPosting
/jobs/edit/:id       → JobPosting (edit mode)
/candidates          → CandidateList
/applications/:id    → ApplicationDetail
/interviews          → InterviewsPage
/interviews/room/:id → InterviewRoom

# Candidate Routes
/apply               → CandidatePortal (job browser)
/apply/:jobId        → CandidatePortal (application form)
/matcher             → JobMatcher (AI matching)
```

## Design System

### Color Palette (Work4Workers Branding)

```css
--primary-blue: #1B56FD      /* Bright Blue - Primary actions */
--deep-blue: #0118D8         /* Deep Blue - Secondary elements */
--accent-cream: #E9DFC3      /* Cream - Accents and highlights */
--light-bg: #FFF8F8          /* Off-White - Page backgrounds */
```

### Typography
- **Font Family:** Inter (Google Fonts)
- **Font Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Component Styles
- Rounded corners for friendliness
- Shadow effects for depth
- Hover transitions for interactivity
- Consistent spacing with Tailwind spacing scale

### Responsive Breakpoints
- Mobile: < 768px (single column, hamburger menu)
- Tablet: 768px - 1024px (adapted layouts)
- Desktop: > 1024px (full sidebar, multi-column)

## Forms and Validation

### React Hook Form Integration
All forms use React Hook Form for:
- Form state management
- Input validation
- Error handling
- Submission handling

### Zod Schema Validation
Example job posting schema:

```javascript
const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  pay: z.number().positive("Pay must be positive"),
  location: z.string().min(3, "Location is required"),
  // ... additional fields
});
```

## Performance Optimizations

### Current Optimizations
- Code splitting with React Router lazy loading
- Image optimization
- Tailwind CSS purging in production
- Axios request/response caching

### Future Enhancements
- React.memo for expensive components
- useMemo and useCallback for optimization
- Virtual scrolling for long lists
- Service Worker for offline support

## Environment Configuration

Required environment variables in `.env.local`:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000
```

## Build and Deployment

### Development

```bash
npm start           # Start development server (port 3000)
npm test            # Run tests
```

### Production

```bash
npm run build       # Create optimized production build
```

Output: `build/` directory with static files ready for deployment

### Deployment Targets
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## Testing

### Current Status
- Test infrastructure in place (Jest, React Testing Library)
- Component tests pending implementation

### Recommended Tests
- Unit tests for utility functions
- Component tests for UI components
- Integration tests for page flows
- E2E tests for critical user journeys

## Accessibility

### Current Implementation
- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals

### Future Enhancements
- Screen reader testing
- Color contrast validation
- WCAG 2.1 AA compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. **Tailwind @apply Warnings** - CSS warnings in development are expected and can be ignored
2. **Backend Dependency** - Frontend requires backend API for full functionality
3. **Supabase Required** - Valid Supabase credentials needed for database operations
4. **No Offline Support** - Application requires internet connection

## Development Guidelines

### Code Style
- ESLint configuration for code quality
- Consistent component structure
- Functional components with hooks
- PropTypes or TypeScript (prepared for migration)

### Component Organization
```javascript
// Recommended component structure
import React, { useState, useEffect } from 'react';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Effects
  useEffect(() => {
    // side effects
  }, []);

  // 3. Handlers
  const handleClick = () => {
    // logic
  };

  // 4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### File Naming
- Components: PascalCase (e.g., `JobPostForm.jsx`)
- Utilities: camelCase (e.g., `helpers.js`)
- Styles: kebab-case (e.g., `app-styles.css`)

## Future Roadmap

### Planned Features
- [ ] User authentication with JWT
- [ ] Real-time notifications with Supabase subscriptions
- [ ] Advanced search and filtering
- [ ] Candidate profile pages
- [ ] Message center for employer-candidate communication
- [ ] Analytics dashboard
- [ ] Mobile app version

### Technical Improvements
- [ ] TypeScript migration
- [ ] Comprehensive test coverage
- [ ] Performance monitoring
- [ ] Error boundary implementation
- [ ] Progressive Web App (PWA) capabilities

## Contributing

When contributing to the frontend:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure responsive design
5. Test across browsers
6. Verify accessibility

## Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Jitsi React SDK Documentation](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-react-sdk)
