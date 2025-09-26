'use client';

import ContestForm from '@/components/contest-form';
import { getStableUserID } from '@/utils/getStableUserID';
import { StatsigProvider, useClientAsyncInit, useStatsigClient } from '@statsig/react-bindings';
import WebAnalytics from '@statsig/web-analytics';
import { useEffect, useRef } from 'react';

function PageWithStatsig() {
  const statsig = useStatsigClient();
  const webAnalyticsInitialized = useRef(false);
  const statsigLogPatched = useRef(false);
  const pageLoadLogged = useRef(false);

  // Use Statsig Web Analytics default page view tracking
  useEffect(() => {
    if (statsig && !webAnalyticsInitialized.current) {
      try {
        // Initialize default page view tracking once
        // WebAnalytics is expected to expose an init method
        // Falls back safely if not present
        (WebAnalytics as any)?.init?.(statsig);
      } catch (e) {
        console.error('[Statsig Web Analytics] init failed', e);
      }
      webAnalyticsInitialized.current = true;
    }
  }, [statsig]); // Keep statsig in deps but prevent re-initialization

  // Console log every Statsig event capture
  useEffect(() => {
    if (!statsig || statsigLogPatched.current) return;
    try {
      const original = (statsig as any).logEvent?.bind(statsig);
      if (typeof original === 'function') {
        (statsig as any).logEvent = (
          eventName: string,
          value?: number | string,
          metadata?: Record<string, any>,
        ) => {
          const result = original(eventName, value, metadata);
          try {
            console.log('[Statsig] Event captured:', { eventName, value, metadata });
            if (typeof (statsig as any).flush === 'function') {
              (statsig as any).flush();
            } else if (typeof (statsig as any).flushEvents === 'function') {
              (statsig as any).flushEvents();
            }
          } catch {}
          return result;
        };
      }
      statsigLogPatched.current = true;
    } catch {}
  }, [statsig]);

  // Explicitly log a one-time page load event
  useEffect(() => {
    if (!statsig || pageLoadLogged.current) return;
    try {
      const path =
        typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
      (statsig as any)?.logEvent?.('page_loaded', 1, { path });
      pageLoadLogged.current = true;
    } catch {}
  }, [statsig]);

  return (
    <main className="p-6">
      <ContestForm />
    </main>
  );
}

export default function App() {
  const { client, isLoading } = useClientAsyncInit(process.env.YOUR_CLIENT_API_KEY as string, {
    userID: getStableUserID(),
  });

  if (isLoading) return null;

  return (
    <StatsigProvider client={client}>
      <PageWithStatsig />
    </StatsigProvider>
  );
}
