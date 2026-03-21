import {
  AuthActionButton,
  AuthCardShell,
  AuthField,
  AuthProgressBar,
} from '@components/auth/auth-card';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useAuth } from '@hooks/use-auth';
import { type ChangeEvent, type FormEvent, useState } from 'react';

type SignupForm = {
  userid: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
};

type SignupCardProps = {
  onBackToLogin: () => void;
};

const INITIAL_FORM: SignupForm = {
  userid: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  zipCode: '',
  address: '',
  addressDetail: '',
};

function getErrorMessage(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }

  return '회원가입에 실패했습니다.';
}

export function SignupCard({ onBackToLogin }: SignupCardProps) {
  const { signup, isSignupPending } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);

  const isFirstStep = step === 1;

  const updateField =
    (key: keyof SignupForm) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const firstStepValid =
    form.userid.trim() &&
    form.username.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.confirmPassword.trim();

  const secondStepValid =
    form.phone.trim() &&
    form.zipCode.trim() &&
    form.address.trim() &&
    form.addressDetail.trim();

  const canSubmit = Boolean(firstStepValid && secondStepValid);

  function handleNext() {
    if (!firstStepValid) {
      toastError('기본 정보를 모두 입력해 주세요.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toastError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setStep(2);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toastError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    if (!canSubmit) {
      toastError('회원가입 정보를 모두 입력해 주세요.');
      return;
    }

    try {
      await signup({
        userid: form.userid.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        zipCode: form.zipCode.trim(),
        address: form.address.trim(),
        addressDetail: form.addressDetail.trim(),
      });

      toastSuccess('회원가입이 완료되었습니다. 로그인해 주세요.');
      onBackToLogin();
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <AuthCardShell
        title={
          <>
            <span className="title3 text-primary">Telegro</span> 일반회원 가입
          </>
        }
        footer={
          <div className="flex flex-col gap-3">
            {isFirstStep ? (
              <AuthActionButton onClick={handleNext}>다음</AuthActionButton>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <AuthActionButton tone="ghost" onClick={() => setStep(1)}>
                  이전
                </AuthActionButton>
                <AuthActionButton type="submit" disabled={isSignupPending}>
                  {isSignupPending ? '가입 중...' : '회원가입'}
                </AuthActionButton>
              </div>
            )}

            <AuthActionButton tone="secondary" onClick={onBackToLogin}>
              로그인으로 이동
            </AuthActionButton>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          <AuthProgressBar step={step} total={2} />

          {isFirstStep ? (
            <div className="flex flex-col gap-5">
              <AuthField
                label="아이디"
                value={form.userid}
                onChange={updateField('userid')}
                placeholder="아이디를 입력해 주세요"
                autoComplete="username"
              />
              <AuthField
                label="이름"
                value={form.username}
                onChange={updateField('username')}
                placeholder="이름을 입력해 주세요"
                autoComplete="name"
              />
              <AuthField
                label="이메일"
                value={form.email}
                onChange={updateField('email')}
                placeholder="이메일을 입력해 주세요"
                autoComplete="email"
                type="email"
              />
              <AuthField
                label="비밀번호"
                value={form.password}
                onChange={updateField('password')}
                placeholder="비밀번호를 입력해 주세요"
                autoComplete="new-password"
                type="password"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <AuthField
                label="휴대폰 번호"
                value={form.phone}
                onChange={updateField('phone')}
                placeholder="휴대폰 번호를 입력해 주세요"
                autoComplete="tel"
              />
              <AuthField
                label="우편번호"
                value={form.zipCode}
                onChange={updateField('zipCode')}
                placeholder="우편번호를 입력해 주세요"
                autoComplete="postal-code"
              />
              <AuthField
                label="주소"
                value={form.address}
                onChange={updateField('address')}
                placeholder="주소를 입력해 주세요"
                autoComplete="street-address"
              />
              <AuthField
                label="상세 주소"
                value={form.addressDetail}
                onChange={updateField('addressDetail')}
                placeholder="상세 주소를 입력해 주세요"
              />
            </div>
          )}
        </div>
      </AuthCardShell>
    </form>
  );
}
