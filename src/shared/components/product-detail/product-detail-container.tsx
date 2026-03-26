import {
  useGetProducts,
  type GetProductsCategory,
  type ProductDetailResponseDTO,
} from '@apis/telegro';
import { useProductDetail, type RecommendationItem } from '@hooks/use-product-detail';
import ProductDetailView from '@components/product-detail/product-detail-view';
import { formatNumber } from '@utils/format';

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
      onToggleDetail={() => setIsDetailOpen((prev) => !prev)}
      onToggleLike={handleToggleLike}
      onShare={handleShare}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default ProductDetailContainer;
