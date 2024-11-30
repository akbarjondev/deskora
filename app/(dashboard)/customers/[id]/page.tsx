import { CustomerOrdersTable } from '@/components/dashboard/customers/CustomerOrdersTable';
import { SingleCustomerTable } from '@/components/dashboard/customers/SingleCustomerTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/core/consts';
import { formatDate } from '@/core/helpers/formatDate';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomerOrders } from 'requests/customers/getCustomerOrders';

export default async function OrdersSinglePage({ params }: PageProps<'id'>) {
  const { id } = await params;
  const supabase = await createClient();

  // customer data
  const { data: customerData, error } = await supabase
    .from('customers')
    .select()
    .eq('id', id);

  // their orders
  const orders = (await getCustomerOrders(id)) || [];

  if (customerData?.length === 0) {
    notFound();
  }

  if (error) {
    throw error;
  }

  const customer = customerData[0];

  // total purchases in all currencies
  const purchasesInCurrencies: Record<string, number> = {};
  const debtsInCurrencies: Record<string, number> = {};

  orders.forEach((order) => {
    if (order.currency) {
      if (order.currency in purchasesInCurrencies) {
        purchasesInCurrencies[order.currency] += order.total_price;
      } else {
        purchasesInCurrencies[order.currency] = order.total_price;
      }
    }
  });

  orders.forEach((order) => {
    if (order.currency) {
      if (order.currency in debtsInCurrencies) {
        debtsInCurrencies[order.currency] += order.remaining_debt || 0;
      } else {
        debtsInCurrencies[order.currency] = order.remaining_debt || 0;
      }
    }
  });

  return (
    <Card>
      <Button
        component={Link}
        href={ROUTES.customers}
        className="mt-6 ml-6"
        leftSection={<ArrowLeft size={16} />}
        variant="outline"
        color="dark"
      >
        Orqaga
      </Button>
      <CardHeader className="flex-row justify-between">
        <CardTitle>Mijoz ma'lumotlari va barcha buyurtmalar</CardTitle>
      </CardHeader>
      <CardContent>
        <SingleCustomerTable
          customer={{
            id: customer.id,
            name: customer.name || '-',
            phone: customer.phone,
            address: customer.address,
            purchasesInCurrencies,
            debtsInCurrencies,
            registeredAt: formatDate(customer.created_at)
          }}
        />

        {orders && <CustomerOrdersTable className="mt-10" orders={orders} />}
      </CardContent>
    </Card>
  );
}
