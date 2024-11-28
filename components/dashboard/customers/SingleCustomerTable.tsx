'use client';

import { formatPrice } from '@/core/helpers/formatPrice';
import { ISingleCustomer, TCurrency } from '@/core/types';
import { Table, TableData } from '@mantine/core';

interface IProps {
  customer: ISingleCustomer;
}

export const SingleCustomerTable = ({ customer }: IProps) => {
  const { id, name, phone, address, purchasesInCurrencies, debtsInCurrencies } =
    customer;

  const tableData: TableData = {
    head: [
      'Id',
      'Nomi',
      'Kontakt',
      'Mahsulot sotildi',
      'Qolgan qarz',
      'Manzil (izoh)'
    ],
    body: [
      [
        id,
        name,
        phone,
        Object.entries(purchasesInCurrencies).map(([currency, total]) => (
          <div className="border-b" key={currency}>
            {formatPrice(total, currency as TCurrency)}
          </div>
        )),
        Object.entries(debtsInCurrencies).map(([currency, total]) => (
          <div className="border-b" key={currency}>
            {formatPrice(total, currency as TCurrency)}
          </div>
        )),
        address || '-'
      ]
    ]
  };

  return <Table className="!border" data={tableData} />;
};
