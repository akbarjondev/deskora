import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductsTable } from './products-table';
import { getProducts } from '@/lib/db';
import { H2 } from '@/components/typography/h2';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default async function ProductsPage(props: {
  searchParams: Promise<{ q: string; offset: string }>;
}) {
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
