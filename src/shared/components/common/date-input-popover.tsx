import CalendarIcon from '@components/common/calendar-icon';
import { cn } from '@libs/cn';
import { useEffect, useMemo, useRef, useState } from 'react';

type DateInputPopoverProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  buttonClassName?: string;
  popoverClassName?: string;
};

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const parseDateString = (value: string) => {
  if (!value) return null;

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;

  return date;
};

const formatDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatDateLabel = (value: string, placeholder: string) => {
  const date = parseDateString(value);
  if (!date) return placeholder;

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`;
};

const isSameDate = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const DateInputPopover = ({
  value,
  onChange,
  placeholder = '날짜 선택',
  ariaLabel,
  buttonClassName,
  popoverClassName,
}: DateInputPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = useMemo(() => parseDateString(value), [value]);
  const [viewDate, setViewDate] = useState<Date>(() => selectedDate ?? new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const today = new Date();
  const monthLabel = `${viewDate.getFullYear()}.${String(viewDate.getMonth() + 1).padStart(2, '0')}`;

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();

    return Array.from({ length: 42 }, (_, index) => {
      const dayNumber = index - firstWeekday + 1;
      const date = new Date(year, month, dayNumber);

      return {
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        date,
        label: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
      };
    });
  }, [viewDate]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center justify-between gap-3 rounded-[1.2rem] border border-[#E6E6E6] bg-white px-4 text-left text-[1.4rem] text-[#2B2B2B] transition-colors outline-none hover:border-[#D9D9D9]',
          !value && 'text-[#9C9CA4]',
          buttonClassName,
        )}
      >
        <span>{formatDateLabel(value, placeholder)}</span>
        <span className="text-[#7A7D8B]">
          <CalendarIcon />
        </span>
      </button>

      {isOpen ? (
        <div
          role="dialog"
          aria-label={ariaLabel}
          className={cn(
            'absolute top-[calc(100%+0.875rem)] left-0 z-40 w-[28rem] rounded-[1.5rem] bg-white p-5 shadow-[0_0_14.78px_rgba(88,88,88,0.12)]',
            popoverClassName,
          )}
        >
          <div className="mb-5 flex items-center justify-center gap-5">
            <ArrowButton
              direction="left"
              onClick={() =>
                setViewDate(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
            />
            <div className="min-w-[7rem] text-center text-[1.35rem] font-medium text-[#3F4150] md:text-[1.45rem]">
              {monthLabel}
            </div>
            <ArrowButton
              direction="right"
              onClick={() =>
                setViewDate(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
            />
          </div>

          <div className="mb-3 grid grid-cols-7 gap-y-2">
            {WEEKDAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-center text-[1.05rem] font-medium text-[#9B9EAA]"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-x-1 gap-y-2">
            {calendarDays.map(({ key, date, label, isCurrentMonth }) => {
              const isSelected = selectedDate ? isSameDate(date, selectedDate) : false;
              const isToday = isSameDate(date, today);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onChange(formatDateValue(date));
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex h-[3.2rem] items-center justify-center rounded-[0.8rem] text-[1.1rem] font-medium transition-all',
                    isSelected
                      ? 'bg-[#FFC633] text-white shadow-[0_8px_20px_rgba(255,198,51,0.28)]'
                      : isCurrentMonth
                        ? 'text-[#515468] hover:bg-[#F8F9FA]'
                        : 'text-[#C7CAD3] hover:bg-[#FAFAFA]',
                    isToday && !isSelected && 'border border-[#FFE08A]',
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="flex h-[3.8rem] flex-1 items-center justify-center rounded-[0.95rem] bg-[#F8F9FA] text-[1.15rem] font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F1F3F5]"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(formatDateValue(today));
                setViewDate(today);
                setIsOpen(false);
              }}
              className="flex h-[3.8rem] flex-1 items-center justify-center rounded-[0.95rem] bg-[#FFC633] text-[1.15rem] font-semibold text-white transition-transform hover:scale-[1.01]"
            >
              오늘
            </button>
          </div>
        </div>
      ) : null}
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
      className="grid h-11 w-11 place-items-center rounded-full text-[#3F4150] transition-colors hover:bg-[#F8F9FA] md:h-12 md:w-12"
      aria-label={direction === 'left' ? '이전 달' : '다음 달'}
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

export default DateInputPopover;
