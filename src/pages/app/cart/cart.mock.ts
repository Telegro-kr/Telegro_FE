import type { CartItem } from './cart.types';

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'item-1',
    name: '오일수 클렌징 오일 (미니)',
    subtitle: '50ml',
    point: 0,
    discount: 0,
    tone: 'clear',
    options: [
      { id: 'opt-1', label: '선택1', volume: '50ml', price: 8000, quantity: 1 },
      { id: 'opt-2', label: '선택2', volume: '50ml', price: 8000, quantity: 1 },
    ],
  },
  {
    id: 'item-2',
    name: '픽 오일 에센스',
    subtitle: '10ml',
    point: 0,
    discount: 0,
    tone: 'amber',
    options: [
      {
        id: 'opt-3',
        label: '선택1',
        volume: '10ml',
        price: 18000,
        quantity: 1,
      },
    ],
  },
];
