import { useEffect, useMemo } from 'react';

import { useInfiniteCartItems } from '@apis/telegro';
import type {
  CartResponseDTO,
  SuccessResponseCartListDTO,
} from '@apis/telegro';

import { mapCartResponseToCartItems } from './cart.adapters';

export const CART_ITEMS_QUERY_PARAMS = {
  size: 20,
};

type CartPagePayload =
  | CartResponseDTO[]
  | {
      content?: CartResponseDTO[];
    }
  | undefined;

export const useCartItemsQuery = () => {
  const query = useInfiniteCartItems(CART_ITEMS_QUERY_PARAMS, {
    staleTime: 60_000,
  });

  useEffect(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const items = useMemo(
    () =>
      mapCartResponseToCartItems(
        (query.data?.pages ?? []).reduce<CartResponseDTO[]>(
          (acc, page: SuccessResponseCartListDTO) => {
            const carts = page.data?.carts as CartPagePayload;
            const normalizedCarts = Array.isArray(carts)
              ? carts
              : Array.isArray(carts?.content)
                ? carts.content
                : [];
            return [...acc, ...normalizedCarts];
          },
          [],
        ),
      ),
    [query.data?.pages],
  );

  return {
    ...query,
    items,
  };
};
