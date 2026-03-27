import type { ReactNode, ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  telegroInvalidate,
  type DeliveryAddress,
  type DeliveryAddressDetailDTO,
  type OrderDetailDTO,
  useAddDeliveryAddress,
  useAddDeliveryAddress1 as useDeleteDeliveryAddress,
  useGetMyPage,
  useGetOrders,
  useSetDefaultDeliveryAddress,
  useUpdateDeliveryAddress,
} from '@apis/telegro';
import ConfirmModal from '@components/common/confirm-modal';
import LoadingPage from '@components/common/loading-page';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { getOrderStatusLabel } from '@constants/orderStatus';
import { formatNumber } from '@utils/format';
import {
  FiChevronRight,
  FiEdit2,
  FiMapPin,
  FiPlus,
  FiStar,
  FiTrash2,
  FiX,
} from 'react-icons/fi';

const menuItems = ['프로필', '주문', '배송지', '로그아웃'] as const;
type MenuItem = (typeof menuItems)[number];

type AddressForm = {
  name: string;
  recipientName: string;
  phoneNumber: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
};

type AddressModalState =
  | null
  | { mode: 'create' }
  | { mode: 'edit'; address: DeliveryAddressDetailDTO };

type DaumPostcodeData = {
  zonecode: string;
  address: string;
  addressType: 'R' | 'J';
  bname: string;
  buildingName: string;
  apartment: 'Y' | 'N';
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => { open: () => void };
    };
  }
}

const POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const POSTCODE_SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

const INITIAL_ADDRESS_FORM: AddressForm = {
  name: '',
  recipientName: '',
  phoneNumber: '',
  zipcode: '',
  address: '',
  addressDetail: '',
  isDefault: false,
};

function formatPhoneNumber(value?: string) {
  return value || '-';
}

function formatPoint(value?: number) {
  return `${formatNumber(value ?? 0)}P`;
}

function formatOrderDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function formatOrderPrice(value?: number) {
  if (value === undefined || value === null) return '-';
  return `${formatNumber(value)}`;
}

function buildRoadAddress(data: DaumPostcodeData) {
  if (data.addressType !== 'R') return data.address;
  const extras = [data.bname, data.apartment === 'Y' ? data.buildingName : ''].filter(Boolean);
  return extras.length ? `${data.address} (${extras.join(', ')})` : data.address;
}

function getOrderProductName(order: OrderDetailDTO) {
  const firstProductName = order.products?.[0]?.productName?.trim();
  if (!firstProductName) return '상품 정보 없음';
  return (order.products?.length ?? 0) > 1
    ? `${firstProductName} 외 ${(order.products?.length ?? 1) - 1}건`
    : firstProductName;
}

function getAddressLine(address: DeliveryAddressDetailDTO) {
  return [address.address, address.addressDetail].filter(Boolean).join(' ');
}

function getDefaultAddress(addresses: DeliveryAddressDetailDTO[]) {
  return addresses.find((address) => address.isDefault) ?? addresses[0];
}

function getAddressForm(address?: DeliveryAddressDetailDTO): AddressForm {
  if (!address) return INITIAL_ADDRESS_FORM;

  return {
    name: address.name?.trim() ?? '',
    recipientName: address.recipientName?.trim() ?? '',
    phoneNumber: address.phoneNumber?.trim() ?? '',
    zipcode: address.zipcode?.trim() ?? '',
    address: address.address?.trim() ?? '',
    addressDetail: address.addressDetail?.trim() ?? '',
    isDefault: Boolean(address.isDefault),
  };
}

function toAddressPayload(form: AddressForm): DeliveryAddress {
  return {
    name: form.name.trim(),
    recipientName: form.recipientName.trim(),
    phoneNumber: form.phoneNumber.trim(),
    zipcode: form.zipcode.trim(),
    address: form.address.trim(),
    addressDetail: form.addressDetail.trim(),
  };
}

function getApiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  return fallback;
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-[#1F1F1F]">{title}</h2>
        {description ? <p className="mt-2 text-[1.3rem] text-[#6D6D6D]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <article className="rounded-[1.3rem] border border-white/70 px-8 py-7 shadow-[0_20px_50px_rgba(35,35,35,0.06)] backdrop-blur">
      <p className="text-[1.2rem] font-semibold tracking-[0.08em] text-[#8B8B8B] uppercase">{label}</p>
      <p className="mt-4 text-[3rem] font-semibold tracking-[-0.04em] text-[#161616]">{value}</p>
      <p className="mt-2 text-[1.3rem] text-[#6D6D6D]">{sub}</p>
    </article>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-[999px] border border-[#E8EDE3] bg-[#F4F8EF] px-3 py-1 text-[1.1rem] font-semibold text-[#5F7A35]">
      {label}
    </span>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  label: string;
  name: keyof AddressForm;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[1.3rem] font-semibold text-[#5D5D5D]">{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={[
          'mt-3 h-[5.4rem] w-full rounded-[1.2rem] border border-gray-300 px-5 text-[1.5rem] text-[#1F1F1F] outline-none',
          readOnly ? 'bg-[#FAFAFA]' : 'transition-colors placeholder:text-gray-500 focus:border-[#5F7A35]',
        ].join(' ')}
      />
    </label>
  );
}

