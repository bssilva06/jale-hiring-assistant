# Component Documentation

Visual reference guide for all UI components in the Jale AI Hiring Assistant frontend.

## Page Components

### Dashboard

Location: `src/pages/Dashboard.jsx`

The employer dashboard provides an overview of hiring metrics and recent activity.

```
┌─────────────────────────────────────────────────────────┐
│ Hiring Dashboard                        [Post New Job] │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Active   │  │  Total   │  │Interview │  │ Hired   ││
│  │ Jobs: 5  │  │  Apps: 12│  │ Sched: 3 │  │ Total:2 ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
├─────────────────────────────────────────────────────────┤
│  Recent Applications          │  Active Jobs           │
│  ┌─────────────────────────┐  │  • Warehouse Associate │
│  │ John Doe                │  │  • Delivery Driver     │
│  │ 85% Match               │  │  • Forklift Operator   │
│  │ john@example.com        │  │                        │
│  │ [Schedule] [View]       │  │  [View All Jobs]       │
│  └─────────────────────────┘  │                        │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time statistics cards
- Recent applications list
- Active jobs overview
- Quick action buttons

### Job Posting

Location: `src/pages/JobPosting.jsx`

Form for creating and editing job postings.

```
┌─────────────────────────────────────────┐
│ Post a New Job                          │
├─────────────────────────────────────────┤
│ Job Title *                             │
│ [Warehouse Associate.................]  │
│                                         │
│ Job Description *                       │
│ [________________________]              │
│ [________________________]              │
│                                         │
│ Pay ($/hr) *    │  Location *           │
│ [18.50.......]  │  [Miami, FL.........]  │
│                                         │
│ Schedule *                              │
│ [Monday-Friday, 8am-5pm.............]  │
│                                         │
│ Requirements * (one per line)           │
│ [Forklift certification...........]     │
│ [2+ years warehouse experience....]    │
│                                         │
│ Language: [English ▼]                   │
│                                         │
│ [Post Job & Start Outreach]  [Cancel]  │
└─────────────────────────────────────────┘
```

**Fields:**
- Job title, company name, description
- Pay rate, location, schedule
- Requirements (multi-line)
- Job type and language selection

### Candidate Portal

Location: `src/pages/CandidatePortal.jsx`

Job viewing and application interface for candidates.

```
┌─────────────────────────────────────────────────┐
│ Warehouse Associate                             │
│ $18.50/hr  Miami, FL  Mon-Fri, 8-5             │
├─────────────────────────────────────────────────┤
│ We are looking for an experienced warehouse     │
│ worker to join our team...                      │
│                                                 │
│ Requirements:                                   │
│ ✓ Forklift certification                       │
│ ✓ 2+ years warehouse experience                │
├─────────────────────────────────────────────────┤
│ Apply for Position                              │
│                                                 │
│ Full Name *                                     │
│ [John Doe...........................]           │
│                                                 │
│ Email *           │  Phone *                    │
│ [john@email.com]  │  [+1-555-0100........]     │
│                                                 │
│ Skills * (one per line)                         │
│ [Forklift operation.............]               │
│ [Inventory management...........]                │
│                                                 │
│ [Submit Application]  [Cancel]                  │
├─────────────────────────────────────────────────┤
│                           ┌────────────────────┐│
│                           │ Chat with AI       ││
│                           └────────────────────┘│
└─────────────────────────────────────────────────┘
```

**Features:**
- Job details display
- Application form
- Floating chatbot button

### Interview Room

Location: `src/pages/InterviewRoom.jsx`

Video interview interface with Jitsi integration.

```
┌────────────────────────────────────────────────────┐
│  ╔════════════════════════╗  │ Candidate Info     │
│  ║                        ║  │                    │
│  ║   JITSI VIDEO          ║  │ John Doe           │
│  ║   CONFERENCE AREA      ║  │ Warehouse Assoc.   │
│  ║                        ║  │                    │
│  ║   [Mute] [Video] [End] ║  │ Match: 85%         │
│  ╚════════════════════════╝  │                    │
│                               │ Strengths:         │
│  Interview Feedback           │ • Forklift cert    │
│  Decision:                    │ • 3+ years exp     │
│  [Hire] [Maybe] [Reject]      │                    │
│                               │ [End Interview]    │
│  Rating: ⭐⭐⭐⭐⭐           │                    │
│                               │                    │
│  Notes:                       │                    │
│  [Great communication...]      │                    │
│                               │                    │
│  [Save Feedback]              │                    │
└────────────────────────────────────────────────────┘
```

**Features:**
- Embedded Jitsi video conference
- Candidate information sidebar
- Interview feedback form
- Hiring decision buttons
- Rating system
- Notes section

## Shared Components

### Button Component

Location: `src/components/shared/Button.jsx`

Reusable button with multiple variants.

**Variants:**
```
[Primary]  [Secondary]  [Success]  [Danger]  [Outline]
  Blue       Gray         Green      Red      Bordered
