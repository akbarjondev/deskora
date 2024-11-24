import { AddOrderButton } from '@/components/dashboard/orders/AddOrderButton';
import { Orders } from '@/components/dashboard/orders/Orders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getAllOrdersServer } from 'requests/orders/getAllOrders';

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
