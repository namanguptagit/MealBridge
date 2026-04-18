// ═══════════════════════════════════════════════════════
// MealBridge — /api/health
// Required by BuildWithLocus for health checks
// ═══════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'mealbridge-web' });
}
