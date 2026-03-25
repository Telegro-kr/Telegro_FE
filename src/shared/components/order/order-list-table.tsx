import React from 'react';

export type OrderRow = {
  id: number;
  productName: string;
  optionLabel: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  totalSubLabel?: string;
  orderInfo: string;
  customerInfo: string;
  canPay: boolean;
};

export const mockOrders: OrderRow[] = [
  {
    id: 1,
    productName: '홍길동',
    optionLabel: 'example@email.com',
    quantity: 1,
    unitPrice: '18,000원',
    totalPrice: '18,000원',
    totalSubLabel: '(무료배송)',
    orderInfo: '홍길동',
    customerInfo: '홍길동',
    canPay: false,
  },
  {
    id: 2,
    productName: '홍길동',
    optionLabel: 'example@email.com',
    quantity: 2,
    unitPrice: '18,000원',
    totalPrice: '$500.00',
    orderInfo: '홍길동',
    customerInfo: '홍길동',
    canPay: false,
  },
  {
    id: 3,
    productName: '홍길동',
    optionLabel: 'example@email.com',
    quantity: 3,
    unitPrice: '18,000원',
    totalPrice: '$500.00',
    orderInfo: '홍길동',
    customerInfo: '홍길동',
    canPay: true,
  },
  {
    id: 4,
    productName: '홍길동',
    optionLabel: 'example@email.com',
    quantity: 4,
    unitPrice: '18,000원',
    totalPrice: '$500.00',
    orderInfo: '홍길동',
    customerInfo: '홍길동',
    canPay: false,
  },
  {
    id: 5,
    productName: '홍길동',
    optionLabel: 'example@email.com',
    quantity: 5,
    unitPrice: '18,000원',
    totalPrice: '$500.00',
    orderInfo: '홍길동',
    customerInfo: '홍길동',
    canPay: true,
  },
  {
    id: 6,
    productName: '홍길동',
    optionLabel: 'example@email.com',
    quantity: 3,
    unitPrice: '18,000원',
    totalPrice: '$500.00',
    orderInfo: '홍길동',
    customerInfo: '홍길동',
    canPay: true,
  },
  {
    id: 7,
    productName: '홍길동',
    optionLabel: 'example@email.com',
    quantity: 1,
    unitPrice: '18,000원',
    totalPrice: '$500.00',
    orderInfo: '홍길동',
    customerInfo: '홍길동',
    canPay: false,
  },
  {
    id: 8,
    productName: '홍길동',
    optionLabel: 'example@email.com',
    quantity: 20,
    unitPrice: '18,000원',
    totalPrice: '$500.00',
    orderInfo: '홍길동',
    customerInfo: '홍길동',
    canPay: true,
  },
];

type Props = {
  data?: OrderRow[];
  onPay?: (row: OrderRow) => void;
};

const OrderListTable = ({ data = mockOrders, onPay }: Props) => {
  return (
    <div className="w-full rounded-[1.6rem] border border-slate-200 bg-white">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="h-[8.6rem] border-b border-slate-200">
            <th className="w-[5%] px-2 py-6 text-center align-middle text-[1.4rem] font-semibold text-slate-500 md:px-4 md:text-[1.6rem]">
              No.
            </th>
            <th className="w-[13%] px-2 py-6 text-center align-middle text-[1.4rem] font-semibold text-slate-500 md:px-4 md:text-[1.6rem]">
              상품명
            </th>
            <th className="w-[19%] px-2 py-6 text-center align-middle text-[1.4rem] font-semibold text-slate-500 md:px-4 md:text-[1.6rem]">
              옵션 선택
            </th>
            <th className="w-[6%] px-2 py-6 text-center align-middle text-[1.4rem] font-semibold text-slate-500 md:px-4 md:text-[1.6rem]">
              수량
            </th>
            <th className="w-[10%] px-2 py-6 text-center align-middle text-[1.4rem] font-semibold text-slate-500 md:px-4 md:text-[1.6rem]">
              단가
            </th>
            <th className="w-[12%] px-2 py-6 text-center align-middle text-[1.4rem] font-semibold text-slate-500 md:px-4 md:text-[1.6rem]">
              총 금액
            </th>
            <th className="w-[11%] px-2 py-6 text-center align-middle text-[1.4rem] font-semibold text-slate-500 md:px-4 md:text-[1.6rem]">
              주문 정보
            </th>
            <th className="w-[11%] px-2 py-6 text-center align-middle text-[1.4rem] font-semibold text-slate-500 md:px-4 md:text-[1.6rem]">
              주문자 정보
            </th>
            <th className="w-[13%] px-2 py-6 align-middle md:px-4">
              <div className="flex items-center justify-center gap-2 text-[1.4rem] font-semibold text-slate-500 md:text-[1.6rem]">
                <span>주문 상태</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="#4B5563"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="h-[9.2rem] border-b border-slate-200 last:border-b-0"
            >
              <td className="px-2 text-center align-middle text-[1.5rem] font-normal break-words text-slate-900 md:px-4 md:text-[1.8rem]">
                {row.id}
              </td>

              <td className="px-2 text-center align-middle text-[1.5rem] font-normal break-words text-slate-900 md:px-4 md:text-[1.8rem]">
                <span>{row.productName}</span>
              </td>

              <td className="px-2 text-center align-middle text-[1.4rem] font-normal break-all text-slate-900 md:px-4 md:text-[1.8rem]">
                <span>{row.optionLabel}</span>
              </td>

              <td className="px-2 text-center align-middle text-[1.5rem] font-normal break-words text-slate-900 md:px-4 md:text-[1.8rem]">
                {row.quantity}
              </td>

              <td className="px-2 text-center align-middle text-[1.5rem] font-semibold break-words text-slate-900 md:px-4 md:text-[1.8rem]">
                {row.unitPrice}
              </td>

              <td className="px-2 text-center align-middle md:px-4">
                <div className="flex flex-col items-center justify-center leading-tight">
                  <span className="text-[1.5rem] font-semibold break-words text-slate-900 md:text-[1.8rem]">
                    {row.totalPrice}
                  </span>
                  {row.totalSubLabel ? (
                    <span className="mt-1 text-xs font-semibold text-slate-500">
                      {row.totalSubLabel}
                    </span>
                  ) : null}
                </div>
              </td>

              <td className="px-2 text-center align-middle text-[1.5rem] font-normal break-words text-slate-900 md:px-4 md:text-[1.8rem]">
                {row.orderInfo}
              </td>

              <td className="px-2 text-center align-middle text-[1.5rem] font-normal break-words text-slate-900 md:px-4 md:text-[1.8rem]">
                {row.customerInfo}
              </td>

              <td className="px-2 text-center align-middle md:px-4">
                <button
                  type="button"
                  disabled={!row.canPay}
                  onClick={() => onPay?.(row)}
                  className={[
                    'inline-flex h-10 w-full max-w-[12rem] items-center justify-center rounded-md px-2 text-[1.4rem] font-medium transition-colors md:h-11 md:text-[1.8rem]',
                    row.canPay
                      ? 'bg-[#FFC633] text-white hover:brightness-95'
                      : 'cursor-not-allowed bg-slate-200 text-slate-500',
                  ].join(' ')}
                >
                  Pay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListTable;
