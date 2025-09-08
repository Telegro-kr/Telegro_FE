import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type ServerRole = 'MEMBER' | 'DEALER' | 'BEST' | 'BUSINESS' | 'ADMIN';

export const accessTokenAtom = atomWithStorage<string | null>(
  'accessToken',
  null,
);
export const userRoleAtom = atomWithStorage<ServerRole | null>(
  'userRole',
  null,
);

export const isLoggedInAtom = atom((get) => Boolean(get(accessTokenAtom)));
export const isAdminAtom = atom((get) => get(userRoleAtom) === 'ADMIN');

export const resetSessionAtom = atom(null, (_get, set) => {
  set(accessTokenAtom, null);
  set(userRoleAtom, null);
});
