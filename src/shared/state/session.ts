import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type ServerRole = 'MEMBER' | 'DEALER' | 'BEST' | 'BUSINESS' | 'ADMIN';

const stringStorage = {
  getItem: (key: string, initialValue: string | null) => {
    if (typeof window === 'undefined') return initialValue;
    const value = window.localStorage.getItem(key);
    return value ?? initialValue;
  },
  setItem: (key: string, value: string | null) => {
    if (typeof window === 'undefined') return;
    if (value === null) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};

export const getStoredAccessToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('accessToken');
};

export const getStoredUserRole = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('userRole') as ServerRole | null;
};

export const isOnlinePaymentRole = (role: ServerRole | null) =>
  role === 'MEMBER' || role === 'ADMIN';

export const hasDeliveryFee = (role: ServerRole | null) => role === 'MEMBER';

export const isBusinessOrderRole = (role: ServerRole | null) =>
  role !== null && role !== 'MEMBER';

export const accessTokenAtom = atomWithStorage<string | null>(
  'accessToken',
  null,
  stringStorage,
);
export const userRoleAtom = atomWithStorage<ServerRole | null>(
  'userRole',
  null,
  stringStorage,
);

export const isLoggedInAtom = atom((get) => Boolean(get(accessTokenAtom)));
export const isAdminAtom = atom((get) => get(userRoleAtom) === 'ADMIN');

export const resetSessionAtom = atom(null, (_get, set) => {
  set(accessTokenAtom, null);
  set(userRoleAtom, null);
});
