import { useAtomValue } from 'jotai';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAdminAtom } from '@state/session';

export default function AdminGuard() {
  const isAdmin = useAtomValue(isAdminAtom);
  const loc = useLocation();
  if (!isAdmin)
    return <Navigate to="/forbidden" replace state={{ from: loc }} />;
  return <Outlet />;
}
