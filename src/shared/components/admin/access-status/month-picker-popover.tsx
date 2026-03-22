import { type Dispatch, type SetStateAction } from 'react';
import { cn } from '@libs/cn';
import { MONTHS } from '@hooks/use-access-status-chart';

type MonthPickerPopoverProps = {
  year: number;
  selectedMonth: number;
  onPrevYear: () => void;
  onNextYear: () => void;
  onSelectMonth: Dispatch<SetStateAction<number>>;
  onClose: () => void;
};

const MonthPickerPopover = ({
  year,
  selectedMonth,
  onPrevYear,
  onNextYear,
  onSelectMonth,
  onClose,
}: MonthPickerPopoverProps) => {
  return (
    <div className="absolute top-[calc(100%+0.875rem)] right-0 z-40 w-[22rem] rounded-[1.5rem] bg-white p-5 shadow-[0_0_14.78px_rgba(88,88,88,0.12)] md:w-[24rem] md:p-6">
      <div className="mb-5 flex items-center justify-center gap-5">
        <IconCircleButton direction="left" onClick={onPrevYear} />
        <div className="min-w-[5.5rem] text-center text-[1.35rem] font-medium text-[#3F4150] md:text-[1.45rem]">
          {year}
        </div>
        <IconCircleButton direction="right" onClick={onNextYear} />
      </div>

      <div className="grid grid-cols-3 gap-x-4 gap-y-4">
        {MONTHS.map((monthLabel, index) => {
          const monthNumber = index + 1;
          const active = monthNumber === selectedMonth;

          return (
            <button
              key={monthLabel}
              type="button"
              onClick={() => onSelectMonth(monthNumber)}
              className={cn(
                'flex h-[3.2rem] items-center justify-center px-4 text-[1.1rem] font-medium transition-all',
                'rounded-[0.8rem]',
                active
                  ? 'bg-[#FFC633] text-white shadow-[0_8px_20px_rgba(255,198,51,0.28)]'
                  : 'text-[#515468] hover:bg-[#F8F9FA]',
              )}
            >
              {monthLabel}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex h-[3.8rem] flex-1 items-center justify-center rounded-[0.95rem] bg-[#F8F9FA] text-[1.15rem] font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F1F3F5]"
        >
          닫기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-[3.8rem] flex-1 items-center justify-center rounded-[0.95rem] bg-[#FFC633] text-[1.15rem] font-semibold text-white transition-transform hover:scale-[1.01]"
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};

const IconCircleButton = ({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full text-[#3F4150] transition-colors hover:bg-[#F8F9FA] md:h-12 md:w-12"
      aria-label={direction === 'left' ? '이전 연도' : '다음 연도'}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="none"
        aria-hidden="true"
      >
        {direction === 'left' ? (
          <path
            d="M14.5 5L7.5 12L14.5 19"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M9.5 5L16.5 12L9.5 19"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
};

export default MonthPickerPopover;
