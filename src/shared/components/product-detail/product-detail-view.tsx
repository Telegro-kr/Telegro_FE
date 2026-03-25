import { type ProductDetailResponseDTO } from '@apis/telegro';
import {
  type ProductTab,
  type RecommendationItem,
} from '@hooks/use-product-detail';
import ProductDetailGallery from '@components/product-detail/product-detail-gallery';
import ProductDetailPurchasePanel from '@components/product-detail/product-detail-purchase-panel';
import ProductDetailTabs from '@components/product-detail/product-detail-tabs';
import ProductDetailRecommendationSection from '@components/product-detail/product-detail-recommendation-section';

type ProductDetailViewProps = {
  product: ProductDetailResponseDTO;
  activeTab: ProductTab;
  selectedImage: string;
  quantity: number;
  galleryImages: string[];
  isDetailOpen: boolean;
  isLiked: boolean;
  likeCount: number;
  isShareCopied: boolean;
  totalPriceLabel: string;
  rewardPointLabel: string;
  recommendations: RecommendationItem[];
  onChangeTab: (tab: ProductTab) => void;
  onSelectImage: (image: string) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onToggleDetail: () => void;
  onToggleLike: () => void;
  onShare: () => void;
};

const ProductDetailView = ({
  product,
  activeTab,
  selectedImage,
  quantity,
  galleryImages,
  isDetailOpen,
  isLiked,
  likeCount,
  isShareCopied,
  totalPriceLabel,
  rewardPointLabel,
  recommendations,
  onChangeTab,
  onSelectImage,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onToggleDetail,
  onToggleLike,
  onShare,
}: ProductDetailViewProps) => {
  return (
    <div className="min-h-screen bg-[#FBFBF8] text-gray-900">
      <main className="mx-auto flex w-full max-w-[124rem] flex-col px-6 pt-10 pb-24">
        <div className="mb-8 flex items-center gap-3 text-[1.05rem] text-[#9CA3AF]">
          <span>Product</span>
          <span>/</span>
          <span className="text-gray-500">{product.productName}</span>
        </div>

        <section className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:gap-16">
          <ProductDetailGallery
            selectedImage={selectedImage}
            images={galleryImages}
            productName={product.productName}
            onSelectImage={onSelectImage}
          />
          <ProductDetailPurchasePanel
            productName={product.productName}
            price={product.price}
            rewardPointLabel={rewardPointLabel}
            quantity={quantity}
            isLiked={isLiked}
            likeCount={likeCount}
            isShareCopied={isShareCopied}
            totalPriceLabel={totalPriceLabel}
            onDecrease={onDecreaseQuantity}
            onIncrease={onIncreaseQuantity}
            onToggleLike={onToggleLike}
            onShare={onShare}
          />
        </section>

        <ProductDetailTabs activeTab={activeTab} onChange={onChangeTab} />

        <section className="mx-auto mt-12 flex w-full flex-col gap-16">
          {activeTab === 'detail' && (
            <>
              <button
                type="button"
                onClick={onToggleDetail}
                className="flex-row-center h-[4.8rem] w-full cursor-pointer gap-2 border-[2px] border-gray-600 bg-white text-[1.5rem] font-semibold text-[#263238] shadow-[0_8px_16px_rgba(38,50,56,0.08)] transition-colors hover:bg-gray-100"
              >
                <span>
                  {isDetailOpen ? '상세정보 접기' : '상세정보 펼치기'}
                </span>
                <span className={isDetailOpen ? 'rotate-0' : 'rotate-180'}>
                  <ChevronUpIcon />
                </span>
              </button>

              {isDetailOpen ? (
                product.content?.trim().startsWith('<') ? (
                  <div
                    className="text-[1.18rem] leading-[2] text-gray-700 [&_h4]:text-[1.3rem] [&_h4]:font-semibold [&_h5]:text-[1.18rem] [&_h5]:font-semibold [&_p]:min-h-[1.5rem] [&_strong]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: product.content }}
                  />
                ) : (
                  <div className="text-[1.18rem] leading-[2] whitespace-pre-line text-gray-700">
                    {product.content}
                  </div>
                )
              ) : null}
            </>
          )}
          {activeTab === 'review' ? (
            <EmptyPanel title="아직 등록된 구매평이 없습니다." />
          ) : null}
          {activeTab === 'return' ? (
            <InfoPanel
              title="반품 / 교환 안내"
              lines={[
                '단순 변심에 의한 반품/교환은 상품 수령 후 7일 이내 접수 가능합니다.',
                '상품 훼손 및 사용 흔적이 있는 경우 반품이 제한될 수 있습니다.',
                '정확한 안내는 판매 정책을 함께 확인해 주세요.',
              ]}
            />
          ) : null}
          {activeTab === 'qna' ? (
            <EmptyPanel title="등록된 문의가 없습니다." />
          ) : null}
        </section>

        <ProductDetailRecommendationSection recommendations={recommendations} />
      </main>
    </div>
  );
};

const EmptyPanel = ({ title }: { title: string }) => (
  <div className="flex h-[18rem] items-center justify-center border border-dashed border-[#D6DCE1] bg-white text-[1.3rem] text-[#7B8794]">
    {title}
  </div>
);

const InfoPanel = ({ title, lines }: { title: string; lines: string[] }) => (
  <div className="border border-[#E5E7EB] bg-white px-8 py-8">
    <h3 className="mb-5 text-[1.55rem] font-semibold text-[#263238]">
      {title}
    </h3>
    <div className="flex flex-col gap-3">
      {lines.map((line) => (
        <p key={line} className="text-[1.15rem] leading-[1.8] text-[#4B5563]">
          {line}
        </p>
      ))}
    </div>
  </div>
);

const ChevronUpIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
    <path
      d="M6 15L12 9L18 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ProductDetailView;
