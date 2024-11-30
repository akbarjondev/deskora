import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export const getAllOrdersServer = cache(async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from('orders').select(`
      *,
      customers (*),
      order_items (*, products (*))
    `);

  if (error) {
    console.error('Error fetching orders:', error);

    throw error;
  }

  return data;
});

export type OrdersWithCustomerAndOrderItems = Awaited<
  ReturnType<typeof getAllOrdersServer>
>;
