import type { AddressForm, MenuItem } from './my.types';

export const MENU_ITEMS: MenuItem[] = ['프로필', '주문', '배송지', '로그아웃'];

export const POSTCODE_SCRIPT_ID = 'daum-postcode-script';
export const POSTCODE_SCRIPT_SRC =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

export const INITIAL_ADDRESS_FORM: AddressForm = {
  name: '',
  zipcode: '',
  address: '',
  addressDetail: '',
  isDefault: false,
};
