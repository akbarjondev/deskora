'use client';

import { Button, Group, Modal, Text, Title } from '@mantine/core';
import { closeModal, useModalStore } from 'store/useModalStore';

interface Props {
  text: string;
  onConfirm: () => void;
  open?: boolean;
  onClose?: () => void;
}

export const ConfirmModal = ({ open, onClose, text, onConfirm }: Props) => {
  const isOpen = useModalStore((state) => state.current === 'CONFIRM');

  const handleClose = () => {
    closeModal();
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      title={
        <Title component={'p'} size={'lg'}>
          Ma'lumotni o'chirish
        </Title>
      }
      opened={isOpen || !!open}
      onClose={handleClose}
    >
      <Text>{text}</Text>
      <Group mt={'md'}>
        <Button component="button" onClick={handleConfirm} color="dark">
          Ha
        </Button>
        <Button component="button" onClick={handleClose} color="red">
          Yo'q
        </Button>
      </Group>
    </Modal>
  );
};
