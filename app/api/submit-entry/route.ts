import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { type NextRequest, NextResponse } from 'next/server';
import path from 'path';

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

    // Create entry object
    const entry: ContestEntry = {
      id: crypto.randomUUID(),
      giftCardChoice,
      venmoUsername: venmoUsername.trim(),
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || undefined,
    };

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    const filePath = path.join(dataDir, 'contest-entries.json');

    // Read existing entries or create empty array
    let entries: ContestEntry[] = [];
    try {
      const existingData = await readFile(filePath, 'utf-8');
      entries = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      entries = [];
    }

    // Add new entry
    entries.push(entry);

    // Write back to file
    await writeFile(filePath, JSON.stringify(entries, null, 2));

    return NextResponse.json({ success: true, entryId: entry.id });
  } catch (error) {
    console.error('Error saving entry:', error);
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
  }
}
