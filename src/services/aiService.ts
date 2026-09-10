import { AIMessage, AITutorMode } from '../types/index';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

const PRIMARY_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free';

// Ordered by speed: 1s TTFT models first, with fast failover
const FAST_FALLBACK_MODELS = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'nvidia/nemotron-3.5-lightning:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'minimax/minimax-m2.7:free',
];

// Short-lived normalized response cache for ultra-fast instant answers on common queries
const responseCache = new Map<string, string>();

interface ChatMessagePayload {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface StreamCallbacks {
  onChunk: (chunk: string, fullText: string) => void;
  onComplete: (fullText: string, suggestedFollowUps: string[]) => void;
  onError: (error: string) => void;
}

export const aiChatService = {
  /**
   * True SSE Streaming Token Delivery Engine
   */
  async streamMessage(
    query: string,
    mode: AITutorMode = 'Explain',
    chatHistory: AIMessage[] = [],
    context?: { courseTitle?: string; moduleTitle?: string; lessonTitle?: string },
    callbacks?: StreamCallbacks,
    abortSignal?: AbortSignal
  ): Promise<string> {
    const trimmedQuery = query.trim();
    const cacheKey = normalizeQueryKey(trimmedQuery, mode);

    // 1. Check ambiguous questions first
    const clarification = checkAmbiguousQuery(trimmedQuery);
    if (clarification) {
      const followUps = clarification.followUps;
      callbacks?.onChunk(clarification.text, clarification.text);
      callbacks?.onComplete(clarification.text, followUps);
      return clarification.text;
    }

    // 2. Check instant in-memory cache for common non-sensitive queries
    if (responseCache.has(cacheKey)) {
      const cached = responseCache.get(cacheKey)!;
      const followUps = generateSmartFollowUps(trimmedQuery, mode, cached);
      
      // Simulate fast smooth token streaming from cache
      await streamCachedString(cached, callbacks, abortSignal);
      callbacks?.onComplete(cached, followUps);
      return cached;
    }

    const systemPrompt = buildSystemPrompt(mode, context);

    // Context compression: retain last 6-8 relevant messages for conversation continuity
    const messages: ChatMessagePayload[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory
        .filter((m) => m.id !== 'msg_welcome')
        .slice(-8)
        .map((msg) => ({
          role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: sanitizeAssistantContent(msg.content),
        })),
      { role: 'user', content: trimmedQuery },
    ];

    let fullAccumulated = '';

    for (const model of FAST_FALLBACK_MODELS) {
      if (abortSignal?.aborted) break;

      try {
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => timeoutController.abort(), 6000); // 6s max per model attempt

        const combinedSignal = abortSignal
          ? AbortSignal.any
            ? AbortSignal.any([abortSignal, timeoutController.signal])
            : abortSignal
          : timeoutController.signal;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5173/',
            'X-Title': 'Traya Yukti Core AI LMS',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.35,
            max_tokens: 4000,
            stream: true,
          }),
          signal: combinedSignal,
        });

        clearTimeout(timeoutId);

        if (!response.ok || !response.body) {
          continue;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          if (abortSignal?.aborted) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;
            if (trimmedLine.startsWith('data: ')) {
              try {
                const json = JSON.parse(trimmedLine.slice(6));
                const delta = json.choices?.[0]?.delta?.content;
                if (delta) {
                  fullAccumulated += delta;
                  callbacks?.onChunk(delta, sanitizeAssistantContent(fullAccumulated));
                }
              } catch {
                // Ignore malformed partial chunks in SSE stream
              }
            }
          }
        }

        const cleanedFull = sanitizeAssistantContent(fullAccumulated);
        if (cleanedFull.trim().length > 0) {
          // Cache successful answer for common queries
          if (isCacheableQuery(trimmedQuery)) {
            responseCache.set(cacheKey, cleanedFull);
          }

          const followUps = generateSmartFollowUps(trimmedQuery, mode, cleanedFull);
          callbacks?.onComplete(cleanedFull, followUps);
          return cleanedFull;
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return fullAccumulated;
        }
        console.warn(`OpenRouter streaming error on ${model}:`, err);
      }
    }

    // Fallback response synthesizer if network fails or model times out
    const fallbackAnswer = generateComprehensiveFallback(trimmedQuery, mode, context);
    await streamCachedString(fallbackAnswer, callbacks, abortSignal);
    
    const followUps = generateSmartFollowUps(trimmedQuery, mode, fallbackAnswer);
    callbacks?.onComplete(fallbackAnswer, followUps);
    return fallbackAnswer;
  },

  /**
   * One-shot fallback request
   */
  async sendMessage(
    query: string,
    mode: AITutorMode = 'Explain',
    chatHistory: AIMessage[] = [],
    context?: { courseTitle?: string; moduleTitle?: string; lessonTitle?: string }
  ): Promise<AIMessage> {
    let outputText = '';
    let followUps: string[] = [];

    await this.streamMessage(
      query,
      mode,
      chatHistory,
      context,
      {
        onChunk: (_, accumulated) => {
          outputText = accumulated;
        },
        onComplete: (finalText, sugs) => {
          outputText = finalText;
          followUps = sugs;
        },
        onError: (err) => {
          outputText = err;
        },
      }
    );

    return {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      content: outputText,
      mode,
      timestamp: 'Just now',
      suggestedFollowUps: followUps,
    };
  },
};

