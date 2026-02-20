import { useCallback, useState } from 'react';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

/**
 * Custom hook for Text-to-Speech using the Web Speech API
 * Free and built into browsers - no API keys required
 */
export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const { rate = 1, pitch = 1, volume = 1, lang = 'en-US' } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Check for support and load voices
  useState(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setIsSupported(true);
      
      // Load available voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      
      // Voices may load asynchronously
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  });

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = lang;

    // Try to find a good voice
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(lang.split('-')[0]) && v.name.includes('Google')
    ) || voices.find(v => v.lang.startsWith(lang.split('-')[0]));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [rate, pitch, volume, lang, voices]);

  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
    voices,
  };
}

/**
 * Simple TTS function for one-off usage without hooks
 */
export function speakText(text: string, options: UseTextToSpeechOptions = {}): void {
  const { rate = 1, pitch = 1, volume = 1, lang = 'en-US' } = options;
  
  if (!window.speechSynthesis) {
    console.warn('Text-to-speech not supported');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  utterance.lang = lang;

  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
