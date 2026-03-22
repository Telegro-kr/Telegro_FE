import Icon from '@components/common/icon';
import type { ProductItem } from '@hooks/use-product-section';

type ProductCardProps = {
  product: ProductItem;
  onClick?: (product: ProductItem) => void;
};

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <article className="relative flex w-full max-w-[37.5rem] flex-col gap-[2rem]">
      <button
        type="button"
        onClick={() => onClick?.(product)}
        className="group relative block overflow-hidden rounded-[1.913rem] text-left"
      >
        <img
          src={product.imageSrc}
          alt={product.title}
          className="h-[28.326rem] w-full rounded-[1.913rem] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        <div className="absolute top-[24rem] left-[1.8rem] inline-flex items-center justify-center gap-[1rem] rounded-[0.8rem] bg-[#33373B] px-[1.6rem] py-[0.5rem]">
          <span className="text-[1.4rem] leading-[2.1rem] font-semibold text-[#FEFEFE]">
            {product.priceLabel}
          </span>
        </div>
      </button>

      <div className="flex items-center justify-between px-[1rem]">
        <div className="flex w-[22.3rem] flex-col items-start gap-[1rem]">
          <p className="w-full text-[2.5rem] leading-[1.3] font-semibold text-black">
            {product.title}
          </p>
          <p className="w-full text-[2rem] leading-[1.3] font-semibold text-[#555555]">
            {product.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onClick?.(product)}
          aria-label={`${product.title} 상세 보기`}
          className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1rem] bg-[#333333]"
        >
          <Icon name="admin-arrow" size={4.5} />
        </button>
      </div>
    </article>
  );
}
