import type { NoticeItem } from '@hooks/use-notice-section';
import NoticeCard from '@components/notice/notice-card';

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
        <div className="rounded-2xl bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-gray-500">
          {'\uACF5\uC9C0\uC0AC\uD56D\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4.'}
        </div>
      ) : isError ? (
        <div className="rounded-2xl bg-white px-[2.2rem] py-[2rem] text-[1.6rem] text-red-500">
          {'\uACF5\uC9C0\uC0AC\uD56D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.'}
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
          {'\uD45C\uC2DC\uD560 \uACF5\uC9C0\uC0AC\uD56D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.'}
        </div>
      )}
    </section>
  );
};

export default NoticeSectionView;
