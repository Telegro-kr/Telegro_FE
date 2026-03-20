import { useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { telegroInvalidate, useLogin } from '@apis/telegro';
import {
  accessTokenAtom,
  resetSessionAtom,
  type ServerRole,
  userRoleAtom,
} from '@state/session';

type LoginPayload = { id: string; password: string };

export function useAuth() {
  const setToken = useSetAtom(accessTokenAtom);
  const setRole = useSetAtom(userRoleAtom);
  const reset = useSetAtom(resetSessionAtom);
  const queryClient = useQueryClient();
  const loginMutation = useLogin();

  const login = async (payload: LoginPayload) => {
    const response = await loginMutation.mutateAsync({ data: payload });
    const token = response?.data?.accessToken;
    const role = response?.data?.userRole as ServerRole | undefined;

    if (!token || !role) {
      throw new Error('Login response is missing accessToken or userRole.');
    }

    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', role);

    setToken(token);
    setRole(role);

    await telegroInvalidate.authBoundaries(queryClient);

    return { token, role };
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    queryClient.clear();
    reset();
  };

  return {
    login,
    logout,
    isLoginPending: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
