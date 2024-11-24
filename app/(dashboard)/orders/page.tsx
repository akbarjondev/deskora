import { AddOrderButton } from '@/components/dashboard/orders/AddOrderButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import dynamic from 'next/dynamic';
import { getAllOrdersServer } from 'requests/orders/getAllOrders';

const Orders = dynamic(() => import('@/components/dashboard/orders/Orders'));

export default async function OrdersPage() {
  const orders = await getAllOrdersServer();

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div>
          <CardTitle>Buyurtmalar</CardTitle>
          <CardDescription>
            Barcha buyurtmalar shu yerda aks etadi.
          </CardDescription>
        </div>
        <div>
          <AddOrderButton />
        </div>
      </CardHeader>
      <CardContent>
        <Orders orders={orders} />
      </CardContent>
    </Card>
  );
}
