import { LoginOverlay } from '@components/auth/login-overlay';
import { isLoggedInAtom } from '@state/session';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const linkClass =
  'title6 text-gray-900 cursor-pointer no-underline transition-underline hover:underline';

const secondaryLinkClass =
  'font-[Pretendard,sans-serif] text-[1.4rem] font-medium text-[#666666] transition-colors hover:text-[#121212]';

const PublicHeader = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-[#eee] bg-white px-[3rem] py-[1.6rem]">
        <nav className="flex items-center gap-[3rem] px-[2rem]">
          <h1 className="title3_bold text-primary cursor-default pr-1">
            Telegro
          </h1>
          <Link to="/" className={linkClass}>
            Home
          </Link>
          <Link to="/products" className={linkClass}>
            Product
          </Link>
          <Link to="/notices" className={linkClass}>
            Notice
          </Link>
          <Link to="/app/cart" className={linkClass}>
            Cart
          </Link>
          {isLoggedIn ? (
            <Link to="/app/my" className={linkClass}>
              My
            </Link>
          ) : (
            <div className="ml-auto flex items-center gap-6">
              <Link to="/guest/orders" className={secondaryLinkClass}>
                비회원 주문조회
              </Link>
              <button
                type="button"
                onClick={() => setIsLoginOverlayOpen(true)}
                className={linkClass}
              >
                Login
              </button>
            </div>
          )}
        </nav>
      </header>

      {isLoginOverlayOpen ? (
        <LoginOverlay onDismiss={() => setIsLoginOverlayOpen(false)} />
      ) : null}
    </>
  );
};

export default PublicHeader;
