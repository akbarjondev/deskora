'use client';

import { Button } from '@mantine/core';
import { PlusCircle } from 'lucide-react';
import { openModal } from 'store/useModalStore';

export const AddProductButton = () => {
  return (
    <Button
      leftSection={<PlusCircle />}
      onClick={() => {
        openModal('ADD_PRODUCT');
      }}
      color="green"
    >
      Mahsulot qo'shish
    </Button>
  );
};
