import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default function CustomersPage() {
  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div>
          <CardTitle>Mahsulotlar</CardTitle>
          <CardDescription>
            Barcha mahsulotlar shu yerda aks etadi.
          </CardDescription>
        </div>
        <div>
          <Button className="flex gap-1">
            <PlusCircle /> <span>Mahsulot qo'shish</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>table</CardContent>
    </Card>
  );
}
