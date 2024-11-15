'use client';

import { Button } from '@mantine/core';
import { PlusCircle } from 'lucide-react';
import { openModal } from 'store/useModalStore';

export const AddClientButton = () => {
  return (
    <Button
      leftSection={<PlusCircle />}
      onClick={() => {
        openModal('ADD_CLIENT');
      }}
      color="green"
    >
      Mijoz qo'shish
    </Button>
  );
};
