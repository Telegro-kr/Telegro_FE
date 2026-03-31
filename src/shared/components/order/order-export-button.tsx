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
  no: number;
  orderNumber: number | string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  addressDetailAndZipcode: string;
  productName: string;
  quantity: number;
  option: string;
  unitPrice: string;
  totalPrice: string;
  orderStatus: string;
  orderDate: string;
  request: string;
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
          no: index + 1,
          orderNumber: order.orderId ?? '-',
          recipientName: order.deliveryAddress?.recipientName?.trim() || 'N/A',
          phoneNumber: order.deliveryAddress?.phoneNumber?.trim() || 'N/A',
          address: order.deliveryAddress?.address?.trim() || 'N/A',
          addressDetailAndZipcode: `${
            order.deliveryAddress?.addressDetail?.trim() || 'N/A'
          } / ${order.deliveryAddress?.zipcode?.trim() || 'N/A'}`,
          productName: product.productName?.trim() || 'N/A',
          quantity: product.quantity ?? 0,
          option: getOptionLabel(product),
          unitPrice: `${formatNumber(product.productPrice ?? 0)} KRW`,
          totalPrice: `${formatNumber(product.totalPrice ?? 0)} KRW`,
          orderStatus: order.orderStatus || '-',
          orderDate: formatDate(order.createdAt),
          request: order.request?.trim() || '-',
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
      className="inline-flex h-[5.3rem] shrink-0 cursor-pointer items-center justify-center gap-3 rounded-[12px] bg-[#171717] px-8 text-[1.6rem] font-medium text-white transition hover:bg-[#2B2B2B] disabled:cursor-not-allowed disabled:bg-[#8C8C8C]"
    >
      <FiDownload className="h-5 w-5" />
      {isExporting ? 'Exporting...' : 'Excel Download'}
    </button>
  );
};

export default OrderExportButton;
