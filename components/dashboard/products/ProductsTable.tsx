'use client';

import { createClient } from '@/lib/supabase/client';
import { Table } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Tables } from 'core/database.types';
import { PropsWithChildren } from 'react';

const supabase = createClient();

export const ProductsTable = ({
  products
}: PropsWithChildren<{
  products: Tables<'products'>[];
}>) => {
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select();

      return data;
    },
    initialData: products
  });

  const rows = (data || []).map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped highlightOnHover withTableBorder withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Mahsulot nomi</Table.Th>
          <Table.Th>Sharh</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
