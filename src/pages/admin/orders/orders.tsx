import AdminProfileCard from '@components/admin/profile-card/profile-card';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import LoadingPanel from '@components/common/loading-panel';
import SearchBar from '@components/common/search-bar';
import OrderListTable, { type OrderRow } from '@components/order/order-list-table';
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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const { orders, isLoading, isError } = useOrderList({
    pageSize: 10000,
    searchKeyword: appliedSearchKeyword,
    filterBy: appliedFilterBy,
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
    setIsFilterOpen(false);
  };

  const handlePay = (_row: OrderRow) => {};

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
      className="flex flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]"
    >
      <AdminProfileCard onMove={() => navigate('/')} />

      <div className="flex flex-col gap-[3.5rem]">
        <h1 className="title3 text-gray-900">주문 목록</h1>

        <div ref={filterRef} className="relative">
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
        <OrderListTable data={orders} onPay={handlePay} />
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
