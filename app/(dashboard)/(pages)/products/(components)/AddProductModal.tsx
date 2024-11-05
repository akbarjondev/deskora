'use client';

import { createClient } from '@/lib/supabase/client';
import { Button, Modal, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { errors } from 'core/consts';
import { closeModal, useModalStore } from 'store/useModalStore';

interface FormProps {
  name: string;
  description?: string;
}

const supabase = createClient();

export const AddProductModal = () => {
  const opened = useModalStore((state) => state.current) === 'ADD_PRODUCT';

  const form = useForm<FormProps>({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      description: ''
    },
    validate: {
      name: (value) =>
        value.length > 2
          ? null
          : "Mahsulot nomi kamida 2 harfdan iborat bo'lishi kerak"
    }
  });

  const handleSubmit = async (values: FormProps) => {
    const { status } = await supabase.from('products').insert({
      ...values
    });

    // success
    // if(status)

    // showing error
    if (status !== 200) {
      showNotification({
        title: 'Xatolik!',
        message: errors[status],
        color: 'red'
      });
    }
  };

  return (
    <Modal
      radius={'md'}
      opened={opened}
      onClose={closeModal}
      title="Mahsulot qo'shish"
    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <TextInput
          label="Nomi"
          required
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Sharh yozing (ixtiyoriy)"
          key={form.key('description')}
          {...form.getInputProps('description')}
        />

        <Button type="submit">Qo'shish</Button>
      </form>
    </Modal>
  );
};
