export const ORDER_STATUS_LABELS = {
  ORDER_CREATED: '주문 생성',
  PAYMENT_COMPLETED: '결제 완료',
  ORDER_COMPLETED: '주문 완료',
  ORDER_CANCELLED: '주문 취소',
  SHIPPING: '배송 중',
  DELIVERY_COMPLETED: '배송 완료',
} as const;

export type OrderStatusCode = keyof typeof ORDER_STATUS_LABELS;

export const ORDER_STATUS_OPTIONS: Array<{
  label: string;
  value: OrderStatusCode;
}> = [
  { label: ORDER_STATUS_LABELS.ORDER_CREATED, value: 'ORDER_CREATED' },
  { label: ORDER_STATUS_LABELS.PAYMENT_COMPLETED, value: 'PAYMENT_COMPLETED' },
  { label: ORDER_STATUS_LABELS.ORDER_COMPLETED, value: 'ORDER_COMPLETED' },
  { label: ORDER_STATUS_LABELS.SHIPPING, value: 'SHIPPING' },
  { label: ORDER_STATUS_LABELS.DELIVERY_COMPLETED, value: 'DELIVERY_COMPLETED' },
  { label: ORDER_STATUS_LABELS.ORDER_CANCELLED, value: 'ORDER_CANCELLED' },
];

export const ORDER_PROGRESS_STEPS: OrderStatusCode[] = [
  'ORDER_CREATED',
  'PAYMENT_COMPLETED',
  'ORDER_COMPLETED',
  'SHIPPING',
  'DELIVERY_COMPLETED',
];

export const getOrderStatusLabel = (status?: string | null) => {
  if (!status) {
    return '-';
  }

  return ORDER_STATUS_LABELS[status as OrderStatusCode] ?? status;
};
