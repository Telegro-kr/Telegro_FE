import { useEffect, useMemo, useState } from 'react';

import { cn } from '@utils/cn';

import NotificationCard, { type NotificationItem } from './notification-card';

type NotificationDrawerProps = {
  open: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
  onNotificationsChange?: (items: NotificationItem[]) => void;
};

export const DEFAULT_NOTIFICATION_ITEMS: NotificationItem[] = [
  {
    id: 1,
    category: 'notice',
    title: '이용약관 변경 안내',
    description:
      '안녕하세요, Telegro입니다! 개인정보 이용 약관이 변경되어 안내드립니다. 시행일은 2026년 03월 20일부터입니다.',
    timeLabel: '7시간 전',
  },
  {
    id: 2,
    category: 'product',
    title: '주문하신 상품이 결제 완료되었습니다.',
    description: '주문하신 상품 [상품명]이 [2026.03.20]에 발송되었습니다.',
    timeLabel: '2026.03.20',
  },
  {
    id: 3,
    category: 'notice',
    title: '이용약관 변경안내',
    description:
      '안녕하세요, Telegro입니다! 개인정보 이용 약관이 변경되어 안내드립니다. 시행일은 2026년 03월 20일부터입니다.',
    timeLabel: '2026.03.19',
    isRead: true,
  },
  {
    id: 4,
    category: 'product',
    title: '주문하신 상품 배송이 시작되었습니다.',
    description:
      '안녕하세요, Telegro입니다!\n개인정보 이용 약관이 변경되어 안내드립니다.',
    timeLabel: '2026.03.18',
  },
];

const ChevronRightIcon = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 5L16 12L9 19"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const NotificationDrawer = ({
  open,
  onClose,
  notifications,
  onNotificationsChange,
}: NotificationDrawerProps) => {
  const [internalNotifications, setInternalNotifications] = useState<
    NotificationItem[]
  >(DEFAULT_NOTIFICATION_ITEMS);

  const resolvedNotifications = notifications ?? internalNotifications;

  const unreadCount = useMemo(
    () => resolvedNotifications.filter((item) => !item.isRead).length,
    [resolvedNotifications],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const handleNotificationsChange = (nextItems: NotificationItem[]) => {
    if (notifications === undefined) {
      setInternalNotifications(nextItems);
    }

    onNotificationsChange?.(nextItems);
  };

  const handleRemove = (id: number) => {
    handleNotificationsChange(
      resolvedNotifications.filter((item) => item.id !== id),
    );
  };

  return (
    <>
      <button
        type="button"
        aria-label="알림 패널 닫기"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-50 bg-black/10 backdrop-blur-[1px] transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        id="notification-drawer"
        className={cn(
          'fixed top-0 right-0 z-50 h-screen w-[420px] max-w-[92vw] border-l border-[#ECECEC] bg-white shadow-[-24px_0_60px_rgba(0,0,0,0.08)]',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center px-9 pt-9 pb-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-row-center h-14 w-14 cursor-pointer rounded-2xl border border-[#E2E6EA] text-[#A7A7A7] transition hover:bg-[#FAFAFA] hover:text-[#666666]"
              aria-label="알림 닫기"
            >
              <ChevronRightIcon className="h-7 w-7" />
            </button>

            <h2 className="flex-1 text-center text-[20px] font-semibold tracking-[-0.02em] text-[#2B2B2B]">
              알림
            </h2>

            <div className="flex-row-center h-14 w-14 shrink-0" />
          </header>

          <div className="flex-1 overflow-y-auto px-9 pb-10">
            <div className="space-y-5">
              {resolvedNotifications.length > 0 ? (
                resolvedNotifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                  />
                ))
              ) : (
                <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-[#E5E5E5] bg-[#FAFAFA] text-[15px] text-[#888888]">
                  표시할 알림이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NotificationDrawer;
