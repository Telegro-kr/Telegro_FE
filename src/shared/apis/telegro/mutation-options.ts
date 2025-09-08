import type {
  MutationFunction,
  UseMutationOptions,
} from '@tanstack/react-query';

/**
 * orval가 넘겨주는 mutationOptions + mutationFn을 받아
 * 제네릭을 보존한 채로 그대로 되돌려줍니다.
 * 필요 시 meta 병합 등만 해줍니다.
 */
export function customMutationOptions<TData, TError, TVariables, TContext>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    mutationFn: MutationFunction<TData, TVariables>;
  },
  meta?: Record<string, unknown>,
): UseMutationOptions<TData, TError, TVariables, TContext> {
  const { meta: prevMeta, ...rest } = options;

  // (선택) 기본값 넣고 싶으면 여기서
  const defaults: Partial<
    UseMutationOptions<TData, TError, TVariables, TContext>
  > = {
    // retry: 0,
  };

  return {
    ...defaults,
    ...rest, // <- mutationFn 포함하여 그대로 유지
    meta: { ...(prevMeta as any), ...(meta ?? {}) },
  };
}
