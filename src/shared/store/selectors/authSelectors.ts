import { RootState } from '@/shared/store/index';

export const isAdminSelector = (state: RootState) => state.auth.userRole === 'ADMIN';
