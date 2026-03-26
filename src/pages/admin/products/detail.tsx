import { useDeleteProduct, useGetProductDetail } from '@apis/telegro';
import AdminProfileCard from '@components/admin/profile-card/profile-card';
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
      toastSuccess('상품을 삭제했습니다.');
      navigate('/admin/products');
    } catch (deleteError) {
      if (axios.isAxiosError(deleteError) && deleteError.response?.status === 403) {
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
      <AdminProfileCard onMove={() => navigate('/')} />

      <div className="flex flex-col gap-[1.6rem] rounded-[2.4rem] border border-[#E5E7EB] bg-white px-[1.8rem] py-[1.8rem] shadow-[0_18px_48px_rgba(15,23,42,0.08)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[1.3rem] font-semibold uppercase tracking-[0.22em] text-[#2D6CDF]">
            Admin Product
          </p>
          <h1 className="mt-[0.7rem] text-[2.6rem] font-semibold tracking-[-0.04em] text-gray-900">
            {productDetailQuery.data.data.productName || '상품 상세'}
          </h1>
        </div>

        <div className="flex flex-col gap-[1rem] sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(`/admin/products/${parsedProductId}/edit`)}
            className="inline-flex h-[4.8rem] items-center justify-center rounded-[1.4rem] border border-[#CFE0FF] bg-[#EEF4FF] px-[1.8rem] text-[1.4rem] font-semibold text-[#2457B8] transition hover:bg-[#E4EEFF]"
          >
            상품 수정
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteProductMutation.isPending}
            className="inline-flex h-[4.8rem] items-center justify-center rounded-[1.4rem] border border-[#F5C2C2] bg-[#FFF5F5] px-[1.8rem] text-[1.4rem] font-semibold text-[#D64545] transition hover:bg-[#FFEAEA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteProductMutation.isPending ? '삭제 중...' : '상품 삭제'}
          </button>
        </div>
      </div>

      <ProductDetailContainer
        productId={parsedProductId}
        product={productDetailQuery.data.data}
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
