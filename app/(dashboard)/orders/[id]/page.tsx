import { ProductPill } from '@/components/dashboard/common/ProductPill';
import { OrderPaymentsTable } from '@/components/dashboard/orders/OrderPaymentsTable';
import { SingleOrderTable } from '@/components/dashboard/orders/SingleOrderTable';
import { AddPaymentButton } from '@/components/dashboard/payments/AddPaymentButton';
import { AddPaymentModal } from '@/components/dashboard/payments/AddPaymentModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/core/consts';
import { TCurrency } from '@/core/types';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSingleOrderPayments } from 'requests/orders/getSingleOrderPayments';

export default async function PaymentPage({ params }: PageProps<'id'>) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const supabase = await createClient();

  // get current order and customer by order id
  const { data: orderData, error } = await supabase
    .from('orders')
    .select(`*, order_items(*, products(*)), payments(*), customers(*)`)
    .eq('id', id);

  // get all payments for this order
  const payments = await getSingleOrderPayments(id);

  if (error) {
    throw error;
  }

  const order = orderData[0];

  return (
    <>
      <Card>
        <div className="p-6 flex items-center justify-between">
          <Button
            component={Link}
            href={ROUTES.orders}
            leftSection={<ArrowLeft size={16} />}
            variant="outline"
            color="dark"
          >
            Orqaga
          </Button>

          {!!order.remaining_debt && order.remaining_debt > 0 && (
            <AddPaymentButton />
          )}
        </div>

        <CardHeader className="flex-row justify-between">
          <CardTitle>Buyurtma va barcha to'lovlar</CardTitle>
        </CardHeader>

        <CardContent>
          <SingleOrderTable
            order={{
              id: order.id,
              products: order.order_items.map((item) => (
                <ProductPill
                  key={item.id}
                  name={item.products?.name || ''}
                  quantity={item.quantity}
                />
              )),
              total_price: order.total_price,
              total_paid: order.payments.reduce(
                (acc, curr) => acc + curr.amount,
                0
              ),
              remaining_debt: order.remaining_debt || 0,
              currency: order.currency as TCurrency,
              payment_method: order.payment_method || '',
              delivery_address: order.delivery_address || '',
              order_date: order.created_at || ''
            }}
          />

          {payments && payments.length > 0 && (
            <OrderPaymentsTable
              className="mt-10"
              orderId={id}
              payments={payments}
            />
          )}
        </CardContent>
      </Card>
      <AddPaymentModal orderId={id} />
    </>
  );
}
