import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import type { DeliveryAddressDetailDTO, OrderDetailDTO } from '@apis/telegro';
import { getOrderStatusLabel } from '@constants/orderStatus';
import {
  FiChevronRight,
  FiEdit2,
  FiMapPin,
  FiStar,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import type { AddressForm } from './my.types';
import {
  formatOrderDate,
  formatOrderPrice,
  getAddressLine,
  getOrderProductName,
} from './my.utils';

export function SectionHeader({
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
        <h2 className="text-[2.2rem] font-semibold tracking-[-0.03em] text-[#1F1F1F]">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[1.3rem] text-[#6D6D6D]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function SummaryCard({
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
      <span className="text-[1.3rem] font-semibold text-[#5D5D5D]">
        {label}
      </span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={[
          'mt-3 h-[5.4rem] w-full rounded-[1.2rem] border border-gray-300 px-5 text-[1.5rem] text-[#1F1F1F] outline-none',
          readOnly
            ? 'bg-[#FAFAFA]'
            : 'transition-colors placeholder:text-gray-500 focus:border-[#5F7A35]',
        ].join(' ')}
      />
    </label>
  );
}

export function OrderRow({ order }: { order: OrderDetailDTO }) {
  return (
    <Link
      to={order.orderId ? `/app/orders/${order.orderId}` : '/app/orders'}
      className="flex items-center justify-between gap-6 rounded-[1.2rem] border border-[#ECE8E1] bg-white px-6 py-5 transition hover:border-[#D9D2C7] hover:bg-[#FCFAF6]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <p className="truncate text-[1.6rem] font-semibold text-[#202020]">
            {getOrderProductName(order)}
          </p>
          <StatusBadge
            label={
              order.orderStatus
                ? getOrderStatusLabel(order.orderStatus)
                : '상태 확인 중'
            }
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[1.3rem] text-[#6D6D6D]">
          <span>{formatOrderDate(order.createdAt)}</span>
          <span>{order.orderNumber ?? '주문번호 없음'}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <p className="text-[1.5rem] font-semibold text-[#303030]">
          {formatOrderPrice(order.amount)}
        </p>
        <FiChevronRight className="text-[1.8rem] text-[#A69A89]" />
      </div>
    </Link>
  );
}

export function AddressRow({
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
  const accentClass = address.isDefault ? 'bg-primary' : 'bg-primary/20';
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
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
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
          <p className="mt-3 text-[1.4rem] leading-[1.7] text-[#6D6D6D]">
            {getAddressLine(address) || '-'}
          </p>
          {address.zipcode ? (
            <p className="mt-1 text-[1.2rem] text-[#9A9A9A]">
              {address.zipcode}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!address.isDefault ? (
            <button
              type="button"
              onClick={() => onSetDefault(address)}
              disabled={isMutating}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[999px] border border-[#D8D0C3] bg-white px-4 py-2 text-[1.25rem] font-semibold text-[#4E4E4E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiStar className="text-[1.4rem]" />
              기본 배송지 설정
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onEdit(address)}
            disabled={isMutating}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[999px] border border-[#D8D0C3] bg-white px-4 py-2 text-[1.25rem] font-semibold text-[#4E4E4E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiEdit2 className="text-[1.35rem]" />
            수정
          </button>
          <button
            type="button"
            onClick={() => onDelete(address)}
            disabled={isMutating}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[999px] border border-[#F1D4D4] bg-white px-4 py-2 text-[1.25rem] font-semibold text-[#BC4F4F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 className="text-[1.35rem]" />
            삭제
          </button>
        </div>
      </div>
    </article>
  );
}

export function AddressModal({
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
            <p className="mt-2 text-[1.35rem] text-[#6B6B6B]">
              배송지 정보를 입력해 주세요.
            </p>
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
            <InputField
              label="배송지명"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="집, 회사"
            />
            <label className="block">
              <span className="text-[1.3rem] font-semibold text-[#5D5D5D]">
                우편번호
              </span>
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
                <p className="mt-2 text-[1.2rem] text-[#8B8B8B]">
                  주소 검색을 불러오는 중입니다.
                </p>
              ) : null}
            </label>
          </div>

          <InputField
            label="주소"
            name="address"
            value={form.address}
            onChange={onChange}
            readOnly
          />
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
            <span className="text-[1.4rem] font-medium text-[#363636]">
              기본 배송지로 설정
            </span>
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

export function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1rem] bg-[#F8F5EF] px-6 py-5">
      <p className="text-[1.2rem] font-semibold text-[#8B8B8B]">{label}</p>
      <p className="mt-3 text-[2rem] font-semibold text-[#1D1D1D]">{value}</p>
    </div>
  );
}
