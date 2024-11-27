'use client';

import {
  currencyOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  ROUTES
} from '@/core/consts';
import { Tables } from '@/core/database.types';
import { TOrderStatus, TPaymentStatus } from '@/core/types';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  ActionIcon,
  Button,
  Fieldset,
  Group,
  Select,
  Text,
  Textarea,
  TextInput,
  Title
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm, UseFormReturnType } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Asterisk, PackagePlus, PlusCircle, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { getAllCustomers } from 'requests/customers/getAllCustomers';

type TProduct = {
  product_id: string;
  quantity: string;
  price: string;
  key: string;
};

type TOrderFormProps = Omit<
  Tables<'orders'>,
  'id' | 'created_at' | 'order_date' | 'updated_at' | 'remaining_debt'
> & {
  status: TOrderStatus;
  payment_status: TPaymentStatus;
  products: TProduct[];
  payment_description?: string;
};

interface IProps {
  className?: string;
}

const supabase = createClient();

export const OrderForm = ({ className }: IProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const form = useForm<TOrderFormProps>({
    mode: 'controlled',
    initialValues: {
      customer_id: 0,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'cash',
      total_price: 0,
      total_paid: 0,
      currency: 'USD',
      delivery_address: '',
      delivery_date: '',
      payment_description: '',
      // Items
      products: []
    },
    validate: {
      customer_id: (value) => value === 0 && 'Mijozni tanlang',
      products: {
        product_id: (value) => value === '0' && 'Mahsulotni tanlang',
        quantity: (value) => value === '0' && 'Soni kiriting',
        price: (value) => value === '0' && 'Narxni kiriting'
      }
    }
  });

  // fetch customers
  // @NOTE: fetch customers from the database is temporary solution
  const { data } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getAllCustomers()
  });

  const customers = useMemo(() => {
    if (!data) return [];

    return data.map((customer) => ({
      value: customer.id.toString(),
      label: customer.name || customer.phone || "Noma'lum"
    }));
  }, [data]);

  const handleSubmit = async (values: TOrderFormProps) => {
    const {
      customer_id,
      status,
      payment_status,
      payment_method,
      total_price,
      total_paid,
      currency,
      delivery_address,
      products,
      payment_description
    } = values;

    try {
      setIsSubmitting(true);

      // first, create order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id,
          status,
          payment_status,
          payment_method,
          total_price,
          total_paid,
          currency,
          delivery_address,
          delivery_date: dayjs(currentDate).format('YYYY-MM-DD')
        })
        .select('*');

      if (orderError || !orderData) {
        throw orderError;
      } else {
        const orderId = orderData[0].id;

        // create payment item
        const { error: paymentError } = await supabase.from('payments').insert({
          order_id: orderId,
          amount: total_paid || 0,
          payment_date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          description: payment_description
        });

        // create order items
        const productsArray = products.map((item) => ({
          order_id: orderId,
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          price_per_unit: Number(item.price)
        }));

        const { error: orderItemError } = await supabase
          .from('order_items')
          .insert(productsArray);

        if (orderItemError || paymentError) {
          console.error('order item error:', orderItemError);

          throw orderItemError || paymentError;
        }

        // show success notification
        showNotification({
          title: 'Muvaffaqiyat!',
          message: 'Buyurtma yaratildi...',
          color: 'green'
        });

        // redirect to orders page
        router.push(ROUTES.orders);
      }
    } catch (error) {
      showNotification({
        title: 'Xatolik!',
        message: 'Buyurtma yaratilmadi...',
        color: 'red'
      });
      console.error('order error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = form
    .getValues()
    .products.map((item, index) => (
      <ProductField key={item.key} item={item} index={index} form={form} />
    ));

  // set total price while quantity or price changes
  const totalPrice = form.getValues().products.reduce((acc, item) => {
    const price = parseFloat(item.price);
    const quantity = parseFloat(item.quantity || '0');

    return acc + price * quantity;
  }, 0);

  useEffect(() => {
    form.setFieldValue('total_price', totalPrice);
  }, [totalPrice]);

  // paid amount
  const totalPaid = Number(form.getValues().total_paid || 0);
  const remainingDebt = totalPrice - totalPaid;

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className={cn('grid grid-cols-2 gap-4', className)}
    >
      <Fieldset
        legend={
          <Title component={'p'} size={'lg'}>
            Mijoz ma'lumotlari
          </Title>
        }
        className="flex flex-col gap-6"
      >
        <Select
          placeholder="Mijoz ismini kiriting"
          label="Mijoz"
          data={customers}
          searchable
          key={form.key('customer_id')}
          {...form.getInputProps('customer_id')}
          nothingFoundMessage="Mijoz topilmadi..."
          required
        />
      </Fieldset>

      <Fieldset
        legend={
          <Title component={'p'} size={'lg'}>
            Mahsulot ma'lumotlari
          </Title>
        }
      >
        {fields.length === 0 && (
          <Text
            c="dimmed"
            ta="center"
            className="border border-dashed rounded-md"
            p="sm"
          >
            Mahsulot qo'shing...
          </Text>
        )}

        <Group mb="md">{fields}</Group>

        <Button
          type="button"
          color="blue"
          onClick={() =>
            form.insertListItem('products', {
              product_id: '0',
              quantity: '1',
              price: '0',
              key: randomId()
            })
          }
          leftSection={<PlusCircle size={20} />}
        >
          Mahsulot qo'shish
        </Button>
      </Fieldset>

      <Fieldset
        legend={
          <Title component={'p'} size={'lg'}>
            To'lov ma'lumotlari
          </Title>
        }
        className="flex flex-col gap-6"
      >
        <div className="flex gap-2">
          <Select
            className="grow"
            placeholder="To'lov usulini tanlang"
            label="To'lov usuli"
            data={paymentMethodOptions}
            key={form.key('payment_method')}
            {...form.getInputProps('payment_method')}
            required
          />

          <Select
            className="grow"
            placeholder="Valyuta"
            label="Valyuta"
            data={currencyOptions}
            key={form.key('currency')}
            {...form.getInputProps('currency')}
          />

          <Select
            className="grow"
            placeholder="To'lov holatini tanlang"
            label="To'lov holati"
            data={paymentStatusOptions}
            key={form.key('payment_status')}
            {...form.getInputProps('payment_status')}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Text c={'dark'} fw={'bold'} mb={4}>
            Jami: {totalPrice} {form.getValues().currency}
          </Text>

          <TextInput
            label="To'lanayotgan summa"
            type="number"
            required
            key={form.key('total_paid')}
            {...form.getInputProps('total_paid')}
            min={0}
            max={totalPrice}
            className="grow"
          />

          {remainingDebt > 0 && (
            <Text c={'red'} fw={'bold'} mb={4}>
              Qarz: {remainingDebt} {form.getValues().currency}
            </Text>
          )}

          {remainingDebt < 0 && (
            <Text c={'green'} fw={'bold'} mb={4}>
              Ortiqcha: {remainingDebt} {form.getValues().currency}
            </Text>
          )}

          <Textarea
            resize="vertical"
            label="To'lov haqida ma'lumot"
            key={form.key('payment_description')}
            {...form.getInputProps('payment_description')}
          />
        </div>
      </Fieldset>

      <Fieldset
        legend={
          <Title component={'p'} size={'lg'}>
            Yetkazib berish ma'lumotlari
          </Title>
        }
        className="flex flex-col gap-6"
      >
        <Textarea
          resize="vertical"
          label="Manzili"
          key={form.key('delivery_address')}
          {...form.getInputProps('delivery_address')}
        />

        <div>
          <Text fw={500} size="sm" className="flex items-center">
            Vaqti
          </Text>
          <DatePicker
            className="border p-1 rounded-md max-w-min"
            allowDeselect
            locale="uz"
            key={form.key('delivery_date')}
            value={currentDate}
            onChange={(date) => {
              if (date) {
                setCurrentDate(date);
              }
            }}
          />
        </div>
      </Fieldset>

      <Button
        leftSection={<PackagePlus size={20} />}
        type="submit"
        color="green"
        mt={20}
        className="max-w-min"
        disabled={isSubmitting}
      >
        Buyurtmani qo'shish
      </Button>
    </form>
  );
};

