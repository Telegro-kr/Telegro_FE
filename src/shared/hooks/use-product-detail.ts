import { type ProductDetailResponseDTO } from '@apis/telegro';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useEffect, useMemo, useState } from 'react';

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
    '휴대가 간편한 샘플 상품 설명입니다. 실제 응답이 없을 때도 화면 구조를 확인할 수 있도록 기본 텍스트를 제공합니다.',
  price: '24,000',
  priceBussiness: '22,000',
  priceBest: '21,000',
  priceDealer: '20,000',
  priceCustomer: '24,000',
  coverImage: '/product1.png',
  pictures: ['/product1.png', '/product1.png', '/product1.png'],
};

export const useProductDetail = ({
  product = DEFAULT_PRODUCT,
  recommendations = [],
}: UseProductDetailParams = {}) => {
  const [activeTab, setActiveTab] = useState<ProductTab>('detail');
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState('');
  const [inputOption, setInputOption] = useState('');
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
    const numeric = (product.price ?? '24,000').replace(/[,\s원]/g, '');
    return Number(numeric) || 24000;
  }, [product.price]);

  const totalPriceLabel = useMemo(
    () => `${(basePrice * quantity).toLocaleString()}원`,
    [basePrice, quantity],
  );
  const rewardPointLabel = useMemo(
    () => `${(1000 * quantity).toLocaleString()} 포인트 적립 예정`,
    [quantity],
  );

  useEffect(() => {
    const firstOption = product.options?.find((option) => option?.trim())?.trim() ?? '';
    setSelectedImage(product.coverImage ?? '');
    setSelectedOption(firstOption);
    setInputOption('');
    setQuantity(1);
  }, [product]);

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
    selectedOption,
    setSelectedOption,
    inputOption,
    setInputOption,
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
