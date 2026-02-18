# Backend Integration Guide

This document explains how to connect a backend to this React frontend.

---

## 🛠️ Technology Stack Overview

### Frontend (Already Built)
- **React 19** - UI library for building the interface
- **TypeScript** - Adds type safety to JavaScript
- **Vite** - Build tool that bundles the app
- **Tailwind CSS** - Styling framework
- **React Router** - Handles navigation between pages
- **Recharts** - For charts like the radar chart

### What You Need to Add (Backend)
- **Node.js/Express** or **Python/FastAPI** - Server to handle requests
- **Database** (PostgreSQL, MongoDB) - Store data permanently
- **Authentication** (JWT, Auth0, Firebase) - Handle login/signup

---

## 📁 Key Files for Backend Integration

### 1. API Client (`src/api/client.ts`)

This is your central hub for talking to the backend. Here's how to use it:

```typescript
// Example: Fetching jobs from your backend
const response = await api.jobs.list();
// Response format: { data: Job[], success: true }
```

**Available Endpoints:**
```typescript
api.user.get()           // Get current user profile
api.user.update(data)    // Update user profile
api.jobs.list()         // Get all job listings
api.jobs.get(id)        // Get specific job
api.fellows.list()      // Get all fellows
api.fellows.connect(id) // Connect with a fellow
api.cv.get()            // Get user's CV
api.cv.save(data)       // Save CV
api.chat.send(message)  // Send message to AI coach
api.settings.get()     // Get user settings
api.settings.update()  // Update settings
```

### 2. Types (`src/types/index.ts`)

All data structures are defined here. When your backend sends data, it should match these types:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  // ... more fields
}
```

### 3. Context (`src/context/AppContext.tsx`)

This manages "global state" - data that needs to be available everywhere:

- Current logged-in user
- CV data
- Chat messages
- Settings

### 4. Hooks (`src/hooks/index.ts`)

Pre-built functions that make API calls easy:

```typescript
// Easy way to get/update user data
const { user, updateUser } = useUser();

// Easy way to manage CV
const { cv, addExperience, updateExperience } = useCV();

// Easy way to handle chat
const { messages, sendMessage } = useChat();
```

---

## 🔄 How Data Flows

### Current Flow (Mock Data)
```
User Action → Hook → Context/State → UI Updates
```

### With Backend
```
User Action → Hook → API Client → Your Backend → Database
                 ↑                              │
                 └────── Response ──────────────┘
```

---

## 🚀 Connecting Your Backend

### Step 1: Set Environment Variable

Create a `.env` file in the root:
```env
VITE_API_URL=http://localhost:3000/api
```

### Step 2: Enable API Calls

In `src/hooks/index.ts`, find the TODO comments and uncomment the API calls:

```typescript
// BEFORE (uses mock data)
const fetchJobs = async () => {
  // Mock data
  const mockJobs = [...];
  dispatch({ type: 'SET_JOBS', payload: mockJobs });
};

// AFTER (uses real backend)
const fetchJobs = async () => {
  try {
    const response = await api.jobs.list();
    dispatch({ type: 'SET_JOBS', payload: response.data });
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
  }
};
```

---

## 🔐 Security Measures

### 1. Environment Variables (ALREADY SET UP)
Never hardcode secrets! Use `.env` files:
- `.env` - Local development (NOT committed to git)
- `.env.example` - Template for other developers

### 2. Authentication Token

When implementing login, store the token securely:

```typescript
// GOOD: Store in memory during session
const [token, setToken] = useState('');

// For persistent login, use httpOnly cookies
// NOT: localStorage (vulnerable to XSS attacks)
```

### 3. API Security Headers

Your backend should include:
```typescript
// CORS - Only allow your frontend domain
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend
  credentials: true
}));

// Rate limiting - Prevent abuse
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
}));
```

### 4. Input Validation

Always validate on BOTH frontend AND backend:

```typescript
// Frontend (for user experience)
const validateEmail = (email: string) => {
  return email.includes('@');
};

// Backend (for security - NEVER trust frontend!)
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

### 5. Password Security

Never store plain passwords! Your backend should:
- Hash passwords with bcrypt
- Use JWT for session management
- Implement refresh tokens

---

## 🗄️ Database Schema Recommendation

Here's a starting point for your database:

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  career_path VARCHAR,
  goals TEXT,
  experience_level VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### CV Table
```sql
cv (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  personal_info JSONB,
  summary TEXT,
  experience JSONB,
  education JSONB,
  skills JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Messages Table
```sql
messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR, -- 'user' or 'ai'
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)
```

### Connections Table (Social)
```sql
connections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  fellow_id UUID REFERENCES users(id),
  status VARCHAR, -- 'pending', 'accepted'
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## 📝 Implementation Checklist

- [ ] Set up backend server (Node.js/Express recommended)
- [ ] Configure database (PostgreSQL or MongoDB)
- [ ] Implement user authentication (register/login)
- [ ] Create API endpoints matching the API client
- [ ] Update hooks to use real API calls
- [ ] Add authentication token handling
- [ ] Implement rate limiting on backend
- [ ] Add input validation
- [ ] Test all user flows

---

## 📚 Recommended Backend Stack

For beginners, we recommend:

1. **Backend Framework**: Node.js + Express
2. **Database**: PostgreSQL (with Prisma ORM) or MongoDB
3. **Authentication**: JWT or Auth0
4. **Deployment**: Vercel, Railway, or Render

---

## 🔧 Need Help?

- React Router: https://reactrouter.com
- Vite: https://vitejs.dev
- Express: https://expressjs.com
- Prisma: https://prisma.io
- JWT: https://jwt.io
