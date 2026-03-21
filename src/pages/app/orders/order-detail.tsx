import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  return <h1>Order Detail - #{orderId}</h1>;
};

export default OrderDetail;
