import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLMS } from '../../context/LMSContext';
import { AIMessage, AITutorMode } from '../../types/index';
import { aiTutorService } from '../../services/api';
import { AIMarkdownMessage } from '../ai/AIMarkdownMessage';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  HelpCircle,
  Bug,
  BookOpen,
  Briefcase,
  Layers,
  Code2,
  Square
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AITutorSymbol } from '../shared/AITutorSymbol';
import { clsx } from 'clsx';

export const AITutorDrawer: React.FC = () => {
  const { isAiTutorOpen, setIsAiTutorOpen, aiContext } = useLMS();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      content:
        "Hi! 👋 I'm **TYC Assistant** — your AI Learning Copilot & Engineering Mentor.\n\nI can help you with:\n\n* 💡 **Learn Concepts**: Simplified explanations & analogies\n* 💻 **Debug Code**: Pinpoint errors & get working fixes\n* 🏗️ **Architecture**: System design & flow diagrams\n* 📝 **Quizzes**: Interactive topic assessments\n* 🎯 **Career**: Roadmaps & interview preparation\n* 📚 **TYC LMS**: Coding Lab, Courses & Certificates\n\nWhat would you like to explore today?",
      timestamp: 'Just now',
      suggestedFollowUps: [
        'What is TYC LMS?',
        'What courses are available?',
        'Explain React vs Angular',
        'Explain OSI model for 10 marks',
        'Write Python program for factorial',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeMode, setActiveMode] = useState<AITutorMode>('Explain');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to latest token or message
  useEffect(() => {
    if (isAiTutorOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiTutorOpen, isStreaming]);

  // Clean up streaming on unmount or drawer close
  useEffect(() => {
    if (!isAiTutorOpen && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  }, [isAiTutorOpen]);

  const modes: { key: AITutorMode; label: string; icon: React.ReactNode }[] = [
    { key: 'Explain', label: 'Explain', icon: <BookOpen className="w-3 h-3" /> },
    { key: 'Socratic', label: 'Socratic', icon: <HelpCircle className="w-3 h-3" /> },
    { key: 'Debug', label: 'Debug Code', icon: <Bug className="w-3 h-3" /> },
    { key: 'Practice', label: 'Practice', icon: <Code2 className="w-3 h-3" /> },
    { key: 'Interview', label: 'Mock Interview', icon: <Briefcase className="w-3 h-3" /> },
    { key: 'Project Mentor', label: 'Mentor', icon: <Layers className="w-3 h-3" /> },
  ];

  const handleStopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    // Abort previous stream if active
    if (isStreaming && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMsg: AIMessage = {
      id: `usr_msg_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: 'Just now',
      mode: activeMode,
    };

    const assistantMsgId = `ai_msg_${Date.now()}`;
    const initialAssistantMsg: AIMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      content: '',
      timestamp: 'Just now',
      mode: activeMode,
    };

    // Immediate UI Feedback
    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setInputValue('');
    setIsStreaming(true);

    try {
      await aiTutorService.streamTutor(
        text,
        activeMode,
        aiContext,
        [...messages, userMsg],
        {
          onChunk: (_chunk, accumulated) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId ? { ...msg, content: accumulated } : msg
              )
            );
          },
          onComplete: (finalText, followUps) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: finalText, suggestedFollowUps: followUps }
                  : msg
              )
            );
            setIsStreaming(false);
            abortControllerRef.current = null;
          },
          onError: (errMsg) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? {
                      ...msg,
                      content:
                        errMsg ||
                        "Sorry, I encountered a temporary connection issue. Please try again.",
                    }
                  : msg
              )
            );
            setIsStreaming(false);
            abortControllerRef.current = null;
          },
        },
        abortController.signal
      );
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content:
                    'Sorry, I encountered a temporary connection issue. Please try again.',
                }
              : msg
          )
        );
      }
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  if (!isAiTutorOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsAiTutorOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white dark:bg-[#0c1017] border-l border-tyc-border dark:border-slate-800 shadow-modal flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-tyc-border dark:border-slate-800 bg-white dark:bg-[#0c1017]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 p-1 border border-emerald-200 dark:border-emerald-800/80 shadow-xs flex items-center justify-center overflow-hidden">
                  <img src="/ai-copilot-robot.png" alt="AI Robot" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      TYC AI Assistant
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                      Nemotron-3 550B
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Real-Time Educational Copilot
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiTutorOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close AI Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context Badge */}
            {(aiContext.courseTitle || aiContext.lessonTitle) && (
              <div className="mt-3 px-3 py-1.5 bg-slate-50 dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="truncate">
                  Context: <strong className="text-slate-800 dark:text-slate-200">{aiContext.courseTitle || 'Learning'}</strong>
                  {aiContext.lessonTitle && ` → ${aiContext.lessonTitle}`}
                </span>
              </div>
            )}

            {/* Mode Selector */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar pb-1">
              {modes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveMode(m.key)}
                  className={clsx(
                    'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition-colors cursor-pointer',
                    activeMode === m.key
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  )}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC] dark:bg-[#070A10]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx('flex gap-3', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-slate-900 dark:bg-emerald-950/60 p-0.5 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm mt-0.5 overflow-hidden">
                    <img src="/ai-copilot-robot.png" alt="AI Robot" className="w-full h-full object-contain" />
                  </div>
                )}

                <div
                  className={clsx(
                    'max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 shadow-sm',
                    msg.sender === 'user'
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                  )}
                >
                  {msg.sender === 'assistant' ? (
                    msg.content ? (
                      <AIMarkdownMessage content={msg.content} />
                    ) : (
                      <div className="flex items-center gap-2 py-1 text-slate-400 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Thinking...</span>
                      </div>
                    )
                  ) : (
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  )}

                  {/* Follow-up Prompts */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && !isStreaming && (
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(p)}
                          className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 text-left transition-all cursor-pointer font-medium"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-white dark:bg-[#0c1017] border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['Explain this simply', 'Give me an example', 'Quiz me', 'Give me a hint', 'Summarize key points'].map(
              (prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isStreaming}
                  className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
                >
                  {prompt}
                </button>
              )
            )}
          </div>

          {/* Input Area */}
          <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1017]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Ask in ${activeMode} mode...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 text-xs sm:text-sm bg-slate-50 dark:bg-[#070A10] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStopStreaming}
                  className="p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shrink-0 cursor-pointer shadow-md flex items-center justify-center"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-white" />
                </button>
              ) : (
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={!inputValue.trim()}
                  className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 cursor-pointer transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
