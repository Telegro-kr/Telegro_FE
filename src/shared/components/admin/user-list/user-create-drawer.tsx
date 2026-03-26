import {
  SignUpUserInfoDtoRole,
  type CompanySignUpDTO,
  type SignUpUserInfoDtoRole as CompanyRole,
  useCreateCompany,
} from '@apis/telegro';
import Icon from '@components/common/icon';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@utils/cn';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import signupLogo from '/signup-logo.svg';

type UserCreateDrawerProps = {
  open: boolean;
  onClose: () => void;
};

type CreateCompanyForm = {
  username: string;
  userid: string;
  password: string;
  companyName: string;
  phone: string;
  email: string;
  managerName: string;
  managerPhone: string;
  companyNumber: string;
  companyType: string;
  companyItem: string;
  address: string;
  zipCode: string;
  addressDetail: string;
  companyDescription: string;
};

type StepField = {
  key: keyof CreateCompanyForm;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel';
  actionLabel?: string;
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

const POSTCODE_SCRIPT_ID = 'daum-postcode-script';
const POSTCODE_SCRIPT_SRC =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

const ROLE_OPTIONS: Array<{ label: string; value: CompanyRole }> = [
  { label: 'Member', value: SignUpUserInfoDtoRole.MEMBER },
  { label: 'Dealer', value: SignUpUserInfoDtoRole.DEALER },
  { label: 'Best', value: SignUpUserInfoDtoRole.BEST },
  { label: 'Business', value: SignUpUserInfoDtoRole.BUSINESS },
  { label: 'Admin', value: SignUpUserInfoDtoRole.ADMIN },
];

const INITIAL_FORM: CreateCompanyForm = {
  username: '',
  userid: '',
  password: '',
  companyName: '',
  phone: '',
  email: '',
  managerName: '',
  managerPhone: '',
  companyNumber: '',
  companyType: '',
  companyItem: '',
  address: '',
  zipCode: '',
  addressDetail: '',
  companyDescription: '',
};

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
        key: 'username',
        label: '회원명',
        placeholder: '회원명을 입력해 주세요.',
        required: true,
      },
      {
        key: 'userid',
        label: '아이디',
        placeholder: '아이디를 입력해 주세요.',
        required: true,
      },
      {
        key: 'password',
        label: '비밀번호',
        placeholder: '비밀번호를 입력해 주세요.',
        required: true,
        type: 'password',
      },
      {
        key: 'companyName',
        label: '상호명',
        placeholder: '상호명을 입력해 주세요.',
        required: true,
      },
    ],
  },
  {
    step: 2,
    title: '연락처 정보',
    fields: [
      {
        key: 'phone',
        label: '전화번호',
        placeholder: '전화번호를 입력해 주세요.',
        required: true,
        type: 'tel',
      },
      {
        key: 'email',
        label: '이메일(세금계산서용)',
        placeholder: '이메일을 입력해 주세요.',
        required: true,
        type: 'email',
      },
      {
        key: 'managerName',
        label: '담당자 이름',
        placeholder: '담당자 이름을 입력해 주세요.',
        required: true,
      },
      {
        key: 'managerPhone',
        label: '담당자 전화번호',
        placeholder: '담당자 전화번호를 입력해 주세요.',
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
        key: 'companyNumber',
        label: '사업자 번호',
        placeholder: '사업자 번호를 입력해 주세요.',
        required: true,
      },
      {
        key: 'companyType',
        label: '업태',
        placeholder: '업태를 입력해 주세요.',
        required: true,
      },
      {
        key: 'companyItem',
        label: '종목',
        placeholder: '종목을 입력해 주세요.',
        required: true,
      },
      {
        key: 'address',
        label: '주소',
        placeholder: '주소를 검색해 주세요.',
        required: true,
        actionLabel: '주소 검색',
      },
      {
        key: 'zipCode',
        label: '우편번호',
        placeholder: '우편번호',
        required: true,
      },
      {
        key: 'addressDetail',
        label: '상세주소',
        placeholder: '상세주소를 입력해 주세요.',
        required: true,
      },
    ],
  },
  {
    step: 4,
    title: '메모',
    fields: [
      {
        key: 'companyDescription',
        label: '메모',
        placeholder: '메모를 입력해 주세요.',
      },
    ],
  },
];

