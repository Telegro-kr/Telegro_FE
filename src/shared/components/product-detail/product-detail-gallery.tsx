import { cn } from '@libs/cn';

type ProductDetailGalleryProps = {
  selectedImage: string;
  images: string[];
  productName?: string;
  onSelectImage: (image: string) => void;
};

const ProductDetailGallery = ({
  selectedImage,
  images,
  productName,
  onSelectImage,
}: ProductDetailGalleryProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-none bg-[#EEF4F5]">
        <img
          src={selectedImage || '/cocktail-kit-main.png'}
          alt={productName ?? '상품 이미지'}
          className="aspect-[1/1] w-full object-cover"
        />
      </div>

      <div className="flex items-center gap-4 overflow-x-auto">
        {images.map((image) => {
          const isActive = image === selectedImage;

          return (
            <button
              key={image}
              type="button"
              onClick={() => onSelectImage(image)}
              className={cn(
                'shrink-0 overflow-hidden border transition-all',
                isActive ? 'border-[#1F3138]' : 'border-[#E5E7EB] opacity-75 hover:opacity-100',
              )}
            >
              <img src={image} alt="상품 썸네일" className="h-[7.2rem] w-[7.2rem] object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDetailGallery;
