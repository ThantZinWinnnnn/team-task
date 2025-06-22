"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/store";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          toastOptions={{
            classNames: {
              description: "!text-black",
            },
          }}
        />
      </QueryClientProvider>
    </AppProvider>
  );
}
