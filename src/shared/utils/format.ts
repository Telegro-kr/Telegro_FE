const parseNumericValue = (value: number | string | null | undefined): number => {
  if (value === undefined || value === null) {
    return 0;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = value.replace(/[,\s원]/g, '');
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
};

const PHONE_DIGITS_MAX_LENGTH = 11;

export const getPhoneDigits = (value: string | null | undefined): string => {
  return (value ?? '').replace(/\D/g, '').slice(0, PHONE_DIGITS_MAX_LENGTH);
};

export const formatPhoneNumber = (value: string | null | undefined): string => {
  const digits = getPhoneDigits(value);

  if (!digits) return '';

  if (digits.startsWith('02')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) {
      return `${digits.slice(0, 2)}-${digits.slice(2, digits.length - 4)}-${digits.slice(-4)}`;
    }

    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`;
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export const normalizePriceValue = (
  value: number | string | null | undefined,
): number => {
  const parsed = parseNumericValue(value);

  return Number.isInteger(parsed) ? parsed : parsed;
};

// 숫자를 천 단위로 포맷
export const formatNumber = (value: number | string | null | undefined): string => {
  return parseNumericValue(value).toLocaleString('ko-KR');
};

export const formatPrice = (value: number | string | null | undefined): string => {
  return `${formatNumber(normalizePriceValue(value))}원`;
};

// 날짜를 YYYY-MM-DD hh:mm:ss 형태로 포맷
export const formatDate = (input: string | Date | null | undefined): string => {
  if (!input) return '정보 없음';

  const date = new Date(input);
  if (isNaN(date.getTime())) return '유효하지 않은 날짜';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 오늘 날짜를 YYYY-MM-DD 형태로 반환
export const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

export const toKoreanTime = (utcDateString: string): string => {
  const utcDate = new Date(utcDateString);
  if (isNaN(utcDate.getTime())) return '유효하지 않은 날짜';

  return utcDate.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
