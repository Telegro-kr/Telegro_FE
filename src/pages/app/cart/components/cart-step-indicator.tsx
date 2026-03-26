import type { ReactNode } from 'react';
import { FiCheck, FiCreditCard, FiShoppingCart } from 'react-icons/fi';

type StepCircleProps = {
  active?: boolean;
  done?: boolean;
  icon: ReactNode;
  label: string;
};

function StepCircle({ active, done, icon, label }: StepCircleProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={[
          'flex h-16 w-16 items-center justify-center rounded-full border text-sm transition-colors',
          active || done
            ? 'border-black bg-black text-white'
            : 'border-neutral-200 bg-neutral-100 text-neutral-400',
        ].join(' ')}
      >
        {icon}
      </div>
      <span
        className={[
          'text-sm font-medium',
          active || done ? 'text-black' : 'text-neutral-400',
        ].join(' ')}
      >
        {label}
      </span>
    </div>
  );
}

export function CartStepIndicator() {
  return (
    <div className="flex items-start gap-4 sm:gap-6">
      <StepCircle
        active
        icon={<FiShoppingCart className="size-[1.75rem]" />}
        label="장바구니"
      />
      <div className="mt-8 h-px w-8 bg-neutral-200 sm:w-14" />
      <StepCircle icon={<FiCreditCard className="size-[1.75rem]" />} label="주문/결제" />
      <div className="mt-8 h-px w-8 bg-neutral-200 sm:w-14" />
      <StepCircle icon={<FiCheck className="size-[1.75rem]" />} label="주문완료" />
    </div>
  );
}
