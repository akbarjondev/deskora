'use client';

import {
  currencyOptions,
  paymentMethodOptions,
  paymentStatusOptions
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
  TextInput
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm, UseFormReturnType } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { Asterisk, PackagePlus, PlusCircle, Trash } from 'lucide-react';
import { useEffect, useMemo } from 'react';
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
};

interface IProps {
  className?: string;
}

export const OrderForm = ({ className }: IProps) => {
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
      // Items
      products: [
        {
          product_id: '0',
          quantity: '1',
          price: '0',
          key: randomId()
        }
      ]
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

  const handleSubmit = (values: TOrderFormProps) => {
    console.log(values);
  };

  const fields = form
    .getValues()
    .products.map((item, index) => (
      <ProductField key={item.key} item={item} index={index} form={form} />
    ));

  // set total price while quantity or price changes
  const totalPrice = form.getValues().products.reduce((acc, item) => {
    const price = parseFloat(item.price);
    const quantity = parseFloat(item.quantity);

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
        legend="Buyurtmachi ma'lumotlari"
        className="flex flex-col gap-4"
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

      <Fieldset legend="Mahsulot ma'lumotlari">
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

      <Fieldset legend="To'lov ma'lumotlari" className="flex flex-col gap-2">
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

        <div className="flex gap-2">
          <TextInput
            label="Jami summa"
            type="number"
            key={form.key('total_price')}
            {...form.getInputProps('total_price')}
            disabled
            className="grow"
          />

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
        </div>
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
      </Fieldset>

      <Fieldset
        legend="Yetkazib berish ma'lumotlari"
        className="flex flex-col gap-4"
      >
        <Textarea
          resize="vertical"
          label="Yetkazib berish manzili"
          key={form.key('delivery_address')}
          {...form.getInputProps('delivery_address')}
        />

        <div>
          <Text fw={500} size="sm" className="flex items-center">
            Yetkazib berish vaqti
          </Text>
          <DatePicker
            className="border p-1 rounded-md max-w-min"
            allowDeselect
            locale="uz"
            defaultValue={new Date()}
            key={form.key('delivery_date')}
            {...form.getInputProps('delivery_date')}
          />
        </div>
      </Fieldset>

      <Button
        leftSection={<PackagePlus size={20} />}
        type="submit"
        color="green"
        mt={20}
        className="max-w-min"
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

const supabase = createClient();
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
    <div key={item.key} className="flex items-center flex-nowrap gap-1">
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
