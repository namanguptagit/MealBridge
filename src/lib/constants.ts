// ═══════════════════════════════════════════════════════
// MealBridge — Constants & API Configuration
// ═══════════════════════════════════════════════════════

// ─── PayWithLocus Beta API ───────────────────────────
export const LOCUS_PAY_BASE_URL =
  process.env.LOCUS_PAY_API_URL || 'https://beta-api.paywithlocus.com/api';

export const LOCUS_PAY_ENDPOINTS = {
  register: `${LOCUS_PAY_BASE_URL}/register`,
  status: `${LOCUS_PAY_BASE_URL}/status`,
  send: `${LOCUS_PAY_BASE_URL}/pay/send`,
  sendEmail: `${LOCUS_PAY_BASE_URL}/pay/send-email`,
  balance: `${LOCUS_PAY_BASE_URL}/pay/balance`,
  transactions: `${LOCUS_PAY_BASE_URL}/pay/transactions`,
  checkoutSessions: `${LOCUS_PAY_BASE_URL}/checkout/sessions`,
  checkoutAgentPay: (sessionId: string) =>
    `${LOCUS_PAY_BASE_URL}/checkout/agent/pay/${sessionId}`,
  // Wrapped APIs
  braveSearch: `${LOCUS_PAY_BASE_URL}/wrapped/brave/web-search`,
  firecrawlScrape: `${LOCUS_PAY_BASE_URL}/wrapped/firecrawl/scrape`,
  // Feedback
  feedback: `${LOCUS_PAY_BASE_URL}/feedback`,
} as const;

// ─── BuildWithLocus API ──────────────────────────────
export const BUILD_LOCUS_BASE_URL = 'https://api.buildwithlocus.com/v1';

export const BUILD_LOCUS_ENDPOINTS = {
  authExchange: `${BUILD_LOCUS_BASE_URL}/auth/exchange`,
  authRefresh: `${BUILD_LOCUS_BASE_URL}/auth/refresh`,
  billingBalance: `${BUILD_LOCUS_BASE_URL}/billing/balance`,
  projects: `${BUILD_LOCUS_BASE_URL}/projects`,
  projectsFromRepo: `${BUILD_LOCUS_BASE_URL}/projects/from-repo`,
  services: `${BUILD_LOCUS_BASE_URL}/services`,
  service: (id: string) => `${BUILD_LOCUS_BASE_URL}/services/${id}`,
  serviceWithRuntime: (id: string) =>
    `${BUILD_LOCUS_BASE_URL}/services/${id}?include=runtime`,
  deployments: `${BUILD_LOCUS_BASE_URL}/deployments`,
  deployment: (id: string) => `${BUILD_LOCUS_BASE_URL}/deployments/${id}`,
  variables: (serviceId: string) =>
    `${BUILD_LOCUS_BASE_URL}/variables/service/${serviceId}`,
  gitRemoteUrl: `${BUILD_LOCUS_BASE_URL}/git/remote-url`,
  projectEnvironments: (projectId: string) =>
    `${BUILD_LOCUS_BASE_URL}/projects/${projectId}/environments`,
} as const;

// ─── App Config ──────────────────────────────────────
export const APP_CONFIG = {
  name: 'MealBridge',
  tagline: 'AI-Powered Food Rescue',
  description:
    '40% of food gets thrown away while 44 million people go hungry. MealBridge fixes that.',
  co2PerMeal: 2.5, // kg CO₂ saved per rescued meal
  defaultDeliveryCost: 3.0, // USD per delivery
  walletPollMaxAttempts: 15,
  walletPollIntervalMs: 3000,
  txPollMaxAttempts: 10,
  txPollIntervalMs: 1000,
} as const;

// ─── User Roles ──────────────────────────────────────
export const USER_ROLES = {
  restaurant: { label: 'Restaurant', emoji: '🍽️', color: '#F97316' },
  shelter: { label: 'Shelter', emoji: '🏠', color: '#22C55E' },
  sponsor: { label: 'Sponsor', emoji: '💰', color: '#8B5CF6' },
  driver: { label: 'Driver', emoji: '🚗', color: '#3B82F6' },
  admin: { label: 'Admin', emoji: '⚙️', color: '#6B7280' },
} as const;
