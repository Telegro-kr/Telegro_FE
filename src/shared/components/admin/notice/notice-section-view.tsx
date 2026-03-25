import LoadingPanel from '@components/common/loading-panel';
import NoticeCard from '@components/notice/notice-card';
import type { NoticeItem } from '@hooks/use-notice-section';

type NoticeSectionViewProps = {
  title: string;
  actionLabel: string;
  notices: NoticeItem[];
  isLoading: boolean;
  isError: boolean;
  onClickAll: () => void;
  onClickNotice?: (noticeId: number) => void;
};

const NoticeSectionView = ({
  title,
  actionLabel,
  notices,
  isLoading,
  isError,
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

      {isLoading ? (
        <LoadingPanel className="rounded-2xl" />
      ) : isError ? (
        <div className="rounded-2xl bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-red-500">
          공지사항을 불러오지 못했습니다.
        </div>
      ) : notices.length ? (
        <div className="flex-col gap-4">
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onClick={onClickNotice}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-gray-500">
          표시할 공지사항이 없습니다.
        </div>
      )}
    </section>
  );
};

export default NoticeSectionView;
