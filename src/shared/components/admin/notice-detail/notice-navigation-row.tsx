import { cn } from '@libs/cn';
import { type AdminNoticeSibling } from '@hooks/use-admin-notice-detail';

type NoticeNavigationRowProps = {
  label: string;
  notice: AdminNoticeSibling | null;
  onClick: () => void;
  withTopBorder?: boolean;
};

const NoticeNavigationRow = ({
  label,
  notice,
  onClick,
  withTopBorder = false,
}: NoticeNavigationRowProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!notice}
      className={cn(
        'flex w-full items-center gap-6 px-0 py-6 text-left transition-colors',
        withTopBorder && 'border-t border-[#E9E9E9]',
        notice ? 'hover:bg-[#FCFCFC]' : 'cursor-default text-[#B5B5B5]',
      )}
    >
      <span className="shrink-0 text-[1.1rem] font-medium text-[#8B8F94] md:w-[4.5rem] md:text-[1.2rem]">
        {label}
      </span>
      <span className="hidden h-5 w-px shrink-0 bg-[#E0E0E0] md:block" />
      <span className="min-w-0 flex-1 text-[1.15rem] leading-[1.6] font-medium tracking-[-0.02em] text-[#202124] md:text-[1.3rem]">
        {notice ? notice.title : '연결된 공지사항이 없습니다.'}
      </span>
    </button>
  );
};

export default NoticeNavigationRow;
