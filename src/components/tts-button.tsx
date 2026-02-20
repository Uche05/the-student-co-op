import { useState } from 'react';
import { speakText, stopSpeaking } from '../hooks/useTextToSpeech';

interface TTSButtonProps {
  text: string;
  className?: string;
  icon?: React.ReactNode;
}

export function TTSButton({ text, className = '', icon }: TTSButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text, {
        rate: 0.9,
        pitch: 1,
        volume: 1,
        lang: 'en-US',
      });
      
      // Reset state after speech ends (approximate timing)
      setTimeout(() => setIsSpeaking(false), text.length * 60);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
      title={isSpeaking ? 'Stop reading' : 'Read aloud'}
      type="button"
    >
      {icon || (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={isSpeaking ? 'text-red-500 animate-pulse' : 'text-gray-600'}
        >
          {isSpeaking ? (
            // Stop icon when speaking
            <>
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </>
          ) : (
            // Volume icon when not speaking
            <>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </>
          )}
        </svg>
      )}
    </button>
  );
}