```

**Usage:**
```jsx
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
- `onClick`: Click handler
- `disabled`: Boolean
- `type`: 'button' | 'submit'
- `children`: Button text/content

### Card Component

Location: `src/components/shared/Card.jsx`

Container component with optional hover effects.

```
┌─────────────────────┐
│ Card Title          │
│ Card content goes   │
│ here...             │
│                     │
└─────────────────────┘
```

**Usage:**
```jsx
<Card hoverable>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

**Props:**
- `hoverable`: Enable hover shadow effect
- `onClick`: Optional click handler
- `className`: Additional CSS classes

### Modal Component

Location: `src/components/shared/Modal.jsx`

Dialog overlay for confirmations and forms.

```
    ┌─────────────────────────┐
    │ Modal Title         [×] │
    ├─────────────────────────┤
    │ Modal content...        │
    │                         │
    │ [Confirm]  [Cancel]     │
    └─────────────────────────┘
```

**Usage:**
```jsx
<Modal isOpen={isOpen} onClose={handleClose} title="Confirm">
  <p>Are you sure?</p>
</Modal>
```

**Props:**
- `isOpen`: Boolean to control visibility
- `onClose`: Close handler
- `title`: Modal header text
- `children`: Modal content

### Badge Component

Color-coded status indicators.

**Match Score Badges:**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│85% Match │  │72% Match │  │45% Match │
│   ✅     │  │   ⚠️     │  │   ❌     │
└──────────┘  └──────────┘  └──────────┘
   Green        Yellow         Red
  (80%+)       (60-79%)       (<60%)
```

**Status Badges:**
```
┌──────────┐  ┌──────────┐  ┌──────────┐
│Submitted │  │Interview │  │  Hired   │
└──────────┘  └──────────┘  └──────────┘
```

## Employer Components

### CandidateList

Location: `src/components/hiring/CandidateList.jsx`

Displays candidates with filtering and sorting.

```
Filter: [All (12)] [Excellent 80%+ (5)] [Good 60-79% (4)] [Poor <60% (3)]

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ John Doe       │  │ Jane Smith     │  │ Bob Wilson     │
│ Warehouse Assoc│  │ Delivery Driver│  │ Forklift Op    │
│                │  │                │  │                │
│ 85% Match ✅   │  │ 72% Match ⚠️  │  │ 45% Match ❌   │
│ Submitted      │  │ Interview      │  │ Rejected       │
│                │  │                │  │                │
│ john@email.com │  │ jane@email.com │  │ bob@email.com  │
│ 555-0100       │  │ 555-0101       │  │ 555-0102       │
│                │  │                │  │                │
│ Skills:        │  │ Skills:        │  │ Skills:        │
│ [Forklift] [+2]│  │ [Driving] [+3] │  │ [Lifting] [+1] │
│                │  │                │  │                │
│ [Schedule]     │  │ [View]         │  │ [View]         │
└────────────────┘  └────────────────┘  └────────────────┘
```

**Features:**
- Match score filtering
- Status badges
- Contact information
- Skills display
- Action buttons

