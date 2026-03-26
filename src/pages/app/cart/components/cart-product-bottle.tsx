import type { CartTone } from '../cart.types';

type CartProductBottleProps = {
  tone: CartTone;
};

export function CartProductBottle({ tone }: CartProductBottleProps) {
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-md bg-neutral-50">
      <div className="relative flex h-20 w-10 items-end justify-center">
        <div
          className={[
            'absolute top-0 h-3 w-4 rounded-t-sm border border-neutral-300',
            tone === 'amber' ? 'bg-neutral-100' : 'bg-white',
          ].join(' ')}
        />
        <div
          className={[
            'relative h-16 w-8 rounded-t-[10px] rounded-b-md border shadow-sm',
            tone === 'amber'
              ? 'border-amber-900/30 bg-gradient-to-b from-amber-100 via-amber-400 to-amber-800'
              : 'border-neutral-300 bg-gradient-to-b from-white via-neutral-100 to-neutral-300',
          ].join(' ')}
        >
          <div className="absolute top-5 left-1/2 h-6 w-5 -translate-x-1/2 rounded-sm border border-white/70 bg-white/80" />
        </div>
      </div>
    </div>
  );
}
