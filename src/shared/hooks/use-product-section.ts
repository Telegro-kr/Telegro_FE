import {
  useInfiniteProducts,
  type GetProductsCategory,
} from '@apis/telegro';
import { formatPrice } from '@utils/format';
import { useMemo, useState } from 'react';

export type ProductCategory = GetProductsCategory;

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
  pageSize?: number;
  searchKeyword?: string;
  variant?: 'dashboard' | 'list';
};

const DEFAULT_PAGE_SIZE = 4;
const CATEGORY_OPTIONS: ProductCategory[] = [
  'HEADSET',
  'LINE_CORD',
  'RECORDER',
  'ACCESSORY',
];

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  HEADSET: '\uD5E4\uB4DC\uC14B',
  PHONE_AMP: '\uD3F0\uC570\uD504',
  LINE_CORD: '\uB77C\uC778\uCF54\uB4DC',
  RECORDER: '\uB179\uC74C\uAE30\uAE30',
  ACCESSORY: '\uC545\uC138\uC11C\uB9AC',
};

const toProductItem = (
  category: ProductCategory,
  product: {
    id?: number;
    productModel?: string;
    productName?: string;
    price?: string;
    coverImage?: string;
  },
): ProductItem => ({
  id: product.id ?? 0,
  category,
  title:
    product.productName?.trim() || '\uC774\uB984 \uC5C6\uB294 \uC0C1\uD488',
  subtitle:
    product.productModel?.trim() ||
    '\uBAA8\uB378 \uC815\uBCF4 \uC5C6\uC74C',
  priceLabel: formatPrice(product.price),
  imageSrc: product.coverImage?.trim() || '/product1.png',
});

export function useProductSection({
  initialCategory = 'HEADSET',
  products,
  onClickAll,
  onClickArrow,
  onClickProduct,
  pageSize = DEFAULT_PAGE_SIZE,
  searchKeyword = '',
  variant = 'dashboard',
}: UseProductSectionParams = {}) {
  const hasInjectedProducts = Boolean(products?.length);
  const [activeCategory, setActiveCategory] =
    useState<ProductCategory>(initialCategory);
  const [pageIndexByCategory, setPageIndexByCategory] = useState<Record<ProductCategory, number>>({
    HEADSET: 0,
    PHONE_AMP: 0,
    LINE_CORD: 0,
    RECORDER: 0,
    ACCESSORY: 0,
  });

  const currentPageIndex = pageIndexByCategory[activeCategory];
  const productQuery = useInfiniteProducts(
    {
      category: activeCategory,
      size: pageSize,
    },
    {
      staleTime: 60_000,
    },
  );

  const mappedPages = useMemo(
    () =>
      (productQuery.data?.pages ?? []).map((page) =>
        (page.data?.data?.products ?? []).map((product) =>
          toProductItem(activeCategory, product),
        ),
      ),
    [activeCategory, productQuery.data?.pages],
  );

  const resolvedProducts = useMemo(() => {
    if (products?.length) {
      return products.filter((product) => product.category === activeCategory);
    }

    if (variant === 'dashboard') {
      return mappedPages[currentPageIndex] ?? [];
    }

    return mappedPages.flat();
  }, [activeCategory, currentPageIndex, mappedPages, products, variant]);

  const normalizedKeyword = searchKeyword.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalizedKeyword) {
      return resolvedProducts;
    }

    return resolvedProducts.filter((product) =>
      product.title.toLowerCase().includes(normalizedKeyword),
    );
  }, [normalizedKeyword, resolvedProducts]);

  const handleChangeCategory = (category: ProductCategory) => {
    setActiveCategory(category);
  };

  const handleClickArrow = () => {
    if (products?.length) {
      onClickArrow?.();
      return;
    }

    const nextPageIndex = currentPageIndex + 1;
    const loadedPageCount = mappedPages.length;

    if (nextPageIndex < loadedPageCount) {
      setPageIndexByCategory((prev) => ({
        ...prev,
        [activeCategory]: nextPageIndex,
      }));
      onClickArrow?.();
      return;
    }

    if (!productQuery.hasNextPage || productQuery.isFetchingNextPage) {
      return;
    }

    void productQuery.fetchNextPage().then((result) => {
      const fetchedPageCount = result.data?.pages.length ?? loadedPageCount;
      if (nextPageIndex < fetchedPageCount) {
        setPageIndexByCategory((prev) => ({
          ...prev,
          [activeCategory]: nextPageIndex,
        }));
      }
      onClickArrow?.();
    });
  };

  return {
    title: '\uC0C1\uD488 \uBAA9\uB85D \uD655\uC778\uD558\uAE30',
    actionLabel: '\uC804\uCCB4 \uC0C1\uD488 \uD655\uC778\uD558\uAE30',
    categories: CATEGORY_OPTIONS,
    categoryLabels: CATEGORY_LABELS,
    activeCategory,
    products: filteredProducts,
    isLoading: hasInjectedProducts ? false : productQuery.isLoading,
    isError: hasInjectedProducts ? false : productQuery.isError,
    isArrowDisabled: hasInjectedProducts
      ? filteredProducts.length <= pageSize
      : !productQuery.hasNextPage && currentPageIndex >= Math.max(mappedPages.length - 1, 0),
    hasNextPage: hasInjectedProducts ? false : Boolean(productQuery.hasNextPage),
    isFetchingNextPage: hasInjectedProducts ? false : productQuery.isFetchingNextPage,
    fetchNextPage: hasInjectedProducts
      ? async () => undefined
      : () => productQuery.fetchNextPage(),
    setActiveCategory: handleChangeCategory,
    handleClickAll: () => onClickAll?.(),
    handleClickArrow,
    handleClickProduct: (product: ProductItem) => onClickProduct?.(product),
  };
}
