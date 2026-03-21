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

const COPY = {
  signupFail: '\ud68c\uc6d0\uac00\uc785\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.',
  fillRequired: '\uae30\ubcf8 \uc815\ubcf4\ub97c \ubaa8\ub450 \uc785\ub825\ud574 \uc8fc\uc138\uc694.',
  passwordMismatch: '\ube44\ubc00\ubc88\ud638 \ud655\uc778\uc774 \uc77c\uce58\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.',
  searchLoading: '\uc8fc\uc18c \uac80\uc0c9\uc744 \ubd88\ub7ec\uc624\ub294 \uc911\uc785\ub2c8\ub2e4. \uc7a0\uc2dc \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4\ud574 \uc8fc\uc138\uc694.',
  signupDone: '\ud68c\uc6d0\uac00\uc785\uc774 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \ub85c\uadf8\uc778\ud574 \uc8fc\uc138\uc694.',
  altSignup: '\ud68c\uc6d0\uac00\uc785',
  backToLogin: '\ub85c\uadf8\uc778\uc73c\ub85c \ub3cc\uc544\uac00\uae30',
  next: '\ub2e4\uc74c',
  back: '\uc774\uc804',
  signup: '\ud68c\uc6d0\uac00\uc785',
  signupPending: '\uac00\uc785 \uc911...',
  moveToLogin: '\ub85c\uadf8\uc778\uc73c\ub85c \uc774\ub3d9',
  userId: '\uc544\uc774\ub514',
  name: '\uc774\ub984',
  email: '\uc774\uba54\uc77c',
  password: '\ube44\ubc00\ubc88\ud638',
  confirmPassword: '\ube44\ubc00\ubc88\ud638 \ud655\uc778',
  phone: '\ud734\ub300\ud3f0 \ubc88\ud638',
  zipCode: '\uc6b0\ud3b8\ubc88\ud638',
  address: '\uc8fc\uc18c',
  addressDetail: '\uc0c1\uc138 \uc8fc\uc18c',
  enterUserId: '\uc544\uc774\ub514\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694',
  enterName: '\uc774\ub984\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694',
  enterEmail: '\uc774\uba54\uc77c\uc744 \uc785\ub825\ud574 \uc8fc\uc138\uc694',
  enterPassword: '\ube44\ubc00\ubc88\ud638\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694',
  enterConfirmPassword: '\ube44\ubc00\ubc88\ud638\ub97c \ud55c \ubc88 \ub354 \uc785\ub825\ud574 \uc8fc\uc138\uc694',
  enterPhone: '\ud734\ub300\ud3f0 \ubc88\ud638\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694',
  searchZipCode: '\uc6b0\ud3b8\ubc88\ud638\ub97c \uac80\uc0c9\ud574 \uc8fc\uc138\uc694',
  search: '\uac80\uc0c9',
  loading: '\ub85c\ub529 \uc911',
  autoAddress: '\uc8fc\uc18c \uac80\uc0c9\uc73c\ub85c \uc790\ub3d9 \uc785\ub825\ub429\ub2c8\ub2e4',
  enterAddressDetail: '\uc0c1\uc138 \uc8fc\uc18c\ub97c \uc785\ub825\ud574 \uc8fc\uc138\uc694',
} as const;

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

  return COPY.signupFail;
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
      toastError(COPY.fillRequired);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toastError(COPY.passwordMismatch);
      return;
    }

    setStep(2);
  }

  function handleAddressSearch() {
    if (!window.daum?.Postcode) {
      toastError(COPY.searchLoading);
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
      toastError(COPY.passwordMismatch);
      return;
    }

    if (!canSubmit) {
      toastError(COPY.fillRequired);
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

      toastSuccess(COPY.signupDone);
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
            <img src={signupLogo} alt={COPY.altSignup} className="size-[5.6rem]" />
            <button type="button" onClick={onBackToLogin} aria-label={COPY.backToLogin}>
              <Icon name="signup-back" className="text-gray-200" size={4.8} rotate={180} />
            </button>
          </div>
        }
        footer={
          <div className="flex flex-col gap-3">
            {isFirstStep ? (
              <AuthActionButton onClick={handleNext}>{COPY.next}</AuthActionButton>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <AuthActionButton tone="ghost" onClick={() => setStep(1)}>
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
                onChange={updateField('userid')}
                placeholder={COPY.enterUserId}
                autoComplete="username"
              />
              <AuthField
                label={COPY.name}
                value={form.username}
                onChange={updateField('username')}
                placeholder={COPY.enterName}
                autoComplete="name"
              />
              <AuthField
                label={COPY.email}
                value={form.email}
                onChange={updateField('email')}
                placeholder={COPY.enterEmail}
                autoComplete="email"
                type="email"
              />
              <AuthField
                label={COPY.password}
                value={form.password}
                onChange={updateField('password')}
                placeholder={COPY.enterPassword}
                autoComplete="new-password"
                type="password"
              />
              <AuthField
                label={COPY.confirmPassword}
                value={form.confirmPassword}
                onChange={updateField('confirmPassword')}
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
                onChange={updateField('phone')}
                placeholder={COPY.enterPhone}
                autoComplete="tel"
              />

              <label className="flex flex-col gap-2">
                <span className="font-['Pretendard',sans-serif] font-semibold text-[#2B2B2B] text-[1.25rem]">
                  {COPY.zipCode}
                </span>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <input
                    value={form.zipCode}
                    onChange={updateField('zipCode')}
                    placeholder={COPY.searchZipCode}
                    autoComplete="postal-code"
                    className="h-[4.2rem] rounded-[0.7rem] border border-[#E9E9E9] px-4 font-['Pretendard',sans-serif] text-[#2B2B2B] text-[1.25rem] outline-none transition placeholder:text-[#B7B7B7] focus:border-[#FFC633]"
                    readOnly
                  />
                  <AuthActionButton
                    type="button"
                    tone="ghost"
                    className="h-[4.2rem] px-5"
                    onClick={handleAddressSearch}
                    disabled={!isPostcodeReady}
                  >
                    {isPostcodeReady ? COPY.search : COPY.loading}
                  </AuthActionButton>
                </div>
              </label>

              <AuthField
                label={COPY.address}
                value={form.address}
                onChange={updateField('address')}
                placeholder={COPY.autoAddress}
                autoComplete="street-address"
                readOnly
              />
              <AuthField
                label={COPY.addressDetail}
                value={form.addressDetail}
                onChange={updateField('addressDetail')}
                placeholder={COPY.enterAddressDetail}
              />
            </div>
          )}
        </div>
      </AuthCardShell>
    </form>
  );
}
