import AuthFlow from '@components/auth/auth-flow';

type LoginOverlayProps = {
  onDismiss: () => void;
};

const COPY = {
  closeOverlay: '\ub85c\uadf8\uc778 \uc624\ubc84\ub808\uc774 \ub2eb\uae30',
} as const;

export const LoginOverlay = ({ onDismiss }: LoginOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={COPY.closeOverlay}
        onClick={onDismiss}
        className="absolute inset-0 bg-black/30"
      />
      <div className="absolute right-0 bottom-0 left-0 flex justify-center px-4 md:left-1/2 md:justify-start md:px-0">
        <AuthFlow className="motion-safe:animate-[login-card-rise_420ms_cubic-bezier(0.2,0.9,0.2,1)_both]" />
      </div>
    </div>
  );
};
