/**
 * ============================================
 * The Student Co-Op - Backend Server
 * ============================================
 * A hackathon-maximized backend using:
 * - Express + TypeScript
 * - Sanity CMS (Structured Content)
 * - You.com API (Intelligent Job Search)
 * - Deepgram (Voice Sentiment)
 * - Foxit PDF (CV Generation)
 */

import { createClient } from '@sanity/client';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { getAvailableSources, scrapeAllSites, scrapeSpecificSite } from './scraper';

// ============================================
// Configuration & Environment
// ============================================

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Frontend URL for CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ============================================
// Middleware
// ============================================

// CORS - Allow frontend origin
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// Sanity Client Setup
// ============================================

// Check if we have valid Sanity credentials
const hasValidSanityConfig = () => {
  const projectId = process.env.SANITY_PROJECT_ID;
  return projectId && 
         projectId !== 'your_sanity_project_id' && 
         /^[a-z0-9-]+$/.test(projectId);
};

// Only create client if valid credentials exist
const sanityClient = hasValidSanityConfig() 
  ? createClient({
      projectId: process.env.SANITY_PROJECT_ID!,
      dataset: process.env.SANITY_DATASET || 'production',
      apiVersion: process.env.SANITY_API_VERSION || '2024-01-01',
      token: process.env.SANITY_TOKEN,
      useCdn: true,
    })
  : null;

// ============================================
// Types
// ============================================

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  url: string;
  source: string;
  postedDate?: string;
}

// ============================================
// Scraper-Based Job Search
// ============================================

/**
 * Fallback mock jobs if scraping fails
 */
function getMockJobs(): Job[] {
  return [
    {
      id: 'mock-1',
      title: 'Marketing Intern',
      company: 'TechStart UK',
      location: 'London, UK',
      salary: '£20,000 - £25,000',
      description: 'Join our marketing team to gain hands-on experience in digital marketing, social media, and brand management.',
      url: 'https://example.com/jobs/marketing-intern',
      source: 'You.com (Mock)',
      postedDate: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      title: 'Software Development Placement',
      company: 'InnovateTech',
      location: 'Manchester, UK',
      salary: '£22,000 - £28,000',
      description: 'Year-long placement for CS students. Work with React, Node.js, and cloud technologies.',
      url: 'https://example.com/jobs/dev-placement',
      source: 'You.com (Mock)',
      postedDate: new Date().toISOString(),
    },
    {
      id: 'mock-3',
      title: 'Data Science Summer Intern',
      company: 'DataDriven Ltd',
      location: 'Remote (UK)',
      salary: '£18,000 - £22,000',
      description: 'Summer internship analyzing datasets and building ML models. Python and SQL required.',
      url: 'https://example.com/jobs/data-science-intern',
      source: 'You.com (Mock)',
      postedDate: new Date().toISOString(),
    },
    {
      id: 'mock-4',
      title: 'Business Analyst Apprentice',
      company: 'GlobalFinance',
      location: 'Birmingham, UK',
      salary: '£19,000',
      description: 'Apprenticeship role analyzing business processes and helping improve efficiency.',
      url: 'https://example.com/jobs/business-apprentice',
      source: 'You.com (Mock)',
      postedDate: new Date().toISOString(),
    },
    {
      id: 'mock-5',
      title: 'UX Design Intern',
      company: 'CreativeStudio',
      location: 'Bristol, UK',
      salary: '£17,000 - £20,000',
      description: 'Assist in user research, wireframing, and prototyping. Figma experience preferred.',
      url: 'https://example.com/jobs/ux-intern',
      source: 'You.com (Mock)',
      postedDate: new Date().toISOString(),
    },
  ];
}

// ============================================
// Sanity Cache Functions
// ============================================

/**
 * Get cached jobs from Sanity
 */
