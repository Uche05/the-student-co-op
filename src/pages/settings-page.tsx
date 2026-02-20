import { Award, Bell, Calendar, Info, Lock, Target, User } from "lucide-react";
import { useState } from "react";
import { MobileBottomNav } from "../components/mobile-bottom-nav";
import { TopNavigation } from "../components/top-navigation";
import { TTSButton } from "../components/tts-button";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { useNotifications, useUser } from "../hooks";

export function SettingsPage() {
  const { user, updateUser } = useUser();
  const { settings, toggleNotification } = useNotifications();
  const [goals, setGoals] = useState(user.goals);
  const [availability, setAvailability] = useState(user.availability);
  const [experienceLevel, setExperienceLevel] = useState(user.experienceLevel);

  const daysUntilUnlock = 23;

  const handleSave = () => {
    updateUser({
      goals,
      availability,
      experienceLevel,
    });
    // TODO: Call API to save settings
    // await api.settings.update({ goals, availability, experienceLevel });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <TopNavigation />

      <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1A202C] mb-2">Settings</h1>
          <p className="text-[#64748B]">Manage your profile and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Settings */}
          <div className="lg:col-span-2 lg:order-1 space-y-6">
            {/* My Profile & Goals */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E2E8F0]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#3182CE]/10 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-[#3182CE]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#1A202C]">My Profile & Goals</h2>
                  <p className="text-sm text-[#64748B]">Information from your onboarding</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Career Path - LOCKED */}
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">
                    Career Path
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.careerPath}
                      disabled
                      className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E2E8F0] rounded-xl text-[#64748B] cursor-not-allowed"
                      aria-label="Career Path"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-medium text-amber-700">Locked</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#1A202C] text-white border-[#1A202C]">
                          <div className="flex items-start gap-2 max-w-xs">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium mb-1">Commitment Lock Active</p>
                              <p className="text-sm text-white/80">
                                Next edit available in <strong>{daysUntilUnlock} days</strong> to help maintain focus on your goals.
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {user.lockedUntil && (
                    <p className="text-xs text-[#64748B] mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Unlocks on {user.lockedUntil.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>

                {/* Target Companies */}
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">
                    Target Companies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {user.targetCompanies.map((company, i) => (
                      <span key={i} className="px-4 py-2 bg-[#3182CE]/10 border border-[#3182CE]/20 rounded-full text-sm text-[#3182CE] font-medium">
                        {company}
                      </span>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full border-[#E2E8F0]">
                      + Add More
                    </Button>
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">
                    Key Strengths
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {user.strengths.map((strength, i) => (
                      <span key={i} className="px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-700 font-medium">
                        {strength}
                      </span>
                    ))}
                    <Button variant="outline" size="sm" className="rounded-full border-[#E2E8F0]">
                      + Add More
                    </Button>
                  </div>
                </div>

                {/* Career Goals */}
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">
                    Career Goals
                  </label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[#1A202C] focus:border-[#3182CE] focus:outline-none transition-colors resize-none"
                    placeholder="Enter your career goals..."
                  />
                </div>

                {/* Experience Level & Availability */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A202C] mb-2">
                      Experience Level
                    </label>
                    <select 
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[#1A202C] focus:border-[#3182CE] focus:outline-none transition-colors"
                      aria-label="Experience Level"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A202C] mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-[#1A202C] focus:border-[#3182CE] focus:outline-none transition-colors"
                      placeholder="e.g., Summer 2026"
                      aria-label="Availability"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1 sm:flex-initial rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white px-8">
                    Save Changes
                  </Button>
                  <Button variant="outline" className="rounded-full border-[#E2E8F0]">
                    Cancel
                  </Button>
                </div>
              </div>
            </section>

            {/* Accessibility - Text to Speech */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E2E8F0]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#38A169]/10 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🔊</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#1A202C]">Accessibility</h2>
                  <p className="text-sm text-[#64748B]">Text-to-speech and reading assistance</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E2E8F0]">
                  <div className="mt-1">
                    <span className="text-xl">🔊</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#1A202C] mb-1">Text-to-Speech</h3>
                    <p className="text-sm text-[#64748B] mb-3">
                      Use the built-in speech synthesis to read content aloud. Click the speaker icon on any text to hear it read.
                    </p>
                    <div className="flex items-center gap-3">
                      <TTSButton 
                        text="Welcome to Student Co-op! This is a demo of the text-to-speech feature. Your career path is locked to help you stay focused on your goals." 
                        className="bg-[#38A169] hover:bg-[#2F855A] text-white px-4 py-2 rounded-lg"
                      />
                      <span className="text-sm text-[#64748B]">Click to test</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#64748B]">
                  Uses the browser's built-in Web Speech API. No internet connection or API keys required. 
                  Works in Chrome, Edge, Safari, and Firefox.
                </p>
              </div>
            </section>

            {/* Notification Settings */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E2E8F0]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#3182CE]/10 rounded-2xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-[#3182CE]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#1A202C]">Notifications</h2>
                  <p className="text-sm text-[#64748B]">Manage how you receive updates</p>
                </div>
              </div>

              <div className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-start gap-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E2E8F0]">
                    <input
                      type="checkbox"
                      checked={setting.enabled}
                      onChange={() => toggleNotification(setting.id)}
                      id={setting.id}
                      className="mt-1 w-5 h-5 rounded border-[#E2E8F0] text-[#3182CE] focus:ring-[#3182CE]"
                    />
                    <label htmlFor={setting.id} className="flex-1 cursor-pointer">
                      <h3 className="font-medium text-[#1A202C] mb-1">{setting.label}</h3>
                      <p className="text-sm text-[#64748B]">{setting.description}</p>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile Summary Card */}
            <div className="bg-gradient-to-br from-[#3182CE] to-[#2C5AA0] rounded-2xl p-6 text-white">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                {user.image}
              </div>
              <h3 className="text-center font-semibold text-lg mb-1">{user.name}</h3>
              <p className="text-center text-white/80 text-sm mb-4">{user.email}</p>
              
              <div className="space-y-3 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Member Since</span>
                  <span className="font-medium">{user.memberSince}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Practice Sessions</span>
                  <span className="font-medium">{user.practiceSessions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Connections</span>
                  <span className="font-medium">{user.connections}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#1A202C] mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-xl border-[#E2E8F0] hover:bg-[#F9FAFB]">
                  <Target className="w-4 h-4 mr-3 text-[#3182CE]" />
                  Retake Awareness Test
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl border-[#E2E8F0] hover:bg-[#F9FAFB]">
                  <Award className="w-4 h-4 mr-3 text-[#3182CE]" />
                  View Achievements
                </Button>
              </div>
            </div>

            {/* Commitment Timer Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-1">Commitment Lock</h3>
                  <p className="text-sm text-amber-700">
                    Your career path is locked to help you stay focused on your goals. This evidence-based approach improves success rates.
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-amber-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900">{daysUntilUnlock}</div>
                  <div className="text-xs text-amber-700">days until unlock</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
