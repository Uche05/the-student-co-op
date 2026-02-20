import type { ReactNode } from 'react';
import { createContext, useContext, useReducer } from 'react';
import { api } from '../api/client';
import type { CVData, Fellow, Job, Message, NotificationSetting, RadarData, User } from '../types';

// Default mock data - can be replaced with API calls
const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@university.edu',
  image: 'JD',
  memberSince: 'Jan 2026',
  practiceSessions: 28,
  connections: 156,
  careerPath: 'Software Engineering',
  targetCompanies: ['Google', 'Meta', 'Amazon', 'Microsoft'],
  strengths: ['Problem Solving', 'Communication', 'Technical Skills'],
  goals: 'Land a software engineering internship at a top tech company for Summer 2026',
  experienceLevel: 'Intermediate',
  availability: 'Summer 2026',
  lockedUntil: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
};

const defaultCV: CVData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    location: 'Boston, MA',
    linkedin: 'linkedin.com/in/johndoe',
    website: 'johndoe.com',
  },
  summary: 'Motivated software engineering student with experience in full-stack development and a passion for creating innovative solutions.',
  experience: [
    {
      id: '1',
      title: 'Software Engineering Intern',
      company: 'Tech Startup Inc.',
      location: 'Remote',
      startDate: 'Jun 2025',
      endDate: 'Aug 2025',
      description: 'Developed responsive web applications using React and Node.js',
    },
  ],
  education: [
    {
      id: '1',
      school: 'Massachusetts Institute of Technology',
      degree: 'Bachelor of Science in Computer Science',
      location: 'Cambridge, MA',
      startDate: 'Sep 2023',
      endDate: 'May 2027',
      gpa: '3.8/4.0',
    },
  ],
  skills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Agile'],
  projects: [
    {
      id: '1',
      name: 'AI-Powered Task Manager',
      description: 'Built a task management app with AI-driven priority suggestions',
      technologies: ['React', 'TypeScript', 'OpenAI API'],
    },
  ],
};

const defaultNotificationSettings: NotificationSetting[] = [
  { id: 'job_matches', label: 'Job Matches', description: 'Get notified about new opportunities', enabled: true },
  { id: 'interview_tips', label: 'Interview Tips', description: 'Daily coaching insights', enabled: true },
  { id: 'fellow_requests', label: 'Fellow Requests', description: 'New connection requests', enabled: true },
  { id: 'achievement_updates', label: 'Achievements', description: 'Milestone celebrations', enabled: false },
];

const defaultRadarData: RadarData[] = [
  { skill: 'Communication', user: 85, industry: 70 },
  { skill: 'Emotional Intelligence', user: 78, industry: 72 },
  { skill: 'Resilience', user: 82, industry: 68 },
  { skill: 'Problem Solving', user: 90, industry: 80 },
  { skill: 'Leadership', user: 75, industry: 70 },
];

// State interface
interface AppState {
  user: User;
  cv: CVData;
  jobs: Job[];
  fellows: Fellow[];
  messages: Message[];
  notificationSettings: NotificationSetting[];
  radarData: RadarData[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  currentUser: { userId: string; name: string; email: string } | null;
}

// Action types
type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_CV'; payload: CVData }
  | { type: 'SET_JOBS'; payload: Job[] }
  | { type: 'SET_FELLOWS'; payload: Fellow[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_NOTIFICATION_SETTINGS'; payload: NotificationSetting[] }
  | { type: 'TOGGLE_NOTIFICATION'; payload: string }
  | { type: 'SET_RADAR_DATA'; payload: RadarData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_AUTH'; payload: { isAuthenticated: boolean; currentUser: { userId: string; name: string; email: string } | null } }

// Initial state
const initialState: AppState = {
  user: defaultUser,
  cv: defaultCV,
  jobs: [],
  fellows: [],
  messages: [],
  notificationSettings: defaultNotificationSettings,
  radarData: defaultRadarData,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  currentUser: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CV':
      return { ...state, cv: action.payload };
    case 'SET_JOBS':
      return { ...state, jobs: action.payload };
    case 'SET_FELLOWS':
      return { ...state, fellows: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'SET_NOTIFICATION_SETTINGS':
      return { ...state, notificationSettings: action.payload };
    case 'TOGGLE_NOTIFICATION':
      return {
        ...state,
        notificationSettings: state.notificationSettings.map((setting) =>
          setting.id === action.payload ? { ...setting, enabled: !setting.enabled } : setting
        ),
      };
    case 'SET_RADAR_DATA':
      return { ...state, radarData: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_AUTH':
      return { ...state, isAuthenticated: action.payload.isAuthenticated, currentUser: action.payload.currentUser };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions for common operations
  updateUser: (user: Partial<User>) => void;
  updateCV: (cv: Partial<CVData>) => void;
  addMessage: (message: Message) => void;
  toggleNotification: (id: string) => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'SET_USER', payload: { ...state.user, ...userData } });
  };

  const updateCV = (cvData: Partial<CVData>) => {
    dispatch({ type: 'SET_CV', payload: { ...state.cv, ...cvData } });
  };

  const addMessage = (message: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const toggleNotification = (id: string) => {
    dispatch({ type: 'TOGGLE_NOTIFICATION', payload: id });
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.auth.signin(email, password);
      if (response.success) {
        dispatch({ 
          type: 'SET_AUTH', 
          payload: { 
            isAuthenticated: true, 
            currentUser: { userId: response.data.userId, name: response.data.name, email: response.data.email } 
          } 
        });
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await api.auth.signup(email, password, name);
      if (response.success) {
        dispatch({ 
          type: 'SET_AUTH', 
          payload: { 
            isAuthenticated: true, 
            currentUser: { userId: response.data.userId, name: response.data.name, email: response.data.email } 
          } 
        });
        return { success: true };
      }
      return { success: false, error: response.data?.error || 'Signup failed' };
    } catch (error) {
      return { success: false, error: 'Sign up failed' };
    }
  };

  const signOut = async () => {
    dispatch({ type: 'SET_AUTH', payload: { isAuthenticated: false, currentUser: null } });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        updateUser,
        updateCV,
        addMessage,
        toggleNotification,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
