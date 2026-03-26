import Icon from '@components/common/icon';
import { useEffect, useMemo, useState } from 'react';
import signupLogo from '/signup-logo.svg';
import { cn } from '@utils/cn';

type UserCreateDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type StepField = {
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel';
  actionLabel?: string;
};

const ROLE_OPTIONS = ['Member', 'Dealer', 'Best', 'Business', 'Admin'] as const;

const STEP_FIELDS: Array<{
  step: number;
  title: string;
  fields: StepField[];
}> = [
  {
    step: 1,
    title: '회원 유형 선택',
    fields: [
      {
        label: '회원명',
        placeholder: '회원 이름을 입력해 주세요',
        required: true,
      },
      {
        label: '아이디',
        placeholder: '아이디를 입력해 주세요',
        required: true,
      },
      {
        label: '비밀번호',
        placeholder: '비밀번호를 입력해 주세요',
        required: true,
        type: 'password',
      },
      {
        label: '상호명',
        placeholder: '상호명을 입력해 주세요',
        required: true,
      },
    ],
  },
  {
    step: 2,
    title: '연락처 정보',
    fields: [
      {
        label: '전화번호',
        placeholder: '전화번호를 입력해 주세요',
        required: true,
        type: 'tel',
      },
      {
        label: '이메일(세금계산서용)',
        placeholder: '이메일을 입력해 주세요',
        required: true,
        type: 'email',
      },
      {
        label: '담당자 이름',
        placeholder: '담당자 이름을 입력해 주세요',
        required: true,
      },
      {
        label: '담당자 전화번호',
        placeholder: '담당자 전화번호를 입력해 주세요',
        required: true,
        type: 'tel',
      },
    ],
  },
  {
    step: 3,
    title: '사업자 정보',
    fields: [
      {
        label: '사업자 번호',
        placeholder: '사업자 번호를 입력해 주세요',
        required: true,
      },
      {
        label: '업태',
        placeholder: '업태를 입력해 주세요',
        required: true,
      },
      {
        label: '종목',
        placeholder: '종목을 입력해 주세요',
        required: true,
      },
      {
        label: '주소',
        placeholder: '주소를 검색해 주세요',
        required: true,
        actionLabel: '주소 검색',
      },
      {
        label: '우편번호',
        placeholder: '우편번호',
        required: true,
      },
      {
        label: '상세주소',
        placeholder: '상세주소를 입력해 주세요',
        required: true,
      },
    ],
  },
  {
    step: 4,
    title: '메모',
    fields: [
      {
        label: '메모',
        placeholder: '메모를 입력해 주세요',
      },
    ],
  },
];

const labelClass =
  "font-['Pretendard',sans-serif] text-[1.25rem] font-semibold text-[#2B2B2B]";

const inputClass =
  "h-[5.6rem] w-full rounded-[1rem] border border-[#E9E9E9] bg-white px-[1.6rem] font-['Pretendard',sans-serif] text-[1.6rem] font-normal text-[#2B2B2B] outline-none transition placeholder:text-[#6D6D6D] focus:border-[#FFC633]";

