import { LoginOverlay } from '@components/auth/login-overlay';
import Icon from '@components/common/icon';
import NotificationDrawer, {
  DEFAULT_NOTIFICATION_ITEMS,
} from '@components/notification/notification-drawer';
import type { NotificationItem } from '@components/notification/notification-card';
import { isLoggedInAtom } from '@state/session';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

const linkClass =
  'title6 cursor-pointer text-gray-900 no-underline transition-underline hover:underline';

const secondaryLinkClass =
  'font-[Pretendard,sans-serif] text-[1.4rem] font-medium text-[#666666] transition-colors hover:text-[#121212]';

const brandLinkClass = 'group title3_bold pr-1 no-underline';
const brandTextBaseClass =
  'text-primary transition-opacity duration-300 group-hover:opacity-0';
const brandTextGradientClass =
  'pointer-events-none absolute inset-0 bg-gradient-to-r from-[#FFCF4D] via-[#FFC633] to-[#DFAF1A] bg-clip-text text-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100';

const PublicHeader = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const location = useLocation();
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    DEFAULT_NOTIFICATION_ITEMS,
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleClosePanels = () => {
    setIsLoginOverlayOpen(false);
    setIsNotificationOpen(false);
    setIsMobileMenuOpen(false);
  };

  const notificationButton = (
    <>
      <span className="relative inline-flex cursor-pointer">
        <Icon
          name="alarm"
          size={3}
          ariaHidden={false}
          ariaLabel="Notification"
        />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 inline-flex h-[1.6rem] w-[1.6rem] items-center justify-center rounded-full bg-[#FF4B4E] px-[0.45rem] py-[0.2rem] text-[1rem] leading-none font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : (
          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-[#FF4B4E]" />
        )}
      </span>
    </>
  );

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-[#eee] bg-white px-[3rem] py-[1.6rem] max-[535px]:px-[1.6rem] max-[535px]:pt-[1.2rem] max-[535px]:pb-0">
        <nav className="px-[2rem] max-[535px]:px-0">
          <div className="flex items-center gap-[3rem] max-[535px]:justify-between max-[535px]:gap-[1.2rem]">
            <div className="hidden max-[535px]:flex max-[535px]:items-center max-[535px]:gap-[1.2rem]">
              <button
                type="button"
                aria-label={isMobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="public-mobile-menu"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="rounded-full p-[0.6rem] text-[#121212] transition-colors hover:bg-black/5"
              >
                {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>

              <Link
                to="/"
                className={brandLinkClass}
                onClick={handleClosePanels}
              >
                <span className="relative inline-block">
                  <span className={brandTextBaseClass}>Telegro</span>
                  <span aria-hidden="true" className={brandTextGradientClass}>
                    Telegro
                  </span>
                </span>
              </Link>
            </div>

            <Link
              to="/"
              className={`${brandLinkClass} max-[535px]:hidden`}
              onClick={handleClosePanels}
            >
              <span className="relative inline-block">
                <span className={brandTextBaseClass}>Telegro</span>
                <span aria-hidden="true" className={brandTextGradientClass}>
                  Telegro
                </span>
              </span>
            </Link>

            <Link
              to="/products"
              className={`${linkClass} max-[535px]:hidden`}
              onClick={handleClosePanels}
            >
              상품
            </Link>
            <Link
              to="/notices"
              className={`${linkClass} max-[535px]:hidden`}
              onClick={handleClosePanels}
            >
              공지사항
            </Link>
            {isLoggedIn ? (
              <Link
                to="/app/cart"
                className={`${linkClass} max-[535px]:hidden`}
                onClick={handleClosePanels}
              >
                장바구니
              </Link>
            ) : null}

            <div className="ml-auto flex items-center gap-6 max-[535px]:hidden">
              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    aria-label="알림 보기"
                    aria-expanded={isNotificationOpen}
                    aria-controls="notification-drawer"
                    onClick={() => setIsNotificationOpen(true)}
                    className="place-items-center rounded-full px-2 py-1 transition-colors hover:bg-black/5"
                  >
                    {notificationButton}
                  </button>
                  <Link
                    to="/app/my"
                    className={linkClass}
                    onClick={handleClosePanels}
                  >
                    마이페이지
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/guest/orders"
                    className={secondaryLinkClass}
                    onClick={handleClosePanels}
                  >
                    비회원 주문조회
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsLoginOverlayOpen(true)}
                    className={linkClass}
                  >
                    로그인하기
                  </button>
                </>
              )}
            </div>
          </div>

          <div
            id="public-mobile-menu"
            className={`hidden overflow-hidden transition-all duration-300 ease-out max-[535px]:mt-[1.2rem] max-[535px]:block ${
              isMobileMenuOpen
                ? 'max-[535px]:max-h-[40rem]'
                : 'max-[535px]:max-h-0'
            }`}
          >
            <div className="flex flex-col gap-[0.8rem] border-t border-[#f0f0f0] py-[1.2rem]">
              <Link
                to="/products"
                className={`${linkClass} rounded-[1rem] px-[0.6rem] py-[0.8rem]`}
                onClick={handleClosePanels}
              >
                상품
              </Link>
              <Link
                to="/notices"
                className={`${linkClass} rounded-[1rem] px-[0.6rem] py-[0.8rem]`}
                onClick={handleClosePanels}
              >
                공지사항
              </Link>
              {isLoggedIn ? (
                <Link
                  to="/app/cart"
                  className={`${linkClass} rounded-[1rem] px-[0.6rem] py-[0.8rem]`}
                  onClick={handleClosePanels}
                >
                  장바구니
                </Link>
              ) : null}

              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    aria-label="알림 보기"
                    aria-expanded={isNotificationOpen}
                    aria-controls="notification-drawer"
                    onClick={() => {
                      setIsNotificationOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${linkClass} rounded-[1rem] px-[0.6rem] py-[0.8rem] text-left`}
                  >
                    알림
                  </button>
                  <Link
                    to="/app/my"
                    className={`${linkClass} rounded-[1rem] px-[0.6rem] py-[0.8rem]`}
                    onClick={handleClosePanels}
                  >
                    마이페이지
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/guest/orders"
                    className={`${secondaryLinkClass} rounded-[1rem] px-[0.6rem] py-[0.8rem]`}
                    onClick={handleClosePanels}
                  >
                    비회원 주문조회
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginOverlayOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${linkClass} rounded-[1rem] px-[0.6rem] py-[0.8rem] text-left`}
                  >
                    로그인하기
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {isLoginOverlayOpen ? (
        <LoginOverlay onDismiss={() => setIsLoginOverlayOpen(false)} />
      ) : null}

      {isLoggedIn ? (
        <NotificationDrawer
          key={location.pathname}
          open={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
          onNotificationsChange={setNotifications}
        />
      ) : null}
    </>
  );
};

export default PublicHeader;
