// src/App.tsx
import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import LoopLoading from '@components/common/loop-loading';
import queryClient from '@libs/query-client';
import { router } from '@routes/router';

export default function App() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoopLoading />}>
          <RouterProvider router={router} />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </JotaiProvider>
  );
}
