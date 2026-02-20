# The Student Co-Op

---

## Table of Contents

1. [About](#about)
2. [Problem & Solution](#problem--solution)
3. [Tech Stack](#tech-stack)
4. [Tools Evaluation](#tools-evaluation)
5. [Features](#features)
6. [API Integrations](#api-integrations)
7. [Project Structure](#project-structure)
8. [Getting Started](#getting-started)
9. [Deployment to Akamai](#deployment-to-akamai)
10. [Security](#security)
11. [Acknowledgments](#acknowledgments)

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
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variables |

### External Services
| Service | Purpose |
|---------|---------|
| **Sanity CMS** | Database for users, profiles, jobs |

---

## Tools Evaluation

### Planned vs Actual Tools Comparison

#### Frontend Tools
| Planned Tool | Actually Used | Status |
|--------------|---------------|--------|
| React | React | ✅ Used |
| Vite | Vite | ✅ Used |
| TypeScript | TypeScript | ✅ Used |
| Tailwind CSS | Tailwind CSS | ✅ Used |
| shadcn/ui (Radix UI) | shadcn/ui | ✅ Used |
| Recharts | Recharts | ✅ Used |
| React Router | React Router | ✅ Used |
| Lucide React | Lucide React | ✅ Used |
| React Hook Form | React Hook Form | ✅ Used |
| - | React DnD | ✅ Added (drag-and-drop for CV builder) |
| - | next-themes | ✅ Added (dark mode support) |
| - | sonner | ✅ Added (toast notifications) |
| - | vaul | ✅ Added (drawer components) |

#### Backend Tools
| Planned Tool | Actually Used | Status |
|--------------|---------------|--------|
| Node.js | Node.js | ✅ Used |
| Express | Express | ✅ Used |
| TypeScript | TypeScript | ✅ Used |
| tsx | tsx | ✅ Used |
| Axios | Axios | ✅ Used |
| Cheerio | Cheerio | ✅ Used |
| @sanity/client | @sanity/client | ✅ Used |
| - | cors | ✅ Added |
| - | dotenv | ✅ Added |

#### External Services (API Integrations)
| Planned Service | Actually Used | Status |
|-----------------|---------------|--------|
| Sanity CMS | Sanity CMS | ✅ Used |
| You.com API | - | ❌ Not Used |
| Deepgram | - | ❌ Not Used |
| Foxit PDF | - | ❌ Not Used |
| Jooble API | - | ❌ Not Used |
| RapidAPI | - | ❌ Not Used |

---

### Evaluation & Justification

#### What Worked Well

1. **React + Vite + TypeScript**: This combination proved to be highly productive. Vite's fast HMR (Hot Module Replacement) significantly reduced development time, and TypeScript's type safety caught many potential bugs early in development.

2. **Tailwind CSS + shadcn/ui**: Using Tailwind with shadcn/ui components was an excellent choice. It provided pre-built, accessible components while allowing full customization through Tailwind's utility classes. This approach balanced development speed with design flexibility.

3. **Recharts**: The radar chart visualization was crucial for the "Mirror Effect" feature. Recharts offered a good balance of customization and ease of use for displaying psychometric data.

4. **Sanity CMS**: Using Sanity as a headless CMS was ideal for this project. It provided a flexible schema for user profiles, psychometric data, and job listings without requiring a complex database setup.

5. **Express + Cheerio**: This combination was perfect for the web scraping requirements (job aggregation). Cheerio's lightweight DOM manipulation made it easy to parse job listings from various sources.


#### Time Constraints Impact

The primary factor influencing our tool choices was participant time constraints. Here's how time constraints shaped our decisions:

1. **Prioritized Core Features**: Instead of spreading effort across multiple external APIs, we focused on building a solid foundation with the psychometric testing and radar chart visualization - the core differentiators of our platform.

2. **Avoided Complex Integrations**: Services like You.com and Deepgram would have required significant setup time for API keys, testing, and error handling. We opted to build the UI/UX framework that could integrate these services later.

3. **Leveraged Existing Components**: Using shadcn/ui saved approximately 40-60% of UI development time compared to building components from scratch. This allowed us to focus on the unique features.

4. **Simplified PDF Generation**: Client-side PDF generation was much faster to implement than setting up a server-side Foxit integration, while still delivering the core functionality users needed.

5. **Custom Scraper Over APIs**: While Cheerio-based scraping requires maintenance if target sites change their HTML, it was faster to implement and didn't require external API subscriptions for a demo.

#### Lessons Learned & Recommendations

1. **For Future Development**: The architecture is now ready for AI integration. Adding You.com API for interview coaching would be the highest-impact enhancement.

2. **If Budget Permits**: Deepgram would significantly enhance the interview practice experience with real-time transcription and sentiment analysis.

3. **Scalability Consideration**: For production, we would migrate from Cheerio scraping to official job APIs (Jooble/RapidAPI) to ensure reliability and compliance with terms of service.

4. **PDF Generation**: Consider migrating to a server-side solution like Puppeteer or Playwright for more controlled PDF generation with consistent formatting.

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
- [Express](https://expressjs.com/) - Backend Framework

### License

MIT License - See LICENSE file for details

---

*Built with ❤️ for students, by students*
*Built with ❤️ for students, by students*
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

