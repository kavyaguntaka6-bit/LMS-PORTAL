import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  BrainCircuit
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  hint?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_1',
    topic: 'System Design',
    question: 'What is the CAP Theorem in distributed databases?',
    answer: 'The CAP theorem states that a distributed data store can only simultaneously provide at most two out of three guarantees: Consistency (every read gets the latest write), Availability (every request receives a non-error response), and Partition Tolerance (the system continues to operate despite network partitions).',
    hint: 'Consistency, Availability, Partition Tolerance',
    difficulty: 'Intermediate',
  },
  {
    id: 'fc_2',
    topic: 'Data Structures',
    question: 'What is the amortized time complexity of inserting into a Dynamic Array (e.g. Python list / C++ std::vector)?',
    answer: 'Amortized O(1). While an occasional resize operation requires O(N) work to allocate a new buffer and copy elements, doubling the array capacity ensures that resize happens exponentially less frequently, averaging out to constant O(1) time per append.',
    hint: 'Capacity doubling strategy',
    difficulty: 'Beginner',
  },
  {
    id: 'fc_3',
    topic: 'Web Engineering',
    question: 'How does React 19 Server Components (RSC) differ from traditional Client-Side Rendering (CSR)?',
    answer: 'React Server Components execute exclusively on the server at build or request time, shipping zero JavaScript bundle overhead to the client for those components. This enables direct access to backend resources (databases, filesystem) with optimal initial page load performance and SEO.',
    hint: 'Zero client bundle footprint',
    difficulty: 'Advanced',
  },
  {
    id: 'fc_4',
    topic: 'Databases & SQL',
    question: 'What is the key difference between Clustered and Non-Clustered Indexes in SQL?',
    answer: 'A Clustered Index physically determines the storage order of rows in the table (there can only be one per table, typically the Primary Key). A Non-Clustered Index is a separate B-tree structure with pointers to the physical data rows (a table can have multiple non-clustered indexes).',
    hint: 'Physical row ordering vs. pointer references',
    difficulty: 'Intermediate',
  },
  {
    id: 'fc_5',
    topic: 'Computer Networks',
    question: 'What are the 3 steps of the TCP Three-Way Handshake?',
    answer: '1. SYN: Client sends SYN packet with Initial Sequence Number (ISN).\n2. SYN-ACK: Server responds with SYN and acknowledges client sequence number (ACK).\n3. ACK: Client sends ACK confirming server sequence number. Connection is now ESTABLISHED.',
    hint: 'SYN -> SYN-ACK -> ACK',
    difficulty: 'Beginner',
  },
  {
    id: 'fc_6',
    topic: 'Security & Auth',
    question: 'What is the security risk of storing JWT access tokens in localStorage?',
    answer: 'Tokens stored in localStorage are vulnerable to Cross-Site Scripting (XSS) attacks. If an attacker injects malicious JavaScript, they can access window.localStorage and steal the token. Best practice is using HttpOnly, Secure, SameSite cookies for sensitive session tokens.',
    hint: 'Vulnerability to XSS injection',
    difficulty: 'Intermediate',
  },
];

