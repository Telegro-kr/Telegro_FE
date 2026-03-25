import AdminProfileCard from '@components/admin/profile-card/profile-card';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import SearchBar from '@components/common/search-bar';
import OrderListTable, {
  mockOrders,
  type OrderRow,
} from '@components/order/order-list-table';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredOrders = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return mockOrders;
    }

    return mockOrders.filter((order) =>
      [order.productName, order.optionLabel, order.orderInfo, order.customerInfo]
        .join(' ')
        .toLowerCase()
        .includes(normalizedKeyword),
    );
  }, [searchKeyword]);

  const handleSearch = (value: string) => {
    setSearchKeyword(value);
  };

  const handleRefresh = () => {
    setKeyword('');
    setSearchKeyword('');
  };

  const handlePay = (_row: OrderRow) => {};

  return (
    <div
      ref={pageRef}
      className="flex flex-col gap-[5rem] bg-[#FAFAFA] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[10rem] lg:py-[5rem]"
    >
      <AdminProfileCard onMove={() => navigate('/')} />

      <div className="flex flex-col gap-[3.5rem]">
        <h1 className="title3 text-gray-900">주문 목록</h1>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSearch={handleSearch}
          onRefresh={handleRefresh}
          placeholder="찾으시는 주문 정보를 입력해 주세요."
          buttonText="검색하기"
          size="lg"
        />
      </div>

      {filteredOrders.length ? (
        <OrderListTable data={filteredOrders} onPay={handlePay} />
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
