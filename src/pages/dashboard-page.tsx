import { Award, Briefcase, Building2, Clock, DollarSign, MapPin, MessageSquare, TrendingUp, Users } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { MobileBottomNav } from "../components/mobile-bottom-nav";
import { StatsRadarChart } from "../components/stats-radar-chart";
import { TopNavigation } from "../components/top-navigation";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useFellows, useJobs, useUser } from "../hooks";

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "opportunities";
  const { user } = useUser();
  const { jobs, fetchJobs } = useJobs();
  const { fellows, fetchFellows, toggleConnection } = useFellows();

  useEffect(() => {
    fetchJobs();
    fetchFellows();
  }, [fetchJobs, fetchFellows]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const stats = [
    { label: "Applications", value: "24", change: "+12%", icon: Briefcase },
    { label: "Interviews", value: "8", change: "+25%", icon: Users },
    { label: "Offers", value: "2", change: "+100%", icon: Award },
    { label: "Network", value: user.connections.toString(), change: "+8%", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <TopNavigation />

      <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1A202C] mb-2">Dashboard</h1>
          <p className="text-[#64748B]">Track your progress and explore opportunities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-[#3182CE]/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#3182CE]" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-[#1A202C] mb-1">{stat.value}</div>
                <div className="text-sm text-[#64748B]">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-white border border-[#E2E8F0] p-1 rounded-2xl mb-6 w-full lg:w-auto">
                <TabsTrigger value="opportunities" className="rounded-xl data-[state=active]:bg-[#3182CE] data-[state=active]:text-white flex-1 lg:flex-initial">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Opportunities
                </TabsTrigger>
                <TabsTrigger value="fellows" className="rounded-xl data-[state=active]:bg-[#3182CE] data-[state=active]:text-white flex-1 lg:flex-initial">
                  <Users className="w-4 h-4 mr-2" />
                  Fellows
                </TabsTrigger>
              </TabsList>

              {/* Opportunities Tab */}
              <TabsContent value="opportunities" className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-lg transition-all">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-[#3182CE] rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {job.logo}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-semibold text-[#1A202C] text-lg mb-1">{job.position}</h3>
                            <p className="text-[#64748B] flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.company}
                            </p>
                          </div>
                          <Button 
                          className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white hidden sm:flex"
                          onClick={() => {
                            const url = job.url || `https://uk.indeed.com/jobs?q=${encodeURIComponent(job.position)}&l=${encodeURIComponent(job.location)}`;
                            window.open(url, '_blank');
                          }}
                        >
                          Apply Now
                        </Button>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-[#64748B] mb-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.posted}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-[#F9FAFB] border border-[#E2E8F0] rounded-full text-xs text-[#64748B]">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Button 
                          className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white w-full mt-4 sm:hidden"
                          onClick={() => {
                            const url = job.url || `https://uk.indeed.com/jobs?q=${encodeURIComponent(job.position)}&l=${encodeURIComponent(job.location)}`;
                            window.open(url, '_blank');
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              {/* Fellows Tab */}
              <TabsContent value="fellows">
                <div className="grid sm:grid-cols-2 gap-4">
                  {fellows.map((fellow) => (
                    <div key={fellow.id} className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-[#3182CE] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {fellow.image}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#1A202C] mb-1">{fellow.name}</h3>
                          <p className="text-sm text-[#64748B] mb-1">{fellow.role}</p>
                          <p className="text-xs text-[#3182CE]">{fellow.school}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={fellow.connected ? "outline" : "default"}
                          onClick={() => toggleConnection(fellow.id)}
                          className={`flex-1 rounded-full ${
                            fellow.connected
                              ? "border-[#E2E8F0]"
                              : "bg-[#3182CE] hover:bg-[#2C5AA0] text-white"
                          }`}
                        >
                          {fellow.connected ? "Connected" : "Connect"}
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full border-[#E2E8F0]">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Stats Sidebar - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#3182CE]/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#3182CE]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#1A202C]">Awareness Test</h2>
                  <p className="text-xs text-[#64748B]">Your Skills vs Industry</p>
                </div>
              </div>

              <StatsRadarChart />

              <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                <h3 className="text-sm font-semibold text-[#1A202C] mb-3">Top Strengths</h3>
                <div className="space-y-2">
                  {user.strengths.slice(0, 3).map((strength, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-[#64748B]">{strength}</span>
                      <span className="font-semibold text-[#3182CE]">{[90, 85, 82][i]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats Section */}
        {activeTab === "stats" && (
          <div className="lg:hidden">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#3182CE]/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#3182CE]" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#1A202C]">Awareness Test Results</h2>
                  <p className="text-xs text-[#64748B]">Your Skills vs Industry Benchmarks</p>
                </div>
              </div>

              <StatsRadarChart />

              <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
                <h3 className="text-sm font-semibold text-[#1A202C] mb-3">Top Strengths</h3>
                <div className="space-y-3">
                  {[
                    { name: "Problem Solving", score: 90, color: "bg-[#3182CE]" },
                    { name: "Communication", score: 85, color: "bg-[#10B981]" },
                    { name: "Teamwork", score: 82, color: "bg-[#F59E0B]" },
                  ].map((strength, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[#64748B]">{strength.name}</span>
                        <span className="font-semibold text-[#3182CE]">{strength.score}%</span>
                      </div>
                      <div className="h-2 bg-[#F9FAFB] rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color}`} style={{ width: `${strength.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}
