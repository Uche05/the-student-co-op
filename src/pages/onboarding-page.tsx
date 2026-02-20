import { ArrowRight, Briefcase, Check, Clock, GraduationCap, MapPin, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../api/client";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useApp } from "../context/AppContext";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Marketing", "Engineering", 
  "Education", "Consulting", "Retail", "Media", "Non-profit"
];

const ROLES = [
  "Software Engineer", "Product Manager", "Data Analyst", "Marketing Specialist",
  "UX Designer", "Business Analyst", "Sales Representative", "Project Manager",
  "Financial Analyst", "HR Coordinator"
];

const SKILLS = [
  "JavaScript", "Python", "SQL", "Data Analysis", "Project Management",
  "Communication", "Leadership", "Problem Solving", "Excel", "PowerPoint",
  "Marketing", "Social Media", "Writing", "Research", "Teamwork"
];

const WORK_TYPES = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" }
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    careerGoals: "",
    targetIndustry: "",
    targetRoles: [] as string[],
    experienceLevel: "student",
    skills: [] as string[],
    locationPreference: "",
    workType: "remote",
    readyToApply: false,
    lookingFor: [] as string[]
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await api.onboarding.save({
        userId: state.user?.id || "demo-user",
        careerGoals: formData.careerGoals,
        targetIndustry: formData.targetIndustry,
        targetRoles: formData.targetRoles,
        experienceLevel: formData.experienceLevel,
        skills: formData.skills,
        locationPreference: formData.locationPreference,
        workType: formData.workType,
        readyToApply: formData.readyToApply,
        lookingFor: formData.lookingFor
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save onboarding:", error);
      // Still navigate even if save fails in demo mode
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to Student Co-Op! 👋</CardTitle>
          <CardDescription>
            Let's personalize your experience. Step {step} of 4
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress Bar */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Career Goals */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-medium flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  What are your career goals?
                </Label>
                <textarea
                  className="w-full p-3 border rounded-lg resize-none h-24"
                  placeholder="Describe your short-term and long-term career aspirations..."
                  value={formData.careerGoals}
                  onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium">What industry are you targeting?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {INDUSTRIES.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => setFormData({ ...formData, targetIndustry: industry })}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        formData.targetIndustry === industry
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target Roles */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-medium flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  What roles are you interested in?
                </Label>
                <p className="text-sm text-gray-500">Select all that apply</p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setFormData({
                        ...formData,
                        targetRoles: toggleArrayItem(formData.targetRoles, role)
                      })}
                      className={`p-3 rounded-lg border text-sm transition-colors flex items-center justify-between ${
                        formData.targetRoles.includes(role)
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {role}
                      {formData.targetRoles.includes(role) && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Skills & Experience */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-medium flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  What's your experience level?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {["student", "graduate", "experienced"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, experienceLevel: level })}
                      className={`p-3 rounded-lg border text-sm capitalize transition-colors ${
                        formData.experienceLevel === level
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {level === "student" ? "Current Student" : level === "graduate" ? "Recent Graduate" : "Experienced"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium">What skills do you have?</Label>
                <p className="text-sm text-gray-500">Select all that apply</p>
                <div className="grid grid-cols-3 gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setFormData({
                        ...formData,
                        skills: toggleArrayItem(formData.skills, skill)
                      })}
                      className={`p-2 rounded-lg border text-sm transition-colors ${
                        formData.skills.includes(skill)
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Work type preference
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {WORK_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, workType: type.value })}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        formData.workType === type.value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Location preference
                </Label>
                <Input
                  placeholder="City, Country (e.g., London, UK)"
                  value={formData.locationPreference}
                  onChange={(e) => setFormData({ ...formData, locationPreference: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-medium">Are you ready to start applying?</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormData({ ...formData, readyToApply: true })}
                    className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${
                      formData.readyToApply
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    Yes, I'm ready!
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, readyToApply: false })}
                    className={`flex-1 p-3 rounded-lg border text-sm transition-colors ${
                      !formData.readyToApply && formData.readyToApply !== undefined
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    Not yet, still preparing
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            
            {step < 4 ? (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
