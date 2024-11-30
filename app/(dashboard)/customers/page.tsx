import { AddClientButton } from '@/components/dashboard/customers/AddClientButton';
import { AddClientModal } from '@/components/dashboard/customers/AddClientModal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import dynamic from 'next/dynamic';

const Clients = dynamic(
  () => import('@/components/dashboard/customers/Customers')
);

export default async function CLientsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('customers').select();

  if (error) {
    throw error;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex-row justify-between">
          <div>
            <CardTitle>Mijozlar</CardTitle>
            <CardDescription>
              Barcha mijozlar shu yerda aks etadi.
            </CardDescription>
          </div>
          <div>
            <AddClientButton />
          </div>
        </CardHeader>
        <CardContent>
          <Clients customers={data} />
        </CardContent>
      </Card>
      <AddClientModal />
    </>
  );
}
