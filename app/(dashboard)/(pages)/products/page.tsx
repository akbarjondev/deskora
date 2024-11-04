import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { ProductsTable } from 'app/(dashboard)/(pages)/products/(components)/ProductsTable';
import { PlusCircle } from 'lucide-react';

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('products').select();

  if (error) {
    throw error;
  }

  const addProduct = () => {};

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
          <Button onClick={addProduct} className="flex gap-1">
            <PlusCircle /> <span>Mahsulot qo'shish</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ProductsTable products={data} />
      </CardContent>
    </Card>
  );
}
