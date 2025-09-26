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
  const handleCardClick = (cardName: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onSelectAction(cardName.toLowerCase());
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className="card-3d">
        {giftCards.map((card) => {
          const isSelected = selectedGiftCard === card.name.toLowerCase();
          return (
            <div
              key={card.name}
              onClick={(e) => handleCardClick(card.name, e)}
              className={`card-item ${
                card.image
                  ? 'bg-transparent'
                  : `${card.color} flex flex-col items-center justify-center text-white font-bold text-sm`
              } cursor-pointer relative ${
                isSelected ? 'ring-4 ring-primary shadow-2xl' : ''
              }`}
            >
              {card.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image || '/placeholder.svg'}
                    alt={`${card.name} gift card`}
                    className="w-full h-full object-cover rounded-lg"
                    draggable={false}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-lg">
                      <div className="bg-white/95 text-primary px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                        ✓ SELECTED
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">{card.logo}</div>
                  <div className="text-center px-2">{card.name}</div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-lg">
                      <div className="bg-white/95 text-primary px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                        ✓ SELECTED
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
