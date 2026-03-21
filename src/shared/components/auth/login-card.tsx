import { toastError } from '@components/common/toast/toast';
import { useAuth } from '@hooks/use-auth';
import { cn } from '@libs/cn';
import { isLoggedInAtom, type ServerRole } from '@state/session';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import loginImage from '/login-logo.svg';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

type LoginCardProps = {
  className?: string;
};

type LoginOverlayProps = {
  onDismiss: () => void;
};

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

export function LoginCard({ className }: LoginCardProps) {
  const { login, isLoginPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const result = await login({ id, password });
      const state = location.state as LocationState | null;
      const nextPath =
        state?.from?.pathname && state.from.pathname !== '/login'
          ? state.from.pathname
          : getDefaultPathByRole(result.role);

      navigate(nextPath, { replace: true });
    } catch (error) {
      toastError(getErrorMessage(error));
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'w-full max-w-[45rem] rounded-t-[2rem] bg-white px-[4.7rem] py-[5rem] shadow-[0_4px_21px_rgba(85,128,20,0.2)]',
        className,
      )}
    >
      <div className="flex-col-center gap-6 sm:gap-8">
        <img
          src={loginImage}
          alt="Telegro"
          className="h-[8.8rem] w-[8.8rem] rounded-[1.6rem] object-cover sm:h-[10.6rem] sm:w-[10.6rem]"
        />

        <div className="flex-col-center w-full gap-4">
          <div className="flex-col-center gap-2 text-center">
            <h1 className="text-[2rem] font-semibold text-gray-900">
              <span className="title3 text-primary">Telegro</span>에 오신것을
              환영합니다.
            </h1>
            <p className="body4 text-gray-700">
              편리한 상품 주문 및 관리를 위해
              <br />
              로그인을 해주세요!
            </p>
          </div>

          <div className="h-px w-full bg-[#E9E9E9]" />
        </div>

        <div className="flex w-full flex-col gap-7">
          <div className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="font-['Pretendard',sans-serif] text-[1.25rem] font-semibold text-[#2B2B2B]">
                아이디
              </span>
              <input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="아이디를 입력해 주세요"
                autoComplete="username"
                className="h-[4.2rem] rounded-[0.7rem] border border-[#E9E9E9] px-4 font-['Pretendard',sans-serif] text-[1.25rem] text-[#2B2B2B] transition outline-none placeholder:text-[#B7B7B7] focus:border-[#FFC633]"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-['Pretendard',sans-serif] text-[1.25rem] font-semibold text-[#2B2B2B]">
                비밀번호
              </span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="비밀번호를 입력해 주세요"
                autoComplete="current-password"
                className="h-[4.2rem] rounded-[0.7rem] border border-[#E9E9E9] px-4 font-['Pretendard',sans-serif] text-[1.25rem] text-[#2B2B2B] transition outline-none placeholder:text-[#B7B7B7] focus:border-[#FFC633]"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoginPending}
              className="h-[4.8rem] rounded-[0.5rem] bg-[#FFC633] font-['Pretendard',sans-serif] text-[1.5rem] font-bold tracking-[-0.01em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoginPending ? '로그인 중...' : '로그인'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="h-[4.8rem] rounded-[0.5rem] bg-[#FFF4D8] font-['Pretendard',sans-serif] text-[1.5rem] font-bold tracking-[-0.01em] text-[#2B2B2B] transition hover:bg-[#FFEAB5]"
            >
              회원가입
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center font-['Pretendard',sans-serif] text-[1.35rem] leading-[1.7] text-[#5E5E5E]">
          <p>
            서비스 가입 시 <span className="underline">이용약관</span> 에
            동의하며
          </p>
          <p>
            <span className="underline">개인정보 처리 방침</span> 의 내용을
            확인한 것으로 간주합니다.
          </p>
        </div>
      </div>
    </form>
  );
}

export function LoginOverlay({ onDismiss }: LoginOverlayProps) {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

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
        <LoginCard className="motion-safe:animate-[login-card-rise_420ms_cubic-bezier(0.2,0.9,0.2,1)_both]" />
      </div>
    </div>
  );
}