function OrderRow({ order }: { order: OrderDetailDTO }) {
  return (
    <Link
      to={order.orderId ? `/app/orders/${order.orderId}` : '/app/orders'}
      className="flex items-center justify-between gap-6 rounded-[1.2rem] border border-[#ECE8E1] bg-white px-6 py-5 transition hover:border-[#D9D2C7] hover:bg-[#FCFAF6]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <p className="truncate text-[1.6rem] font-semibold text-[#202020]">{getOrderProductName(order)}</p>
          <StatusBadge label={order.orderStatus ? getOrderStatusLabel(order.orderStatus) : '상태 확인 중'} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.3rem] text-[#6D6D6D]">
          <span>{formatOrderDate(order.createdAt)}</span>
          <span>{order.orderNumber ?? '주문번호 없음'}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <p className="text-[1.5rem] font-semibold text-[#303030]">{formatOrderPrice(order.amount)}</p>
        <FiChevronRight className="text-[1.8rem] text-[#A69A89]" />
      </div>
    </Link>
  );
}

function AddressRow({
  address,
  isMutating,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: DeliveryAddressDetailDTO;
  isMutating: boolean;
  onEdit: (address: DeliveryAddressDetailDTO) => void;
  onDelete: (address: DeliveryAddressDetailDTO) => void;
  onSetDefault: (address: DeliveryAddressDetailDTO) => void;
}) {
  const accentClass = address.isDefault ? 'bg-[#5F7A35]' : 'bg-[#C9B89D]';
  const surfaceClass = address.isDefault ? 'bg-[#F7FAF2]' : 'bg-[#FCF8F3]';

  return (
    <article
      className={[
        'relative overflow-hidden rounded-[1.2rem] border border-[#ECE8E1] px-6 py-5 pl-9 shadow-[0_12px_24px_rgba(20,20,20,0.03)]',
        surfaceClass,
      ].join(' ')}
    >
      <div className={`absolute top-0 bottom-0 left-0 w-[0.6rem] ${accentClass}`} />
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[1.6rem] font-semibold text-[#1F1F1F]">{address.name?.trim() || '배송지'}</p>
            {address.isDefault ? (
              <span className="rounded-[999px] bg-[#202020] px-3 py-1 text-[1.1rem] font-semibold text-white">
                기본 배송지
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-[1.4rem] font-medium text-[#444444]">
            {[address.recipientName?.trim() || '-', formatPhoneNumber(address.phoneNumber)].join(' / ')}
          </p>
          <p className="mt-2 text-[1.4rem] leading-[1.7] text-[#6D6D6D]">{getAddressLine(address) || '-'}</p>
          {address.zipcode ? <p className="mt-1 text-[1.2rem] text-[#9A9A9A]">{address.zipcode}</p> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!address.isDefault ? (
            <button
              type="button"
              onClick={() => onSetDefault(address)}
              disabled={isMutating}
              className="inline-flex items-center gap-2 rounded-[999px] border border-[#D8D0C3] bg-white px-4 py-2 text-[1.25rem] font-semibold text-[#4E4E4E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiStar className="text-[1.4rem]" />
              기본 배송지 설정
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onEdit(address)}
            disabled={isMutating}
            className="inline-flex items-center gap-2 rounded-[999px] border border-[#D8D0C3] bg-white px-4 py-2 text-[1.25rem] font-semibold text-[#4E4E4E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiEdit2 className="text-[1.35rem]" />
            수정
          </button>
          <button
            type="button"
            onClick={() => onDelete(address)}
            disabled={isMutating}
            className="inline-flex items-center gap-2 rounded-[999px] border border-[#F1D4D4] bg-white px-4 py-2 text-[1.25rem] font-semibold text-[#BC4F4F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 className="text-[1.35rem]" />
            삭제
          </button>
        </div>
      </div>
    </article>
  );
}

function AddressModal({
  mode,
  form,
  isPending,
  isPostcodeReady,
  onChange,
  onClose,
  onSearchAddress,
  onSubmit,
  onToggleDefault,
}: {
  mode: 'create' | 'edit';
  form: AddressForm;
  isPending: boolean;
  isPostcodeReady: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSearchAddress: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleDefault: () => void;
}) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] bg-black/45 px-4 py-8">
      <div className="mx-auto max-w-[64rem] rounded-[2rem] bg-white p-7 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[2.2rem] font-semibold tracking-[-0.03em] text-[#1D1D1D]">
              {mode === 'create' ? '배송지 추가' : '배송지 수정'}
            </p>
            <p className="mt-2 text-[1.35rem] text-[#6B6B6B]">배송지 정보를 입력해 주세요.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[999px] border border-[#E7E1D7] text-[#595959]"
            aria-label="배송지 모달 닫기"
          >
            <FiX className="text-[1.9rem]" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="grid gap-5 md:grid-cols-2">
            <InputField label="배송지명" name="name" value={form.name} onChange={onChange} placeholder="집, 회사" />
            <InputField
              label="받는 분"
              name="recipientName"
              value={form.recipientName}
              onChange={onChange}
              placeholder="받는 분 이름"
            />
            <InputField
              label="연락처"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={onChange}
              placeholder="연락처"
            />
            <label className="block">
              <span className="text-[1.3rem] font-semibold text-[#5D5D5D]">우편번호</span>
              <div className="mt-3 flex gap-3">
                <input
                  type="text"
                  name="zipcode"
                  value={form.zipcode}
                  readOnly
                  className="h-[5.4rem] min-w-0 flex-1 rounded-[1.2rem] border border-gray-300 bg-[#FAFAFA] px-5 text-[1.5rem] text-[#1F1F1F] outline-none"
                />
                <button
                  type="button"
                  onClick={onSearchAddress}
                  className="shrink-0 rounded-[1.2rem] bg-[#202020] px-5 text-[1.35rem] font-semibold text-white"
                >
                  주소 검색
                </button>
              </div>
              {!isPostcodeReady ? (
                <p className="mt-2 text-[1.2rem] text-[#8B8B8B]">주소 검색을 불러오는 중입니다.</p>
              ) : null}
            </label>
          </div>

          <InputField label="주소" name="address" value={form.address} onChange={onChange} readOnly />
          <InputField
            label="상세 주소"
            name="addressDetail"
            value={form.addressDetail}
            onChange={onChange}
            placeholder="상세 주소를 입력해 주세요"
          />

          <label className="flex items-center gap-3 rounded-[1.2rem] bg-[#F7F4EE] px-5 py-4">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={() => onToggleDefault()}
              className="h-5 w-5 accent-[#5F7A35]"
            />
            <span className="text-[1.4rem] font-medium text-[#363636]">기본 배송지로 설정</span>
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[999px] border border-gray-300 px-7 py-3 text-[1.4rem] font-semibold text-[#4D4D4D]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-[999px] bg-[#5F7A35] px-8 py-3 text-[1.4rem] font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#A8B792]"
            >
              {isPending ? '저장 중...' : mode === 'create' ? '추가' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-5">
      <p className="text-[1.2rem] font-semibold text-[#8B8B8B]">{label}</p>
      <p className="mt-3 text-[2rem] font-semibold text-[#1D1D1D]">{value}</p>
    </div>
  );
}

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('프로필');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [addressModalState, setAddressModalState] = useState<AddressModalState>(null);
  const [addressToDelete, setAddressToDelete] = useState<DeliveryAddressDetailDTO | null>(null);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>(INITIAL_ADDRESS_FORM);

  const myPageQuery = useGetMyPage({ query: { staleTime: 60_000 } });
  const ordersQuery = useGetOrders({ page: 0, size: 4 }, { query: { staleTime: 60_000 } });

  const addAddressMutation = useAddDeliveryAddress();
  const updateAddressMutation = useUpdateDeliveryAddress();
  const deleteAddressMutation = useDeleteDeliveryAddress();
  const setDefaultAddressMutation = useSetDefaultDeliveryAddress();

  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsPostcodeReady(true);
      return;
    }

    const existingScript = document.getElementById(POSTCODE_SCRIPT_ID) as HTMLScriptElement | null;
    const handleLoad = () => setIsPostcodeReady(true);

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true });
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const script = document.createElement('script');
    script.id = POSTCODE_SCRIPT_ID;
    script.src = POSTCODE_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', handleLoad, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener('load', handleLoad);
  }, []);

  const addresses = [...(myPageQuery.data?.data?.addressList ?? [])].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );
  const defaultAddress = getDefaultAddress(addresses);
  const recentOrders = ordersQuery.data?.data?.orders ?? [];
  const user = myPageQuery.data?.data;

  const isAddressMutationPending =
    addAddressMutation.isPending ||
    updateAddressMutation.isPending ||
    deleteAddressMutation.isPending ||
    setDefaultAddressMutation.isPending;

  const invalidateMyPage = async () => {
    await telegroInvalidate.myPage(queryClient);
  };

  const openCreateAddress = () => {
    setAddressForm(INITIAL_ADDRESS_FORM);
    setAddressModalState({ mode: 'create' });
  };

  const openEditAddress = (address: DeliveryAddressDetailDTO) => {
    setAddressForm(getAddressForm(address));
    setAddressModalState({ mode: 'edit', address });
  };

  const closeAddressModal = () => {
    if (isAddressMutationPending) return;
    setAddressModalState(null);
    setAddressForm(INITIAL_ADDRESS_FORM);
  };

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name as keyof AddressForm]: value }));
  };

  const handleAddressSearch = () => {
    if (!window.daum?.Postcode) {
      toastError('주소 검색을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddressForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address: buildRoadAddress(data),
        }));
      },
    }).open();
  };

  const handleSetDefaultAddress = async (address: DeliveryAddressDetailDTO) => {
    if (!address.deliveryAddressId) {
      toastError('배송지 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      await setDefaultAddressMutation.mutateAsync({ addressId: address.deliveryAddressId });
      await invalidateMyPage();
      toastSuccess('기본 배송지가 변경되었습니다.');
    } catch (error) {
      toastError(getApiErrorMessage(error, '기본 배송지 변경에 실패했습니다.'));
    }
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!addressForm.name.trim()) return toastError('배송지명을 입력해 주세요.');
    if (!addressForm.recipientName.trim()) return toastError('받는 분 이름을 입력해 주세요.');
    if (!addressForm.phoneNumber.trim()) return toastError('연락처를 입력해 주세요.');
    if (!addressForm.zipcode.trim() || !addressForm.address.trim()) {
      return toastError('주소 검색을 통해 주소를 입력해 주세요.');
    }
    if (!addressForm.addressDetail.trim()) return toastError('상세 주소를 입력해 주세요.');

    try {
      if (addressModalState?.mode === 'edit') {
        const addressId = addressModalState.address.deliveryAddressId;
        if (!addressId) return toastError('수정할 배송지를 찾을 수 없습니다.');

        await updateAddressMutation.mutateAsync({
          addressId,
          data: toAddressPayload(addressForm),
        });

        if (addressForm.isDefault && !addressModalState.address.isDefault) {
          await setDefaultAddressMutation.mutateAsync({ addressId });
        }

        await invalidateMyPage();
        toastSuccess('배송지가 수정되었습니다.');
      } else {
        const response = await addAddressMutation.mutateAsync({
          data: toAddressPayload(addressForm),
        });

        const createdAddressId = response.data?.data?.id;
        if (addressForm.isDefault && createdAddressId) {
          await setDefaultAddressMutation.mutateAsync({ addressId: createdAddressId });
        }

        await invalidateMyPage();
        toastSuccess('배송지가 추가되었습니다.');
      }

      closeAddressModal();
    } catch (error) {
      toastError(
        getApiErrorMessage(
          error,
          addressModalState?.mode === 'edit' ? '배송지 수정에 실패했습니다.' : '배송지 추가에 실패했습니다.',
        ),
      );
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete?.deliveryAddressId) {
      setAddressToDelete(null);
      toastError('삭제할 배송지를 찾을 수 없습니다.');
      return;
    }

    try {
      await deleteAddressMutation.mutateAsync({ addressId: addressToDelete.deliveryAddressId });
      await invalidateMyPage();
      toastSuccess('배송지가 삭제되었습니다.');
    } catch (error) {
      toastError(getApiErrorMessage(error, '배송지 삭제에 실패했습니다.'));
    } finally {
      setAddressToDelete(null);
    }
  };

  if (myPageQuery.isLoading) {
    return <LoadingPage />;
  }

  if (myPageQuery.isError) {
    return (
      <section className="min-h-screen bg-[#F7F4EE] px-8 py-10">
        <div className="mx-auto max-w-[120rem] rounded-[1.8rem] border border-[#EAE3D8] bg-white px-10 py-12 text-center shadow-[0_24px_60px_rgba(30,30,30,0.06)]">
          <p className="text-[2.2rem] font-semibold text-[#1E1E1E]">마이페이지 정보를 불러오지 못했습니다.</p>
          <p className="mt-3 text-[1.5rem] text-[#6D6D6D]">잠시 후 다시 시도해 주세요.</p>
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
                <p className="mt-2 text-[1.4rem] text-[#6C6C6C]">@{user?.userId?.trim() || 'telegro-user'}</p>
              </div>
            </div>

            <nav className="mt-6 flex flex-col gap-2">
              {menuItems.map((item) => (
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
              <p className="text-[1.2rem] font-semibold tracking-[0.08em] text-[#8A7D6A] uppercase">Contact</p>
              <p className="mt-3 text-[1.4rem] text-[#353535]">{user?.email?.trim() || '등록된 이메일이 없습니다.'}</p>
              <p className="mt-2 text-[1.4rem] text-[#353535]">{formatPhoneNumber(user?.phone)}</p>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard label="Point" value={formatPoint(user?.point)} sub="적립 포인트 현황" />
              <SummaryCard label="Orders" value={`${ordersQuery.data?.data?.totalElement ?? 0}`} sub="전체 주문 내역" />
            </div>

            {activeMenu === '프로필' ? (
              <section className="relative rounded-[1.6rem] border border-white/70 bg-white/85 px-8 py-8 shadow-[0_20px_50px_rgba(20,20,20,0.05)] backdrop-blur">
                <SectionHeader title="계정 정보" description="가입한 기본 정보를 확인할 수 있습니다." />
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
                  <InfoBox label="연락처" value={formatPhoneNumber(user?.phone)} />
                </div>
              </section>
            ) : null}

            {(activeMenu === '프로필' || activeMenu === '주문') && (
              <section className="rounded-[1.6rem] border border-white/70 bg-white/85 px-8 py-8 shadow-[0_20px_50px_rgba(20,20,20,0.05)] backdrop-blur">
                <SectionHeader
                  title="최근 주문"
                  description="최근 주문 상태를 빠르게 확인할 수 있습니다."
                  action={
                    <Link to="/app/orders" className="text-[1.3rem] font-semibold text-[#5F7A35]">
                      전체 주문 보기
                    </Link>
                  }
                />
                <div className="mt-8 space-y-4">
                  {ordersQuery.isLoading ? (
                    <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-8 text-[1.5rem] text-[#6D6D6D]">주문 정보를 불러오는 중입니다.</div>
                  ) : recentOrders.length ? (
                    recentOrders.map((order, index) => (
                      <OrderRow key={order.orderId ?? order.orderNumber ?? `order-${index}`} order={order} />
                    ))
                  ) : (
                    <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-8 text-[1.5rem] text-[#6D6D6D]">최근 주문 내역이 없습니다.</div>
                  )}
                </div>
              </section>
            )}

            {(activeMenu === '프로필' || activeMenu === '배송지') && (
              <section className="rounded-[1.6rem] border border-white/70 bg-white/85 px-8 py-8 shadow-[0_20px_50px_rgba(20,20,20,0.05)] backdrop-blur">
                <SectionHeader
                  title="배송지 관리"
                  description="배송지를 추가, 수정, 삭제하고 기본 배송지를 설정할 수 있습니다."
                  action={
                    <button
                      type="button"
                      onClick={openCreateAddress}
                      className="inline-flex items-center gap-2 rounded-[999px] bg-[#202020] px-5 py-3 text-[1.3rem] font-semibold text-white"
                    >
                      <FiPlus className="text-[1.6rem]" />
                      배송지 추가
                    </button>
                  }
                />

                {defaultAddress ? (
                  <div className="mt-8 rounded-[1.4rem] border border-[#E8E3D7] bg-[linear-gradient(135deg,#FCFBF8_0%,#F5F8EE_100%)] p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-[1rem] bg-white p-3 text-[#5F7A35] shadow-[0_10px_24px_rgba(95,122,53,0.12)]">
                        <FiMapPin className="text-[2rem]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[1.2rem] font-semibold tracking-[0.08em] text-[#8B8B8B] uppercase">기본 배송지</p>
                        <p className="mt-3 text-[1.8rem] font-semibold text-[#202020]">
                          {defaultAddress.name?.trim() || '기본 배송지'}
                        </p>
                        <p className="mt-2 text-[1.4rem] text-[#444444]">
                          {[defaultAddress.recipientName?.trim() || '-', formatPhoneNumber(defaultAddress.phoneNumber)].join(' / ')}
                        </p>
                        <p className="mt-2 text-[1.4rem] leading-[1.7] text-[#666666]">{getAddressLine(defaultAddress) || '-'}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-8 space-y-4">
                  {addresses.length ? (
                    addresses.map((address, index) => (
                      <AddressRow
                        key={String(address.deliveryAddressId ?? address.name ?? address.address ?? index)}
                        address={address}
                        isMutating={isAddressMutationPending}
                        onEdit={openEditAddress}
                        onDelete={setAddressToDelete}
                        onSetDefault={handleSetDefaultAddress}
                      />
                    ))
                  ) : (
                    <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-8 text-[1.5rem] text-[#6D6D6D]">등록된 배송지가 없습니다.</div>
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
          isPending={addAddressMutation.isPending || updateAddressMutation.isPending}
          isPostcodeReady={isPostcodeReady}
          onChange={handleAddressChange}
          onClose={closeAddressModal}
          onSearchAddress={handleAddressSearch}
          onSubmit={handleAddressSubmit}
          onToggleDefault={() => setAddressForm((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
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
