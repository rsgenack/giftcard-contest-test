'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createStatsigLogger } from '@/lib/statsig-debug';
import { useStatsigClient } from '@statsig/react-bindings';
import { Gift, Sparkles, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import GiftCardCarousel from './gift-card-carousel';

type GiftCardChoice = 'sephora' | 'chipotle' | null;

export default function ContestForm() {
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCardChoice>(null);
  const [venmoUsername, setVenmoUsername] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState('');
  const statsigClient = useStatsigClient();
  const statsigLogger = createStatsigLogger(statsigClient);
  const showCarousel = !!statsigClient && statsigClient.checkGate?.('gift_card_carousel') === true;

  useEffect(() => {
    // No need to load existing submissions from localStorage
  }, []);

  const normalizeVenmoUsername = (username: string): string => {
    return username.trim().replace(/^@/, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGiftCard && venmoUsername.trim()) {
      setIsSubmitting(true);
      setDuplicateError('');

      try {
        const normalizedUsername = normalizeVenmoUsername(venmoUsername);

        // Log events to Statsig (include venmo username for winner selection)
        statsigLogger.logEvent('venmo_provided', 1, {
          provided: true,
          venmo_username: normalizedUsername,
        });

        statsigLogger.logEvent('contest_entry', 1, {
          gift_card_choice: selectedGiftCard,
          submitted: true,
          venmo_username: normalizedUsername,
        });

        setIsSubmitted(true);
      } catch (error) {
        console.error('Error submitting entry:', error);
        setDuplicateError('An error occurred while submitting your entry. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCardSelection = (cardType: GiftCardChoice) => {
    // Only log when the user changes the selection via click
    if (cardType && cardType !== selectedGiftCard) {
      statsigLogger.logEvent('gift_card_selected', 1, { gift_card_choice: cardType });
    }

    setSelectedGiftCard(cardType);
  };

  const handleVenmoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenmoUsername(e.target.value);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center border-2 border-primary/20 shadow-2xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-8">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 pulse-glow">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="text-3xl text-balance text-primary">🎉 You're In! 🎉</CardTitle>
            <CardDescription className="text-lg mt-4 text-card-foreground">
              Your entry has been submitted successfully! I'll contact you via Venmo if you're my
              lucky winner.
            </CardDescription>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Thank you for helping with my research study!
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-white text-primary border border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
          <Gift className="w-4 h-4" />
          Research Study Contest
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 text-foreground leading-tight">
          Win a $20 Gift Card!
        </h1>
        <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
          Help us understand consumer preferences by choosing your favorite gift card. Your
          participation makes a difference in our research!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Choose Your Preferred Gift Card</h2>
            <p className="text-muted-foreground">Select the gift card you'd prefer to win</p>
          </div>

          {showCarousel ? (
            <GiftCardCarousel selectedGiftCard={selectedGiftCard} onSelect={handleCardSelection} />
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div
                className={`cursor-pointer card-hover-effect overflow-hidden rounded-lg transition-all duration-300 ${
                  selectedGiftCard === 'sephora'
                    ? 'ring-4 ring-primary shadow-2xl pulse-glow'
                    : 'hover:shadow-xl shadow-lg'
                }`}
                onClick={() => handleCardSelection('sephora')}
              >
                <div className="relative aspect-[1.586/1] bg-gray-900 shadow-xl">
                  <Image
                    src="/images/sephora-card.png"
                    alt="Sephora Gift Card"
                    fill
                    className="object-cover object-center scale-110"
                  />
                  {selectedGiftCard === 'sephora' && (
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
                  selectedGiftCard === 'chipotle'
                    ? 'ring-4 ring-primary shadow-2xl pulse-glow'
                    : 'hover:shadow-xl shadow-lg'
                }`}
                onClick={() => handleCardSelection('chipotle')}
              >
                <div className="relative aspect-[1.586/1] bg-gray-100 shadow-xl">
                  <Image
                    src="/images/chipotle-card.png"
                    alt="Chipotle Gift Card"
                    fill
                    className="object-cover object-center scale-110"
                  />
                  {selectedGiftCard === 'chipotle' && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="bg-white/95 text-primary px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                        ✓ SELECTED
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedGiftCard && (
          <Card className="max-w-lg mx-auto border-2 border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Complete Your Entry
              </CardTitle>
              <CardDescription className="text-base">
                Just one more step to enter the contest!
              </CardDescription>
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
                <p className="text-sm text-muted-foreground">
                  I'll use this to send your prize if you win!
                </p>
                {duplicateError && (
                  <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                    {duplicateError}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={!selectedGiftCard || !venmoUsername.trim() || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : '🎯 Submit My Entry'}
              </Button>
            </CardContent>
          </Card>
        )}
      </form>

      <footer className="mt-20 text-center space-y-4">
        <div className="max-w-2xl mx-auto p-6 bg-muted/50 rounded-xl border border-border/50">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground mb-2">
              🧪 This is an experimental page that uses cookies for research purposes.
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>By submitting your entry, you are entering to win a gift card of your choice.</p>
            <p>All data will be deleted within 48 hours of collection.</p>
            <p>
              If you win, you will receive your gift card via Venmo from{' '}
              <span className="font-medium text-foreground">@rebecca-genack</span>.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Winner will be selected randomly and notified within 48 hours.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
