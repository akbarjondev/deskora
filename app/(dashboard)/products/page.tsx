import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { AddProductButton } from '@/components/dashboard/products/AddProductButton';
import { AddProductModal } from '@/components/dashboard/products/AddProductModal';
import dynamic from 'next/dynamic';

const Products = dynamic(
  () => import('@/components/dashboard/products/Products')
);

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
          <Products products={data} />
        </CardContent>
      </Card>
      <AddProductModal />
    </>
  );
}
