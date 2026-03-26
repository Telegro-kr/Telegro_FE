import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toastError } from '@components/common/toast/toast';
import { getStoredUserRole, isAdminAtom } from '@state/session';

const AdminAccessDeniedRedirect = () => {
  const loc = useLocation();

  useEffect(() => {
    toastError('관리자 권한이 없습니다.');
  }, []);

  return <Navigate to="/" replace state={{ from: loc }} />;
};

const AdminGuard = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  const storedRole = getStoredUserRole();

  if (!isAdmin && storedRole !== 'ADMIN') {
    return <AdminAccessDeniedRedirect />;
  }

  return <Outlet />;
};

export default AdminGuard;