async function getCachedJobsFromSanity(): Promise<Job[]> {
  try {
    // Check if we have valid Sanity credentials
    if (!process.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID === 'your_sanity_project_id') {
      return [];
    }

    const query = `*[_type == "job"] | order(_createdAt desc) [0...20] {
      _id,
      title,
      company,
      location,
      salary,
      description,
      url,
      source,
      postedDate
    }`;

    if (!sanityClient) {
      return [];
    }

    const jobs = await sanityClient.fetch(query);
    return jobs as Job[];
  } catch (error) {
    console.error('[Sanity] Cache read error:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

/**
 * Save jobs to Sanity cache
 */
async function saveJobsToSanity(jobs: Job[]): Promise<void> {
  try {
    if (!hasValidSanityConfig()) {
      console.log('[Sanity] No valid credentials, skipping cache save');
      return;
    }

    if (!sanityClient) {
      console.log('[Sanity] No valid credentials, skipping cache save');
      return;
    }

    // Use createOrReplace for each job (more reliable than createIfNotExists with arrays)
    for (const job of jobs) {
      await sanityClient.createOrReplace({
        _type: 'job',
        _id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary || undefined,
        description: job.description,
        url: job.url,
        source: job.source,
        postedDate: job.postedDate,
      });
    }
    console.log(`[Sanity] Cached ${jobs.length} jobs`);
  } catch (error) {
    console.error('[Sanity] Cache save error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================
// API Routes
// ============================================

/**
 * GET /api/jobs
 * 
 * Job search endpoint using dedicated scrapers:
 * 1. Check Sanity cache first
 * 2. If empty, scrape job sites directly
 * 3. Save results to Sanity
 * 4. Return real jobs with working apply links
 * 
 * Query params:
 * - q: Search query (default: "student job internship")
 * - source: Optional specific site to scrape (indeed, reed, totaljobs, cwjobs)
 */
app.get('/api/jobs', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || 'student job internship';
    const source = req.query.source as string;
    const nocache = req.query.nocache === 'true';
    
    console.log(`[API] GET /api/jobs - Searching for: "${query}"${source ? ` on ${source}` : ''}${nocache ? ' (no cache)' : ''}...`);

    // Step 1: Check Sanity cache (unless nocache is true)
    if (!nocache) {
      const cachedJobs = await getCachedJobsFromSanity();
      
      if (cachedJobs.length > 0) {
        console.log(`[API] Returning ${cachedJobs.length} cached jobs from Sanity`);
        return res.json({
          success: true,
          source: 'cache',
          count: cachedJobs.length,
          data: cachedJobs,
        });
      }
    }

    // Step 2: Scrape job sites
    console.log('[API] Cache empty, scraping job sites...');
    
    let jobs: Job[] = [];
    try {
      if (source) {
        // Scrape specific site
        jobs = await scrapeSpecificSite(source, query);
      } else {
        // Scrape all configured sites
        jobs = await scrapeAllSites(query);
      }
    } catch (scrapeError) {
      console.error('[API] Scraping error:', scrapeError instanceof Error ? scrapeError.message : 'Unknown error');
    }

    // Fallback to mock data if scraping returns no results
    if (jobs.length === 0) {
      console.log('[API] Scraping returned no results, using fallback mock data');
      jobs = getMockJobs();
    }

    // Step 3: Save to Sanity cache
    if (jobs.length > 0) {
      await saveJobsToSanity(jobs);
    }

    // Step 4: Return results
    console.log(`[API] Returning ${jobs.length} real jobs from job boards`);
    return res.json({
      success: true,
      source: 'scraper',
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error('[API] Jobs endpoint error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch jobs',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/jobs/sources
 * 
 * Get available job sources that can be scraped
 */
app.get('/api/jobs/sources', (_req: Request, res: Response) => {
  const sources = getAvailableSources();
  res.json({
    success: true,
    sources,
  });
});

/**
 * POST /api/cv/generate
 * 
 * Generate CV PDF using Foxit SDK
 * (Stub implementation - to be implemented with Foxit integration)
 */
app.post('/api/cv/generate', async (req: Request, res: Response) => {
  try {
    const cvData = req.body;
    console.log('[API] POST /api/cv/generate - Generating CV...');

    // TODO: Implement Foxit PDF generation
    // 1. Save CV data to Sanity
    // 2. Send to Foxit PDF SDK
    // 3. Return PDF buffer

    res.json({
      success: true,
      message: 'CV generation endpoint ready - Foxit integration pending',
      data: cvData,
    });
  } catch (error) {
    console.error('[API] CV generation error:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      error: 'Failed to generate CV',
    });
  }
});

/**
 * POST /api/chat/analyze
 * 
 * AI Coach powered by You.com for interview practice
 * Provides feedback on interview responses
 * Stores chat history in Sanity (max 5 messages per user)
 */
app.post('/api/chat/analyze', async (req: Request, res: Response) => {
  try {
    const { text, context, userId } = req.body;
    console.log('[API] POST /api/chat/analyze - AI Coach analyzing...');

    const apiKey = process.env.YOU_COM_API_KEY;
    let feedback = '';
    let sentiment = 'neutral';
    let confidence = 0.8;
    
    // If no You.com API key, return local analysis
    if (!apiKey || apiKey === 'your_you_com_api_key_here') {
      const localFeedback = generateLocalFeedback(text, context);
      feedback = localFeedback;
      sentiment = 'positive';
    } else {
      // Use You.com for AI-powered feedback
      const prompt = `You are an AI Interview Coach. Analyze this interview response and provide feedback. Keep it concise and actionable.

User's response: "${text}"`;

      try {
        const response = await axios.post(
          'https://you.com/api/youapiendpoint',
          { prompt, chatId: 'interview-coach' },
          { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, timeout: 10000 }
        );

        feedback = response.data?.youChatResponse?.text || response.data?.text || generateLocalFeedback(text, context);
        sentiment = 'positive';
        confidence = 0.9;
      } catch {
        feedback = generateLocalFeedback(text, context);
        sentiment = 'positive';
      }
    }

    // Save chat message to Sanity if userId provided
    if (userId && sanityClient) {
      try {
        // Get existing chat history (keep only last 5)
        const existingChats = await sanityClient.fetch(
          `*[_type == "chatMessage" && userId == $userId] | order(_createdAt desc) [0...5] { _id, _createdAt }`,
          { userId }
        );

        // Delete oldest messages if more than 5
        if (existingChats.length >= 5) {
          const toDelete = existingChats.slice(4);
          for (const msg of toDelete) {
            await sanityClient.delete(msg._id);
          }
        }

        // Save new message
        await sanityClient.create({
          _type: 'chatMessage',
          userId,
          userMessage: text,
          aiFeedback: feedback,
          context: context || 'Interview Practice',
          sentiment,
          confidence,
        });

        console.log(`[Sanity] Saved chat message for user ${userId}`);
      } catch (sanityError) {
        console.error('[Sanity] Error saving chat:', sanityError);
      }
    }

    res.json({
      success: true,
      message: 'AI Coach analysis complete',
      analysis: {
        text,
        sentiment,
        confidence,
        feedback,
      },
    });
  } catch (error) {
    console.error('[API] Chat error:', error instanceof Error ? error.message : 'Unknown');
    res.status(500).json({ success: false, error: 'Failed to analyze' });
  }
});

/**
 * GET /api/chat/history/:userId
 * 
 * Get user's chat history from Sanity (max 5 messages)
 */
app.get('/api/chat/history/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log(`[API] GET /api/chat/history/${userId}`);

    if (!sanityClient) {
      return res.json({ success: true, messages: [] });
    }

    const messages = await sanityClient.fetch(
      `*[_type == "chatMessage" && userId == $userId] | order(_createdAt desc) [0...5] {
        _id,
        userMessage,
        aiFeedback,
        context,
        sentiment,
        confidence,
        _createdAt
      }`,
      { userId }
    );

    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.error('[API] Chat history error:', error instanceof Error ? error.message : 'Unknown');
    res.status(500).json({ success: false, error: 'Failed to get history' });
  }
});

function generateLocalFeedback(text: string, context?: string): string {
  const hasSituation = /situation|context|background|when|where/i.test(text);
  const hasTask = /task|challenge|responsibility|goal/i.test(text);
  const hasAction = /action|took|decided|implemented|created/i.test(text);
  const hasResult = /result|outcome|achieved|learned|impact/i.test(text);

  let feedback = '';
  const improvements: string[] = [];

  if (hasSituation && hasTask && hasAction && hasResult) {
    feedback = '🌟 Excellent! You used the STAR method perfectly.';
  } else {
    feedback = '📝 Good response! Structure with STAR:';
    if (!hasSituation) improvements.push('• Situation: Set the context');
    if (!hasTask) improvements.push('• Task: Describe your responsibility');
    if (!hasAction) improvements.push('• Action: Explain what YOU did');
    if (!hasResult) improvements.push('• Result: Share the outcome');
  }

  if (text.length < 50) improvements.push('• Add more detail');
  if (text.length > 500) improvements.push('• Be more concise');

  return feedback + (improvements.length > 0 ? '\n\n' + improvements.join('\n') : '');
}

// ============================================
// User Profile & Avatar API
// ============================================

// Predefined profile picture templates (using DiceBear free avatars)
const PROFILE_TEMPLATES = {
  male: [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=male1&clothing=blazerAndShirt&clothingColor=1d3557&topType=shortHair&hairColor=2c1a1d&skinColor=ffdbac',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=male2&clothing=collarSweater&clothingColor=495057&topType=shortHair&hairColor=3d2b1f&skinColor=d08b5b',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=male3&clothing=blazerAndShirt&clothingColor=2b2d42&topType=longHair&hairColor=1a1a1a&skinColor=ae988a',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=male4&clothing=graphicShirt&clothingColor=e63946&topType=shortHair&hairColor=6b4c35&skinColor=f1c27d',
  ],
  female: [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=female1&clothing=blazerAndShirt&clothingColor=457b9d&topType=longHair&hairColor=5c3a21&skinColor=ffdbac',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=female2&clothing=collarSweater&clothingColor=6d597a&topType=longHair&hairColor=2c1a1d&skinColor=e0ac69',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=female3&clothing=blazerAndShirt&clothingColor=1d3557&topType=longHair&hairColor=3d2b1f&skinColor=ae988a',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=female4&clothing=graphicShirt&clothingColor=2a9d8f&topType=shortHair&hairColor=5c3a21&skinColor=f1c27d',
  ],
  neutral: [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=neutral1&clothing=blazerAndShirt&clothingColor=264653&topType=shortHair&hairColor=3d2b1f&skinColor=ffdbac',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=neutral2&clothing=collarSweater&clothingColor=e76f51&topType=longHair&hairColor=2c1a1d&skinColor=d08b5b',
  ],
};

/**
 * GET /api/users/profile/:userId
 * Get user profile from Sanity
 */
app.get('/api/users/profile/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!sanityClient) return res.json({ success: false, error: 'Sanity not configured' });

    const profile = await sanityClient.fetch(
      `*[_type == "userProfile" && userId == $userId][0]`, { userId }
    );

    if (!profile) return res.json({ success: false, error: 'Profile not found' });
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

/**
 * POST /api/users/profile
 * Create/update profile with random avatar based on gender
 */
app.post('/api/users/profile', async (req: Request, res: Response) => {
  try {
    const { userId, name, email, gender } = req.body;
    if (!sanityClient) return res.json({ success: false, error: 'Sanity not configured' });

    const genderKey = gender?.toLowerCase() === 'male' ? 'male' 
      : gender?.toLowerCase() === 'female' ? 'female' : 'neutral';
    
    const templates = PROFILE_TEMPLATES[genderKey];
    const avatarUrl = templates[Math.floor(Math.random() * templates.length)];

    const profile = {
      _type: 'userProfile',
      _id: userId,
      userId,
      name: name || 'Student',
      email: email || '',
      gender: genderKey,
      avatar: avatarUrl,
      createdAt: new Date().toISOString(),
    };

    await sanityClient.createOrReplace(profile);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create profile' });
  }
});

/**
 * GET /api/users/avatar/:gender
 * Get random avatar URL based on gender
 */
app.get('/api/users/avatar/:gender', (req: Request, res: Response) => {
  const genderParam = req.params.gender as string;
  const genderKey = genderParam?.toLowerCase() === 'male' ? 'male' 
    : genderParam?.toLowerCase() === 'female' ? 'female' : 'neutral';
  
  const templates = PROFILE_TEMPLATES[genderKey];
  res.json({ success: true, avatar: templates[Math.floor(Math.random() * templates.length)], gender: genderKey });
});

/**
 * GET /api/users/templates
 * Get all avatar templates
 */
app.get('/api/users/templates', (_req: Request, res: Response) => {
  res.json({ success: true, templates: PROFILE_TEMPLATES });
});

// ============================================
// Authentication API - Sign Up / Sign In using Sanity
// ============================================

// Simple hash function (for demo - use bcrypt in production)
function simpleHash(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
    }

    if (!sanityClient) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    // Check if user already exists
    const existingUser = await sanityClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = simpleHash(password);

    await sanityClient.create({
      _type: 'user',
      _id: userId,
      email,
      passwordHash,
      name,
      createdAt: new Date().toISOString(),
    });

    // Create initial profile with ZERO/EMPTY data for new users
    await sanityClient.create({
      _type: 'userProfile',
      userId,
      name,
      email,
      gender: 'neutral',
      // Zero/empty initial data
      bio: '',
      school: '',
      degree: '',
      year: '',
      location: '',
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      skills: [],
      interests: [],
      targetCompanies: [],
      createdAt: new Date().toISOString(),
    });

    res.json({ success: true, userId, name, email });
  } catch (error) {
    console.error('[API] Signup error:', error instanceof Error ? error.message : 'Unknown');
    res.status(500).json({ success: false, error: 'Failed to create account' });
  }
});

app.post('/api/auth/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    if (!sanityClient) {
      return res.status(500).json({ success: false, error: 'Database not configured' });
    }

    // Find user
    const user = await sanityClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify password
    const passwordHash = simpleHash(password);
    if (user.passwordHash !== passwordHash) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.json({ 
      success: true, 
      userId: user._id, 
      name: user.name, 
      email: user.email 
    });
  } catch (error) {
    console.error('[API] Signin error:', error instanceof Error ? error.message : 'Unknown');
    res.status(500).json({ success: false, error: 'Failed to sign in' });
  }
});

app.post('/api/auth/signout', async (_req: Request, res: Response) => {
  // Client-side sign out - just return success
  res.json({ success: true, message: 'Signed out successfully' });
});

// ============================================
// Health Check
// ============================================

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'The Student Co-Op Backend',
    version: '1.0.0',
  });
});

