import { useEffect, useMemo, useState } from 'react';
import { type ProductDetailResponseDTO } from '@apis/telegro';
import { toastError, toastSuccess } from '@components/common/toast/toast';

export type RecommendationItem = {
  id: number;
  title: string;
  price: string;
  image: string;
};

export type ProductTab = 'detail' | 'review' | 'return' | 'qna';

type UseProductDetailParams = {
  product?: ProductDetailResponseDTO;
  recommendations?: RecommendationItem[];
};

const DEFAULT_PRODUCT: ProductDetailResponseDTO = {
  productModel: 'CK-001',
  productName: 'Carry On Cocktail Kit',
  options: ['기본 구성', '1개'],
  category: 'ACCESSORY',
  content:
    '여행 가방에 가볍게 넣어두기 좋은 칵테일 키트입니다. 군더더기 없는 패키지와 차분한 무드의 디테일을 중심으로 구성되어 선물용으로도 잘 어울립니다.\n\n패키지 내부에는 간단한 칵테일 제조에 필요한 기본 구성이 포함되어 있으며, 감각적인 오브제로도 활용할 수 있도록 절제된 톤의 디자인을 적용했습니다.',
  price: '24,000',
  priceBussiness: '22,000',
  priceBest: '21,000',
  priceDealer: '20,000',
  priceCustomer: '24,000',
  coverImage: '/product1.png',
  pictures: ['/product1.png', '/product1.png', '/product1.png'],
};

const DEFAULT_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 1,
    title: 'Hands & Body Cotton Dry Towel',
    price: '18,000',
    image: '/product1.png',
  },
  {
    id: 2,
    title: 'Travel Care Pouch',
    price: '19,000',
    image: '/product1.png',
  },
  {
    id: 3,
    title: 'Premium Bath Set',
    price: '28,000',
    image: '/product1.png',
  },
  {
    id: 4,
    title: 'Body Care Gift Box',
    price: '31,000',
    image: '/product1.png',
  },
  {
    id: 5,
    title: 'Soft Cream Towel',
    price: '16,000',
    image: '/product1.png',
  },
];

export const useProductDetail = ({
  product = DEFAULT_PRODUCT,
  recommendations = DEFAULT_RECOMMENDATIONS,
}: UseProductDetailParams = {}) => {
  const [activeTab, setActiveTab] = useState<ProductTab>('detail');
  const [quantity, setQuantity] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isShareCopied, setIsShareCopied] = useState(false);

  const galleryImages = useMemo(() => {
    const images = [product.coverImage, ...(product.pictures ?? [])].filter(
      Boolean,
    ) as string[];
    return Array.from(new Set(images));
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(product.coverImage ?? '');

  const basePrice = useMemo(() => {
    const numeric = (product.price ?? '24,000').replace(/[,원\s]/g, '');
    return Number(numeric) || 24000;
  }, [product.price]);

  const totalPriceLabel = useMemo(
    () => (basePrice * quantity).toLocaleString(),
    [basePrice, quantity],
  );
  const rewardPointLabel = useMemo(
    () => `${(1000 * quantity).toLocaleString()} 포인트 적립예정`,
    [quantity],
  );

  useEffect(() => {
    if (!isShareCopied) return;

    const timeout = window.setTimeout(() => setIsShareCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [isShareCopied]);

  const handleToggleLike = () => {
    const next = !isLiked;

    setIsLiked(next);
    setLikeCount((count) => (next ? count + 1 : Math.max(0, count - 1)));
  };

  const handleShare = async () => {
    const shareTarget =
      typeof window !== 'undefined'
        ? window.location.href
        : (product.productName ?? '');

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareTarget);
      }

      setIsShareCopied(true);
      toastSuccess('복사되었습니다.');
    } catch {
      toastError('복사에 실패했습니다.');
    }
  };

  return {
    product,
    activeTab,
    setActiveTab,
    selectedImage,
    setSelectedImage,
    quantity,
    setQuantity,
    galleryImages,
    isDetailOpen,
    setIsDetailOpen,
    isLiked,
    likeCount,
    isShareCopied,
    totalPriceLabel,
    rewardPointLabel,
    recommendations,
    handleToggleLike,
    handleShare,
  };
};
