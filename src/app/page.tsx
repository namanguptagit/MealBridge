'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════
// MealBridge Landing Page
// ═══════════════════════════════════════════════════════

// ─── Animated Counter Component ──────────────────────
function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Navigation ──────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--color-surface-overlay)] backdrop-blur-xl border-b border-[var(--color-border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--gradient-brand)] flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <span className="text-lg font-bold">
            Meal<span className="gradient-text">Bridge</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm font-medium"
          >
            How It Works
          </a>
          <a
            href="#impact"
            className="text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm font-medium"
          >
            Impact
          </a>
          <Link
            href="/dashboard"
            className="text-[var(--color-text-secondary)] hover:text-white transition-colors text-sm font-medium"
          >
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/chat" className="btn-primary text-sm">
            🤖 Talk to Agent
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero Section ────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-secondary)] mb-8 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
          <span className="text-sm text-[var(--color-text-secondary)]">
            Built on <span className="text-white font-medium">Locus</span> · Paygentic Hackathon Week 2
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          No Meal Left
          <br />
          <span
            className="gradient-text"
            style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontStyle: 'italic' }}
          >
            Behind
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          40% of food gets thrown away while{' '}
          <span className="text-white font-medium">44 million people</span> go hungry.
          MealBridge&apos;s AI connects surplus food with nearby shelters — every delivery{' '}
          <span className="gradient-text-accent font-medium">funded with USDC</span>, traceable on-chain.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Link href="/chat" className="btn-primary text-base px-8 py-4">
            🍽️ Rescue Meals Now
          </Link>
          <Link href="/dashboard" className="btn-secondary text-base px-8 py-4">
            📊 View Impact
          </Link>
        </div>

        {/* Live Stats Bar */}
        <div
          className="glass-card-static px-8 py-5 inline-flex flex-wrap items-center justify-center gap-8 md:gap-12 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold gradient-text">
              <AnimatedCounter end={12847} />
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">🍽️ Meals Rescued</div>
          </div>
          <div className="w-px h-10 bg-[var(--color-border)] hidden md:block" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold gradient-text">
              <AnimatedCounter end={32} suffix="t" />
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">🌿 CO₂ Saved</div>
          </div>
          <div className="w-px h-10 bg-[var(--color-border)] hidden md:block" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold gradient-text-accent">
              <AnimatedCounter end={4218} prefix="$" />
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">💰 Donated (USDC)</div>
          </div>
          <div className="w-px h-10 bg-[var(--color-border)] hidden md:block" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">
              <AnimatedCounter end={145} />
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">🏠 Shelters</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      emoji: '🍝',
      title: 'Restaurant Lists Surplus',
      description: 'Tell our AI agent what you have left over. "50 meals of pasta, pickup by 9 PM."',
      color: '#F97316',
    },
    {
      emoji: '🤖',
      title: 'AI Finds Best Match',
      description:
        'Our agent searches nearby shelters, checks capacity, dietary needs, and proposes the best match.',
      color: '#22C55E',
    },
    {
      emoji: '💰',
      title: 'Sponsor Funds Delivery',
      description:
        'Sponsors fund the $3 delivery cost with USDC — every dollar traceable on Base mainnet.',
      color: '#8B5CF6',
    },
    {
      emoji: '✅',
      title: 'Meals Delivered',
      description:
        'Shelter receives meals. Impact dashboard updates. CO₂ saved. Lives changed.',
      color: '#06B6D4',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How{' '}
            <span
              className="gradient-text"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
            >
              it works
            </span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto">
            From surplus to salvation in four simple steps, powered by AI and blockchain transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="glass-card p-6 text-center group"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Step Number */}
              <div
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold mb-4"
                style={{
                  background: `${step.color}20`,
                  color: step.color,
                  border: `1px solid ${step.color}40`,
                }}
              >
                {i + 1}
              </div>

              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {step.emoji}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connection line */}
        <div className="hidden md:flex items-center justify-center mt-8">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <span className="text-xs">Restaurant</span>
            <svg
              className="w-4 h-4 text-[var(--color-brand-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-xs">AI Agent</span>
            <svg
              className="w-4 h-4 text-[var(--color-brand-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-xs">Sponsor</span>
            <svg
              className="w-4 h-4 text-[var(--color-brand-primary)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-xs">Shelter</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Agent Preview Section ───────────────────────────
function AgentPreviewSection() {
  const messages = [
    {
      role: 'user',
      text: "I have 30 leftover sandwiches, need pickup by 8 PM tonight",
    },
    {
      role: 'agent',
      text: "I found Hope Community Shelter 0.6 miles away — they have capacity for 40 meals and accept all dietary types. Match score: 94%. Should I create this match?",
    },
    {
      role: 'user',
      text: "Yes, match them!",
    },
    {
      role: 'agent',
      text: "✅ Matched! I've notified Hope Community Shelter. A sponsor can fund the $3 delivery. I also found Downtown Food Bank 1.2 mi away as a backup.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]" />
              AI-Powered Matching
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Just{' '}
              <span
                className="gradient-text"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
              >
                tell the agent
              </span>
              <br />
              what you have
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-8">
              Our AI agent handles everything — from discovering nearby shelters via Brave search,
              to reading their websites with Firecrawl, to executing USDC payments with Locus.
              You just chat naturally.
            </p>

            <div className="flex flex-wrap gap-3">
              {['Brave Search', 'Firecrawl', 'PayWithLocus', 'Gemini Flash'].map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Chat Preview */}
          <div className="glass-card-static p-6 max-w-lg">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[var(--color-border)]">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-[var(--color-text-muted)]">
                MealBridge Agent
              </span>
            </div>

            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-brand-primary)] text-white rounded-br-sm'
                        : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] rounded-bl-sm border border-[var(--color-border)]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                <span className="text-sm text-[var(--color-text-muted)] flex-1">
                  Type a message...
                </span>
                <div className="w-8 h-8 rounded-lg bg-[var(--color-brand-primary)] flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tech Stack / Locus Integration Section ──────────
function IntegrationSection() {
  const integrations = [
    { name: 'BuildWithLocus', count: 12, desc: 'Deployment, services, databases, domains' },
    { name: 'PayWithLocus', count: 6, desc: 'Wallets, USDC transfers, checkout' },
    { name: 'Wrapped APIs', count: 2, desc: 'Brave search, Firecrawl scraping' },
    { name: 'Checkout', count: 2, desc: 'Sessions, agent payments' },
  ];

  return (
    <section id="impact" className="py-24 px-6 relative">
      <div className="absolute inset-0" style={{ background: 'var(--gradient-glow)' }} />
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-accent">22</span> Locus Integrations
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg">
            Every endpoint is structurally necessary. Not a single checkbox integration.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrations.map((item) => (
            <div key={item.name} className="glass-card p-6 text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{item.count}</div>
              <div className="text-sm font-semibold mb-1">{item.name}</div>
              <div className="text-xs text-[var(--color-text-muted)]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[var(--gradient-brand)] flex items-center justify-center text-white font-bold text-xs">
            M
          </div>
          <span className="text-sm font-semibold">MealBridge</span>
          <span className="text-xs text-[var(--color-text-muted)] ml-2">
            Built with ❤️ on Locus
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-[var(--color-text-muted)]">
          <span>Paygentic Hackathon Week 2</span>
          <span>•</span>
          <span>BuildWithLocus Track</span>
          <span>•</span>
          <span>Powered by USDC on Base</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────
export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <AgentPreviewSection />
      <IntegrationSection />
      <Footer />
    </main>
  );
}
