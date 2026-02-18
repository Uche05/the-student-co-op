import { useCallback, useState } from 'react';
import { useApp } from '../context/AppContext';
import type { CVData, Fellow, Job, Message } from '../types';

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
  };
}

// Hook for jobs
export function useJobs() {
  const { state, dispatch } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.jobs.list();
      // dispatch({ type: 'SET_JOBS', payload: response.data });
      
      // For now, set mock data
      const mockJobs: Job[] = [
        { id: '1', company: 'Google', logo: 'G', position: 'Software Engineering Intern', location: 'Mountain View, CA', type: 'Internship', salary: '$8,000/month', posted: '2 days ago', tags: ['Python', 'Machine Learning', 'Backend'] },
        { id: '2', company: 'Microsoft', logo: 'M', position: 'Product Manager Intern', location: 'Seattle, WA', type: 'Internship', salary: '$7,500/month', posted: '4 days ago', tags: ['Product', 'Strategy', 'Analytics'] },
        { id: '3', company: 'Amazon', logo: 'A', position: 'Data Analyst Intern', location: 'Remote', type: 'Internship', salary: '$6,800/month', posted: '1 week ago', tags: ['SQL', 'Tableau', 'Python'] },
        { id: '4', company: 'Meta', logo: 'F', position: 'Frontend Engineer Intern', location: 'Menlo Park, CA', type: 'Internship', salary: '$8,500/month', posted: '3 days ago', tags: ['React', 'TypeScript', 'UI/UX'] },
      ];
      dispatch({ type: 'SET_JOBS', payload: mockJobs });
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
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
      // TODO: Replace with actual API call when backend is ready
      const mockFellows: Fellow[] = [
        { id: '1', name: 'Sarah Chen', role: 'CS @ MIT', school: 'MIT', image: 'SC', connected: false },
        { id: '2', name: 'Alex Kumar', role: 'Business @ NYU', school: 'NYU', image: 'AK', connected: true },
        { id: '3', name: 'Jordan Lee', role: 'Design @ RISD', school: 'RISD', image: 'JL', connected: false },
        { id: '4', name: 'Emily Rodriguez', role: 'Engineering @ Stanford', school: 'Stanford', image: 'ER', connected: true },
        { id: '5', name: 'Michael Park', role: 'CS @ Berkeley', school: 'UC Berkeley', image: 'MP', connected: false },
        { id: '6', name: 'Aisha Patel', role: 'Product @ CMU', school: 'CMU', image: 'AP', connected: true },
      ];
      dispatch({ type: 'SET_FELLOWS', payload: mockFellows });
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
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.chat.send(content);
      
      // Mock AI response for now
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "That's a great question! Let me provide some feedback on your response structure. You started well by providing context, but remember to use the STAR method: Situation, Task, Action, Result.",
          timestamp: new Date(),
        };
        addMessage(aiResponse);
      }, 1500);
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
      // TODO: Replace with actual API call when backend is ready
      // const response = await api.awarenessTest.getResults();
      // dispatch({ type: 'SET_RADAR_DATA', payload: response.data });
      
      // Mock data is already set in initial state
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
