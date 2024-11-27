'use client';

import { ProductPill } from '@/components/dashboard/common/ProductPill';
import { paymentMethodOptions } from '@/core/consts';
import { cn } from '@/lib/utils';
import { Accordion, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { CustomerWithOrderItemsAndPayments } from 'requests/customers/getCustomerOrders';

interface IProps {
  orders: CustomerWithOrderItemsAndPayments;
  className?: string;
}

export const SingleCustomer = ({ orders, className }: IProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <Title mb={16} order={5}>
        Barcha buyurtmalar:
      </Title>
      <Accordion>
        {orders &&
          orders.length > 0 &&
          orders.map((order) => {
            return (
              <Accordion.Item
                key={order.id}
                value={
                  order.created_at ? String(order.created_at) : String(order.id)
                }
              >
                <Accordion.Control>
                  <div className="grid grid-cols-6 gap-5">
                    <div>
                      <Title order={6}>Buyurtma №{order.id}</Title>
                      <p>{dayjs(order.created_at).format('DD.MM.YYYY')}</p>
                    </div>
                    <div>
                      <Title order={6}>Umumiy summa:</Title>
                      <p>
                        {order.total_price} {order.currency}
                      </p>
                    </div>
                    <div>
                      <Title order={6}>Qolgan qarz:</Title>
                      <p>
                        {order.remaining_debt} {order.currency}
                      </p>
                    </div>
                  </div>
                </Accordion.Control>
                <Accordion.Panel>
                  <div className="flex flex-col gap-1">
                    <div>
                      <Title order={6}>Mahsulotlar:</Title>
                      <div className="flex gap-1">
                        {order.order_items.map((item) => (
                          <ProductPill
                            key={item.id}
                            name={item.products?.name || item.product_id}
                            quantity={item.quantity}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Title order={6}>To'langan summa:</Title>
                      <p>
                        {order.total_paid} {order.currency}
                      </p>
                    </div>
                    <div>
                      <Title order={6}>Qolgan qarz:</Title>
                      <p>
                        {order.remaining_debt} {order.currency}
                      </p>
                    </div>
                    <div>
                      <Title order={6}>Yetkazish sanasi:</Title>
                      <p>{dayjs(order.delivery_date).format('DD.MM.YYYY')}</p>
                    </div>
                    <div>
                      <Title order={6}>To'lov usuli:</Title>
                      <p>
                        {
                          paymentMethodOptions.find(
                            (i) => i.value === order.payment_method
                          )?.label
                        }
                      </p>
                    </div>
                    {order.delivery_address && (
                      <div>
                        <Title order={6}>Yetkazish manzili:</Title>
                        <p>{order.delivery_address}</p>
                      </div>
                    )}
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
      </Accordion>
    </div>
  );
};