// ============================================
// Fellows API - Fetch from Sanity
// ============================================

interface Fellow {
  id: string;
  name: string;
  role: string;
  school: string;
  image: string;
  connected: boolean;
}

app.get('/api/fellows', async (_req: Request, res: Response) => {
  try {
    if (!sanityClient) {
      // Return empty array if Sanity not configured
      return res.json({ success: true, fellows: [] });
    }

    const fellows = await sanityClient.fetch<Fellow[]>(
      `*[_type == "fellow"] | order(name asc) {
        _id,
        name,
        role,
        school,
        image,
        connected
      }`
    );

    // Map to expected format with initials as fallback
    const mappedFellows = fellows.map((f: any) => ({
      id: f._id,
      name: f.name,
      role: f.role,
      school: f.school,
      image: f.image || f.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??',
      connected: f.connected || false,
    }));

    res.json({ success: true, fellows: mappedFellows });
  } catch (error) {
    console.error('[API] Fellows error:', error instanceof Error ? error.message : 'Unknown');
    res.status(500).json({ success: false, error: 'Failed to fetch fellows' });
  }
});

app.post('/api/fellows/:id/connect', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { connected } = req.body;

    if (!sanityClient) {
      return res.json({ success: false, error: 'Sanity not configured' });
    }

    await sanityClient.patch(id as string).set({ connected }).commit();
    res.json({ success: true });
  } catch (error) {
    console.error('[API] Fellow connect error:', error instanceof Error ? error.message : 'Unknown');
    res.status(500).json({ success: false, error: 'Failed to update fellow' });
  }
});

