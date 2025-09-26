'use client';

import Image from 'next/image';

export type GiftCardChoice = string | null;

type GiftCardItem = {
  id: string;
  imageSrc: string;
  alt: string;
  bgClassName?: string;
};

export default function GiftCardCarousel({
  selectedGiftCard,
  onSelectAction,
  items,
}: {
  selectedGiftCard: GiftCardChoice;
  onSelectAction: (choice: GiftCardChoice) => void;
  items?: GiftCardItem[];
}) {
  const cards: GiftCardItem[] =
    items && items.length > 0
      ? items
      : [
          { id: 'sephora', imageSrc: '/images/sephora-card.png', alt: 'Sephora Gift Card', bgClassName: 'bg-black' },
          { id: 'chipotle', imageSrc: '/images/chipotle-card.png', alt: 'Chipotle Gift Card', bgClassName: 'bg-gray-100' },
        ];
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 px-1">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectAction(card.id)}
            className={`min-w-[320px] snap-center rounded-lg overflow-hidden shadow-lg transition-all ${
              selectedGiftCard === card.id ? 'ring-4 ring-[#4991ff] shadow-2xl' : 'hover:shadow-xl'
            }`}
            aria-pressed={selectedGiftCard === card.id}
          >
            <div className={`relative aspect-[1.586/1] ${card.bgClassName || 'bg-white'}`}>
              <Image src={card.imageSrc} alt={card.alt} fill className="object-cover object-center" priority />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
