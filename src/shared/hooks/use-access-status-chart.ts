import { useGetHits, type GetHitsParams, type HitDTO } from '@apis/telegro';
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
  { value: 'daily', label: '\uC77C\uACC4' },
  { value: 'monthly', label: '\uC6D4\uACC4' },
  { value: 'weekday', label: '\uC694\uC77C\uBCC4' },
  { value: 'company', label: '\uC5C5\uCCB4\uBCC4' },
];

const PAGE_SIZE = 9;
const MONTH_LABELS = [
  '1\uC6D4',
  '2\uC6D4',
  '3\uC6D4',
  '4\uC6D4',
  '5\uC6D4',
  '6\uC6D4',
  '7\uC6D4',
  '8\uC6D4',
  '9\uC6D4',
  '10\uC6D4',
  '11\uC6D4',
  '12\uC6D4',
] as const;

const WEEKDAY_LABEL_MAP: Record<string, { label: string; sort: number }> = {
  MONDAY: { label: '\uC6D4', sort: 0 },
  TUESDAY: { label: '\uD654', sort: 1 },
  WEDNESDAY: { label: '\uC218', sort: 2 },
  THURSDAY: { label: '\uBAA9', sort: 3 },
  FRIDAY: { label: '\uAE08', sort: 4 },
  SATURDAY: { label: '\uD1A0', sort: 5 },
  SUNDAY: { label: '\uC77C', sort: 6 },
};

const HIT_FILTER_MAP: Record<ChartFilter, string> = {
  daily: 'daily',
  monthly: 'monthly',
  weekday: 'weekly',
  company: 'company',
};

export const MONTHS = MONTH_LABELS;
const HITS_QUERY_STALE_TIME = 60_000;

function clampPage(page: number, maxPage: number) {
  return Math.min(Math.max(page, 0), maxPage);
}

function sumValues(data: DataPoint[]) {
  return data.reduce((total, item) => total + item.value, 0);
}

function getHitsParams(
  filter: ChartFilter,
  selectedYear: number,
  selectedMonth: number,
): GetHitsParams {
  switch (filter) {
    case 'daily':
      return {
        filteredBy: HIT_FILTER_MAP[filter],
        year: selectedYear,
        month: selectedMonth,
      };
    case 'monthly':
      return {
        filteredBy: HIT_FILTER_MAP[filter],
        year: selectedYear,
      };
    case 'weekday':
      return {
        filteredBy: HIT_FILTER_MAP[filter],
        year: selectedYear,
        month: selectedMonth,
      };
    case 'company':
      return {
        filteredBy: HIT_FILTER_MAP[filter],
        year: selectedYear,
        month: selectedMonth,
      };
  }
}

function parseDailyPoint(hit: HitDTO, selectedYear: number, selectedMonth: number) {
  const rawName = hit.name?.trim() || '';
  const day = Number(rawName.replace(/\D/g, ''));
  const safeDay = Number.isFinite(day) && day > 0 ? day : undefined;

  return {
    id: `daily-${rawName || safeDay || 'unknown'}`,
    label: safeDay ? `${safeDay}\uC77C` : rawName || '-',
    tooltipLabel: safeDay
      ? `${selectedYear}.${String(selectedMonth).padStart(2, '0')}.${String(safeDay).padStart(2, '0')}`
      : rawName || '-',
    value: hit.hit ?? 0,
    sort: safeDay ?? Number.MAX_SAFE_INTEGER,
  };
}

function parseMonthlyPoint(hit: HitDTO, selectedYear: number) {
  const rawName = hit.name?.trim() || '';
  const month = Number(rawName.replace(/\D/g, ''));
  const safeMonth = Number.isFinite(month) && month > 0 ? month : undefined;

  return {
    id: `monthly-${rawName || safeMonth || 'unknown'}`,
    label: safeMonth ? MONTH_LABELS[safeMonth - 1] ?? rawName : rawName || '-',
    tooltipLabel: safeMonth
      ? `${selectedYear}.${String(safeMonth).padStart(2, '0')}`
      : rawName || '-',
    value: hit.hit ?? 0,
    sort: safeMonth ?? Number.MAX_SAFE_INTEGER,
  };
}

function parseWeekdayPoint(hit: HitDTO) {
  const rawName = hit.name?.trim().toUpperCase() || '';
  const mapped = WEEKDAY_LABEL_MAP[rawName];

  return {
    id: `weekday-${rawName || 'unknown'}`,
    label: mapped?.label ?? (hit.name?.trim() || '-'),
    tooltipLabel: hit.name?.trim() || '-',
    value: hit.hit ?? 0,
    sort: mapped?.sort ?? Number.MAX_SAFE_INTEGER,
  };
}

function parseCompanyPoint(hit: HitDTO, index: number) {
  const name = hit.name?.trim() || `Company ${index + 1}`;

  return {
    id: `company-${index}-${name}`,
    label: name,
    tooltipLabel: name,
    value: hit.hit ?? 0,
    sort: index,
  };
}

