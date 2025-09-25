"use client";

import { StatsigProvider, useClientAsyncInit, useStatsigClient } from "@statsig/react-bindings";
import { useEffect } from "react";
import ContestForm from "@/components/contest-form";
import { STATSIG_CLIENT_KEY } from "@/constants/apiKeys";
import { getStableUserID } from "@/utils/getStableUserID";
import { trackGAEvent } from "@/lib/ga";

function PageWithStatsig() {
  const { isLoading } = useClientAsyncInit(STATSIG_CLIENT_KEY, {
    userID: getStableUserID(),
  });
  const statsig = useStatsigClient();

  useEffect(() => {
    if (!isLoading && statsig) {
      statsig.logEvent("page_loaded", 1, {
        path: typeof window !== "undefined" ? window.location.pathname : "/",
      });
      trackGAEvent("page_loaded", {
        path: typeof window !== "undefined" ? window.location.pathname : "/",
      });
    }
  }, [isLoading, statsig]);

  if (isLoading) return null;

  return (
    <main className="p-6">
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
