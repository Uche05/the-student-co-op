import { ArrowRight, Award, Briefcase, FileText, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { MagicInput } from "../components/magic-input";
import { MobileBottomNav } from "../components/mobile-bottom-nav";
import { TopNavigation } from "../components/top-navigation";
import { Button } from "../components/ui/button";

export function HomePage() {
  const navigate = useNavigate();
  // User data available for personalization - const { user } = useUser();

  const handleMagicInputSend = (message: string) => {
    console.log("User message:", message);
    navigate("/comm-builder");
  };

  const recentWins = [
    { company: "Google", position: "SWE Intern", fellow: "Sarah Chen" },
    { company: "Microsoft", position: "PM Intern", fellow: "Alex Kumar" },
    { company: "Amazon", position: "Data Analyst", fellow: "Jordan Lee" },
  ];

  const fellows = [
    { name: "Emily Rodriguez", role: "CS @ MIT", image: "ER" },
    { name: "Michael Park", role: "Business @ NYU", image: "MP" },
    { name: "Aisha Patel", role: "Design @ RISD", image: "AP" },
    { name: "David Chen", role: "Engineering @ Stanford", image: "DC" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <TopNavigation />
      
      <main className="pb-20 lg:pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#1A202C] via-[#2D3748] to-[#1A202C] text-white py-12 lg:py-20 pb-32 lg:pb-40">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#3182CE]/20 backdrop-blur-sm border border-[#3182CE]/30 rounded-full px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 text-[#3182CE]" />
                <span>AI-Powered Career Growth Platform</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Transform Your Career Journey with{" "}
                <span className="text-[#3182CE]">AI-Powered Coaching</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
                Practice interviews, build communication skills, and connect with peers who've landed at top companies. Your success story starts here.
              </p>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 lg:gap-8 max-w-2xl mx-auto pt-8">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#3182CE]">5000+</div>
                  <div className="text-sm text-white/60 mt-1">Active Fellows</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#3182CE]">850+</div>
                  <div className="text-sm text-white/60 mt-1">Job Placements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#3182CE]">94%</div>
                  <div className="text-sm text-white/60 mt-1">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Magic Input Section - Bridging Dark and Light */}
        <section className="-mt-24 lg:-mt-32 relative z-10">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            {/* Call to Action Text */}
            <div className="text-center mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Start Your Journey Today
              </h2>
              <p className="text-white/90 text-lg">
                Practice with our AI Coach or build your professional CV
              </p>
            </div>
            
            <MagicInput onSend={handleMagicInputSend} />
            
            <div className="text-center mt-4 text-sm text-white/80">
              Try: "Help me prepare for a technical interview" or "Practice behavioral questions"
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1A202C] mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
                Comprehensive tools and resources to accelerate your career growth
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="bg-[#F9FAFB] rounded-2xl p-8 border border-[#E2E8F0] hover:border-[#3182CE] transition-all hover:shadow-lg group">
                <div className="w-14 h-14 bg-[#3182CE]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#3182CE] transition-colors">
                  <Target className="w-7 h-7 text-[#3182CE] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A202C] mb-3">AI Live Coach</h3>
                <p className="text-[#64748B] mb-4">
                  Real-time feedback on your interview responses with speech-to-text technology and personalized coaching.
                </p>
                <Link to="/comm-builder" className="text-[#3182CE] font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Start Practicing <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#F9FAFB] rounded-2xl p-8 border border-[#E2E8F0] hover:border-[#3182CE] transition-all hover:shadow-lg group">
                <div className="w-14 h-14 bg-[#3182CE]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#3182CE] transition-colors">
                  <TrendingUp className="w-7 h-7 text-[#3182CE] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A202C] mb-3">Awareness Test</h3>
                <p className="text-[#64748B] mb-4">
                  Discover your strengths with our psychometric assessment and track your skills against industry benchmarks.
                </p>
                <Link to="/awareness-test" className="text-[#3182CE] font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Take the Test <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#F9FAFB] rounded-2xl p-8 border border-[#E2E8F0] hover:border-[#3182CE] transition-all hover:shadow-lg group">
                <div className="w-14 h-14 bg-[#3182CE]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#3182CE] transition-colors">
                  <Briefcase className="w-7 h-7 text-[#3182CE] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A202C] mb-3">Job Board</h3>
                <p className="text-[#64748B] mb-4">
                  Access curated opportunities from top companies and see where fellow students have succeeded.
                </p>
                <Link to="/dashboard" className="text-[#3182CE] font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#F9FAFB] rounded-2xl p-8 border border-[#E2E8F0] hover:border-[#3182CE] transition-all hover:shadow-lg group">
                <div className="w-14 h-14 bg-[#3182CE]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#3182CE] transition-colors">
                  <FileText className="w-7 h-7 text-[#3182CE] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A202C] mb-3">CV Builder</h3>
                <p className="text-[#64748B] mb-4">
                  Create a professional CV with our AI-powered builder, ensuring your resume stands out to potential employers.
                </p>
                <Link to="/cv-builder" className="text-[#3182CE] font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Build Your CV <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Job Board Wins */}
        <section className="py-12 lg:py-16">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1A202C] mb-2">
                  Recent Job Board Wins
                </h2>
                <p className="text-[#64748B]">See where our fellows are landing</p>
              </div>
              <Link to="/dashboard">
                <Button className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recentWins.map((win, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#3182CE]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-[#3182CE]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1A202C] mb-1">{win.company}</h3>
                      <p className="text-sm text-[#64748B] mb-2">{win.position}</p>
                      <p className="text-xs text-[#3182CE]">by {win.fellow}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fellows Network */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-[#1A202C] mb-2">
                  Connect with Fellows
                </h2>
                <p className="text-[#64748B]">Join a community of ambitious students</p>
              </div>
              <Link to="/dashboard?tab=fellows">
                <Button variant="outline" className="rounded-full border-[#E2E8F0]">
                  <Users className="w-4 h-4 mr-2" />
                  View Network
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {fellows.map((fellow, index) => (
                <div key={index} className="bg-[#F9FAFB] rounded-2xl p-6 border border-[#E2E8F0] text-center hover:border-[#3182CE] transition-all hover:shadow-lg">
                  <div className="w-16 h-16 bg-[#3182CE] rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-4">
                    {fellow.image}
                  </div>
                  <h3 className="font-semibold text-[#1A202C] mb-1">{fellow.name}</h3>
                  <p className="text-sm text-[#64748B]">{fellow.role}</p>
                  <Button size="sm" className="mt-4 rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white w-full">
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}
