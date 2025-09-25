import { existsSync } from 'fs';
import { appendFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const dataDir = path.join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, 'client-logs.txt');
    const line = `[${new Date().toISOString()}] ${JSON.stringify(data)}\n`;
    await appendFile(filePath, line);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
