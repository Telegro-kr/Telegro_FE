import { useDeleteProduct, useGetProductDetail } from '@apis/telegro';
import ConfirmModal from '@components/common/confirm-modal';
import LoadingPanel from '@components/common/loading-panel';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import ProductDetailContainer from '@components/product-detail/product-detail-container';
import queryClient from '@libs/query-client';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const invalidateProductQueries = () =>
  queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      typeof query.queryKey[0] === 'string' &&
      query.queryKey[0].startsWith('/products'),
  });

const AdminProductDetail = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const parsedProductId = Number(productId);
  const hasValidProductId = Number.isFinite(parsedProductId);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const productDetailQuery = useGetProductDetail(parsedProductId, {
    query: {
      enabled: hasValidProductId,
      staleTime: 60_000,
    },
  });
  const deleteProductMutation = useDeleteProduct();

  if (!hasValidProductId) {
    return <AdminMessagePanel message="유효하지 않은 상품입니다." />;
  }

  if (productDetailQuery.isLoading) {
    return <LoadingPanel fullScreen size={140} />;
  }

  if (productDetailQuery.isError || !productDetailQuery.data?.data) {
    return <AdminMessagePanel message="상품 정보를 불러오지 못했습니다." />;
  }

  const handleDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync({ productId: parsedProductId });
      await invalidateProductQueries();
      toastSuccess('상품이 삭제되었습니다.');
      navigate('/admin/products');
    } catch (deleteError) {
      if (
        axios.isAxiosError(deleteError) &&
        deleteError.response?.status === 403
      ) {
        toastError('관리자 권한이 필요합니다.');
      } else {
        toastError('상품 삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-[3rem] bg-[#FBFBF8] px-[2rem] py-[2rem] md:px-[5rem] md:py-[3rem] lg:px-[8rem] lg:py-[4rem]">
      <ProductDetailContainer
        productId={parsedProductId}
        product={productDetailQuery.data.data}
        isAdminMode
        isDeletePending={deleteProductMutation.isPending}
        recommendationDetailBasePath="/admin/products"
        onEdit={() => navigate(`/admin/products/${parsedProductId}/edit`)}
        onDelete={() => setIsDeleteModalOpen(true)}
      />

      {isDeleteModalOpen ? (
        <ConfirmModal
          message="이 상품을 삭제하시겠습니까?"
          confirmText="삭제"
          cancelText="취소"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      ) : null}
    </div>
  );
};

const AdminMessagePanel = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-[#FBFBF8] px-6 text-[1.1rem] text-[#4B5563]">
    {message}
  </div>
);

export default AdminProductDetail;
