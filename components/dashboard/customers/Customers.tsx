'use client';

import { ConfirmModal } from '@/components/dashboard/common/ConfirmModal';
import { SettingsPopover } from '@/components/dashboard/common/SettingsPopover';
import { PAGE_SIZE, ROUTES } from '@/core/consts';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Button, Group, Select, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Tables } from 'core/database.types';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { openModal } from 'store/useModalStore';

type ClientType = Tables<'customers'>;
const columnHelper = createColumnHelper<ClientType>();
const defaultData: ClientType[] = [];

const supabase = createClient();

interface Props {
  customers: ClientType[];
}

export const Customers = ({ customers }: Props) => {
  const router = useRouter();
  const [opened, { close, open }] = useDisclosure();
  const [itemId, setItemId] = useState<number>();
  const [sorting, setSorting] = useState([
    {
      id: 'id',
      desc: true
    }
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Id'
      }),
      columnHelper.accessor('name', {
        header: 'Mijoz nomi'
      }),
      columnHelper.accessor('phone', {
        header: 'Tel raqam'
      }),
      columnHelper.accessor('address', {
        header: 'Manzil'
      }),
      columnHelper.display({
        header: 'Sozlama',
        cell: (info) => (
          <SettingsPopover
            onDelete={() => {
              open();
              setItemId(info.row.original.id);
            }}
            onEdit={() => {
              openModal('ADD_CLIENT', {
                id: info.row.original.id,
                defaultValues: {
                  ...info.row.original
                }
              });
            }}
          />
        )
      })
    ],
    []
  );

  const { data, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await supabase.from('customers').select();

      return data;
    },
    initialData: customers
  });

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination
  });

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id);

      if (error) {
        throw error;
      }

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
      console.error('delete client error:', error);
    }
  };

  return (
    <>
      <Table striped withColumnBorders highlightOnHover>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();

                return (
                  <Table.Th
                    key={header.id}
                    className={cn(canSort && 'cursor-pointer')}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {canSort && !sorted && <ArrowUpDown size={16} />}
                      {{
                        asc: <ArrowUp size={16} />,
                        desc: <ArrowDown size={16} />
                      }[sorted as string] ?? null}
                    </span>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr
              key={row.id}
              className="cursor-pointer"
              onClick={() => {
                router.push(ROUTES.singleCustomer(row.original.id));
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Group mt={20} gap={16}>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          leftSection={<ArrowLeft size={16} />}
        >
          Oldingi
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          rightSection={<ArrowRight size={16} />}
        >
          Keyingi
        </Button>
        <Select
          data={['5', '10', '20', '50', '100']}
          value={String(table.getState().pagination.pageSize)}
          onChange={(value) => table.setPageSize(Number(value))}
        />
      </Group>
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
