import { useAtomValue } from 'jotai';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredAccessToken, isLoggedInAtom } from '@state/session';

const AuthGuard = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const loc = useLocation();
  const hasStoredToken = Boolean(getStoredAccessToken());

  if (!isLoggedIn && !hasStoredToken) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }

  return <Outlet />;
};

export default AuthGuard;
