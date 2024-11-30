'use client';

import { paymentMethodOptions } from '@/core/consts';
import { formatDate } from '@/core/helpers/formatDate';
import { formatPrice } from '@/core/helpers/formatPrice';
import { ISingleOrder, TCurrency } from '@/core/types';
import { Table, TableData } from '@mantine/core';

interface IProps {
  order: ISingleOrder;
}

export const SingleOrderTable = ({ order }: IProps) => {
  const {
    id,
    products,
    total_price,
    total_paid,
    remaining_debt,
    currency,
    payment_method,
    delivery_address,
    order_date
  } = order;

  const tableData: TableData = {
    head: [
      'Id',
      'Sana',
      'Mahsulotlar',
      'Summa',
      "To'landi",
      'Qarz',
      "To'lov usuli",
      'Manzil (izoh)'
    ],
    body: [
      [
        id,
        formatDate(order_date),
        <div className="flex gap-1">{products}</div>,
        formatPrice(total_price, currency as TCurrency),
        formatPrice(total_paid || 0, currency as TCurrency),
        formatPrice(remaining_debt || 0, currency as TCurrency),
        paymentMethodOptions.find((option) => option.value === payment_method)
          ?.label || '-',
        delivery_address || '-'
      ]
    ]
  };

  return <Table className="!border" data={tableData} />;
};
