import ProductDetailContainer from '@components/product-detail/product-detail-container';

const AdminProducts = () => {
  return (
    <div className="bg-white px-8 py-10">
      <ProductDetailContainer
        product={{
          productModel: 'TG-HS-001',
          productName: '프리미엄 커널형 이어셋',
          options: ['블랙', '무선', '노이즈 캔슬링'],
          category: 'HEADSET',
          content:
            '업무용/상담용/일상용 모두에 잘 어울리는 프리미엄 이어셋입니다.\n착용감과 디자인, 사운드 밸런스를 모두 고려해 제작되었습니다.',
          price: '10,000원',
          priceBussiness: '9,200원',
          priceBest: '8,700원',
          priceDealer: '8,200원',
          priceCustomer: '10,000원',
          coverImage: '/product1.png',
          pictures: ['/product1.png', '/product1.png', '/product1.png'],
        }}
        onClickBack={() => window.history.back()}
        onClickInquiry={() => {
          console.log('상품 문의');
        }}
      />
    </div>
  );
};

export default AdminProducts;
