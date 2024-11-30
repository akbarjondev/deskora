import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export const getSingleOrder = cache(
  async ({ orderId, query }: { orderId: string; query?: string }) => {
    const supabase = await createClient();

    const { data: orders } = await supabase
      .from('orders')
      .select(query)
      .eq('id', orderId);

    return orders ? orders[0] : null;
  }
);