### InterviewScheduler

Location: `src/components/hiring/InterviewScheduler.jsx`

Interview scheduling form component.

```
┌────────────────────────────────────┐
│ Schedule Interview                 │
├────────────────────────────────────┤
│ Interview Date *                   │
│ [2025-10-25...............]        │
│                                    │
│ Interview Time *                   │
│ [14:00.................]           │
│                                    │
│ Duration (minutes)                 │
│ [30 minutes ▼]                     │
│                                    │
│ ┌────────────────────────────────┐│
│ │ Automatic Reminders:           ││
│ │ • Confirmation email           ││
│ │ • 24-hour reminder             ││
│ │ • 1-hour reminder              ││
│ └────────────────────────────────┘│
│                                    │
│ [Schedule Interview]  [Cancel]     │
└────────────────────────────────────┘
```

**Features:**
- Date and time pickers
- Duration selection
- Automatic reminder notification
- Jitsi room generation

### JobPostForm

Location: `src/components/hiring/JobPostForm.jsx`

Reusable form for job creation and editing.

**Features:**
- Form validation with Zod
- Multi-line requirements input
- Language selection
- Job type dropdown
- Real-time validation feedback

## Candidate Components

### ChatBot

Location: `src/components/candidate/ChatBot.jsx`

Bilingual AI chatbot widget.

**Closed State:**
```
                    ┌──────┐
                    │ 💬   │
                    └──────┘
```

**Open State:**
```
┌─────────────────────────────────┐
│ Jale AI Assistant           [×] │
│ Ask me anything!                │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ¡Hola! Hi! I'm here to      │ │
│ │ answer your questions...    │ │
│ │ 9:00 AM                     │ │
│ └─────────────────────────────┘ │
│                                 │
│             ┌─────────────────┐ │
│             │ What's the pay? │ │
│             │ 9:01 AM         │ │
│             └─────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ This position pays $18.50/hr│ │
│ │ 9:01 AM                     │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ Suggested questions:            │
│ [What's the pay?]               │
│ [What's the schedule?]          │
│ [Where is it located?]          │
├─────────────────────────────────┤
│ Type your message...       [📤] │
└─────────────────────────────────┘
```

**Features:**
- Automatic language detection
- Contextual responses
- Suggested questions
- Message history
- Floating widget positioning

### ApplicationForm

Location: `src/components/candidate/ApplicationForm.jsx`

Job application submission form.

```
┌────────────────────────────────────┐
│ Apply for Position                 │
├────────────────────────────────────┤
│ Personal Information               │
│ ───────────────────────────────    │
│ Full Name *                        │
│ [John Doe.....................]    │
│                                    │
│ Email *           Phone *          │
│ [john@email.com]  [+1-555-0100]   │
│                                    │
│ Preferred Language                 │
│ [English ▼]                        │
│                                    │
│ Experience & Skills                │
│ ───────────────────────────────    │
│ Years of Experience *              │
│ [3]                                │
│                                    │
│ Skills * (one per line)            │
│ [Forklift operation.........]      │
│ [Inventory management.......]       │
│ [Warehouse safety...........]       │
│                                    │
│ Certifications (optional)          │
│ [Forklift certified.........]      │
│                                    │
│ [Submit Application]  [Cancel]     │
└────────────────────────────────────┘
```

**Features:**
- Form validation
- Resume upload option
- AI auto-fill from resume
- Duplicate prevention

## Layout Components

### Navbar

Location: `src/components/layout/Navbar.jsx`

Top navigation bar.

**Features:**
- Branding/logo
- Navigation links
- User menu (prepared)
- Mobile hamburger menu
- Responsive breakpoints

### Sidebar

Location: `src/components/layout/Sidebar.jsx`

Side navigation menu.

**Features:**
- Role-based menu items
- Active route highlighting
- Collapsible on mobile
- Icon + text labels

## Design System

### Color Palette

