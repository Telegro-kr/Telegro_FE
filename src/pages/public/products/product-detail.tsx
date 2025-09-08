import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  return <h1>Product Detail (Public) - #{productId}</h1>;
}
