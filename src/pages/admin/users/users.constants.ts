import type { GetUsersFilteredBy } from '@apis/telegro';

export const PAGE_SIZE = 9;

export const ROLE_FILTER_OPTIONS: Array<{
  label: string;
  value: GetUsersFilteredBy | 'ALL';
}> = [
  { label: '전체', value: 'ALL' },
  { label: 'MEMBER', value: 'MEMBER' },
  { label: 'DEALER', value: 'DEALER' },
  { label: 'BEST', value: 'BEST' },
  { label: 'BUSINESS', value: 'BUSINESS' },
];