```
Primary (Blue):    #1B56FD  ■
Deep Blue:         #0118D8  ■
Accent (Cream):    #E9DFC3  ■
Light Background:  #FFF8F8  ■
Success (Green):   #10B981  ■
Danger (Red):      #EF4444  ■
```

### Typography

- **Font Family:** Inter
- **Headings:** 700 (bold)
- **Body:** 400 (regular)
- **Buttons:** 500 (medium)

### Spacing

Uses Tailwind spacing scale (4px base):
- `p-2` = 8px padding
- `p-4` = 16px padding
- `p-6` = 24px padding
- `p-8` = 32px padding

### Shadows

- `shadow-sm` - Subtle elevation
- `shadow-md` - Card elevation
- `shadow-lg` - Modal/dropdown
- `shadow-xl` - Prominent elements

## Responsive Behavior

### Mobile (< 768px)

```
┌───────────────┐
│ ☰ Jale AI [≡] │
├───────────────┤
│               │
│  Single       │
│  Column       │
│  Layout       │
│               │
│  ┌─────────┐ │
│  │ Card 1  │ │
│  └─────────┘ │
│  ┌─────────┐ │
│  │ Card 2  │ │
│  └─────────┘ │
│               │
└───────────────┘
```

### Desktop (> 1024px)

```
┌────────────────────────────────────┐
│ Jale AI    [Dashboard] [Jobs] [...] │
├───┬────────────────────────────────┤
│ S │  Dashboard Content             │
│ i │  ┌────┐ ┌────┐ ┌────┐ ┌────┐  │
│ d │  │Stat│ │Stat│ │Stat│ │Stat│  │
│ e │  └────┘ └────┘ └────┘ └────┘  │
│ b │  ┌─────────┐ ┌─────────┐      │
│ a │  │ Card 1  │ │ Card 2  │      │
│ r │  └─────────┘ └─────────┘      │
└───┴────────────────────────────────┘
```

## Component States

### Loading State

```
┌─────────────────┐
│                 │
│    ◌  ◌  ◌     │
│    Loading...   │
│                 │
└─────────────────┘
```

### Empty State

```
┌─────────────────┐
│       👤        │
│                 │
│ No candidates   │
│     found       │
│                 │
│  [Add First]    │
└─────────────────┘
```

### Error State

```
┌─────────────────┐
│       ⚠️        │
│                 │
│ Failed to load  │
│  [Try Again]    │
└─────────────────┘
```

## User Flows

### Candidate Application Flow

```
Landing Page → View Job Details → Open Chatbot (optional)
→ Fill Application → Submit → Success Message
```

### Hiring Manager Flow

```
Dashboard → Post Job → View Applications → Filter by Score
→ Select Candidate → Schedule Interview → Join Video
→ Submit Feedback → Update Dashboard
```

### Interview Flow

```
Interview List → Click Join → Jitsi Loads → Video Call
→ End Call → Feedback Form → Rate & Decide → Submit
```

## Data Flow Architecture

```
Frontend Components
       ↓
   API Service (Axios)
       ↓
Backend API (localhost:5000)
       ↓
   ┌────────┬──────────┐
   ↓        ↓          ↓
Supabase  Claude AI  n8n
```

## Component Best Practices

### File Organization
- One component per file
- Co-locate styles if needed
- Keep components focused and single-purpose

### Props
- Use PropTypes or TypeScript
- Provide default props
- Document expected props

### State
- Lift state up when needed
- Use local state for UI concerns
- Consider Context for deep prop drilling

### Performance
- Memoize expensive computations
- Avoid inline function definitions in render
- Use React.memo for pure components

## Testing Components

### Recommended Approach
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click</Button>);
  fireEvent.click(screen.getByText('Click'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Accessibility Guidelines

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation
- Maintain color contrast ratios
- Add ARIA labels where needed
- Test with screen readers

## Resources

- [React Component Patterns](https://reactpatterns.com/)
- [Tailwind UI Components](https://tailwindui.com/)
- [React Hook Form Examples](https://react-hook-form.com/get-started)
- [Accessibility Guide](https://www.w3.org/WAI/WCAG21/quickref/)
