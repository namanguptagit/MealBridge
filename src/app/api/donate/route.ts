// ═══════════════════════════════════════════════════════
// MealBridge — /api/donate
// Creates checkout sessions for conventional donations
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { LocusPayClient } from '@/lib/locus-pay';
import { decrypt } from '@/lib/encrypt';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { matchId, amount, memo, method } = body;

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    // Get the sponsor's Locus API key
    const sponsor = await prisma.user.findUnique({
      where: { id: user.userId },
    });

    if (!sponsor?.locusApiKeyEnc) {
      return NextResponse.json(
        { error: 'No Locus wallet configured. Please set up your wallet first.' },
        { status: 400 }
      );
    }

    const locusApiKey = decrypt(sponsor.locusApiKeyEnc);
    const client = new LocusPayClient(locusApiKey);

    if (method === 'checkout') {
      // Create a checkout session
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const session = await client.createCheckoutSession({
        amount: amount.toString(),
        memo: memo || 'MealBridge donation',
        successUrl: `${appUrl}/dashboard?donation=success`,
        cancelUrl: `${appUrl}/dashboard?donation=cancelled`,
      });

      // Record the donation as pending
      const donation = await prisma.donation.create({
        data: {
          sponsorId: user.userId,
          matchId,
          amount: parseFloat(amount),
          memo,
          method: 'checkout',
          checkoutSessionId: session.sessionId,
          status: 'pending_approval',
        },
      });

      return NextResponse.json({
        donation,
        checkoutUrl: session.checkoutUrl,
      });
    } else {
      // Direct USDC transfer
      if (!matchId) {
        return NextResponse.json(
          { error: 'matchId is required for direct transfers' },
          { status: 400 }
        );
      }

      // Get the shelter's wallet address
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: { shelter: true },
      });

      if (!match?.shelter?.locusWalletAddress) {
        return NextResponse.json(
          { error: 'Shelter has no wallet address' },
          { status: 400 }
        );
      }

      const result = await client.sendPayment({
        to: match.shelter.locusWalletAddress,
        amount: amount.toString(),
        memo: memo || `MealBridge delivery funding for match ${matchId}`,
      });

      // Record the donation
      const donation = await prisma.donation.create({
        data: {
          sponsorId: user.userId,
          matchId,
          amount: parseFloat(amount),
          memo,
          method: 'direct',
          locusTxId: result.transactionId,
          locusTxHash: result.txHash,
          status: result.success ? 'confirmed' : 'failed',
          agentReasoning: body.agentReasoning,
        },
      });

      // If no txHash yet, try to poll for it
      if (result.success && result.transactionId && !result.txHash) {
        const confirmedTx = await client.pollTransactionConfirmation(
          result.transactionId
        );
        if (confirmedTx?.txHash) {
          await prisma.donation.update({
            where: { id: donation.id },
            data: {
              locusTxHash: confirmedTx.txHash,
              reconciledAt: new Date(),
            },
          });
        }
      }

      return NextResponse.json({ donation, txHash: result.txHash }, { status: 201 });
    }
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}
