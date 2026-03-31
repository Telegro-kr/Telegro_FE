import { useInfiniteOrders } from '@apis/telegro';
import type { OrderDetailDTO } from '@apis/telegro';
import type { OrderRow, OrderStatusValue } from '@components/order/order-list-table';
import { getOrderStatusLabel } from '@constants/orderStatus';
import { formatNumber } from '@utils/format';
import { useMemo } from 'react';

export type OrderFilterType = 'product' | 'user';

type UseOrderListParams = {
  pageSize?: number;
  searchKeyword?: string;
  filterBy?: OrderFilterType;
};

const DEFAULT_PAGE_SIZE = 10;

const formatPrice = (value?: number | null) => {
  if (value === undefined || value === null) {
    return '-';
  }

  return `${formatNumber(value)} KRW`;
};

const formatProductName = (order: OrderDetailDTO) => {
  const products = order.products ?? [];
  const firstProductName = products[0]?.productName?.trim();

  if (!firstProductName) {
    return 'Unknown product';
  }

  return products.length > 1
    ? `${firstProductName} +${products.length - 1}`
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

const getQuantity = (order: OrderDetailDTO) =>
  (order.products ?? []).reduce((sum, product) => sum + (product.quantity ?? 0), 0);

const getUnitPrice = (order: OrderDetailDTO) => formatPrice(order.products?.[0]?.productPrice);

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

const getCustomerInfo = (order: OrderDetailDTO) => order.userInfo?.username?.trim() || '-';

const getStatusValue = (order: OrderDetailDTO): OrderStatusValue =>
  (order.orderStatus as OrderStatusValue | undefined) ?? 'ORDER_CREATED';

type OrderPageData = {
  content?: OrderDetailDTO[];
  orders?:
    | OrderDetailDTO[]
    | {
        content?: OrderDetailDTO[];
        totalElement?: number;
        totalElements?: number;
      };
  totalElement?: number;
  totalElements?: number;
};

const getPageOrders = (page: {
  data?: OrderPageData;
}) => {
  const { data } = page;

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.orders)) {
    return data.orders;
  }

  if (Array.isArray(data?.orders?.content)) {
    return data.orders.content;
  }

  return [];
};

const getPageTotalCount = (page?: { data?: OrderPageData }) =>
  page?.data?.totalElements ??
  page?.data?.totalElement ??
  (Array.isArray(page?.data?.orders) ? undefined : page?.data?.orders?.totalElements) ??
  (Array.isArray(page?.data?.orders) ? undefined : page?.data?.orders?.totalElement);

export const useOrderList = ({
  pageSize = DEFAULT_PAGE_SIZE,
  searchKeyword = '',
  filterBy,
}: UseOrderListParams = {}) => {
  const normalizedKeyword = searchKeyword.trim();
  const hasSearchKeyword = normalizedKeyword.length > 0;

  const orderQuery = useInfiniteOrders(
    {
      size: pageSize,
      q: hasSearchKeyword ? normalizedKeyword : undefined,
      filterBy: hasSearchKeyword ? filterBy : undefined,
    },
    {
      staleTime: 60_000,
    },
  );

  const orders = useMemo<OrderRow[]>(
    () => {
      const rows = (orderQuery.data?.pages ?? []).reduce<OrderRow[]>((acc, page, pageIndex) => {
        const rows = getPageOrders(page).map((order, index) => ({
          id: order.orderId ?? pageIndex * pageSize + index + 1,
          orderId: order.orderId ?? pageIndex * pageSize + index + 1,
          productName: formatProductName(order),
          optionLabel: formatOptionLabel(order),
          quantity: getQuantity(order),
          unitPrice: getUnitPrice(order),
          totalPrice: formatPrice(order.amount),
          totalSubLabel:
            order.shoppingCost === 0
              ? '(Free shipping)'
              : order.shoppingCost
                ? `Shipping ${formatPrice(order.shoppingCost)}`
                : undefined,
          orderInfo: getOrderInfo(order),
          customerInfo: getCustomerInfo(order),
          statusLabel: getOrderStatusLabel(order.orderStatus),
          statusValue: getStatusValue(order),
        }));

        return [...acc, ...rows];
      }, []);

      return rows.reduce<OrderRow[]>((acc, row) => {
        if (acc.some((currentRow) => currentRow.orderId === row.orderId)) {
          return acc;
        }

        return [...acc, row];
      }, []);
    },
    [orderQuery.data?.pages, pageSize],
  );

  const pages = orderQuery.data?.pages ?? [];
  const lastPage = pages.length ? pages[pages.length - 1] : undefined;
  const totalCount =
    getPageTotalCount(lastPage) ??
    getPageTotalCount(pages[0]) ??
    orders.length;

  return {
    orders,
    totalCount,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    hasNextPage: Boolean(orderQuery.hasNextPage),
    isFetchingNextPage: orderQuery.isFetchingNextPage,
    fetchNextPage: () => orderQuery.fetchNextPage(),
    refetch: orderQuery.refetch,
  };
};

export default useOrderList;
