'use client';

import { PAGE_SIZE } from '@/core/consts';
import { formatDate } from '@/core/helpers/formatDate';
import { formatPrice } from '@/core/helpers/formatPrice';
import { TCurrency } from '@/core/types';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Button, Group, Select, Table } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown
} from 'lucide-react';
import { cache, useState } from 'react';
import {
  TSingleOrderPayment,
  TSingleOrderPayments
} from 'requests/orders/getSingleOrderPayments';

interface IProps {
  payments: TSingleOrderPayments;
  orderId: string;
  className?: string;
}

const columnHelper = createColumnHelper<TSingleOrderPayment>();

const columns = [
  columnHelper.accessor('id', {
    header: 'Id'
  }),
  columnHelper.accessor('payment_date', {
    header: 'Sana',
    cell: ({ row: { original } }) => (
      <div>{formatDate(original.payment_date, 'DD.MM.YYYY HH:mm')}</div>
    )
  }),
  columnHelper.accessor('amount', {
    header: 'Summa',
    cell: ({ row: { original } }) => (
      <div>
        {formatPrice(original.amount, original.orders?.currency as TCurrency)}
      </div>
    )
  }),
  columnHelper.accessor('description', {
    header: 'Izoh'
  })
];

const supabase = createClient();

export const OrderPaymentsTable = ({
  payments,
  orderId,
  className
}: IProps) => {
  const { data } = useQuery({
    queryKey: ['order-payments', orderId],
    queryFn: cache(async () => {
      const { data } = await supabase
        .from('payments')
        .select('*, orders(currency)')
        .eq('order_id', orderId);

      return data || [];
    }),
    initialData: payments
  });

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

  const table = useReactTable({
    columns,
    data,
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

  return (
    <div className={cn('flex flex-col', className)}>
      <Table striped withColumnBorders captionSide="top">
        <Table.Caption>Barcha to'lovlar</Table.Caption>

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
    </div>
  );
};
