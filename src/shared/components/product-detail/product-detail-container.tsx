import {
  telegroInvalidate,
  useAddCartItem,
  useGetProducts,
  type GetProductsCategory,
  type ProductDetailResponseDTO,
} from '@apis/telegro';
import ProductDetailView from '@components/product-detail/product-detail-view';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useProductDetail, type RecommendationItem } from '@hooks/use-product-detail';
import { useQueryClient } from '@tanstack/react-query';
import { formatNumber } from '@utils/format';
import { useNavigate } from 'react-router-dom';

import { CART_ITEMS_QUERY_PARAMS } from '@pages/app/cart/use-cart-items-query';

type ProductDetailContainerProps = {
  productId?: number;
  product?: ProductDetailResponseDTO;
  recommendations?: RecommendationItem[];
  isAdminMode?: boolean;
  isDeletePending?: boolean;
  recommendationDetailBasePath?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const ProductDetailContainer = ({
  productId,
  product,
  recommendations,
  isAdminMode = false,
  isDeletePending = false,
  recommendationDetailBasePath = '/products',
  onEdit,
  onDelete,
}: ProductDetailContainerProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addCartItemMutation = useAddCartItem();
  const category = product?.category as GetProductsCategory | undefined;
  const recommendationQuery = useGetProducts(
    {
      category: category ?? 'HEADSET',
      page: 0,
      size: 5,
    },
    {
      query: {
        enabled: Boolean(category) && !recommendations?.length,
        staleTime: 60_000,
      },
    },
  );

  const apiRecommendations =
    recommendationQuery.data?.data?.products
      ?.filter((item) => item.id !== productId)
      .slice(0, 4)
      .map(
        (item): RecommendationItem => ({
          id: item.id ?? 0,
          title: item.productName?.trim() || 'Unknown product',
          price: `${formatNumber(item.price)}원`,
          image: item.coverImage?.trim() || '/product1.png',
        }),
      ) ?? [];

  const {
    product: resolvedProduct,
    activeTab,
    setActiveTab,
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    galleryImages,
    isDetailOpen,
    setIsDetailOpen,
    isLiked,
    likeCount,
    isShareCopied,
    totalPriceLabel,
    rewardPointLabel,
    recommendations: resolvedRecommendations,
    handleToggleLike,
    handleShare,
  } = useProductDetail({
    product,
    recommendations: recommendations ?? apiRecommendations,
  });

  const handleAddCart = async () => {
    if (!productId) {
      toastError('유효하지 않은 상품입니다.');
      return;
    }

    const selectOption = resolvedProduct.options?.find((option) => option?.trim())?.trim();

    try {
      await addCartItemMutation.mutateAsync({
        productId,
        data: {
          selectOption,
          quantity,
          inputOption: '',
        },
      });
      await telegroInvalidate.cartItems(queryClient, CART_ITEMS_QUERY_PARAMS);
      toastSuccess('상품이 장바구니에 담겼습니다.');
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toastError('로그인을 먼저 진행해주세요.');
        navigate('/login');
        return;
      }

      toastError('장바구니 담기에 실패했습니다.');
    }
  };

  return (
    <ProductDetailView
      product={resolvedProduct}
      activeTab={activeTab}
      selectedImage={selectedImage}
      quantity={quantity}
      galleryImages={galleryImages}
      isDetailOpen={isDetailOpen}
      isLiked={isLiked}
      likeCount={likeCount}
      isShareCopied={isShareCopied}
      totalPriceLabel={totalPriceLabel}
      rewardPointLabel={rewardPointLabel}
      recommendations={resolvedRecommendations}
      isAdminMode={isAdminMode}
      isDeletePending={isDeletePending}
      recommendationDetailBasePath={recommendationDetailBasePath}
      onChangeTab={setActiveTab}
      onSelectImage={setSelectedImage}
      onDecreaseQuantity={() => setQuantity((prev) => Math.max(1, prev - 1))}
      onIncreaseQuantity={() => setQuantity((prev) => prev + 1)}
      onAddCart={handleAddCart}
      onToggleDetail={() => setIsDetailOpen((prev) => !prev)}
      onToggleLike={handleToggleLike}
      onShare={handleShare}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default ProductDetailContainer;
