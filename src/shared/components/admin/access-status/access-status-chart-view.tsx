import {
  useEffect,
  useRef,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
import {
  FILTER_OPTIONS,
  MONTHS,
  useAccessStatusChart,
  type ChartFilter,
  type DataPoint,
  type DropdownOption,
  type HoverState,
} from '@hooks/use-access-status-chart';

type AccessStatusChartViewProps = ReturnType<typeof useAccessStatusChart>;

function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClose: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    function handlePointerDown(event: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [enabled, onClose, ref]);
}

export function AccessStatusChartSectionView({
  filter,
  setFilter,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  isReady,
  dataset,
  hovered,
  setHovered,
  isFilterMenuOpen,
  setIsFilterMenuOpen,
  isMonthPickerOpen,
  setIsMonthPickerOpen,
  activeFilterLabel,
  activeMonthLabel,
  activeYearLabel,
  goToPrevPage,
  goToNextPage,
}: AccessStatusChartViewProps) {
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const monthPickerRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(
    filterMenuRef,
    () => setIsFilterMenuOpen(false),
    isFilterMenuOpen,
  );
  useOutsideClick(
    monthPickerRef,
    () => setIsMonthPickerOpen(false),
    isMonthPickerOpen,
  );

  return (
    <section
      className={[
        'relative w-full overflow-visible rounded-[2.2rem] border border-[#F2F2F7] bg-white px-6 py-6 md:px-10 md:py-9',
        'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        isReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      ].join(' ')}
    >
      <div className="mb-7 flex gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
        <h2 className="text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-[#1A1E22] md:text-[2rem]">
          접속 현황
        </h2>

        <div className="relative flex flex-wrap items-center justify-end gap-2 md:gap-3">
          {filter === 'monthly' && (
            <div ref={monthPickerRef} className="relative">
              <ActionSelectButton
                label={activeMonthLabel}
                isOpen={isMonthPickerOpen}
                onClick={() => {
                  setIsMonthPickerOpen((prev) => !prev);
                  setIsFilterMenuOpen(false);
                }}
              />

              {isMonthPickerOpen && (
                <MonthPickerPopover
                  year={selectedYear}
                  selectedMonth={selectedMonth}
                  onPrevYear={() => setSelectedYear((prev) => prev - 1)}
                  onNextYear={() => setSelectedYear((prev) => prev + 1)}
                  onSelectMonth={setSelectedMonth}
                  onClose={() => setIsMonthPickerOpen(false)}
                />
              )}
            </div>
          )}

          <div ref={filterMenuRef} className="relative">
            <ActionSelectButton
              label={activeFilterLabel}
              isOpen={isFilterMenuOpen}
              onClick={() => {
                setIsFilterMenuOpen((prev) => !prev);
                setIsMonthPickerOpen(false);
              }}
            />

            {isFilterMenuOpen && (
              <DropdownMenu
                options={FILTER_OPTIONS}
                value={filter}
                onChange={(nextValue) => {
                  setFilter(nextValue);
                  setIsFilterMenuOpen(false);
                }}
              />
            )}
          </div>

          <strong className="text-[1.9rem] leading-none font-semibold tracking-[-0.03em] text-[#FFB800] md:text-[2.15rem]">
            {dataset.totalCount}회
          </strong>
        </div>
      </div>

      <AccessStatusGraph
        filter={filter}
        data={dataset.data}
        hovered={hovered}
        onHoverChange={setHovered}
        isReady={isReady}
        canGoPrev={dataset.canGoPrev}
        canGoNext={dataset.canGoNext}
        onPrev={goToPrevPage}
        onNext={goToNextPage}
      />
    </section>
  );
}

function ActionSelectButton({
  label,
  isOpen,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[1.5rem] font-semibold tracking-[-0.02em] text-[#444444]',
        'transition-colors duration-200',
        isOpen ? 'bg-[#F8F9FA]' : 'bg-transparent hover:bg-[#F8F9FA]',
      ].join(' ')}
    >
      <span>{label}</span>
      <svg
        className={[
          'h-4 w-4 shrink-0 text-[#737373] transition-transform duration-200',
          isOpen ? 'rotate-180' : 'rotate-0',
        ].join(' ')}
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 6L8 11L13 6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function DropdownMenu<T extends string>({
  options,
  value,
  onChange,
}: {
  options: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="absolute top-[calc(100%+0.625rem)] right-0 z-30 min-w-[8.5rem] rounded-2xl border border-[#F0F0F0] bg-white p-2 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[0.95rem] font-medium transition-colors',
              active
                ? 'bg-[#FFF4CF] text-[#1A1A1A]'
                : 'text-[#515468] hover:bg-[#F8F9FA]',
            ].join(' ')}
          >
            <span>{option.label}</span>
            {active && (
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 text-[#FFB800]"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10.5L8 14.5L16 6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

function MonthPickerPopover({
  year,
  selectedMonth,
  onPrevYear,
  onNextYear,
  onSelectMonth,
  onClose,
}: {
  year: number;
  selectedMonth: number;
  onPrevYear: () => void;
  onNextYear: () => void;
  onSelectMonth: Dispatch<SetStateAction<number>>;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-[calc(100%+0.875rem)] right-0 z-40 w-[19rem] rounded-[1.5rem] bg-white p-4 shadow-[0_0_14.78px_rgba(88,88,88,0.12)] md:w-[20.5rem] md:p-5">
      <div className="mb-4 flex items-center justify-center gap-4">
        <IconCircleButton direction="left" onClick={onPrevYear} />
        <div className="min-w-[4.5rem] text-center text-[1.15rem] font-medium text-[#3F4150] md:text-[1.25rem]">
          {year}
        </div>
        <IconCircleButton direction="right" onClick={onNextYear} />
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-3">
        {MONTHS.map((monthLabel, index) => {
          const monthNumber = index + 1;
          const active = monthNumber === selectedMonth;

          return (
            <button
              key={monthLabel}
              type="button"
              onClick={() => onSelectMonth(monthNumber)}
              className={[
                'flex h-[2.65rem] items-center justify-center rounded-[0.8rem] px-3 text-[0.95rem] font-medium transition-all',
                active
                  ? 'bg-[#FFC633] text-white shadow-[0_8px_20px_rgba(255,198,51,0.28)]'
                  : 'text-[#515468] hover:bg-[#F8F9FA]',
              ].join(' ')}
            >
              {monthLabel}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex h-[3.15rem] flex-1 items-center justify-center rounded-[0.95rem] bg-[#F8F9FA] text-[1rem] font-semibold text-[#1A1A1A] transition-colors hover:bg-[#F1F3F5]"
        >
          닫기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-[3.15rem] flex-1 items-center justify-center rounded-[0.95rem] bg-[#FFC633] text-[1rem] font-semibold text-white transition-transform hover:scale-[1.01]"
        >
          선택 완료
        </button>
      </div>
    </div>
  );
}

function IconCircleButton({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-10 w-10 place-items-center rounded-full text-[#3F4150] transition-colors hover:bg-[#F8F9FA]"
      aria-label={direction === 'left' ? '이전 연도' : '다음 연도'}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
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
}

function AccessStatusGraph({
  filter,
  data,
  hovered,
  onHoverChange,
  isReady,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: {
  filter: ChartFilter;
  data: DataPoint[];
  hovered: HoverState;
  onHoverChange: Dispatch<SetStateAction<HoverState>>;
  isReady: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  const width = 1040;
  const height = 300;
  const paddingX = 72;
  const headerSpace = 78;
  const bottomPadding = 36;
  const graphHeight = height - headerSpace - bottomPadding;
  const stepX =
    data.length > 1 ? (width - paddingX * 2) / (data.length - 1) : 0;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const minValue = Math.min(...data.map((item) => item.value), 0);
  const valueRange = Math.max(maxValue - minValue, 1);

  const points = data.map((item, index) => {
    const x = paddingX + stepX * index;
    const normalized = (item.value - minValue) / valueRange;
    const y =
      headerSpace + graphHeight - normalized * (graphHeight * 0.62) - 14;
    return { ...item, x, y };
  });

  const baselineY = headerSpace + graphHeight;
  const linePath = createSmoothPath(points);
  const areaPath = createAreaPath(points, baselineY);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-y-[7.4rem] left-0 z-10 hidden items-center md:flex">
        <GraphArrowButton
          direction="left"
          disabled={!canGoPrev}
          onClick={onPrev}
        />
      </div>
      <div className="pointer-events-none absolute inset-y-[7.4rem] right-0 z-10 hidden items-center md:flex">
        <GraphArrowButton
          direction="right"
          disabled={!canGoNext}
          onClick={onNext}
        />
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block w-full overflow-visible"
      >
        {points.map((point) => (
          <line
            key={`${point.id}-grid`}
            x1={point.x}
            y1={headerSpace - 10}
            x2={point.x}
            y2={baselineY}
            stroke="#B1B1B1"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
        ))}

        {points.map((point, index) => (
          <g key={`${point.id}-label`}>
            <text
              x={point.x}
              y={34}
              textAnchor="middle"
              className="fill-[#A9ADB5] text-[15px] font-semibold md:text-[16px]"
            >
              {point.label}
            </text>
            {point.subLabel && (
              <text
                x={point.x}
                y={56}
                textAnchor="middle"
                className="fill-[#2B2B2B] text-[16px] font-semibold md:text-[18px]"
              >
                {point.subLabel}
              </text>
            )}

            {hovered?.index === index && (
              <foreignObject
                x={point.x - 40}
                y={point.y - 58}
                width={80}
                height={40}
              >
                <div className="flex h-10 items-center justify-center rounded-[0.65rem] bg-white px-3 shadow-[0_8px_18px_rgba(0,0,0,0.12)]">
                  <span className="text-[0.95rem] font-semibold text-[#FFB800] md:text-[1.05rem]">
                    {point.value}
                  </span>
                </div>
              </foreignObject>
            )}
          </g>
        ))}

        <g
          style={{
            clipPath: isReady ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
            transition: 'clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <path
            d={areaPath}
            fill="url(#access-status-gradient)"
            opacity="0.92"
          />
        </g>

        <path
          d={linePath}
          fill="none"
          stroke="#FFC633"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={isReady ? 0 : 100}
          style={{
            transition:
              'stroke-dashoffset 1100ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        {hovered && points[hovered.index] && (
          <circle
            cx={points[hovered.index].x}
            cy={points[hovered.index].y}
            r="5"
            fill="#FFC633"
          />
        )}

        {points.map((point, index) => {
          const zoneWidth = index === points.length - 1 ? stepX / 2 : stepX;

          return (
            <rect
              key={`${point.id}-hover`}
              x={point.x - stepX / 2}
              y={0}
              width={Math.max(zoneWidth, 56)}
              height={height}
              fill="transparent"
              onMouseEnter={() =>
                onHoverChange({ index, x: point.x, y: point.y })
              }
              onMouseMove={() =>
                onHoverChange({ index, x: point.x, y: point.y })
              }
              onMouseLeave={() => onHoverChange(null)}
            />
          );
        })}

        <defs>
          <linearGradient
            id="access-status-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="rgba(255,198,51,0.22)" />
            <stop offset="100%" stopColor="rgba(255,198,51,0)" />
          </linearGradient>
        </defs>
      </svg>

      {hovered && data[hovered.index] ? (
        <div className="mt-2 text-right text-xl text-[#777]">
          <span className="font-medium text-[#444]">
            {data[hovered.index].tooltipLabel}
          </span>
          <span className="mx-1" />
          <span>{data[hovered.index].value}회</span>
        </div>
      ) : (
        <div className="mt-2 text-right text-xl text-[#A0A0A0]">
          {filter === 'daily'
            ? '좌우 버튼으로 이전 날짜와 다음 날짜 구간을 볼 수 있어요.'
            : '그래프에 마우스를 올리면 상세 수치가 보여요.'}
        </div>
      )}
    </div>
  );
}

function GraphArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'pointer-events-auto grid h-12 w-12 place-items-center rounded-full transition-colors',
        disabled
          ? 'cursor-not-allowed text-[#E5E5E5]'
          : 'text-[#D9D9D9] hover:text-[#B8B8B8]',
      ].join(' ')}
      aria-label={direction === 'left' ? '이전 구간 보기' : '다음 구간 보기'}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-9 w-9"
        fill="none"
        aria-hidden="true"
      >
        {direction === 'left' ? (
          <path
            d="M14.5 5L7.5 12L14.5 19"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M9.5 5L16.5 12L9.5 19"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

function createSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

function createAreaPath(
  points: Array<{ x: number; y: number }>,
  baselineY: number,
) {
  if (points.length === 0) return '';
  const line = createSmoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;
}
