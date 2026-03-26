import type { DeliveryAddressDetailDTO, OrderDetailDTO } from '@apis/telegro';
import { useGetMyPage, useGetOrders } from '@apis/telegro';
import LoadingPage from '@components/common/loading-page';
import { formatNumber } from '@utils/format';
import { FiEdit2 } from 'react-icons/fi';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmModal from '@components/common/confirm-modal';

const menuItems = ['프로필', '주문', '배송지', '로그아웃'] as const;

const orderStatusLabels: Record<string, string> = {
  ORDER_CREATED: '주문 생성',
  PAYMENT_COMPLETED: '결제 완료',
  ORDER_COMPLETED: '주문 완료',
  ORDER_CANCELLED: '주문 취소',
  SHIPPING: '배송 중',
  DELIVERY_COMPLETED: '배송 완료',
};

function formatPhoneNumber(value?: string) {
  if (!value) return '-';
  return value;
}

function formatPoint(value?: number) {
  return `${formatNumber(value ?? 0)}P`;
}

function formatOrderDate(value?: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function formatOrderPrice(value?: number) {
  if (value === undefined || value === null) return '-';
  return `${formatNumber(value)}`;
}

function getOrderProductName(order: OrderDetailDTO) {
  const products = order.products ?? [];
  const firstProductName = products[0]?.productName?.trim();

  if (!firstProductName) {
    return '상품 정보 없음';
  }

  return products.length > 1
    ? `${firstProductName} 외 ${products.length - 1}건`
    : firstProductName;
}

function getAddressLine(address: DeliveryAddressDetailDTO) {
  return [address.address, address.addressDetail].filter(Boolean).join(' ');
}

function getDefaultAddress(addresses: DeliveryAddressDetailDTO[]) {
  return addresses.find((address) => address.isDefault) ?? addresses[0];
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[999px] border border-[#E8EDE3] bg-[#F4F8EF] px-3 py-1 text-[1.1rem] font-semibold text-[#5F7A35]">
      {label}
    </span>
  );
}

function SectionHeader({
  title,
  description,
  action,
  actionTo,
}: {
  title: string;
  description?: string;
  action?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-[#1F1F1F]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[1.3rem] text-[#6D6D6D]">{description}</p>
        ) : null}
      </div>

      {action && actionTo ? (
        <Link
          to={actionTo}
          className="shrink-0 text-[1.3rem] font-semibold text-[#5F7A35]"
        >
          {action}
        </Link>
      ) : null}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <article className="rounded-[1.3rem] border border-white/70 px-8 py-7 shadow-[0_20px_50px_rgba(35,35,35,0.06)] backdrop-blur">
      <p className="text-[1.2rem] font-semibold tracking-[0.08em] text-[#8B8B8B] uppercase">
        {label}
      </p>
      <p className="mt-4 text-[3rem] font-semibold tracking-[-0.04em] text-[#161616]">
        {value}
      </p>
      <p className="mt-2 text-[1.3rem] text-[#6D6D6D]">{sub}</p>
    </article>
  );
}

