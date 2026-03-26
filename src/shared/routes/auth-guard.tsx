import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toastError } from '@components/common/toast/toast';
import { getStoredAccessToken, isLoggedInAtom } from '@state/session';

const shouldShowLoginToast = (pathname: string) =>
  pathname === '/app/cart' ||
  pathname === '/app/my' ||
  pathname.startsWith('/app/my/');

const AuthRedirect = () => {
  const loc = useLocation();

  useEffect(() => {
    if (shouldShowLoginToast(loc.pathname)) {
      toastError('로그인이 필요합니다.');
    }
  }, [loc.pathname]);

  return <Navigate to="/" replace state={{ from: loc }} />;
};

const AuthGuard = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const hasStoredToken = Boolean(getStoredAccessToken());

  if (!isLoggedIn && !hasStoredToken) {
    return <AuthRedirect />;
  }

  return <Outlet />;
};

export default AuthGuard;
