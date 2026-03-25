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
  statusLabel: string;
};

type Props = {
  data: OrderRow[];
};

const OrderListTable = ({ data }: Props) => {
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
              <td className="px-2 text-center align-middle text-[1.4rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.id}</span>
              </td>

              <td className="px-2 text-center align-middle text-[1.4rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.productName}</span>
              </td>

              <td className="px-2 text-center align-middle text-[1.4rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.optionLabel}</span>
              </td>

              <td className="px-2 text-center align-middle text-[1.4rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.quantity}</span>
              </td>

              <td className="px-2 text-center align-middle text-[1.4rem] font-semibold text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.unitPrice}</span>
              </td>

              <td className="px-2 text-center align-middle md:px-4">
                <div className="flex flex-col items-center justify-center leading-tight">
                  <span className="block max-w-full truncate text-[1.4rem] font-semibold text-slate-900 md:text-[1.8rem]">
                    {row.totalPrice}
                  </span>
                  {row.totalSubLabel ? (
                    <span className="mt-1 block max-w-full truncate text-base font-semibold text-slate-500">
                      {row.totalSubLabel}
                    </span>
                  ) : null}
                </div>
              </td>

              <td className="px-2 text-center align-middle text-[1.4rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block leading-tight whitespace-pre-line">
                  {row.orderInfo.replace(' ', '\n')}
                </span>
              </td>

              <td className="px-2 text-center align-middle text-[1.4rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.customerInfo}</span>
              </td>

              <td className="px-2 text-center align-middle md:px-4">
                <span className="block truncate text-[1.4rem] font-medium text-slate-700 md:text-[1.7rem]">
                  {row.statusLabel}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListTable;
