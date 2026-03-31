import { useUpdateOrderStatus } from '@apis/telegro';
import {
  ORDER_STATUS_OPTIONS,
  type OrderStatusCode,
} from '@constants/orderStatus';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export type OrderStatusValue = OrderStatusCode;

export type OrderRow = {
  id: number;
  orderId: number;
  productName: string;
  optionLabel: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  totalSubLabel?: string;
  orderInfo: string;
  customerInfo: string;
  statusLabel: string;
  statusValue: OrderStatusValue;
};

type Props = {
  data: OrderRow[];
  detailBasePath?: string;
};

const STATUS_OPTIONS: Array<{ label: string; value: OrderStatusValue }> =
  ORDER_STATUS_OPTIONS;

const useOutsideClose = (
  isOpen: boolean,
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen, onClose, ref]);
};

const OrderStatusControl = ({ row }: { row: OrderRow }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const updateOrderStatus = useUpdateOrderStatus({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        setIsOpen(false);
      },
    },
  });

  useOutsideClose(isOpen, containerRef, () => setIsOpen(false));

  const isCancelled = row.statusValue === 'ORDER_CANCELLED';
  const availableOptions =
    row.statusValue === 'ORDER_CREATED'
      ? STATUS_OPTIONS.filter((option) => option.value === 'ORDER_CANCELLED')
      : STATUS_OPTIONS.filter((option) => option.value !== 'ORDER_CANCELLED');

  if (isCancelled) {
    return (
      <div className="inline-flex h-[4.4rem] w-full max-w-[10.5rem] items-center justify-center rounded-[12px] bg-[#F5F5F5] px-3 text-[1.3rem] font-medium text-slate-500 md:text-[1.5rem]">
        {row.statusLabel}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex justify-center"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        disabled={updateOrderStatus.isPending}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-[4.4rem] w-full max-w-[10.5rem] items-center justify-center gap-2 rounded-[12px] bg-[#F5F5F5] px-3 text-[1.3rem] font-medium text-[#2B2B2B] transition hover:bg-[#EBEBEB] disabled:cursor-not-allowed disabled:opacity-60 md:text-[1.5rem]"
      >
        <span className="truncate">{row.statusLabel}</span>
        <FiChevronDown className="shrink-0" />
      </button>

      {isOpen ? (
        <div className="absolute top-[calc(100%+0.8rem)] z-20 min-w-[14rem] rounded-[1.2rem] border border-[#E6E6E6] bg-white p-2 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
          {availableOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={
                option.value === row.statusValue || updateOrderStatus.isPending
              }
              onClick={() => {
                updateOrderStatus.mutate({
                  orderId: row.orderId,
                  params: { status: option.value },
                });
              }}
              className={[
                'flex w-full items-center rounded-[0.8rem] px-4 py-3 text-left text-[1.5rem] transition-colors',
                option.value === row.statusValue
                  ? 'cursor-default bg-[#FFF7E0] font-semibold text-[#2B2B2B]'
                  : 'text-[#555555] hover:bg-[#F5F5F5]',
              ].join(' ')}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const OrderListTable = ({ data, detailBasePath = '/app/orders' }: Props) => {
  const navigate = useNavigate();
  const [isHeaderFilterOpen, setIsHeaderFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatusValue | 'ALL'
  >('ALL');
  const headerFilterRef = useRef<HTMLDivElement>(null);

  useOutsideClose(isHeaderFilterOpen, headerFilterRef, () =>
    setIsHeaderFilterOpen(false),
  );

  const filteredData = useMemo(() => {
    if (selectedStatus === 'ALL') {
      return data;
    }

    return data.filter((row) => row.statusValue === selectedStatus);
  }, [data, selectedStatus]);

  const selectedStatusLabel =
    selectedStatus === 'ALL'
      ? '주문 상태'
      : (STATUS_OPTIONS.find((option) => option.value === selectedStatus)
          ?.label ?? '주문 상태');

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
              <div
                ref={headerFilterRef}
                className="relative flex items-center justify-center"
              >
                <button
                  type="button"
                  onClick={() => setIsHeaderFilterOpen((prev) => !prev)}
                  className="flex items-center justify-center gap-2 text-[1.4rem] font-semibold text-slate-500 md:text-[1.6rem]"
                >
                  <span>{selectedStatusLabel}</span>
                  <FiChevronDown className="shrink-0" />
                </button>

                {isHeaderFilterOpen ? (
                  <div className="absolute top-[calc(100%+0.8rem)] z-20 min-w-[14rem] rounded-[1.2rem] border border-[#E6E6E6] bg-white p-2 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStatus('ALL');
                        setIsHeaderFilterOpen(false);
                      }}
                      className={[
                        'flex w-full items-center rounded-[0.8rem] px-4 py-3 text-left text-[1.5rem] transition-colors',
                        selectedStatus === 'ALL'
                          ? 'bg-[#FFF7E0] font-semibold text-[#2B2B2B]'
                          : 'text-[#555555] hover:bg-[#F5F5F5]',
                      ].join(' ')}
                    >
                      전체
                    </button>
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSelectedStatus(option.value);
                          setIsHeaderFilterOpen(false);
                        }}
                        className={[
                          'flex w-full items-center rounded-[0.8rem] px-4 py-3 text-left text-[1.5rem] transition-colors',
                          option.value === selectedStatus
                            ? 'bg-[#FFF7E0] font-semibold text-[#2B2B2B]'
                            : 'text-[#555555] hover:bg-[#F5F5F5]',
                        ].join(' ')}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredData.map((row, index) => (
            <tr
              key={`${row.orderId}-${index}`}
              onClick={() => navigate(`${detailBasePath}/${row.orderId}`)}
              className="h-[8rem] cursor-pointer border-b border-slate-200 transition last:border-b-0 hover:bg-[#FAFAFA]"
            >
              <td className="px-2 text-center align-middle text-[1.5rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.id}</span>
              </td>
              <td className="px-2 text-center align-middle text-[1.5rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.productName}</span>
              </td>
              <td className="px-2 text-center align-middle text-[1.4rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.optionLabel}</span>
              </td>
              <td className="px-2 text-center align-middle text-[1.5rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.quantity}</span>
              </td>
              <td className="px-2 text-center align-middle text-[1.5rem] font-semibold text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.unitPrice}</span>
              </td>
              <td className="px-2 text-center align-middle md:px-4">
                <div className="flex flex-col items-center justify-center leading-tight">
                  <span className="block max-w-full truncate text-[1.5rem] font-semibold text-slate-900 md:text-[1.8rem]">
                    {row.totalPrice}
                  </span>
                  {row.totalSubLabel ? (
                    <span className="caption5 mt-1 block max-w-full truncate text-slate-500">
                      {row.totalSubLabel}
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="px-2 text-center align-middle text-[1.5rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block leading-tight whitespace-pre-line">
                  {row.orderInfo.replace(' ', '\n')}
                </span>
              </td>
              <td className="px-2 text-center align-middle text-[1.5rem] font-normal text-slate-900 md:px-4 md:text-[1.8rem]">
                <span className="block truncate">{row.customerInfo}</span>
              </td>
              <td className="px-2 text-center align-middle md:px-4">
                <OrderStatusControl row={row} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListTable;
