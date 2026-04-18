// ═══════════════════════════════════════════════════════
// MealBridge — /api/auth/register
// Creates user account + provisions Locus wallet
// ═══════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createToken, getAuthCookieOptions } from '@/lib/auth';
import { LocusPayClient } from '@/lib/locus-pay';
import { encrypt } from '@/lib/encrypt';

const VALID_ROLES = ['restaurant', 'shelter', 'sponsor', 'driver', 'admin'] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, displayName, role, address, lat, lng, phone, website, capacity } = body;

    // Validate required fields
    if (!email || !password || !displayName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, displayName, role' },
        { status: 400 }
      );
    }

    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Provision Locus wallet
    let locusApiKeyEnc: string | undefined;
    let locusWalletAddress: string | undefined;
    let locusOwnerAddress: string | undefined;
    let locusClaimUrl: string | undefined;
    let walletStatus = 'pending';

    try {
      const walletResult = await LocusPayClient.register(
        `MealBridge-${role}-${displayName}`,
        email
      );

      if (walletResult.apiKey) {
        locusApiKeyEnc = encrypt(walletResult.apiKey);
        locusOwnerAddress = walletResult.ownerPrivateKey
          ? encrypt(walletResult.ownerPrivateKey)
          : undefined;
        locusWalletAddress = walletResult.walletAddress;
        locusClaimUrl = walletResult.claimUrl;
        walletStatus = walletResult.walletAddress ? 'deployed' : 'deploying';
      }
    } catch (walletError) {
      // Wallet provisioning failure shouldn't block registration
      console.warn('Locus wallet provisioning failed:', walletError);
      walletStatus = 'failed';
    }

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        displayName,
        role,
        passwordHash,
        locusApiKeyEnc,
        locusWalletAddress,
        locusOwnerAddress,
        locusClaimUrl,
        walletStatus,
        address,
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        phone,
        website,
        capacity: capacity ? parseInt(capacity) : undefined,
      },
    });

    // Create JWT
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const cookieOptions = getAuthCookieOptions(token);

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          walletStatus: user.walletStatus,
          walletAddress: user.locusWalletAddress,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
