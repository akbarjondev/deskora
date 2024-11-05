import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { AddProductButton } from 'app/(dashboard)/(pages)/products/(components)/AddProductButton';
import { AddProductModal } from 'app/(dashboard)/(pages)/products/(components)/AddProductModal';
import { ProductsTable } from 'app/(dashboard)/(pages)/products/(components)/ProductsTable';

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('products').select();

  if (error) {
    throw error;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex-row justify-between">
          <div>
            <CardTitle>Mahsulotlar</CardTitle>
            <CardDescription>
              Barcha mahsulotlar shu yerda aks etadi.
            </CardDescription>
          </div>
          <div>
            <AddProductButton />
          </div>
        </CardHeader>
        <CardContent>
          <ProductsTable products={data} />
        </CardContent>
      </Card>
      <AddProductModal />
    </>
  );
}
