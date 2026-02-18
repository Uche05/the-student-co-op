import { Download, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { MobileBottomNav } from "../components/mobile-bottom-nav";
import { TopNavigation } from "../components/top-navigation";
import { Button } from "../components/ui/button";
import { useCV } from "../hooks";

export function CVBuilderPage() {
  const { cv, updateCV, addExperience, updateExperience, deleteExperience, addEducation, updateEducation, deleteEducation, addSkill, removeSkill } = useCV();

  const handleAddExperience = () => {
    addExperience({
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  const handleAddEducation = () => {
    addEducation({
      id: Date.now().toString(),
      school: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
  };

  const handleAddSkill = () => {
    const skill = prompt('Enter skill name:');
    if (skill) {
      addSkill(skill);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <TopNavigation />

      <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1A202C] mb-2">CV Builder</h1>
            <p className="text-[#64748B]">Create a professional CV that stands out</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full border-[#E2E8F0]">
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
            <Button className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Editor Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E2E8F0]">
              <h2 className="text-xl font-semibold text-[#1A202C] mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#3182CE]" />
                Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={cv.personalInfo.name}
                    onChange={(e) => updateCV({ personalInfo: { ...cv.personalInfo, name: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">Email</label>
                  <input
                    type="email"
                    value={cv.personalInfo.email}
                    onChange={(e) => updateCV({ personalInfo: { ...cv.personalInfo, email: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={cv.personalInfo.phone}
                    onChange={(e) => updateCV({ personalInfo: { ...cv.personalInfo, phone: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">Location</label>
                  <input
                    type="text"
                    value={cv.personalInfo.location}
                    onChange={(e) => updateCV({ personalInfo: { ...cv.personalInfo, location: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">LinkedIn</label>
                  <input
                    type="text"
                    value={cv.personalInfo.linkedin}
                    onChange={(e) => updateCV({ personalInfo: { ...cv.personalInfo, linkedin: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A202C] mb-2">Website</label>
                  <input
                    type="text"
                    value={cv.personalInfo.website}
                    onChange={(e) => updateCV({ personalInfo: { ...cv.personalInfo, website: e.target.value } })}
                    className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Professional Summary */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E2E8F0]">
              <h2 className="text-xl font-semibold text-[#1A202C] mb-6">Professional Summary</h2>
              <textarea
                value={cv.summary}
                onChange={(e) => updateCV({ summary: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none resize-none"
                placeholder="Write a compelling summary about yourself..."
              />
            </section>

            {/* Experience */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1A202C]">Experience</h2>
                <Button size="sm" onClick={handleAddExperience} className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {cv.experience.map((exp) => (
                <div key={exp.id} className="mb-6 pb-6 border-b border-[#E2E8F0] last:border-0">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteExperience(exp.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1A202C]">Education</h2>
                <Button size="sm" onClick={handleAddEducation} className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              {cv.education.map((edu) => (
                <div key={edu.id} className="mb-6 pb-6 border-b border-[#E2E8F0] last:border-0">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteEducation(edu.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">School</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A202C] mb-2">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl focus:border-[#3182CE] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1A202C]">Skills</h2>
                <Button size="sm" onClick={handleAddSkill} className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cv.skills.map((skill) => (
                  <div key={skill} className="px-4 py-2 bg-[#3182CE]/10 border border-[#3182CE]/20 rounded-full text-sm text-[#3182CE] font-medium flex items-center gap-2">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Preview Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
              <h3 className="font-semibold text-[#1A202C] mb-4">Live Preview</h3>
              <div className="bg-[#F9FAFB] rounded-xl p-6 border border-[#E2E8F0] min-h-[600px]">
                {/* Mini CV Preview */}
                <div className="space-y-4 text-sm">
                  <div className="text-center border-b border-[#E2E8F0] pb-4">
                    <h3 className="font-bold text-lg text-[#1A202C] mb-1">{cv.personalInfo.name}</h3>
                    <p className="text-xs text-[#64748B]">{cv.personalInfo.email}</p>
                    <p className="text-xs text-[#64748B]">{cv.personalInfo.phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#1A202C] mb-2">Summary</h4>
                    <p className="text-xs text-[#64748B] line-clamp-3">{cv.summary}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1A202C] mb-2">Experience</h4>
                    {cv.experience.map((exp) => (
                      <div key={exp.id} className="mb-3">
                        <p className="font-medium text-xs text-[#1A202C]">{exp.title}</p>
                        <p className="text-xs text-[#64748B]">{exp.company}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#1A202C] mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {cv.skills.slice(0, 6).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-[#3182CE]/10 rounded text-xs text-[#3182CE]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#3182CE]/10 rounded-xl border border-[#3182CE]/20">
                <p className="text-sm text-[#1A202C] mb-2">
                  <strong>💡 Pro Tip:</strong>
                </p>
                <p className="text-xs text-[#64748B]">
                  Use action verbs and quantify your achievements for maximum impact!
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
