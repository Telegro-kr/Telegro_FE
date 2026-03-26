import NoticeContentCard from '@components/admin/notice-detail/notice-content-card';
import NoticeHeroGraphic from '@components/admin/notice-detail/notice-hero-graphic';
import NoticeNavigationRow from '@components/admin/notice-detail/notice-navigation-row';
import CalendarIcon from '@components/common/calendar-icon';
import ConfirmModal from '@components/common/confirm-modal';
import Icon from '@components/common/icon';
import LoadingPanel from '@components/common/loading-panel';
import { useAdminNoticeDetail } from '@hooks/use-admin-notice-detail';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type AdminNoticeDetailViewProps = ReturnType<typeof useAdminNoticeDetail> & {
  isAdmin?: boolean;
};

const AdminNoticeDetailView = ({
  isAdmin = false,
  notice,
  prevNotice,
  nextNotice,
  isLoading,
  isError,
  isDeleting,
  isSettingPopup,
  handleGoList,
  handleOpenNotice,
  handleDelete,
  handleSetPopup,
}: AdminNoticeDetailViewProps) => {
  const navigate = useNavigate();
  const [confirmType, setConfirmType] = useState<'delete' | 'popup' | null>(null);

  const handleConfirm = async () => {
    if (confirmType === 'delete') {
      await handleDelete();
    }

    if (confirmType === 'popup') {
      await handleSetPopup();
    }

    setConfirmType(null);
  };

  return (
    <>
      <section className="mx-auto w-full bg-white">
        <header className="border-b border-[#E6E6E6] px-6 pt-14 pb-12 md:px-10 md:pt-20 md:pb-14">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 text-center">
          {isAdmin ? (
            <div className="flex w-full justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/admin/notices/${notice.id}/edit`)}
                disabled={!notice.id || isLoading || isDeleting || isSettingPopup}
                className="inline-flex h-[4.4rem] items-center justify-center rounded-[1.2rem] border border-[#E5E7EB] bg-white px-[1.6rem] text-[1.35rem] font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setConfirmType('delete')}
                disabled={!notice.id || isLoading || isDeleting || isSettingPopup}
                className="inline-flex h-[4.4rem] items-center justify-center rounded-[1.2rem] border border-[#FFD6D6] bg-[#FFF5F5] px-[1.6rem] text-[1.35rem] font-semibold text-red-600 transition hover:bg-[#FFECEC] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
              <button
                type="button"
                onClick={() => setConfirmType('popup')}
                disabled={
                  !notice.id ||
                  isLoading ||
                  isDeleting ||
                  isSettingPopup ||
                  notice.isPop
                }
                className="inline-flex h-[4.4rem] items-center justify-center rounded-[1.2rem] border border-[#FFE2C0] bg-[#FFF6EC] px-[1.6rem] text-[1.35rem] font-semibold text-[#D86B00] transition hover:bg-[#FFEBD4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {notice.isPop
                  ? '팝업 고정됨'
                  : isSettingPopup
                    ? '고정 중...'
                    : '팝업 고정'}
              </button>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-3">
            {notice.isPop ? (
              <span className="inline-flex rounded-full bg-[#FFF1DD] px-4 py-2 text-[1.15rem] font-semibold text-[#D86B00]">
                POPUP NOTICE
              </span>
            ) : null}
          </div>

          <h1 className="max-w-[920px] text-[2rem] leading-[1.35] font-semibold tracking-[-0.04em] text-[#202124] md:text-[3.1rem]">
            {notice.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[1rem] text-[#8B8F94] md:text-[1.125rem]">
            <span>No. {notice.id}</span>
            <span className="h-4 w-px bg-[#D9D9D9]" />
            <Icon name="eye" size={1.6} />
            <span>{notice.views}</span>
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
            {notice.summary ? (
              <p className="text-[1.2rem] leading-[1.95] font-medium tracking-[-0.02em] text-[#5B74F7] md:text-[1.35rem]">
                {notice.summary}
              </p>
            ) : null}

            {isLoading ? (
              <LoadingPanel
                className="min-h-[28rem] rounded-[1.6rem] bg-[#FBFBF8]"
                size={96}
              />
            ) : isError ? (
              <p className="text-[1.14rem] leading-[2] tracking-[-0.02em] text-[#202124] md:text-[1.28rem]">
                공지사항을 불러오지 못했습니다.
              </p>
            ) : (
              <NoticeContentCard content={notice.content} />
            )}

            {!isLoading && !isError && notice.attachments.length ? (
              <section className="rounded-[1.4rem] border border-[#E6ECFF] bg-[#F7F9FF] px-6 py-6 md:px-8">
                <div className="flex flex-col gap-4">
                  <h2 className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#202124] md:text-[1.15rem]">
                    첨부파일
                  </h2>

                  <div className="flex flex-col divide-y divide-[#DCE4FF]">
                    {notice.attachments.map((file) => (
                      <a
                        key={file.id || file.fileUrl}
                        href={file.fileUrl}
                        download={file.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-4 py-4 text-[1rem] transition-colors hover:text-[#3557F6] md:text-[1.08rem]"
                      >
                        <span className="min-w-0 truncate text-[#202124]">
                          {file.fileName}
                        </span>
                        <span className="shrink-0 font-medium text-[#5B74F7]">
                          다운로드
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}
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

      {confirmType ? (
        <ConfirmModal
          message={
            confirmType === 'delete'
              ? '이 공지사항을 삭제하시겠습니까?'
              : '이 공지사항을 팝업으로 고정하시겠습니까?'
          }
          confirmText={confirmType === 'delete' ? '삭제' : '고정'}
          cancelText="취소"
          onCancel={() => setConfirmType(null)}
          onConfirm={() => {
            void handleConfirm();
          }}
        />
      ) : null}
    </>
  );
};

export default AdminNoticeDetailView;