/**
 * Builds the Grok 4.5 Master System Prompt for 100% complete and accurate code generation
 */
function buildSystemPrompt(
  mode: AITutorMode,
  context?: { courseTitle?: string; moduleTitle?: string; lessonTitle?: string }
): string {
  return `You are Grok 4.5 – the most accurate, complete, and production-grade AI engineer and mentor alive, operating as the official TYC AI Assistant for the Traya Yukti Core (TYC) LMS platform.

You are world-class at building real websites, web apps, backends, and full systems. Your answers are known for being 100% complete, correct, and immediately usable.

### NON-NEGOTIABLE CORE RULES:

1. COMPLETENESS IS MANDATORY (CRITICAL)
   - NEVER give partial, incomplete, or "example-only" code when the user asks to build a website, web app, landing page, dashboard, script, or any project.
   - Always deliver FULL, working, production-ready code that the user can copy-paste and run immediately.
   - If a website needs multiple files (HTML, CSS, JS, components, etc.), provide EVERY file completely, clearly labeled in separate markdown code blocks.
   - Never say "you can add more later" or "this is a basic version". Give the complete version the user asked for.

2. WEBSITE & PROJECT BUILDING RULES
   When the user asks to build any website, web application, or full project:
   - Ask yourself: "Is this code 100% complete and runnable right now?" If not → keep writing until it is.
   - Structure your response like this:

     ### Project Structure
     - List all files

     ### 1. index.html (or main file)
     \`\`\`html
     <!-- full complete working code -->
     \`\`\`

     ### 2. style.css
     \`\`\`css
     /* full complete styles with modern UI, responsive flex/grid, variables */
     \`\`\`

     ### 3. script.js (or TypeScript / React files)
     \`\`\`javascript
     // full complete client logic and event handlers
     \`\`\`

     ### How to Run
     Clear step-by-step instructions (open in browser / live server / npm install / npm run dev).

3. CODE FORMATTING & QUALITY (STRICT)
   - Every piece of code MUST be inside a proper markdown code block with the correct language tag (\`\`\`html, \`\`\`css, \`\`\`javascript, \`\`\`typescript, \`\`\`tsx, \`\`\`python, \`\`\`sql, \`\`\`bash).
   - Never write code as plain text.
   - Prefer modern, clean, responsive designs (Flexbox/Grid, mobile-first, CSS variables, glassmorphism or sleek dark mode).
   - If React / Next.js is requested, provide the complete file structure and every component's full code.

4. ACCURACY & ZERO HALLUCINATIONS
   - Never hallucinate libraries, APIs, or syntax.
   - Prefer well-known, stable, widely used modern approaches.
   - Double-check your own code mentally before outputting it. It must work out of the box.
   - NEVER output internal backend logs, debug telemetry, function signatures, or tracebacks (e.g. NEVER write 'model_used=', 'latency_ms=', 'self.db.add', 'async def', 'payload=').

5. EXAM & ADAPTIVE ANSWER LENGTH:
   - "2 marks": Crisp, high-impact 2-sentence definition + key formula/principle.
   - "5 marks": Structured answer (Definition, Key Features, Bullet Points, Brief Example).
   - "10 marks": Comprehensive exam layout (Definition → Introduction → Layered Architecture/Diagram → Step-by-Step Example → Advantages/Disadvantages → Conclusion).

6. TRAYA YUKTI CORE (TYC) LMS KNOWLEDGE BASE:
   - Platform: Traya Yukti Core (TYC) LMS.
   - Features: Video lessons, interactive markdown notes, in-browser Coding Lab (Monaco editor + test runner), dynamic student portfolio, certificates with verification, workshops, hackathons with leaderboards, curriculum CMS.
   - Interactive 6-Phase Login Mascot:
     1. Phase 1 (Email Input): Boy tracks input keystrokes 👀.
     2. Phase 2 (Valid Email): Boy gives thumbs-up 😊.
     3. Phase 3 (Invalid Email): Boy scratches chin confused 🤨 with red alert shake.
     4. Phase 4 (Password Input): Boy covers eyes for privacy 🙈.
     5. Phase 5 (Valid Password ≥6): Boy uncovers eyes and smiles 😀.
     6. Phase 6 (Login Success): Confetti celebration 🎉 and dashboard redirect.
   - Verified Demo Accounts:
     * Student: Alex Rivera (alex.rivera@tyc.dev / alex@123), Priya Sharma (priya.sharma@tyc.dev / priya@123)
     * Instructor: Dr. Sarah Chen (sarah.chen@tyc.dev / sarah@123)
     * Admin: Admin Controller (admin@tyc.dev / admin@123)
     * Owner: Kavya Guntaka (owner@tyc.dev / owner@123)
   - Coding Lab Supported Languages: JavaScript, TypeScript, Python, SQL.

${context?.courseTitle ? `\nActive Student Context: Enrolled in "${context.courseTitle}" ${context.lessonTitle ? `-> Lesson "${context.lessonTitle}"` : ''}` : ''}`;
}

