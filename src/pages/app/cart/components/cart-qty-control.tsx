import { FiMinus, FiPlus } from 'react-icons/fi';

type CartQtyControlProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function CartQtyControl({
  value,
  onDecrease,
  onIncrease,
}: CartQtyControlProps) {
  return (
    <div className="inline-flex items-center overflow-hidden border border-neutral-200 bg-white text-sm">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-9 w-9 items-center justify-center border-r border-neutral-200 text-neutral-500 hover:bg-neutral-50"
      >
        <FiMinus className="h-3.5 w-3.5" />
      </button>
      <div className="flex h-9 min-w-10 items-center justify-center px-3 text-neutral-700">
        {value}
      </div>
      <button
        type="button"
        onClick={onIncrease}
        className="flex h-9 w-9 items-center justify-center border-l border-neutral-200 text-neutral-500 hover:bg-neutral-50"
      >
        <FiPlus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
