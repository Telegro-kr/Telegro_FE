import type {
  CartProductDTO,
  DeliveryAddressDetailDTO,
  OrderDetailResponseDTO,
  OrderDetailResponseDTOPaymentMethod,
  OrderDetailResponseDTOOrderStatus,
  UserOrderDetailDTO,
} from '@apis/telegro';
import {
  ORDER_PROGRESS_STEPS,
  canCancelOrder,
  getOrderStatusLabel,
  isTerminalOrderStatus,
} from '@constants/orderStatus';
import { formatPrice as formatWon } from '@utils/format';
import type { ReactNode } from 'react';
import {
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiUser,
} from 'react-icons/fi';

const paymentMethodMap: Record<OrderDetailResponseDTOPaymentMethod, string> = {
  CREDIT_CARD: 'Card',
  BANK_TRANSFER: 'Bank Transfer',
  V_BANK: 'Virtual Account',
};

const orderSteps: OrderDetailResponseDTOOrderStatus[] = ORDER_PROGRESS_STEPS;

function formatPrice(value?: number) {
  return formatWon(value ?? 0);
}

function formatDate(value?: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

function getStatusLabel(status?: OrderDetailResponseDTOOrderStatus) {
  return getOrderStatusLabel(status);
}

function getStepIndex(status?: OrderDetailResponseDTOOrderStatus) {
  if (!status) return 0;

  const index = orderSteps.indexOf(status);
  return index >= 0 ? index : 0;
}

function getOptionLabel(product: CartProductDTO) {
  return [product.selectOption, product.inputOption]
    .filter(Boolean)
    .join(' / ');
}

function getAddressText(address?: DeliveryAddressDetailDTO) {
  if (!address) return '-';
  return (
    [address.address, address.addressDetail].filter(Boolean).join(' ') || '-'
  );
}

function getUserName(user?: UserOrderDetailDTO) {
  return user?.name?.trim() || '-';
}

function getPhoneLabel(
  user?: UserOrderDetailDTO,
  address?: DeliveryAddressDetailDTO,
) {
  return address?.phoneNumber || user?.phone || user?.managerPhone || '-';
}

function StepIndicator({
  currentStatus,
}: {
  currentStatus?: OrderDetailResponseDTOOrderStatus;
}) {
  const isTerminalStatus = isTerminalOrderStatus(currentStatus);

  if (isTerminalStatus) {
    return (
      <div className="overflow-hidden rounded-[1.8rem] border border-neutral-200 bg-white">
        <div className="flex items-center gap-4 bg-[#171717] px-6 py-5 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <FiClock className="text-lg" />
          </div>
          <div>
            <p className="caption2 text-white/70 uppercase">Order Status</p>
            <p className="caption4 mt-1 text-white">
              {getStatusLabel(currentStatus)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-neutral-200 bg-white">
      <div className="grid gap-px bg-neutral-200 md:grid-cols-5">
        {orderSteps.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={step}
              className={[
                'flex items-center gap-4 px-5 py-5',
                isActive ? 'bg-black text-white' : 'bg-white text-neutral-500',
              ].join(' ')}
            >
              <div
                className={[
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold',
                  isActive
                    ? 'border-white/40 bg-white text-black'
                    : 'border-neutral-300 bg-neutral-50 text-neutral-400',
                ].join(' ')}
              >
                {isActive ? <FiCheckCircle className="text-lg" /> : index + 1}
              </div>
              <div className="min-w-0">
                <p
                  className={[
                    'caption2 uppercase',
                    isActive ? 'text-white' : 'text-gray-900',
                  ].join(' ')}
                >
                  Step {index + 1}
                </p>
                <p
                  className={[
                    'caption4 mt-1',
                    isActive ? 'text-white' : 'text-gray-900',
                  ].join(' ')}
                >
                  {getStatusLabel(step)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: CartProductDTO }) {
  const optionLabel = getOptionLabel(product);

  return (
    <article className="relative rounded-[18px] border border-neutral-200 bg-white px-5 py-5 shadow-[0_12px_32px_rgba(0,0,0,0.04)] sm:px-6">
      <div className="absolute top-5 right-5 z-10">
        <div className="bg-primary rounded-full px-[1rem] py-[0.7rem] text-center text-white">
          <p className="caption2 font-semibold">
            {formatPrice(product.totalPrice)}
          </p>
        </div>
      </div>

      <div className="grid gap-5 pr-20 lg:grid-cols-[100px_minmax(0,1fr)] lg:items-center">
        <div className="flex size-[10rem] items-center justify-center overflow-hidden rounded-xl pr-1">
          {product.coverImage ? (
            <img
              src={product.coverImage}
              alt={product.productName ?? 'Ordered product'}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="text-xs text-neutral-400">NO IMAGE</div>
          )}
        </div>

        <div className="min-w-0">
          <p className="title4 text-neutral-900">
            {product.productName ?? '-'}
          </p>
          <p className="caption2 mt-1 text-neutral-500">
            {product.productModel?.trim() || 'No model information'}
          </p>
          <div className="mt-4 grid gap-3 rounded-xl bg-neutral-50 px-4 py-3 md:grid-cols-3">
            <div className="min-w-0">
              <p className="caption3 text-gray-700">옵션</p>
              <p className="caption4 mt-2 truncate text-neutral-900">
                {optionLabel || '-'}
              </p>
            </div>
            <div className="min-w-0 md:border-l md:border-neutral-200 md:pl-4">
              <p className="caption3 text-gray-700">단가</p>
              <p className="caption4 mt-2 text-neutral-900">
                {formatPrice(product.productPrice)}
              </p>
            </div>
            <div className="min-w-0 md:border-l md:border-neutral-200 md:pl-4">
              <p className="caption3 text-gray-700">수량</p>
              <p className="caption4 mt-2 text-neutral-900">
                {product.quantity ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={[
        'flex items-center justify-between gap-4 px-3 py-3 text-[1.5rem]',
        strong ? 'font-semibold text-neutral-950' : 'text-neutral-600',
      ].join(' ')}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[18px] border border-neutral-200 bg-white px-6 py-6 shadow-[0_12px_32px_rgba(0,0,0,0.04)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-700">
          {icon}
        </div>
        <h2 className="title5 text-gray-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 px-4 py-4">
      <p className="caption6 text-neutral-400 uppercase">{label}</p>
      <p className="mt-2 text-[1.5rem] font-medium text-neutral-900">{value}</p>
    </div>
  );
}

type OrderDetailViewProps = {
  order: OrderDetailResponseDTO;
  onCancel?: () => void;
  isCancelPending?: boolean;
};

const OrderDetailView = ({
  order,
  onCancel,
  isCancelPending = false,
}: OrderDetailViewProps) => {
  const products = order.products ?? [];
  const user = order.user;
  const address = order.deliveryAddress;
  const receiptUrl = order.receipt_url || order.cash_receipt_url;
  const canCancel = canCancelOrder(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#f6f6f6] px-5 py-10 text-[#111] sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1100px] bg-white px-5 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:px-8 lg:px-12 lg:py-12">
        <header className="mb-12 flex flex-col gap-8">
          <StepIndicator currentStatus={order.orderStatus} />
          {canCancel ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={isCancelPending}
                className="rounded-full border border-[#D64545] px-6 py-3 text-[1.4rem] font-semibold text-[#D64545] transition hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelPending ? '취소 처리 중...' : '주문 취소'}
              </button>
            </div>
          ) : null}
        </header>

        <div className="space-y-8">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="title4 font-semibold text-neutral-950">
                주문 상품
              </h2>
              <p className="caption3 text-neutral-500">{products.length}개</p>
            </div>

            {products.length ? (
              <div className="space-y-4">
                {products.map((product, index) => (
                  <ProductCard
                    key={
                      product.cartId ??
                      product.productId ??
                      `${product.productName ?? 'product'}-${index}`
                    }
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.8rem] border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center text-neutral-500">
                No product information available.
              </div>
            )}
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <InfoCard icon={<FiUser />} title="Orderer">
              <InfoRow label="이름" value={getUserName(user)} />
              <InfoRow label="연락처" value={getPhoneLabel(user, address)} />
              <InfoRow label="이메일" value={user?.email?.trim() || '-'} />
              <InfoRow label="요청사항" value={order.request?.trim() || '-'} />
              <InfoRow
                label="주문 번호"
                value={order.imp_uid ?? '결제 미완료'}
              />
              <InfoRow label="주문 일시" value={formatDate(order.orderDate)} />
            </InfoCard>

            <InfoCard icon={<FiMapPin />} title="Delivery">
              <InfoRow label="배송지명" value={address?.name?.trim() || '-'} />
              <InfoRow
                label="수령인"
                value={address?.recipientName?.trim() || '-'}
              />
              <InfoRow
                label="배송 연락처"
                value={address?.phoneNumber || '-'}
              />
              <InfoRow label="배송지 주소" value={getAddressText(address)} />
              <InfoRow label="우편번호" value={address?.zipcode || '-'} />
            </InfoCard>

            <InfoCard icon={<FiCheckCircle />} title="Payment Summary">
              <InfoRow label="상품 금액" value={formatPrice(order.price)} />
              <InfoRow
                label="할인 금액"
                value={formatPrice(order.discountPrice)}
              />
              <InfoRow label="배송비" value={formatPrice(order.shippingCost)} />
              <InfoRow
                label="결제 수단"
                value={
                  order.paymentMethod
                    ? (paymentMethodMap[order.paymentMethod] ??
                      order.paymentMethod)
                    : '-'
                }
              />
              <SummaryRow
                label="총 결제 금액"
                value={formatPrice(order.totalPrice)}
                strong
              />

              {receiptUrl ? (
                <div className="space-y-3 pt-2">
                  <a
                    href={receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-primary caption2 flex-row-center gap-2 rounded-[8px] px-5 py-3 text-white transition hover:bg-[#FFB800]"
                  >
                    매출전표 보기
                    <FiExternalLink />
                  </a>
                </div>
              ) : null}
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
