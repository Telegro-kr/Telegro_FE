import { type ProductDetailResponseDTO } from '@apis/telegro';
import ExploreScrollToTop from '@components/common/explore-scroll-to-top';
import ProductDetailGallery from '@components/product-detail/product-detail-gallery';
import ProductDetailPurchasePanel from '@components/product-detail/product-detail-purchase-panel';
import ProductDetailRecommendationSection from '@components/product-detail/product-detail-recommendation-section';
import ProductDetailTabs from '@components/product-detail/product-detail-tabs';
import {
  type ProductTab,
  type RecommendationItem,
} from '@hooks/use-product-detail';
import { useRef } from 'react';

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
  isAdminMode?: boolean;
  isDeletePending?: boolean;
  recommendationDetailBasePath?: string;
  onChangeTab: (tab: ProductTab) => void;
  onSelectImage: (image: string) => void;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onAddCart?: () => void;
  onToggleDetail: () => void;
  onToggleLike: () => void;
  onShare: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
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
  isAdminMode = false,
  isDeletePending = false,
  recommendationDetailBasePath = '/products',
  onChangeTab,
  onSelectImage,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onAddCart,
  onToggleDetail,
  onToggleLike,
  onShare,
  onEdit,
  onDelete,
}: ProductDetailViewProps) => {
  const pageRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FBFBF8] text-gray-900">
      <main className="mx-auto flex w-full max-w-[124rem] flex-col px-6 pb-24 pt-10">
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
            onAddCart={onAddCart}
            onToggleLike={onToggleLike}
            onShare={onShare}
            isAdminMode={isAdminMode}
            isDeletePending={isDeletePending}
            onEdit={onEdit}
            onDelete={onDelete}
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
                <span>{isDetailOpen ? '상품 상세 접기' : '상품 상세 보기'}</span>
                <span className={isDetailOpen ? 'rotate-0' : 'rotate-180'}>
                  <ChevronUpIcon />
                </span>
              </button>

              {isDetailOpen ? (
                product.content?.trim().startsWith('<') ? (
                  <div
                    className="text-[1.18rem] leading-[2] text-gray-700 [&_h1]:text-[2rem] [&_h1]:font-semibold [&_h2]:text-[1.7rem] [&_h2]:font-semibold [&_h3]:text-[1.45rem] [&_h3]:font-semibold [&_h4]:text-[1.3rem] [&_h4]:font-semibold [&_h5]:text-[1.18rem] [&_h5]:font-semibold [&_img]:my-6 [&_img]:rounded-[1.6rem] [&_img]:shadow-[0_12px_24px_rgba(15,23,42,0.08)] [&_li]:ml-6 [&_ol]:list-decimal [&_p]:min-h-[1.5rem] [&_strong]:font-semibold [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-[#E5E7EB] [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-[#E5E7EB] [&_th]:bg-[#F8FAFC] [&_th]:px-3 [&_th]:py-2 [&_ul]:list-disc"
                    dangerouslySetInnerHTML={{ __html: product.content }}
                  />
                ) : (
                  <div className="whitespace-pre-line text-[1.18rem] leading-[2] text-gray-700">
                    {product.content}
                  </div>
                )
              ) : null}
            </>
          )}
          {activeTab === 'review' ? <EmptyPanel title="No reviews yet." /> : null}
          {activeTab === 'return' ? (
            <InfoPanel
              title="Returns and exchanges"
              lines={[
                'Requests can be submitted within 7 days after delivery for simple change-of-mind cases.',
                'Items with signs of use or damaged packaging may be rejected depending on inspection results.',
                'Please check the purchase policy for category-specific details.',
              ]}
            />
          ) : null}
          {activeTab === 'qna' ? <EmptyPanel title="No questions yet." /> : null}
        </section>

        <ProductDetailRecommendationSection
          recommendations={recommendations}
          detailBasePath={recommendationDetailBasePath}
        />
      </main>
      <ExploreScrollToTop targetRef={pageRef} />
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
