import { useParams } from 'react-router-dom';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  return <h1>Order Detail - #{orderId}</h1>;
}
