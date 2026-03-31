import ChatButton from '@components/common/chat-button';
import GlobalSiteToast from '@components/common/global-site-toast';
import LoadingPage from '@components/common/loading-page';
import { ToastProvider } from '@components/common/toast/toast-provider/toast-provider';
import { toastError } from '@components/common/toast/toast';
import AppErrorBoundary from '@components/errors/app-error-boundary';
import ScrollToTop from './ScrollToTop';
import { consumeGlobalAuthErrorToast } from '@apis/telegro/axios-instance';
import queryClient from '@libs/query-client';
import { router } from '@routes/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { Suspense, useEffect, useSyncExternalStore } from 'react';
import { RouterProvider } from 'react-router-dom';

const GlobalSiteToastGate = () => {
  const pathname = useSyncExternalStore(
    router.subscribe,
    () => router.state.location.pathname,
    () => router.state.location.pathname,
  );

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return <GlobalSiteToast />;
};

const GlobalErrorToastGate = () => {
  useEffect(() => {
    const message = consumeGlobalAuthErrorToast();

    if (message) {
      toastError(message);
    }
  }, []);

  return null;
};

const App = () => {
  return (
    <AppErrorBoundary>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingPage noLayout />}>
            <ScrollToTop />
            <RouterProvider router={router} />
          </Suspense>
          <GlobalErrorToastGate />
          <ChatButton />
          <GlobalSiteToastGate />
          <ToastProvider />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </JotaiProvider>
    </AppErrorBoundary>
  );
};

export default App;
