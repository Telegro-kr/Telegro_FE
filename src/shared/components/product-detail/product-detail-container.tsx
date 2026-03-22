import { type ProductDetailResponseDTO } from '@apis/telegro';
import { useProductDetail, type RecommendationItem } from '@hooks/use-product-detail';
import ProductDetailView from '@components/product-detail/product-detail-view';

type ProductDetailContainerProps = {
  product?: ProductDetailResponseDTO;
  recommendations?: RecommendationItem[];
  onClickBack?: () => void;
  onClickInquiry?: () => void;
};

const ProductDetailContainer = ({
  product,
  recommendations,
  onClickBack,
  onClickInquiry,
}: ProductDetailContainerProps) => {
  void onClickBack;
  void onClickInquiry;

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
  } = useProductDetail({ product, recommendations });

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
      onChangeTab={setActiveTab}
      onSelectImage={setSelectedImage}
      onDecreaseQuantity={() => setQuantity((prev) => Math.max(1, prev - 1))}
      onIncreaseQuantity={() => setQuantity((prev) => prev + 1)}
      onToggleDetail={() => setIsDetailOpen((prev) => !prev)}
      onToggleLike={handleToggleLike}
      onShare={handleShare}
    />
  );
};

export default ProductDetailContainer;
