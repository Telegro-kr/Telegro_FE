export type CartTone = 'clear' | 'amber';

export type CartOption = {
  id: string;
  label: string;
  volume: string;
  price: number;
  quantity: number;
};

export type CartItem = {
  id: string;
  name: string;
  subtitle: string;
  point: number;
  discount: number;
  tone: CartTone;
  options: CartOption[];
};

export type CartSummary = {
  itemCount: number;
  orderPrice: number;
  point: number;
  discount: number;
  deliveryFee: number;
  finalPrice: number;
};
