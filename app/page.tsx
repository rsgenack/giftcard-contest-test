'use client';

import ConsoleCapture from '@/components/console-capture';
import ContestForm from '@/components/contest-form';
import { GAPageview } from '@/components/ga-pageview';
import { STATSIG_CLIENT_KEY } from '@/constants/apiKeys';
import { trackGAEvent } from '@/lib/ga';
import { createStatsigLogger } from '@/lib/statsig-debug';
import { getStableUserID } from '@/utils/getStableUserID';
import { StatsigProvider, useClientAsyncInit, useStatsigClient } from '@statsig/react-bindings';
import { useEffect } from 'react';

function PageWithStatsig() {
  const { isLoading } = useClientAsyncInit(STATSIG_CLIENT_KEY, {
    userID: getStableUserID(),
  });
  const statsig = useStatsigClient();
  const statsigLogger = createStatsigLogger(statsig);

  useEffect(() => {
    if (!isLoading && statsig) {
      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      statsigLogger.logEvent('page_loaded', 1, { path });
      trackGAEvent('page_loaded', { path });
    }
  }, [isLoading, statsig, statsigLogger]);

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
