'use client';

import { getStableUserID } from '@/utils/getStableUserID';
import { useEffect } from 'react';

type ConsoleLevel = 'log' | 'info' | 'warn' | 'error';

export default function ConsoleCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const original: Record<ConsoleLevel, (...args: any[]) => void> = {
      log: console.log.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
    };

    const buffer: Array<{
      level: ConsoleLevel;
      args: unknown[];
      ts: string;
      path: string;
      ua: string;
      userId: string;
    }> = [];

    let flushing = false;
    const userId = getStableUserID();

    function enqueue(level: ConsoleLevel, args: unknown[]) {
      try {
        // Avoid recursive logging if our own fetch fails
        if (typeof args[0] === 'string' && (args[0] as string).includes('/api/client-logs')) {
          return;
        }
        buffer.push({
          level,
          args: args.map((a) => {
            try {
              return typeof a === 'string' ? a : JSON.stringify(a);
            } catch {
              return String(a);
            }
          }),
          ts: new Date().toISOString(),
          path: window.location.pathname + window.location.search,
          ua: navigator.userAgent,
          userId,
        });
        if (buffer.length >= 20) flush();
      } catch {
        // ignore
      }
    }

    async function flush() {
      if (flushing || buffer.length === 0) return;
      flushing = true;
      const payload = { logs: buffer.splice(0, buffer.length) };
      try {
        // Prefer keepalive fetch; sendBeacon fallback
        const res = await fetch('/api/client-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        });
        if (!res.ok) {
          // fallback to beacon to try not to lose logs
          const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
          (navigator as any).sendBeacon?.('/api/client-logs', blob);
        }
      } catch {
        // swallow
      } finally {
        flushing = false;
      }
    }

    const interval = window.setInterval(flush, 3000);
    window.addEventListener('beforeunload', flush);

    (['log', 'info', 'warn', 'error'] as ConsoleLevel[]).forEach((level) => {
      console[level] = (...args: any[]) => {
        try {
          original[level](...args);
        } finally {
          enqueue(level, args);
        }
      };
    });

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('beforeunload', flush);
      (['log', 'info', 'warn', 'error'] as ConsoleLevel[]).forEach((level) => {
        console[level] = original[level];
      });
    };
  }, []);

  return null;
}
