'use client';

import ConsoleCapture from '@/components/console-capture';
import ContestForm from '@/components/contest-form';
import { GAPageview } from '@/components/ga-pageview';
import { YOUR_CLIENT_API_KEY } from '@/constants/apiKeys';
import { getStableUserID } from '@/utils/getStableUserID';
import { StatsigProvider, useClientAsyncInit, useStatsigClient } from '@statsig/react-bindings';
import WebAnalytics from '@statsig/web-analytics';
import { useEffect, useRef } from 'react';

function PageWithStatsig() {
  const statsig = useStatsigClient();
  const webAnalyticsInitialized = useRef(false);

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

  return (
    <main className="p-6">
      <GAPageview />
      <ConsoleCapture />
      <ContestForm />
    </main>
  );
}

export default function App() {
  const { client, isLoading } = useClientAsyncInit(YOUR_CLIENT_API_KEY, {
    userID: getStableUserID(),
  });

  if (isLoading) return null;

  return (
    <StatsigProvider client={client}>
      <PageWithStatsig />
    </StatsigProvider>
  );
}