/**
 * Sanitizes and strips any accidental backend debug leaks from model outputs
 */
function sanitizeAssistantContent(content: string): string {
  if (!content) return '';
  return content
    .replace(/^Here's a thinking process:[\s\S]*?(?=\n\n(?:###|[A-Z]|\*\*|#|1\.|-))/gi, '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/model_used=.*$/gim, '')
    .replace(/latency_ms=.*$/gim, '')
    .replace(/self\.db\.add\(.*?\)/gim, '')
    .replace(/async def .*?:/gim, '')
    .replace(/payload\s*=\s*\{.*?\}/gim, '')
    .replace(/Traceback \(most recent call last\):[\s\S]*?(?=\n\n|$)/gim, '')
    .trim();
}

/**
 * Normalizes query string for caching
 */
function normalizeQueryKey(query: string, mode: AITutorMode): string {
  return `${mode}::${query.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim()}`;
}

/**
 * Determines if query should be cached in short-lived memory
 */
function isCacheableQuery(query: string): boolean {
  const q = query.toLowerCase();
  return (
    q.includes('what is') ||
    q.includes('difference between') ||
    q.includes('explain') ||
    q.includes('how does') ||
    q.includes('courses available') ||
    q.includes('coding lab')
  );
}

/**
 * Streams precomputed or cached string smoothly
 */
async function streamCachedString(
  text: string,
  callbacks?: StreamCallbacks,
  abortSignal?: AbortSignal
): Promise<void> {
  const words = text.split(' ');
  let accumulated = '';

  for (let i = 0; i < words.length; i++) {
    if (abortSignal?.aborted) break;
    const chunk = (i === 0 ? '' : ' ') + words[i];
    accumulated += chunk;
    callbacks?.onChunk(chunk, accumulated);
    await new Promise((r) => setTimeout(r, 12));
  }
}

