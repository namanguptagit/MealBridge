'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([
    {
      role: 'assistant',
      content:
        "👋 Hi! I'm the MealBridge AI agent. I can help you:\n\n🍽️ **Restaurants** — List surplus food for rescue\n🏠 **Shelters** — Find available food nearby\n💰 **Sponsors** — Fund meal deliveries with USDC\n📊 **Everyone** — Check impact stats\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // TODO: Connect to /api/chat endpoint with Vercel AI SDK (Day 2)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "🚧 Agent tools are being connected (Day 2). For now, I can tell you that MealBridge has rescued **12,847 meals** and saved **32 tons of CO₂**! Check the dashboard for live stats.",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-surface-primary)' }}>
      {/* Header */}
      <header className="border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--gradient-brand)] flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="font-semibold text-sm">
              Meal<span className="gradient-text">Bridge</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
            <span className="text-xs text-[var(--color-text-secondary)]">AI Agent Online</span>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-[var(--gradient-brand)] flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--color-brand-primary)] text-white rounded-br-sm'
                    : 'glass-card-static rounded-bl-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-lg bg-[var(--gradient-brand)] flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
                🤖
              </div>
              <div className="glass-card-static rounded-2xl rounded-bl-sm px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--color-border)] px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell the agent what food you have, or ask about impact..."
              className="flex-1 px-5 py-3.5 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-sm text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-primary px-5 py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
