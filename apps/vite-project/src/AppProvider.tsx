import { PropsWithChildren, useState } from 'react'
import { trpc } from "./lib/trpc"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

import reactLogo from './assets/react.svg'
import './App.css'

const client = new QueryClient();


export function Provider({ children }: PropsWithChildren) {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:8080/api',
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