'use client';

import Link from 'next/link';

export default function ListingsPage() {
  // Mock listings — will be replaced with API call
  const listings = [
    {
      id: '1',
      title: '50 meals of Pasta Primavera',
      restaurant: "Mario's Kitchen",
      mealCount: 50,
      mealType: ['Vegetarian', 'Contains Dairy'],
      pickupBy: '9:30 PM',
      timeLeft: '2h 15m',
      status: 'available',
      address: '123 Main St, NYC',
    },
    {
      id: '2',
      title: '30 Turkey Club Sandwiches',
      restaurant: 'Deli Express',
      mealCount: 30,
      mealType: ['Contains Meat'],
      pickupBy: '8:00 PM',
      timeLeft: '45m',
      status: 'available',
      address: '456 Broadway, NYC',
    },
    {
      id: '3',
      title: '25 Mixed Salad Bowls',
      restaurant: 'Green Bowl Cafe',
      mealCount: 25,
      mealType: ['Vegan', 'Gluten-Free'],
      pickupBy: '10:00 PM',
      timeLeft: '3h 45m',
      status: 'matched',
      address: '789 Park Ave, NYC',
    },
  ];

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
              href="/dashboard"
              className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors"
            >
              📊 Dashboard
            </Link>
            <Link href="/chat" className="btn-primary text-sm py-2 px-4">
              🤖 Chat
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              Available{' '}
              <span className="gradient-text" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                Food
              </span>
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Surplus food waiting to be rescued
            </p>
          </div>
          <Link href="/chat" className="btn-primary text-sm">
            + List Food
          </Link>
        </div>

        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">{listing.title}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    📍 {listing.restaurant} — {listing.address}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'available'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {listing.status === 'available' ? '🟢 Available' : '🔵 Matched'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                <span>🍽️ {listing.mealCount} meals</span>
                <span>⏰ Pickup by {listing.pickupBy}</span>
                <span className={listing.timeLeft.includes('m') && !listing.timeLeft.includes('h') ? 'text-orange-400 font-medium' : ''}>
                  ⏱️ {listing.timeLeft} left
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {listing.mealType.map((type) => (
                  <span
                    key={type}
                    className="px-2.5 py-1 rounded-full text-xs bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                  >
                    {type}
                  </span>
                ))}
              </div>

              {listing.status === 'available' && (
                <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--color-text-muted)]">
                    💰 Est. delivery cost: $3.00 USDC
                  </span>
                  <Link href="/chat" className="btn-primary text-xs py-2 px-4">
                    🤑 Fund This Delivery
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
