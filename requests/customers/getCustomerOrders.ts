import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export const getCustomerOrders = cache(async (customerId: string) => {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select(`*, order_items (*, products (*)), payments (*)`)
    .eq('customer_id', customerId);

  return orders || [];
});

export type CustomerWithOrderItemsAndPayments = Awaited<
  ReturnType<typeof getCustomerOrders>
>;
