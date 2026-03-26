import { useMemo } from 'react';

import { useGetCartItems } from '@apis/telegro';

import { mapCartResponseToCartItems } from './cart.adapters';

export const CART_ITEMS_QUERY_PARAMS = {
  page: 0,
  size: 100,
};

export const useCartItemsQuery = () => {
  const query = useGetCartItems(CART_ITEMS_QUERY_PARAMS, {
    query: {
      staleTime: 60_000,
    },
  });

  const items = useMemo(
    () => mapCartResponseToCartItems(query.data?.data?.carts),
    [query.data?.data?.carts],
  );

  return {
    ...query,
    items,
  };
};
