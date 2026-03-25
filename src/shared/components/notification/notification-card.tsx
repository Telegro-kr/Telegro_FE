import { cn } from '@utils/cn';

export type NotificationCategory = 'notice' | 'product';

export type NotificationItem = {
  id: number;
  category: NotificationCategory;
  title: string;
  description: string;
  timeLabel: string;
  isRead?: boolean;
};

type NotificationCardProps = {
  item: NotificationItem;
  onRemove: (id: number) => void;
};

const CloseIcon = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const NotificationCard = ({ item, onRemove }: NotificationCardProps) => {
  const categoryLabel = item.category === 'notice' ? '공지사항' : '상품 안내';

  return (
    <article
      className={cn(
        'cursor-pointer rounded-2xl border px-6 py-5 transition-all duration-200',
        item.isRead
          ? 'border-[#F2F2F7] bg-[#E3E3E3]/70'
          : 'border-[#F2F2F7] bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="mt-[1px] h-[14px] w-[14px] rounded-full bg-[#FFC633]" />
          <span className="text-[15px] font-normal text-[#444444]">
            {categoryLabel}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#C4C4C4] transition hover:bg-black/5 hover:text-[#7A7A7A]"
          aria-label="알림 삭제"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3 space-y-2">
        <h3 className="text-[18px] leading-[1.4] font-semibold tracking-[-0.02em] text-[#222222]">
          {item.title}
        </h3>
        <p className="text-[15px] leading-[1.45] whitespace-pre-line text-[#444444]">
          {item.description}
        </p>
      </div>

      <p className="mt-4 text-[14px] text-[#666666]">{item.timeLabel}</p>
    </article>
  );
};

export default NotificationCard;
