// ═══════════════════════════════════════════════════════
// MealBridge — PayWithLocus Typed Client
// Wraps the Locus Beta API for wallet, payments, and
// wrapped API access (Brave search, Firecrawl scraping)
// ═══════════════════════════════════════════════════════

import { LOCUS_PAY_ENDPOINTS, APP_CONFIG } from './constants';

// ─── Types ───────────────────────────────────────────

export interface RegisterResponse {
  apiKey: string;
  ownerPrivateKey: string;
  walletAddress?: string;
  claimUrl?: string;
}

export interface WalletStatus {
  status: 'pending' | 'deploying' | 'deployed' | 'failed';
  walletAddress?: string;
}

export interface SendPaymentRequest {
  to: string; // wallet address
  amount: string; // USDC amount as string
  memo?: string;
}

export interface SendEmailPaymentRequest {
  email: string;
  amount: string;
  memo?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  txHash?: string;
  error?: string;
}

export interface BalanceResponse {
  success: boolean;
  data: {
    balance: string;
    token: string;
    wallet_address: string;
  };
}

export interface Transaction {
  id: string;
  type: string;
  amount: string;
  to: string;
  from: string;
  txHash?: string;
  status: string;
  createdAt: string;
}

export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
}

export interface FirecrawlResult {
  content: string;
  metadata?: Record<string, unknown>;
}

// ─── Client Class ────────────────────────────────────

export class LocusPayClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const error = await res.text().catch(() => 'Unknown error');
      throw new Error(`Locus API error (${res.status}): ${error}`);
    }

    return res.json();
  }

  // ─── Wallet Management ─────────────────────────────

  /**
   * Register a new wallet for an agent/user
   */
  static async register(
    name: string,
    email: string
  ): Promise<RegisterResponse> {
    const res = await fetch(LOCUS_PAY_ENDPOINTS.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const error = await res.text().catch(() => 'Unknown error');
      throw new Error(`Locus registration failed (${res.status}): ${error}`);
    }

    return res.json();
  }

  /**
   * Poll wallet deployment status until deployed or timeout
   */
  async pollWalletStatus(): Promise<WalletStatus> {
    let attempts = 0;
    while (attempts < APP_CONFIG.walletPollMaxAttempts) {
      const status = await this.request<WalletStatus>(
        LOCUS_PAY_ENDPOINTS.status
      );

      if (status.status === 'deployed' || status.status === 'failed') {
        return status;
      }

      attempts++;
      await new Promise((resolve) =>
        setTimeout(resolve, APP_CONFIG.walletPollIntervalMs)
      );
    }

    return { status: 'pending' };
  }

  // ─── Payments ──────────────────────────────────────

  /**
   * Send USDC directly to a wallet address
   */
  async sendPayment(req: SendPaymentRequest): Promise<PaymentResponse> {
    return this.request<PaymentResponse>(LOCUS_PAY_ENDPOINTS.send, {
      method: 'POST',
      body: JSON.stringify(req),
    });
  }

  /**
   * Send USDC via email escrow (for recruiting off-platform shelters)
   */
  async sendEmailPayment(
    req: SendEmailPaymentRequest
  ): Promise<PaymentResponse> {
    return this.request<PaymentResponse>(LOCUS_PAY_ENDPOINTS.sendEmail, {
      method: 'POST',
      body: JSON.stringify(req),
    });
  }

  /**
   * Check wallet USDC balance
   */
  async getBalance(): Promise<BalanceResponse> {
    return this.request<BalanceResponse>(LOCUS_PAY_ENDPOINTS.balance);
  }

  /**
   * Get transaction history
   */
  async getTransactions(): Promise<{ transactions: Transaction[] }> {
    return this.request<{ transactions: Transaction[] }>(
      LOCUS_PAY_ENDPOINTS.transactions
    );
  }

  /**
   * Poll for a specific transaction confirmation after send
   */
  async pollTransactionConfirmation(
    txId: string
  ): Promise<Transaction | null> {
    let attempts = 0;
    while (attempts < APP_CONFIG.txPollMaxAttempts) {
      const { transactions } = await this.getTransactions();
      const tx = transactions.find((t) => t.id === txId);

      if (tx && tx.txHash) {
        return tx;
      }

      attempts++;
      await new Promise((resolve) =>
        setTimeout(resolve, APP_CONFIG.txPollIntervalMs)
      );
    }

    return null;
  }

  // ─── Checkout ──────────────────────────────────────

  /**
   * Create a checkout session for conventional donations
   */
  async createCheckoutSession(params: {
    amount: string;
    memo: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ sessionId: string; checkoutUrl: string }> {
    return this.request(LOCUS_PAY_ENDPOINTS.checkoutSessions, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ─── Wrapped APIs ──────────────────────────────────

  /**
   * Search the web via Brave (through Locus wrapped API)
   */
  async braveSearch(query: string): Promise<{ results: BraveSearchResult[] }> {
    return this.request(LOCUS_PAY_ENDPOINTS.braveSearch, {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  /**
   * Scrape a website via Firecrawl (through Locus wrapped API)
   * Note: Firecrawl has a known double-envelope issue — unwrap data.data
   */
  async firecrawlScrape(url: string): Promise<FirecrawlResult> {
    const raw = await this.request<Record<string, unknown>>(
      LOCUS_PAY_ENDPOINTS.firecrawlScrape,
      {
        method: 'POST',
        body: JSON.stringify({ url }),
      }
    );

    // Handle Firecrawl double-envelope gotcha (data.data)
    const data = (raw as Record<string, unknown>).data || raw;
    const inner =
      (data as Record<string, unknown>).data || data;
    return inner as FirecrawlResult;
  }
}
