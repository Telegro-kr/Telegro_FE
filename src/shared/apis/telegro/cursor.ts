import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';

import type {
  CartListDTO,
  CartResponseDTO,
  GetOrdersParams,
  GetProductsCategory,
  NoticeDTO,
  NoticeListDTO,
  OrderDetailDTO,
  OrderListDTO,
  ProductListDTO,
  ProductResponseDTO,
  SuccessResponseCartListDTO,
  SuccessResponseNoticeListDTO,
  SuccessResponseOrderListDTO,
  SuccessResponseProductListDTO,
} from './$schemas';
import { axiosInstance, type ErrorType } from './axios-instance';

type CursorValue = number | string | Record<string, unknown>;

type CursorMeta = {
  cursor?: CursorValue | null;
  nextCursor?: CursorValue | null;
  nextId?: CursorValue | null;
  lastCursor?: CursorValue | null;
  hasNext?: boolean;
  hasMore?: boolean;
  isLast?: boolean;
  totalElement?: number;
  totalElements?: number;
};

type ProductCursorParams = {
  category: GetProductsCategory;
  size: number;
  cursor?: CursorValue;
};

type NoticeCursorParams = {
  size: number;
  cursor?: CursorValue;
};

type NoticeCursorPayload = CursorMeta & {
  content?: NoticeDTO[];
  nextCursorId?: number | string | null;
  nextCursorCreatedAt?: string | null;
  nextCursor?: {
    lastId?: number | string | null;
    lastCreatedAt?: string | null;
  } | null;
};

type OrderCursorParams = Omit<GetOrdersParams, 'page'> & {
  size: number;
  cursor?: CursorValue;
  orderStatus?: string;
};

type CartCursorParams = {
  size: number;
  cursor?: CursorValue;
};

type CartCursorPayload = CursorMeta & {
  content?: CartResponseDTO[];
};

type InfiniteHookOptions = {
  enabled?: boolean;
  staleTime?: number;
};

const CURSOR_PARAM_KEY = 'cursor';

const serializeCursor = (cursor: CursorValue | undefined) => {
  if (cursor === undefined || cursor === null || cursor === '') {
    return '';
  }

  if (typeof cursor === 'object') {
    return JSON.stringify(cursor);
  }

  return String(cursor);
};

const isCursorRecord = (cursor: CursorValue | undefined): cursor is Record<string, unknown> =>
  typeof cursor === 'object' && cursor !== null && !Array.isArray(cursor);

const resolveNextCursor = <TItem>(
  data: CursorMeta | undefined,
  items: TItem[],
  pageSize: number,
  getItemCursor: (item: TItem) => CursorValue | null | undefined,
) => {
  if (!data) {
    return undefined;
  }

  if (data.hasNext === false || data.hasMore === false || data.isLast === true) {
    return undefined;
  }

  const explicitCursor = data.nextCursor ?? data.cursor ?? data.nextId ?? data.lastCursor;
  if (explicitCursor !== undefined && explicitCursor !== null && explicitCursor !== '') {
    return explicitCursor;
  }

  if (items.length < pageSize) {
    return undefined;
  }

  const lastItem = items[items.length - 1];
  if (!lastItem) {
    return undefined;
  }

  return getItemCursor(lastItem) ?? undefined;
};

const withCursor = <TParams extends Record<string, unknown>>(
  params: TParams,
  cursor: CursorValue | undefined,
) => {
  if (cursor === undefined || cursor === null || cursor === '') {
    return params;
  }

  if (typeof cursor === 'object' && !Array.isArray(cursor)) {
    return {
      ...params,
      ...cursor,
    };
  }

  return {
    ...params,
    [CURSOR_PARAM_KEY]: cursor,
  };
};

export const getCursorProducts = (
  params: ProductCursorParams,
  options?: AxiosRequestConfig,
  signal?: AbortSignal,
) =>
  axiosInstance<SuccessResponseProductListDTO>(
    {
      url: '/products',
      method: 'GET',
      params: withCursor(
        {
          category: params.category,
          size: params.size,
        },
        params.cursor,
      ),
      signal,
    },
    options,
  );

export const useInfiniteProducts = (
  params: Omit<ProductCursorParams, 'cursor'>,
  options?: InfiniteHookOptions,
) =>
  useInfiniteQuery<
    SuccessResponseProductListDTO,
    InfiniteProductsError,
    InfiniteData<SuccessResponseProductListDTO>,
    readonly unknown[],
    CursorValue | undefined
  >({
    queryKey: ['/products', 'cursor', params] as const,
    initialPageParam: undefined as CursorValue | undefined,
    staleTime: options?.staleTime ?? 60_000,
    enabled: options?.enabled,
    queryFn: ({ pageParam, signal }) =>
      getCursorProducts({ ...params, cursor: pageParam as CursorValue | undefined }, undefined, signal),
    getNextPageParam: (lastPage) => {
      const data = lastPage.data as (ProductListDTO & CursorMeta) | undefined;
      const items = data?.products ?? [];
      return resolveNextCursor<ProductResponseDTO>(data, items, params.size, (item) => item.id);
    },
  });

export const getCursorNotices = (
  params: NoticeCursorParams,
  options?: AxiosRequestConfig,
  signal?: AbortSignal,
) =>
  axiosInstance<SuccessResponseNoticeListDTO>(
    {
      url: '/notices',
      method: 'GET',
      params: withCursor({ size: params.size }, params.cursor),
      signal,
    },
    options,
  );

