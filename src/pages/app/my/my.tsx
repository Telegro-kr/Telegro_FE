import ConfirmModal from '@components/common/confirm-modal';
import LoadingPage from '@components/common/loading-page';
import { FiEdit2, FiMapPin, FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { MENU_ITEMS } from './my.constants';
import {
  AddressModal,
  AddressRow,
  InfoBox,
  OrderRow,
  SectionHeader,
  SummaryCard,
} from './my.components';
import { useMyPage } from './use-my-page';
import { formatPhoneNumber, formatPoint, getAddressLine } from './my.utils';

const MyPage = () => {
  const navigate = useNavigate();
  const {
    activeMenu,
    addressForm,
    addressModalState,
    addressToDelete,
    addresses,
    closeAddressModal,
    defaultAddress,
    handleAddressChange,
    handleAddressSearch,
    handleAddressSubmit,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleToggleDefault,
    isAddressMutationPending,
    isLogoutModalOpen,
    isPostcodeReady,
    myPageQuery,
    openCreateAddress,
    openEditAddress,
    ordersQuery,
    recentOrders,
    setActiveMenu,
    setAddressToDelete,
    setIsLogoutModalOpen,
    user,
    addAddressMutation,
    updateAddressMutation,
  } = useMyPage();

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
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-6 py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[120rem]">
        <div className="grid gap-6 lg:grid-cols-[28rem_minmax(0,1fr)]">
          <aside className="h-fit overflow-hidden rounded-[1.6rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(249,245,238,0.98)_100%)] p-6 shadow-[0_24px_60px_rgba(22,22,22,0.07)]">
            <div className="border-b border-[#EEE7DD] pb-6">
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
              {MENU_ITEMS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === '로그아웃') {
                      setIsLogoutModalOpen(true);
                      return;
                    }

                    setActiveMenu(item);
                  }}
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
                value={`${ordersQuery.data?.data?.totalElement ?? 0}`}
                sub="전체 주문 내역"
              />
            </div>

            {activeMenu === '프로필' ? (
              <section className="rounded-[10px] border border-white/70 bg-white/85 px-8 py-8">
                <SectionHeader
                  title="계정 정보"
                  description="가입한 기본 정보를 확인할 수 있습니다."
                />
                <button
                  type="button"
                  onClick={() => navigate('/app/my/edit')}
                  aria-label="계정 정보 수정"
                  className="absolute top-8 right-8 inline-flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[#E7E1D7] bg-[#F8F5EF] text-[#5F7A35]"
                >
                  <FiEdit2 className="text-[1.8rem]" />
                </button>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <InfoBox label="이름" value={user?.userName?.trim() || '-'} />
                  <InfoBox label="아이디" value={user?.userId?.trim() || '-'} />
                  <InfoBox label="이메일" value={user?.email?.trim() || '-'} />
                  <InfoBox
                    label="연락처"
                    value={formatPhoneNumber(user?.phone)}
                  />
                </div>
              </section>
            ) : null}

            {(activeMenu === '프로필' || activeMenu === '주문') && (
              <section className="rounded-[10px] border border-white/70 bg-white/85 px-8 py-8">
                <SectionHeader
                  title="최근 주문"
                  description="최근 주문 상태를 빠르게 확인할 수 있습니다."
                  action={
                    <Link to="/app/orders" className="text-primary caption2">
                      전체 주문 보기
                    </Link>
                  }
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
              <section className="rounded-[10px] border border-white/70 bg-white/85 px-8 py-8">
                <SectionHeader
                  title="배송지 관리"
                  description="배송지를 추가, 수정, 삭제하고 기본 배송지를 설정할 수 있습니다."
                  action={
                    <button
                      type="button"
                      onClick={openCreateAddress}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-[999px] bg-[#202020] px-5 py-3 text-[1.3rem] font-semibold text-white"
                    >
                      <FiPlus className="text-[1.6rem]" />
                      배송지 추가
                    </button>
                  }
                />

                <div className="mt-8 space-y-4">
                  {addresses.length ? (
                    addresses.map((address, index) => (
                      <AddressRow
                        key={String(
                          address.deliveryAddressId ??
                            address.name ??
                            address.address ??
                            index,
                        )}
                        address={address}
                        isMutating={isAddressMutationPending}
                        onEdit={openEditAddress}
                        onDelete={setAddressToDelete}
                        onSetDefault={handleSetDefaultAddress}
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
          message="로그아웃 하시겠습니까?"
          onCancel={() => setIsLogoutModalOpen(false)}
          onConfirm={() => {
            localStorage.removeItem('userRole');
            localStorage.removeItem('accessToken');
            setIsLogoutModalOpen(false);
            navigate('/');
          }}
        />
      ) : null}

      {addressModalState ? (
        <AddressModal
          mode={addressModalState.mode}
          form={addressForm}
          isPending={
            addAddressMutation.isPending || updateAddressMutation.isPending
          }
          isPostcodeReady={isPostcodeReady}
          onChange={handleAddressChange}
          onClose={closeAddressModal}
          onSearchAddress={handleAddressSearch}
          onSubmit={handleAddressSubmit}
          onToggleDefault={handleToggleDefault}
        />
      ) : null}

      {addressToDelete ? (
        <ConfirmModal
          message={`"${addressToDelete.name?.trim() || '배송지'}"를 삭제하시겠습니까?`}
          onCancel={() => setAddressToDelete(null)}
          onConfirm={handleDeleteAddress}
          confirmText="삭제"
        />
      ) : null}
    </section>
  );
};

export default MyPage;
