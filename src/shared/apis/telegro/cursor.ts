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

type CursorRecord = Record<string, unknown>;

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

type OrderCursorPayload = CursorMeta & {
  content?: OrderDetailDTO[];
  nextCursorId?: number | string | null;
  nextCursorCreatedAt?: string | null;
  orders?:
    | OrderDetailDTO[]
    | {
        content?: OrderDetailDTO[];
        hasNext?: boolean;
        nextCursorId?: number | string | null;
        nextCursorCreatedAt?: string | null;
        nextCursor?: {
          cursorId?: number | string | null;
          cursorCreatedAt?: string | null;
          lastId?: number | string | null;
          lastCreatedAt?: string | null;
        } | null;
      };
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

const CURSOR_PARAM_KEY = 'cursorId';

const serializeCursor = (cursor: CursorValue | undefined) => {
  if (cursor === undefined || cursor === null || cursor === '') {
    return '';
  }

  if (typeof cursor === 'object') {
    return JSON.stringify(cursor);
  }

  return String(cursor);
};

const hasCursorValue = (value: unknown) => value !== undefined && value !== null && value !== '';

const getContentArray = <TItem>(value: unknown): TItem[] => {
  if (Array.isArray(value)) {
    return value as TItem[];
  }

  if (value && typeof value === 'object' && Array.isArray((value as { content?: unknown[] }).content)) {
    return (value as { content: TItem[] }).content;
  }

  return [];
};

const getLastArrayItem = <TItem>(items: TItem[]) => (items.length ? items[items.length - 1] : undefined);

const getBoolean = (value: unknown) => (typeof value === 'boolean' ? value : undefined);

const getNumberOrString = (value: unknown) =>
  typeof value === 'number' || typeof value === 'string' ? value : undefined;

const getString = (value: unknown) => (typeof value === 'string' ? value : undefined);

const toCursorRecord = (value: unknown): CursorRecord | undefined =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as CursorRecord) : undefined;

const getOrderCursorPayload = (data: OrderCursorPayload | undefined) => {
  const nestedOrders = toCursorRecord(data?.orders);

  return {
    items: getContentArray<OrderDetailDTO>(data?.content ?? data?.orders),
    hasNext:
      data?.hasNext ??
      getBoolean(nestedOrders?.hasNext) ??
      (data?.isLast === true ? false : undefined),
    cursorId:
      getNumberOrString(data?.nextCursorId) ??
      getNumberOrString(nestedOrders?.nextCursorId) ??
      getNumberOrString(toCursorRecord(nestedOrders?.nextCursor)?.cursorId) ??
      getNumberOrString(toCursorRecord(nestedOrders?.nextCursor)?.lastId),
    cursorCreatedAt:
      getString(data?.nextCursorCreatedAt) ??
      getString(nestedOrders?.nextCursorCreatedAt) ??
      getString(toCursorRecord(nestedOrders?.nextCursor)?.cursorCreatedAt) ??
      getString(toCursorRecord(nestedOrders?.nextCursor)?.lastCreatedAt),
  };
};

const getExplicitNextCursor = (
  data: CursorMeta | undefined,
  pageParam: CursorValue | undefined,
  allPageParams: unknown[],
) => {
  if (!data) {
    return undefined;
  }

  const nestedNextCursor = toCursorRecord(data.nextCursor);
  const cursorId =
    getNumberOrString((data as CursorRecord).nextCursorId) ??
    getNumberOrString((data as CursorRecord).cursorId) ??
    getNumberOrString(nestedNextCursor?.cursorId) ??
    getNumberOrString(nestedNextCursor?.lastId);
  const cursorCreatedAt =
    getString((data as CursorRecord).nextCursorCreatedAt) ??
    getString((data as CursorRecord).cursorCreatedAt) ??
    getString(nestedNextCursor?.cursorCreatedAt) ??
    getString(nestedNextCursor?.lastCreatedAt);

  const recordCursor =
    hasCursorValue(cursorId) || hasCursorValue(cursorCreatedAt)
      ? {
          ...(hasCursorValue(cursorId) ? { cursorId } : {}),
          ...(hasCursorValue(cursorCreatedAt) ? { cursorCreatedAt } : {}),
        }
      : undefined;

  const explicitCursor =
    recordCursor ??
    data.nextCursor ??
    data.cursor ??
    data.nextId ??
    data.lastCursor;

  if (!hasCursorValue(explicitCursor)) {
    return undefined;
  }

  const nextCursorKey = serializeCursor(explicitCursor as CursorValue);
  const currentCursorKey = serializeCursor(pageParam);
  const seenCursor = allPageParams.some(
    (currentPageParam) => serializeCursor(currentPageParam as CursorValue | undefined) === nextCursorKey,
  );

  if (nextCursorKey === currentCursorKey || seenCursor) {
    return undefined;
  }

  return explicitCursor as CursorValue;
};

