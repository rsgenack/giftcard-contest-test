"use client"

import { StatsigProvider, useClientAsyncInit } from "@statsig/react-bindings"
import ContestForm from "@/components/contest-form"
import { STATSIG_CLIENT_KEY } from "@/constants/apiKeys"

function App() {
  const { client, isLoading } = useClientAsyncInit(STATSIG_CLIENT_KEY, { userID: "a-user" })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your contest experience...</p>
        </div>
      </div>
    )
  }

  return (
    <StatsigProvider client={client}>
      <main className="min-h-screen bg-white">
        {" "}
        {/* changed from hero-gradient to bg-white for clean white background */}
        <ContestForm />
      </main>
    </StatsigProvider>
  )
}

export default App
