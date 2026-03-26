import { SignUpUserInfoDtoRole } from '@apis/telegro';
import type { UserRow } from '@components/admin/user-list/user-list-table';
import type {
  CreateCompanyForm,
  UserDrawerInitialData,
} from '@components/admin/user-list/user-drawer.types';

export const EMPTY_FORM: CreateCompanyForm = {
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

const ROLE_MAP = {
  MEMBER: SignUpUserInfoDtoRole.MEMBER,
  DEALER: SignUpUserInfoDtoRole.DEALER,
  BEST: SignUpUserInfoDtoRole.BEST,
  BUSINESS: SignUpUserInfoDtoRole.BUSINESS,
  ADMIN: SignUpUserInfoDtoRole.ADMIN,
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getString = (value: unknown) => (typeof value === 'string' ? value : '');

export const toRole = (value: unknown) =>
  typeof value === 'string' && value in ROLE_MAP
    ? ROLE_MAP[value as keyof typeof ROLE_MAP]
    : SignUpUserInfoDtoRole.MEMBER;

export const buildInitialDataFromUser = (user: UserRow): UserDrawerInitialData => ({
  userId: user.id,
  role: toRole(user.role),
  form: {
    ...EMPTY_FORM,
    username: user.name === '-' ? '' : user.name,
    userid: user.userId === '-' ? '' : user.userId,
    phone: user.phone === '-' ? '' : user.phone,
    email: user.email === '-' ? '' : user.email,
  },
});

export const mergeUserDetail = (
  base: UserDrawerInitialData,
  rawData: unknown,
): UserDrawerInitialData => {
  if (!isRecord(rawData)) {
    return base;
  }

  const rawUser = isRecord(rawData.user)
    ? rawData.user
    : isRecord(rawData.data)
      ? rawData.data
      : rawData;
  const rawCompany = isRecord(rawData.company)
    ? rawData.company
    : isRecord(rawUser.company)
      ? rawUser.company
      : {};

  return {
    userId:
      typeof rawUser.id === 'number'
        ? rawUser.id
        : typeof rawData.id === 'number'
          ? rawData.id
          : base.userId,
    role: toRole(rawUser.role ?? rawData.role ?? base.role),
    form: {
      ...base.form,
      username: getString(rawUser.username ?? rawUser.userName) || base.form.username,
      userid: getString(rawUser.userId ?? rawUser.userid) || base.form.userid,
      phone: getString(rawUser.phone) || base.form.phone,
      email: getString(rawUser.email) || base.form.email,
      address: getString(rawUser.address) || base.form.address,
      addressDetail: getString(rawUser.addressDetail) || base.form.addressDetail,
      zipCode: getString(rawUser.zipCode) || base.form.zipCode,
      companyName:
        getString(rawCompany.companyName ?? rawData.companyName) || base.form.companyName,
      managerName:
        getString(rawCompany.managerName ?? rawData.managerName) || base.form.managerName,
      managerPhone:
        getString(rawCompany.managerPhone ?? rawData.managerPhone) || base.form.managerPhone,
      companyNumber:
        getString(rawCompany.companyNumber ?? rawData.companyNumber) || base.form.companyNumber,
      companyType:
        getString(rawCompany.companyType ?? rawData.companyType) || base.form.companyType,
      companyItem:
        getString(rawCompany.companyItem ?? rawData.companyItem) || base.form.companyItem,
      companyDescription:
        getString(rawCompany.companyDescription ?? rawData.companyDescription) ||
        base.form.companyDescription,
    },
  };
};
