import { getStoredUserRole, isBusinessOrderRole } from '@state/session';

import type { CartSummary as CartSummaryType } from '../cart.types';
import { formatWon } from '../cart.utils';

const VAT_NOTICE =
  '상기 금액은 부과세(VAT)별도 금액으로 입금 처리시 결제 금액 + 부과세 합계로 입금하시기 바랍니다.';

type CartSummaryProps = {
  summary: CartSummaryType;
};

export function CartSummary({ summary }: CartSummaryProps) {
  const shouldShowVatNotice = isBusinessOrderRole(getStoredUserRole());

  return (
    <section className="mt-16 border-y border-black py-10 lg:grid lg:grid-cols-[1fr_420px] lg:gap-10">
      <div className="mb-10 lg:mb-0">
        <h3 className="title3">총 주문금액</h3>
      </div>

      <div className="space-y-5 text-[15px]">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">주문상품 수</span>
          <span className="font-medium">{summary.itemCount}개</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">주문금액</span>
          <span className="font-medium">{formatWon(summary.orderPrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">할인금액</span>
          <span className="font-medium">- {formatWon(summary.discount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-500">배송비</span>
          <span className="font-medium">{formatWon(summary.deliveryFee)}</span>
        </div>
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-neutral-500">적립 예정 포인트</div>
            <div className="mt-1 text-xs text-neutral-400">
              * 회원 로그인 시 적립되는 포인트입니다.
            </div>
          </div>
          <span className="font-medium">{formatWon(summary.point)}</span>
        </div>
        <div className="border-t border-dashed border-neutral-200 pt-5">
          <div className="flex items-end justify-between">
            <span className="body3">최종결제금액</span>
            <span className="title1 text-[#d93a32]">
              {formatWon(summary.finalPrice)}
            </span>
          </div>
          {shouldShowVatNotice ? (
            <p className="mt-3 text-[13px] leading-6 text-neutral-500">
              {VAT_NOTICE}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
