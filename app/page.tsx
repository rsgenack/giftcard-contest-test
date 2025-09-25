"use client";

import { StatsigProvider, useClientAsyncInit, useStatsigClient } from "@statsig/react-bindings";
import { useEffect } from "react";
import ContestForm from "@/components/contest-form";
import { STATSIG_CLIENT_KEY } from "@/constants/apiKeys";
import { getStableUserID } from "@/utils/getStableUserID";

function PageWithStatsig() {
  const { isLoading, error } = useClientAsyncInit(STATSIG_CLIENT_KEY, {
    userID: getStableUserID(),
  });
  const statsig = useStatsigClient();

  useEffect(() => {
    if (!isLoading && !error && statsig) {
      statsig.logEvent("page_loaded", 1, {
        path: typeof window !== "undefined" ? window.location.pathname : "/",
      });
    }
  }, [isLoading, error, statsig]);

  if (isLoading || error) return null;

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
