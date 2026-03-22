import type { NoticeItem } from '@hooks/use-notice-section';

type NoticeCardProps = {
  notice: NoticeItem;
};

const NoticeCard = ({ notice }: NoticeCardProps) => {
  return (
    <article className="hover:border-primary/60 w-full cursor-pointer flex-col gap-6 rounded-2xl border border-transparent bg-white px-[2rem] py-[2rem]">
      <div className="flex-row-between gap-4">
        <div className="bg-primary flex items-center rounded-[8px] px-[1rem] py-[0.3rem]">
          <span className="caption3 text-white">#{notice.id}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-500">
          <EyeIcon />
          <span className="caption3 text-gray-500">{notice.views}</span>
        </div>
      </div>
      <div className="flex-col gap-4">
        <div className="flex-col gap-3">
          <h3 className="title4 text-[#2B2B2B]">{notice.title}</h3>

          <p
            className="body3 text-gray-600"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {notice.preview}
          </p>
        </div>

        <div className="h-px w-full bg-[#E9E9E9]" />

        <div className="flex justify-end">
          <span className="caption3 text-gray-500">{notice.dateLabel}</span>
        </div>
      </div>
    </article>
  );
};

export default NoticeCard;

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
    >
      <path
        d="M10 4.25C5.833 4.25 2.742 7.02 1.5 10C2.742 12.98 5.833 15.75 10 15.75C14.167 15.75 17.258 12.98 18.5 10C17.258 7.02 14.167 4.25 10 4.25Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
