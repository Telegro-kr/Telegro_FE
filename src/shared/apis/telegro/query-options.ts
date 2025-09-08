import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
} from '@tanstack/react-query';

/**
 * queryKey / queryFn을 포함한 옵션을 받아
 * 제네릭을 보존한 채로 되돌려줍니다.
 * (생성된 코드에서 추가로 DataTag 캐스팅을 하므로 여기선 QueryKey만 보장)
 */
export function customQueryOptions<TQueryFnData, TError, TData>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    'queryKey' | 'queryFn'
  > & {
    queryKey: QueryKey;
    queryFn: QueryFunction<TQueryFnData, QueryKey>;
  },
  _meta?: Record<string, unknown>,
): UseQueryOptions<TQueryFnData, TError, TData> & { queryKey: QueryKey } {
  const { queryKey, queryFn, ...rest } = options;

  const defaults: Partial<UseQueryOptions<TQueryFnData, TError, TData>> = {
    gcTime: 300_000,
    retry: 1,
  };

  return {
    ...defaults,
    ...rest,
    queryKey,
    queryFn,
  };
}
