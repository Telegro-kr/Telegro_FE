import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

type Device = 'mobile' | 'tablet' | 'desktop';

function getDevice(width: number): Device {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export const ToastProvider = () => {
  const [device, setDevice] = useState<Device>(() =>
    typeof window === 'undefined' ? 'desktop' : getDevice(window.innerWidth),
  );

  useEffect(() => {
    const onResize = () => setDevice(getDevice(window.innerWidth));
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = device === 'mobile';
  const isDesktop = device === 'desktop';

  return (
    <Toaster
      position={isMobile ? 'bottom-center' : 'top-right'}
      gutter={12}
      toastOptions={{ duration: 2500 }}
      containerStyle={{
        boxSizing: 'border-box',
        zIndex: 80,

        ...(isMobile ? {} : { marginTop: '52px' }),
        ...(isDesktop ? { marginRight: '90px' } : {}),
      }}
    />
  );
};
