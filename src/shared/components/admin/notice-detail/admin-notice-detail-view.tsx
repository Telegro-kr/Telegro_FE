import Icon from '@components/common/icon';
import { useAdminNoticeDetail } from '@hooks/use-admin-notice-detail';
import NoticeContentCard from '@components/admin/notice-detail/notice-content-card';
import NoticeHeroGraphic from '@components/admin/notice-detail/notice-hero-graphic';
import NoticeNavigationRow from '@components/admin/notice-detail/notice-navigation-row';
import CalendarIcon from '@components/common/calendar-icon';

type AdminNoticeDetailViewProps = ReturnType<typeof useAdminNoticeDetail>;

const AdminNoticeDetailView = ({
  notice,
  prevNotice,
  nextNotice,
  handleGoList,
  handleOpenNotice,
}: AdminNoticeDetailViewProps) => {
  return (
    <section className="mx-auto w-full bg-white">
      <header className="border-b border-[#E6E6E6] px-6 pt-14 pb-12 md:px-10 md:pt-20 md:pb-14">
        <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
          <h1 className="max-w-[920px] text-[2rem] leading-[1.35] font-semibold tracking-[-0.04em] text-[#202124] md:text-[3.1rem]">
            {notice.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[1rem] text-[#8B8F94] md:text-[1.125rem]">
            <span>No. {notice.id}</span>
            <span className="h-4 w-px bg-[#D9D9D9]" />
            <Icon name="eye" size={1.6} />
            <span>101</span>
            <span className="h-4 w-px bg-[#D9D9D9]" />
            <CalendarIcon />
            <span>{notice.createdAt}</span>
          </div>
        </div>
      </header>

      <div className="px-6 py-10 md:px-10 md:py-12">
        <div className="mx-auto flex max-w-[980px] flex-col gap-14">
          <NoticeHeroGraphic />

          <article className="flex flex-col gap-8 text-[#202124]">
            <p className="text-[1.28rem] leading-[1.9] tracking-[-0.02em] text-[#202124] md:text-[1.45rem]">
              안녕하세요, 텔레그로 운영팀입니다.
            </p>

            <p className="text-[1.2rem] leading-[1.95] font-medium tracking-[-0.02em] text-[#5B74F7] md:text-[1.35rem]">
              {notice.summary}
            </p>

            <NoticeContentCard paragraphs={notice.content} />
          </article>

          <div className="border-t border-[#E9E9E9]">
            <NoticeNavigationRow
              label="이전글"
              notice={prevNotice}
              onClick={() => prevNotice && handleOpenNotice(prevNotice.id)}
            />
            <NoticeNavigationRow
              label="다음글"
              notice={nextNotice}
              onClick={() => nextNotice && handleOpenNotice(nextNotice.id)}
              withTopBorder
            />
          </div>

          <div className="flex justify-center pt-8 md:pt-10">
            <button
              type="button"
              onClick={handleGoList}
              className="inline-flex h-[5rem] min-w-[18rem] cursor-pointer items-center justify-center rounded-[1rem] border border-[#B9C8F7] bg-white px-8 text-[1.55rem] font-medium tracking-[-0.03em] text-[#5B74F7] transition-colors hover:bg-[#F7F9FF]"
            >
              목록보기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminNoticeDetailView;
