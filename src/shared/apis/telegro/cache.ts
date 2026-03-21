import type { QueryClient } from '@tanstack/react-query';
import type {
  GetCartItemsParams,
  GetHitsParams,
  GetNoticesParams,
  GetOrdersParams,
  GetProductsParams,
  GetUsersParams,
} from './$schemas';
import {
  getGetCartItemsQueryKey,
  getGetCompanyDetailQueryKey,
  getGetHitsQueryKey,
  getGetMyPageQueryKey,
  getGetNoticeDetailQueryKey,
  getGetNoticesQueryKey,
  getGetOrderDetailQueryKey,
  getGetOrdersQueryKey,
  getGetPopNoticeQueryKey,
  getGetProductDetailQueryKey,
  getGetProductsQueryKey,
  getGetUserDetailQueryKey,
  getGetUsersQueryKey,
  useGetCartItemsQueryOptions,
  useGetCompanyDetailQueryOptions,
  useGetHitsQueryOptions,
  useGetMyPageQueryOptions,
  useGetNoticeDetailQueryOptions,
  useGetNoticesQueryOptions,
  useGetOrderDetailQueryOptions,
  useGetOrdersQueryOptions,
  useGetPopNoticeQueryOptions,
  useGetProductDetailQueryOptions,
  useGetProductsQueryOptions,
  useGetUserDetailQueryOptions,
  useGetUsersQueryOptions,
} from './$client';

export const telegroQueryKeys = {
  companyDetail: () => getGetCompanyDetailQueryKey(),
  userDetail: (userId: number) => getGetUserDetailQueryKey(userId),
  orderDetail: (orderId: number) => getGetOrderDetailQueryKey(orderId),
  products: (params: GetProductsParams) => getGetProductsQueryKey(params),
  productDetail: (productId: number) => getGetProductDetailQueryKey(productId),
  notices: (params: GetNoticesParams) => getGetNoticesQueryKey(params),
  noticeDetail: (noticeId: number) => getGetNoticeDetailQueryKey(noticeId),
  popNotice: () => getGetPopNoticeQueryKey(),
  users: (params: GetUsersParams) => getGetUsersQueryKey(params),
  myPage: () => getGetMyPageQueryKey(),
  orders: (params?: GetOrdersParams) => getGetOrdersQueryKey(params),
  hits: (params?: GetHitsParams) => getGetHitsQueryKey(params),
  cartItems: (params: GetCartItemsParams) => getGetCartItemsQueryKey(params),
} as const;

export const telegroQueryOptions = {
  companyDetail: () => useGetCompanyDetailQueryOptions(),
  userDetail: (userId: number) => useGetUserDetailQueryOptions(userId),
  orderDetail: (orderId: number) => useGetOrderDetailQueryOptions(orderId),
  products: (params: GetProductsParams) => useGetProductsQueryOptions(params),
  productDetail: (productId: number) => useGetProductDetailQueryOptions(productId),
  notices: (params: GetNoticesParams) => useGetNoticesQueryOptions(params),
  noticeDetail: (noticeId: number) => useGetNoticeDetailQueryOptions(noticeId),
  popNotice: () => useGetPopNoticeQueryOptions(),
  users: (params: GetUsersParams) => useGetUsersQueryOptions(params),
  myPage: () => useGetMyPageQueryOptions(),
  orders: (params?: GetOrdersParams) => useGetOrdersQueryOptions(params),
  hits: (params?: GetHitsParams) => useGetHitsQueryOptions(params),
  cartItems: (params: GetCartItemsParams) => useGetCartItemsQueryOptions(params),
} as const;

export const telegroPrefetch = {
  companyDetail: (queryClient: QueryClient) =>
    queryClient.prefetchQuery(telegroQueryOptions.companyDetail()),
  userDetail: (queryClient: QueryClient, userId: number) =>
    queryClient.prefetchQuery(telegroQueryOptions.userDetail(userId)),
  orderDetail: (queryClient: QueryClient, orderId: number) =>
    queryClient.prefetchQuery(telegroQueryOptions.orderDetail(orderId)),
  products: (queryClient: QueryClient, params: GetProductsParams) =>
    queryClient.prefetchQuery(telegroQueryOptions.products(params)),
  productDetail: (queryClient: QueryClient, productId: number) =>
    queryClient.prefetchQuery(telegroQueryOptions.productDetail(productId)),
  notices: (queryClient: QueryClient, params: GetNoticesParams) =>
    queryClient.prefetchQuery(telegroQueryOptions.notices(params)),
  noticeDetail: (queryClient: QueryClient, noticeId: number) =>
    queryClient.prefetchQuery(telegroQueryOptions.noticeDetail(noticeId)),
  popNotice: (queryClient: QueryClient) =>
    queryClient.prefetchQuery(telegroQueryOptions.popNotice()),
  users: (queryClient: QueryClient, params: GetUsersParams) =>
    queryClient.prefetchQuery(telegroQueryOptions.users(params)),
  myPage: (queryClient: QueryClient) => queryClient.prefetchQuery(telegroQueryOptions.myPage()),
  orders: (queryClient: QueryClient, params?: GetOrdersParams) =>
    queryClient.prefetchQuery(telegroQueryOptions.orders(params)),
  hits: (queryClient: QueryClient, params?: GetHitsParams) =>
    queryClient.prefetchQuery(telegroQueryOptions.hits(params)),
  cartItems: (queryClient: QueryClient, params: GetCartItemsParams) =>
    queryClient.prefetchQuery(telegroQueryOptions.cartItems(params)),
} as const;

export const telegroInvalidate = {
  companyDetail: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.companyDetail(),
    }),
  userDetail: (queryClient: QueryClient, userId: number) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.userDetail(userId),
    }),
  orderDetail: (queryClient: QueryClient, orderId: number) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.orderDetail(orderId),
    }),
  products: (queryClient: QueryClient, params: GetProductsParams) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.products(params),
    }),
  productDetail: (queryClient: QueryClient, productId: number) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.productDetail(productId),
    }),
  notices: (queryClient: QueryClient, params: GetNoticesParams) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.notices(params),
    }),
  noticeDetail: (queryClient: QueryClient, noticeId: number) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.noticeDetail(noticeId),
    }),
  popNotice: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.popNotice(),
    }),
  users: (queryClient: QueryClient, params: GetUsersParams) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.users(params),
    }),
  myPage: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.myPage(),
    }),
  orders: (queryClient: QueryClient, params?: GetOrdersParams) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.orders(params),
    }),
  hits: (queryClient: QueryClient, params?: GetHitsParams) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.hits(params),
    }),
  cartItems: (queryClient: QueryClient, params: GetCartItemsParams) =>
    queryClient.invalidateQueries({
      queryKey: telegroQueryKeys.cartItems(params),
    }),
  authBoundaries: (queryClient: QueryClient) =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: telegroQueryKeys.myPage() }),
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] }),
      queryClient.invalidateQueries({ queryKey: ['/api/carts'] }),
    ]),
} as const;