interface IProductFieldProps {
  item: TProduct;
  index: number;
  form: UseFormReturnType<TOrderFormProps>;
}

const ProductField = ({ item, index, form }: IProductFieldProps) => {
  // fetch products
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*');

      return data;
    }
  });
  const productOptions = useMemo(() => {
    if (!products) return [];

    return products.map((product) => ({
      value: product.id.toString(),
      label: product.name
    }));
  }, [products]);

  const product = products?.find(
    (product) => product.id === Number(item.product_id)
  );

  const freshItem = form.getValues().products[index];

  return (
    <div key={item.key} className="flex flex-nowrap gap-1">
      <div>
        {index === 0 && (
          <Text fw={500} size="sm" className="flex items-center">
            Mahsulot nomi{' '}
            <Asterisk size={11} color="red" className="self-start" />
          </Text>
        )}
        <Select
          placeholder="Mahsulotni tanlang"
          data={productOptions}
          searchable
          key={form.key(`products.${index}.product_id`)}
          {...form.getInputProps(`products.${index}.product_id`)}
          nothingFoundMessage="Mahsulot topilmadi..."
          required
          onChange={(value) => {
            const selectedProduct = products?.find(
              (product) => product.id === Number(value)
            );

            form.setFieldValue(`products.${index}`, {
              ...freshItem,
              product_id: value,
              price: selectedProduct?.price || '0'
            });
          }}
        />
      </div>

      <div>
        {index === 0 && (
          <Text fw={500} size="sm" className="flex items-center">
            Soni
            <Asterisk size={11} color="red" className="self-start" />
          </Text>
        )}
        <TextInput
          required
          key={form.key(`products.${index}.quantity`)}
          {...form.getInputProps(`products.${index}.quantity`)}
          type="number"
          min={1}
        />
      </div>

      <div>
        {index === 0 && (
          <Text fw={500} size="sm">
            Narxi
          </Text>
        )}
        <TextInput
          required
          key={form.key(`products.${index}.price`)}
          {...form.getInputProps(`products.${index}.price`)}
          disabled
          value={product?.price || 0}
        />
      </div>

      <div>
        {index === 0 && (
          <Text fw={500} size="sm">
            Summa
          </Text>
        )}
        <TextInput
          disabled
          value={Number(freshItem.quantity) * parseFloat(freshItem.price)}
        />
      </div>

      <ActionIcon
        color="red"
        onClick={() => form.removeListItem('products', index)}
        h={36}
        w={36}
        p={0}
        className="flex-1 self-end"
      >
        <Trash size="1rem" />
      </ActionIcon>
    </div>
  );
};
