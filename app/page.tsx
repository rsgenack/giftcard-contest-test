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

  // Use Statsig Web Analytics default page view tracking
  useEffect(() => {
    if (statsig && !webAnalyticsInitialized.current) {
      try {
        (WebAnalytics as any)?.init?.(statsig);
      } catch (e) {
        console.error('[Statsig Web Analytics] init failed', e);
      }
      webAnalyticsInitialized.current = true;
    }
  }, [statsig]);

  // Dev-only console log for every Statsig event capture
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
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
          } catch {}
          return result;
        };
      }
      statsigLogPatched.current = true;
    } catch {}
  }, [statsig]);

  // Flush buffered events on page hide/visibility change
  useEffect(() => {
    if (!statsig) return;
    const flush = () => {
      try {
        if (typeof (statsig as any).flush === 'function') {
          (statsig as any).flush();
        } else if (typeof (statsig as any).flushEvents === 'function') {
          (statsig as any).flushEvents();
        }
      } catch {}
    };
    const onHidden = () => flush();
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', onHidden);
    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', onHidden);
    };
  }, [statsig]);

  // Intentionally no explicit page load event

  return (
    <main className="p-6">
      <ContestForm />
    </main>
  );
}

export default function App() {
  // Compute the user ID once before initializing to avoid ID churn in Strict Mode
  const userID = getStableUserID();
  const { client, isLoading } = useClientAsyncInit(
    process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY as string,
    {
    userID,
    },
  );

  if (isLoading) return null;

  return (
    <StatsigProvider client={client}>
      <PageWithStatsig />
    </StatsigProvider>
  );
}
