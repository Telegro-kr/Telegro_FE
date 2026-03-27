import { LoginOverlay } from '@components/auth/login-overlay';
import { isLoggedInAtom } from '@state/session';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicFooter from './public-footer';
import PublicHeader from './public-header';

const PublicLayout = () => {
  const location = useLocation();
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const [isLoginOverlayDismissed, setIsLoginOverlayDismissed] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      setIsLoginOverlayDismissed(false);
    }
  }, [location.pathname]);

  const shouldShowLoginOverlay =
    !isLoggedIn && location.pathname === '/' && !isLoginOverlayDismissed;
  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-[#121212]">
      <PublicHeader />
      <main className="w-full pt-[8.2rem]">
        <Outlet />
      </main>
      <PublicFooter />
      {shouldShowLoginOverlay ? (
        <LoginOverlay onDismiss={() => setIsLoginOverlayDismissed(true)} />
      ) : null}
    </div>
  );
};

export default PublicLayout;
