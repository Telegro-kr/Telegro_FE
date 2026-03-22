import ProductDetailContainer from '@components/product-detail/product-detail-container';
import { useParams } from 'react-router-dom';

const AdminProductDetail = () => {
  const { productId } = useParams();

  return (
    <div className="px-8 py-10">
      <ProductDetailContainer
        product={{
          productModel: `ADMIN-${productId ?? '001'}`,
          productName: 'Carry On Cocktail Kit',
          options: ['기본 구성', '1개'],
          category: 'ACCESSORY',
          content:
            '여행 가방에 가볍게 넣어두기 좋은 칵테일 키트입니다. 군더더기 없는 패키지와 차분한 무드의 디테일을 중심으로 구성되어 선물용으로도 잘 어울립니다.\n\n패키지 내부에는 간단한 칵테일 제조에 필요한 기본 구성이 포함되어 있으며, 감각적인 오브제로도 활용할 수 있도록 절제된 톤의 디자인을 적용했습니다.',
          price: '24,000',
          priceBussiness: '22,000',
          priceBest: '21,000',
          priceDealer: '20,000',
          priceCustomer: '24,000',
          coverImage: '/product1.png',
          pictures: ['/product1.png', '/product1.png', '/product1.png'],
        }}
      />
    </div>
  );
};

export default AdminProductDetail;
