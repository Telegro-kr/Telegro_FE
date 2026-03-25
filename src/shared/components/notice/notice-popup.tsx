import type { NoticeDetailDTO } from '@apis/telegro';

type NoticePopupProps = {
  notice: NoticeDetailDTO;
  onClose: () => void;
  onDismissToday: () => void;
  onOpenNotice: () => void;
};

const NoticePopup = ({
  notice,
  onClose,
  onDismissToday,
  onOpenNotice,
}: NoticePopupProps) => {
  return (
    <div className="flex-row-center fixed inset-0 z-50 bg-black/45 px-6 py-7">
      <div className="w-full max-w-[40rem] rounded-[2rem] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-9">
        <div className="flex items-start justify-between gap-2">
          <h2 className="title4 text-gray-900 md:text-[2.4rem]">
            {notice.noticeTitle?.trim() || '공지사항'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="공지 팝업 닫기"
            className="flex-row-center h-12 w-12 shrink-0 cursor-pointer rounded-full text-[2.2rem] text-gray-600 transition-colors hover:bg-[#F3F4F6]"
          >
            ×
          </button>
        </div>

        <div className="mt-8 rounded-[1.2rem] bg-[#F9F9F9] px-6 py-5">
          {notice.noticeContent?.trim() ? (
            <div
              className="notice-popup-content max-h-[33rem] overflow-y-auto text-[1.45rem] leading-[1.8] font-medium tracking-[-0.02em] text-[#202124]"
              dangerouslySetInnerHTML={{ __html: notice.noticeContent }}
            />
          ) : (
            <p className="max-h-[24rem] overflow-y-auto text-[1.45rem] leading-[1.8] font-medium tracking-[-0.02em] whitespace-pre-line text-[#202124]">
              등록된 공지사항 내용을 불러오지 못했습니다.
            </p>
          )}
        </div>

        <div className="mt-6 flex-col gap-3">
          <button
            type="button"
            onClick={onOpenNotice}
            className="flex-row-center bg-primary h-[4rem] w-full cursor-pointer rounded-[1rem] px-5 text-[1.5rem] font-semibold tracking-[-0.02em] text-white transition-opacity hover:opacity-90"
          >
            보러 가기
          </button>
          <button
            type="button"
            onClick={onDismissToday}
            className="fle-row-center h-[4rem] w-full cursor-pointer rounded-[10px] px-5 text-[1.45rem] font-medium tracking-[-0.02em] text-[#6C7378] transition-colors hover:bg-[#F7F7F7]"
          >
            오늘 하루 보지 않기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticePopup;
