import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function ProductsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buyurtmalar</CardTitle>
        <CardDescription>
          Barcha buyurtmalar shu yerda aks etadi.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
