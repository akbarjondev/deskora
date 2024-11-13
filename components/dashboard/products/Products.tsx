'use client';

import { ConfirmModal } from '@/components/dashboard/common/ConfirmModal';
import { AddProductModal } from '@/components/dashboard/products/AddProductModal';
import { SettingsPopover } from '@/components/dashboard/products/SettingsPopover';
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
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Tables } from 'core/database.types';
import { PropsWithChildren, useMemo, useState } from 'react';
import { openModal } from 'store/useModalStore';

type ProductType = Tables<'products'>;
const columnHelper = createColumnHelper<ProductType>();
const defaultData: ProductType[] = [];

const supabase = createClient();

export const Products = ({
  products
}: PropsWithChildren<{
  products: Tables<'products'>[];
}>) => {
  const [opened, { close, open }] = useDisclosure();
  const [itemId, setItemId] = useState<number>();
  const [sorting, setSorting] = useState([
    {
      id: 'id',
      desc: true
    }
  ]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Id'
      }),
      columnHelper.accessor('name', {
        header: 'Mahsulot nomi'
      }),
      columnHelper.accessor('description', {
        header: 'Sharh'
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
              openModal('ADD_PRODUCT', {
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
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select();

      return data;
    },
    initialData: products
  });

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination
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

  return (
    <>
      <Table striped withColumnBorders>
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr>
              {headerGroup.headers.map((header) => (
                <Table.Th
                  className={cn(header.column.getCanSort() && 'cursor-pointer')}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽'
                      }[header.column.getIsSorted() as string] ?? null}
                    </>
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {table.getRowModel().rows.map((row) => (
            <Table.Tr key={row.id}>
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
        >
          {'<'}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
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
