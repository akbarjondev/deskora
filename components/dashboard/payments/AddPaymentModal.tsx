'use client';

import { Tables } from '@/core/database.types';
import { formatDate } from '@/core/helpers/formatDate';
import { createClient } from '@/lib/supabase/client';
import { Button, Modal, Textarea, TextInput, Title } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import { revalidateCurrentOrder } from 'app/(dashboard)/orders/[id]/actions';
import { errors } from 'core/consts';
import { memo, useEffect, useState } from 'react';
import { closeModal, useModalStore } from 'store/useModalStore';

type FormProps = Omit<Tables<'payments'>, 'id' | 'created_at'>;

const supabase = createClient();

const initialValues: FormProps = {
  amount: 0,
  order_id: 0,
  description: '',
  payment_date: formatDate(new Date())
};

interface IProps {
  orderId: number | string;
  defaultValues?: typeof initialValues;
}

export const AddPaymentModal = memo(({ orderId }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOpen = useModalStore((state) => state.current) === 'ADD_PAYMENT';
  const data = useModalStore((state) => state.data) as {
    paymentId: number;
    defaultValues?: typeof initialValues;
  };
  const queryClient = useQueryClient();

  const isEditForm = Boolean(data?.paymentId);
  const defaultValues: typeof initialValues | undefined = data?.defaultValues;

  const form = useForm<FormProps>({
    mode: 'uncontrolled',
    initialValues: {
      ...initialValues,
      order_id: Number(orderId)
    },
    validate: {
      amount: (value) => {
        if (value <= 0) {
          return "Summa 0 dan katta bo'lishi kerak";
        }

        return null;
      }
    }
  });

  // if modal is used for edit, set values
  useEffect(() => {
    if (orderId && defaultValues) {
      form.setValues(defaultValues);
    }
  }, [orderId, defaultValues]);

  const handleSubmit = async (values: FormProps) => {
    setIsSubmitting(true);

    const body = {
      ...values,
      order_id: Number(orderId),
      amount: Number(values.amount)
    };

    // get order data
    const { data: orderData, error } = await supabase
      .from('orders')
      .select('total_paid')
      .eq('id', orderId);

    if (error || !orderData.length) {
      showNotification({
        title: 'Xatolik!',
        message: errors[400],
        color: 'red'
      });

      return;
    }

    try {
      if (!isEditForm) {
        const order = orderData[0];

        // create payment then update order remaining debt
        await supabase.from('payments').insert({
          ...body
        });

        // update order total paid
        await supabase
          .from('orders')
          .update({
            total_paid: (order.total_paid || 0) + body.amount
          })
          .eq('id', orderId);

        //revalidate path
        revalidateCurrentOrder(orderId);

        // create success
        showNotification({
          message: "To'lov qo'shildi",
          color: 'green'
        });
      } else {
        // update payment
        await supabase
          .from('payments')
          .update({
            ...body
          })
          .eq('id', orderId);

        // edit success
        showNotification({
          message: "To'lov tahrirlandi",
          color: 'green'
        });
      }

      // close modal
      closeModal();

      // revalidate clients
      queryClient.refetchQueries({
        queryKey: ['order-payments', orderId],
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
          {isEditForm ? "To'lovni tahrirlash" : "To'lov qo'shish"}
        </Title>
      }
    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        <TextInput
          label="Summa"
          min={0}
          required
          type="number"
          key={form.key('amount')}
          {...form.getInputProps('amount')}
        />
        <TextInput
          required
          className="hidden"
          key={form.key('order_id')}
          {...form.getInputProps('order_id')}
        />
        <DateTimePicker
          clearable
          required
          label="To'lov sanasi"
          placeholder="Sanani tanlang"
          highlightToday
          valueFormat="DD.MM.YYYY HH:mm"
          value={new Date()}
          onChange={(value) => {
            form.setFieldValue('payment_date', formatDate(value));
          }}
        />
        <Textarea
          label="Izoh"
          key={form.key('description')}
          {...form.getInputProps('description')}
        />

        <Button
          loading={isSubmitting}
          disabled={isSubmitting}
          color="blue"
          type="submit"
        >
          {isEditForm ? 'Tahrirlash' : "Qo'shish"}
        </Button>
      </form>
    </Modal>
  );
});
