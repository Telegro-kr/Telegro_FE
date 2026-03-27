import {
  AuthActionButton,
  AuthCardShell,
  AuthField,
} from '@components/auth/auth-card';
import { type FormEvent } from 'react';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';

type LoginCardProps = {
  className?: string;
  id: string;
  password: string;
  isPending: boolean;
  onIdChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSignupClick: () => void;
  onClose?: () => void;
};

const COPY = {
  titleSuffix: '에 오신것을 환영합니다.',
  descriptionLine1: '편리한 상품 주문 및 관리를 위해',
  descriptionLine2: '로그인을 해주세요!',
  termsLine1: '서비스 이용 시',
  termsLine2: '동의하고 확인한 것으로 간주합니다',
  termsService: '이용약관',
  termsPrivacy: '개인정보 처리방침',
  id: '아이디',
  password: '비밀번호',
  idPlaceholder: '아이디를 입력해 주세요',
  passwordPlaceholder: '비밀번호를 입력해 주세요',
  login: '로그인',
  loginPending: '로그인 중...',
  signup: '회원가입',
  guestOrderLookup: '비회원으로 주문 조회하기',
} as const;

export const LoginCard = ({
  className,
  id,
  password,
  isPending,
  onIdChange,
  onPasswordChange,
  onSubmit,
  onSignupClick,
  onClose,
}: LoginCardProps) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <AuthCardShell
        className={className}
        topAction={
          onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="로그인 폼 닫기"
              className="inline-flex h-[3.6rem] w-[3.6rem] cursor-pointer items-center justify-center rounded-full text-[#666666] transition hover:bg-[#F5F5F5] hover:text-[#121212]"
            >
              <IoClose size={24} />
            </button>
          ) : null
        }
        title={
          <>
            <span className="title3 text-primary">Telegro</span>{' '}
            {COPY.titleSuffix}
          </>
        }
        description={
          <>
            {COPY.descriptionLine1}
            <br />
            {COPY.descriptionLine2}
          </>
        }
        footer={
          <div className="flex-col-center caption5 gap-1 text-center whitespace-nowrap text-gray-500">
            <p>
              {COPY.termsLine1}{' '}
              <span className="underline">{COPY.termsService}</span>에
            </p>
            <p>
              <span className="underline">{COPY.termsPrivacy}</span>{' '}
              {COPY.termsLine2}
            </p>
          </div>
        }
      >
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-5">
            <AuthField
              label={COPY.id}
              value={id}
              onChange={(event) => onIdChange(event.target.value)}
              placeholder={COPY.idPlaceholder}
              autoComplete="username"
            />
            <AuthField
              label={COPY.password}
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              type="password"
              placeholder={COPY.passwordPlaceholder}
              autoComplete="current-password"
            />
          </div>

          <div className="flex flex-col gap-3">
            <AuthActionButton type="submit" disabled={isPending}>
              {isPending ? COPY.loginPending : COPY.login}
            </AuthActionButton>
            <AuthActionButton tone="secondary" onClick={onSignupClick}>
              {COPY.signup}
            </AuthActionButton>
            <Link
              to="/guest/orders"
              className="text-center font-['Pretendard',sans-serif] text-[1.35rem] font-medium text-[#666666] underline underline-offset-2 transition-colors hover:text-[#121212]"
            >
              {COPY.guestOrderLookup}
            </Link>
          </div>
        </div>
      </AuthCardShell>
    </form>
  );
};
