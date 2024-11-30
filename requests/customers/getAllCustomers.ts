import { createClient } from '@/lib/supabase/client';
import { cache } from 'react';

interface IGetAllCustomers {
  search?: string;
}

const supabase = createClient();

export const getAllCustomers = cache(async (props?: IGetAllCustomers) => {
  let query = supabase.from('customers').select('*');

  // Apply conditional search only if 'search' is provided
  if (props?.search) {
    query = query.ilike('name', `%${props.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
});
