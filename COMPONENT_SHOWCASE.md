# 🎨 Frontend Component Showcase

## Visual Guide to All Components

### 🏠 Pages

#### 1. Dashboard (`/dashboard`)

```
┌─────────────────────────────────────────────────────────┐
│ 📊 Hiring Dashboard                     [Post New Job] │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │ Active   │  │  Total   │  │Interview │  │ Hired   ││
│  │ Jobs: 5  │  │  Apps: 12│  │ Sched: 3 │  │ Total:2 ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
├─────────────────────────────────────────────────────────┤
│  Recent Applications          │  Active Jobs           │
│  ┌─────────────────────────┐  │  • Warehouse Associate │
│  │ 👤 John Doe             │  │  • Delivery Driver     │
│  │ 85% Match ✅            │  │  • Forklift Operator   │
│  │ john@example.com        │  │                        │
│  │ [Schedule] [View]       │  │  [View All Jobs]       │
│  └─────────────────────────┘  │                        │
└─────────────────────────────────────────────────────────┘
```

#### 2. Job Posting (`/jobs/new`)

```
┌─────────────────────────────────────────┐
│ 💼 Post a New Job                       │
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

#### 3. Candidate Portal (`/apply/:jobId`)

```
┌─────────────────────────────────────────────────┐
│ Warehouse Associate                             │
│ 💵 $18.50/hr  📍 Miami, FL  ⏰ Mon-Fri, 8-5    │
├─────────────────────────────────────────────────┤
│ We are looking for an experienced warehouse     │
│ worker to join our team...                      │
│                                                 │
│ Requirements:                                   │
│ ✓ Forklift certification                       │
│ ✓ 2+ years warehouse experience                │
├─────────────────────────────────────────────────┤
│ 📝 Apply for Position                           │
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
│                           │ 💬 Chat with AI    ││ ← Floating button
│                           └────────────────────┘│
└─────────────────────────────────────────────────┘
```

#### 4. Interview Room (`/interviews/room/:id`)

```
┌────────────────────────────────────────────────────┐
│  ╔════════════════════════╗  │ Candidate Info     │
│  ║                        ║  │                    │
│  ║   📹 JITSI VIDEO       ║  │ John Doe           │
│  ║   CONFERENCE AREA      ║  │ Warehouse Assoc.   │
│  ║                        ║  │                    │
│  ║   [Mute] [Video] [End] ║  │ Match: 85%         │
│  ╚════════════════════════╝  │                    │
│                               │ Strengths:         │
│  Interview Feedback           │ • Forklift cert    │
│  Decision:                    │ • 3+ years exp     │
│  [✓ Hire] [? Maybe] [✗ Reject]│                    │
│                               │ [End Interview]    │
│  Rating: ⭐⭐⭐⭐⭐           │                    │
│                               │                    │
│  Notes:                       │                    │
│  [Great communication...]      │                    │
│                               │                    │
│  [Save Feedback]              │                    │
└────────────────────────────────────────────────────┘
```

---

### 🧩 Shared Components

#### Button Component

```jsx
<Button variant="primary">Click Me</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="success">Hire</Button>
<Button variant="danger">Reject</Button>
<Button variant="outline">View</Button>
```

Visual:

```
[Click Me]  [Cancel]  [Hire]  [Reject]  [View]
  Blue      Gray      Green    Red      Outlined
```

#### Card Component

```jsx
<Card hoverable>
  <h3>Candidate Name</h3>
  <p>Details...</p>
</Card>
```

Visual:

```
┌─────────────────────┐
│ Candidate Name      │
│ Details...          │
│                     │
└─────────────────────┘
(Hover for shadow effect)
```

#### Modal Component

```jsx
<Modal isOpen={true} title="Confirmation">
  <p>Are you sure?</p>
</Modal>
```

Visual:

```
    ┌─────────────────────────┐
    │ Confirmation        [×] │
    ├─────────────────────────┤
    │ Are you sure?           │
    │                         │
    │ [Yes]  [No]             │
    └─────────────────────────┘
```

---

### 💼 Hiring Manager Components

#### CandidateList

```
Filter: [All (12)] [Excellent 80%+ (5)] [Good 60-79% (4)] [Poor <60% (3)]

┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ 👤 John Doe    │  │ 👤 Jane Smith  │  │ 👤 Bob Wilson  │
│ Warehouse Assoc│  │ Delivery Driver│  │ Forklift Op    │
│                │  │                │  │                │
│ 85% Match ✅   │  │ 72% Match ⚠️  │  │ 45% Match ❌   │
│ Submitted 📘   │  │ Interview 📅   │  │ Rejected ❌    │
│                │  │                │  │                │
│ 📧 john@...    │  │ 📧 jane@...    │  │ 📧 bob@...     │
│ 📞 555-0100    │  │ 📞 555-0101    │  │ 📞 555-0102    │
│                │  │                │  │                │
│ Skills:        │  │ Skills:        │  │ Skills:        │
│ [Forklift] [+2]│  │ [Driving] [+3] │  │ [Lifting] [+1] │
│                │  │                │  │                │
│ [📅 Schedule]  │  │ [👁️ View]      │  │ [👁️ View]      │
└────────────────┘  └────────────────┘  └────────────────┘
```

#### InterviewScheduler

```
┌────────────────────────────────────┐
│ 📅 Schedule Interview              │
├────────────────────────────────────┤
│ Interview Date *                   │
│ [📅 2025-10-25...............]     │
│                                    │
│ Interview Time *                   │
│ [⏰ 14:00.................]        │
│                                    │
│ Duration (minutes)                 │
│ [30 minutes ▼]                     │
│                                    │
│ ┌────────────────────────────────┐│
│ │ 📧 Automatic Reminders:        ││
│ │ • Confirmation email           ││
│ │ • 24-hour reminder             ││
│ │ • 1-hour reminder              ││
│ └────────────────────────────────┘│
│                                    │
│ [Schedule Interview]  [Cancel]     │
└────────────────────────────────────┘
```

---

### 👥 Candidate Components

#### ChatBot (Closed)

```
                    ┌──────┐
                    │ 💬   │  ← Floating button
                    └──────┘
```

#### ChatBot (Open)

```
┌─────────────────────────────────┐
│ 🤖 Jale AI Assistant        [×] │
│ Ask me anything!                │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ 🤖 ¡Hola! Hi! I'm here to  │ │
│ │    answer your questions... │ │
│ │    9:00 AM                  │ │
│ └─────────────────────────────┘ │
│                                 │
│             ┌─────────────────┐ │
│             │ What's the pay? │ 👤│
│             │ 9:01 AM         │ │
│             └─────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🤖 This Warehouse Associate │ │
│ │    position pays $18.50/hr  │ │
│ │    9:01 AM                  │ │
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

#### ApplicationForm

```
┌────────────────────────────────────┐
│ 📝 Apply for Position              │
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
│ ┌────────────────────────────────┐│
│ │ 💬 Have questions? Click chat  ││
│ │ to ask our AI assistant!       ││
│ └────────────────────────────────┘│
│                                    │
│ [Submit Application]  [Cancel]     │
└────────────────────────────────────┘
```

---

### 🎨 Design System

#### Color Palette

```
Primary (Blue):    #3B82F6  ■
Secondary (Green): #10B981  ■
Accent (Amber):    #F59E0B  ■
Success (Green):   #10B981  ■
Danger (Red):      #EF4444  ■
```

#### Badge Styles

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│85% Match │  │72% Match │  │45% Match │
│   ✅     │  │   ⚠️     │  │   ❌     │
└──────────┘  └──────────┘  └──────────┘
   Green        Yellow         Red
  (80%+)       (60-79%)       (<60%)

┌──────────┐  ┌──────────┐  ┌──────────┐
│Submitted │  │Interview │  │  Hired   │
│    📘    │  │    📅    │  │    ✅    │
└──────────┘  └──────────┘  └──────────┘
```

---

### 📱 Responsive Behavior

#### Mobile (< 768px)

```
┌───────────────┐
│ ☰ Jale AI [≡] │  ← Hamburger menu
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

#### Desktop (> 1024px)

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

---

### ⚡ Interactive States

#### Loading State

```
┌─────────────────┐
│                 │
│    ◌  ◌  ◌     │  ← Spinning animation
│    Loading...   │
│                 │
└─────────────────┘
```

#### Empty State

```
┌─────────────────┐
│       👤        │  ← Large icon
│                 │
│ No candidates   │
│     found       │
│                 │
│  [Add First]    │
└─────────────────┘
```

#### Error State

```
┌─────────────────┐
│       ⚠️        │
│                 │
│ Failed to load  │
│  [Try Again]    │
└─────────────────┘
```

---

## 🎯 Key Interactions

### 1. Candidate Application Flow

```
Landing Page → View Job Details → Open Chatbot (ask questions)
→ Fill Application → Submit → See Success Message
```

### 2. Hiring Manager Flow

```
Dashboard → Post Job → View Applications → Filter by Score
→ Select Candidate → Schedule Interview → Join Video
→ Submit Feedback → Update Dashboard
```

### 3. Interview Flow

```
Interview List → Click Join → Jitsi Loads → Video Call
→ End Call → Feedback Form → Rate & Decide → Submit
```

---

## 📊 Data Flow

```
Frontend Components
       ↓
   API Service (axios)
       ↓
Backend API (http://localhost:5000)
       ↓
   ┌────────┬──────────┐
   ↓        ↓          ↓
Supabase  Claude   n8n Workflows
(Database) (AI)    (Automation)
```

---

**All components are ready and fully functional!** 🎉
