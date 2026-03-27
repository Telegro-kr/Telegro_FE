import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useAuth } from '@hooks/use-auth';
import { formatPhoneNumber } from '@utils/format';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

export type SignupForm = {
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

type UseSignupFormOptions = {
  onSignupSuccess: () => void;
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
  signupFail: '회원가입에 실패했습니다.',
  fillRequired: '기본 정보를 모두 입력해 주세요.',
  passwordMismatch: '비밀번호 확인이 일치하지 않습니다.',
  searchLoading: '주소 검색을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.',
  signupDone: '회원가입이 완료되었습니다. 로그인해 주세요.',
} as const;

const getErrorMessage = (error: unknown) => {
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
};

const buildRoadAddress = (data: DaumPostcodeData) => {
  if (data.addressType !== 'R') {
    return data.address;
  }

  const extras = [data.bname, data.apartment === 'Y' ? data.buildingName : ''].filter(Boolean);

  if (extras.length === 0) {
    return data.address;
  }

  return `${data.address} (${extras.join(', ')})`;
};

export const useSignupForm = ({ onSignupSuccess }: UseSignupFormOptions) => {
  const { signup, isSignupPending } = useAuth();
  const [step, setStep] = useState(1);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const [form, setForm] = useState<SignupForm>(INITIAL_FORM);

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

  const firstStepValid =
    form.userid.trim() &&
    form.username.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.confirmPassword.trim();

  const secondStepValid =
    form.phone.trim() && form.zipCode.trim() && form.address.trim() && form.addressDetail.trim();

  const canSubmit = Boolean(firstStepValid && secondStepValid);

  const handleFieldChange = (key: keyof SignupForm) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === 'phone' ? formatPhoneNumber(event.target.value) : event.target.value,
    }));
  };

  const handleStepNext = () => {
    if (!firstStepValid) {
      toastError(COPY.fillRequired);
      return;
    }

    if (form.password !== form.confirmPassword) {
      toastError(COPY.passwordMismatch);
      return;
    }

    setStep(2);
  };

  const handleStepBack = () => setStep(1);

  const handleAddressSearch = () => {
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
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      setStep(1);
      setForm(INITIAL_FORM);
      onSignupSuccess();
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  };

  return {
    form,
    step,
    isPostcodeReady,
    isSignupPending,
    handleFieldChange,
    handleAddressSearch,
    handleStepBack,
    handleStepNext,
    handleSubmit,
  };
};
