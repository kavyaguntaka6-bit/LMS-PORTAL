import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLMS } from '../../context/LMSContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { courseService } from '../../services/api';
import { Course, Lesson, CourseModule } from '../../types';
import {
  Play,
  Pause,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Download,
  Sparkles,
  MessageSquare,
  Bookmark,
  Share2,
  Volume2,
  Maximize,
  HelpCircle,
  Code2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { ProgressBar } from '../../components/shared/ProgressBar';
import { LoadingState } from '../../components/shared/LoadingState';

export const LessonPlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user } = useAuth();
  const { toggleLessonComplete, triggerCelebration, setIsAiTutorOpen, setAiContext } = useLMS();
  const { toast } = useNotifications();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'practice' | 'ai' | 'discussion'>('notes');
  const [notes, setNotes] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (courseId) {
      courseService.getCourseById(courseId).then((c) => {
        setCourse(c);
        if (c) {
          // Find target lesson or default to first
          let found: Lesson | null = null;
          for (const mod of c.modules) {
            const l = mod.lessons.find((les) => les.id === lessonId);
            if (l) {
              found = l;
              break;
            }
          }
          if (!found && c.modules.length > 0 && c.modules[0].lessons.length > 0) {
            found = c.modules[0].lessons[0];
          }
          setCurrentLesson(found);
          if (found) {
            setAiContext({
              courseTitle: c.title,
              lessonTitle: found.title
            });
          }
        }
      });
    }
  }, [courseId, lessonId, setAiContext]);

  // Load saved notes for this lesson
  useEffect(() => {
    if (currentLesson) {
      const saved = localStorage.getItem(`tyc_notes_${currentLesson.id}`);
      setNotes(saved || `# Notes: ${currentLesson.title}\n\n- Key concepts:\n- Architectural takeaways:\n- Follow up questions:`);
    }
  }, [currentLesson]);

  const handleSaveNotes = (val: string) => {
    setNotes(val);
    if (currentLesson) {
      localStorage.setItem(`tyc_notes_${currentLesson.id}`, val);
    }
  };

  if (!course || !currentLesson) {
    return <LoadingState message="Loading high-definition lesson stream..." />;
  }

  // Calculate progress
  const allLessons: Lesson[] = course.modules.flatMap(m => m.lessons);
  const completedCount = allLessons.filter(l => user?.completedLessonIds.includes(l.id)).length;
  const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const isCurrentCompleted = user?.completedLessonIds.includes(currentLesson.id);

  // Next / Previous navigation
  const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleToggleComplete = async () => {
    const completed = await toggleLessonComplete(course.id, currentLesson.id);
    if (completed) {
      triggerCelebration();
      if (nextLesson) {
        navigate(`/learn/${course.slug || course.id}/${nextLesson.id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-tyc-bg text-tyc-text flex flex-col">
      {/* Top Learning Navigation Bar */}
      <header className="bg-white border-b border-tyc-border px-4 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/courses/${course.slug || course.id}`}
              className="p-1.5 rounded-lg border border-tyc-border hover:bg-tyc-bg text-tyc-muted hover:text-tyc-text transition-colors"
              title="Return to Course Overview"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="text-xs font-bold text-tyc-text truncate max-w-[200px] sm:max-w-md">
                {course.title}
              </h2>
              <span className="text-[11px] text-tyc-muted">{currentLesson.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-tyc-muted">Course Progress:</span>
              <span className="font-bold text-tyc-green">{progressPercent}%</span>
              <div className="w-24">
                <ProgressBar progress={progressPercent} color="green" size="xs" />
              </div>
            </div>

            <Button
              variant={isCurrentCompleted ? 'outline' : 'primary'}
              size="sm"
              onClick={handleToggleComplete}
              className="text-xs shrink-0"
            >
              {isCurrentCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-tyc-green" /> Completed
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Complete
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Responsive Grid Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Video / Content Player & Lower Tab Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Custom Video Player / Interactive Simulator */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-modal aspect-[16/9] relative group flex flex-col justify-between p-4">
            {/* Top Overlay controls */}
            <div className="flex items-center justify-between text-white/90 text-xs">
              <span className="bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm">
                1080p HD &bull; Subtitles (EN)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast('Bookmark saved', 'Timestamp added to your saved notes.', 'system')}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 backdrop-blur-sm"
                  title="Bookmark timestamp"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Play Button Simulator */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-white/95 text-tyc-green flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-tyc-green" /> : <Play className="w-7 h-7 fill-tyc-green ml-1" />}
              </button>
            </div>

            {/* Bottom Playback bar */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between gap-4 text-white text-xs">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <Volume2 className="w-4 h-4 text-gray-300" />
                <span className="text-[11px] text-gray-300">08:42 / {currentLesson.durationMinutes}:00</span>
              </div>

              <div className="flex-1 max-w-md mx-4">
                <div className="h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-tyc-green w-1/3" />
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="px-1.5 py-0.5 bg-gray-700 rounded font-semibold cursor-pointer">1.0x</span>
                <Maximize className="w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Navigation Between Lessons */}
          <div className="flex items-center justify-between bg-white border border-tyc-border p-3.5 rounded-xl shadow-subtle">
            <Button
              variant="outline"
              size="sm"
              disabled={!prevLesson}
              onClick={() => prevLesson && navigate(`/learn/${course.slug || course.id}/${prevLesson.id}`)}
              className="text-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Previous Lesson
            </Button>

            <span className="text-xs font-semibold text-tyc-text text-center truncate max-w-xs">
              {currentLesson.title}
            </span>

            <Button
              variant="primary"
              size="sm"
              disabled={!nextLesson}
              onClick={() => nextLesson && navigate(`/learn/${course.slug || course.id}/${nextLesson.id}`)}
              className="text-xs"
            >
              Next Lesson
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>

          {/* Lower Tabs Panel */}
          <div className="bg-white border border-tyc-border rounded-xl shadow-subtle overflow-hidden">
            <div className="px-5 pt-2 border-b border-tyc-border">
              <Tabs
                tabs={[
                  { id: 'notes', label: 'My Notes', icon: <FileText className="w-3.5 h-3.5" /> },
                  { id: 'resources', label: 'Resources & Code', icon: <Download className="w-3.5 h-3.5" /> },
                  { id: 'practice', label: 'Interactive Check', icon: <Code2 className="w-3.5 h-3.5" /> },
                  { id: 'ai', label: 'AI Copilot Help', icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { id: 'discussion', label: 'Q&A Community', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                ]}
                activeTab={activeTab}
                onChange={(id) => setActiveTab(id as any)}
              />
            </div>

            <div className="p-6">
              {/* TAB 1: NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-tyc-muted">
                    <span>Notes automatically sync to your cloud profile</span>
                    <span className="text-tyc-green font-semibold">Auto-saved</span>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => handleSaveNotes(e.target.value)}
                    rows={8}
                    className="w-full text-xs font-mono bg-tyc-bg border border-tyc-border rounded-xl p-4 text-tyc-text focus:outline-none focus:border-tyc-green"
                    placeholder="Write key notes, code snippets, or thoughts here..."
                  />
                </div>
              )}

              {/* TAB 2: RESOURCES */}
              {activeTab === 'resources' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-tyc-text uppercase tracking-wider">
                    Lesson Starter Assets & Reference Material
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-tyc-bg border border-tyc-border rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-tyc-green" />
                        <div>
                          <div className="font-semibold text-tyc-text">React 19 Architecture Cheatsheet.pdf</div>
                          <div className="text-[11px] text-tyc-muted">1.4 MB &bull; Verified by Dr. Sarah Chen</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">Download</Button>
                    </div>

                    <div className="p-3 bg-tyc-bg border border-tyc-border rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <Code2 className="w-4 h-4 text-tyc-orange" />
                        <div>
                          <div className="font-semibold text-tyc-text">GitHub Starter Code Repository</div>
                          <div className="text-[11px] text-tyc-muted">Branch: module-1-lesson-2</div>
                        </div>
                      </div>
                      <a href="https://github.com" target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm" className="text-xs">Open Repo</Button>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRACTICE */}
              {activeTab === 'practice' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-tyc-text uppercase tracking-wider">
                      Module Quick Check Quiz
                    </h4>
                    <Badge variant="orange" size="sm">50 XP Reward</Badge>
                  </div>

                  <div className="p-4 bg-tyc-bg border border-tyc-border rounded-xl space-y-3">
                    <p className="text-xs font-semibold text-tyc-text">
                      Which React 19 hook allows optimistic UI updates before async server actions complete?
                    </p>

                    <div className="space-y-2">
                      {[
                        'useOptimistic(state, updateFn)',
                        'useActionState(fn, initial)',
                        'useTransition()',
                        'useDeferredValue()'
                      ].map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (!quizSubmitted) setQuizSelectedOption(i);
                          }}
                          className={`w-full p-3 rounded-lg text-left text-xs font-medium border transition-all ${
                            quizSelectedOption === i
                              ? 'border-tyc-green bg-tyc-green-soft text-tyc-green font-bold'
                              : 'border-tyc-border bg-white text-tyc-text hover:bg-gray-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {!quizSubmitted ? (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={quizSelectedOption === null}
                        onClick={() => {
                          setQuizSubmitted(true);
                          if (quizSelectedOption === 0) {
                            triggerCelebration();
                            toast('Correct Answer!', '+50 XP added to your profile.', 'quiz');
                          }
                        }}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <div className="p-3 bg-tyc-green-soft border border-tyc-green/30 rounded-lg text-xs space-y-1">
                        <span className="font-bold text-tyc-green">✓ Correct!</span>
                        <p className="text-[11px] text-tyc-muted">
                          useOptimistic gives instant optimistic feedback to the user while async mutations settle.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: AI COPILOT */}
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <div className="p-4 bg-tyc-green-soft/40 border border-tyc-green/30 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-tyc-green">
                      <Sparkles className="w-4 h-4" />
                      <span>Contextual Copilot for &ldquo;{currentLesson.title}&rdquo;</span>
                    </div>
                    <p className="text-xs text-tyc-muted">
                      Ask any question about this exact video timestamp or code example.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setIsAiTutorOpen(true)}
                        className="text-xs"
                      >
                        Launch Interactive AI Tutor Drawer
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DISCUSSION */}
              {activeTab === 'discussion' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-tyc-text uppercase tracking-wider">
                      Student & Instructor Q&A
                    </h4>
                    <span className="text-xs text-tyc-muted">2 Answers</span>
                  </div>

                  <div className="p-4 bg-tyc-bg border border-tyc-border rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-tyc-text">Rohan Mehta:</strong>
                      <span className="text-[10px] text-tyc-muted">2 hours ago</span>
                    </div>
                    <p className="text-xs text-tyc-muted">
                      Does useActionState automatically handle form resets if the server throws an error?
                    </p>
                    <div className="pt-2 border-t border-tyc-border text-xs text-tyc-text pl-3 border-l-2 border-tyc-green">
                      <strong className="text-tyc-green">Dr. Sarah Chen:</strong> No, you can handle form reset inside the action state transition callback or conditionally set default form values.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Curriculum Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white border border-tyc-border rounded-xl p-4 shadow-subtle space-y-3">
            <div className="flex items-center justify-between border-b border-tyc-border pb-2">
              <h3 className="text-xs font-bold text-tyc-text uppercase tracking-wider">
                Curriculum
              </h3>
              <span className="text-xs text-tyc-green font-semibold">{progressPercent}%</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[70vh]">
              {course.modules.map((mod) => (
                <div key={mod.id} className="space-y-1">
                  <div className="text-[11px] font-bold text-tyc-muted uppercase tracking-wider px-1 py-1">
                    {mod.title}
                  </div>

                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isSelected = les.id === currentLesson.id;
                      const isDone = user?.completedLessonIds.includes(les.id);
                      return (
                        <Link
                          key={les.id}
                          to={`/learn/${course.slug || course.id}/${les.id}`}
                          className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors ${
                            isSelected
                              ? 'bg-tyc-green-soft text-tyc-green font-bold border border-tyc-green/30'
                              : 'text-tyc-text hover:bg-tyc-bg'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isDone ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-tyc-green shrink-0" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-tyc-muted shrink-0" />
                            )}
                            <span className="truncate">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-tyc-muted shrink-0">{les.durationMinutes}m</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
