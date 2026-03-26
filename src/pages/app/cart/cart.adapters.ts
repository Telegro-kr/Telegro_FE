import type { CartResponseDTO, CartResponseDTOProductCategory } from '@apis/telegro';

import type { CartItem } from './cart.types';

const CATEGORY_LABELS: Partial<Record<CartResponseDTOProductCategory, string>> = {
  HEADSET: '헤드셋',
  PHONE_AMP: '폰앰프',
  LINE_CORD: '라인코드',
  RECORDER: '녹음기기',
  ACCESSORY: '악세서리',
};

const resolveTone = (category?: CartResponseDTOProductCategory): CartItem['tone'] =>
  category === 'ACCESSORY' || category === 'RECORDER' ? 'amber' : 'clear';

const resolveOptionLabel = (cart: CartResponseDTO) =>
  cart.selectOption?.trim() || cart.inputOption?.trim() || '기본 옵션';

const resolveVolume = (cart: CartResponseDTO) => {
  const model = cart.productModel?.trim();
  if (model) {
    return model;
  }

  const category = cart.productCategory ? CATEGORY_LABELS[cart.productCategory] : undefined;
  return category ?? '옵션 정보 없음';
};

export const mapCartResponseToCartItems = (carts?: CartResponseDTO[]): CartItem[] => {
  if (!carts?.length) {
    return [];
  }

  const groupedItems = new Map<string, CartItem>();

  carts.forEach((cart, index) => {
    const cartId = cart.id ?? index;
    const groupKey = [
      cart.productName?.trim() || '상품 정보 없음',
      cart.productModel?.trim() || '',
      cart.productCategory || '',
    ].join('::');

    const existingItem = groupedItems.get(groupKey);
    const option = {
      id: String(cartId),
      label: resolveOptionLabel(cart),
      volume: resolveVolume(cart),
      price: cart.productPrice ?? 0,
      quantity: cart.quantity ?? 1,
    };

    if (existingItem) {
      existingItem.options.push(option);
      return;
    }

    groupedItems.set(groupKey, {
      id: groupKey,
      name: cart.productName?.trim() || '상품 정보 없음',
      subtitle: cart.productModel?.trim() || '모델 정보 없음',
      imageSrc: cart.coverImage?.trim() || '/product1.png',
      point: 0,
      discount: 0,
      tone: resolveTone(cart.productCategory),
      options: [option],
    });
  });

  return Array.from(groupedItems.values());
};