export const useInfiniteNotices = (
  params: Omit<NoticeCursorParams, 'cursor'>,
  options?: InfiniteHookOptions,
) =>
  useInfiniteQuery<
    SuccessResponseNoticeListDTO,
    InfiniteNoticesError,
    InfiniteData<SuccessResponseNoticeListDTO>,
    readonly unknown[],
    CursorValue | undefined
  >({
    queryKey: ['/notices', 'cursor', params] as const,
    initialPageParam: undefined as CursorValue | undefined,
    staleTime: options?.staleTime ?? 60_000,
    enabled: options?.enabled,
    queryFn: ({ pageParam, signal }) =>
      getCursorNotices({ ...params, cursor: pageParam as CursorValue | undefined }, undefined, signal),
    getNextPageParam: (lastPage, _allPages, lastPageParam, allPageParams) => {
      const data = lastPage.data as (NoticeListDTO & CursorMeta & NoticeCursorPayload) | undefined;

      if (!data?.hasNext) {
        return undefined;
      }

      const nextCursor: CursorValue = {
        cursorId:
          data?.nextCursorId ??
          data?.nextCursor?.lastId ??
          null,
        cursorCreatedAt:
          data?.nextCursorCreatedAt ??
          data?.nextCursor?.lastCreatedAt ??
          null,
      };

      const nextCursorKey = serializeCursor(nextCursor);
      const currentCursorKey = serializeCursor(lastPageParam as CursorValue | undefined);
      const seenCursor = allPageParams.some(
        (pageParam) => serializeCursor(pageParam as CursorValue | undefined) === nextCursorKey,
      );

      if (
        !isCursorRecord(nextCursor) ||
        (!nextCursor.cursorId && !nextCursor.cursorCreatedAt) ||
        nextCursorKey === currentCursorKey ||
        seenCursor
      ) {
        return undefined;
      }

      return nextCursor;
    },
  });

export const getCursorOrders = (
  params: OrderCursorParams,
  options?: AxiosRequestConfig,
  signal?: AbortSignal,
) =>
  axiosInstance<SuccessResponseOrderListDTO>(
    {
      url: '/api/orders',
      method: 'GET',
      params: withCursor(
        {
          filterBy: params.filterBy,
          q: params.q,
          startDate: params.startDate,
          endDate: params.endDate,
          orderStatus: params.orderStatus,
          size: params.size,
        },
        params.cursor,
      ),
      signal,
    },
    options,
  );

export const useInfiniteOrders = (
  params: Omit<OrderCursorParams, 'cursor'>,
  options?: InfiniteHookOptions,
) =>
  useInfiniteQuery<
    SuccessResponseOrderListDTO,
    InfiniteOrdersError,
    InfiniteData<SuccessResponseOrderListDTO>,
    readonly unknown[],
    CursorValue | undefined
  >({
    queryKey: ['/api/orders', 'cursor', params] as const,
    initialPageParam: undefined as CursorValue | undefined,
    staleTime: options?.staleTime ?? 60_000,
    enabled: options?.enabled,
    queryFn: ({ pageParam, signal }) =>
      getCursorOrders({ ...params, cursor: pageParam as CursorValue | undefined }, undefined, signal),
    getNextPageParam: (lastPage) => {
      const data = lastPage.data as (OrderListDTO & CursorMeta) | undefined;
      const items = data?.orders ?? [];
      return resolveNextCursor<OrderDetailDTO>(data, items, params.size, (item) => item.orderId);
    },
  });

export const getCursorCartItems = (
  params: CartCursorParams,
  options?: AxiosRequestConfig,
  signal?: AbortSignal,
) =>
  axiosInstance<SuccessResponseCartListDTO>(
    {
      url: '/api/carts',
      method: 'GET',
      params: withCursor({ size: params.size }, params.cursor),
      signal,
    },
    options,
  );

export const useInfiniteCartItems = (
  params: Omit<CartCursorParams, 'cursor'>,
  options?: InfiniteHookOptions,
) =>
  useInfiniteQuery<
    SuccessResponseCartListDTO,
    InfiniteCartItemsError,
    InfiniteData<SuccessResponseCartListDTO>,
    readonly unknown[],
    CursorValue | undefined
  >({
    queryKey: ['/api/carts', 'cursor', params] as const,
    initialPageParam: undefined as CursorValue | undefined,
    staleTime: options?.staleTime ?? 60_000,
    enabled: options?.enabled,
    queryFn: ({ pageParam, signal }) =>
      getCursorCartItems({ ...params, cursor: pageParam as CursorValue | undefined }, undefined, signal),
    getNextPageParam: (lastPage) => {
      const data = lastPage.data as (CartListDTO & CursorMeta) | undefined;
      const cartPayload = data?.carts as CartCursorPayload | CartResponseDTO[] | undefined;
      const items = Array.isArray(cartPayload) ? cartPayload : cartPayload?.content ?? [];
      const cursorMeta = Array.isArray(cartPayload) ? data : cartPayload;
      return resolveNextCursor<CartResponseDTO>(cursorMeta, items, params.size, (item) => item.id);
    },
  });

export type InfiniteProductsError = ErrorType<unknown>;
export type InfiniteNoticesError = ErrorType<unknown>;
export type InfiniteOrdersError = ErrorType<unknown>;
export type InfiniteCartItemsError = ErrorType<unknown>;
