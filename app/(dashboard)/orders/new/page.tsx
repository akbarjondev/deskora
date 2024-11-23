import { OrderForm } from '@/components/dashboard/orders/OrderForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function OrdersNewPage() {
  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div>
          <CardTitle>Buyurtma qo'shish</CardTitle>
          <CardDescription>
            Buyurtma qo'shish uchun quyidagi formani to'ldiring.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <OrderForm className="max-w-3xl" />
      </CardContent>
    </Card>
  );
}
