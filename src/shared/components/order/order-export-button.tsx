import type { OrderDetailDTO } from '@apis/telegro';
import { toastError } from '@components/common/toast/toast';
import { formatDate, formatNumber } from '@utils/format';
import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

type OrderExportButtonProps = {
  orders: OrderDetailDTO[];
  isFiltered?: boolean;
};

type ExcelRow = {
  No: number;
  주문번호: number | string;
  수령인명: string;
  전화번호: string;
  주소: string;
  상세주소_우편번호: string;
  상품명: string;
  수량: number;
  옵션: string;
  상품단가: string;
  총금액: string;
  주문상태: string;
  주문일자: string;
  요청사항: string;
};

const getOptionLabel = (
  product: NonNullable<OrderDetailDTO['products']>[number],
) =>
  [product.selectOption, product.inputOption, product.productModel]
    .filter(Boolean)
    .join(' / ') || 'N/A';

const getWorksheetData = (orders: OrderDetailDTO[]): ExcelRow[] =>
  orders.reduce<ExcelRow[]>(
    (rows: ExcelRow[], order: OrderDetailDTO, index: number) => {
      const products = order.products ?? [];

      const nextRows = products.map(
        (
          product: NonNullable<OrderDetailDTO['products']>[number],
        ): ExcelRow => ({
          No: index + 1,
          주문번호: order.orderId ?? '-',
          수령인명: order.deliveryAddress?.recipientName?.trim() || 'N/A',
          전화번호: order.deliveryAddress?.phoneNumber?.trim() || 'N/A',
          주소: order.deliveryAddress?.address?.trim() || 'N/A',
          상세주소_우편번호: `${
            order.deliveryAddress?.addressDetail?.trim() || 'N/A'
          } / ${order.deliveryAddress?.zipcode?.trim() || 'N/A'}`,
          상품명: product.productName?.trim() || 'N/A',
          수량: product.quantity ?? 0,
          옵션: getOptionLabel(product),
          상품단가: `${formatNumber(product.productPrice ?? 0)} KRW`,
          총금액: `${formatNumber(product.totalPrice ?? 0)} KRW`,
          주문상태: order.orderStatus || '-',
          주문일자: formatDate(order.createdAt),
          요청사항: order.request?.trim() || '-',
        }),
      );

      return [...rows, ...nextRows];
    },
    [],
  );

const getExportDate = () => new Date().toISOString().slice(0, 10);

const OrderExportButton = ({
  orders,
  isFiltered = false,
}: OrderExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!orders.length) {
      toastError('No data to export.');
      return;
    }

    const excelData = getWorksheetData(orders);
    if (!excelData.length) {
      toastError('No data to export.');
      return;
    }

    setIsExporting(true);

    try {
      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      const sheetName = isFiltered ? 'filtered_orders' : 'all_orders';
      const fileName = `${sheetName}_${getExportDate()}.xlsx`;

      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, fileName);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-3 rounded-[10px] bg-green-600 px-8 py-4 text-[1.5rem] font-medium text-white transition hover:bg-[#2B2B2B] disabled:cursor-not-allowed disabled:bg-[#8C8C8C]"
    >
      <FiDownload className="h-5 w-5" />
      {isExporting ? 'Exporting...' : 'Excel Download'}
    </button>
  );
};

export default OrderExportButton;