interface FlashcardDeckProps {
  cards?: Flashcard[];
  onClose?: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards = DEFAULT_FLASHCARDS,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [learningCards, setLearningCards] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  const handleNext = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleMarkMastered = () => {
    setKnownCards((prev) => new Set(prev).add(currentCard.id));
    setLearningCards((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const handleMarkLearning = () => {
    setLearningCards((prev) => new Set(prev).add(currentCard.id));
    setKnownCards((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
    handleNext();
  };

  const isMastered = knownCards.has(currentCard.id);
  const isLearning = learningCards.has(currentCard.id);

  const topicThemes: Record<
    string,
    {
      bg: string;
      border: string;
      flippedBg: string;
      flippedBorder: string;
      badge: 'cyan' | 'green' | 'purple' | 'orange' | 'indigo' | 'rose' | 'yellow';
      accentColor: string;
      glowColor: string;
      headerBg: string;
      headerText: string;
    }
  > = {
    'System Design': {
      bg: 'bg-gradient-to-br from-cyan-50 via-sky-50/70 to-blue-50 dark:from-cyan-950/40 dark:via-[#0F172A] dark:to-blue-950/40',
      border: 'border-cyan-300 dark:border-cyan-500/40 hover:border-cyan-400 shadow-[0_8px_30px_rgba(6,182,212,0.12)]',
      flippedBg: 'bg-gradient-to-br from-cyan-100 via-sky-50 to-white dark:from-cyan-900/60 dark:via-[#0F172A] dark:to-[#0F172A]',
      flippedBorder: 'border-cyan-400 dark:border-cyan-400 shadow-[0_12px_35px_rgba(6,182,212,0.2)]',
      badge: 'cyan',
      accentColor: 'text-cyan-700 dark:text-cyan-300',
      glowColor: 'bg-cyan-500/20',
      headerBg: 'bg-cyan-100/80 dark:bg-cyan-950/70 border-cyan-200 dark:border-cyan-800',
      headerText: 'text-cyan-800 dark:text-cyan-200'
    },
    'Data Structures': {
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/70 to-green-50 dark:from-emerald-950/40 dark:via-[#0F172A] dark:to-teal-950/40',
      border: 'border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-400 shadow-[0_8px_30px_rgba(16,185,129,0.12)]',
      flippedBg: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-white dark:from-emerald-900/60 dark:via-[#0F172A] dark:to-[#0F172A]',
      flippedBorder: 'border-emerald-400 dark:border-emerald-400 shadow-[0_12px_35px_rgba(16,185,129,0.2)]',
      badge: 'green',
      accentColor: 'text-emerald-700 dark:text-emerald-300',
      glowColor: 'bg-emerald-500/20',
      headerBg: 'bg-emerald-100/80 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800',
      headerText: 'text-emerald-800 dark:text-emerald-200'
    },
    'Web Engineering': {
      bg: 'bg-gradient-to-br from-purple-50 via-fuchsia-50/70 to-indigo-50 dark:from-purple-950/40 dark:via-[#0F172A] dark:to-indigo-950/40',
      border: 'border-purple-300 dark:border-purple-500/40 hover:border-purple-400 shadow-[0_8px_30px_rgba(168,85,247,0.12)]',
      flippedBg: 'bg-gradient-to-br from-purple-100 via-fuchsia-50 to-white dark:from-purple-900/60 dark:via-[#0F172A] dark:to-[#0F172A]',
      flippedBorder: 'border-purple-400 dark:border-purple-400 shadow-[0_12px_35px_rgba(168,85,247,0.2)]',
      badge: 'purple',
      accentColor: 'text-purple-700 dark:text-purple-300',
      glowColor: 'bg-purple-500/20',
      headerBg: 'bg-purple-100/80 dark:bg-purple-950/70 border-purple-200 dark:border-purple-800',
      headerText: 'text-purple-800 dark:text-purple-200'
    },
    'Databases & SQL': {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50/70 to-yellow-50 dark:from-amber-950/40 dark:via-[#0F172A] dark:to-orange-950/40',
      border: 'border-amber-300 dark:border-amber-500/40 hover:border-amber-400 shadow-[0_8px_30px_rgba(245,158,11,0.12)]',
      flippedBg: 'bg-gradient-to-br from-amber-100 via-orange-50 to-white dark:from-amber-900/60 dark:via-[#0F172A] dark:to-[#0F172A]',
      flippedBorder: 'border-amber-400 dark:border-amber-400 shadow-[0_12px_35px_rgba(245,158,11,0.2)]',
      badge: 'orange',
      accentColor: 'text-amber-700 dark:text-amber-300',
      glowColor: 'bg-amber-500/20',
      headerBg: 'bg-amber-100/80 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800',
      headerText: 'text-amber-800 dark:text-amber-200'
    },
    'Computer Networks': {
      bg: 'bg-gradient-to-br from-blue-50 via-indigo-50/70 to-sky-50 dark:from-blue-950/40 dark:via-[#0F172A] dark:to-indigo-950/40',
      border: 'border-blue-300 dark:border-blue-500/40 hover:border-blue-400 shadow-[0_8px_30px_rgba(59,130,246,0.12)]',
      flippedBg: 'bg-gradient-to-br from-blue-100 via-indigo-50 to-white dark:from-blue-900/60 dark:via-[#0F172A] dark:to-[#0F172A]',
      flippedBorder: 'border-blue-400 dark:border-blue-400 shadow-[0_12px_35px_rgba(59,130,246,0.2)]',
      badge: 'indigo',
      accentColor: 'text-blue-700 dark:text-blue-300',
      glowColor: 'bg-blue-500/20',
      headerBg: 'bg-blue-100/80 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800',
      headerText: 'text-blue-800 dark:text-blue-200'
    },
    'Security & Auth': {
      bg: 'bg-gradient-to-br from-rose-50 via-red-50/70 to-pink-50 dark:from-rose-950/40 dark:via-[#0F172A] dark:to-pink-950/40',
      border: 'border-rose-300 dark:border-rose-500/40 hover:border-rose-400 shadow-[0_8px_30px_rgba(244,63,94,0.12)]',
      flippedBg: 'bg-gradient-to-br from-rose-100 via-red-50 to-white dark:from-rose-900/60 dark:via-[#0F172A] dark:to-[#0F172A]',
      flippedBorder: 'border-rose-400 dark:border-rose-400 shadow-[0_12px_35px_rgba(244,63,94,0.2)]',
      badge: 'rose',
      accentColor: 'text-rose-700 dark:text-rose-300',
      glowColor: 'bg-rose-500/20',
      headerBg: 'bg-rose-100/80 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800',
      headerText: 'text-rose-800 dark:text-rose-200'
    }
  };

  const currentTheme = topicThemes[currentCard.topic] || {
    bg: 'bg-gradient-to-br from-emerald-50 via-teal-50/70 to-green-50 dark:from-emerald-950/40 dark:via-[#0F172A] dark:to-teal-950/40',
    border: 'border-emerald-300 dark:border-emerald-500/40 hover:border-emerald-400 shadow-md',
    flippedBg: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-white dark:from-emerald-900/60 dark:via-[#0F172A] dark:to-[#0F172A]',
    flippedBorder: 'border-emerald-400 dark:border-emerald-400 shadow-lg',
    badge: 'green',
    accentColor: 'text-emerald-700 dark:text-emerald-300',
    glowColor: 'bg-emerald-500/20',
    headerBg: 'bg-emerald-100/80 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800',
    headerText: 'text-emerald-800 dark:text-emerald-200'
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0D121F] border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 shadow-sm">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>CS & Systems Flashcards</span>
              <Badge variant="green" size="sm">Active Deck</Badge>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Card {currentIndex + 1} of {cards.length} • {knownCards.size} Mastered
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-40 space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
            <span>Progress</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative min-h-[300px] sm:min-h-[340px] w-full cursor-pointer perspective-1000 select-none group"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentCard.id}_${isFlipped}`}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className={`w-full min-h-[320px] sm:min-h-[350px] p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
              isFlipped
                ? `${currentTheme.flippedBg} ${currentTheme.flippedBorder}`
                : `${currentTheme.bg} ${currentTheme.border}`
            }`}
          >
            {/* Ambient Corner Glow Orb */}
            <div
              className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
                isFlipped ? 'bg-emerald-500/25 dark:bg-emerald-500/20' : currentTheme.glowColor
              }`}
            />

            {/* Top Card Meta */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Badge variant={currentTheme.badge} size="sm">{currentCard.topic}</Badge>
                <Badge
                  variant={
                    currentCard.difficulty === 'Beginner'
                      ? 'green'
                      : currentCard.difficulty === 'Intermediate'
                      ? 'orange'
                      : 'purple'
                  }
                  size="sm"
                >
                  {currentCard.difficulty}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-slate-600 dark:text-slate-300" />
                <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">
                  {isFlipped ? 'Click to see Question' : 'Click to Reveal Answer'}
                </span>
              </div>
            </div>

            {/* Middle Question / Answer Content */}
            <div className="my-6 space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-xs transition-colors">
                {isFlipped ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Answer & Explanation</span>
                  </span>
                ) : (
                  <span className={`flex items-center gap-1.5 ${currentTheme.accentColor}`}>
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Concept Question</span>
                  </span>
                )}
              </div>

              <h4 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {isFlipped ? currentCard.answer : currentCard.question}
              </h4>

              {!isFlipped && showHint && currentCard.hint && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-amber-100/80 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 shadow-xs"
                >
                  💡 <strong>Hint:</strong> {currentCard.hint}
                </motion.div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 relative z-10">
              <div className="flex items-center gap-2">
                {isMastered && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                  </span>
                )}
                {isLearning && (
                  <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400 font-bold bg-orange-100/80 dark:bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-300 dark:border-orange-800">
                    <Sparkles className="w-3.5 h-3.5" /> Reviewing
                  </span>
                )}
              </div>

              {!isFlipped && currentCard.hint && !showHint && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHint(true);
                  }}
                  className="text-xs font-bold text-[#10B981] hover:underline cursor-pointer"
                >
                  Show Hint
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interaction & Mastery Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous / Next buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>

        {/* Learning Assessment Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleMarkLearning}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-white dark:bg-[#0D121F] border border-orange-200 dark:border-orange-800/80 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-orange-500" />
            <span>Still Learning</span>
          </button>

          <button
            type="button"
            onClick={handleMarkMastered}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mastered</span>
          </button>
        </div>
      </div>
    </div>
  );
};
