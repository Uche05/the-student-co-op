import { useState } from "react";
import { useNavigate } from "react-router";
import { TopNavigation } from "../components/top-navigation";
import { MobileBottomNav } from "../components/mobile-bottom-nav";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface Question {
  id: number;
  text: string;
  category: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    category: "Communication",
    text: "When presenting to a group, I feel confident and articulate.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 2,
    category: "Problem Solving",
    text: "I enjoy breaking down complex problems into manageable parts.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 3,
    category: "Leadership",
    text: "I take initiative to lead projects and motivate team members.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 4,
    category: "Emotional Intelligence",
    text: "I can easily recognize and understand the emotions of others.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 5,
    category: "Resilience",
    text: "I bounce back quickly from setbacks and disappointments.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 6,
    category: "Communication",
    text: "I can explain technical concepts to non-technical audiences effectively.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 7,
    category: "Problem Solving",
    text: "I remain calm and analytical when facing unexpected challenges.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 8,
    category: "Leadership",
    text: "I actively seek opportunities to mentor and guide others.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 9,
    category: "Emotional Intelligence",
    text: "I am aware of how my emotions affect my behavior and decisions.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: 10,
    category: "Resilience",
    text: "I view failures as learning opportunities and adapt my approach accordingly.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
];

export function AwarenessTestPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Navigate to dashboard with stats tab
    navigate("/dashboard?tab=stats");
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <TopNavigation />
        <main className="max-w-2xl mx-auto px-4 py-12 lg:py-20 text-center">
          <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[#E2E8F0] shadow-lg">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1A202C] mb-4">
              Test Complete! 🎉
            </h1>
            <p className="text-lg text-[#64748B] mb-8">
              Great job! We're analyzing your responses to create your personalized skills profile.
            </p>
            
            <div className="bg-[#F9FAFB] rounded-2xl p-6 mb-8">
              <h2 className="font-semibold text-[#1A202C] mb-4">What's Next?</h2>
              <ul className="text-left space-y-3 text-[#64748B]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3182CE] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">1</span>
                  </div>
                  <span>View your radar chart comparing your skills to industry benchmarks</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3182CE] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">2</span>
                  </div>
                  <span>Get personalized recommendations for skill development</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#3182CE] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">3</span>
                  </div>
                  <span>Start practicing with AI Coach to improve your weakest areas</span>
                </li>
              </ul>
            </div>

            <Button 
              onClick={handleSubmit}
              className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white px-8 py-6 text-lg"
            >
              View My Results
            </Button>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <TopNavigation />

      <main className="max-w-4xl mx-auto px-4 py-6 lg:py-12 pb-24 lg:pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1A202C] mb-3">
            Awareness Test
          </h1>
          <p className="text-lg text-[#64748B]">
            Discover your strengths and areas for growth
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#64748B]">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-[#3182CE]">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-[#E2E8F0]" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-[#E2E8F0] shadow-lg mb-6">
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 bg-[#3182CE]/10 border border-[#3182CE]/20 rounded-full px-4 py-2 text-sm font-medium text-[#3182CE] mb-6">
            {currentQ.category}
          </div>

          {/* Question Text */}
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#1A202C] mb-8">
            {currentQ.text}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id] === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all text-left font-medium ${
                    isSelected
                      ? "border-[#3182CE] bg-[#3182CE]/5 text-[#3182CE]"
                      : "border-[#E2E8F0] bg-white text-[#1A202C] hover:border-[#3182CE]/50 hover:bg-[#F9FAFB]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSelected && (
                      <div className="w-6 h-6 bg-[#3182CE] rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="rounded-full border-[#E2E8F0] disabled:opacity-50 disabled:cursor-not-allowed px-6"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentQuestion
                    ? "bg-[#3182CE] w-8"
                    : answers[questions[index].id] !== undefined
                    ? "bg-[#3182CE]/50"
                    : "bg-[#E2E8F0]"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={answers[currentQ.id] === undefined}
            className="rounded-full bg-[#3182CE] hover:bg-[#2C5AA0] text-white disabled:opacity-50 disabled:cursor-not-allowed px-6"
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-[#64748B] mt-8">
          Answer honestly for the most accurate results. There are no right or wrong answers.
        </p>
      </main>

      <MobileBottomNav />
    </div>
  );
}