const labelClass =
  "font-['Pretendard',sans-serif] text-[1.25rem] font-semibold text-[#2B2B2B]";

const inputClass =
  "h-[5.6rem] w-full rounded-[1rem] border border-[#E9E9E9] bg-white px-[1.6rem] font-['Pretendard',sans-serif] text-[1.6rem] font-normal text-[#2B2B2B] outline-none transition placeholder:text-[#6D6D6D] focus:border-[#FFC633]";

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'status' in error.response &&
    error.response.status === 409
  ) {
    return '이미 사용 중인 상호명 혹은 ID입니다.';
  }

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

  return '사용자 등록에 실패했습니다.';
};

const buildRoadAddress = (data: DaumPostcodeData) => {
  if (data.addressType !== 'R') {
    return data.address;
  }

  const extras = [
    data.bname,
    data.apartment === 'Y' ? data.buildingName : '',
  ].filter(Boolean);

  if (extras.length === 0) {
    return data.address;
  }

  return `${data.address} (${extras.join(', ')})`;
};

const UserCreateDrawer = ({ open, onClose }: UserCreateDrawerProps) => {
  const queryClient = useQueryClient();
  const createCompanyMutation = useCreateCompany();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<CompanyRole>(
    SignUpUserInfoDtoRole.MEMBER,
  );
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const [form, setForm] = useState<CreateCompanyForm>(INITIAL_FORM);

  const resetDrawer = () => {
    setCurrentStep(1);
    setSelectedRole(SignUpUserInfoDtoRole.MEMBER);
    setForm(INITIAL_FORM);
  };

  const handleFieldChange =
    (key: keyof CreateCompanyForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const handleAddressSearch = () => {
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
  };

  const validateStep = (step: number) => {
    const stepConfig = STEP_FIELDS.find((item) => item.step === step);

    if (!stepConfig) {
      return true;
    }

    const hasEmptyRequiredField = stepConfig.fields.some(
      (field) => field.required && !form[field.key].trim(),
    );

    if (hasEmptyRequiredField) {
      toastError('모든 필수 항목을 입력해 주세요.');
      return false;
    }

    return true;
  };

  const activeStep = useMemo(
    () => STEP_FIELDS.find((item) => item.step === currentStep) ?? STEP_FIELDS[0],
    [currentStep],
  );

  const isLastStep = currentStep === STEP_FIELDS.length;

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) => Math.min(STEP_FIELDS.length, step + 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    const payload: CompanySignUpDTO = {
      signUpUserInfoDto: {
        userid: form.userid.trim(),
        username: form.username.trim(),
        password: form.password,
        phone: form.phone.trim(),
        email: form.email.trim(),
        role: selectedRole,
        address: form.address.trim(),
        addressDetail: form.addressDetail.trim(),
        zipCode: form.zipCode.trim(),
      },
      company: {
        managerName: form.managerName.trim(),
        managerPhone: form.managerPhone.trim(),
        companyName: form.companyName.trim(),
        companyNumber: form.companyNumber.trim(),
        companyType: form.companyType.trim(),
        companyItem: form.companyItem.trim(),
        companyDescription: form.companyDescription.trim(),
      },
    };

    try {
      await createCompanyMutation.mutateAsync({ data: payload });
      await queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toastSuccess('사용자 정보가 성공적으로 등록되었습니다.');
      resetDrawer();
      onClose();
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsPostcodeReady(true);
      return;
    }

    const existingScript = document.getElementById(
      POSTCODE_SCRIPT_ID,
    ) as HTMLScriptElement | null;
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
      resetDrawer();
    }
  }, [open]);

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
                            placeholder={field.placeholder}
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
              disabled={createCompanyMutation.isPending}
              className="flex-1 rounded-[0.8rem] border border-[#F2F2F7] bg-[#FFC633] px-[2.4rem] py-[1.4rem] font-['Pretendard',sans-serif] text-[1.8rem] font-bold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLastStep
                ? createCompanyMutation.isPending
                  ? '등록 중...'
                  : '등록'
                : '다음'}
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
};

export default UserCreateDrawer;
