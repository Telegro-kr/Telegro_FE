import Icon from '@components/common/icon';
import { cn } from '@utils/cn';
import signupLogo from '/signup-logo.svg';
import {
  inputClass,
  labelClass,
  ROLE_OPTIONS,
  STEP_FIELDS,
} from './user-drawer.constants';
import { useUserCreateDrawer } from './use-user-create-drawer';
import type { UserDrawerInitialData } from './user-drawer.types';

export type { CreateCompanyForm, UserDrawerInitialData } from './user-drawer.types';

type UserCreateDrawerProps = {
  open: boolean;
  mode?: 'create' | 'edit';
  initialData?: UserDrawerInitialData | null;
  onClose: () => void;
};

const UserCreateDrawer = ({
  open,
  mode = 'create',
  initialData,
  onClose,
}: UserCreateDrawerProps) => {
  const {
    activeStep,
    currentStep,
    form,
    handleAddressSearch,
    handleFieldChange,
    handleNextStep,
    handleSubmit,
    isEditMode,
    isLastStep,
    isPostcodeReady,
    isSubmitting,
    selectedRole,
    setCurrentStep,
    setSelectedRole,
  } = useUserCreateDrawer({
    open,
    mode,
    initialData,
    onClose,
  });

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label={isEditMode ? '사용자 수정 닫기' : '사용자 등록 닫기'}
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
                aria-label="닫기"
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

            <div className="pt-[2rem]">
              <p className="font-['Pretendard',sans-serif] text-[2rem] font-semibold text-[#2B2B2B]">
                {isEditMode ? '사용자 수정' : '사용자 등록'}
              </p>
            </div>

            <div className="flex flex-col gap-[4rem] pt-[2rem]">
              <div className="flex gap-2">
                {STEP_FIELDS.map((item) => (
                  <div
                    key={item.step}
                    className={[
                      'h-[1rem] flex-1 rounded-[0.8rem]',
                      item.step <= currentStep ? 'bg-[#FFC633]' : 'bg-[#F0F1F4]',
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
                  <p className={labelClass}>{activeStep.title}</p>

                  <div className="flex flex-col gap-[1.6rem] pl-[1rem]">
                    <div className="flex flex-wrap gap-x-[5.6rem] gap-y-[1.6rem]">
                      {ROLE_OPTIONS.map((role) => (
                        <label
                          key={role.value}
                          className="flex min-w-[10rem] items-center gap-[0.8rem]"
                        >
                          <span
                            className={[
                              'h-[1.5rem] w-[1.5rem] rounded-full border border-[#979B9F]',
                              selectedRole === role.value ? 'bg-[#FFC633]' : 'bg-white',
                            ].join(' ')}
                          />
                          <input
                            type="radio"
                            name="user-role"
                            value={role.value}
                            checked={selectedRole === role.value}
                            onChange={() => setSelectedRole(role.value)}
                            className="sr-only"
                          />
                          <span className="font-['Pretendard',sans-serif] text-[1.6rem] leading-[2.2rem] font-medium text-[#2B2B2B]">
                            {role.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null}

              <div className="flex flex-col gap-[3.2rem]">
                {activeStep.fields.map((field) => {
                  const isMemo = field.key === 'companyDescription';
                  const isAddress = field.key === 'address';
                  const isZipCode = field.key === 'zipCode';

                  return (
                    <label key={field.key} className="flex flex-col gap-[2.4rem]">
                      <span className={labelClass}>{field.label}</span>

                      {isMemo ? (
                        <textarea
                          value={form[field.key]}
                          onChange={handleFieldChange(field.key)}
                          placeholder={field.placeholder}
                          className={`${inputClass} min-h-[33rem] resize-none py-[1.6rem]`}
                        />
                      ) : (
                        <div className="relative">
                          <input
                            type={field.type ?? 'text'}
                            value={form[field.key]}
                            onChange={handleFieldChange(field.key)}
                            inputMode={field.type === 'tel' ? 'numeric' : undefined}
                            placeholder={
                              isEditMode && field.key === 'password'
                                ? '변경 시에만 입력해 주세요.'
                                : field.placeholder
                            }
                            readOnly={isAddress || isZipCode}
                            className={cn(
                              inputClass,
                              isAddress || isZipCode ? 'bg-[#FAFAFA]' : '',
                            )}
                          />
                          {field.actionLabel ? (
                            <button
                              type="button"
                              onClick={handleAddressSearch}
                              disabled={!isPostcodeReady}
                              className="absolute top-1/2 right-[1.2rem] -translate-y-1/2 rounded-[0.8rem] border border-[#F2F2F7] bg-[#FFF4D8] px-[1.4rem] py-[0.8rem] font-['Pretendard',sans-serif] text-[1.3rem] font-bold text-[#2B2B2B] transition hover:bg-[#FFEAB5] disabled:cursor-not-allowed disabled:bg-[#F3F3F3] disabled:text-[#9A9A9A]"
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
              onClick={isLastStep ? handleSubmit : handleNextStep}
              disabled={isSubmitting}
              className="flex-1 rounded-[0.8rem] border border-[#F2F2F7] bg-[#FFC633] px-[2.4rem] py-[1.4rem] font-['Pretendard',sans-serif] text-[1.8rem] font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLastStep ? (isSubmitting ? '처리 중...' : isEditMode ? '수정' : '등록') : '다음'}
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
};

export default UserCreateDrawer;
