import { AddOrderButton } from '@/components/dashboard/orders/AddOrderButton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function OrdersPage() {
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
      <CardContent></CardContent>
    </Card>
  );
}