const UserCreateDrawer = ({ open, onClose }: UserCreateDrawerProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] =
    useState<(typeof ROLE_OPTIONS)[number]>('Member');

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

  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setSelectedRole('Member');
    }
  }, [open]);

  const activeStep = useMemo(
    () =>
      STEP_FIELDS.find((item) => item.step === currentStep) ?? STEP_FIELDS[0],
    [currentStep],
  );

  const isLastStep = currentStep === STEP_FIELDS.length;

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="사용자 등록 닫기"
        className={cn(
          'fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px] transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        aria-hidden={!open}
        className={cn(
          'fixed top-0 right-0 z-50 flex h-screen w-[45rem] max-w-[94vw] flex-col bg-white shadow-[-24px_0_60px_rgba(0,0,0,0.08)]',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <header className="px-[4rem] pt-[2rem] pb-[3.2rem]">
            <div className="flex-row-between">
              <div className="relative h-[5.6rem] w-[5.6rem] rounded-[1rem] bg-[#FAEBC3]">
                <img
                  src={signupLogo}
                  alt="signup"
                  className="absolute top-[0.66rem] left-[0.48rem] h-[4.56rem] w-[4.56rem] object-contain"
                />
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="뒤로가기"
                className="flex cursor-pointer"
              >
                <Icon
                  name="signup-back"
                  className="text-gray-200"
                  size={4.8}
                  rotate={180}
                />
              </button>
            </div>

            <div className="flex flex-col gap-[4rem] pt-[2rem]">
              <div className="flex gap-2">
                {STEP_FIELDS.map((item) => (
                  <div
                    key={item.step}
                    className={[
                      'h-[1rem] flex-1 rounded-[0.8rem]',
                      item.step <= currentStep
                        ? 'bg-[#FFC633]'
                        : 'bg-[#F0F1F4]',
                    ].join(' ')}
                  />
                ))}
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-[4.68rem] pb-[12rem]">
            <div className="flex flex-col gap-[2.4rem]">
              {currentStep === 1 ? (
                <section className="flex flex-col gap-[2.4rem]">
                  <p className={labelClass}>회원 유형 선택</p>

                  <div className="flex flex-col gap-[1.6rem] pl-[1rem]">
                    <div className="flex flex-wrap gap-x-[5.6rem] gap-y-[1.6rem]">
                      {ROLE_OPTIONS.map((role) => (
                        <label
                          key={role}
                          className="flex min-w-[10rem] items-center gap-[0.8rem]"
                        >
                          <span
                            className={[
                              'h-[1.5rem] w-[1.5rem] rounded-full border border-[#979B9F]',
                              selectedRole === role
                                ? 'bg-[#FFC633]'
                                : 'bg-white',
                            ].join(' ')}
                          />
                          <input
                            type="radio"
                            name="user-role"
                            value={role}
                            checked={selectedRole === role}
                            onChange={() => setSelectedRole(role)}
                            className="sr-only"
                          />
                          <span className="font-['Pretendard',sans-serif] text-[1.6rem] leading-[2.2rem] font-medium text-[#2B2B2B]">
                            {role}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null}

              <div className="flex flex-col gap-[3.2rem]">
                {activeStep.fields.map((field) => {
                  const isMemo = field.label === '메모';

                  return (
                    <label
                      key={field.label}
                      className="flex flex-col gap-[2.4rem]"
                    >
                      <span className={labelClass}>{field.label}</span>

                      {isMemo ? (
                        <textarea
                          placeholder={field.placeholder}
                          className={`${inputClass} min-h-[33rem] resize-none py-[1.6rem]`}
                        />
                      ) : (
                        <div className="relative">
                          <input
                            type={field.type ?? 'text'}
                            placeholder={field.placeholder}
                            className={inputClass}
                          />
                          {field.actionLabel ? (
                            <button
                              type="button"
                              className="absolute top-1/2 right-[1.2rem] -translate-y-1/2 rounded-[0.8rem] border border-[#F2F2F7] bg-[#FFF4D8] px-[1.4rem] py-[0.8rem] font-['Pretendard',sans-serif] text-[1.3rem] font-bold text-[#2B2B2B] transition hover:bg-[#FFEAB5]"
                            >
                              {field.actionLabel}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <footer className="absolute right-0 bottom-0 left-0 bg-white px-[2rem] py-[1rem] shadow-[0_-2px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-[1rem]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
                className="flex-1 rounded-[0.8rem] border border-[#F2F2F7] bg-white px-[2.4rem] py-[1.4rem] font-['Pretendard',sans-serif] text-[1.8rem] font-bold text-[#2B2B2B] transition hover:border-[#FFC633]"
              >
                이전
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                if (isLastStep) {
                  return;
                }

                setCurrentStep((step) =>
                  Math.min(STEP_FIELDS.length, step + 1),
                );
              }}
              className="flex-1 rounded-[0.8rem] border border-[#F2F2F7] bg-[#FFC633] px-[2.4rem] py-[1.4rem] font-['Pretendard',sans-serif] text-[1.8rem] font-bold text-white transition hover:brightness-95"
            >
              {isLastStep ? '등록 준비중' : '다음'}
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
};

export default UserCreateDrawer;
