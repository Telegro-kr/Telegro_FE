// 숫자를 천 단위로 포맷 (예: 1000 -> 1,000)
export const formatNumber = (value: number | string | null | undefined): string => {
  return value !== undefined && value !== null ? Number(value).toLocaleString() : '0';
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
