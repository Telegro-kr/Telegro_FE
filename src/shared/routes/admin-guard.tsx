import { useAtomValue } from 'jotai';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredUserRole, isAdminAtom } from '@state/session';

const AdminGuard = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  const loc = useLocation();
  const storedRole = getStoredUserRole();

  if (!isAdmin && storedRole !== 'ADMIN') {
    return <Navigate to="/forbidden" replace state={{ from: loc }} />;
  }

  return <Outlet />;
};

export default AdminGuard;
