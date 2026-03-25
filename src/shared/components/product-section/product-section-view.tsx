import type { ProductCategory, ProductItem } from '@hooks/use-product-section';
import { cn } from '@utils/cn';
import ProductCard from './product-card';

type ProductSectionViewProps = {
  title: string;
  actionLabel: string;
  categories: ProductCategory[];
  categoryLabels: Record<ProductCategory, string>;
  activeCategory: ProductCategory;
  products: ProductItem[];
  isLoading: boolean;
  isError: boolean;
  isArrowDisabled: boolean;
  onChangeCategory: (category: ProductCategory) => void;
  onClickAll: () => void;
  onClickArrow: () => void;
  onClickProduct: (product: ProductItem) => void;
};

export default function ProductSectionView({
  title,
  actionLabel,
  categories,
  categoryLabels,
  activeCategory,
  products,
  isLoading,
  isError,
  isArrowDisabled,
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
                  {categoryLabels[category]}
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
        <div className="flex min-h-[35.8rem] items-center gap-[3.4rem]">
          {isLoading ? (
            <div className="text-[1.6rem] text-gray-500">
              {'\uC0C1\uD488\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.'}
            </div>
          ) : isError ? (
            <div className="text-[1.6rem] text-red-500">
              {'\uC0C1\uD488\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.'}
            </div>
          ) : products.length ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onClickProduct}
              />
            ))
          ) : (
            <div className="text-[1.6rem] text-gray-500">
              {'\uD45C\uC2DC\uD560 \uC0C1\uD488\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.'}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClickArrow}
          aria-label={'\uB2E4\uC74C \uC0C1\uD488 \uBCF4\uAE30'}
          disabled={isArrowDisabled || isLoading}
          className={cn(
            'flex h-[35.8rem] w-[4.1rem] items-center justify-center rounded-[0.383rem]',
            isArrowDisabled || isLoading
              ? 'cursor-not-allowed opacity-40'
              : 'cursor-pointer',
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
