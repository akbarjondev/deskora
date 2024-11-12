'use client';

import { createClient } from '@/lib/supabase/client';
import { Button, Modal, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { errors } from 'core/consts';
import { memo, useEffect, useMemo } from 'react';
import { closeModal, useModalStore } from 'store/useModalStore';

interface FormProps {
  name: string;
  description?: string;
}

const supabase = createClient();

const initialValues = {
  name: '',
  description: ''
};

export const AddProductModal = memo(() => {
  const isOpen = useModalStore((state) => state.current) === 'ADD_PRODUCT';
  const data = useModalStore((state) => state.data);
  const queryClient = useQueryClient();

  const productId: number | undefined = data?.id;
  const defaultValues: typeof initialValues | undefined = data?.defaultValues;

  const form = useForm<FormProps>({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      name: (value) =>
        value.length > 2
          ? null
          : "Mahsulot nomi kamida 2 harfdan iborat bo'lishi kerak"
    }
  });

  // if modal is used for edit, set values
  useEffect(() => {
    if (productId && defaultValues) {
      form.setValues(defaultValues);
    }
  }, [productId, defaultValues]);

  const handleSubmit = async (values: FormProps) => {
    try {
      if (!productId) {
        await supabase.from('products').insert({
          ...values
        });

        // create success
        showNotification({
          message: "Mahsulot qo'shildi",
          color: 'green'
        });
      } else {
        await supabase
          .from('products')
          .update({
            ...values
          })
          .eq('id', productId);

        // edit success
        showNotification({
          message: 'Mahsulot tahrirlandi',
          color: 'green'
        });
      }

      // close modal
      closeModal();

      // revalidate products
      queryClient.refetchQueries({
        queryKey: ['products'],
        exact: true
      });
    } catch (error) {
      // showing error
      showNotification({
        title: 'Xatolik!',
        message: errors[400],
        color: 'red'
      });

      console.error('add product error:', error);
    }
  };

  return (
    <Modal
      radius={'md'}
      opened={isOpen}
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
});
