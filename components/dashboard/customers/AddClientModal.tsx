'use client';

import { Tables } from '@/core/database.types';
import { createClient } from '@/lib/supabase/client';
import { Button, Modal, Textarea, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { errors } from 'core/consts';
import { memo, useEffect, useState } from 'react';
import { closeModal, useModalStore } from 'store/useModalStore';

type FormProps = Omit<Tables<'customers'>, 'id'>;

const supabase = createClient();

const initialValues: Partial<FormProps> = {
  name: '',
  phone: '',
  address: ''
};

export const AddClientModal = memo(() => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOpen = useModalStore((state) => state.current) === 'ADD_CLIENT';
  const data = useModalStore((state) => state.data);
  const queryClient = useQueryClient();

  const clientId: number | undefined = data?.id;
  const isEditForm = Boolean(clientId);
  const defaultValues: typeof initialValues | undefined = data?.defaultValues;

  const form = useForm<Partial<FormProps>>({
    mode: 'uncontrolled',
    initialValues
  });

  // if modal is used for edit, set values
  useEffect(() => {
    if (clientId && defaultValues) {
      form.setValues(defaultValues);
    }
  }, [clientId, defaultValues]);

  const showError = ({ message }: { message: string }) => {
    showNotification({
      title: 'Xatolik!',
      message,
      color: 'red'
    });
  };

  const handleSubmit = async (values: Partial<FormProps>) => {
    setIsSubmitting(true);

    try {
      if (!clientId) {
        const res = await supabase.from('customers').insert({
          ...values
        });

        // Errors like 409: Conflict
        if (res.error) {
          showError({
            message: errors[res.status]
          });
          return;
        }

        // create success
        showNotification({
          message: "Mijoz qo'shildi",
          color: 'green'
        });
      } else {
        const res = await supabase
          .from('customers')
          .update({
            address: values.address,
            name: values.name,
            phone: values.phone
          })
          .eq('id', clientId);

        // Errors like 409: Conflict
        if (res.error) {
          showError({
            message: errors[res.status]
          });
          return;
        }

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
        queryKey: ['customers'],
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
    } finally {
      form.reset();
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      radius={'md'}
      opened={isOpen}
      onClose={closeModal}
      title={
        <Title component={'p'} order={3}>
          {isEditForm ? 'Mijozni tahrirlash' : "Yangi mijoz qo'shish"}
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
          key={form.key('phone')}
          {...form.getInputProps('phone')}
        />
        <Textarea
          label="Manzil (ixtiyoriy)"
          key={form.key('address')}
          {...form.getInputProps('address')}
        />

        <Button disabled={isSubmitting} loading={isSubmitting} type="submit">
          {isEditForm ? 'Tahrirlash' : "Qo'shish"}
        </Button>
      </form>
    </Modal>
  );
});