function mapHitsToData(
  filter: ChartFilter,
  hits: HitDTO[],
  selectedYear: number,
  selectedMonth: number,
): DataPoint[] {
  switch (filter) {
    case 'daily':
      return hits
        .map((hit) => parseDailyPoint(hit, selectedYear, selectedMonth))
        .sort((a, b) => a.sort - b.sort)
        .map(({ sort, ...rest }) => rest);
    case 'monthly':
      return hits
        .map((hit) => parseMonthlyPoint(hit, selectedYear))
        .sort((a, b) => a.sort - b.sort)
        .map(({ sort, ...rest }) => rest);
    case 'weekday':
      return hits
        .map(parseWeekdayPoint)
        .sort((a, b) => a.sort - b.sort)
        .map(({ sort, ...rest }) => rest);
    case 'company':
      return hits.map(parseCompanyPoint).map(({ sort, ...rest }) => rest);
  }
}

function buildDataset(allData: DataPoint[], page: number, totalCount?: number): DatasetPayload {
  const maxPage = Math.max(Math.ceil(allData.length / PAGE_SIZE) - 1, 0);
  const currentPage = clampPage(page, maxPage);
  const start = currentPage * PAGE_SIZE;
  const data = allData.slice(start, start + PAGE_SIZE);

  return {
    totalCount: totalCount ?? sumValues(allData),
    data,
    canGoPrev: currentPage > 0,
    canGoNext: currentPage < maxPage,
    pageLabel: `${start + 1}-${start + data.length}`,
  };
}

export function useAccessStatusChart() {
  const [filter, setFilter] = useState<ChartFilter>('daily');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [isReady, setIsReady] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isYearPickerOpen, setIsYearPickerOpen] = useState(false);
  const [hovered, setHovered] = useState<HoverState>(null);
  const [pageByFilter, setPageByFilter] = useState<Record<ChartFilter, number>>({
    daily: 0,
    monthly: 0,
    weekday: 0,
    company: 0,
  });

  const dailyHitsQuery = useGetHits(
    getHitsParams('daily', selectedYear, selectedMonth),
    {
      query: {
        staleTime: HITS_QUERY_STALE_TIME,
      },
    },
  );
  const monthlyHitsQuery = useGetHits(getHitsParams('monthly', selectedYear, selectedMonth), {
    query: {
      staleTime: HITS_QUERY_STALE_TIME,
    },
  });
  const weekdayHitsQuery = useGetHits(
    getHitsParams('weekday', selectedYear, selectedMonth),
    {
      query: {
        staleTime: HITS_QUERY_STALE_TIME,
      },
    },
  );
  const companyHitsQuery = useGetHits(
    getHitsParams('company', selectedYear, selectedMonth),
    {
      query: {
        staleTime: HITS_QUERY_STALE_TIME,
      },
    },
  );

  const hitsQueryByFilter = {
    daily: dailyHitsQuery,
    monthly: monthlyHitsQuery,
    weekday: weekdayHitsQuery,
    company: companyHitsQuery,
  } satisfies Record<ChartFilter, typeof dailyHitsQuery>;

  const activeHitsQuery = hitsQueryByFilter[filter];

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    setHovered(null);
    if (filter !== 'daily') {
      setIsMonthPickerOpen(false);
    }
    if (filter !== 'monthly' && filter !== 'daily') {
      setIsYearPickerOpen(false);
    }
  }, [filter, selectedYear, selectedMonth, pageByFilter]);

  useEffect(() => {
    setPageByFilter((prev) => ({
      ...prev,
      [filter]: 0,
    }));
  }, [filter, selectedYear, selectedMonth]);

  const chartData = useMemo(
    () =>
      mapHitsToData(
        filter,
        activeHitsQuery.data?.data?.hits ?? [],
        selectedYear,
        selectedMonth,
      ),
    [activeHitsQuery.data?.data?.hits, filter, selectedMonth, selectedYear],
  );

  const dataset = useMemo(
    () =>
      buildDataset(
        chartData,
        pageByFilter[filter],
        activeHitsQuery.data?.data?.totalHit ??
          activeHitsQuery.data?.data?.overAllTotalHit ??
          activeHitsQuery.data?.data?.averageHit,
      ),
    [
      activeHitsQuery.data?.data?.averageHit,
      activeHitsQuery.data?.data?.overAllTotalHit,
      activeHitsQuery.data?.data?.totalHit,
      chartData,
      filter,
      pageByFilter,
    ],
  );

  const activeFilterLabel =
    FILTER_OPTIONS.find((option) => option.value === filter)?.label ??
    '\uC77C\uACC4';

  function movePage(direction: 'prev' | 'next') {
    setPageByFilter((prev) => {
      const delta = direction === 'prev' ? -1 : 1;
      return {
        ...prev,
        [filter]: Math.max(prev[filter] + delta, 0),
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
    activeMonthLabel: `${selectedMonth}\uC6D4`,
    activeYearLabel: `${selectedYear}\uB144`,
    isLoading: activeHitsQuery.isLoading,
    isError: activeHitsQuery.isError,
    goToPrevPage: () => movePage('prev'),
    goToNextPage: () => movePage('next'),
  };
}
