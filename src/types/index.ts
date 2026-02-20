// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  memberSince: string;
  practiceSessions: number;
  connections: number;
  careerPath: string;
  targetCompanies: string[];
  strengths: string[];
  goals: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  availability: string;
  lockedUntil?: Date;
  onboardingCompleted: boolean;
}

// Job types
export interface Job {
  id: string;
  company: string;
  logo: string;
  position: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  tags: string[];
  url?: string;
}

// Job Application Diary - tracks when user clicks "Applied"
export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn';
  notes: string;
  followUpDate?: string;
}

// Bookmarked/Saved Jobs
export interface BookmarkedJob {
  id: string;
  jobId: string;
  job: Job;
  bookmarkedAt: string;
  notes?: string;
}

// Onboarding Questions for new users
export interface OnboardingData {
  careerGoals: string;
  targetIndustry: string;
  targetRoles: string[];
  experienceLevel: 'student' | 'graduate' | 'experienced';
  skills: string[];
  locationPreference: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  readyToApply: boolean;
  lookingFor: string[];
}

// Fellow types
export interface Fellow {
  id: string;
  name: string;
  role: string;
  school: string;
  image: string;
  connected: boolean;
}

// CV types
export interface CVData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: CVExperience[];
  education: CVEducation[];
  skills: string[];
  projects: CVProject[];
}

export interface CVExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVEducation {
  id: string;
  school: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface CVProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
}

// Chat/Message types
export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// Awareness Test types
export interface Question {
  id: number;
  text: string;
  category: string;
  options: string[];
}

export interface TestResult {
  id: string;
  scores: Record<string, number>;
  completedAt: Date;
}

// Notification types
export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

// Stats types
export interface Stats {
  label: string;
  value: string;
  change: string;
  icon: string;
}

export interface RadarData {
  skill: string;
  user: number;
  industry: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
}
