import { type ProductDetailResponseDTOCategory } from '@apis/telegro';
import { cn } from '@libs/cn';
import { type ReactNode } from 'react';
import { FiShare2 } from 'react-icons/fi';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

type ProductDetailPurchasePanelProps = {
  productName?: string;
  price?: string;
  rewardPointLabel: string;
  quantity: number;
  category?: ProductDetailResponseDTOCategory;
  options: string[];
  selectedOption: string;
  inputOption: string;
  isLiked: boolean;
  likeCount: number;
  isShareCopied: boolean;
  totalPriceLabel: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onSelectOption: (option: string) => void;
  onInputOptionChange: (value: string) => void;
  onAddCart?: () => void;
  onToggleLike: () => void;
  onShare: () => void;
  isAdminMode?: boolean;
  isDeletePending?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

const ProductDetailPurchasePanel = ({
  productName,
  price,
  rewardPointLabel,
  quantity,
  category,
  options,
  selectedOption,
  inputOption,
  isLiked,
  likeCount,
  isShareCopied,
  totalPriceLabel,
  onDecrease,
  onIncrease,
  onSelectOption,
  onInputOptionChange,
  onAddCart,
  onToggleLike,
  onShare,
  isAdminMode = false,
  isDeletePending = false,
  onEdit,
  onDelete,
}: ProductDetailPurchasePanelProps) => {
  const requiresInputOption =
    category === 'HEADSET' || category === 'LINE_CORD' || category === 'RECORDER';

  return (
    <aside className="flex flex-col gap-6 pt-1">
      <div className="flex items-start justify-between gap-5">
        <div className="flex flex-col gap-4">
          <h1 className="text-[2.6rem] leading-[1.2] font-semibold tracking-[-0.03em] text-[#263238]">
            {productName}
          </h1>
          <strong className="text-[2.3rem] leading-none font-medium text-[#263238]">
            {price}
          </strong>
        </div>

        <button
          type="button"
          aria-label="공유하기"
          title={isShareCopied ? '복사되었습니다.' : '공유하기'}
          onClick={onShare}
          className={cn(
            'flex-row-center mt-2 h-12 w-12 cursor-pointer rounded-full bg-gray-200 transition-all',
            isShareCopied
              ? 'text-gray-900'
              : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900',
          )}
        >
          <FiShare2 className="h-6 w-6" />
        </button>
      </div>

      <div className="h-px w-full bg-[#DFE4E8]" />

      <div className="flex flex-col gap-3">
        <label className="text-[1rem] font-medium text-[#263238]">옵션</label>
        <select
          value={selectedOption}
          onChange={(event) => onSelectOption(event.target.value)}
          className="h-[4.4rem] border border-[#D9E0E6] bg-white px-4 text-[1rem] text-[#263238] outline-none focus:border-[#1F3138]"
        >
          {options.length ? (
            options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          ) : (
            <option value="">기본 옵션</option>
          )}
        </select>

        {requiresInputOption ? (
          <input
            type="text"
            value={inputOption}
            onChange={(event) => onInputOptionChange(event.target.value)}
            placeholder="기타 옵션 기재"
            className="h-[4.4rem] border border-[#D9E0E6] bg-white px-4 text-[1rem] text-[#263238] outline-none placeholder:text-[#9CA3AF] focus:border-[#1F3138]"
          />
        ) : null}
      </div>

      <div className="flex items-center gap-2 text-[1rem] text-[#637381]">
        <span className="font-semibold text-[#263238]">구매 적립</span>
        <span>{rewardPointLabel}</span>
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#AEB7C0] text-[0.75rem] leading-none text-[#7B8794]">
          ?
        </span>
      </div>

      <div className="border border-[#E7EBEF] bg-[#F8FAFB] px-5 py-5">
        <div className="mb-4 flex items-center justify-between border-b border-[#E3E7EB] pb-4">
          <span className="text-[1rem] font-medium text-[#263238]">수량</span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="inline-flex overflow-hidden border border-[#D9E0E6] bg-white">
            <QuantityButton onClick={onDecrease} label="수량 감소">
              -
            </QuantityButton>
            <div className="flex h-[3.2rem] min-w-[3.2rem] items-center justify-center border-x border-[#D9E0E6] text-[1.05rem] text-[#263238]">
              {quantity}
            </div>
            <QuantityButton onClick={onIncrease} label="수량 증가">
              +
            </QuantityButton>
          </div>

          <strong className="text-[1.8rem] font-medium text-[#263238]">
            {totalPriceLabel}
          </strong>
        </div>
      </div>

      <div className="flex items-end justify-between pt-5">
        <span className="text-[1.6rem] text-[#637381]">총 상품 금액({quantity}개)</span>
        <strong className="text-[2.3rem] leading-none font-medium text-[#263238]">
          {totalPriceLabel}
        </strong>
      </div>

      {isAdminMode ? (
        <div className="grid grid-cols-2 gap-3 pt-3">
          <ActionButton variant="primary" onClick={onEdit}>
            수정하기
          </ActionButton>
          <ActionButton
            variant="danger"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending ? '삭제 중...' : '삭제하기'}
          </ActionButton>
        </div>
      ) : (
        <div className="grid grid-cols-[1.15fr_1fr_0.8fr] gap-3 pt-3">
          <ActionButton variant="primary">구매하기</ActionButton>
          <ActionButton variant="secondary" onClick={onAddCart}>
            장바구니
          </ActionButton>
          <ActionButton
            variant="ghost"
            onClick={onToggleLike}
            active={isLiked}
            ariaPressed={isLiked}
          >
            <span className="flex cursor-pointer items-center gap-2">
              {isLiked ? (
                <IoHeart className="h-5 w-5 text-[#E53935]" />
              ) : (
                <IoHeartOutline className="h-5 w-5 text-[#263238]" />
              )}
              <span>{likeCount}</span>
            </span>
          </ActionButton>
        </div>
      )}
    </aside>
  );
};

const QuantityButton = ({
  children,
  onClick,
  label,
}: {
  children: ReactNode;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex-row-center h-[3.2rem] w-[3rem] cursor-pointer text-[1.4rem] text-[#5B6770] transition-colors hover:bg-[#F7F9FB]"
  >
    {children}
  </button>
);

const ActionButton = ({
  children,
  variant,
  onClick,
  active = false,
  ariaPressed,
  disabled = false,
}: {
  children: ReactNode;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  active?: boolean;
  ariaPressed?: boolean;
  disabled?: boolean;
}) => {
  const classes = {
    primary: 'bg-[#1F3138] border-[#1F3138] text-white',
    secondary: 'bg-white border-[#C9D2D9] text-[#263238]',
    ghost: active
      ? 'bg-[#FFF1F1] border-[#F3B8B8] text-[#E53935]'
      : 'bg-[#F2F6F7] border-[#C9D2D9] text-[#263238]',
    danger: 'bg-[#FFF5F5] border-[#F5C2C2] text-[#D64545]',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ariaPressed}
      disabled={disabled}
      className={cn(
        'flex-row-center h-[4.8rem] cursor-pointer border text-[1.35rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
        classes[variant],
      )}
    >
      {children}
    </button>
  );
};

export default ProductDetailPurchasePanel;
