import { toKoreanTime } from '@utils/format';
import { useLocation, useNavigate } from 'react-router-dom';

type CheckoutCompleteState = {
  orderId?: string;
  orderDate?: string;
  orderDetails?: {
    products: Array<{
      name: string;
      quantity: number;
      coverImage: string;
      totalPrice: number;
    }>;
    total: number;
  };
  userDetails?: {
    name: string;
    phone: string;
    email: string;
  };
  shippingInfo?: {
    postalCode: string;
    address: string;
    detailedAddress: string;
    request: string;
  };
  pointsToUse?: number;
  pointsToEarn?: number;
  shippingCost?: number;
  vbankInfo?: {
    vbank_name: string;
    vbank_num: string;
    vbank_holder: string;
    vbank_date: number;
  } | null;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);

const formatOrderDate = (value?: string) => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('ko-KR');
};

const CheckoutComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as CheckoutCompleteState | null) ?? null;

  if (!state) {
    return (
      <section className="min-h-screen bg-[#f6f6f6] px-5 py-10">
        <div className="mx-auto max-w-[900px] rounded-[2rem] bg-white px-8 py-16 text-center shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <h1 className="text-[2.6rem] font-semibold text-[#171717]">
            주문 정보를 찾을 수 없습니다.
          </h1>
          <p className="mt-3 text-[1.5rem] text-neutral-500">
            장바구니로 돌아가 다시 주문을 진행해주세요.
          </p>
          <button
            type="button"
            onClick={() => navigate('/app/cart')}
            className="mt-8 rounded-full bg-black px-6 py-3 text-[1.4rem] font-medium text-white"
          >
            장바구니로 이동
          </button>
        </div>
      </section>
    );
  }

  const products = state.orderDetails?.products ?? [];
  const total = state.orderDetails?.total ?? 0;
  const pointsToUse = state.pointsToUse ?? 0;
  const pointsToEarn = state.pointsToEarn ?? 0;
  const shippingCost = state.shippingCost ?? 0;
  const finalPrice = total - pointsToUse + shippingCost;
  const heroImage = products[0]?.coverImage || '/cart-empty.svg';

  return (
    <section className="min-h-screen bg-[#f6f6f6] px-5 py-10 text-[#111] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1080px] rounded-[2rem] bg-white px-8 py-10 shadow-[0_12px_40px_rgba(0,0,0,0.04)] lg:px-10 lg:py-12">
        <div className="flex flex-col items-center border-b border-neutral-200 pb-10 text-center">
          <img
            src={heroImage}
            alt="주문 완료"
            className="h-28 w-28 rounded-[1.6rem] border border-neutral-200 object-cover"
          />
          <h1 className="mt-6 text-[3rem] font-semibold tracking-[-0.04em] text-[#171717]">
            주문이 완료되었습니다
          </h1>
          <p className="mt-3 text-[1.5rem] text-neutral-500">
            주문일 {formatOrderDate(state.orderDate)} · 주문번호{' '}
            <span className="font-semibold text-[#171717]">{state.orderId ?? '-'}</span>
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-[1.6rem] bg-[#fafafa] p-6">
              <h2 className="text-[1.9rem] font-semibold text-[#171717]">주문 상품</h2>
              <div className="mt-5 space-y-4">
                {products.map((product, index) => (
                  <article
                    key={`${product.name}-${index}`}
                    className="flex gap-4 rounded-[1.3rem] border border-neutral-200 bg-white p-4"
                  >
                    <img
                      src={product.coverImage}
                      alt={product.name}
                      className="h-20 w-20 rounded-[1.2rem] border border-neutral-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[1.55rem] font-semibold text-[#171717]">
                        {product.name}
                      </p>
                      <p className="mt-2 text-[1.35rem] text-neutral-500">
                        수량 {product.quantity}개
                      </p>
                    </div>
                    <p className="text-[1.45rem] font-medium text-[#171717]">
                      {formatPrice(product.totalPrice)}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[1.6rem] bg-[#fafafa] p-6">
              <h2 className="text-[1.9rem] font-semibold text-[#171717]">배송 정보</h2>
              <div className="mt-5 space-y-3 text-[1.45rem] text-neutral-700">
                <p>
                  <span className="mr-3 text-neutral-500">이름</span>
                  {state.userDetails?.name || '-'}
                </p>
                <p>
                  <span className="mr-3 text-neutral-500">연락처</span>
                  {state.userDetails?.phone || '-'}
                </p>
                <p>
                  <span className="mr-3 text-neutral-500">주소</span>(
                  {state.shippingInfo?.postalCode || '-'}) {state.shippingInfo?.address || '-'}{' '}
                  {state.shippingInfo?.detailedAddress || ''}
                </p>
                {state.shippingInfo?.request ? (
                  <p>
                    <span className="mr-3 text-neutral-500">요청사항</span>
                    {state.shippingInfo.request}
                  </p>
                ) : null}
              </div>
            </section>

            {state.vbankInfo ? (
              <section className="rounded-[1.6rem] bg-[#eef5ff] p-6">
                <h2 className="text-[1.9rem] font-semibold text-[#171717]">가상계좌 정보</h2>
                <div className="mt-5 space-y-3 text-[1.45rem] text-neutral-700">
                  <p>
                    <span className="mr-3 text-neutral-500">은행</span>
                    {state.vbankInfo.vbank_name}
                  </p>
                  <p>
                    <span className="mr-3 text-neutral-500">계좌번호</span>
                    {state.vbankInfo.vbank_num}
                  </p>
                  <p>
                    <span className="mr-3 text-neutral-500">예금주</span>
                    {state.vbankInfo.vbank_holder || '-'}
                  </p>
                  <p>
                    <span className="mr-3 text-neutral-500">입금 기한</span>
                    {toKoreanTime(String(state.vbankInfo.vbank_date))}
                  </p>
                </div>
              </section>
            ) : null}
          </div>

          <aside className="rounded-[1.6rem] bg-[#171717] p-6 text-white">
            <h2 className="text-[1.9rem] font-semibold">결제 내역</h2>
            <div className="mt-6 space-y-4 text-[1.45rem]">
              <div className="flex items-center justify-between">
                <span className="text-white/70">상품 금액</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">사용 포인트</span>
                <span>- {formatPrice(pointsToUse)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">배송비</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">적립 예정 포인트</span>
                <span>{pointsToEarn}P</span>
              </div>
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-end justify-between">
                  <span className="text-[1.6rem] font-semibold">총 결제금액</span>
                  <span className="text-[2.2rem] font-semibold text-[#ffd26a]">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-8 w-full rounded-full bg-white px-6 py-4 text-[1.5rem] font-semibold text-[#171717]"
            >
              확인
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default CheckoutComplete;
