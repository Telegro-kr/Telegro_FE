import { useEffect, useMemo, useState } from 'react';

export type ChartFilter = 'daily' | 'monthly' | 'weekday' | 'company';

export type DataPoint = {
  id: string;
  label: string;
  subLabel?: string;
  tooltipLabel: string;
  value: number;
};

export type DatasetPayload = {
  totalCount: number;
  data: DataPoint[];
  canGoPrev: boolean;
  canGoNext: boolean;
  pageLabel: string;
};

export type HoverState = {
  index: number;
  x: number;
  y: number;
} | null;

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
};

export const FILTER_OPTIONS: DropdownOption<ChartFilter>[] = [
  { value: 'daily', label: '일별' },
  { value: 'monthly', label: '월별' },
  { value: 'weekday', label: '요일별' },
  { value: 'company', label: '업체별' },
];

const PAGE_SIZE = 9;
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const MONTH_LABELS = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
] as const;
export const MONTHS = MONTH_LABELS;

const DAILY_VALUES = [
  96, 101, 90, 93, 76, 100, 80, 90, 74, 88, 94, 97, 82, 104, 92, 86, 95, 79,
  109, 111, 98, 103, 85, 100, 106, 93, 87,
];

const COMPANY_VALUES = [
  ['A업체', 160],
  ['B업체', 132],
  ['C업체', 98],
  ['D업체', 174],
  ['E업체', 146],
  ['F업체', 120],
  ['G업체', 154],
  ['H업체', 111],
  ['I업체', 139],
  ['J업체', 126],
  ['K업체', 118],
  ['L업체', 143],
] as const;

const WEEKDAY_DATA: DataPoint[] = [
  { id: 'w-mon', label: '월', tooltipLabel: '월요일', value: 124 },
  { id: 'w-tue', label: '화', tooltipLabel: '화요일', value: 118 },
  { id: 'w-wed', label: '수', tooltipLabel: '수요일', value: 102 },
  { id: 'w-thu', label: '목', tooltipLabel: '목요일', value: 110 },
  { id: 'w-fri', label: '금', tooltipLabel: '금요일', value: 145 },
  { id: 'w-sat', label: '토', tooltipLabel: '토요일', value: 84 },
  { id: 'w-sun', label: '일', tooltipLabel: '일요일', value: 72 },
];

const MONTHLY_VALUES_BY_YEAR: Record<number, number[]> = {
  2025: [84, 92, 101, 95, 104, 112, 118, 115, 109, 121, 96, 89],
  2026: [88, 103, 116, 99, 91, 107, 121, 114, 108, 124, 111, 97],
  2027: [93, 108, 119, 104, 98, 112, 127, 120, 114, 129, 115, 101],
};

function sumValues(data: DataPoint[]) {
  return data.reduce((total, item) => total + item.value, 0);
}

function clampPage(page: number, maxPage: number) {
  return Math.min(Math.max(page, 0), maxPage);
}