const resolveNextCursor = <TItem>(
  data: CursorMeta | undefined,
  items: TItem[],
  pageSize: number,
  getItemCursor: (item: TItem) => CursorValue | null | undefined,
  pageParam?: CursorValue | undefined,
  allPageParams: unknown[] = [],
) => {
  if (!data) {
    return undefined;
  }

  if (
    data.hasNext === false ||
    data.hasMore === false ||
    data.isLast === true ||
    getBoolean((data as CursorRecord).hasNext) === false
  ) {
    return undefined;
  }

  const explicitCursor = getExplicitNextCursor(data, pageParam, allPageParams);
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
    getNextPageParam: (lastPage, _allPages, lastPageParam, allPageParams) => {
      const data = lastPage.data as (ProductListDTO & CursorMeta & { content?: ProductResponseDTO[] }) | undefined;
      const items = getContentArray<ProductResponseDTO>(data?.content ?? data?.products);
      return resolveNextCursor<ProductResponseDTO>(
        data,
        items,
        params.size,
        (item) => item.id,
        lastPageParam as CursorValue | undefined,
        allPageParams,
      );
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
      const items = getContentArray<NoticeDTO>(data?.content ?? data?.notices);
      return resolveNextCursor<NoticeDTO>(
        data,
        items,
        params.size,
        (item) => item.id,
        lastPageParam as CursorValue | undefined,
        allPageParams,
      );
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
    getNextPageParam: (lastPage, _allPages, lastPageParam, allPageParams) => {
      const data = lastPage.data as (OrderListDTO & OrderCursorPayload) | undefined;
      const { items, hasNext, cursorId, cursorCreatedAt } = getOrderCursorPayload(data);

      if (hasNext === false) {
        return undefined;
      }

      if (hasCursorValue(cursorId) || hasCursorValue(cursorCreatedAt)) {
        const nextCursor = {
          ...(hasCursorValue(cursorId) ? { cursorId } : {}),
          ...(hasCursorValue(cursorCreatedAt) ? { cursorCreatedAt } : {}),
        };
        const nextCursorKey = serializeCursor(nextCursor);
        const currentCursorKey = serializeCursor(lastPageParam as CursorValue | undefined);
        const seenCursor = allPageParams.some(
          (pageParam) => serializeCursor(pageParam as CursorValue | undefined) === nextCursorKey,
        );

        if (nextCursorKey === currentCursorKey || seenCursor) {
          return undefined;
        }

        return nextCursor;
      }

      const lastOrder = getLastArrayItem(items);
      if (!lastOrder?.orderId || !lastOrder.createdAt) {
        return undefined;
      }

      const nextCursor = {
        cursorId: lastOrder.orderId,
        cursorCreatedAt: lastOrder.createdAt,
      };
      const nextCursorKey = serializeCursor(nextCursor);
      const currentCursorKey = serializeCursor(lastPageParam as CursorValue | undefined);
      const seenCursor = allPageParams.some(
        (pageParam) => serializeCursor(pageParam as CursorValue | undefined) === nextCursorKey,
      );

      if (nextCursorKey === currentCursorKey || seenCursor) {
        return undefined;
      }

      return nextCursor;
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
    getNextPageParam: (lastPage, _allPages, lastPageParam, allPageParams) => {
      const data = lastPage.data as (CartListDTO & CursorMeta) | undefined;
      const cartPayload = data?.carts as CartCursorPayload | CartResponseDTO[] | undefined;
      const items = getContentArray<CartResponseDTO>(cartPayload);
      const cursorMeta = (Array.isArray(cartPayload) ? data : cartPayload) as CursorMeta | undefined;
      return resolveNextCursor<CartResponseDTO>(
        cursorMeta,
        items,
        params.size,
        (item) => item.id,
        lastPageParam as CursorValue | undefined,
        allPageParams,
      );
    },
  });

export type InfiniteProductsError = ErrorType<unknown>;
export type InfiniteNoticesError = ErrorType<unknown>;
export type InfiniteOrdersError = ErrorType<unknown>;
export type InfiniteCartItemsError = ErrorType<unknown>;
