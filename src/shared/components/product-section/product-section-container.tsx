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
};

export default function ProductSectionContainer({
  initialCategory,
  products,
  onClickAll,
  onClickArrow,
  onClickProduct,
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
  });

  return (
    <ProductSectionView
      title={title}
      actionLabel={actionLabel}
      categories={categories}
      categoryLabels={categoryLabels}
      activeCategory={activeCategory}
      products={filteredProducts}
      isLoading={isLoading}
      isError={isError}
      isArrowDisabled={isArrowDisabled}
      onChangeCategory={setActiveCategory}
      onClickAll={handleClickAll}
      onClickArrow={handleClickArrow}
      onClickProduct={handleClickProduct}
    />
  );
}
