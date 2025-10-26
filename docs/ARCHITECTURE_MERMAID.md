# Jale AI Hiring Assistant - Mermaid Architecture Diagrams

## 🏗️ System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend - React App (Port 3000)"
        A[Employer Portal]
        B[Candidate Portal]
        C[Shared Components]

        A --> A1[Dashboard]
        A --> A2[Job Posting Form]
        A --> A3[Active Jobs]
        A --> A4[Applications]
        A --> A5[Interview Scheduler]
        A --> A6[Interview Room]

        B --> B1[Job Matcher]
        B --> B2[Application Form]
        B --> B3[Interview Room]
        B --> B4[AI Chatbot]

        C --> C1[Navbar]
        C --> C2[Button]
        C --> C3[Card]
        C --> C4[Modal]
    end

    subgraph "Backend - Node.js + Express (Port 5000)"
        D[API Routes]
        E[Services]
        F[Controllers]

        D --> D1[/api/jobs]
        D --> D2[/api/candidates]
        D --> D3[/api/applications]
        D --> D4[/api/interviews]
        D --> D5[/api/chat]

        E --> E1[Claude AI Service]
        E --> E2[Notification Service]
        E --> E3[Scheduling Service]

        F --> F1[Job Controller]
        F --> F2[Candidate Controller]
        F --> F3[Interview Controller]
    end

    subgraph "Database - Supabase PostgreSQL"
        G[Tables]

        G --> G1[jobs]
        G --> G2[candidates]
        G --> G3[applications]
        G --> G4[interviews]
    end

    subgraph "External Services"
        H[Claude 3 Haiku]
        I[Gmail SMTP]
        J[Jitsi Meet]
    end

    A --> D
    B --> D
    D --> F
    F --> E
    F --> G
    E --> H
    E --> I
    A6 --> J
    B3 --> J
    E1 --> H

    style A fill:#e1f5ff
    style B fill:#fff4e1
    style D fill:#f0f0f0
    style E fill:#e8f5e9
    style G fill:#fce4ec
    style H fill:#fff3e0
    style I fill:#fff3e0
    style J fill:#fff3e0
