"use client"

import { StatsigProvider, useClientAsyncInit } from "@statsig/react-bindings"
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics"
import { StatsigSessionReplayPlugin } from "@statsig/session-replay"
import ContestForm from "@/components/contest-form"

function App() {
  const id = "a-user" // Default user ID as per instructions
  const { client } = useClientAsyncInit(
    "client-PfSlqqw75DzVILCIoAmSHOYYFaeN2bVtPn8nsYftWcG",
    { userID: id },
    { plugins: [new StatsigAutoCapturePlugin(), new StatsigSessionReplayPlugin()] },
  )

  return (
    <StatsigProvider
      client={client}
      loadingComponent={<div className="flex items-center justify-center min-h-screen">Loading...</div>}
    >
      <main className="min-h-screen bg-background">
        <ContestForm />
      </main>
    </StatsigProvider>
  )
}

export default App
