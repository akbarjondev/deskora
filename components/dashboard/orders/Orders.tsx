'use client';

import { ProductPill } from '@/components/dashboard/common/ProductPill';
import { PAGE_SIZE, paymentMethodOptions, ROUTES } from '@/core/consts';
import { formatPrice } from '@/core/helpers/formatPrice';
import { TCurrency } from '@/core/types';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Button, Group, Select, Table, Tooltip } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
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
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { OrdersWithCustomerAndOrderItems } from 'requests/orders/getAllOrders';

const supabase = createClient();
const columnHelper =
  createColumnHelper<OrdersWithCustomerAndOrderItems[number]>();
const defaultData: OrdersWithCustomerAndOrderItems = [];

interface IProps {
  orders: OrdersWithCustomerAndOrderItems;
}

const Orders = ({ orders }: IProps) => {
  const router = useRouter();
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
      columnHelper.accessor('customers.name', {
        id: 'customer_id',
        header: 'Mijoz',
        cell: ({ row: { original } }) => (
          <Tooltip label={original.customers?.phone}>
            <span>{original.customers?.name}</span>
          </Tooltip>
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
      columnHelper.accessor('delivery_date', {
        header: 'Yetkazish sanasi',
        cell: ({ row: { original } }) => (
          <div>{dayjs(original.delivery_date).format('DD.MM.YYYY')}</div>
        )
      }),
      columnHelper.accessor('delivery_address', {
        header: 'Manzil'
      }),
      columnHelper.accessor('total_price', {
        header: 'Umumiy summa',
        cell: ({ row: { original } }) => (
          <div>
            {formatPrice(original.total_price, original.currency as TCurrency)}
          </div>
        )
      }),
      columnHelper.accessor('total_paid', {
        header: "To'langan summa",
        cell: ({ row: { original } }) => (
          <div>
            {formatPrice(
              original.total_paid || 0,
              original.currency as TCurrency
            )}
          </div>
        )
      }),
      columnHelper.accessor('remaining_debt', {
        header: 'Qolgan qarz',
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
              paymentMethodOptions.find(
                (item) => original.payment_method === item.value
              )?.label
            }
          </div>
        )
      })
    ],
    []
  );

  const { data } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await supabase.from('orders').select(`
        *,
        customers (*),
        order_items (*, products (*))
        `);

      return data;
    },
    initialData: orders
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
              onClick={() => {
                router.push(ROUTES.singleCustomer(row.original.customer_id));
              }}
              key={row.id}
              className="cursor-pointer"
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
    </>
  );
};

export default Orders;
