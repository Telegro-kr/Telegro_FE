import { type RecommendationItem } from '@hooks/use-product-detail';
import { Link } from 'react-router-dom';

type ProductDetailRecommendationSectionProps = {
  recommendations: RecommendationItem[];
  detailBasePath?: string;
};

const ProductDetailRecommendationSection = ({
  recommendations,
  detailBasePath = '/products',
}: ProductDetailRecommendationSectionProps) => {
  return (
    <section className="mt-24 border-t border-[#ECECEC] pt-10">
      <div className="mb-6 flex items-end justify-between gap-6 border-b border-[#2B2B2B] pb-6">
        <div className="flex flex-col gap-2">
          <span className="text-[1rem] font-semibold text-[#5B6A56]">
            당신을 위한
          </span>
          <h2 className="text-[2.2rem] leading-none font-semibold tracking-[-0.03em] text-[#111827]">
            똑똑한 Telegro 상품추천
          </h2>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-6">
        <p className="text-[1.4rem] font-semibold text-[#263238]">
          이 상품과 함께 구매해 보세요
        </p>
      </div>

      <div className="-mx-6 overflow-x-auto px-6 pb-2">
        <div className="flex min-w-max gap-6">
          {recommendations.map((item) => (
            <Link
              key={item.id}
              to={`${detailBasePath}/${item.id}`}
              className="group flex w-[22rem] shrink-0 flex-col gap-3"
            >
              <article className="flex flex-col gap-3">
                <div className="overflow-hidden bg-[#F5F5F2]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[1/1] w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <strong className="line-clamp-2 text-[1.15rem] leading-[1.45] font-medium text-[#263238] transition-colors group-hover:text-[#2457B8]">
                    {item.title}
                  </strong>
                  <span className="text-[1rem] text-[#7B8794]">
                    {item.price}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDetailRecommendationSection;
