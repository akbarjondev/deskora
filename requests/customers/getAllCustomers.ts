import { createClient } from '@/lib/supabase/client';

interface IGetAllCustomers {
  search?: string;
}

export const getAllCustomers = async (props?: IGetAllCustomers) => {
  const supabase = createClient();

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
};