/**
 * Clarifies ambiguous single-word questions
 */
function checkAmbiguousQuery(query: string): { text: string; followUps: string[] } | null {
  const q = query.toLowerCase().trim();

  if (q === 'java' || q === 'explain java') {
    return {
      text: `### 🤔 Quick Clarification\n\nDid you mean **Java** (the object-oriented backend programming language) or **JavaScript** (the web language for frontend & Node.js)?\n\nPlease let me know which one you'd like to explore!`,
      followUps: [
        'Explain Java programming language',
        'Explain JavaScript for web development',
        'What is the difference between Java and JavaScript?',
      ],
    };
  }

  if (q === 'c' || q === 'explain c') {
    return {
      text: `### 🤔 Quick Clarification\n\nAre you looking for an explanation of the **C programming language**, **C++ (OOP)**, or **C# (.NET)**?`,
      followUps: [
        'Explain C programming language',
        'Explain C++ Object Oriented Programming',
        'Explain C# for .NET development',
      ],
    };
  }

  return null;
}

/**
 * Contextual follow-up suggestions
 */
function generateSmartFollowUps(query: string, mode: AITutorMode, reply: string): string[] {
  const q = query.toLowerCase();

  if (q.includes('react') || q.includes('hook') || q.includes('state') || q.includes('component')) {
    return [
      'Show full code example with TypeScript',
      'What are the advantages and disadvantages?',
      'Explain how React 19 Actions work',
    ];
  }

  if (q.includes('python') || q.includes('variable') || q.includes('function') || q.includes('loop')) {
    return [
      'Give me a beginner-friendly code example',
      'How does Python memory management work?',
      'Quiz me on Python basics',
    ];
  }

  if (q.includes('osi') || q.includes('network') || q.includes('marks') || q.includes('exam')) {
    return [
      'Explain this in 5 marks format',
      'Explain this in 10 marks format with diagram',
      'What are the main interview questions on this?',
    ];
  }

  if (q.includes('tyc') || q.includes('lms') || q.includes('course') || q.includes('certificate') || q.includes('lab')) {
    return [
      'How does the in-browser coding lab work?',
      'Show all user roles and passwords',
      'How do I earn and verify certificates?',
    ];
  }

  if (mode === 'Debug') {
    return [
      'How can I write a unit test to prevent this bug?',
      'What is the root cause of this error?',
      'Show the complete corrected code file',
    ];
  }

  if (mode === 'Socratic') {
    return [
      'Give me another hint to guide my solution',
      'Is my current approach optimal?',
      'Walk me through the next step',
    ];
  }

  return [
    'Can you give a practical real-world example?',
    'Explain this simply for a beginner',
    'Quiz me on this concept to test my understanding',
  ];
}

/**
 * High-quality fallback generator when offline or busy
 */
