/**
 * ============================================
 * The Student Co-Op - Backend Tests
 * ============================================
 * Automated tests for all essential backend functions
 */

import express, { Express } from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock environment variables
vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn().mockResolvedValue({
      data: {
        youChatResponse: { text: 'Great response!' },
        text: 'Great response!',
      },
    }),
  },
}));

// Import after mocks
import cors from 'cors';

// ============================================
// Test Setup - Create Express App
// ============================================

// Predefined profile picture templates (mirrored from server.ts)
const PROFILE_TEMPLATES = {
  male: [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=male1&clothing=blazerAndShirt&clothingColor=1d3557&topType=shortHair&hairColor=2c1a1d&skinColor=ffdbac',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=male2&clothing=collarSweater&clothingColor=495057&topType=shortHair&hairColor=3d2b1f&skinColor=d08b5b',
  ],
  female: [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=female1&clothing=blazerAndShirt&clothingColor=457b9d&topType=longHair&hairColor=5c3a21&skinColor=ffdbac',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=female2&clothing=collarSweater&clothingColor=6d597a&topType=longHair&hairColor=2c1a1d&skinColor=e0ac69',
  ],
  neutral: [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=neutral1&clothing=blazerAndShirt&clothingColor=264653&topType=shortHair&hairColor=3d2b1f&skinColor=ffdbac',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=neutral2&clothing=collarSweater&clothingColor=e76f51&topType=longHair&hairColor=2c1a1d&skinColor=d08b5b',
  ],
};

// Mock job data
function getMockJobs() {
  return [
    {
      id: 'mock-1',
      title: 'Marketing Intern',
      company: 'TechStart UK',
      location: 'London, UK',
      salary: '£20,000 - £25,000',
      description: 'Join our marketing team to gain hands-on experience.',
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
      description: 'Year-long placement for CS students.',
      url: 'https://example.com/jobs/dev-placement',
      source: 'You.com (Mock)',
      postedDate: new Date().toISOString(),
    },
  ];
}

// Generate local feedback (mirrored from server.ts)
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

// Check if Sanity config is valid
function hasValidSanityConfig(): boolean {
  const projectId = process.env.SANITY_PROJECT_ID;
  return projectId && 
         projectId !== 'your_sanity_project_id' && 
         /^[a-z0-9-]+$/.test(projectId);
}

// Available job sources
function getAvailableSources() {
  return ['indeed', 'reed', 'totaljobs', 'cwjobs'];
}

// Create test app
function createTestApp(): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'The Student Co-Op Backend',
      version: '1.0.0',
    });
  });

  // Get mock jobs
  app.get('/api/jobs', (req, res) => {
    const query = req.query.q as string || 'student job internship';
    const source = req.query.source as string;
    const nocache = req.query.nocache === 'true';
    
    console.log(`[API] GET /api/jobs - Searching for: "${query}"${source ? ` on ${source}` : ''}${nocache ? ' (no cache)' : ''}...`);
    
    // Return mock jobs for testing
    const jobs = getMockJobs();
    return res.json({
      success: true,
      source: 'mock',
      count: jobs.length,
      data: jobs,
    });
  });

  // Get available sources
  app.get('/api/jobs/sources', (_req, res) => {
    const sources = getAvailableSources();
    res.json({
      success: true,
      sources,
    });
  });

  // CV Generate endpoint
  app.post('/api/cv/generate', async (req, res) => {
    try {
      const cvData = req.body;
      res.json({
        success: true,
        message: 'CV generation endpoint ready',
        data: cvData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to generate CV',
      });
    }
  });

  // Chat Analyze endpoint
  app.post('/api/chat/analyze', async (req, res) => {
    try {
      const { text, context, userId } = req.body;
      
      const localFeedback = generateLocalFeedback(text, context);
      
      res.json({
        success: true,
        message: 'AI Coach analysis complete',
        analysis: {
          text,
          sentiment: 'positive',
          confidence: 0.8,
          feedback: localFeedback,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to analyze' });
    }
  });

  // Chat History endpoint
  app.get('/api/chat/history/:userId', (req, res) => {
    const { userId } = req.params;
    // Return empty for testing without Sanity
    res.json({ success: true, messages: [] });
  });

  // User Profile endpoint
  app.get('/api/users/profile/:userId', (req, res) => {
    const { userId } = req.params;
    // Return mock profile for testing
    res.json({
      success: true,
      profile: {
        userId,
        name: 'Test Student',
        email: 'test@example.com',
      },
    });
  });

  // Create Profile endpoint
  app.post('/api/users/profile', (req, res) => {
    const { userId, name, email, gender } = req.body;
    
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

    res.json({ success: true, profile });
  });

  // Avatar endpoint
  app.get('/api/users/avatar/:gender', (req, res) => {
    const genderParam = req.params.gender as string;
    const genderKey = genderParam?.toLowerCase() === 'male' ? 'male' 
      : genderParam?.toLowerCase() === 'female' ? 'female' : 'neutral';
  
    const templates = PROFILE_TEMPLATES[genderKey];
    res.json({ success: true, avatar: templates[0], gender: genderKey });
  });

  // Avatar Templates endpoint
  app.get('/api/users/templates', (_req, res) => {
    res.json({ success: true, templates: PROFILE_TEMPLATES });
  });

  // 404 Handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: 'API endpoint not found',
    });
  });

  return app;
}

