import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

interface AIMarkdownMessageProps {
  content: string;
}

export const AIMarkdownMessage: React.FC<AIMarkdownMessageProps> = ({ content }) => {
  return (
    <div className="tyc-markdown text-xs sm:text-[13px] leading-relaxed space-y-3 font-normal text-slate-800 dark:text-slate-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-3 mb-1 tracking-tight border-b border-slate-200 dark:border-slate-800 pb-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-3 mb-1 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-2 mb-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-2 mb-0.5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-1.5 leading-relaxed text-slate-800 dark:text-slate-200">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-950 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-700 dark:text-slate-300">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="my-2 pl-4 list-disc space-y-1 marker:text-emerald-600 dark:marker:text-emerald-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 pl-4 list-decimal space-y-1 marker:text-emerald-600 dark:marker:text-emerald-400 font-semibold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed text-slate-800 dark:text-slate-200 font-normal">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-r-lg text-slate-700 dark:text-slate-300 italic text-[12px]">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white/50 dark:bg-slate-900/40">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-bold text-slate-900 dark:text-white">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-slate-800 dark:text-slate-300">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 dark:text-emerald-400 font-medium underline hover:text-emerald-500 transition-colors"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return <CodeBlock language={match ? match[1] : ''} code={String(children).replace(/\n$/, '')} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2.5 rounded-xl bg-[#090D16] border border-slate-800 overflow-hidden shadow-md text-left font-mono text-[11px]">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0e1424] border-b border-slate-800 text-slate-400 text-[10px]">
        <span className="font-semibold uppercase tracking-wider text-slate-300">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto text-slate-100 leading-relaxed selection:bg-emerald-500 selection:text-black">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
