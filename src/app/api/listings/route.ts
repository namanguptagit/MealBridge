// ═══════════════════════════════════════════════════════
// MealBridge — /api/listings
// CRUD for food listings from restaurants
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET — List available food listings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'available';
    const limit = parseInt(searchParams.get('limit') || '20');
    const mealType = searchParams.get('mealType');

    const where: Record<string, unknown> = { status };

    if (mealType) {
      where.mealType = { contains: mealType };
    }

    // Only show non-expired available listings
    if (status === 'available') {
      where.pickupBy = { gt: new Date() };
    }

    const listings = await prisma.listing.findMany({
      where,
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
        matches: {
          select: {
            id: true,
            status: true,
            matchScore: true,
            shelter: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: { pickupBy: 'asc' },
      take: limit,
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Listings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST — Create a new food listing
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (user.role !== 'restaurant' && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only restaurants can create listings' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, mealCount, mealType, pickupAddress, pickupBy, photoUrl } = body;

    if (!title || !mealCount || !pickupAddress || !pickupBy) {
      return NextResponse.json(
        { error: 'Missing required fields: title, mealCount, pickupAddress, pickupBy' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        restaurantId: user.userId,
        title,
        description,
        mealCount: parseInt(mealCount),
        mealType: JSON.stringify(mealType || []),
        pickupAddress,
        pickupBy: new Date(pickupBy),
        photoUrl,
      },
      include: {
        restaurant: {
          select: {
            id: true,
            displayName: true,
            address: true,
          },
        },
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error('Listing creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