function OrderRow({ order }: { order: OrderDetailDTO }) {
  const statusLabel = order.orderStatus
    ? (orderStatusLabels[order.orderStatus] ?? order.orderStatus)
    : '상태 확인 중';

  return (
    <Link
      to={order.orderId ? `/app/orders/${order.orderId}` : '/app/orders'}
      className="flex items-center justify-between gap-6 rounded-[1.2rem] border border-[#ECE8E1] bg-white px-6 py-5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <p className="truncate text-[1.6rem] font-semibold text-[#202020]">
            {getOrderProductName(order)}
          </p>
          <StatusBadge label={statusLabel} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.3rem] text-[#6D6D6D]">
          <span>{formatOrderDate(order.createdAt)}</span>
          <span>{order.orderNumber ?? '주문번호 없음'}</span>
        </div>
      </div>

      <p className="shrink-0 text-[1.5rem] font-semibold text-[#303030]">
        {formatOrderPrice(order.amount)}
      </p>
    </Link>
  );
}

function AddressRow({ address }: { address: DeliveryAddressDetailDTO }) {
  const accentClass = address.isDefault ? 'bg-[#5F7A35]' : 'bg-[#C9B89D]';
  const surfaceClass = address.isDefault ? 'bg-[#F7FAF2]' : 'bg-[#FCF8F3]';

  return (
    <article
      className={[
        'relative overflow-hidden rounded-[1.2rem] border border-[#ECE8E1] px-6 py-5 pl-9 shadow-[0_12px_24px_rgba(20,20,20,0.03)]',
        surfaceClass,
      ].join(' ')}
    >
      <div
        className={`absolute top-0 bottom-0 left-0 w-[0.6rem] ${accentClass}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[1.6rem] font-semibold text-[#1F1F1F]">
              {address.name?.trim() || '배송지'}
            </p>
            {address.isDefault ? (
              <span className="rounded-[999px] bg-[#202020] px-3 py-1 text-[1.1rem] font-semibold text-white">
                기본 배송지
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-[1.4rem] font-medium text-[#444444]">
            {(address.recipientName?.trim() || '-') +
              formatPhoneNumber(address.phoneNumber)}
          </p>
          <p className="mt-2 text-[1.4rem] leading-[1.7] text-[#6D6D6D]">
            {getAddressLine(address) || '-'}
          </p>
          {address.zipcode ? (
            <p className="mt-1 text-[1.2rem] text-[#9A9A9A]">
              {address.zipcode}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

const MyPage = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] =
    useState<(typeof menuItems)[number]>('프로필');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleMenuClick = (item: (typeof menuItems)[number]) => {
    if (item === menuItems[3]) {
      setIsLogoutModalOpen(true);
      return;
    }

    setActiveMenu(item);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const myPageQuery = useGetMyPage({
    query: {
      staleTime: 60_000,
    },
  });

  const ordersQuery = useGetOrders(
    { page: 0, size: 4 },
    {
      query: {
        staleTime: 60_000,
      },
    },
  );

  if (myPageQuery.isLoading) {
    return <LoadingPage />;
  }

  if (myPageQuery.isError) {
    return (
      <section className="min-h-screen bg-[#F7F4EE] px-8 py-10">
        <div className="mx-auto max-w-[120rem] rounded-[1.8rem] border border-[#EAE3D8] bg-white px-10 py-12 text-center shadow-[0_24px_60px_rgba(30,30,30,0.06)]">
          <p className="text-[2.2rem] font-semibold text-[#1E1E1E]">
            마이페이지 정보를 불러오지 못했습니다.
          </p>
          <p className="mt-3 text-[1.5rem] text-[#6D6D6D]">
            잠시 후 다시 시도해 주세요.
          </p>
          <button
            type="button"
            onClick={() => myPageQuery.refetch()}
            className="mt-8 rounded-[999px] bg-[#202020] px-8 py-3 text-[1.4rem] font-semibold text-white"
          >
            다시 불러오기
          </button>
        </div>
      </section>
    );
  }

  const user = myPageQuery.data?.data;
  const addresses = [...(user?.addressList ?? [])].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );
  const recentOrders = ordersQuery.data?.data?.orders ?? [];
  const defaultAddress = getDefaultAddress(addresses);

  return (
    <section className="min-h-screen px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[120rem]">
        <div className="grid gap-6 lg:grid-cols-[28rem_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-[1.6rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(249,245,238,0.98)_100%)] p-6 shadow-[0_24px_60px_rgba(22,22,22,0.07)]">
            <div className="border-b border-[#EEE7DD]">
              <img
                src="/my-profile.svg"
                alt="사용자 프로필"
                className="h-[8rem] w-[8rem] rounded-[1rem] border border-[#EFE7DB] bg-white object-cover p-3"
              />
              <div className="mt-5">
                <p className="text-[2.4rem] font-semibold tracking-[-0.03em] text-[#171717]">
                  {user?.userName?.trim() || '사용자'}
                </p>
                <p className="mt-2 text-[1.4rem] text-[#6C6C6C]">
                  @{user?.userId?.trim() || 'telegro-user'}
                </p>
              </div>
            </div>

            <nav className="mt-6 flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleMenuClick(item)}
                  className={[
                    'rounded-[0.9rem] px-5 py-4 text-left text-[1.5rem] font-semibold',
                    activeMenu === item
                      ? 'bg-[#202020] text-white shadow-[0_14px_24px_rgba(22,22,22,0.18)]'
                      : 'text-[#535353]',
                  ].join(' ')}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="mt-8 rounded-[1.2rem] bg-[#F3EEE7] px-5 py-5">
              <p className="text-[1.2rem] font-semibold tracking-[0.08em] text-[#8A7D6A] uppercase">
                Contact
              </p>
              <p className="mt-3 text-[1.4rem] text-[#353535]">
                {user?.email?.trim() || '등록된 이메일이 없습니다.'}
              </p>
              <p className="mt-2 text-[1.4rem] text-[#353535]">
                {formatPhoneNumber(user?.phone)}
              </p>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard
                label="Point"
                value={formatPoint(user?.point)}
                sub="적립 포인트 현황"
              />
              <SummaryCard
                label="Orders"
                value={`${ordersQuery.data?.data?.totalElement ?? 0}건`}
                sub="전체 주문 내역"
              />
            </div>

            {activeMenu === '프로필' && (
              <section className="relative rounded-[1.6rem] border border-white/70 bg-white/85 px-8 py-8 shadow-[0_20px_50px_rgba(20,20,20,0.05)] backdrop-blur">
                <SectionHeader
                  title="계정 정보"
                  description="가입한 기본 정보를 확인할 수 있습니다."
                />

                <button
                  type="button"
                  aria-label="계정정보 수정"
                  onClick={() => navigate('/app/my/edit')}
                  className="absolute top-8 right-8 inline-flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[#E7E1D7] bg-[#F8F5EF] text-[#5F7A35] transition-colors hover:bg-[#F1ECE3]"
                >
                  <FiEdit2 className="text-[1.8rem]" />
                </button>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-5">
                    <p className="text-[1.2rem] font-semibold text-[#8B8B8B]">
                      이름
                    </p>
                    <p className="mt-3 text-[2rem] font-semibold text-[#1D1D1D]">
                      {user?.userName?.trim() || '-'}
                    </p>
                  </div>
                  <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-5">
                    <p className="text-[1.2rem] font-semibold text-[#8B8B8B]">
                      아이디
                    </p>
                    <p className="mt-3 text-[2rem] font-semibold text-[#1D1D1D]">
                      {user?.userId?.trim() || '-'}
                    </p>
                  </div>
                  <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-5">
                    <p className="text-[1.2rem] font-semibold text-[#8B8B8B]">
                      이메일
                    </p>
                    <p className="mt-3 text-[1.7rem] font-semibold text-[#1D1D1D]">
                      {user?.email?.trim() || '-'}
                    </p>
                  </div>
                  <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-5">
                    <p className="text-[1.2rem] font-semibold text-[#8B8B8B]">
                      연락처
                    </p>
                    <p className="mt-3 text-[2rem] font-semibold text-[#1D1D1D]">
                      {formatPhoneNumber(user?.phone)}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {(activeMenu === '프로필' || activeMenu === '주문') && (
              <section className="rounded-[1.6rem] border border-white/70 bg-white/85 px-8 py-8 shadow-[0_20px_50px_rgba(20,20,20,0.05)] backdrop-blur">
                <SectionHeader
                  title="최근 주문"
                  description="최근 주문 상태를 빠르게 확인할 수 있습니다."
                  action="전체 주문 보기"
                  actionTo="/app/orders"
                />

                <div className="mt-8 space-y-4">
                  {ordersQuery.isLoading ? (
                    <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-8 text-[1.5rem] text-[#6D6D6D]">
                      주문 정보를 불러오는 중입니다.
                    </div>
                  ) : recentOrders.length ? (
                    recentOrders.map((order, index) => (
                      <OrderRow
                        key={
                          order.orderId ?? order.orderNumber ?? `order-${index}`
                        }
                        order={order}
                      />
                    ))
                  ) : (
                    <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-8 text-[1.5rem] text-[#6D6D6D]">
                      최근 주문 내역이 없습니다.
                    </div>
                  )}
                </div>
              </section>
            )}

            {(activeMenu === '프로필' || activeMenu === '배송지') && (
              <section className="rounded-[1.6rem] border border-white/70 bg-white/85 px-8 py-8 shadow-[0_20px_50px_rgba(20,20,20,0.05)] backdrop-blur">
                <SectionHeader
                  title="배송지 관리"
                  description="기본 배송지를 우선으로 정렬해 보여줍니다."
                />

                <div className="mt-8 space-y-4">
                  {addresses.length ? (
                    addresses.map((address) => (
                      <AddressRow
                        key={
                          address.deliveryAddressId ??
                          address.name ??
                          address.address
                        }
                        address={address}
                      />
                    ))
                  ) : (
                    <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-8 text-[1.5rem] text-[#6D6D6D]">
                      등록된 배송지가 없습니다.
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {isLogoutModalOpen ? (
        <ConfirmModal
          message="로그아웃하시겠습니까?"
          onCancel={handleLogoutCancel}
          onConfirm={handleLogoutConfirm}
        />
      ) : null}
    </section>
  );
};

export default MyPage;
