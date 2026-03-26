import type { OrderDetailResponseDTO } from '@apis/telegro';
import { useGetOrderDetail } from '@apis/telegro';
import LoadingPage from '@components/common/loading-page';
import ErrorView from '@components/errors/error-view';
import { useNavigate, useParams } from 'react-router-dom';

import OrderDetailView from './order-detail-view';

type OrderDetailPageProps = {
  fallbackPath: string;
};

const OrderDetailPage = ({ fallbackPath }: OrderDetailPageProps) => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const parsedOrderId = Number(orderId);
  const hasValidOrderId = Number.isFinite(parsedOrderId) && parsedOrderId > 0;

  const orderDetailQuery = useGetOrderDetail(parsedOrderId, {
    query: {
      enabled: hasValidOrderId,
      staleTime: 60_000,
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

  return <OrderDetailView order={order} />;
};

export default OrderDetailPage;
