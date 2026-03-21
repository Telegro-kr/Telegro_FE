import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  return <h1>Product Detail (Public) - #{productId}</h1>;
};

export default ProductDetail;
