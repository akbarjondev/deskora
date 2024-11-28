'use client';

import { ProductPill } from '@/components/dashboard/common/ProductPill';
import { PAGE_SIZE, paymentMethodOptions } from '@/core/consts';
import { formatPrice } from '@/core/helpers/formatPrice';
import { TCurrency } from '@/core/types';
import { cn } from '@/lib/utils';
import { Button, Group, Select, Table } from '@mantine/core';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown
} from 'lucide-react';
import { useState } from 'react';
import { CustomerWithOrderItemsAndPayments } from 'requests/customers/getCustomerOrders';

interface IProps {
  orders: CustomerWithOrderItemsAndPayments;
  className?: string;
}

const columnHelper =
  createColumnHelper<NonNullable<CustomerWithOrderItemsAndPayments>[number]>();

const columns = [
  columnHelper.accessor('id', {
    header: 'Id'
  }),
  columnHelper.accessor('order_date', {
    header: 'Sana',
    cell: ({ row: { original } }) => (
      <div>{dayjs(original.created_at).format('DD.MM.YYYY')}</div>
    )
  }),
  columnHelper.accessor('order_items', {
    header: 'Mahsulotlar',
    cell: ({ row: { original } }) => (
      <div className="flex gap-1">
        {original?.order_items?.map((item) => (
          <ProductPill
            key={item.id}
            name={item.products?.name ?? item.product_id}
            quantity={item.quantity}
          />
        ))}
      </div>
    )
  }),
  columnHelper.accessor('total_price', {
    header: 'Summa',
    cell: ({ row: { original } }) => (
      <div>
        {formatPrice(original.total_price, original.currency as TCurrency)}
      </div>
    )
  }),
  columnHelper.accessor('total_paid', {
    header: "To'landi",
    cell: ({ row: { original } }) => (
      <div>
        {formatPrice(original.total_paid || 0, original.currency as TCurrency)}
      </div>
    )
  }),
  columnHelper.accessor('remaining_debt', {
    header: 'Qarz',
    cell: ({ row: { original } }) => (
      <div>
        {formatPrice(
          original.remaining_debt || 0,
          original.currency as TCurrency
        )}
      </div>
    )
  }),
  columnHelper.accessor('payment_method', {
    header: "To'lov usuli",
    cell: ({ row: { original } }) => (
      <div>
        {
          paymentMethodOptions.find((i) => i.value === original.payment_method)
            ?.label
        }
      </div>
    )
  }),
  columnHelper.accessor('delivery_date', {
    header: 'Yetkazish sanasi',
    cell: ({ row: { original } }) => (
      <div>{dayjs(original.delivery_date).format('DD.MM.YYYY')}</div>
    )
  }),
  columnHelper.accessor('delivery_address', {
    header: 'Yetkazish manzili'
  })
];

export const CustomerOrdersTable = ({ orders, className }: IProps) => {
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
    data: orders,
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
      <Table striped withColumnBorders highlightOnHover captionSide="top">
        <Table.Caption>Barcha buyurtmalar</Table.Caption>

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
