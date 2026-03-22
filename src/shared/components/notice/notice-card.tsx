import type { NoticeItem } from '@hooks/use-notice-section';
import Icon from '@components/common/icon';

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
          <Icon name="eye" size={1.8} />
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
