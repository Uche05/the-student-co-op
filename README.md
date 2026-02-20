<<<<<<< HEAD
# The Student Co-Op

An AI-powered career development platform that helps students transform from "employment-blind" to career-ready through awareness-driven personality assessment and targeted skill building.

---

## Table of Contents

1. [About](#about)
2. [Problem & Solution](#problem--solution)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [API Integrations](#api-integrations)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Deployment to Akamai](#deployment-to-akamai)
9. [Security](#security)
10. [Acknowledgments](#acknowledgments)

---

## About

**Student Co-Op** is a full-stack web application designed to help students identify and address the "invisible" soft-skill gaps that prevent them from succeeding in their chosen careers. Unlike traditional platforms that focus on grades and qualifications, Student Co-Op focuses on personal growth and awareness.

The platform uses psychometric testing, AI-powered coaching, and interactive tools to help students become socially and mentally prepared for their professional journeys.

---

## Problem & Solution

### The Problem
Many students possess the academic credentials for their dream careers but remain 'employment-blind' to the soft-skill gaps that will actually prevent them from succeeding. Current platforms focus on *grades*, not *growth*. Without a clear way to measure and visualize 'invisible' weaknesses, like communication anxiety for developers or social hesitation for law students, students enter the job market unprepared.

### The Solution
**Student Co-Op** is an awareness-driven ecosystem that turns personality data into a professional roadmap:

- **The Mirror Effect**: Uses psychometric testing to show students a 'Radar Map' of how their current traits align with their target industry
- **Gap Analysis**: Flags critical bottlenecks (e.g., "Communication" for shy students) and provides actionable micro-challenges
- **Career-Ready Awareness**: Shifts focus from "What I know" to "Who I am becoming"

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React** | Core UI library |
| **Vite** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components (Radix UI) |
| **Recharts** | Radar chart visualization |
| **React Router** | Client-side routing |
| **Lucide React** | Icons |
| **React Hook Form** | Form handling |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | Web framework |
| **TypeScript** | Type safety |
| **tsx** | TypeScript execution |
| **Axios** | HTTP client |
| **Cheerio** | HTML parsing (job scraping) |
| **@sanity/client** | CMS database |

### External Services
| Service | Purpose |
|---------|---------|
| **Sanity CMS** | Database for users, profiles, jobs |
| **You.com API** | AI-powered interview coaching |
| **Deepgram** | Sentiment analysis |
| **Foxit PDF** | CV PDF generation |
| **Jooble API** | Job search aggregation |
| **RapidAPI** | Additional job data |

---

## Features

### Core Features

1. **Dashboard** - Central hub with radar charts, progress tracking, and recommendations
2. **Awareness Test** - Psychometric assessment that reveals hidden weaknesses
3. **CV Builder** - Professional resume creation with PDF export
4. **Communication Coach** - AI-powered interview practice with real-time feedback
5. **Profile Management** - Public/private profile views with social links
6. **Job Board** - Aggregated job listings from multiple sources

### User Features

- **Authentication** - Sign up/sign in with email & password
- **Voice Input** - Speech-to-text for interview practice
- **STAR Method Feedback** - AI analysis of interview responses
- **Profile Visibility** - See how others view your profile
- **Progress Tracking** - Monitor growth over time

---

## API Integrations

### Backend API Endpoints


---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-co-op
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd student-backend
   npm install
   ```




---

## Deployment to Akamai (Linode)

### Prerequisites

- Akamai account with Cloud Computing (Linode)
- Git repository with your code
- Domain name (optional)

### Deployment Steps
   - Log in to Akamai Cloud Computing
   - Create a new Linode (Ubuntu 22.04 recommended)
   - Note the IP address

2. **Connect to your server**
   ```bash
   ssh root@<your-ip-address>
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Clone your repository**
   ```bash
   git clone <your-repo-url>
   cd student-co-op
   ```

5. **Install dependencies**
   ```bash
   npm install
   cd student-backend
   npm install
   ```

6. **Set up environment variables**
   ```bash
   cp student-backend/.env.example student-backend/.env
   nano student-backend/.env  # Edit with your API keys
   ```

7. **Build the frontend**
   ```bash
   npm run build
   ```

8. **Set up PM2 for process management**
   ```bash
   sudo npm install -g pm2
   pm2 start student-backend/server.ts --interpreter tsx
   pm2 startup
   pm2 save
   ```

9. **Configure Nginx as reverse proxy**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           root /root/student-co-op/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Enable and restart Nginx**
    ```bash
    sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

---



---

## Acknowledgments

### Development Team

- **Primary Developer** - [Your Name]

### AI Assistance

This project was significantly enhanced using **Kilo Code** - an AI-powered development assistant that helped transform the original Figma prototype into a fully functional application.

Kilo Code assisted with:
- Converting Figma designs to React components
- Implementing authentication system with Sanity CMS
- Building the AI-powered interview coach
- Adding speech-to-text functionality
- Creating the profile visibility features
- Debugging and optimizing code
- Writing documentation

### Technologies & Resources

- [React](https://react.dev/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Sanity](https://www.sanity.io/) - Headless CMS
- [You.com](https://you.com/) - AI API
- [Express](https://expressjs.com/) - Backend Framework

### License

MIT License - See LICENSE file for details

---

*Built with ❤️ for students, by students*
=======

## Why This Exists
Universities teach students to pass exams, but workplaces demand more than knowledge, they demand behavioural readiness. Many graduates struggle with communication, confidence, leadership, or collaboration because career platforms focus on credentials, not fit. These gaps aren’t about intelligence; they’re about alignment, often invisible until real-world experience exposes them, a problem known as employment-blindness.

## What Student Co-op Does Differently
Student Co-op is an awareness-driven platform that helps students understand how their personal traits align with their target careers. It reframes career preparation as a self-awareness challenge.
Instead of asking, “What career are you interested in?” it asks,“Are you developing the traits required to succeed in that career?” The system then turns personality and behavioural data into a clear development roadmap.

## How it Works
### - Psychometric Onboarding
Students complete an awareness-based assessment that measures behavioural traits relevant to professional success. These traits are mapped across key dimensions such as communication, leadership, analytical thinking, adaptability, and resilience.
### - Industry Benchmark Mapping
Each career path has associated behavioural benchmarks. The student’s profile is compared against these benchmarks and visualised through a Radar Map. This visual comparison highlights strengths, growth gaps, and potential risk areas, creating a “mirror effect” where students see themselves in context.
### - Targeted Gap Identification
When misalignment is detected, the system flags high-impact weaknesses, identifies behavioural bottlenecks, and suggests small, actionable development challenges. The goal is not to discourage ambition but to make growth measurable and focused
>>>>>>> a3ee66227cc8c26e4116ae514d984df4ec63771f
