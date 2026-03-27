import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useAuth } from '@hooks/use-auth';
import { type ServerRole } from '@state/session';
import { type FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const COPY = {
  loginFail: '로그인에 실패했습니다.',
  loginDone: '로그인되었습니다.',
} as const;

const getDefaultPathByRole = (role: ServerRole) => {
  return role === 'ADMIN' ? '/admin' : '/';
};

const getNextPathByRole = (role: ServerRole, fromPath?: string) => {
  if (!fromPath || fromPath === '/login') {
    return getDefaultPathByRole(role);
  }

  if (role === 'ADMIN') {
    return fromPath.startsWith('/admin') ? fromPath : '/admin';
  }

  if (fromPath.startsWith('/admin')) {
    return '/';
  }

  return fromPath;
};

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'string'
  ) {
    try {
      const parsed = JSON.parse(error.response.data);

      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'message' in parsed &&
        typeof parsed.message === 'string'
      ) {
        return parsed.message;
      }
    } catch {
      return error.response.data;
    }
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

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim()
  ) {
    return error.message;
  }

  return COPY.loginFail;
};

export const useLoginForm = () => {
  const { login, isLoginPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const result = await login({ id, password });
      const state = location.state as LocationState | null;
      const nextPath = getNextPathByRole(result.role, state?.from?.pathname);

      toastSuccess(COPY.loginDone);
      navigate(nextPath, { replace: true });
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  };

  return {
    id,
    password,
    isLoginPending,
    setId,
    setPassword,
    handleSubmit,
  };
};
