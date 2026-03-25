'use client';

import {
  useProductSection,
  type ProductItem,
  type ProductCategory,
} from '@hooks/use-product-section';
import ProductSectionView from './product-section-view';

type ProductSectionContainerProps = {
  initialCategory?: ProductCategory;
  products?: ProductItem[];
  onClickAll?: () => void;
  onClickArrow?: () => void;
  onClickProduct?: (product: ProductItem) => void;
  variant?: 'dashboard' | 'list';
  pageSize?: number;
};

export default function ProductSectionContainer({
  initialCategory,
  products,
  onClickAll,
  onClickArrow,
  onClickProduct,
  variant = 'dashboard',
  pageSize,
}: ProductSectionContainerProps) {
  const {
    title,
    actionLabel,
    categories,
    categoryLabels,
    activeCategory,
    products: filteredProducts,
    isLoading,
    isError,
    isArrowDisabled,
    setActiveCategory,
    handleClickAll,
    handleClickArrow,
    handleClickProduct,
  } = useProductSection({
    initialCategory,
    products,
    onClickAll,
    onClickArrow,
    onClickProduct,
    pageSize: pageSize ?? (variant === 'list' ? 100 : 4),
  });

  return (
    <ProductSectionView
      title={variant === 'dashboard' ? title : undefined}
      actionLabel={variant === 'dashboard' ? actionLabel : undefined}
      categories={categories}
      categoryLabels={categoryLabels}
      activeCategory={activeCategory}
      products={filteredProducts}
      isLoading={isLoading}
      isError={isError}
      isArrowDisabled={isArrowDisabled}
      variant={variant}
      onChangeCategory={setActiveCategory}
      onClickAll={handleClickAll}
      onClickArrow={handleClickArrow}
      onClickProduct={handleClickProduct}
    />
  );
}
