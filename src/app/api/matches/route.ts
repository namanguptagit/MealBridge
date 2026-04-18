// ═══════════════════════════════════════════════════════
// MealBridge — /api/matches
// AI-powered match operations
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET — List matches with optional filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const matches = await prisma.match.findMany({
      where,
      include: {
        listing: {
          include: {
            restaurant: {
              select: {
                id: true,
                displayName: true,
                address: true,
                lat: true,
                lng: true,
              },
            },
          },
        },
        shelter: {
          select: {
            id: true,
            displayName: true,
            address: true,
            lat: true,
            lng: true,
            capacity: true,
          },
        },
        donations: {
          select: {
            id: true,
            amount: true,
            status: true,
            locusTxHash: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Matches fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

// POST — Create a new match (used by AI agent)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, shelterId, matchScore, matchReason, distanceKm } = body;

    if (!listingId || !shelterId || matchScore === undefined || !matchReason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update listing status to matched
    await prisma.listing.update({
      where: { id: listingId },
      data: { status: 'matched' },
    });

    const match = await prisma.match.create({
      data: {
        listingId,
        shelterId,
        matchScore: parseFloat(matchScore),
        matchReason,
        distanceKm: distanceKm ? parseFloat(distanceKm) : undefined,
      },
      include: {
        listing: {
          include: {
            restaurant: {
              select: { displayName: true, address: true },
            },
          },
        },
        shelter: {
          select: { displayName: true, address: true },
        },
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error('Match creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}
