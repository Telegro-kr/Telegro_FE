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
    <div className="inline-flex items-center overflow-hidden border border-neutral-200 bg-white text-[15px]">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-11 w-11 items-center justify-center border-r border-neutral-200 text-neutral-500 hover:bg-neutral-50"
      >
        <FiMinus className="h-4 w-4" />
      </button>
      <div className="flex h-11 min-w-12 items-center justify-center px-4 text-neutral-700">
        {value}
      </div>
      <button
        type="button"
        onClick={onIncrease}
        className="flex h-11 w-11 items-center justify-center border-l border-neutral-200 text-neutral-500 hover:bg-neutral-50"
      >
        <FiPlus className="h-4 w-4" />
      </button>
    </div>
  );
}
