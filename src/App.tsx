import LoadingPage from '@components/common/loading-page';
import AppErrorBoundary from '@components/errors/app-error-boundary';
import { ToastProvider } from '@components/common/toast/toast-provider/toast-provider';
import queryClient from '@libs/query-client';
import { router } from '@routes/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider as JotaiProvider } from 'jotai';
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';

const App = () => {
  return (
    <AppErrorBoundary>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoadingPage noLayout />}>
            <RouterProvider router={router} />
          </Suspense>
          <ToastProvider />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </JotaiProvider>
    </AppErrorBoundary>
  );
};

export default App;
