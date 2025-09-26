'use client';

export type GiftCardChoice = string | null;

const giftCards: Array<{ name: string; image?: string; color?: string; logo?: string }> = [
  { name: 'Sephora', image: '/sephora-gift-card.png' },
  { name: 'Etsy', image: '/etsy.png' },
  { name: 'Chipotle', image: '/chipotle-gift-card.png' },
  { name: 'Gap', image: '/gap.png' },
  { name: 'Lyft', image: '/lyft-gift-card-new.png' },
  { name: 'DoorDash', image: '/doordash-gift-card.png' },
  { name: 'Home Depot', image: '/home-depot-gift-card.png' },
  { name: 'Amazon', image: '/amazon.png' },
  { name: 'Starbucks', image: '/starbucks-gift-card.png' },
  { name: 'Lululemon', image: '/lululemon-gift-card-new.png' },
];

export default function GiftCardCarousel({
  selectedGiftCard,
  onSelectAction,
}: {
  selectedGiftCard: GiftCardChoice;
  onSelectAction: (choice: GiftCardChoice) => void;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="card-3d">
        {giftCards.map((card) => (
          <div
            key={card.name}
            onClick={() => onSelectAction(card.name.toLowerCase())}
            className={`card-item ${
              card.image
                ? 'bg-transparent'
                : `${card.color} flex flex-col items-center justify-center text-white font-bold text-sm`
            } cursor-pointer`}
          >
            {card.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={card.image || '/placeholder.svg'}
                alt={`${card.name} gift card`}
                className="w-full h-full object-cover rounded-lg"
                draggable={false}
              />
            ) : (
              <>
                <div className="text-4xl mb-2">{card.logo}</div>
                <div className="text-center px-2">{card.name}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
