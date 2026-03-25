import ActionSelectButton from '@components/admin/access-status/action-select-button';
import AccessStatusGraph from '@components/admin/access-status/access-status-graph';
import DropdownMenu from '@components/admin/access-status/dropdown-menu';
import MonthPickerPopover from '@components/admin/access-status/month-picker-popover';
import YearPickerPopover from '@components/admin/access-status/year-picker-popover';
import {
  FILTER_OPTIONS,
  useAccessStatusChart,
} from '@hooks/use-access-status-chart';
import { cn } from '@libs/cn';
import { useEffect, useRef, type RefObject } from 'react';

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

const AccessStatusChartSectionView = ({
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
  isYearPickerOpen,
  setIsYearPickerOpen,
  activeFilterLabel,
  activeMonthLabel,
  activeYearLabel,
  isLoading,
  isError,
  goToPrevPage,
  goToNextPage,
}: AccessStatusChartViewProps) => {
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const monthPickerRef = useRef<HTMLDivElement | null>(null);
  const yearPickerRef = useRef<HTMLDivElement | null>(null);

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
  useOutsideClick(
    yearPickerRef,
    () => setIsYearPickerOpen(false),
    isYearPickerOpen,
  );

  return (
    <section
      className={cn(
        'relative w-full overflow-visible rounded-[22px] border border-[#F2F2F7] bg-white px-6 py-4 md:px-10 md:py-6',
        'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        isReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      )}
    >
      <div className="mb-4 flex gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <h2 className="text-[1.75rem] leading-none font-semibold tracking-[-0.02em] text-[#1A1E22] md:text-[2rem]">
          {'\uC811\uC18D \uD604\uD669'}
        </h2>

        <div className="relative flex flex-wrap items-center justify-end gap-2 md:gap-3">
          {(filter === 'daily' ||
            filter === 'weekday' ||
            filter === 'company') && (
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

          {filter === 'monthly' && (
            <div ref={yearPickerRef} className="relative">
              <ActionSelectButton
                label={activeYearLabel}
                isOpen={isYearPickerOpen}
                onClick={() => {
                  setIsYearPickerOpen((prev) => !prev);
                  setIsFilterMenuOpen(false);
                  setIsMonthPickerOpen(false);
                }}
              />

              {isYearPickerOpen && (
                <div className="absolute top-[calc(100%+0.875rem)] right-0 z-40">
                  <YearPickerPopover
                    initialYear={selectedYear}
                    onClose={() => setIsYearPickerOpen(false)}
                    onApply={(year) => {
                      setSelectedYear(year);
                      setIsYearPickerOpen(false);
                    }}
                  />
                </div>
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
                setIsYearPickerOpen(false);
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
            {isLoading ? '...' : `${dataset.totalCount}\uD68C`}
          </strong>
        </div>
      </div>

      {isError ? (
        <div className="flex min-h-[27rem] items-center justify-center text-[1.6rem] text-red-500">
          {'\uC811\uC18D \uD1B5\uACC4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.'}
        </div>
      ) : isLoading ? (
        <div className="flex min-h-[27rem] items-center justify-center text-[1.6rem] text-gray-500">
          {'\uC811\uC18D \uD1B5\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.'}
        </div>
      ) : dataset.data.length === 0 ? (
        <div className="flex min-h-[27rem] items-center justify-center text-[1.6rem] text-gray-500">
          {'\uD45C\uC2DC\uD560 \uC811\uC18D \uD1B5\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.'}
        </div>
      ) : (
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
      )}
    </section>
  );
};

export default AccessStatusChartSectionView;
