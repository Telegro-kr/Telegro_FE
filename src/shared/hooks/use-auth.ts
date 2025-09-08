import { useSetAtom } from 'jotai';
import { AXIOS_INSTANCE } from '@apis/telegro/axios-instance';
import {
  accessTokenAtom,
  userRoleAtom,
  resetSessionAtom,
  type ServerRole,
} from '@state/session';

type LoginPayload = { id: string; password: string };
type LoginResponse = {
  code: number;
  message: string;
  data: { userRole: ServerRole; accessToken: string };
};

export function useAuth() {
  const setToken = useSetAtom(accessTokenAtom);
  const setRole = useSetAtom(userRoleAtom);
  const reset = useSetAtom(resetSessionAtom);

  const login = async (payload: LoginPayload) => {
    const res = await AXIOS_INSTANCE.post<LoginResponse>(
      '/auth/login',
      payload,
    );
    const token = res.data?.data?.accessToken;
    const role = res.data?.data?.userRole;
    if (!token || !role)
      throw new Error('로그인 응답에 accessToken 또는 userRole이 없습니다.');

    localStorage.setItem('accessToken', token);

    setToken(token);
    setRole(role);
    return { token, role };
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    reset();
  };

  return { login, logout };
}
