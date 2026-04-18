'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

// ─── Animated Counter ────────────────────────────────
function Counter({
  end,
  suffix = '',
  prefix = '',
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const increment = end / 120;
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end]);

  return (
    <div ref={ref} className="tabular-nums">
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}
      {suffix}
    </div>
  );
}

// ─── Mock Data ───────────────────────────────────────
const recentRescues = [
  {
    id: 1,
    food: '50 meals of Pasta Primavera',
    restaurant: "Mario's Kitchen",
    shelter: 'Hope Community Shelter',
    sponsor: 'alice.eth',
    amount: 3.0,
    meals: 50,
    time: '2 hours ago',
    emoji: '🍝',
  },
  {
    id: 2,
    food: '30 Turkey Sandwiches',
    restaurant: 'Deli Express',
    shelter: 'Downtown Food Bank',
    sponsor: 'bob.eth',
    amount: 2.5,
    meals: 30,
    time: '5 hours ago',
    emoji: '🥪',
  },
  {
    id: 3,
    food: '20 Margherita Pizzas',
    restaurant: 'Pizza Palace',
    shelter: 'Community Kitchen NYC',
    sponsor: 'carol.eth',
    amount: 2.0,
    meals: 20,
    time: '8 hours ago',
    emoji: '🍕',
  },
  {
    id: 4,
    food: '45 Rice & Bean Bowls',
    restaurant: 'Green Bowl Cafe',
    shelter: 'Sunrise Shelter',
    sponsor: 'dave.eth',
    amount: 3.5,
    meals: 45,
    time: '12 hours ago',
    emoji: '🥗',
  },
  {
    id: 5,
    food: '60 Chicken Wraps',
    restaurant: 'Wrap City',
    shelter: 'Harbor House',
    sponsor: 'eve.eth',
    amount: 4.0,
    meals: 60,
    time: '1 day ago',
    emoji: '🌯',
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface-primary)' }}>
      {/* Header */}
      <header className="border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--gradient-brand)] flex items-center justify-center text-white font-bold text-xs">
              M
            </div>
            <span className="font-semibold text-sm">
              Meal<span className="gradient-text">Bridge</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              🤖 Chat
            </Link>
            <Link href="/listings" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">
              📋 Listings
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Impact{' '}
            <span
              className="gradient-text"
              style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
            >
              Dashboard
            </span>
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Real-time food rescue metrics · All donations verifiable on{' '}
            <a
              href="https://basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-brand-primary)] hover:underline"
            >
              BaseScan ↗
            </a>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="glass-card p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
              <Counter end={12847} />
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">🍽️ Meals Rescued</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
              <Counter end={32.1} suffix="t" decimals={1} />
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">🌿 CO₂ Saved</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold gradient-text-accent mb-1">
              <Counter end={4218} prefix="$" />
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">💰 Donated (USDC)</div>
          </div>
          <div className="glass-card p-6 text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
              <Counter end={145} />
            </div>
            <div className="text-sm text-[var(--color-text-secondary)]">🏠 Active Shelters</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Rescues */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
              Recent Rescues
            </h2>
            <div className="space-y-3">
              {recentRescues.map((rescue) => (
                <div
                  key={rescue.id}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className="text-2xl">{rescue.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{rescue.food}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      {rescue.restaurant} → {rescue.shelter}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold gradient-text-accent">
                      ${rescue.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">{rescue.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div>
              <h2 className="text-lg font-semibold mb-4">🗺️ Live Map</h2>
              <div className="glass-card-static p-4 h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Leaflet map coming Day 4
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/chat"
                  className="glass-card p-4 flex items-center gap-3 cursor-pointer group"
                >
                  <div className="text-xl">🍽️</div>
                  <div>
                    <div className="text-sm font-medium group-hover:text-[var(--color-brand-primary)] transition-colors">
                      List Surplus Food
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      Tell the agent what you have
                    </div>
                  </div>
                </Link>
                <Link
                  href="/chat"
                  className="glass-card p-4 flex items-center gap-3 cursor-pointer group"
                >
                  <div className="text-xl">💰</div>
                  <div>
                    <div className="text-sm font-medium group-hover:text-[var(--color-brand-accent)] transition-colors">
                      Fund a Delivery
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      Sponsor a meal rescue with USDC
                    </div>
                  </div>
                </Link>
                <Link
                  href="/chat"
                  className="glass-card p-4 flex items-center gap-3 cursor-pointer group"
                >
                  <div className="text-xl">🏠</div>
                  <div>
                    <div className="text-sm font-medium group-hover:text-white transition-colors">
                      Join as a Shelter
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)]">
                      Receive rescued meals
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
