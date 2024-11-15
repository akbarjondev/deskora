import { AddClientButton } from '@/components/dashboard/clients/AddClientButton';
import { AddClientModal } from '@/components/dashboard/clients/AddClientModal';
import { Clients } from '@/components/dashboard/clients/Clients';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

export default async function CLientsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from('clients').select();

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
          <Clients clients={data} />
        </CardContent>
      </Card>
      <AddClientModal />
    </>
  );
}
