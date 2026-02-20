import { Mic, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

// Type declarations for Web Speech API
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface MagicInputProps {
  onSend?: (message: string) => void;
  placeholder?: string;
}

export function MagicInput({ onSend, placeholder = "Practice your interview skills now..." }: MagicInputProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        setMessage(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message);
      setMessage("");
    }
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setMessage('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start speech recognition:', e);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-[20px] shadow-lg border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center gap-3 p-4">
          {/* Microphone Button */}
          <button
            onClick={handleMicClick}
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-[#F9FAFB] text-[#3182CE] hover:bg-[#3182CE] hover:text-white"
            }`}
            aria-label="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Input Field */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none outline-none text-[#1A202C] placeholder:text-[#64748B]"
          />

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex-shrink-0 rounded-full bg-[#3182CE] text-white hover:bg-[#2C5AA0] disabled:opacity-50 disabled:cursor-not-allowed h-12 px-6"
          >
            <Send className="w-5 h-5 mr-2" />
            Send
          </Button>
        </div>

        {/* Status Indicator */}
        {isListening && (
          <div className="px-4 pb-3 flex items-center gap-2 text-sm text-red-500">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
            </div>
            <span>Listening...</span>
          </div>
        )}
      </div>
    </div>
  );
}
