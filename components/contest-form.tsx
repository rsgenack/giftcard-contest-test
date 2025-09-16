"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Sparkles, Coffee } from "lucide-react"

type GiftCardChoice = "sephora" | "chipotle" | null

export default function ContestForm() {
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCardChoice>(null)
  const [venmoUsername, setVenmoUsername] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedGiftCard && venmoUsername.trim()) {
      // Here you would typically send the data to your backend
      console.log("Contest entry:", {
        giftCardChoice: selectedGiftCard,
        venmoUsername: venmoUsername.trim(),
      })
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-balance">Thank You for Participating!</CardTitle>
            <CardDescription className="text-lg">
              Your entry has been submitted successfully. We'll contact you via Venmo if you win!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-balance mb-4">Your Gift Card Preference Matters!</h1>
        <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
          Help us with our research study by choosing your preferred gift card. Enter to win a $50 gift card to your
          choice!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Gift Card Choice Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Choose Your Preferred Gift Card</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sephora Card */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedGiftCard === "sephora" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-card/80"
              }`}
              onClick={() => setSelectedGiftCard("sephora")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Sephora Gift Card</CardTitle>
                <CardDescription>
                  Perfect for beauty enthusiasts! Shop makeup, skincare, and fragrance from top brands.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  variant={selectedGiftCard === "sephora" ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedGiftCard("sephora")
                  }}
                >
                  {selectedGiftCard === "sephora" ? "Selected!" : "Choose Sephora"}
                </Button>
              </CardContent>
            </Card>

            {/* Chipotle Card */}
            <Card
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedGiftCard === "chipotle" ? "ring-2 ring-primary bg-primary/5" : "hover:bg-card/80"
              }`}
              onClick={() => setSelectedGiftCard("chipotle")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Coffee className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Chipotle Gift Card</CardTitle>
                <CardDescription>
                  For food lovers! Enjoy fresh, customizable Mexican-inspired meals and bowls.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  variant={selectedGiftCard === "chipotle" ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedGiftCard("chipotle")
                  }}
                >
                  {selectedGiftCard === "chipotle" ? "Selected!" : "Choose Chipotle"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Venmo Entry Section */}
        {selectedGiftCard && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Enter to Win!</CardTitle>
              <CardDescription className="text-center">
                Provide your Venmo username to complete your entry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="venmo">Venmo Username</Label>
                <Input
                  id="venmo"
                  type="text"
                  placeholder="@your-venmo-username"
                  value={venmoUsername}
                  onChange={(e) => setVenmoUsername(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={!selectedGiftCard || !venmoUsername.trim()}>
                Submit Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </form>

      {/* Footer Section */}
      <footer className="mt-16 text-center text-sm text-muted-foreground space-y-2">
        <p>
          This contest is for research purposes. Your data will be kept confidential and used only for academic
          research.
        </p>
        <p>By participating, you agree to our terms and conditions. Winner will be selected randomly.</p>
      </footer>
    </div>
  )
}
