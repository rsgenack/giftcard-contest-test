'use client';

import Image from 'next/image';

type GiftCardChoice = 'sephora' | 'chipotle' | null;

export default function GiftCardCarousel({
  selectedGiftCard,
  onSelect,
}: {
  selectedGiftCard: GiftCardChoice;
  onSelect: (choice: GiftCardChoice) => void;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-1">
        <button
          type="button"
          onClick={() => onSelect('sephora')}
          className={`min-w-[320px] snap-center rounded-lg overflow-hidden shadow-lg transition-all ${
            selectedGiftCard === 'sephora'
              ? 'ring-4 ring-[#4991ff] shadow-2xl'
              : 'hover:shadow-xl'
          }`}
          aria-pressed={selectedGiftCard === 'sephora'}
        >
          <div className="relative aspect-[1.586/1] bg-black">
            <Image
              src="/images/sephora-card.png"
              alt="Sephora Gift Card"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('chipotle')}
          className={`min-w-[320px] snap-center rounded-lg overflow-hidden shadow-lg transition-all ${
            selectedGiftCard === 'chipotle'
              ? 'ring-4 ring-[#4991ff] shadow-2xl'
              : 'hover:shadow-xl'
          }`}
          aria-pressed={selectedGiftCard === 'chipotle'}
        >
          <div className="relative aspect-[1.586/1] bg-gray-100">
            <Image
              src="/images/chipotle-card.png"
              alt="Chipotle Gift Card"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </button>
      </div>
    </div>
  );
}


