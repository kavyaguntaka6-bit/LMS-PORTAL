import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLMS } from '../../context/LMSContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/shared/ProgressBar';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  Clock,
  GraduationCap,
  Briefcase,
  Compass,
  Code2,
  Check
} from 'lucide-react';
import { StudentOnboardingData } from '../../types';

export const OnboardingPage: React.FC = () => {
  const { completeOnboarding } = useAuth();
  const { triggerCelebration, enrollCourse } = useLMS();
  const { toast } = useNotifications();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StudentOnboardingData>({
    name: 'Alex Rivera',
    educationLevel: 'Bachelor of Computer Science (3rd Year)',
    careerGoal: 'Full Stack AI Developer',
    experienceLevel: 'Intermediate',
    currentSkills: ['React', 'JavaScript', 'Python Basics'],
    areasOfInterest: ['Generative AI', 'Full Stack', 'Cloud & Systems'],
    weeklyHours: 15
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const careerGoalOptions = [
    { title: 'Full Stack AI Developer', desc: 'React 19, TypeScript, Python FastAPI, LLM APIs & Vector DBs', icon: <Layers className="w-5 h-5" /> },
    { title: 'AI & ML Engineer', desc: 'PyTorch, Neural Networks, MLOps, RAG Architecture', icon: <Sparkles className="w-5 h-5" /> },
    { title: 'Cloud & DevOps Engineer', desc: 'Docker, Kubernetes, Terraform, AWS, Microservices', icon: <Briefcase className="w-5 h-5" /> },
    { title: 'Data Scientist & Analyst', desc: 'SQL, Pandas, Statistical Modeling, Tableau', icon: <Code2 className="w-5 h-5" /> },
  ];

  const skillOptions = [
    'HTML/CSS', 'JavaScript (ES6+)', 'TypeScript', 'React', 'Node.js',
    'Python', 'SQL & Databases', 'Git & GitHub', 'Docker Basics', 'Data Structures'
  ];

  const toggleSkill = (sk: string) => {
    setFormData(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.includes(sk)
        ? prev.currentSkills.filter(s => s !== sk)
        : [...prev.currentSkills, sk]
    }));
  };

  const handleNext = () => {
    if (step === 3) {
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setStep(4);
        triggerCelebration();
      }, 1200);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleFinish = async () => {
    await completeOnboarding(formData);
    await enrollCourse('crs_1'); // Automatically enroll into the foundational recommended course
    toast('Roadmap Activated!', 'Your personalized curriculum is ready on your dashboard.', 'course');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-tyc-bg">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        {/* Step Progress Bar */}
        <div className="bg-white border border-tyc-border rounded-xl p-4 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-tyc-text">Step {step} of 4: {step === 1 ? 'Academic Background' : step === 2 ? 'Target Career Goal' : step === 3 ? 'Skills & Availability' : 'Your Custom Roadmap'}</span>
            <span className="text-tyc-green">{step * 25}% Completed</span>
          </div>
          <ProgressBar progress={step * 25} color="green" size="sm" />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <Card className="shadow-modal space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-tyc-green-soft text-tyc-green flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-tyc-text">Tell us about your background</h2>
              <p className="text-xs text-tyc-muted mt-1">This helps TYC calibrate practice difficulty and pace.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-tyc-text mb-1.5">Education / Current Status</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                  className="w-full bg-white border border-tyc-border rounded-lg text-xs p-2.5 text-tyc-text focus:border-tyc-green focus:outline-none"
                >
                  <option>Bachelor of Computer Science (3rd Year)</option>
                  <option>Engineering Student (1st/2nd Year)</option>
                  <option>Recent Graduate / Final Year</option>
                  <option>Self-Taught Developer</option>
                  <option>Working Professional Transitioning to Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-tyc-text mb-1.5">Current Coding Experience</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Beginner (0-6 months)', 'Intermediate (1-2 years)', 'Advanced (2+ years)', 'Industry Professional'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, experienceLevel: lvl.split(' ')[0] as any })}
                      className={`p-3 rounded-lg border text-left text-xs transition-all ${
                        formData.experienceLevel === lvl.split(' ')[0]
                          ? 'border-tyc-green bg-tyc-green-soft text-tyc-green font-semibold'
                          : 'border-tyc-border bg-white text-tyc-text hover:bg-tyc-bg'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-tyc-border">
              <Button variant="primary" size="md" onClick={handleNext}>
                Continue to Goal
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Card className="shadow-modal space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-tyc-orange-soft text-tyc-orange flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-tyc-text">What is your primary career target?</h2>
              <p className="text-xs text-tyc-muted mt-1">We will construct your end-to-end learning roadmap toward this role.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {careerGoalOptions.map((goal) => (
                <div
                  key={goal.title}
                  onClick={() => setFormData({ ...formData, careerGoal: goal.title })}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.careerGoal === goal.title
                      ? 'border-tyc-green bg-tyc-green-soft/40 shadow-sm ring-1 ring-tyc-green'
                      : 'border-tyc-border bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-white border border-tyc-border text-tyc-text">
                      {goal.icon}
                    </div>
                    {formData.careerGoal === goal.title && (
                      <CheckCircle2 className="w-4 h-4 text-tyc-green" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-tyc-text">{goal.title}</h4>
                  <p className="text-[11px] text-tyc-muted mt-1 leading-normal">{goal.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t border-tyc-border">
              <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button variant="primary" size="md" onClick={handleNext}>
                Continue to Skills
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Card className="shadow-modal space-y-6">
            <div>
              <div className="w-10 h-10 rounded-xl bg-tyc-green-soft text-tyc-green flex items-center justify-center mb-3">
                <Code2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-tyc-text">Current Skills & Weekly Commitment</h2>
              <p className="text-xs text-tyc-muted mt-1">Select technologies you have touched before, and your study availability.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-tyc-text mb-2">Select your existing skills</label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((sk) => {
                    const selected = formData.currentSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleSkill(sk)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          selected
                            ? 'bg-tyc-green text-white border-tyc-green shadow-sm'
                            : 'bg-white text-tyc-text border-tyc-border hover:bg-tyc-bg'
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5" />}
                        <span>{sk}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-tyc-text mb-2">
                  <span>Weekly Dedicated Learning Availability</span>
                  <span className="font-bold text-tyc-green">{formData.weeklyHours} Hours / Week</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="35"
                  step="5"
                  value={formData.weeklyHours}
                  onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                  className="w-full accent-tyc-green cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-tyc-muted mt-1">
                  <span>5 hrs (Casual)</span>
                  <span>15 hrs (Recommended)</span>
                  <span>35 hrs (Full-time Intensive)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-tyc-border">
              <Button variant="ghost" size="md" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button variant="primary" size="md" onClick={handleNext} isLoading={isGenerating}>
                Generate My Roadmap
                <Sparkles className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 4: GENERATED ROADMAP */}
        {step === 4 && (
          <Card className="shadow-modal space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2 pb-4 border-b border-tyc-border">
              <div className="w-12 h-12 rounded-2xl bg-tyc-green text-white flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-tyc-text">
                Your Personalized TYC Learning Roadmap
              </h2>
              <p className="text-xs text-tyc-muted max-w-md mx-auto">
                Engineered for <strong className="text-tyc-text">{formData.careerGoal}</strong> based on {formData.weeklyHours} hrs/week pace.
              </p>
            </div>

            {/* Visual Milestones */}
            <div className="space-y-3">
              <div className="p-4 bg-tyc-green-soft/40 border border-tyc-green/30 rounded-xl flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="green" size="sm">Recommended Starting Point</Badge>
                    <span className="text-[11px] text-tyc-muted">Phase 1</span>
                  </div>
                  <h4 className="text-sm font-bold text-tyc-text">Full Stack React 19 & TypeScript Architecture</h4>
                  <p className="text-xs text-tyc-muted">Covers component architecture, strict typing, and accessible design systems.</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-tyc-green shrink-0 mt-1" />
              </div>

              <div className="p-4 bg-white border border-tyc-border rounded-xl flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-tyc-muted font-semibold">Phase 2 &bull; Month 2</span>
                  <h4 className="text-xs font-bold text-tyc-text">Python Backend Systems & FastAPI APIs</h4>
                  <p className="text-xs text-tyc-muted">High throughput asynchronous REST APIs and PostgreSQL modeling.</p>
                </div>
                <Badge variant="gray" size="sm">Next</Badge>
              </div>

              <div className="p-4 bg-white border border-tyc-border rounded-xl flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] text-tyc-muted font-semibold">Phase 3 &bull; Month 3-4</span>
                  <h4 className="text-xs font-bold text-tyc-text">Generative AI & LLM Application Engineering</h4>
                  <p className="text-xs text-tyc-muted">RAG pipelines, Vector databases, and autonomous AI agents.</p>
                </div>
                <Badge variant="gray" size="sm">Upcoming</Badge>
              </div>

              <div className="p-4 bg-tyc-orange-soft/40 border border-tyc-orange/30 rounded-xl flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <Badge variant="orange" size="sm">Career Capstone</Badge>
                  <h4 className="text-xs font-bold text-tyc-text">Verified Recruiter Portfolio & Job Fast-Track</h4>
                  <p className="text-xs text-tyc-muted">3 verified industry capstones + direct hiring partner interviews.</p>
                </div>
                <Sparkles className="w-5 h-5 text-tyc-orange shrink-0 mt-1" />
              </div>
            </div>

            <div className="pt-4 border-t border-tyc-border">
              <Button variant="primary" size="lg" className="w-full shadow-md" onClick={handleFinish}>
                Activate Roadmap & Enter Student Dashboard
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
