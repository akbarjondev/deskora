'use client';

import { ROUTES } from '@/core/consts';
import { Button } from '@mantine/core';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export const AddOrderButton = () => {
  return (
    <Button
      leftSection={<PlusCircle />}
      color="green"
      component={Link}
      href={ROUTES.newOrder}
    >
      Buyurtma qo'shish
    </Button>
  );
};
