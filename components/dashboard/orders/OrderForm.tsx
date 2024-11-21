'use client';

import { Tables } from '@/core/database.types';
import { TOrderStatus, TPaymentStatus } from '@/core/types';
import { Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getAllCustomers } from 'requests/customers/getAllCustomers';

type TProduct = {
  product_id: number;
  quantity: number;
  price: number;
};

type TOrderFormProps = Omit<
  Tables<'orders'>,
  'id' | 'created_at' | 'order_date' | 'updated_at' | 'remaining_debt'
> & {
  status: TOrderStatus;
  payment_status: TPaymentStatus;
  products: TProduct[];
};

export const OrderForm = () => {
  const form = useForm<TOrderFormProps>({
    mode: 'uncontrolled',
    initialValues: {
      customer_id: 0,
      status: 'pending',
      payment_status: 'pending',
      payment_method: 'cash',
      total_price: 0,
      total_paid: 0,
      delivery_address: '',
      delivery_date: '',
      // Items
      products: []
    }
  });

  const [search, setSearch] = useState('');
  const [searchValue] = useDebouncedValue(search, 300);
  // fetch customers
  // @NOTE: fetch customers from the database is temporary solution
  const { data } = useQuery({
    queryKey: ['customers', searchValue],
    queryFn: () => getAllCustomers({ search: searchValue })
  });

  const customers = useMemo(() => {
    if (!data) return [];

    return data.map((customer) => ({
      value: customer.id.toString(),
      label: customer.name || customer.phone || "Noma'lum"
    }));
  }, [data]);

  const handleSubmit = (values: TOrderFormProps) => {};

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Select
        label="Mijoz"
        data={customers}
        searchable
        key={form.key('customer_id')}
        {...form.getInputProps('customer_id')}
        nothingFoundMessage="Mijoz topilmadi..."
        onSearchChange={(value) => setSearch(value)}
        searchValue={search}
      />
    </form>
  );
};
