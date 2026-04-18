import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MealBridge — AI-Powered Food Rescue',
  description:
    '40% of food gets thrown away while 44 million people go hungry. MealBridge connects surplus food with nearby shelters in real time using AI.',
  keywords: [
    'food rescue',
    'food waste',
    'AI',
    'shelters',
    'USDC',
    'donation',
    'sustainability',
  ],
  openGraph: {
    title: 'MealBridge — AI-Powered Food Rescue',
    description:
      'Connecting surplus food with shelters using AI agents and on-chain donations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
