import ProductSectionContainer from '@components/product-section/product-section-container';
import { useNavigate } from 'react-router-dom';

const AdminProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-8 py-10">
      <ProductSectionContainer
        onClickProduct={(product) => {
          navigate(`/admin/products/${product.id}`);
        }}
      />
    </div>
  );
};

export default AdminProducts;
