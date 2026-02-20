import { useCallback, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import type { CVData, Job, Message } from '../types';

// Helper to format dates
function formatPostedDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// Hook for user data
export function useUser() {
  const { state, updateUser } = useApp();
  return { user: state.user, updateUser };
}

// Hook for CV data
export function useCV() {
  const { state, updateCV } = useApp();
  
  const addExperience = useCallback((experience: CVData['experience'][0]) => {
    updateCV({ experience: [...state.cv.experience, experience] });
  }, [state.cv.experience, updateCV]);

  const updateExperience = useCallback((id: string, data: Partial<CVData['experience'][0]>) => {
    updateCV({
      experience: state.cv.experience.map((exp) =>
        exp.id === id ? { ...exp, ...data } : exp
      ),
    });
  }, [state.cv.experience, updateCV]);

  const deleteExperience = useCallback((id: string) => {
    updateCV({
      experience: state.cv.experience.filter((exp) => exp.id !== id),
    });
  }, [state.cv.experience, updateCV]);

  const addEducation = useCallback((education: CVData['education'][0]) => {
    updateCV({ education: [...state.cv.education, education] });
  }, [state.cv.education, updateCV]);

  const updateEducation = useCallback((id: string, data: Partial<CVData['education'][0]>) => {
    updateCV({
      education: state.cv.education.map((edu) =>
        edu.id === id ? { ...edu, ...data } : edu
      ),
    });
  }, [state.cv.education, updateCV]);

  const deleteEducation = useCallback((id: string) => {
    updateCV({
      education: state.cv.education.filter((edu) => edu.id !== id),
    });
  }, [state.cv.education, updateCV]);

  const addSkill = useCallback((skill: string) => {
    if (!state.cv.skills.includes(skill)) {
      updateCV({ skills: [...state.cv.skills, skill] });
    }
  }, [state.cv.skills, updateCV]);

  const removeSkill = useCallback((skill: string) => {
    updateCV({ skills: state.cv.skills.filter((s) => s !== skill) });
  }, [state.cv.skills, updateCV]);

  // Generate PDF using Foxit
  const generatePDF = useCallback(async () => {
    try {
      const response = await api.cv.generate(state.cv);
      // Handle the PDF response - download it
      if (response.data?.pdfBuffer) {
        const blob = new Blob([response.data.pdfBuffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV-${state.cv.personalInfo.name || 'Student'}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      return response.data;
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      throw error;
    }
  }, [state.cv]);

  return {
    cv: state.cv,
    updateCV,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    removeSkill,
    generatePDF,
  };
}

// Hook for jobs
export function useJobs() {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      // Call backend API - You.com for live jobs
      const response = await api.jobs.list();
      
      // Map backend response to frontend format
      const backendJobs = (response.data as any).data || [];
      const jobs: Job[] = backendJobs.map((job: any) => ({
        id: job.id,
        company: job.company,
        logo: job.company?.charAt(0).toUpperCase() || 'J',
        position: job.title || job.position,
        location: job.location || 'Remote',
        type: 'Full-time',
        salary: job.salary || 'Competitive',
        posted: job.postedDate ? formatPostedDate(job.postedDate) : 'Recently',
        tags: job.description ? job.description.split(' ').slice(0, 3) : [],
        url: job.url || '',
      }));
      
      dispatch({ type: 'SET_JOBS', payload: jobs });
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      // Fallback to mock data on error
      const mockJobs: Job[] = [
        { id: '1', company: 'Google', logo: 'G', position: 'Software Engineering Intern', location: 'Mountain View, CA', type: 'Internship', salary: '$8,000/month', posted: '2 days ago', tags: ['Python', 'Machine Learning', 'Backend'] },
        { id: '2', company: 'Microsoft', logo: 'M', position: 'Product Manager Intern', location: 'Seattle, WA', type: 'Internship', salary: '$7,500/month', posted: '4 days ago', tags: ['Product', 'Strategy', 'Analytics'] },
        { id: '3', company: 'Amazon', logo: 'A', position: 'Data Analyst Intern', location: 'Remote', type: 'Internship', salary: '$6,800/month', posted: '1 week ago', tags: ['SQL', 'Tableau', 'Python'] },
        { id: '4', company: 'Meta', logo: 'F', position: 'Frontend Engineer Intern', location: 'Menlo Park, CA', type: 'Internship', salary: '$8,500/month', posted: '3 days ago', tags: ['React', 'TypeScript', 'UI/UX'] },
      ];
      dispatch({ type: 'SET_JOBS', payload: mockJobs });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  return { jobs: state.jobs, fetchJobs, isLoading };
}

// Hook for fellows
export function useFellows() {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const fetchFellows = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.fellows.list();
      const fellowsData = response.data as any;
      dispatch({ type: 'SET_FELLOWS', payload: fellowsData.fellows || [] });
    } catch (error) {
      console.error('Failed to fetch fellows:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const toggleConnection = useCallback((id: string) => {
    dispatch({
      type: 'SET_FELLOWS',
      payload: state.fellows.map((fellow) =>
        fellow.id === id ? { ...fellow, connected: !fellow.connected } : fellow
      ),
    });
  }, [state.fellows, dispatch]);

  return { fellows: state.fellows, fetchFellows, toggleConnection, isLoading };
}

// Hook for chat/messages
export function useChat() {
  const { state, addMessage, dispatch } = useApp();

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);

    try {
      const response = await api.chat.send(content, 'Interview');
      const responseData = response.data as any;
      const feedback = responseData?.analysis?.feedback;
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: feedback || responseData?.message || "I'm sorry, I couldn't generate feedback at this time. Please try again.",
        timestamp: new Date(),
      };
      addMessage(aiResponse);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, [dispatch]);

  return { messages: state.messages, sendMessage, clearMessages };
}

// Hook for radar chart data
export function useRadarData() {
  const { state, dispatch } = useApp();

  const fetchRadarData = useCallback(async () => {
    try {
      const response = await api.awarenessTest.getResults();
      const resultsData = response.data as any;
      dispatch({ type: 'SET_RADAR_DATA', payload: resultsData.results });
    } catch (error) {
      console.error('Failed to fetch radar data:', error);
    }
  }, [dispatch]);

  return { radarData: state.radarData, fetchRadarData };
}

// Hook for notifications
export function useNotifications() {
  const { state, toggleNotification } = useApp();
  return { settings: state.notificationSettings, toggleNotification };
}
