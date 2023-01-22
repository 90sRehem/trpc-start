import { PropsWithChildren, useState } from 'react'
import { trpc } from "./lib/trpc"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

const client = new QueryClient();

export function Provider({ children }: PropsWithChildren) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3333/api',
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  )
}