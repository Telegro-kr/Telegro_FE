import { type RecommendationItem } from '@hooks/use-product-detail';

type ProductDetailRecommendationSectionProps = {
  recommendations: RecommendationItem[];
};

const ProductDetailRecommendationSection = ({
  recommendations,
}: ProductDetailRecommendationSectionProps) => {
  return (
    <section className="mt-24 border-t border-[#ECECEC] pt-10">
      <div className="mb-6 flex items-end justify-between gap-6 border-b border-[#2B2B2B] pb-6">
        <div className="flex flex-col gap-2">
          <span className="text-[1rem] font-semibold text-[#5B6A56]">당신을 위한</span>
          <h2 className="text-[2.2rem] font-semibold leading-none tracking-[-0.03em] text-[#111827]">
            똑똑한 Telegro 상품추천
          </h2>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-6">
        <p className="text-[1.4rem] font-semibold text-[#263238]">이 상품과 함께 구매해 보세요</p>
        <div className="flex items-center gap-2">
          <ArrowSquareButton direction="left" />
          <ArrowSquareButton direction="right" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-5">
        {recommendations.map((item) => (
          <article key={item.id} className="flex flex-col gap-3">
            <div className="overflow-hidden bg-[#F5F5F2]">
              <img src={item.image} alt={item.title} className="aspect-[1/1] w-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <strong className="line-clamp-2 text-[1.15rem] font-medium leading-[1.45] text-[#263238]">
                {item.title}
              </strong>
              <span className="text-[1rem] text-[#7B8794]">{item.price}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const ArrowSquareButton = ({ direction }: { direction: 'left' | 'right' }) => (
  <button
    type="button"
    className="flex h-8 w-8 items-center justify-center border border-[#E5E7EB] bg-white text-[#9CA3AF]"
  >
    {direction === 'left' ? <ChevronLeftSmallIcon /> : <ChevronRightSmallIcon />}
  </button>
);

const ChevronLeftSmallIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
    <path
      d="M14 7L9 12L14 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightSmallIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
    <path
      d="M10 7L15 12L10 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ProductDetailRecommendationSection;