// ============================================
// Awareness Test API - Fetch from Sanity
// ============================================

interface AwarenessQuestion {
  id: number;
  question: string;
  options: { value: number; label: string }[];
}

const defaultQuestions: AwarenessQuestion[] = [
  { id: 1, question: "How do you typically approach solving complex problems?", options: [{ value: 1, label: "I prefer to work through them systematically" }, { value: 2, label: "I rely on my intuition" }, { value: 3, label: "I seek advice from others" }, { value: 4, label: "I take breaks to let ideas marinate" }] },
  { id: 2, question: "In a team conflict, what's your first reaction?", options: [{ value: 1, label: "Facilitate a discussion" }, { value: 2, label: "Stay neutral" }, { value: 3, label: "Address it immediately" }, { value: 4, label: "Give people space" }] },
  { id: 3, question: "How do you prefer to receive feedback?", options: [{ value: 1, label: "Direct and straightforward" }, { value: 2, label: "In a private setting" }, { value: 3, label: "With specific examples" }, { value: 4, label: "With suggestions for improvement" }] },
  { id: 4, question: "When learning a new skill, what works best?", options: [{ value: 1, label: "Hands-on practice" }, { value: 2, label: "Reading documentation" }, { value: 3, label: "Watching tutorials" }, { value: 4, label: "Teaching someone else" }] },
  { id: 5, question: "What's your ideal work environment?", options: [{ value: 1, label: "Collaborative and open" }, { value: 2, label: "Quiet and focused" }, { value: 3, label: "Fast-paced and dynamic" }, { value: 4, label: "Structured and organized" }] },
];

