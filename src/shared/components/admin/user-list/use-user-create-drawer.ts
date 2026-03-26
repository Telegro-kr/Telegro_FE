import {
  SignUpUserInfoDtoRole,
  type CompanySignUpDTO,
  type SignUpUserInfoDtoRole as DrawerRole,
  type UserRequestDTO,
  type UserRole,
  useCreateCompany,
  useUpdateUser,
} from '@apis/telegro';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  INITIAL_FORM,
  POSTCODE_SCRIPT_ID,
  POSTCODE_SCRIPT_SRC,
  STEP_FIELDS,
} from './user-drawer.constants';
import { buildRoadAddress, getDrawerErrorMessage } from './user-drawer.utils';
import type {
  CreateCompanyForm,
  DaumPostcodeData,
  UserDrawerInitialData,
} from './user-drawer.types';

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

type UseUserCreateDrawerParams = {
  open: boolean;
  mode: 'create' | 'edit';
  initialData?: UserDrawerInitialData | null;
  onClose: () => void;
};

export const useUserCreateDrawer = ({
  open,
  mode,
  initialData,
  onClose,
}: UseUserCreateDrawerParams) => {
  const queryClient = useQueryClient();
  const createCompanyMutation = useCreateCompany();
  const updateUserMutation = useUpdateUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<DrawerRole>(SignUpUserInfoDtoRole.MEMBER);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const [form, setForm] = useState<CreateCompanyForm>(INITIAL_FORM);

  const isEditMode = mode === 'edit';
  const isSubmitting = createCompanyMutation.isPending || updateUserMutation.isPending;
  const activeStep = useMemo(
    () => STEP_FIELDS.find((item) => item.step === currentStep) ?? STEP_FIELDS[0],
    [currentStep],
  );
  const isLastStep = currentStep === STEP_FIELDS.length;

  const resetDrawer = () => {
    setCurrentStep(1);
    setSelectedRole(SignUpUserInfoDtoRole.MEMBER);
    setEditingUserId(null);
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

    const hasEmptyRequiredField = stepConfig.fields.some((field) => {
      if (isEditMode && field.key === 'password') {
        return false;
      }

      return field.required && !form[field.key].trim();
    });

    if (hasEmptyRequiredField) {
      toastError('모든 필수 항목을 입력해 주세요.');
      return false;
    }

    return true;
  };

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

    try {
      if (isEditMode) {
        if (editingUserId == null) {
          toastError('수정할 사용자 정보를 찾을 수 없습니다.');
          return;
        }

        const payload: UserRequestDTO = {
          user: {
            username: form.username.trim(),
            userId: form.userid.trim(),
            ...(form.password.trim() ? { password: form.password } : {}),
            role: selectedRole as UserRole,
            phone: form.phone.trim(),
            email: form.email.trim(),
            address: form.address.trim(),
            addressDetail: form.addressDetail.trim(),
            zipCode: form.zipCode.trim(),
          },
          company: {
            companyName: form.companyName.trim(),
            managerName: form.managerName.trim(),
            managerPhone: form.managerPhone.trim(),
            companyNumber: form.companyNumber.trim(),
            companyType: form.companyType.trim(),
            companyItem: form.companyItem.trim(),
            companyDescription: form.companyDescription.trim(),
          },
        };

        await updateUserMutation.mutateAsync({ userId: editingUserId, data: payload });
        toastSuccess('사용자 정보가 성공적으로 수정되었습니다.');
      } else {
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

        await createCompanyMutation.mutateAsync({ data: payload });
        toastSuccess('사용자 정보가 성공적으로 등록되었습니다.');
      }

      await queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      resetDrawer();
      onClose();
    } catch (error) {
      toastError(getDrawerErrorMessage(error, mode));
    }
  };

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
      return;
    }

    if (isEditMode && initialData) {
      setCurrentStep(1);
      setEditingUserId(initialData.userId ?? null);
      setSelectedRole(initialData.role);
      setForm(initialData.form);
      return;
    }

    resetDrawer();
  }, [initialData, isEditMode, open]);

  return {
    activeStep,
    currentStep,
    form,
    isEditMode,
    isLastStep,
    isPostcodeReady,
    isSubmitting,
    selectedRole,
    setCurrentStep,
    setSelectedRole,
    handleAddressSearch,
    handleFieldChange,
    handleNextStep,
    handleSubmit,
  };
};
