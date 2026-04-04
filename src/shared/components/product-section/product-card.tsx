import Icon from '@components/common/icon';
import type { ProductItem } from '@hooks/use-product-section';

type ProductCardProps = {
  product: ProductItem;
  onClick?: (product: ProductItem) => void;
  showActionButton?: boolean;
};

export default function ProductCard({
  product,
  onClick,
  showActionButton = true,
}: ProductCardProps) {
  return (
    <article className="relative flex w-full max-w-[37.5rem] flex-col gap-[2rem]">
      <button
        type="button"
        onClick={() => onClick?.(product)}
        className="group relative block cursor-pointer overflow-hidden rounded-[1.913rem] text-left"
      >
        <img
          src={product.imageSrc}
          alt={product.title}
          className="aspect-[1/1] w-full rounded-[1.913rem] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        <div className="absolute bottom-[1.8rem] left-[1.8rem] inline-flex items-center justify-center gap-[1rem] rounded-[0.8rem] bg-[#33373B] px-[1.6rem] py-[0.5rem]">
          <span className="text-[1.4rem] leading-[2.1rem] font-semibold text-[#FEFEFE]">
            {product.priceLabel}
          </span>
        </div>
      </button>

      <div className="flex items-center justify-between gap-[1.6rem] px-[1rem]">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[1rem]">
          <p className="title4 w-full text-gray-900">{product.title}</p>
          <p className="title5 w-full text-gray-600">{product.subtitle}</p>
        </div>

        {showActionButton ? (
          <button
            type="button"
            onClick={() => onClick?.(product)}
            aria-label={`${product.title} 상세 보기`}
            className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1rem] bg-gray-900"
          >
            <Icon name="admin-arrow" className="text-gray-50" size={4.5} />
          </button>
        ) : null}
      </div>
    </article>
  );
}
