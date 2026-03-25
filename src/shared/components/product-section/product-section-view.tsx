import LoadingPanel from '@components/common/loading-panel';
import type { ProductCategory, ProductItem } from '@hooks/use-product-section';
import { cn } from '@utils/cn';
import ProductCard from './product-card';

type ProductSectionViewProps = {
  title?: string;
  actionLabel?: string;
  categories: ProductCategory[];
  categoryLabels: Record<ProductCategory, string>;
  activeCategory: ProductCategory;
  products: ProductItem[];
  isLoading: boolean;
  isError: boolean;
  isArrowDisabled: boolean;
  variant?: 'dashboard' | 'list';
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
  variant = 'dashboard',
  onChangeCategory,
  onClickAll,
  onClickArrow,
  onClickProduct,
}: ProductSectionViewProps) {
  const isDashboard = variant === 'dashboard';

  return (
    <section className="inline-flex w-full flex-col items-start gap-[2.534rem]">
      {title ? (
        <div className="inline-flex items-center px-[0.863rem]">
          <h2 className="title3 tracking-[-0.03em] text-gray-900">{title}</h2>
        </div>
      ) : null}

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

          {isDashboard && actionLabel ? (
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
          ) : null}
        </div>
      </div>

      <div className={cn('w-full', isDashboard ? 'inline-flex items-start gap-[1.4rem]' : '')}>
        <div
          className={cn(
            'w-full min-h-[35.8rem]',
            isDashboard
              ? 'flex items-center gap-[3.4rem]'
              : 'grid grid-cols-1 gap-x-[3.4rem] gap-y-[4rem] md:grid-cols-2 xl:grid-cols-4',
          )}
        >
          {isLoading ? (
            <LoadingPanel
              className="col-span-full min-h-[35.8rem] rounded-[1.6rem] bg-[#FBFBF8]"
              size={96}
            />
          ) : isError ? (
            <div className="text-[1.6rem] text-red-500">상품을 불러오지 못했습니다.</div>
          ) : products.length ? (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onClickProduct}
                showActionButton={isDashboard}
              />
            ))
          ) : (
            <div className="text-[1.6rem] text-gray-500">표시할 상품이 없습니다.</div>
          )}
        </div>

        {isDashboard ? (
          <button
            type="button"
            onClick={onClickArrow}
            aria-label="다음 상품 보기"
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
        ) : null}
      </div>
    </section>
  );
}
