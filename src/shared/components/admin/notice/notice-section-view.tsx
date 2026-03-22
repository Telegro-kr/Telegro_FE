import type { NoticeItem } from '@hooks/use-notice-section';
import NoticeCard from '@components/notice/notice-card';

type NoticeSectionViewProps = {
  title: string;
  actionLabel: string;
  notices: NoticeItem[];
  onClickAll: () => void;
  onClickNotice?: (noticeId: number) => void;
};

const NoticeSectionView = ({
  title,
  actionLabel,
  notices,
  onClickAll,
  onClickNotice,
}: NoticeSectionViewProps) => {
  return (
    <section className="w-full flex-col gap-4">
      <header className="flex-row-between gap-4">
        <h2 className="title3 tracking-[-0.03em] text-gray-900">{title}</h2>

        <button
          type="button"
          onClick={onClickAll}
          className="title5 cursor-pointer text-gray-500 transition-colors hover:text-gray-600 active:text-gray-600"
        >
          {actionLabel}
        </button>
      </header>

      <div className="flex-col gap-4">
        {notices.map((notice) => (
          <NoticeCard
            key={notice.id}
            notice={notice}
            onClick={onClickNotice}
          />
        ))}
      </div>
    </section>
  );
};

export default NoticeSectionView;