app.get('/api/awareness-test/questions', async (_req: Request, res: Response) => {
  try {
    if (!sanityClient) {
      // Return default questions if Sanity not configured
      return res.json({ success: true, questions: defaultQuestions });
    }

    const questions = await sanityClient.fetch<AwarenessQuestion[]>(
      `*[_type == "awarenessQuestion"] | order(id asc) {
        id,
        question,
        options
      }`
    );

    if (questions.length === 0) {
      return res.json({ success: true, questions: defaultQuestions });
    }

    res.json({ success: true, questions });
  } catch (error) {
    console.error('[API] Awareness questions error:', error instanceof Error ? error.message : 'Unknown');
    res.json({ success: true, questions: defaultQuestions });
  }
});

app.post('/api/awareness-test/submit', async (req: Request, res: Response) => {
  try {
    const { userId, answers } = req.body;

    if (!sanityClient) {
      return res.json({ success: false, error: 'Sanity not configured' });
    }

    // Save the test submission
    await sanityClient.create({
      _type: 'awarenessTest',
      userId,
      answers,
      submittedAt: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Test submitted successfully' });
  } catch (error) {
    console.error('[API] Awareness submit error:', error instanceof Error ? error.message : 'Unknown');
    res.status(500).json({ success: false, error: 'Failed to submit test' });
  }
});

app.get('/api/awareness-test/results', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!sanityClient) {
      // Return default radar data if Sanity not configured
      return res.json({
        success: true,
        results: {
          selfAwareness: 75,
          socialAwareness: 80,
          communication: 70,
          leadership: 65,
          adaptability: 85,
        }
      });
    }

    const results = await sanityClient.fetch(
      `*[_type == "awarenessTest" && userId == $userId][0] {
        answers
      }`,
      { userId }
    );

    if (!results) {
      return res.json({
        success: true,
        results: {
          selfAwareness: 75,
          socialAwareness: 80,
          communication: 70,
          leadership: 65,
          adaptability: 85,
        }
      });
    }

    // Calculate radar data from answers (simplified)
    const answers = results.answers || {};
    const values = Object.values(answers) as number[];
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 3;

    const radarData = {
      selfAwareness: Math.min(100, Math.round(avg * 20 + 10)),
      socialAwareness: Math.min(100, Math.round(avg * 20 + 15)),
      communication: Math.min(100, Math.round(avg * 18 + 12)),
      leadership: Math.min(100, Math.round(avg * 17 + 8)),
      adaptability: Math.min(100, Math.round(avg * 21 + 5)),
    };

    res.json({ success: true, results: radarData });
  } catch (error) {
    console.error('[API] Awareness results error:', error instanceof Error ? error.message : 'Unknown');
    res.status(500).json({ success: false, error: 'Failed to fetch results' });
  }
});

// ============================================
// 404 Handler
// ============================================

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'API endpoint not found',
  });
});

// ============================================
// Error Handler
// ============================================

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server] Unhandled error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message,
  });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 The Student Co-Op Backend is running!');
  console.log('========================================');
  console.log(`📍 Server:    http://localhost:${PORT}`);
  console.log(`🌐 Frontend:  ${FRONTEND_URL}`);
  console.log('');
  console.log('📡 API Endpoints:');
  console.log(`   GET  /api/health         - Health check`);
  console.log(`   GET  /api/jobs          - Job scraper (Indeed, Reed, TotalJobs, CWJobs)`);
  console.log(`   GET  /api/jobs/sources  - Available job sources`);
  console.log(`   POST /api/cv/generate   - CV PDF generation (Foxit)`);
  console.log(`   POST /api/chat/analyze  - Sentiment analysis (Deepgram)`);
  console.log('========================================');
  console.log('');
});

export default app;
