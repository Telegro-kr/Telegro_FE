import { useMemo, useState } from 'react';

export type ProductCategory = '헤드셋' | '라인코드' | '녹음기기' | '악세사리';

export type ProductItem = {
  id: number;
  category: ProductCategory;
  title: string;
  subtitle: string;
  priceLabel: string;
  imageSrc: string;
};

type UseProductSectionParams = {
  initialCategory?: ProductCategory;
  products?: ProductItem[];
  onClickAll?: () => void;
  onClickArrow?: () => void;
  onClickProduct?: (product: ProductItem) => void;
};

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    category: '헤드셋',
    title: '커널형 이어셋',
    subtitle: '명품 이어셋',
    priceLabel: '10,000원',
    imageSrc: '/product1.png',
  },
  {
    id: 2,
    category: '헤드셋',
    title: '커널형 이어셋',
    subtitle: '명품 이어셋',
    priceLabel: '10,000원',
    imageSrc: '/product1.png',
  },
  {
    id: 3,
    category: '헤드셋',
    title: '커널형 이어셋',
    subtitle: '명품 이어셋',
    priceLabel: '10,000원',
    imageSrc: '/product1.png',
  },
  {
    id: 4,
    category: '라인코드',
    title: '프리미엄 라인코드',
    subtitle: '고음질 케이블',
    priceLabel: '18,000원',
    imageSrc: '/product1.png',
  },
  {
    id: 5,
    category: '녹음기기',
    title: '보이스 레코더',
    subtitle: '휴대용 녹음기',
    priceLabel: '39,000원',
    imageSrc: '/product1.png',
  },
  {
    id: 6,
    category: '악세사리',
    title: '이어패드 세트',
    subtitle: '교체용 악세사리',
    priceLabel: '12,000원',
    imageSrc: '/product1.png',
  },
  {
    id: 7,
    category: '악세사리',
    title: '이어패드 세트',
    subtitle: '교체용 악세사리',
    priceLabel: '12,000원',
    imageSrc: '/product1.png',
  },
  {
    id: 8,
    category: '악세사리',
    title: '이어패드 세트',
    subtitle: '교체용 악세사리',
    priceLabel: '12,000원',
    imageSrc: '/product1.png',
  },
];

const CATEGORY_OPTIONS: ProductCategory[] = [
  '헤드셋',
  '라인코드',
  '녹음기기',
  '악세사리',
];

export function useProductSection({
  initialCategory = '헤드셋',
  products = DEFAULT_PRODUCTS,
  onClickAll,
  onClickArrow,
  onClickProduct,
}: UseProductSectionParams = {}) {
  const [activeCategory, setActiveCategory] =
    useState<ProductCategory>(initialCategory);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => product.category === activeCategory)
      .slice(0, 3);
  }, [activeCategory, products]);

  return {
    title: '상품 목록 확인하기',
    actionLabel: '전체 상품 확인하기',
    categories: CATEGORY_OPTIONS,
    activeCategory,
    products: filteredProducts,
    setActiveCategory,
    handleClickAll: () => onClickAll?.(),
    handleClickArrow: () => onClickArrow?.(),
    handleClickProduct: (product: ProductItem) => onClickProduct?.(product),
  };
}
