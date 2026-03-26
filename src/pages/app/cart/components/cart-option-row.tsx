import { FiCheck, FiX } from 'react-icons/fi';

import type { CartOption } from '../cart.types';
import { formatWon } from '../cart.utils';
import { CartQtyControl } from './cart-qty-control';

type CartOptionRowProps = {
  option: CartOption;
  checked: boolean;
  onToggle: (optionId: string) => void;
  onUpdateQuantity: (optionId: string, delta: number) => void;
  onRemove: (optionId: string) => void;
};

export function CartOptionRow({
  option,
  checked,
  onToggle,
  onUpdateQuantity,
  onRemove,
}: CartOptionRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border border-neutral-100 bg-neutral-50 px-4 py-4 sm:px-5">
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(option.id)}
          aria-label={`${option.label} 선택`}
          className={[
            'mt-0.5 flex size-[2rem] shrink-0 items-center justify-center rounded-full border',
            checked
              ? 'border-black bg-black text-white'
              : 'border-neutral-300 bg-white text-transparent',
          ].join(' ')}
        >
          <FiCheck className="size-[1.2rem]" />
        </button>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium text-neutral-700">
            {option.label}. {option.volume} / {formatWon(option.price)}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <CartQtyControl
          value={option.quantity}
          onDecrease={() => onUpdateQuantity(option.id, -1)}
          onIncrease={() => onUpdateQuantity(option.id, 1)}
        />
        <button
          type="button"
          onClick={() => onRemove(option.id)}
          className="flex h-9 w-9 items-center justify-center text-neutral-300 hover:text-neutral-500"
          aria-label="옵션 삭제"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
