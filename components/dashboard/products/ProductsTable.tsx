'use client';

import { MODAL_TYPES } from '@/core/types';
import { createClient } from '@/lib/supabase/client';
import { ActionIcon, Button, Modal, Popover, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { Tables } from 'core/database.types';
import {
  EllipsisIcon,
  LucideSettings,
  PencilIcon,
  PenIcon,
  TrashIcon
} from 'lucide-react';
import { PropsWithChildren } from 'react';
import { openModal, useModalStore } from 'store/useModalStore';

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
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td maw={100}>
        <Settings id={element.id} />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder withColumnBorders>
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
  );
};

const Settings = ({ id }: PropsWithChildren<{ id: number }>) => {
  const handleOpen = openModal('PRODUCT_SETTINGS', {
    id
  });

  return (
    <Popover position="bottom-end" withArrow>
      <Popover.Target>
        <Button color="dark" variant="transparent" p={0}>
          <EllipsisIcon />
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="flex flex-col gap-2 items-start">
        <Button
          color="dark"
          leftSection={<PencilIcon size={20} />}
          variant="transparent"
          size="sm"
          p={0}
        >
          Tahrirlash
        </Button>
        <Button
          color="red"
          leftSection={<TrashIcon size={20} />}
          variant="transparent"
          size="sm"
          p={0}
        >
          O'chirish
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};

const SettingsModal = () => {
  const { isOpen, id } = useModalStore((state) => ({
    isOpen: state.current === MODAL_TYPES.PRODUCT_SETTINGS,
    id: state.data.id
  }));

  return <Modal opened={isOpen} onClose={close}></Modal>;
};
