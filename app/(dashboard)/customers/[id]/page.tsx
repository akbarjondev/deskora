import { SingleCustomer } from '@/components/dashboard/customers/SingleCustomer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/core/consts';
import { createClient } from '@/lib/supabase/server';
import { Button, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCustomerOrders } from 'requests/customers/getCustomerOrders';

export default async function OrdersSinglePage({
  params: { id }
}: PageProps<'id'>) {
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
        href={ROUTES.orders}
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
        <div className="flex gap-5">
          <div>
            <Title order={5}>Ism:</Title>
            <p>{customer.name}</p>
          </div>
          <div>
            <Title order={5}>Telefon raqam:</Title>
            <p>{customer.phone}</p>
          </div>
          <div>
            <Title order={5}>Mahsulot sotildi:</Title>
            <p>
              {Object.entries(purchasesInCurrencies).map(
                ([currency, total]) => (
                  <div className="border-b" key={currency}>
                    {total} {currency}
                  </div>
                )
              )}
            </p>
          </div>
          <div>
            <Title order={5}>Qarz:</Title>
            <p>
              {Object.entries(debtsInCurrencies).map(([currency, total]) => (
                <div className="border-b" key={currency}>
                  {total} {currency}
                </div>
              ))}
            </p>
          </div>
          <div>
            <Title order={5}>Manzil va izoh:</Title>
            <p>{customer.address || '-'}</p>
          </div>
          <div>
            <Title order={5}>Qachon qo'shilgan:</Title>
            <p>{dayjs(customer.created_at).format('DD.MM.YYYY')}</p>
          </div>
        </div>

        <SingleCustomer className="mt-10" orders={orders} />
      </CardContent>
    </Card>
  );
}
