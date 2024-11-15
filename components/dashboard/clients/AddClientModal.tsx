'use client';

import { createClient } from '@/lib/supabase/client';
import { Button, Modal, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { errors } from 'core/consts';
import { memo, useEffect } from 'react';
import { closeModal, useModalStore } from 'store/useModalStore';

interface FormProps {
  name: string;
  contact: string;
  description?: string;
}

const supabase = createClient();

const initialValues = {
  name: '',
  contact: '',
  description: ''
};

export const AddClientModal = memo(() => {
  const isOpen = useModalStore((state) => state.current) === 'ADD_CLIENT';
  const data = useModalStore((state) => state.data);
  const queryClient = useQueryClient();

  const clientId: number | undefined = data?.id;
  const defaultValues: typeof initialValues | undefined = data?.defaultValues;

  const form = useForm<FormProps>({
    mode: 'uncontrolled',
    initialValues
  });

  // if modal is used for edit, set values
  useEffect(() => {
    if (clientId && defaultValues) {
      form.setValues(defaultValues);
    }
  }, [clientId, defaultValues]);

  const handleSubmit = async (values: FormProps) => {
    try {
      if (!clientId) {
        await supabase.from('clients').insert({
          ...values
        });

        // create success
        showNotification({
          message: "Mijoz qo'shildi",
          color: 'green'
        });

        // clear form
        form.reset();
      } else {
        await supabase
          .from('clients')
          .update({
            ...values
          })
          .eq('id', clientId);

        // edit success
        showNotification({
          message: 'Mijoz tahrirlandi',
          color: 'green'
        });
      }

      // close modal
      closeModal();

      // revalidate clients
      queryClient.refetchQueries({
        queryKey: ['clients'],
        exact: true
      });
    } catch (error) {
      // showing error
      showNotification({
        title: 'Xatolik!',
        message: errors[400],
        color: 'red'
      });

      console.error('add client error:', error);
    }
  };

  return (
    <Modal
      radius={'md'}
      opened={isOpen}
      onClose={closeModal}
      title={
        <Title component={'p'} size={'lg'}>
          Mijoz qo'shish
        </Title>
      }
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
        <TextInput
          label="Tel raqami"
          required
          key={form.key('contact')}
          {...form.getInputProps('contact')}
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
