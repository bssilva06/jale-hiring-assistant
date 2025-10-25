<div align="center">

# 🚀 Jale AI Hiring Assistant

### _Revolutionizing Blue-Collar Recruitment with AI_

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Claude AI](https://img.shields.io/badge/Claude-AI-8A63D2?style=for-the-badge&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Contributing](#-contributing)

---

</div>

## 📖 About

**Jale AI Hiring Assistant** is an intelligent recruitment platform designed specifically for blue-collar industries. Built for [Work4Workers](https://work4workers.com), it bridges the gap between employers and skilled workers through AI-powered matching, bilingual support, and automated workflows.

> 💡 **Winner of [Hackathon Name]** - Built in 48 hours to solve real-world hiring challenges in the construction and trades industries.

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 **AI-Powered Matching**

- Intelligent candidate-job matching using vector embeddings
- Claude AI analyzes skills, experience, and requirements
- Real-time match scores (0-100%) with detailed breakdowns

### 💬 **Bilingual Chatbot**

- English & Spanish support for inclusive hiring
- Context-aware conversations about job opportunities
- 24/7 candidate assistance and application guidance

</td>
<td width="50%">

### 📅 **Smart Scheduling**

- Automated interview coordination
- Calendar integrations and reminders
- SMS/Email notifications via n8n workflows

### 🎥 **Video Interviews**

- Built-in Jitsi Meet integration
- No downloads required - browser-based
- Recording capabilities for review

</td>
</tr>
</table>

### 🌟 Additional Features

- 📊 **Real-time Dashboard** - Track applications, interviews, and hiring metrics
- 🔍 **Advanced Filtering** - Sort candidates by match score, status, and skills
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🎨 **Custom Branding** - Tailored to Work4Workers' design system
- 🔐 **Secure Data** - Supabase PostgreSQL with row-level security
- ⚡ **Fast Performance** - Optimized React components and lazy loading

---

## 🎬 Demo

<!-- Replace with actual screenshots when ready -->

<div align="center">

### 🏠 Landing Page

_Role selection for employers and workers_

![Landing Page](https://via.placeholder.com/800x400/1B56FD/FFFFFF?text=Landing+Page+Screenshot)

### 💼 Employer Dashboard

_Manage jobs, candidates, and interviews_

![Dashboard](https://via.placeholder.com/800x400/0118D8/FFFFFF?text=Dashboard+Screenshot)

### 👷 Candidate Portal

_Browse jobs and apply with AI assistance_

![Candidate Portal](https://via.placeholder.com/800x400/E9DFC3/1B56FD?text=Candidate+Portal+Screenshot)

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Layer          | Technologies                                                            |
| -------------- | ----------------------------------------------------------------------- |
| **Frontend**   | React 19 • React Router 7 • Tailwind CSS 3 • Lucide Icons • date-fns    |
| **Backend**    | Node.js • Express • REST API • JWT Authentication                       |
| **Database**   | Supabase • PostgreSQL • pgvector (embeddings) • Real-time subscriptions |
| **AI/ML**      | Claude 3 (Anthropic) • Vector embeddings • Semantic search              |
| **Automation** | n8n • Email/SMS workflows • Calendar integrations                       |
| **Video**      | Jitsi Meet SDK • WebRTC • P2P conferencing                              |
| **Dev Tools**  | npm • PostCSS • Axios • ESLint • Git                                    |

</div>

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([Sign up free](https://supabase.com))
- Anthropic API key ([Get here](https://console.anthropic.com))
- n8n installed globally or via npx

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/bssilva06/jale-hiring-assistant.git
cd jale-hiring-assistant
```

### 2️⃣ Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3️⃣ Environment Setup

**Frontend** (`frontend/.env.local`):

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_API_URL=http://localhost:5000
```

**Backend** (`backend/.env`):

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
CLAUDE_API_KEY=your_claude_api_key
N8N_WEBHOOK_URL=your_n8n_webhook_url
```

> 📝 See `.env.example` files for full configuration options

### 4️⃣ Run the Application

**Terminal 1 - Frontend:**

```bash
cd frontend
npm start
# Opens at http://localhost:3000
```

**Terminal 2 - Backend:**

```bash
cd backend
npm run dev
# Runs at http://localhost:5000
```

**Terminal 3 - n8n (Optional):**

```bash
npx n8n
# Opens at http://localhost:5678
```

### 5️⃣ Access the App

- 🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)
- 🔧 **Backend API**: [http://localhost:5000](http://localhost:5000)
- ⚙️ **n8n Dashboard**: [http://localhost:5678](http://localhost:5678)

---

## 🏗️ Architecture

<div align="center">

```mermaid
graph TB
    subgraph "Frontend - React"
        A[Landing Page] --> B[Employer Portal]
        A --> C[Candidate Portal]
        B --> D[Dashboard]
        B --> E[Job Posting]
        B --> F[Candidate List]
        B --> G[Interviews]
        C --> H[Job Browser]
        C --> I[Application Form]
        C --> J[AI Chatbot]
    end

    subgraph "Backend - Node.js/Express"
        K[REST API] --> L[Job Controller]
        K --> M[Candidate Controller]
        K --> N[Interview Controller]
        K --> O[Chat Controller]
        L --> P[Matching Service]
        O --> Q[Claude Service]
        N --> R[Scheduling Service]
    end

    subgraph "Data Layer"
        S[(Supabase PostgreSQL)]
        T[pgvector Embeddings]
        S --> T
    end

    subgraph "AI & Automation"
        U[Claude AI API]
        V[n8n Workflows]
        W[Email/SMS]
    end

    subgraph "Video"
        X[Jitsi Meet]
    end

    B --> K
    C --> K
    J --> O
    G --> X
    K --> S
    Q --> U
    P --> T
    R --> V
    V --> W

    style A fill:#1B56FD,stroke:#0118D8,color:#FFF
    style B fill:#0118D8,stroke:#1B56FD,color:#FFF
    style C fill:#0118D8,stroke:#1B56FD,color:#FFF
    style U fill:#8A63D2,stroke:#6B46C1,color:#FFF
    style S fill:#3ECF8E,stroke:#2DA771,color:#FFF
```

</div>

### 📂 Project Structure

```
jale-hiring-assistant/
├── 📁 frontend/              # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API & Supabase clients
│   │   └── utils/           # Helper functions
│   └── public/              # Static assets
├── 📁 backend/               # Node.js API server
│   └── src/
│       ├── controllers/     # Route handlers
│       ├── services/        # Business logic
│       ├── middleware/      # Auth & error handling
│       └── routes/          # API endpoints
├── 📁 n8n-workflows/         # Automation workflows
│   └── exports/             # Workflow JSON exports
└── 📁 docs/                  # Documentation
    ├── API.md               # API documentation
    ├── ARCHITECTURE.md      # System design
    ├── SETUP.md            # Detailed setup guide
    └── DEMO_SCRIPT.md      # Presentation guide
```

---

## 📚 Documentation

| Document                                | Description                             |
| --------------------------------------- | --------------------------------------- |
| [📖 Setup Guide](docs/SETUP.md)         | Detailed installation and configuration |
| [🔌 API Documentation](docs/API.md)     | Complete API reference                  |
| [🏛️ Architecture](docs/ARCHITECTURE.md) | System design and data flow             |
| [🎭 Demo Script](docs/DEMO_SCRIPT.md)   | Hackathon presentation guide            |

---

## 🎨 Design System

Built with Work4Workers' brand identity:

- **Primary Color**: `#1B56FD` (Bright Blue)
- **Secondary Color**: `#0118D8` (Deep Blue)
- **Accent Color**: `#E9DFC3` (Cream)
- **Light Background**: `#FFF8F8` (Off-White)
- **Font**: Inter (Google Fonts)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💻 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔀 Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by:

- **Your Name** - Frontend Development
- **Partner Name** - Backend Development

---

## 🙏 Acknowledgments

- [Work4Workers](https://work4workers.com) for the inspiration
- [Anthropic](https://www.anthropic.com) for Claude AI
- [Supabase](https://supabase.com) for the amazing backend platform
- [Jitsi](https://jitsi.org) for open-source video conferencing

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with 💙 for blue-collar workers**

[Report Bug](https://github.com/bssilva06/jale-hiring-assistant/issues) • [Request Feature](https://github.com/bssilva06/jale-hiring-assistant/issues)

</div>
