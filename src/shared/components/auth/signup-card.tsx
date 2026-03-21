import {
  AuthActionButton,
  AuthCardShell,
  AuthField,
  AuthProgressBar,
} from '@components/auth/auth-card';
import Icon from '@components/common/icon';
import { type SignupForm } from '@hooks/use-signup-form';
import { type ChangeEvent, type FormEvent } from 'react';
import signupLogo from '/signup-logo.svg';

type SignupCardProps = {
  className?: string;
  form: SignupForm;
  step: number;
  isPostcodeReady: boolean;
  isSignupPending: boolean;
  onFieldChange: (key: keyof SignupForm) => (event: ChangeEvent<HTMLInputElement>) => void;
  onAddressSearch: () => void;
  onBack: () => void;
  onNext: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBackToLogin: () => void;
};

const COPY = {
  altSignup: '회원가입',
  backToLogin: '로그인으로 돌아가기',
  next: '다음',
  back: '이전',
  signup: '회원가입',
  signupPending: '가입 중...',
  moveToLogin: '로그인으로 이동',
  userId: '아이디',
  name: '이름',
  email: '이메일',
  password: '비밀번호',
  confirmPassword: '비밀번호 확인',
  phone: '휴대폰 번호',
  zipCode: '우편번호',
  address: '주소',
  addressDetail: '상세 주소',
  enterUserId: '아이디를 입력해 주세요',
  enterName: '이름을 입력해 주세요',
  enterEmail: '이메일을 입력해 주세요',
  enterPassword: '비밀번호를 입력해 주세요',
  enterConfirmPassword: '비밀번호를 한 번 더 입력해 주세요',
  enterPhone: '휴대폰 번호를 입력해 주세요',
  searchZipCode: '우편번호를 검색해 주세요',
  search: '검색',
  loading: '로딩 중',
  autoAddress: '주소 검색으로 자동 입력됩니다',
  enterAddressDetail: '상세 주소를 입력해 주세요',
} as const;

export const SignupCard = ({
  className,
  form,
  step,
  isPostcodeReady,
  isSignupPending,
  onFieldChange,
  onAddressSearch,
  onBack,
  onNext,
  onSubmit,
  onBackToLogin,
}: SignupCardProps) => {
  const isFirstStep = step === 1;

  return (
    <form onSubmit={onSubmit} className="w-full">
      <AuthCardShell
        className={className}
        header={
          <div className="flex items-center justify-between">
            <img src={signupLogo} alt={COPY.altSignup} className="size-[5.6rem]" />
            <button type="button" onClick={onBackToLogin} aria-label={COPY.backToLogin}>
              <Icon name="signup-back" className="text-gray-200" size={4.8} rotate={180} />
            </button>
          </div>
        }
        footer={
          <div className="flex flex-col gap-3">
            {isFirstStep ? (
              <AuthActionButton onClick={onNext}>{COPY.next}</AuthActionButton>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <AuthActionButton tone="ghost" onClick={onBack}>
                  {COPY.back}
                </AuthActionButton>
                <AuthActionButton type="submit" disabled={isSignupPending}>
                  {isSignupPending ? COPY.signupPending : COPY.signup}
                </AuthActionButton>
              </div>
            )}

            <AuthActionButton tone="secondary" onClick={onBackToLogin}>
              {COPY.moveToLogin}
            </AuthActionButton>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          <AuthProgressBar step={step} total={2} />

          {isFirstStep ? (
            <div className="flex flex-col gap-5">
              <AuthField
                label={COPY.userId}
                value={form.userid}
                onChange={onFieldChange('userid')}
                placeholder={COPY.enterUserId}
                autoComplete="username"
              />
              <AuthField
                label={COPY.name}
                value={form.username}
                onChange={onFieldChange('username')}
                placeholder={COPY.enterName}
                autoComplete="name"
              />
              <AuthField
                label={COPY.email}
                value={form.email}
                onChange={onFieldChange('email')}
                placeholder={COPY.enterEmail}
                autoComplete="email"
                type="email"
              />
              <AuthField
                label={COPY.password}
                value={form.password}
                onChange={onFieldChange('password')}
                placeholder={COPY.enterPassword}
                autoComplete="new-password"
                type="password"
              />
              <AuthField
                label={COPY.confirmPassword}
                value={form.confirmPassword}
                onChange={onFieldChange('confirmPassword')}
                placeholder={COPY.enterConfirmPassword}
                autoComplete="new-password"
                type="password"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <AuthField
                label={COPY.phone}
                value={form.phone}
                onChange={onFieldChange('phone')}
                placeholder={COPY.enterPhone}
                autoComplete="tel"
              />

              <label className="flex flex-col gap-2">
                <span className="font-['Pretendard',sans-serif] text-[1.25rem] font-semibold text-[#2B2B2B]">
                  {COPY.zipCode}
                </span>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <input
                    value={form.zipCode}
                    onChange={onFieldChange('zipCode')}
                    placeholder={COPY.searchZipCode}
                    autoComplete="postal-code"
                    className="h-[4.2rem] rounded-[0.7rem] border border-[#E9E9E9] px-4 font-['Pretendard',sans-serif] text-[1.25rem] text-[#2B2B2B] outline-none transition placeholder:text-[#B7B7B7] focus:border-[#FFC633]"
                    readOnly
                  />
                  <AuthActionButton
                    type="button"
                    tone="ghost"
                    className="h-[4.2rem] px-5"
                    onClick={onAddressSearch}
                    disabled={!isPostcodeReady}
                  >
                    {isPostcodeReady ? COPY.search : COPY.loading}
                  </AuthActionButton>
                </div>
              </label>

              <AuthField
                label={COPY.address}
                value={form.address}
                onChange={onFieldChange('address')}
                placeholder={COPY.autoAddress}
                autoComplete="street-address"
                readOnly
              />
              <AuthField
                label={COPY.addressDetail}
                value={form.addressDetail}
                onChange={onFieldChange('addressDetail')}
                placeholder={COPY.enterAddressDetail}
              />
            </div>
          )}
        </div>
      </AuthCardShell>
    </form>
  );
};
