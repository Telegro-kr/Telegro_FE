import { useMemo, useState } from 'react';
import { cn } from '@libs/cn';

type YearPickerPopoverProps = {
  initialYear?: number;
  minYear?: number;
  onClose?: () => void;
  onApply?: (year: number) => void;
};

type YearPickerViewProps = {
  selectedYear: number;
  rangeLabel: string;
  years: number[];
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectYear: (year: number) => void;
  onClose: () => void;
  onApply: () => void;
};

const getPageStartYear = (year: number, minYear: number) => {
  const offset = year - minYear;
  const pageIndex = Math.floor(offset / 12);
  return minYear + pageIndex * 12;
};

const YearPickerPopover = ({
  initialYear = 2026,
  minYear = 2018,
  onClose,
  onApply,
}: YearPickerPopoverProps) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [pageStartYear, setPageStartYear] = useState(
    getPageStartYear(initialYear, minYear),
  );

  const years = useMemo(
    () => Array.from({ length: 12 }, (_, index) => pageStartYear + index),
    [pageStartYear],
  );

  const rangeLabel = `${years[0]}-${years[years.length - 1]}`;

  return (
    <YearPickerView
      selectedYear={selectedYear}
      rangeLabel={rangeLabel}
      years={years}
      onPrevPage={() => setPageStartYear((prev) => prev - 12)}
      onNextPage={() => setPageStartYear((prev) => prev + 12)}
      onSelectYear={setSelectedYear}
      onClose={() => onClose?.()}
      onApply={() => onApply?.(selectedYear)}
    />
  );
};

const YearPickerView = ({
  selectedYear,
  rangeLabel,
  years,
  onPrevPage,
  onNextPage,
  onSelectYear,
  onClose,
  onApply,
}: YearPickerViewProps) => {
  return (
    <div className="inline-flex w-[20rem] flex-col rounded-[1.5rem] bg-white p-5 shadow-[0_0_14px_rgba(88,88,88,0.12)]">
      <div className="mb-4 flex items-center justify-center gap-2">
        <ArrowButton direction="left" onClick={onPrevPage} />
        <div className="min-w-[8.5rem] px-3 py-2 text-center text-[1.125rem] leading-6 font-medium text-[#3F4150]">
          {rangeLabel}
        </div>
        <ArrowButton direction="right" onClick={onNextPage} />
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-4 px-1 pb-1">
        {years.map((year) => {
          const isSelected = year === selectedYear;

          return (
            <button
              key={year}
              type="button"
              onClick={() => onSelectYear(year)}
              className={cn(
                'flex h-10 items-center justify-center rounded-lg px-3 text-[1.125rem] leading-6 font-medium transition-all',
                isSelected
                  ? 'bg-[#FFC633] text-white'
                  : 'text-[#515468] hover:bg-[#F8F9FA]',
              )}
            >
              {year}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#F1F1F4] px-3 text-[1.125rem] leading-6 font-semibold text-[#3F4150] transition-colors hover:bg-[#E9E9EE]"
        >
          닫기
        </button>

        <button
          type="button"
          onClick={onApply}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#FFC633] px-3 text-[1.125rem] leading-6 font-semibold text-white transition-transform hover:scale-[1.01]"
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};

const ArrowButton = ({
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
      aria-label={direction === 'left' ? '이전 연도 범위' : '다음 연도 범위'}
      className="grid h-10 w-10 place-items-center rounded-full text-[#3F4150] transition-colors hover:bg-[#F8F9FA]"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
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

export default YearPickerPopover;
