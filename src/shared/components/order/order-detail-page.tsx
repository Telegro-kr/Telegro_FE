import type { OrderDetailResponseDTO } from '@apis/telegro';
import { useCancelPayment, useGetOrderDetail } from '@apis/telegro';
import LoadingPage from '@components/common/loading-page';
import { toastSuccess } from '@components/common/toast/toast';
import ErrorView from '@components/errors/error-view';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import OrderDetailView from './order-detail-view';

type OrderDetailPageProps = {
  fallbackPath: string;
};

const OrderDetailPage = ({ fallbackPath }: OrderDetailPageProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { orderId } = useParams<{ orderId: string }>();
  const parsedOrderId = Number(orderId);
  const hasValidOrderId = Number.isFinite(parsedOrderId) && parsedOrderId > 0;

  const orderDetailQuery = useGetOrderDetail(parsedOrderId, {
    query: {
      enabled: hasValidOrderId,
      staleTime: 60_000,
    },
  });
  const cancelPaymentMutation = useCancelPayment({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        await orderDetailQuery.refetch();
        toastSuccess('취소되었습니다.');
      },
    },
  });

  if (!hasValidOrderId) {
    return <ErrorView onGoHome={() => navigate(fallbackPath)} />;
  }

  if (orderDetailQuery.isLoading) {
    return <LoadingPage />;
  }

  if (orderDetailQuery.isError || !orderDetailQuery.data?.data) {
    return <ErrorView onGoHome={() => navigate(fallbackPath)} />;
  }

  const order: OrderDetailResponseDTO = orderDetailQuery.data.data;

  return (
    <OrderDetailView
      order={order}
      onCancel={() => cancelPaymentMutation.mutate({ orderId: parsedOrderId })}
      isCancelPending={cancelPaymentMutation.isPending}
    />
  );
};

export default OrderDetailPage;