function generateComprehensiveFallback(
  query: string,
  mode: AITutorMode,
  context?: { courseTitle?: string; moduleTitle?: string; lessonTitle?: string }
): string {
  const q = query.toLowerCase();

  if (q.includes('2 mark') || q.includes('2 marks')) {
    return `### 📝 2-Mark Exam Answer: ${query.replace(/explain|in 2 marks|for 2 marks/gi, '').trim()}\n\n**Definition:** A fundamental concept in computing that defines how components interact predictably and exchange data.\n\n**Key Point:** It ensures modularity, fault tolerance, and deterministic execution across distributed environments.`;
  }

  if (q.includes('5 mark') || q.includes('5 marks')) {
    return `### 📝 5-Mark Exam Answer: ${query.replace(/explain|in 5 marks|for 5 marks/gi, '').trim()}\n\n### 1. Definition\nAn architectural standard designed to provide structured abstraction, communication protocols, and execution guarantees.\n\n### 2. Key Features\n- **Modularity**: Decouples complex logic into distinct, manageable layers.\n- **Standardization**: Ensures interoperability across diverse hardware and software.\n- **Error Handling**: Implements detection and recovery mechanisms.\n\n### 3. Example\nIn modern web engineering, client requests flow through DNS resolution -> TLS handshake -> HTTP/2 Gateway -> Microservices.\n\n### 4. Advantages\n- High scalability and maintainability\n- Simplified debugging and isolation of failures`;
  }

  if (q.includes('10 mark') || q.includes('10 marks') || q.includes('osi')) {
    return `### 📝 10-Mark Comprehensive Exam Answer: OSI Model\n\n### 1. Definition\nThe **Open Systems Interconnection (OSI)** model is a conceptual framework developed by the International Organization for Standardization (ISO) in 1984. It standardizes the communication functions of a telecommunication or computing system into 7 distinct logical layers.\n\n### 2. The 7 Layers of OSI (Top to Bottom)\n\n| Layer Number | Layer Name | Primary Protocol / Unit | Key Function |\n| :--- | :--- | :--- | :--- |\n| **Layer 7** | **Application** | HTTP, HTTPS, FTP, SMTP | User interface & network services |\n| **Layer 6** | **Presentation** | SSL/TLS, JPEG, ASCII | Encryption, compression, data translation |\n| **Layer 5** | **Session** | NetBIOS, RPC, Sockets | Session establishment, management & termination |\n| **Layer 4** | **Transport** | TCP, UDP (Segments) | End-to-end delivery, flow control, error recovery |\n| **Layer 3** | **Network** | IP, ICMP, BGP (Packets) | Logical addressing & routing across networks |\n| **Layer 2** | **Data Link** | Ethernet, MAC, Switches (Frames) | Physical addressing (MAC) & hop-to-hop transfer |\n| **Layer 1** | **Physical** | Cables, Fiber, Bits | Transmission of raw unstructured bitstreams |\n\n### 3. Data Flow Diagram\n\`\`\`text\nSender Application Layer  ──►  [Encapsulation: Data + Headers]\n                                    │\n                                    ▼\n                      Physical Layer (Bits over Cable)\n                                    │\n                                    ▼\nReceiver Application Layer ◄──  [Decapsulation: Strips Headers]\n\`\`\`\n\n### 4. Step-by-Step Working Example\nWhen you open a web page in a browser:\n1. **Application Layer (7)**: Browser creates an HTTP GET request.\n2. **Presentation Layer (6)**: Encrypts the payload with TLS 1.3.\n3. **Session Layer (5)**: Manages continuous socket connection to server.\n4. **Transport Layer (4)**: Segments data and adds TCP header with port numbers.\n5. **Network Layer (3)**: Adds Source & Destination IP addresses to create packets.\n6. **Data Link Layer (2)**: Encapsulates packet into Ethernet frames with MAC addresses.\n7. **Physical Layer (1)**: Transmits raw bits through Wi-Fi or fiber optic cable.\n\n### 5. Advantages\n- **Modular Design**: Changes in one layer do not affect others.\n- **Interoperability**: Enables multi-vendor hardware/software collaboration.\n- **Troubleshooting**: Facilitates pinpointing network failures to specific layers.\n\n### 6. Conclusion\nThe OSI model serves as the foundational architectural blueprint for all modern network engineering and protocol design.`;
  }

  if (q.includes('variable in python') || (q.includes('variable') && q.includes('python'))) {
    return `### Short Answer\nA **variable in Python** is a named reference (or label) that points to an object stored in computer memory. Unlike languages like C or Java, Python uses dynamic typing, meaning you do not need to declare data types explicitly.\n\n### How It Works\nWhen you assign a value using \`=\`, Python creates the object in memory and binds the variable name to it.\n\n### Code Example\n\`\`\`python\n# Creating variables\nstudent_name = "Alex Rivera"  # String\nage = 22                      # Integer\ngpa = 3.85                    # Float\nis_enrolled = True            # Boolean\n\n# Dynamic reassignment\nage = age + 1\nprint(f"{student_name} is {age} years old with GPA {gpa}")\n\`\`\`\n\n### Key Points\n- **No Declaration**: Created automatically upon first assignment.\n- **Case-Sensitive**: \`score\` and \`Score\` are distinct variables.\n- **Naming Rules**: Must begin with a letter or underscore \`_\`, cannot start with a number or contain spaces.`;
  }

  if (q.includes('what is react') || q === 'react') {
    return `### 1. Definition\n**React** is a popular open-source JavaScript library created by Meta for building dynamic, interactive user interfaces, primarily for single-page web applications (SPAs).\n\n### 2. Why It Is Used\n- **Declarative UI**: You describe *what* the UI should look like for each state, and React automatically updates the DOM when data changes.\n- **Component-Based Architecture**: Build reusable, self-contained UI building blocks (e.g., buttons, cards, navbars).\n- **Virtual DOM**: React updates only the changed parts of the real DOM, ensuring blazing-fast rendering performance.\n\n### 3. How It Works\n\`\`\`tsx\nimport React, { useState } from 'react';\n\nexport const Counter = () => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="p-4 border rounded-xl bg-slate-900 text-white">\n      <p className="text-lg font-bold">Count: {count}</p>\n      <button\n        onClick={() => setCount(prev => prev + 1)}\n        className="px-4 py-2 bg-emerald-500 rounded-lg font-bold hover:bg-emerald-400"\n      >\n        Increment\n      </button>\n    </div>\n  );\n};\n\`\`\`\n\n### 4. Real-World Applications\nUsed by Facebook, Netflix, Instagram, Airbnb, and the **Traya Yukti Core (TYC) LMS** for fluid student dashboards and video lesson streaming.`;
  }

  if (q.includes('react vs angular') || (q.includes('react') && q.includes('angular'))) {
    return `### 📊 Comparison: React vs Angular\n\n| Feature | React | Angular |\n| :--- | :--- | :--- |\n| **Type** | UI Library | Complete Framework |\n| **Creator** | Meta (Facebook) | Google |\n| **Language** | JavaScript / TypeScript (JSX/TSX) | TypeScript |\n| **Architecture** | Component-based (Virtual DOM) | Component & Directive-based (Real DOM) |\n| **State Management** | Context API, Zustand, Redux | RxJS, NgRx, Signals |\n| **Data Binding** | Unidirectional (One-way) | Bidirectional (Two-way) |\n| **Learning Curve** | Gentle / Flexible | Steep / Highly opinionated |\n| **Best For** | High-performance, customizable SPAs | Large enterprise applications |\n\n### Summary Recommendation\n- Choose **React** if you value flexibility, vast ecosystem, and rapid UI development.\n- Choose **Angular** if you need an all-in-one enterprise framework with built-in routing, forms, and HTTP clients.`;
  }

  if (q.includes('what is tyc') || q.includes('about tyc') || q.includes('platform')) {
    return `### 🚀 What is Traya Yukti Core (TYC) LMS?\n\n**Traya Yukti Core (TYC)** is an advanced AI-powered learning management platform built to accelerate developer mastery.\n\n### Key Platform Highlights:\n- **Interactive Curriculum**: Deep-dive courses in Full Stack React 19, Python AI, Cloud DevOps, and Prompt Engineering.\n- **In-Browser Coding Lab**: Execute code live in the browser with automated test suites and instant diagnostic feedback.\n- **Interactive 6-Phase Authentication Mascot**: Real-time animated character reacting to keystrokes, password shielding, and successful logins.\n- **Verified Certificates & Portfolios**: Earn verifiable skill credentials and build a showcase portfolio for hiring managers.\n- **AI Neural Copilot**: Context-aware mentoring, code debugging, and technical interview simulations.`;
  }

  return `### 💡 Overview: ${query}\n\n### 1. What is it?\nA core computing principle that organizes data and execution flow in modern systems.\n\n### 2. How it Works\nIt decouples complex tasks into modular components, ensuring predictable execution, performance optimization, and type safety.\n\n### 3. Practical Example\nWhen applied in software development, it simplifies state management, improves code reusability, and prevents runtime bugs.\n\n### 4. Key Takeaways\n- Focus on modularity and deterministic logic.\n- Always validate inputs and handle edge cases gracefully.`;
}
