import {
  telegroInvalidate,
  useCreateOrder,
  useDeleteCartItem,
  useUpdateCartItem,
} from '@apis/telegro';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { CartItem } from './cart.types';
import {
  buildSelectedItems,
  calculateCartSummary,
  getAllOptionIds,
  isItemFullySelected,
} from './cart.utils';
import { CART_ITEMS_QUERY_PARAMS } from './use-cart-items-query';

const parseCartId = (optionId: string) => {
  const cartId = Number(optionId);

  if (!Number.isFinite(cartId)) {
    throw new Error(`Invalid cart option id: ${optionId}`);
  }

  return cartId;
};

export const useCart = (initialItems: CartItem[]) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(() =>
    getAllOptionIds(initialItems),
  );
  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartItemMutation = useDeleteCartItem();
  const createOrderMutation = useCreateOrder();

  useLayoutEffect(() => {
    setItems(initialItems);
    setSelectedOptionIds(getAllOptionIds(initialItems));
  }, [initialItems]);

  const selectedItems = useMemo(
    () => buildSelectedItems(items, selectedOptionIds),
    [items, selectedOptionIds],
  );

  const summary = useMemo(() => calculateCartSummary(selectedItems), [selectedItems]);

  const allSelected =
    items.length > 0 &&
    items.every((item) => isItemFullySelected(item, selectedOptionIds));

  const invalidateCartItems = () =>
    telegroInvalidate.cartItems(queryClient, CART_ITEMS_QUERY_PARAMS);

  const toggleAll = () => {
    setSelectedOptionIds(allSelected ? [] : getAllOptionIds(items));
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId],
    );
  };

  const toggleItem = (item: CartItem) => {
    setSelectedOptionIds((prev) => {
      const selected = isItemFullySelected(item, prev);

      if (selected) {
        return prev.filter((id) => !item.options.some((option) => option.id === id));
      }

      return Array.from(new Set([...prev, ...item.options.map((option) => option.id)]));
    });
  };

  const updateQuantity = async (optionId: string, delta: number) => {
    const previousItems = items;
    const targetOption = previousItems
      .flatMap((item) => item.options)
      .find((option) => option.id === optionId);

    if (!targetOption) {
      return;
    }

    const nextQuantity = Math.max(1, targetOption.quantity + delta);

    if (nextQuantity === targetOption.quantity) {
      return;
    }

    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        options: item.options.map((option) =>
          option.id === optionId ? { ...option, quantity: nextQuantity } : option,
        ),
      })),
    );

    try {
      await updateCartItemMutation.mutateAsync({
        cartId: parseCartId(optionId),
        data: { quantity: nextQuantity },
      });
      await invalidateCartItems();
    } catch {
      setItems(previousItems);
      toastError('수량 변경에 실패했습니다.');
    }
  };

  const removeOption = async (optionId: string) => {
    const previousItems = items;
    const previousSelectedOptionIds = selectedOptionIds;

    setItems((prev) =>
      prev
        .map((item) => ({
          ...item,
          options: item.options.filter((option) => option.id !== optionId),
        }))
        .filter((item) => item.options.length > 0),
    );

    setSelectedOptionIds((prev) => prev.filter((id) => id !== optionId));

    try {
      await deleteCartItemMutation.mutateAsync({
        cartId: parseCartId(optionId),
      });
      await invalidateCartItems();
      toastSuccess('상품이 장바구니에서 삭제되었습니다.');
    } catch {
      setItems(previousItems);
      setSelectedOptionIds(previousSelectedOptionIds);
      toastError('상품 삭제에 실패했습니다.');
    }
  };

  const removeItem = async (itemId: string) => {
    const targetItem = items.find((item) => item.id === itemId);
    if (!targetItem) {
      return;
    }

    if (!window.confirm('정말로 이 상품을 장바구니에서 삭제하시겠습니까?')) {
      return;
    }

    const previousItems = items;
    const previousSelectedOptionIds = selectedOptionIds;

    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedOptionIds((prev) =>
      prev.filter((id) => !targetItem.options.some((option) => option.id === id)),
    );

    try {
      await Promise.all(
        targetItem.options.map((option) =>
          deleteCartItemMutation.mutateAsync({
            cartId: parseCartId(option.id),
          }),
        ),
      );
      await invalidateCartItems();
      toastSuccess('상품이 장바구니에서 삭제되었습니다.');
    } catch {
      setItems(previousItems);
      setSelectedOptionIds(previousSelectedOptionIds);
      toastError('상품 삭제에 실패했습니다.');
    }
  };

  const removeSelected = async () => {
    if (!selectedOptionIds.length) {
      toastError('삭제할 상품을 선택해주세요.');
      return;
    }

    const previousItems = items;
    const previousSelectedOptionIds = selectedOptionIds;

    setItems((prev) =>
      prev
        .map((item) => ({
          ...item,
          options: item.options.filter(
            (option) => !selectedOptionIds.includes(option.id),
          ),
        }))
        .filter((item) => item.options.length > 0),
    );
    setSelectedOptionIds([]);

    try {
      await Promise.all(
        previousSelectedOptionIds.map((optionId) =>
          deleteCartItemMutation.mutateAsync({
            cartId: parseCartId(optionId),
          }),
        ),
      );
      await invalidateCartItems();
      toastSuccess('선택한 상품이 삭제되었습니다.');
    } catch {
      setItems(previousItems);
      setSelectedOptionIds(previousSelectedOptionIds);
      toastError('선택 삭제에 실패했습니다.');
    }
  };

  const purchase = async (optionIds: string[]) => {
    if (!optionIds.length) {
      toastError('구매할 상품을 선택해주세요.');
      return;
    }

    try {
      const response = await createOrderMutation.mutateAsync({
        data: optionIds.map(parseCartId),
      });

      navigate('/app/checkout', {
        state: {
          orderData: response.data,
        },
      });
    } catch {
      toastError('주문 생성에 실패했습니다.');
    }
  };

  return {
    items,
    selectedOptionIds,
    summary,
    allSelected,
    toggleAll,
    toggleOption,
    toggleItem,
    updateQuantity,
    removeOption,
    removeItem,
    removeSelected,
    purchaseSelected: () => purchase(selectedOptionIds),
    purchaseAll: () => purchase(getAllOptionIds(items)),
  };
};
