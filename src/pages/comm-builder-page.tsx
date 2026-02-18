import { Brain, History, Mic, Send } from "lucide-react";
import { useState } from "react";
import { MobileBottomNav } from "../components/mobile-bottom-nav";
import { TopNavigation } from "../components/top-navigation";
import { Button } from "../components/ui/button";
import { useChat, useUser } from "../hooks";

export function CommBuilderPage() {
  const { messages, sendMessage } = useChat();
  const { user } = useUser();
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [aiStatus, setAiStatus] = useState<"idle" | "listening" | "thinking">("idle");

  const aiMemory = [
    { label: "Career Path", value: user.careerPath },
    { label: "Target Companies", value: user.targetCompanies.join(", ") },
    { label: "Practice Sessions", value: `${user.practiceSessions} completed` },
    { label: "Improvement Areas", value: "Behavioral questions" },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setAiStatus("thinking");
    sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleMicClick = () => {
    setIsListening(!isListening);
    setAiStatus(isListening ? "idle" : "listening");

    if (!isListening) {
      setTimeout(() => {
        setInputMessage("I led a team project where we had to deliver a complex feature in two weeks...");
        setIsListening(false);
        setAiStatus("idle");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <TopNavigation />

      <div className="flex-1 flex overflow-hidden">
        {/* AI Memory Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 bg-white border-r border-[#E2E8F0] overflow-y-auto">
          <div className="p-6 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#3182CE]/10 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#3182CE]" />
              </div>
              <h2 className="font-semibold text-[#1A202C]">AI Memory</h2>
            </div>
            <p className="text-sm text-[#64748B]">
              Context from your conversations and goals
            </p>
          </div>

          <div className="p-6 space-y-6">
            {aiMemory.map((item, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-[#64748B]">{item.label}</label>
                <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E2E8F0]">
                  <p className="text-sm text-[#1A202C]">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-[#E2E8F0]">
              <h3 className="text-sm font-medium text-[#1A202C] mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-[#3182CE]" />
                Recent Topics
              </h3>
              <div className="space-y-2">
                {["Technical interviews", "STAR method", "System design"].map((topic, i) => (
                  <div key={i} className="text-sm text-[#64748B] py-2 px-3 hover:bg-[#F9FAFB] rounded-lg cursor-pointer transition-colors">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden pb-20 lg:pb-0">
          {/* AI Status Banner */}
          {aiStatus !== "idle" && (
            <div className="bg-[#3182CE]/10 border-b border-[#3182CE]/20 px-4 lg:px-6 py-3">
              <div className="flex items-center gap-3 max-w-5xl mx-auto">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#3182CE] rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-[#3182CE] rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-[#3182CE] rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-sm font-medium text-[#3182CE]">
                  {aiStatus === "listening" ? "Listening to your response..." : "AI Coach is thinking..."}
                </span>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
            <div className="max-w-5xl mx-auto space-y-6">
              {messages.length === 0 && (
                <div className="flex justify-center">
                  <div className="text-center">
                    <Brain className="w-16 h-16 text-[#3182CE] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-[#1A202C] mb-2">AI Coach</h3>
                    <p className="text-[#64748B]">
                      I'm your AI Coach. I'm here to help you practice your interview skills. What role are you preparing for?
                    </p>
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "ai" && (
                    <div className="w-10 h-10 bg-[#1A202C] rounded-full flex items-center justify-center flex-shrink-0 text-white">
                      <Brain className="w-5 h-5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] lg:max-w-[70%] rounded-2xl px-5 py-4 ${
                      message.type === "user"
                        ? "bg-[#3182CE] text-white rounded-tr-sm"
                        : "bg-white border border-[#E2E8F0] text-[#1A202C] rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.type === "user" ? "text-white/70" : "text-[#64748B]"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {message.type === "user" && (
                    <div className="w-10 h-10 bg-[#3182CE] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold">
                      {user.image}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-[#E2E8F0] bg-white px-4 lg:px-6 py-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-end gap-3">
                {/* Microphone Button */}
                <button
                  onClick={handleMicClick}
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[#F9FAFB] text-[#3182CE] hover:bg-[#3182CE] hover:text-white border border-[#E2E8F0]"
                  }`}
                  aria-label="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>

                {/* Input Field */}
                <div className="flex-1 bg-[#F9FAFB] border border-[#E2E8F0] rounded-2xl px-4 py-3 focus-within:border-[#3182CE] transition-colors">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your response or use voice..."
                    rows={1}
                    className="w-full bg-transparent border-none outline-none resize-none text-[#1A202C] placeholder:text-[#64748B]"
                  />
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="flex-shrink-0 rounded-full bg-[#3182CE] text-white hover:bg-[#2C5AA0] disabled:opacity-50 h-12 px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {["Tell me about yourself", "Describe a challenge", "Why this company?"].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInputMessage(prompt)}
                    className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-full text-sm text-[#64748B] hover:border-[#3182CE] hover:text-[#3182CE] whitespace-nowrap transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
