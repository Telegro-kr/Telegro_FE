import { AuthActionButton, AuthCardShell, AuthField } from '@components/auth/auth-card';
import { SignupCard } from '@components/auth/signup-card';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { useAuth } from '@hooks/use-auth';
import { isLoggedInAtom, type ServerRole } from '@state/session';
import { useAtomValue } from 'jotai';
import { type FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

type LoginCardProps = {
  className?: string;
  onSignupClick?: () => void;
};

type LoginOverlayProps = {
  onDismiss: () => void;
};

type OverlayMode = 'login' | 'signup';

function getDefaultPathByRole(role: ServerRole) {
  return role === 'ADMIN' ? '/admin' : '/';
}

function getErrorMessage(error: unknown) {
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

  return '로그인에 실패했습니다.';
}

export function LoginCard({ className, onSignupClick }: LoginCardProps) {
  const { login, isLoginPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const result = await login({ id, password });
      const state = location.state as LocationState | null;
      const nextPath =
        state?.from?.pathname && state.from.pathname !== '/login'
          ? state.from.pathname
          : getDefaultPathByRole(result.role);

      toastSuccess('로그인되었습니다.');
      navigate(nextPath, { replace: true });
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <AuthCardShell
        className={className}
        title={
          <>
            <span className="title3 text-primary">Telegro</span>에 오신 것을 환영합니다
          </>
        }
        description={
          <>
            편리한 상품 주문과 관리를 위해
            <br />
            로그인해 주세요.
          </>
        }
        footer={
          <div className="flex flex-col items-center gap-1 text-center font-['Pretendard',sans-serif] text-[#5E5E5E] text-[1.35rem] leading-[1.7]">
            <p>
              서비스 이용 시 <span className="underline">이용약관</span>에 동의하고
            </p>
            <p>
              <span className="underline">개인정보 처리방침</span> 내용을 확인한 것으로 간주합니다.
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <AuthField
              label="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력해 주세요"
              autoComplete="username"
            />
            <AuthField
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="current-password"
            />
          </div>

          <div className="flex flex-col gap-3">
            <AuthActionButton type="submit" disabled={isLoginPending}>
              {isLoginPending ? '로그인 중...' : '로그인'}
            </AuthActionButton>
            <AuthActionButton tone="secondary" onClick={onSignupClick}>
              회원가입
            </AuthActionButton>
          </div>
        </div>
      </AuthCardShell>
    </form>
  );
}

export function LoginOverlay({ onDismiss }: LoginOverlayProps) {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const [mode, setMode] = useState<OverlayMode>('login');

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="로그인 오버레이 닫기"
        onClick={onDismiss}
        className="absolute inset-0 bg-black/30"
      />
      <div className="absolute right-0 bottom-0 left-0 flex justify-center px-4 md:left-1/2 md:justify-start md:px-0">
        {mode === 'login' ? (
          <LoginCard
            className="motion-safe:animate-[login-card-rise_420ms_cubic-bezier(0.2,0.9,0.2,1)_both]"
            onSignupClick={() => setMode('signup')}
          />
        ) : (
          <SignupCard onBackToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}
