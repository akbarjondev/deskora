'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { DatesProvider } from '@mantine/dates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import 'dayjs/locale/uz';

const queryClient = new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DatesProvider
          settings={{
            locale: 'uz',
            firstDayOfWeek: 1,
            weekendDays: [0],
            timezone: 'Asia/Tashkent'
          }}
        >
          {children}
        </DatesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
