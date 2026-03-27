import type { DeliveryAddress, DeliveryAddressDetailDTO, OrderDetailDTO } from '@apis/telegro';
import { formatNumber } from '@utils/format';
import type { AddressForm, DaumPostcodeData } from './my.types';
import { INITIAL_ADDRESS_FORM } from './my.constants';

export function formatPhoneNumber(value?: string) {
  return value || '-';
}

export function formatPoint(value?: number) {
  return `${formatNumber(value ?? 0)}P`;
}

export function formatOrderDate(value?: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

export function formatOrderPrice(value?: number) {
  if (value === undefined || value === null) return '-';
  return `${formatNumber(value)}`;
}

export function buildRoadAddress(data: DaumPostcodeData) {
  if (data.addressType !== 'R') return data.address;

  const extras = [data.bname, data.apartment === 'Y' ? data.buildingName : ''].filter(Boolean);
  return extras.length ? `${data.address} (${extras.join(', ')})` : data.address;
}

export function getOrderProductName(order: OrderDetailDTO) {
  const firstProductName = order.products?.[0]?.productName?.trim();
  if (!firstProductName) return '상품 정보 없음';

  return (order.products?.length ?? 0) > 1
    ? `${firstProductName} 외 ${(order.products?.length ?? 1) - 1}건`
    : firstProductName;
}

export function getAddressLine(address: DeliveryAddressDetailDTO) {
  return [address.address, address.addressDetail].filter(Boolean).join(' ');
}

export function getDefaultAddress(addresses: DeliveryAddressDetailDTO[]) {
  return addresses.find((address) => address.isDefault) ?? addresses[0];
}

export function getAddressForm(address?: DeliveryAddressDetailDTO): AddressForm {
  if (!address) return INITIAL_ADDRESS_FORM;

  return {
    name: address.name?.trim() ?? '',
    recipientName: address.recipientName?.trim() ?? '',
    phoneNumber: address.phoneNumber?.trim() ?? '',
    zipcode: address.zipcode?.trim() ?? '',
    address: address.address?.trim() ?? '',
    addressDetail: address.addressDetail?.trim() ?? '',
    isDefault: Boolean(address.isDefault),
  };
}

export function toAddressPayload(form: AddressForm): DeliveryAddress {
  return {
    name: form.name.trim(),
    recipientName: form.recipientName.trim(),
    phoneNumber: form.phoneNumber.trim(),
    zipcode: form.zipcode.trim(),
    address: form.address.trim(),
    addressDetail: form.addressDetail.trim(),
  };
}

export function getApiErrorMessage(error: unknown, fallback: string) {
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

  return fallback;
}
