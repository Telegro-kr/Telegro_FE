import { FiCheck } from 'react-icons/fi';

import type { CartItem } from '../cart.types';
import {
  formatWon,
  getItemTotalPrice,
  isItemFullySelected,
} from '../cart.utils';
import { CartOptionRow } from './cart-option-row';

type CartItemSectionProps = {
  item: CartItem;
  selectedOptionIds: string[];
  onToggleItem: (item: CartItem) => void;
  onToggleOption: (optionId: string) => void;
  onUpdateQuantity: (optionId: string, delta: number) => void;
  onRemoveOption: (optionId: string) => void;
  onRemoveItem: (itemId: string) => void;
};

export function CartItemSection({
  item,
  selectedOptionIds,
  onToggleItem,
  onToggleOption,
  onUpdateQuantity,
  onRemoveOption,
  onRemoveItem,
}: CartItemSectionProps) {
  const itemTotal = getItemTotalPrice(item);
  const itemSelected = isItemFullySelected(item, selectedOptionIds);

  return (
    <section className="py-7 lg:py-8">
      <div className="grid gap-5 lg:grid-cols-[60px_minmax(0,1.8fr)_1fr_1fr_1fr_140px] lg:items-center lg:gap-0">
        <div className="hidden lg:flex lg:justify-center">
          <button
            type="button"
            onClick={() => onToggleItem(item)}
            aria-label={`${item.name} 선택`}
            className={[
              'mt-1 flex size-[2rem] items-center justify-center rounded-full border',
              itemSelected
                ? 'border-black bg-black text-white'
                : 'border-neutral-300 bg-white text-transparent',
            ].join(' ')}
          >
            <FiCheck className="size-[1.2rem]" />
          </button>
        </div>

        <div className="flex gap-4 lg:pr-8">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-md bg-neutral-50">
            <img
              src={item.imageSrc}
              alt={item.name}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="pt-2">
            <h2 className="title5 mb-1">{item.name}</h2>
            <p className="caption3 text-neutral-500">{item.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm lg:contents">
          <div className="rounded-md bg-neutral-50 px-4 py-3 text-center lg:rounded-none lg:bg-transparent lg:px-2 lg:py-7">
            <div className="mb-1 text-[12px] text-neutral-400 lg:hidden">
              포인트
            </div>
            <div className="caption3">{formatWon(item.point)}</div>
          </div>
          <div className="rounded-md bg-neutral-50 px-4 py-3 text-center lg:rounded-none lg:bg-transparent lg:px-2 lg:py-7">
            <div className="mb-1 text-[12px] text-neutral-400 lg:hidden">
              할인
            </div>
            <div className="caption3">{formatWon(item.discount)}</div>
          </div>
          <div className="rounded-md bg-neutral-50 px-4 py-3 text-center lg:rounded-none lg:bg-transparent lg:px-2 lg:py-7">
            <div className="mb-1 text-[12px] text-neutral-400 lg:hidden">
              결제금액
            </div>
            <div className="caption3">{formatWon(itemTotal)}</div>
          </div>
        </div>

        <div className="flex gap-2 lg:flex-col lg:items-stretch lg:justify-start lg:px-4 lg:pt-1">
          <button
            type="button"
            className="caption4 h-10 border border-neutral-300 px-4 hover:bg-neutral-50"
          >
            옵션추가
          </button>
          <button
            type="button"
            className="caption4 h-10 bg-black px-4 text-white hover:bg-neutral-800"
          >
            바로 구매
          </button>
          <button
            type="button"
            onClick={() => onRemoveItem(item.id)}
            className="caption4 h-10 border border-neutral-300 px-4 text-neutral-500 hover:bg-neutral-50"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-3 lg:mt-6 lg:ml-[60px]">
        {item.options.map((option) => (
          <CartOptionRow
            key={option.id}
            option={option}
            checked={selectedOptionIds.includes(option.id)}
            onToggle={onToggleOption}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveOption}
          />
        ))}
      </div>
    </section>
  );
}
