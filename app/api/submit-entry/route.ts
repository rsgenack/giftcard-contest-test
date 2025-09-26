import { type NextRequest, NextResponse } from 'next/server';

interface ContestEntry {
  id: string;
  giftCardChoice: 'sephora' | 'chipotle';
  venmoUsername: string;
  timestamp: string;
  userAgent?: string;
}

// Ensure Node.js runtime for filesystem access and disable caching
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftCardChoice, venmoUsername } = body;

    if (!giftCardChoice || !venmoUsername) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create entry object (no persistence required)
    const entry: ContestEntry = {
      id: crypto.randomUUID(),
      giftCardChoice,
      venmoUsername: venmoUsername.trim(),
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
    };

    // Optionally log receipt on the server for debugging
    console.log('[submit-entry] received', {
      id: entry.id,
      giftCardChoice: entry.giftCardChoice,
      venmoUsername: entry.venmoUsername,
      timestamp: entry.timestamp,
    });

    return NextResponse.json({ success: true, entryId: entry.id });
  } catch (error) {
    console.error('Error handling submit entry:', error);
    return NextResponse.json({ error: 'Failed to handle entry' }, { status: 500 });
  }
}