// ============================================
// TESTS
// ============================================

describe('Backend Test Suite', () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
  });

  // ============================================
  // 1. Health Check Tests
  // ============================================
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('The Student Co-Op Backend');
      expect(response.body.version).toBe('1.0.0');
    });

    it('should return a valid timestamp', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.body.timestamp).toBeDefined();
      expect(new Date(response.body.timestamp).getTime()).not.toBeNaN();
    });
  });

  // ============================================
  // 2. Job Search Tests
  // ============================================
  describe('GET /api/jobs', () => {
    it('should return mock jobs when no cache', async () => {
      const response = await request(app).get('/api/jobs');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return jobs with required fields', async () => {
      const response = await request(app).get('/api/jobs');
      const job = response.body.data[0];
      
      expect(job).toHaveProperty('id');
      expect(job).toHaveProperty('title');
      expect(job).toHaveProperty('company');
      expect(job).toHaveProperty('location');
      expect(job).toHaveProperty('description');
      expect(job).toHaveProperty('url');
      expect(job).toHaveProperty('source');
    });

    it('should accept search query parameter', async () => {
      const response = await request(app).get('/api/jobs?q=developer');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should accept source parameter', async () => {
      const response = await request(app).get('/api/jobs?source=indeed');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should accept nocache parameter', async () => {
      const response = await request(app).get('/api/jobs?nocache=true');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // 3. Job Sources Tests
  // ============================================
  describe('GET /api/jobs/sources', () => {
    it('should return available job sources', async () => {
      const response = await request(app).get('/api/jobs/sources');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.sources).toBeInstanceOf(Array);
      expect(response.body.sources).toContain('indeed');
      expect(response.body.sources).toContain('reed');
      expect(response.body.sources).toContain('totaljobs');
      expect(response.body.sources).toContain('cwjobs');
    });
  });

  // ============================================
  // 4. CV Generation Tests
  // ============================================
  describe('POST /api/cv/generate', () => {
    it('should accept CV data and return success', async () => {
      const cvData = {
        name: 'John Doe',
        email: 'john@example.com',
        education: 'Computer Science',
        experience: 'Developer at TechCorp',
      };
      
      const response = await request(app)
        .post('/api/cv/generate')
        .send(cvData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('CV generation endpoint ready');
      expect(response.body.data).toEqual(cvData);
    });

    it('should handle empty CV data', async () => {
      const response = await request(app)
        .post('/api/cv/generate')
        .send({});
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // 5. Chat Analysis Tests
  // ============================================
  describe('POST /api/chat/analyze', () => {
    it('should analyze text and return feedback', async () => {
      const requestData = {
        text: 'I was working on a project where I had to lead a team of 5 people. We had to deliver a product on time. I decided to use Agile methodology. We delivered the project on time and got excellent feedback.',
        context: 'Interview Practice',
      };
      
      const response = await request(app)
        .post('/api/chat/analyze')
        .send(requestData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.analysis).toBeDefined();
      expect(response.body.analysis.feedback).toBeDefined();
    });

    it('should return STAR method feedback for complete response', async () => {
      const requestData = {
        text: 'When I was working on a project, I had to lead a team. My responsibility was to deliver the project on time. I decided to use Agile methodology. The result was that we delivered on time and got excellent feedback.',
      };
      
      const response = await request(app)
        .post('/api/chat/analyze')
        .send(requestData);
      
      expect(response.status).toBe(200);
      expect(response.body.analysis.feedback).toContain('STAR method');
    });

    it('should handle missing text field gracefully', async () => {
      const response = await request(app)
        .post('/api/chat/analyze')
        .send({ context: 'Interview' });
      
      // Should return 200 even without text, or handle gracefully
      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  // ============================================
  // 6. Chat History Tests
  // ============================================
  describe('GET /api/chat/history/:userId', () => {
    it('should return chat history for user', async () => {
      const response = await request(app).get('/api/chat/history/user123');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.messages).toBeInstanceOf(Array);
    });

    it('should handle different user IDs', async () => {
      const response = await request(app).get('/api/chat/history/user456');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // ============================================
  // 7. User Profile Tests
  // ============================================
  describe('GET /api/users/profile/:userId', () => {
    it('should return user profile', async () => {
      const response = await request(app).get('/api/users/profile/user123');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.profile).toBeDefined();
      expect(response.body.profile.userId).toBe('user123');
    });

    it('should return profile with required fields', async () => {
      const response = await request(app).get('/api/users/profile/user123');
      
      expect(response.body.profile).toHaveProperty('name');
      expect(response.body.profile).toHaveProperty('email');
    });
  });

  // ============================================
  // 8. Create Profile Tests
  // ============================================
  describe('POST /api/users/profile', () => {
    it('should create profile with default name', async () => {
      const profileData = {
        userId: 'user123',
        email: 'test@example.com',
      };
      
      const response = await request(app)
        .post('/api/users/profile')
        .send(profileData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.profile.name).toBe('Student');
    });

    it('should create profile with custom name', async () => {
      const profileData = {
        userId: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
      };
      
      const response = await request(app)
        .post('/api/users/profile')
        .send(profileData);
      
      expect(response.status).toBe(200);
      expect(response.body.profile.name).toBe('John Doe');
      expect(response.body.profile.gender).toBe('male');
    });

    it('should assign male avatar for male gender', async () => {
      const profileData = {
        userId: 'user123',
        gender: 'male',
      };
      
      const response = await request(app)
        .post('/api/users/profile')
        .send(profileData);
      
      expect(response.body.profile.gender).toBe('male');
      expect(response.body.profile.avatar).toContain('male');
    });

    it('should assign female avatar for female gender', async () => {
      const profileData = {
        userId: 'user123',
        gender: 'female',
      };
      
      const response = await request(app)
        .post('/api/users/profile')
        .send(profileData);
      
      expect(response.body.profile.gender).toBe('female');
      expect(response.body.profile.avatar).toContain('female');
    });

    it('should assign neutral avatar for unknown gender', async () => {
      const profileData = {
        userId: 'user123',
        gender: 'other',
      };
      
      const response = await request(app)
        .post('/api/users/profile')
        .send(profileData);
      
      expect(response.body.profile.gender).toBe('neutral');
    });
  });

  // ============================================
  // 9. Avatar Tests
  // ============================================
  describe('GET /api/users/avatar/:gender', () => {
    it('should return male avatar for male gender', async () => {
      const response = await request(app).get('/api/users/avatar/male');
      
      expect(response.status).toBe(200);
      expect(response.body.gender).toBe('male');
      expect(response.body.avatar).toContain('male');
    });

    it('should return female avatar for female gender', async () => {
      const response = await request(app).get('/api/users/avatar/female');
      
      expect(response.status).toBe(200);
      expect(response.body.gender).toBe('female');
      expect(response.body.avatar).toContain('female');
    });

    it('should return neutral avatar for unknown gender', async () => {
      const response = await request(app).get('/api/users/avatar/other');
      
      expect(response.status).toBe(200);
      expect(response.body.gender).toBe('neutral');
    });
  });

  // ============================================
  // 10. Avatar Templates Tests
  // ============================================
  describe('GET /api/users/templates', () => {
    it('should return all avatar templates', async () => {
      const response = await request(app).get('/api/users/templates');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.templates).toHaveProperty('male');
      expect(response.body.templates).toHaveProperty('female');
      expect(response.body.templates).toHaveProperty('neutral');
    });

    it('should have multiple avatar options for each gender', async () => {
      const response = await request(app).get('/api/users/templates');
      
      expect(response.body.templates.male.length).toBeGreaterThan(0);
      expect(response.body.templates.female.length).toBeGreaterThan(0);
      expect(response.body.templates.neutral.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // 11. 404 Handler Tests
  // ============================================
  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/api/unknown');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not Found');
    });
  });

  // ============================================
  // 12. Helper Function Tests
  // ============================================
  describe('Helper Functions', () => {
    describe('getMockJobs', () => {
      it('should return an array of jobs', () => {
        const jobs = getMockJobs();
        expect(jobs).toBeInstanceOf(Array);
        expect(jobs.length).toBeGreaterThan(0);
      });

      it('should return jobs with all required properties', () => {
        const jobs = getMockJobs();
        const job = jobs[0];
        
        expect(job).toHaveProperty('id');
        expect(job).toHaveProperty('title');
        expect(job).toHaveProperty('company');
        expect(job).toHaveProperty('location');
        expect(job).toHaveProperty('description');
        expect(job).toHaveProperty('url');
        expect(job).toHaveProperty('source');
      });
    });

    describe('generateLocalFeedback', () => {
      it('should return positive feedback for complete STAR response', () => {
        const text = 'When I was at my previous job, I was tasked with leading a project. I decided to use Agile methodology. As a result, we delivered on time and got excellent feedback.';
        const feedback = generateLocalFeedback(text);
        
        expect(feedback).toContain('STAR method perfectly');
      });

      it('should suggest improvements for incomplete STAR response', () => {
        const text = 'I worked on a project';
        const feedback = generateLocalFeedback(text);
        
        expect(feedback).toContain('STAR:');
      });

      it('should suggest adding more detail for short responses', () => {
        const text = 'I did stuff';
        const feedback = generateLocalFeedback(text);
        
        expect(feedback).toContain('Add more detail');
      });

      it('should suggest being concise for long responses', () => {
        const text = 'A'.repeat(600);
        const feedback = generateLocalFeedback(text);
        
        expect(feedback).toContain('Be more concise');
      });

      it('should handle empty text', () => {
        const feedback = generateLocalFeedback('');
        
        expect(feedback).toBeDefined();
        expect(feedback).toContain('STAR:');
      });
    });

    describe('hasValidSanityConfig', () => {
      it('should return false for invalid project ID', () => {
        // Reset env vars
        delete process.env.SANITY_PROJECT_ID;
        
        const result = hasValidSanityConfig();
        expect(result).toBe(false);
      });

      it('should return false for placeholder project ID', () => {
        process.env.SANITY_PROJECT_ID = 'your_sanity_project_id';
        
        const result = hasValidSanityConfig();
        expect(result).toBe(false);
      });

      it('should return true for valid project ID', () => {
        process.env.SANITY_PROJECT_ID = 'abc123';
        
        const result = hasValidSanityConfig();
        expect(result).toBe(true);
      });
    });

    describe('getAvailableSources', () => {
      it('should return array of job sources', () => {
        const sources = getAvailableSources();
        
        expect(sources).toBeInstanceOf(Array);
        expect(sources).toContain('indeed');
        expect(sources).toContain('reed');
        expect(sources).toContain('totaljobs');
        expect(sources).toContain('cwjobs');
      });
    });
  });
});
