import type { ProductCategory, ProductItem } from '@hooks/use-product-section';
import { cn } from '@utils/cn';
import ProductCard from './product-card';

type ProductSectionViewProps = {
  title: string;
  actionLabel: string;
  categories: ProductCategory[];
  activeCategory: ProductCategory;
  products: ProductItem[];
  onChangeCategory: (category: ProductCategory) => void;
  onClickAll: () => void;
  onClickArrow: () => void;
  onClickProduct: (product: ProductItem) => void;
};

export default function ProductSectionView({
  title,
  actionLabel,
  categories,
  activeCategory,
  products,
  onChangeCategory,
  onClickAll,
  onClickArrow,
  onClickProduct,
}: ProductSectionViewProps) {
  return (
    <section className="inline-flex w-full flex-col items-start gap-[2.534rem]">
      <div className="inline-flex items-center px-[0.863rem]">
        <h2 className="title3 tracking-[-0.03em] text-gray-900">{title}</h2>
      </div>

      <div className="flex w-full flex-col border-b-[2px] border-[#E9E9E9]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-[2.053rem]">
            {categories.map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onChangeCategory(category)}
                  className={cn(
                    'flex min-w-[16.17rem] cursor-pointer items-center justify-center gap-[1rem] px-[3.08rem] pb-[1.8rem]',
                    'border-b-[2px] text-[2.2rem] font-semibold transition-colors',
                    isActive
                      ? 'border-[#2B2B2B] text-black'
                      : 'border-transparent text-[#B5B5B5] hover:text-[#888888]',
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onClickAll}
            className={cn(
              'title5 cursor-pointer pb-[1.8rem] transition-colors',
              'text-gray-500 hover:text-gray-600 active:text-gray-600',
            )}
          >
            {actionLabel}
          </button>
        </div>
      </div>

      <div className="inline-flex items-start gap-[1.4rem]">
        <div className="flex items-center gap-[3.4rem]">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={onClickProduct}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onClickArrow}
          aria-label="다음 상품 보기"
          className={cn(
            'flex h-[35.8rem] w-[4.1rem] items-center justify-center rounded-[0.383rem]',
          )}
        >
          <svg
            viewBox="0 0 18 29"
            className="h-[2.89rem] w-[1.75rem] text-[#D9D9D9]"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 2.5L14.5 14.5L2 26.5"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
