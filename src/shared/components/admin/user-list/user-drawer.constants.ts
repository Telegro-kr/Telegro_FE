import { SignUpUserInfoDtoRole, type SignUpUserInfoDtoRole as DrawerRole } from '@apis/telegro';
import type { CreateCompanyForm, StepField } from './user-drawer.types';

export const POSTCODE_SCRIPT_ID = 'daum-postcode-script';
export const POSTCODE_SCRIPT_SRC =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export const ROLE_OPTIONS: Array<{ label: string; value: DrawerRole }> = [
  { label: 'Member', value: SignUpUserInfoDtoRole.MEMBER },
  { label: 'Dealer', value: SignUpUserInfoDtoRole.DEALER },
  { label: 'Best', value: SignUpUserInfoDtoRole.BEST },
  { label: 'Business', value: SignUpUserInfoDtoRole.BUSINESS },
  { label: 'Admin', value: SignUpUserInfoDtoRole.ADMIN },
];

export const INITIAL_FORM: CreateCompanyForm = {
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

export const STEP_FIELDS: Array<{
  step: number;
  title: string;
  fields: StepField[];
}> = [
  {
    step: 1,
    title: '회원 유형 선택',
    fields: [
      { key: 'username', label: '회원명', placeholder: '회원명을 입력해 주세요.', required: true },
      { key: 'userid', label: '아이디', placeholder: '아이디를 입력해 주세요.', required: true },
      {
        key: 'password',
        label: '비밀번호',
        placeholder: '비밀번호를 입력해 주세요.',
        required: true,
        type: 'password',
      },
      { key: 'companyName', label: '상호명', placeholder: '상호명을 입력해 주세요.', required: true },
    ],
  },
  {
    step: 2,
    title: '연락처 정보',
    fields: [
      { key: 'phone', label: '전화번호', placeholder: '전화번호를 입력해 주세요.', required: true, type: 'tel' },
      {
        key: 'email',
        label: '이메일(세금계산서용)',
        placeholder: '이메일을 입력해 주세요.',
        required: true,
        type: 'email',
      },
      { key: 'managerName', label: '담당자 이름', placeholder: '담당자 이름을 입력해 주세요.', required: true },
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
      { key: 'companyNumber', label: '사업자 번호', placeholder: '사업자 번호를 입력해 주세요.', required: true },
      { key: 'companyType', label: '업태', placeholder: '업태를 입력해 주세요.', required: true },
      { key: 'companyItem', label: '종목', placeholder: '종목을 입력해 주세요.', required: true },
      {
        key: 'address',
        label: '주소',
        placeholder: '주소를 검색해 주세요.',
        required: true,
        actionLabel: '주소 검색',
      },
      { key: 'zipCode', label: '우편번호', placeholder: '우편번호', required: true },
      { key: 'addressDetail', label: '상세주소', placeholder: '상세주소를 입력해 주세요.', required: true },
    ],
  },
  {
    step: 4,
    title: '메모',
    fields: [{ key: 'companyDescription', label: '메모', placeholder: '메모를 입력해 주세요.' }],
  },
];

export const labelClass =
  "font-['Pretendard',sans-serif] text-[1.25rem] font-semibold text-[#2B2B2B]";

export const inputClass =
  "h-[5.6rem] w-full rounded-[1rem] border border-[#E9E9E9] bg-white px-[1.6rem] font-['Pretendard',sans-serif] text-[1.6rem] font-normal text-[#2B2B2B] outline-none transition placeholder:text-[#6D6D6D] focus:border-[#FFC633]";
