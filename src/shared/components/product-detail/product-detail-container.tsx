import {
  telegroInvalidate,
  useAddCartItem,
  useCreateOrder,
  useGetProducts,
  type GetProductsCategory,
  type ProductDetailResponseDTO,
} from '@apis/telegro';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import ProductDetailView from '@components/product-detail/product-detail-view';
import {
  useProductDetail,
  type RecommendationItem,
} from '@hooks/use-product-detail';
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
  const createOrderMutation = useCreateOrder();
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
          title: item.productName?.trim() || '상품명 없음',
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
    selectedOption,
    setSelectedOption,
    inputOption,
    setInputOption,
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

  const requireOption = () => {
    if (!productId) {
      toastError('유효하지 않은 상품입니다.');
      return false;
    }

    if (!selectedOption) {
      toastError('옵션을 선택해주세요.');
      return false;
    }

    return true;
  };

  const handleAddCart = async () => {
    if (!requireOption()) {
      return;
    }

    const resolvedProductId = productId;

    if (resolvedProductId == null) {
      return;
    }

    try {
      await addCartItemMutation.mutateAsync({
        productId: resolvedProductId,
        data: {
          selectOption: selectedOption,
          quantity,
          inputOption,
        },
      });

      await telegroInvalidate.cartItems(queryClient, CART_ITEMS_QUERY_PARAMS);
      toastSuccess('상품이 장바구니에 담겼습니다.');
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toastError('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      console.error(error);
      toastError('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handlePurchase = async () => {
    if (!requireOption()) {
      return;
    }

    const resolvedProductId = productId;

    if (resolvedProductId == null) {
      return;
    }

    try {
      const cartResponse = await addCartItemMutation.mutateAsync({
        productId: resolvedProductId,
        data: {
          selectOption: selectedOption,
          quantity,
          inputOption,
        },
      });

      const cartId = cartResponse.data?.id;

      if (!cartId) {
        throw new Error('장바구니 추가 후 cart ID가 없습니다.');
      }

      await telegroInvalidate.cartItems(queryClient, CART_ITEMS_QUERY_PARAMS);

      const orderResponse = await createOrderMutation.mutateAsync({
        data: [cartId],
      });

      if (!orderResponse.data) {
        throw new Error('주문 데이터가 없습니다.');
      }

      navigate('/app/checkout', {
        state: {
          orderData: orderResponse.data,
        },
      });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toastError('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      console.error(error);
      toastError('바로 구매를 시작하지 못했습니다.');
    }
  };

  return (
    <ProductDetailView
      product={resolvedProduct}
      activeTab={activeTab}
      selectedImage={selectedImage}
      quantity={quantity}
      selectedOption={selectedOption}
      inputOption={inputOption}
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
      onSelectOption={setSelectedOption}
      onInputOptionChange={setInputOption}
      onAddCart={handleAddCart}
      onPurchase={handlePurchase}
      onToggleDetail={() => setIsDetailOpen((prev) => !prev)}
      onToggleLike={handleToggleLike}
      onShare={handleShare}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default ProductDetailContainer;
