import type { DeliveryAddressDetailDTO } from '@apis/telegro';

export type MenuItem = '프로필' | '주문' | '배송지' | '로그아웃';

export type AddressForm = {
  name: string;
  recipientName: string;
  phoneNumber: string;
  zipcode: string;
  address: string;
  addressDetail: string;
  isDefault: boolean;
};

export type AddressModalState =
  | null
  | { mode: 'create' }
  | { mode: 'edit'; address: DeliveryAddressDetailDTO };

export type DaumPostcodeData = {
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
      }) => { open: () => void };
    };
  }
}
