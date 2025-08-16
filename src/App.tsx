import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClientProvider } from '@tanstack/react-query';

import LoopLoading from '@/shared/components/common/loop-loading';
import queryClient from '@/shared/libs/query-client';
import { router } from '@/shared/routes/router';
import { store, persistor } from '@/shared/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<LoopLoading />}>
            <RouterProvider router={router} />
          </Suspense>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
