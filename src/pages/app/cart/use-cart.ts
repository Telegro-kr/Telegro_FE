import { useMemo, useState } from 'react';

import type { CartItem } from './cart.types';
import {
  buildSelectedItems,
  calculateCartSummary,
  getAllOptionIds,
  isItemFullySelected,
} from './cart.utils';

export const useCart = (initialItems: CartItem[]) => {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(() =>
    getAllOptionIds(initialItems),
  );

  const selectedItems = useMemo(
    () => buildSelectedItems(items, selectedOptionIds),
    [items, selectedOptionIds],
  );

  const summary = useMemo(() => calculateCartSummary(selectedItems), [selectedItems]);

  const allSelected =
    items.length > 0 &&
    items.every((item) => isItemFullySelected(item, selectedOptionIds));

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

  const updateQuantity = (optionId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        options: item.options.map((option) =>
          option.id === optionId
            ? { ...option, quantity: Math.max(1, option.quantity + delta) }
            : option,
        ),
      })),
    );
  };

  const removeOption = (optionId: string) => {
    setItems((prev) =>
      prev
        .map((item) => ({
          ...item,
          options: item.options.filter((option) => option.id !== optionId),
        }))
        .filter((item) => item.options.length > 0),
    );

    setSelectedOptionIds((prev) => prev.filter((id) => id !== optionId));
  };

  const removeItem = (itemId: string) => {
    const targetItem = items.find((item) => item.id === itemId);
    if (!targetItem) {
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedOptionIds((prev) =>
      prev.filter((id) => !targetItem.options.some((option) => option.id === id)),
    );
  };

  const removeSelected = () => {
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
  };
};
