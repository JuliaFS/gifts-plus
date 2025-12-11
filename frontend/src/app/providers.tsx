"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import React from 'react'; // Import React to use React.ReactNode

// Define the shape of the props explicitly
interface ProvidersProps {
  children: React.ReactNode; 
}

// Destructure children with the defined type
export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
