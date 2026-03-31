import AdminProfileCard from '@components/admin/profile-card/profile-card';
import DateInputPopover from '@components/common/date-input-popover';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import LoadingPanel from '@components/common/loading-panel';
import SearchBar from '@components/common/search-bar';
import OrderExportButton from '@components/order/order-export-button';
import OrderListTable, {
  type OrderStatusValue,
} from '@components/order/order-list-table';
import { useInfiniteScrollTrigger } from '@hooks/use-infinite-scroll-trigger';
import useOrderList, { type OrderFilterType } from '@hooks/use-order-list';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FILTER_OPTIONS: Array<{ label: string; value: OrderFilterType }> = [
  { label: '상품명', value: 'product' },
  { label: '주문자 정보', value: 'user' },
];

const AdminOrders = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [selectedFilterBy, setSelectedFilterBy] =
    useState<OrderFilterType>('product');
  const [appliedSearchKeyword, setAppliedSearchKeyword] = useState('');
  const [appliedFilterBy, setAppliedFilterBy] = useState<OrderFilterType>();
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatusValue | 'ALL'
  >('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const {
    orders,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useOrderList({
    pageSize: 10,
    searchKeyword: appliedSearchKeyword,
    filterBy: appliedFilterBy,
    startDate,
    endDate,
    orderStatus: selectedStatus,
  });

  const loadMoreRef = useInfiniteScrollTrigger({
    enabled: hasNextPage && !isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });

  const selectedFilterLabel =
    FILTER_OPTIONS.find((option) => option.value === selectedFilterBy)?.label ??
    '상품명';

  const handleSearch = (value: string) => {
    setAppliedSearchKeyword(value);
    setAppliedFilterBy(value.trim() ? selectedFilterBy : undefined);
    setIsFilterOpen(false);
  };

  const handleRefresh = () => {
    setKeyword('');
    setAppliedSearchKeyword('');
    setSelectedFilterBy('product');
    setAppliedFilterBy(undefined);
    setSelectedStatus('ALL');
    setStartDate('');
    setEndDate('');
    setIsFilterOpen(false);
  };

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isFilterOpen]);

  return (
    <div
      ref={pageRef}
      className="flex flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[5rem] md:px-[5rem] lg:px-[10rem]"
    >
      <AdminProfileCard onMove={() => navigate('/')} />

      <div className="flex flex-col gap-[3.5rem]">
        <div className="flex-row-between w-full">
          <div className="flex gap-[2rem]">
            <h1 className="title3 text-gray-900">주문 목록</h1>
            <div className="flex items-center gap-[0.8rem]">
              <DateInputPopover
                value={startDate}
                onChange={setStartDate}
                ariaLabel="시작일"
                placeholder="시작일"
                buttonClassName="caption3 h-[4rem] min-w-[15rem] rounded-[10px] text-gray-900"
              />
              <span className="text-[1.6rem] font-medium text-[#8F8F95]">
                -
              </span>
              <DateInputPopover
                value={endDate}
                onChange={setEndDate}
                ariaLabel="종료일"
                placeholder="종료일"
                buttonClassName="caption3 h-[4rem] min-w-[15rem] rounded-[10px] text-gray-900"
              />
            </div>
          </div>

          <OrderExportButton
            filters={{
              filterBy: appliedFilterBy,
              q: appliedSearchKeyword.trim() || undefined,
              startDate: startDate || undefined,
              endDate: endDate || undefined,
              orderStatus:
                selectedStatus !== 'ALL' ? selectedStatus : undefined,
            }}
            isFiltered={Boolean(
              appliedSearchKeyword.trim() ||
                startDate ||
                endDate ||
                selectedStatus !== 'ALL',
            )}
          />
        </div>

        <div ref={filterRef} className="relative flex-1">
          <SearchBar
            value={keyword}
            onChange={setKeyword}
            onSearch={handleSearch}
            onRefresh={handleRefresh}
            onFilterClick={() => setIsFilterOpen((prev) => !prev)}
            placeholder="찾으시는 주문 정보를 입력해 주세요"
            buttonText="검색하기"
            filterText={selectedFilterLabel}
            size="lg"
          />

          {isFilterOpen ? (
            <div className="absolute top-[calc(100%+1rem)] right-[12.8rem] z-20 min-w-[15rem] rounded-[1.2rem] border border-[#E6E6E6] bg-white p-2 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSelectedFilterBy(option.value);
                    setIsFilterOpen(false);
                  }}
                  className={[
                    'flex w-full items-center rounded-[0.8rem] px-4 py-3 text-left text-[1.5rem] transition-colors',
                    option.value === selectedFilterBy
                      ? 'bg-[#FFF7E0] font-semibold text-[#2B2B2B]'
                      : 'text-[#555555] hover:bg-[#F5F5F5]',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {isLoading ? (
        <LoadingPanel />
      ) : isError ? (
        <div className="rounded-[1.6rem] bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-red-500">
          주문 목록을 불러오지 못했습니다.
        </div>
      ) : orders.length ? (
        <div className="flex flex-col gap-4">
          <OrderListTable
            data={orders}
            detailBasePath="/admin/orders"
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
          {hasNextPage || isFetchingNextPage ? (
            <div ref={loadMoreRef}>
              {isFetchingNextPage ? (
                <LoadingPanel
                  className="min-h-0 rounded-[1.6rem] py-[2rem]"
                  size={72}
                />
              ) : (
                <div className="h-[1px] w-full" />
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="rounded-[1.6rem] bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-gray-500">
          표시할 주문 내역이 없습니다.
        </div>
      )}

      <ExploreScrollToTop targetRef={pageRef} />
    </div>
  );
};

export default AdminOrders;
