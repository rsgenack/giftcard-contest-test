'use client';

import ConsoleCapture from '@/components/console-capture';
import ContestForm from '@/components/contest-form';
import { GAPageview } from '@/components/ga-pageview';
import { STATSIG_CLIENT_KEY } from '@/constants/apiKeys';
import { trackGAEvent } from '@/lib/ga';
import { createStatsigLogger } from '@/lib/statsig-debug';
import { getStableUserID } from '@/utils/getStableUserID';
import { StatsigProvider, useStatsigClient } from '@statsig/react-bindings';
import { useEffect, useMemo } from 'react';

function PageWithStatsig() {
  const { client: statsigClient, isLoading } = useStatsigClient();
  const statsigLogger = useMemo(() => createStatsigLogger(statsigClient), [statsigClient]);

  useEffect(() => {
    if (!isLoading && statsigClient) {
      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      statsigLogger.logEvent('page_loaded', 1, { path });
      trackGAEvent('page_loaded', { path });
    }
  }, [isLoading, statsigClient, statsigLogger]);

  if (isLoading) return null;

  return (
    <main className="p-6">
      <GAPageview />
      <ConsoleCapture />
      <ContestForm />
    </main>
  );
}

export default function App() {
  return (
    <StatsigProvider sdkKey={STATSIG_CLIENT_KEY} user={{ userID: getStableUserID() }}>
      <PageWithStatsig />
    </StatsigProvider>
  );
}
