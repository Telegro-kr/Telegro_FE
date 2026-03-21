import {
  AuthActionButton,
  AuthCardShell,
  AuthField,
  AuthProgressBar,
} from '@components/auth/auth-card';
import Icon from '@components/common/icon';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useAuth } from '@hooks/use-auth';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import signupLogo from '/signup-logo.svg';

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

type DaumPostcodeData = {
  zonecode: string;
  address: string;
  addressType: 'R' | 'J';
  bname: string;
  buildingName: string;
  apartment: 'Y' | 'N';
};

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

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

const POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const POSTCODE_SCRIPT_SRC = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

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

function buildRoadAddress(data: DaumPostcodeData) {
  if (data.addressType !== 'R') {
    return data.address;
  }

  const extras = [data.bname, data.apartment === 'Y' ? data.buildingName : ''].filter(Boolean);

  if (extras.length === 0) {
    return data.address;
  }

  return `${data.address} (${extras.join(', ')})`;
}

export function SignupCard({ onBackToLogin }: SignupCardProps) {
  const { signup, isSignupPending } = useAuth();
  const [step, setStep] = useState(1);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);

  const isFirstStep = step === 1;

  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsPostcodeReady(true);
      return;
    }

    const existingScript = document.getElementById(POSTCODE_SCRIPT_ID) as HTMLScriptElement | null;

    const handleLoad = () => setIsPostcodeReady(true);

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true });
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const script = document.createElement('script');
    script.id = POSTCODE_SCRIPT_ID;
    script.src = POSTCODE_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', handleLoad, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener('load', handleLoad);
  }, []);

  const updateField = (key: keyof SignupForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const firstStepValid =
    form.userid.trim() &&
    form.username.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.confirmPassword.trim();

  const secondStepValid =
    form.phone.trim() && form.zipCode.trim() && form.address.trim() && form.addressDetail.trim();

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

  function handleAddressSearch() {
    if (!window.daum?.Postcode) {
      toastError('주소 검색을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((prev) => ({
          ...prev,
          zipCode: data.zonecode,
          address: buildRoadAddress(data),
        }));
      },
    }).open();
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
        header={
          <div className="flex items-center justify-between">
            <img src={signupLogo} alt="회원가입" className="size-[5.6rem]" />
            <button type="button" onClick={onBackToLogin} aria-label="로그인으로 돌아가기">
              <Icon name="signup-back" className="text-gray-200" size={4.8} rotate={180} />
            </button>
          </div>
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
              <AuthField
                label="비밀번호 확인"
                value={form.confirmPassword}
                onChange={updateField('confirmPassword')}
                placeholder="비밀번호를 한 번 더 입력해 주세요"
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

              <label className="flex flex-col gap-2">
                <span className="font-['Pretendard',sans-serif] font-semibold text-[#2B2B2B] text-[1.25rem]">
                  우편번호
                </span>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <input
                    value={form.zipCode}
                    onChange={updateField('zipCode')}
                    placeholder="우편번호를 검색해 주세요"
                    autoComplete="postal-code"
                    className="h-[4.2rem] rounded-[0.7rem] border border-[#E9E9E9] px-4 font-['Pretendard',sans-serif] text-[#2B2B2B] text-[1.25rem] outline-none transition placeholder:text-[#B7B7B7] focus:border-[#FFC633]"
                    readOnly
                  />
                  <AuthActionButton
                    type="button"
                    tone="ghost"
                    className="px-5"
                    onClick={handleAddressSearch}
                    disabled={!isPostcodeReady}
                  >
                    {isPostcodeReady ? '검색' : '로딩 중'}
                  </AuthActionButton>
                </div>
              </label>

              <AuthField
                label="주소"
                value={form.address}
                onChange={updateField('address')}
                placeholder="주소 검색으로 자동 입력됩니다"
                autoComplete="street-address"
                readOnly
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
