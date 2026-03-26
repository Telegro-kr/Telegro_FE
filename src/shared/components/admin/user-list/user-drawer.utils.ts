import type { DaumPostcodeData } from './user-drawer.types';

export const buildRoadAddress = (data: DaumPostcodeData) => {
  if (data.addressType !== 'R') {
    return data.address;
  }

  const extras = [data.bname, data.apartment === 'Y' ? data.buildingName : ''].filter(Boolean);

  return extras.length === 0 ? data.address : `${data.address} (${extras.join(', ')})`;
};

export const getDrawerErrorMessage = (error: unknown, mode: 'create' | 'edit') => {
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

  return mode === 'edit' ? '사용자 정보 수정에 실패했습니다.' : '사용자 등록에 실패했습니다.';
};
