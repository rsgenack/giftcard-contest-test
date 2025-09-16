"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Sparkles, Trophy } from "lucide-react"
import { useStatsigClient } from "@statsig/react-bindings"
import Image from "next/image"

type GiftCardChoice = "sephora" | "chipotle" | null

export default function ContestForm() {
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCardChoice>(null)
  const [venmoUsername, setVenmoUsername] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const statsigClient = useStatsigClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedGiftCard && venmoUsername.trim()) {
      setIsSubmitting(true)

      try {
        statsigClient.logEvent("contest_entry", selectedGiftCard, {
          venmo_username: venmoUsername.trim(),
          gift_card_choice: selectedGiftCard,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
        })

        setIsSubmitted(true)
      } catch (error) {
        console.error("Error submitting entry:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleCardSelection = (cardType: GiftCardChoice) => {
    setSelectedGiftCard(cardType)

    if (cardType && statsigClient) {
      statsigClient.logEvent("card_selection", cardType, {
        venmo_username: venmoUsername.trim() || null,
        timestamp: new Date().toISOString(),
      })
    }
  }

  const handleVenmoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenmoUsername(e.target.value)

    if (selectedGiftCard && statsigClient && e.target.value.trim()) {
      statsigClient.logEvent("card_selection", selectedGiftCard, {
        venmo_username: e.target.value.trim(),
        timestamp: new Date().toISOString(),
      })
    }
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center border-2 border-primary/20 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-8">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 pulse-glow">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              🎉 You're In! 🎉
            </CardTitle>
            <CardDescription className="text-lg mt-4 text-card-foreground">
              Your entry has been submitted successfully! We'll contact you via Venmo if you're our lucky winner.
            </CardDescription>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Thank you for helping with our research study!
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-white text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
          <Gift className="w-4 h-4" />
          Research Study Contest
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight">
          Win a $50 Gift Card!
        </h1>
        <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
          Help us understand consumer preferences by choosing your favorite gift card. Your participation makes a
          difference in our research!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Choose Your Preferred Gift Card</h2>
            <p className="text-muted-foreground">Select the gift card you'd prefer to win</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div
              className={`cursor-pointer card-hover-effect overflow-hidden rounded-lg transition-all duration-300 ${
                selectedGiftCard === "sephora"
                  ? "ring-4 ring-primary shadow-2xl pulse-glow"
                  : "hover:shadow-xl shadow-lg"
              }`}
              onClick={() => handleCardSelection("sephora")}
            >
              <div className="relative aspect-[1.586/1] bg-gradient-to-br from-black via-gray-900 to-black shadow-xl">
                <Image
                  src="/images/sephora-card.png"
                  alt="Sephora Gift Card"
                  fill
                  className="object-cover object-center scale-110"
                />
                {selectedGiftCard === "sephora" && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-white/95 text-primary px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                      ✓ SELECTED
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className={`cursor-pointer card-hover-effect overflow-hidden rounded-lg transition-all duration-300 ${
                selectedGiftCard === "chipotle"
                  ? "ring-4 ring-primary shadow-2xl pulse-glow"
                  : "hover:shadow-xl shadow-lg"
              }`}
              onClick={() => handleCardSelection("chipotle")}
            >
              <div className="relative aspect-[1.586/1] bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shadow-xl">
                <Image
                  src="/images/chipotle-card.png"
                  alt="Chipotle Gift Card"
                  fill
                  className="object-cover object-center scale-110"
                />
                {selectedGiftCard === "chipotle" && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-white/95 text-primary px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                      ✓ SELECTED
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {selectedGiftCard && (
          <Card className="max-w-lg mx-auto border-2 border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Complete Your Entry
              </CardTitle>
              <CardDescription className="text-base">Just one more step to enter the contest!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="venmo" className="text-base font-medium">
                  Venmo Username
                </Label>
                <Input
                  id="venmo"
                  type="text"
                  placeholder="@your-venmo-username"
                  value={venmoUsername}
                  onChange={handleVenmoChange}
                  required
                  className="h-12 text-base"
                />
                <p className="text-sm text-muted-foreground">We'll use this to send your prize if you win!</p>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={!selectedGiftCard || !venmoUsername.trim() || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "🎯 Submit My Entry"}
              </Button>
            </CardContent>
          </Card>
        )}
      </form>

      <footer className="mt-20 text-center space-y-4">
        <div className="max-w-2xl mx-auto p-6 bg-muted/50 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-2">
            🔒 This contest is for academic research purposes. Your data will be kept confidential and used only for
            research.
          </p>
          <p className="text-sm text-muted-foreground">
            By participating, you agree to our terms. Winner will be selected randomly and notified within 48 hours.
          </p>
        </div>
      </footer>
    </div>
  )
}
