'use client';

import { ConfirmModal } from '@/components/dashboard/common/ConfirmModal';
import { AddProductModal } from '@/components/dashboard/products/AddProductModal';
import { SettingsPopover } from '@/components/dashboard/products/SettingsPopover';
import { createClient } from '@/lib/supabase/client';
import { Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import { Tables } from 'core/database.types';
import { PropsWithChildren, useState } from 'react';
import { openModal } from 'store/useModalStore';

const supabase = createClient();

export const Products = ({
  products
}: PropsWithChildren<{
  products: Tables<'products'>[];
}>) => {
  const [opened, { close, open }] = useDisclosure();
  const [itemId, setItemId] = useState<number>();

  const { data, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select();

      return data;
    },
    initialData: products
  });

  const handleDelete = async (id: number) => {
    try {
      await supabase.from('products').delete().eq('id', id);

      showNotification({
        message: "Ma'lumot o'chirildi.",
        color: 'green'
      });

      close();
      refetch();
    } catch (error) {
      showNotification({
        message: "Ma'lumotni o'chirishda xatolik.",
        color: 'red'
      });
      console.error(error);
    }
  };

  const rows = (data || []).map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td maw={100}>
        <SettingsPopover
          onDelete={() => {
            open();
            setItemId(element.id);
          }}
          onEdit={() => {
            openModal('ADD_PRODUCT', {
              id: element.id,
              defaultValues: {
                ...element
              }
            });
          }}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Id</Table.Th>
            <Table.Th>Mahsulot nomi</Table.Th>
            <Table.Th>Sharh</Table.Th>
            <Table.Th>Sozlamalar</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <ConfirmModal
        open={opened}
        onConfirm={() => {
          if (itemId) handleDelete(itemId);
        }}
        onClose={() => {
          close();
          setItemId(undefined);
        }}
        text="Siz rostdan ma'lumotni o'chirmoqchimisiz?"
      />
    </>
  );
};
