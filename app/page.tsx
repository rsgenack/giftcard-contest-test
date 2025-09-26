'use client';

import ConsoleCapture from '@/components/console-capture';
import ContestForm from '@/components/contest-form';
import { GAPageview } from '@/components/ga-pageview';
import { STATSIG_CLIENT_KEY } from '@/constants/apiKeys';
import { trackGAEvent } from '@/lib/ga';
import { createStatsigLogger } from '@/lib/statsig-debug';
import { getStableUserID } from '@/utils/getStableUserID';
import { StatsigProvider, useStatsigClient } from '@statsig/react-bindings';
import { useEffect, useMemo, useState } from 'react';

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
  const [statsigUser, setStatsigUser] = useState(() => {
    if (typeof window === 'undefined') {
      return { userID: 'server' };
    }

    return { userID: getStableUserID() };
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stableUserID = getStableUserID();

    setStatsigUser((previousUser) => {
      if (previousUser.userID === stableUserID) {
        return previousUser;
      }

      return { userID: stableUserID };
    });
  }, []);

  return (
    <StatsigProvider sdkKey={STATSIG_CLIENT_KEY} user={statsigUser}>
      <PageWithStatsig />
    </StatsigProvider>
  );
}
