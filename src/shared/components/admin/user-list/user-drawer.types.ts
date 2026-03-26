import type { SignUpUserInfoDtoRole as DrawerRole } from '@apis/telegro';

export type CreateCompanyForm = {
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

export type UserDrawerInitialData = {
  userId?: number;
  role: DrawerRole;
  form: CreateCompanyForm;
};

export type StepField = {
  key: keyof CreateCompanyForm;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'tel';
  actionLabel?: string;
};

export type DaumPostcodeData = {
  zonecode: string;
  address: string;
  addressType: 'R' | 'J';
  bname: string;
  buildingName: string;
  apartment: 'Y' | 'N';
};
