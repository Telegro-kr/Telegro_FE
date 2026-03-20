import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      gcTime: 300_000,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;
