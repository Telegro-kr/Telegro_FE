import { formatPrice, normalizePriceValue } from '@utils/format';

import type { CartItem, CartSummary } from './cart.types';

export const formatWon = (value: number | string) => formatPrice(value);

export const getAllOptionIds = (items: CartItem[]) =>
  items.reduce<string[]>(
    (optionIds, item) => [...optionIds, ...item.options.map((option) => option.id)],
    [],
  );

export const buildSelectedItems = (items: CartItem[], selectedOptionIds: string[]) =>
  items
    .map((item) => ({
      ...item,
      options: item.options.filter((option) => selectedOptionIds.includes(option.id)),
    }))
    .filter((item) => item.options.length > 0);

export const calculateCartSummary = (selectedItems: CartItem[]): CartSummary => {
  let itemCount = 0;
  let orderPrice = 0;
  let point = 0;
  let discount = 0;

  selectedItems.forEach((item) => {
    item.options.forEach((option) => {
      itemCount += option.quantity;
      orderPrice += normalizePriceValue(option.price) * option.quantity;
      point += item.point * option.quantity;
      discount += item.discount * option.quantity;
    });
  });

  return {
    itemCount,
    orderPrice,
    point,
    discount,
    deliveryFee: 0,
    finalPrice: orderPrice - discount,
  };
};

export const getItemTotalPrice = (item: CartItem) =>
  item.options.reduce(
    (sum, option) => sum + normalizePriceValue(option.price) * option.quantity,
    0,
  );

export const isItemFullySelected = (item: CartItem, selectedOptionIds: string[]) =>
  item.options.every((option) => selectedOptionIds.includes(option.id));
