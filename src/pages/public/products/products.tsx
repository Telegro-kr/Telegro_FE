import ProductSectionContainer from '@components/product-section/product-section-container';
import { useNavigate } from 'react-router-dom';

const PublicProducts = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full max-w-[160rem] px-[2rem] py-[5rem] md:px-[3rem] lg:px-[10rem]">
      <ProductSectionContainer
        variant="list"
        onClickProduct={(product) => {
          navigate(`/products/${product.id}`);
        }}
      />
    </section>
  );
};

export default PublicProducts;
