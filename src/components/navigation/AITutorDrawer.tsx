import React, { useState, useRef, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { AIMessage, AITutorMode } from '../../types';
import { aiTutorService } from '../../services/api';
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
  Copy,
  Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

export const AITutorDrawer: React.FC = () => {
  const { isAiTutorOpen, setIsAiTutorOpen, aiContext } = useLMS();
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      content: "Hello! I'm your TYC AI Learning Copilot. How can I help you master this concept today? You can ask for simplified explanations, code debugging, real-world examples, or mock interview questions.",
      timestamp: 'Just now',
      suggestedFollowUps: ['Explain this concept simply', 'Give me a real-world code example', 'Quiz me on this topic', 'Help me debug an error']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeMode, setActiveMode] = useState<AITutorMode>('Explain');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiTutorOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiTutorOpen]);

  if (!isAiTutorOpen) return null;

  const modes: { key: AITutorMode; label: string; icon: React.ReactNode }[] = [
    { key: 'Explain', label: 'Explain', icon: <BookOpen className="w-3 h-3" /> },
    { key: 'Socratic', label: 'Socratic', icon: <HelpCircle className="w-3 h-3" /> },
    { key: 'Debug', label: 'Debug Code', icon: <Bug className="w-3 h-3" /> },
    { key: 'Practice', label: 'Practice', icon: <Code2 className="w-3 h-3" /> },
    { key: 'Interview', label: 'Mock Interview', icon: <Briefcase className="w-3 h-3" /> },
    { key: 'Project Mentor', label: 'Mentor', icon: <Layers className="w-3 h-3" /> },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    const userMsg: AIMessage = {
      id: `usr_msg_${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: 'Just now',
      mode: activeMode
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await aiTutorService.askTutor(text, activeMode, aiContext);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please try again.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsAiTutorOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-tyc-border shadow-modal flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-tyc-border bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-tyc-green-soft text-tyc-green">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-tyc-text">TYC AI Learning Copilot</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-tyc-green-soft text-tyc-green font-semibold border border-tyc-green/20">
                      GPT-4o Engine
                    </span>
                  </div>
                  <p className="text-[11px] text-tyc-muted">Context-aware personalized tutor</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiTutorOpen(false)}
                className="p-1.5 rounded-lg text-tyc-muted hover:text-tyc-text hover:bg-tyc-bg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Badge */}
            {(aiContext.courseTitle || aiContext.lessonTitle) && (
              <div className="mt-3 px-3 py-1.5 bg-tyc-bg border border-tyc-border rounded-lg text-[11px] flex items-center justify-between text-tyc-muted">
                <span className="truncate">
                  Context: <strong className="text-tyc-text">{aiContext.courseTitle || 'Learning'}</strong>
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
                    'flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition-colors',
                    activeMode === m.key
                      ? 'bg-tyc-green text-white shadow-sm'
                      : 'bg-tyc-bg text-tyc-muted hover:text-tyc-text hover:bg-gray-200 border border-tyc-border'
                  )}
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAFA]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx('flex gap-3', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-tyc-green text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={clsx(
                    'max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed space-y-2.5',
                    msg.sender === 'user'
                      ? 'bg-tyc-text text-white'
                      : 'bg-white border border-tyc-border text-tyc-text shadow-subtle'
                  )}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Code snippet if present */}
                  {msg.codeSnippet && (
                    <div className="relative mt-2 rounded-lg bg-gray-900 text-gray-100 font-mono text-[11px] p-3 overflow-x-auto border border-gray-800">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-800 text-[10px] text-gray-400">
                        <span>Code Reference</span>
                        <button
                          onClick={() => copyCode(msg.codeSnippet!, msg.id)}
                          className="flex items-center gap-1 text-gray-300 hover:text-white"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre>
                        <code>{msg.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Follow-up Prompts */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 border-t border-tyc-border/60 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(p)}
                          className="text-[11px] px-2 py-1 bg-tyc-bg hover:bg-tyc-green-soft hover:text-tyc-green border border-tyc-border rounded-md text-tyc-text text-left transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-gray-200 text-tyc-text flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4 text-tyc-muted" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-tyc-green text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-tyc-border rounded-xl p-3 shadow-subtle flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tyc-green animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-tyc-green animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-tyc-green animate-bounce" style={{ animationDelay: '0.4s' }} />
                  <span className="text-[11px] text-tyc-muted ml-2">TYC AI thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 bg-white border-t border-tyc-border/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['Explain this simply', 'Give me an example', 'Quiz me', 'Give me a hint', 'Summarize'].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] px-2 py-1 bg-tyc-bg hover:bg-gray-200 border border-tyc-border rounded-full text-tyc-muted hover:text-tyc-text whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-tyc-border bg-white">
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
                className="flex-1 text-xs bg-tyc-bg border border-tyc-border rounded-lg px-3.5 py-2.5 text-tyc-text placeholder-tyc-muted/70 focus:outline-none focus:ring-2 focus:ring-tyc-green/20 focus:border-tyc-green"
              />
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!inputValue.trim() || isTyping}
                className="px-3 py-2.5 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