function formatDate(date: Date) {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function buildDailyData(page: number): DatasetPayload {
  const allData = DAILY_VALUES.map((value, index) => {
    const date = new Date(2026, 2, 3 + index);
    const dayName = DAY_NAMES[date.getDay()];

    return {
      id: `d-${index}`,
      label: dayName,
      subLabel: String(date.getDate()),
      tooltipLabel: formatDate(date),
      value,
    };
  });

  const maxPage = Math.max(Math.ceil(allData.length / PAGE_SIZE) - 1, 0);
  const currentPage = clampPage(page, maxPage);
  const start = currentPage * PAGE_SIZE;
  const data = allData.slice(start, start + PAGE_SIZE);

  return {
    totalCount: sumValues(data),
    data,
    canGoPrev: currentPage > 0,
    canGoNext: currentPage < maxPage,
    pageLabel: `${data[0]?.tooltipLabel ?? ''} - ${data[data.length - 1]?.tooltipLabel ?? ''}`,
  };
}

function buildMonthlyData(year: number, page: number): DatasetPayload {
  const values = MONTHLY_VALUES_BY_YEAR[year] ?? MONTHLY_VALUES_BY_YEAR[2026];
  const allData = values.map((value, index) => ({
    id: `m-${year}-${index + 1}`,
    label: MONTH_LABELS[index],
    tooltipLabel: `${year}년 ${index + 1}월`,
    value,
  }));

  const maxPage = Math.max(Math.ceil(allData.length / PAGE_SIZE) - 1, 0);
  const currentPage = clampPage(page, maxPage);
  const start = currentPage * PAGE_SIZE;
  const data = allData.slice(start, start + PAGE_SIZE);

  return {
    totalCount: sumValues(data),
    data,
    canGoPrev: currentPage > 0,
    canGoNext: currentPage < maxPage,
    pageLabel: `${year}년 ${data[0]?.label ?? ''} - ${data[data.length - 1]?.label ?? ''}`,
  };
}

function buildWeekdayData(): DatasetPayload {
  return {
    totalCount: sumValues(WEEKDAY_DATA),
    data: WEEKDAY_DATA,
    canGoPrev: false,
    canGoNext: false,
    pageLabel: '요일별 평균',
  };
}

function buildCompanyData(page: number): DatasetPayload {
  const allData = COMPANY_VALUES.map(([name, value], index) => ({
    id: `c-${index + 1}`,
    label: name,
    tooltipLabel: name,
    value,
  }));

  const maxPage = Math.max(Math.ceil(allData.length / PAGE_SIZE) - 1, 0);
  const currentPage = clampPage(page, maxPage);
  const start = currentPage * PAGE_SIZE;
  const data = allData.slice(start, start + PAGE_SIZE);

  return {
    totalCount: sumValues(data),
    data,
    canGoPrev: currentPage > 0,
    canGoNext: currentPage < maxPage,
    pageLabel: `${start + 1} - ${start + data.length}위 업체`,
  };
}

export function useAccessStatusChart() {
  const [filter, setFilter] = useState<ChartFilter>('daily');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [isReady, setIsReady] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [hovered, setHovered] = useState<HoverState>(null);
  const [pageByFilter, setPageByFilter] = useState<Record<ChartFilter, number>>(
    {
      daily: 0,
      monthly: 0,
      weekday: 0,
      company: 0,
    },
  );

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    setHovered(null);
    if (filter !== 'daily') {
      setIsMonthPickerOpen(false);
    }
    if (filter !== 'monthly') {
      setIsYearPickerOpen(false);
    }
  }, [filter, selectedYear, selectedMonth, pageByFilter]);

  useEffect(() => {
    setPageByFilter((prev) => ({ ...prev, monthly: 0 }));
  }, [selectedYear]);

  useEffect(() => {
    setPageByFilter((prev) => ({
      ...prev,
      monthly: selectedMonth >= 10 ? 1 : 0,
    }));
  }, [selectedMonth]);

  const dataset = useMemo(() => {
    switch (filter) {
      case 'daily':
        return buildDailyData(pageByFilter.daily);
      case 'monthly':
        return buildMonthlyData(selectedYear, pageByFilter.monthly);
      case 'weekday':
        return buildWeekdayData();
      case 'company':
        return buildCompanyData(pageByFilter.company);
    }
  }, [filter, pageByFilter, selectedYear]);

  const activeFilterLabel =
    FILTER_OPTIONS.find((option) => option.value === filter)?.label ?? '일별';

  function movePage(direction: 'prev' | 'next') {
    setPageByFilter((prev) => {
      const delta = direction === 'prev' ? -1 : 1;
      const nextPage = Math.max(prev[filter] + delta, 0);

      if (filter === 'monthly') {
        setSelectedMonth(nextPage === 0 ? 1 : 10);
      }

      return {
        ...prev,
        [filter]: nextPage,
      };
    });
  }

  return {
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
    activeMonthLabel: `${selectedMonth}월`,
    activeYearLabel: `${selectedYear}년`,
    goToPrevPage: () => movePage('prev'),
    goToNextPage: () => movePage('next'),
  };
}
