import React, { useEffect, useState } from 'react';
import Icon from '@components/common/icon';
import { cn } from '@utils/cn';

export type ToastVariant = 'success' | 'error';

type ToastItemProps = {
  variant: ToastVariant;
  message: string;
  visible: boolean;
  onClose: () => void;
};

const srOnly =
  'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]';

const VARIANT_STYLES: Record<
  ToastVariant,
  {
    iconColor: string;
    iconName: 'toast-success' | 'toast-error';
  }
> = {
  success: {
    iconColor: 'text-white',
    iconName: 'toast-success',
  },
  error: {
    iconColor: 'text-gray-900',
    iconName: 'toast-error',
  },
};

const ToastItem = ({ variant, message, visible, onClose }: ToastItemProps) => {
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      return;
    }

    const t = window.setTimeout(() => setShouldRender(false), 160);
    return () => window.clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, onClose]);

  if (!shouldRender) return null;

  const { iconColor, iconName } = VARIANT_STYLES[variant];

  return (
    <div
      className={cn(
        'max-w-[35rem] rounded-sm bg-gray-600 px-[2rem] py-[1rem]',
        'inline-flex flex-col items-start justify-start gap-2.5',
        'transition-all duration-150',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0',
      )}
      role="status"
      aria-live="polite"
    >
      <div className="inline-flex items-center justify-start gap-3 self-stretch">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
            iconColor,
          )}
        >
          <Icon name={iconName} className="h-8 w-8" />
        </div>

        <p className="flex-1 text-[1.6rem] font-semibold break-words text-gray-100">
          {message}
        </p>
      </div>

      <button type="button" onClick={onClose} className={srOnly}>
        닫기
      </button>
    </div>
  );
};

export default ToastItem;
