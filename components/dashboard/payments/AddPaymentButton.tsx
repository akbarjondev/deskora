'use client';

import { Button } from '@mantine/core';
import { CircleDollarSign } from 'lucide-react';
import { openModal } from 'store/useModalStore';

export const AddPaymentButton = () => {
  return (
    <Button
      leftSection={<CircleDollarSign size={20} />}
      onClick={() => {
        openModal('ADD_PAYMENT');
      }}
      color="green"
    >
      To'lov qo'shish
    </Button>
  );
};
