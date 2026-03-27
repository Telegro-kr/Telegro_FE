import type { OrderDetailDTO } from '@apis/telegro';
import { useGetOrders } from '@apis/telegro';
import { getOrderStatusLabel } from '@constants/orderStatus';
import type { OrderRow, OrderStatusValue } from '@components/order/order-list-table';
import { formatNumber } from '@utils/format';
import { useMemo } from 'react';

export type OrderFilterType = 'product' | 'user';

type UseOrderListParams = {
  pageSize?: number;
  searchKeyword?: string;
  filterBy?: OrderFilterType;
};

const DEFAULT_PAGE_SIZE = 10000;

const formatPrice = (value?: number | null) => {
  if (value === undefined || value === null) {
    return '-';
  }

  return `${formatNumber(value)}원`;
};

const formatProductName = (order: OrderDetailDTO) => {
  const products = order.products ?? [];
  const firstProductName = products[0]?.productName?.trim();

  if (!firstProductName) {
    return '상품 정보 없음';
  }

  return products.length > 1
    ? `${firstProductName} 외 ${products.length - 1}건`
    : firstProductName;
};

const formatOptionLabel = (order: OrderDetailDTO) => {
  const firstProduct = order.products?.[0];
  const optionValues = [
    firstProduct?.selectOption?.trim(),
    firstProduct?.inputOption?.trim(),
    firstProduct?.productModel?.trim(),
  ].filter(Boolean);

  return optionValues.length ? optionValues.join(' / ') : '-';
};

const getQuantity = (order: OrderDetailDTO) => {
  return (order.products ?? []).reduce(
    (sum, product) => sum + (product.quantity ?? 0),
    0,
  );
};

const getUnitPrice = (order: OrderDetailDTO) => {
  return formatPrice(order.products?.[0]?.productPrice);
};

const getOrderInfo = (order: OrderDetailDTO) => {
  if (!order.createdAt) {
    return '-';
  }

  const date = new Date(order.createdAt);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const getCustomerInfo = (order: OrderDetailDTO) => {
  return order.userInfo?.username?.trim() || '-';
};

const getStatusValue = (order: OrderDetailDTO): OrderStatusValue => {
  return (order.orderStatus as OrderStatusValue | undefined) ?? 'ORDER_CREATED';
};

export const useOrderList = ({
  pageSize = DEFAULT_PAGE_SIZE,
  searchKeyword = '',
  filterBy,
}: UseOrderListParams = {}) => {
  const normalizedKeyword = searchKeyword.trim();
  const hasSearchKeyword = normalizedKeyword.length > 0;

  const orderQuery = useGetOrders(
    {
      size: pageSize,
      q: hasSearchKeyword ? normalizedKeyword : undefined,
      filterBy: hasSearchKeyword ? filterBy : undefined,
    },
    {
      query: {
        staleTime: 60_000,
      },
    },
  );

  const orders = useMemo<OrderRow[]>(() => {
    return (orderQuery.data?.data?.orders ?? []).map((order, index) => ({
      id: order.orderId ?? index + 1,
      orderId: order.orderId ?? index + 1,
      productName: formatProductName(order),
      optionLabel: formatOptionLabel(order),
      quantity: getQuantity(order),
      unitPrice: getUnitPrice(order),
      totalPrice: formatPrice(order.amount),
      totalSubLabel:
        order.shoppingCost === 0
          ? '(무료배송)'
          : order.shoppingCost
            ? `배송비 ${formatPrice(order.shoppingCost)}`
            : undefined,
      orderInfo: getOrderInfo(order),
      customerInfo: getCustomerInfo(order),
      statusLabel: getOrderStatusLabel(order.orderStatus),
      statusValue: getStatusValue(order),
    }));
  }, [orderQuery.data?.data?.orders]);

  return {
    orders,
    totalCount: orderQuery.data?.data?.totalElement ?? orders.length,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    refetch: orderQuery.refetch,
  };
};

export default useOrderList;
