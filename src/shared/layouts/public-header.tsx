import { LoginOverlay } from '@components/auth/login-overlay';
import Icon from '@components/common/icon';
import NotificationDrawer, {
  DEFAULT_NOTIFICATION_ITEMS,
} from '@components/notification/notification-drawer';
import type { NotificationItem } from '@components/notification/notification-card';
import { isLoggedInAtom } from '@state/session';
import { useAtomValue } from 'jotai';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const linkClass =
  'title6 cursor-pointer text-gray-900 no-underline transition-underline hover:underline';

const secondaryLinkClass =
  'font-[Pretendard,sans-serif] text-[1.4rem] font-medium text-[#666666] transition-colors hover:text-[#121212]';

const PublicHeader = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const location = useLocation();
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    DEFAULT_NOTIFICATION_ITEMS,
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const handleClosePanels = () => {
    setIsLoginOverlayOpen(false);
    setIsNotificationOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-[#eee] bg-white px-[3rem] py-[1.6rem]">
        <nav className="flex items-center gap-[3rem] px-[2rem]">
          <h1 className="title3_bold text-primary cursor-default pr-1">
            Telegro
          </h1>
          <Link to="/" className={linkClass} onClick={handleClosePanels}>
            Home
          </Link>
          <Link
            to="/products"
            className={linkClass}
            onClick={handleClosePanels}
          >
            상품
          </Link>
          <Link to="/notices" className={linkClass} onClick={handleClosePanels}>
            공지사항
          </Link>
          <Link
            to="/app/cart"
            className={linkClass}
            onClick={handleClosePanels}
          >
            장바구니
          </Link>

          <div className="ml-auto flex items-center gap-6">
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
                <Link to="/guest/orders" className={secondaryLinkClass}>
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
