import { useEffect } from 'react';
import { cn } from '@utils/cn';

type UserCreateDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const INPUT_CLASS_NAME =
  'h-[5.2rem] w-full rounded-[1.2rem] border border-[#E4E7EC] bg-white px-5 text-[1.45rem] text-[#202124] outline-none transition focus:border-[#5B74F7] focus:ring-4 focus:ring-[#5B74F7]/10';

const UserCreateDrawer = ({ open, onClose }: UserCreateDrawerProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="사용자 등록 패널 닫기"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-[#0F172A]/20 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        aria-hidden={!open}
        className={cn(
          'fixed top-0 right-0 z-50 flex h-screen w-[46rem] max-w-[94vw] flex-col border-l border-[#E7EBF3] bg-[linear-gradient(180deg,#F9FBFF_0%,#FFFFFF_18%)] shadow-[-28px_0_80px_rgba(15,23,42,0.14)]',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-[#EEF2FF] px-8 pt-8 pb-6">
          <div>
            <p className="text-[1.2rem] font-semibold tracking-[0.12em] text-[#5B74F7] uppercase">
              Create User
            </p>
            <h2 className="mt-2 text-[2.4rem] font-semibold tracking-[-0.03em] text-[#111827]">
              사용자 등록
            </h2>
            <p className="mt-2 text-[1.35rem] leading-[1.7] text-[#6B7280]">
              오른쪽 패널에서 바로 등록할 수 있도록 준비한 드로어입니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-[4.6rem] w-[4.6rem] items-center justify-center rounded-[1.4rem] border border-[#E5E7EB] bg-white text-[2rem] text-[#6B7280] transition hover:bg-[#F8FAFC] hover:text-[#111827]"
            aria-label="사용자 등록 닫기"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="rounded-[2rem] border border-[#E8ECF7] bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-[1.28rem] font-medium text-[#374151]">
                  이름
                </span>
                <input
                  type="text"
                  placeholder="사용자 이름"
                  className={INPUT_CLASS_NAME}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[1.28rem] font-medium text-[#374151]">
                  이메일
                </span>
                <input
                  type="email"
                  placeholder="example@telegro.co.kr"
                  className={INPUT_CLASS_NAME}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[1.28rem] font-medium text-[#374151]">
                  연락처
                </span>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  className={INPUT_CLASS_NAME}
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[1.28rem] font-medium text-[#374151]">
                  권한
                </span>
                <select className={INPUT_CLASS_NAME} defaultValue="MEMBER">
                  <option value="MEMBER">MEMBER</option>
                  <option value="DEALER">DEALER</option>
                  <option value="BEST">BEST</option>
                  <option value="BUSINESS">BUSINESS</option>
                </select>
              </label>
            </div>

            <div className="mt-7 rounded-[1.6rem] border border-dashed border-[#CDD8FF] bg-[#F8FAFF] px-5 py-4 text-[1.28rem] leading-[1.7] text-[#5F6B85]">
              현재는 등록 드로어 UI와 오픈/닫기 흐름만 우선 구현했습니다.
            </div>
          </div>
        </div>

        <div className="border-t border-[#EEF2FF] bg-white/90 px-8 py-6 backdrop-blur">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[5rem] items-center justify-center rounded-[1.3rem] border border-[#D6DBE6] bg-white px-6 text-[1.45rem] font-medium text-[#4B5563] transition hover:bg-[#F8FAFC]"
            >
              닫기
            </button>
            <button
              type="button"
              className="inline-flex h-[5rem] items-center justify-center rounded-[1.3rem] bg-[linear-gradient(135deg,#5B74F7_0%,#7C92FF_100%)] px-7 text-[1.45rem] font-semibold text-white shadow-[0_14px_30px_rgba(91,116,247,0.24)] transition hover:brightness-[1.03]"
            >
              등록 준비중
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserCreateDrawer;