```

---

## 📊 Database Schema & Relationships

```mermaid
erDiagram
    JOBS ||--o{ APPLICATIONS : "receives"
    CANDIDATES ||--o{ APPLICATIONS : "submits"
    APPLICATIONS ||--o| INTERVIEWS : "scheduled for"

    JOBS {
        uuid id PK
        string title
        string company "NEW"
        text description
        decimal pay
        string location
        string job_type "NEW - Full-time/Part-time"
        string schedule
        text[] requirements
        string status
        string language
        timestamp created_at
    }

    CANDIDATES {
        uuid id PK
        string name
        string email UK
        string phone
        text[] skills
        integer experience_years
        text[] certifications
        string education
        string language_preference
        string resume_url
        timestamp created_at
    }

    APPLICATIONS {
        uuid id PK
        uuid job_id FK
        uuid candidate_id FK
        string status
        integer match_score "0-100 AI calculated"
        timestamp created_at
        timestamp updated_at
    }

    INTERVIEWS {
        uuid id PK
        uuid application_id FK
        timestamp scheduled_time
        integer duration_minutes
        string jitsi_room_id
        string status
        string decision
        integer rating "1-5"
        text notes
        timestamp created_at
    }
```

---

## 🔄 Application Flow with Resume Upload

```mermaid
sequenceDiagram
    actor C as Candidate
    participant F as Frontend
    participant B as Backend
    participant P as PDF Parser
    participant AI as Claude AI
    participant DB as Database

    C->>F: Upload Resume (PDF/TXT)
    F->>B: POST /api/candidates/parse-resume-file
    B->>P: Extract text from PDF
    P-->>B: Resume text
    B->>AI: Parse resume text
    AI-->>B: Structured JSON {name, email, skills...}
    B-->>F: Parsed candidate data
    F->>F: Auto-fill form fields
    C->>F: Review & submit application
    F->>B: POST /api/candidates (with job_id)
    B->>DB: Check for duplicate application
    alt Duplicate Found
        DB-->>B: Existing application
        B-->>F: 409 Error - Already applied
        F-->>C: Show error message
    else New Application
        B->>DB: Upsert candidate
        B->>AI: Calculate match score
        AI-->>B: Match score + analysis
        B->>DB: Insert application with score
        DB-->>B: Application created
        B-->>F: 201 Success
        F-->>C: Navigate to success page
    end
```

---

## 🎯 Job Matching Algorithm Flow

```mermaid
flowchart TD
    Start([Candidate Submits Job Matcher Form]) --> Fetch[Fetch All Active Jobs]
    Fetch --> Loop{For Each Job}

    Loop --> Score[Initialize Score = 0]
    Score --> CheckType{Job Type Match?}

    CheckType -->|Full-time = Full-time| Type[+30 points]
    CheckType -->|No Match| CheckSkills
    Type --> CheckSkills

    CheckSkills{Skills Match?} -->|Yes| Skills["+5 pts per skill<br/>(max 30 pts)"]
    CheckSkills -->|No| CheckPay
    Skills --> CheckPay

    CheckPay{Pay in Range?} -->|Within range| Pay1[+25 points]
    CheckPay{Pay in Range?} -->|Above min only| Pay2[+15 points]
    CheckPay -->|No| CheckLocation
    Pay1 --> CheckLocation
    Pay2 --> CheckLocation

    CheckLocation{Location Match?} -->|Yes| Loc[+20 points]
    CheckLocation -->|No| CheckField
    Loc --> CheckField

    CheckField{Field Match?} -->|Yes| Field[+15 points]
    CheckField -->|No| CalcTotal
    Field --> CalcTotal

    CalcTotal[Calculate Total Score<br/>Cap at 100%] --> AddReasons[Add Match Reasons]
    AddReasons --> MoreJobs{More Jobs?}

    MoreJobs -->|Yes| Loop
    MoreJobs -->|No| Sort[Sort by Score DESC]
    Sort --> Display[Display Matched Jobs]
    Display --> End([Show Results to Candidate])

    style Start fill:#e1f5ff
    style End fill:#c8e6c9
    style Type fill:#fff9c4
    style Skills fill:#fff9c4
    style Pay1 fill:#fff9c4
    style Pay2 fill:#ffe0b2
    style Loc fill:#fff9c4
    style Field fill:#fff9c4
```

---

## 🤖 AI Match Scoring Process

```mermaid
flowchart LR
    subgraph Input
        C[Candidate Profile]
        J[Job Requirements]
    end

    C --> AI[Claude 3 Haiku]
    J --> AI

    AI --> Analysis{AI Analysis}

    Analysis --> S1[Skills Match<br/>40 points]
    Analysis --> S2[Experience<br/>25 points]
    Analysis --> S3[Certifications<br/>15 points]
    Analysis --> S4[Location/Schedule<br/>10 points]
    Analysis --> S5[Education/Language<br/>10 points]

    S1 --> Total[Total Score<br/>0-100]
    S2 --> Total
    S3 --> Total
    S4 --> Total
    S5 --> Total

    Total --> Output{Output}

    Output --> O1[Match Score]
    Output --> O2[Reasoning]
    Output --> O3[Strengths Array]
    Output --> O4[Red Flags Array]
    Output --> O5[Recommendation]

    O1 --> Save[(Save to Database)]
    O2 --> Save
    O3 --> Save
    O4 --> Save
    O5 --> Save

    style AI fill:#fff3e0
    style S1 fill:#ffebee
    style Total fill:#e8f5e9
    style Save fill:#fce4ec
```

---

## 📅 Interview Scheduling Flow

```mermaid
sequenceDiagram
    actor E as Employer
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    participant Email as Gmail SMTP
    actor C as Candidate

    E->>F: Schedule Interview
    F->>F: Select date/time/duration
    F->>B: POST /api/interviews
    B->>B: Generate Jitsi Room ID
    B->>DB: Create interview record
    DB-->>B: Interview created
    B->>Email: Send invitation to candidate
    Email-->>C: Interview invitation email
    B-->>F: Interview scheduled
    F-->>E: Show confirmation

    Note over Email,C: Email contains:<br/>Date, Time, Jitsi Link

    rect rgb(230, 240, 255)
        Note over E,C: Interview Day - 24 hours before
        B->>B: Cron job runs (9 AM daily)
        B->>DB: Query upcoming interviews
        DB-->>B: Interviews in next 24h
        B->>Email: Send reminder emails
        Email-->>E: Reminder email
        Email-->>C: Reminder email
    end

    rect rgb(240, 255, 230)
        Note over E,C: Interview Time
        E->>F: Join interview room
        C->>F: Join interview room
        F->>F: Embedded Jitsi video
        E->>F: End interview & submit feedback
        F->>B: PUT /api/interviews/:id/feedback
        B->>DB: Save feedback & decision
        DB-->>B: Updated
        B-->>F: Saved
        F-->>E: Feedback submitted
    end
```

---

## 💬 Chatbot Interaction Flow

```mermaid
stateDiagram-v2
    [*] --> ChatClosed: Page Load
    ChatClosed --> ChatOpen: Click Chat Button
    ChatOpen --> WaitingInput: Display Chat Window

    WaitingInput --> ProcessingMessage: User sends message
    ProcessingMessage --> FetchContext: Get job context
    FetchContext --> CallClaude: Send to Claude AI
    CallClaude --> DisplayResponse: Receive AI response
    DisplayResponse --> WaitingInput: Show in chat

    WaitingInput --> ChatClosed: Close chat
    ChatOpen --> ChatClosed: Close chat

    note right of CallClaude
        Context includes:
        - Job title
        - Description
        - Pay
        - Location
        - Schedule
        - Requirements
        - Language (EN/ES)
    end note

    note right of DisplayResponse
        AI provides:
        - Helpful answers
        - Bilingual support
        - Conversational tone
        - Job-specific info
    end note
```

---

## 🔐 Authentication & Authorization (Future)

```mermaid
flowchart TB
    Start([User Visits App]) --> Auth{Authenticated?}

    Auth -->|No| Login[Show Login Page]
    Auth -->|Yes| Role{User Role?}

    Login --> Supabase[Supabase Auth]
    Supabase --> JWT[Receive JWT Token]
    JWT --> Role

    Role -->|Employer| Employer[Employer Portal]
    Role -->|Candidate| Candidate[Candidate Portal]
    Role -->|Admin| Admin[Admin Dashboard]

    Employer --> E1[Job Management]
    Employer --> E2[View Applications]
    Employer --> E3[Schedule Interviews]

    Candidate --> C1[Browse Jobs]
    Candidate --> C2[Apply to Jobs]
    Candidate --> C3[View Applications]

    Admin --> A1[Manage Users]
    Admin --> A2[System Settings]
    Admin --> A3[Analytics]

    E1 --> Protected{Protected Route}
    E2 --> Protected
    E3 --> Protected
    C1 --> Protected
    C2 --> Protected
    C3 --> Protected
    A1 --> Protected
    A2 --> Protected
    A3 --> Protected

    Protected -->|Valid JWT| Allow[Access Granted]
    Protected -->|Invalid JWT| Deny[Redirect to Login]

    style Start fill:#e1f5ff
    style Supabase fill:#fff3e0
    style Employer fill:#e8f5e9
    style Candidate fill:#fff9c4
    style Admin fill:#ffebee
    style Allow fill:#c8e6c9
    style Deny fill:#ffcdd2
```

---

## 📈 Data Analytics Dashboard (Future)

```mermaid
graph LR
    subgraph Data Sources
        DB1[(Jobs)]
        DB2[(Applications)]
        DB3[(Interviews)]
        DB4[(Candidates)]
    end

    subgraph Analytics Engine
        AGG[Data Aggregation]
        CALC[Calculations]
    end

    subgraph Metrics
        M1[Total Jobs Posted]
        M2[Total Applications]
        M3[Average Match Score]
        M4[Interview Success Rate]
        M5[Time to Hire]
        M6[Top Skills Demanded]
        M7[Application Status Breakdown]
        M8[Geographic Distribution]
    end

    subgraph Visualizations
        V1[Bar Charts]
        V2[Line Graphs]
        V3[Pie Charts]
        V4[Heat Maps]
    end

    DB1 --> AGG
    DB2 --> AGG
    DB3 --> AGG
    DB4 --> AGG

    AGG --> CALC

    CALC --> M1
    CALC --> M2
    CALC --> M3
    CALC --> M4
    CALC --> M5
    CALC --> M6
    CALC --> M7
    CALC --> M8

    M1 --> V1
    M2 --> V1
    M3 --> V2
    M4 --> V3
    M5 --> V2
    M6 --> V4
    M7 --> V3
    M8 --> V4

    style DB1 fill:#fce4ec
    style DB2 fill:#fce4ec
    style DB3 fill:#fce4ec
    style DB4 fill:#fce4ec
    style AGG fill:#e8f5e9
    style CALC fill:#e8f5e9
```

---

## 🚀 Deployment Pipeline

```mermaid
flowchart TD
    Dev[Local Development] --> Git[Git Commit & Push]
    Git --> GitHub[GitHub Repository]

    GitHub --> CI{CI/CD Pipeline}

    CI --> Test1[Run Tests]
    CI --> Test2[Lint Code]
    CI --> Test3[Build Frontend]
    CI --> Test4[Build Backend]

    Test1 --> Pass{All Pass?}
    Test2 --> Pass
    Test3 --> Pass
    Test4 --> Pass

    Pass -->|Yes| Deploy{Deploy Stage}
    Pass -->|No| Fail[❌ Deployment Failed]

    Deploy --> FE[Deploy Frontend]
    Deploy --> BE[Deploy Backend]

    FE --> Vercel[Vercel/Netlify]
    BE --> Railway[Railway/Heroku/Render]

    Vercel --> CDN[CDN Distribution]
    Railway --> Server[Production Server]

    CDN --> Live[✅ Live Production]
    Server --> Live

    Live --> Monitor[Monitoring & Logs]
    Monitor --> Alert{Issues?}

    Alert -->|Yes| Rollback[Rollback to Previous]
    Alert -->|No| Success[✅ Deployment Complete]

    Rollback --> GitHub

    style Dev fill:#e1f5ff
    style Pass fill:#fff9c4
    style Live fill:#c8e6c9
    style Success fill:#c8e6c9
    style Fail fill:#ffcdd2
    style Rollback fill:#ffe0b2
```

---

## 🎨 Component Hierarchy

```mermaid
graph TD
    App[App.js] --> Router[React Router]

    Router --> EmployerRoutes[Employer Routes]
    Router --> CandidateRoutes[Candidate Routes]
    Router --> SharedRoutes[Shared Routes]

    EmployerRoutes --> Dashboard
    EmployerRoutes --> JobPosting
    EmployerRoutes --> ActiveJobs
    EmployerRoutes --> ApplicationDetail
    EmployerRoutes --> InterviewScheduler
    EmployerRoutes --> InterviewRoom

    CandidateRoutes --> JobMatcher
    CandidateRoutes --> ApplicationForm
    CandidateRoutes --> CandidatePortal
    CandidateRoutes --> InterviewRoomCandidate[Interview Room]

    JobPosting --> JobPostForm
    ActiveJobs --> Card
    ActiveJobs --> Button
    ApplicationDetail --> Card
    ApplicationDetail --> Button

    JobMatcher --> Card
    JobMatcher --> Button
    ApplicationForm --> ChatBot

    ChatBot --> Modal

    SharedRoutes --> Navbar
    SharedRoutes --> Sidebar

    style App fill:#e1f5ff
    style EmployerRoutes fill:#e8f5e9
    style CandidateRoutes fill:#fff9c4
    style SharedRoutes fill:#f0f0f0
```

---

**Generated:** October 25, 2025  
**Version:** 2.0 - Complete Mermaid Diagrams  
**Project:** Jale AI Hiring Assistant
