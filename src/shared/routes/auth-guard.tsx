import { useAtomValue } from 'jotai';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedInAtom } from '@state/session';

export default function AuthGuard() {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const loc = useLocation();
  if (!isLoggedIn)
    return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}
