import { useGetProductDetail } from '@apis/telegro';
import LoadingPanel from '@components/common/loading-panel';
import ProductDetailContainer from '@components/product-detail/product-detail-container';
import { useParams } from 'react-router-dom';

const AdminProductDetail = () => {
  const { productId } = useParams();
  const parsedProductId = Number(productId);
  const hasValidProductId = Number.isFinite(parsedProductId);
  const productDetailQuery = useGetProductDetail(parsedProductId, {
    query: {
      enabled: hasValidProductId,
      staleTime: 60_000,
    },
  });

  if (!hasValidProductId) {
    return <AdminMessagePanel message="유효하지 않은 상품입니다." />;
  }

  if (productDetailQuery.isLoading) {
    return <LoadingPanel fullScreen size={140} />;
  }

  if (productDetailQuery.isError || !productDetailQuery.data?.data) {
    return <AdminMessagePanel message="상품 정보를 불러오지 못했습니다." />;
  }

  return (
    <ProductDetailContainer
      productId={parsedProductId}
      product={productDetailQuery.data.data}
    />
  );
};

const AdminMessagePanel = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-[#FBFBF8] px-6 text-[1.1rem] text-[#4B5563]">
    {message}
  </div>
);

export default AdminProductDetail;
