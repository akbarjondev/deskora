import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/core/helpers/formatPrice';
import { LineChart } from '@mantine/charts';
import { Title } from '@mantine/core';
import {
  DollarSign,
  HandCoins,
  ShoppingBasket,
  TrendingDown,
  TrendingUp,
  Users
} from 'lucide-react';

export default async function MainPage() {
  return (
    <div className="w-full h-screen">
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami savdolar</CardTitle>
            <DollarSign size={24} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(234532, 'USD')}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span>+20.1% o'tgan oyga nisbatan</span>
              <TrendingUp size={16} className="text-green-500" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qarzlar</CardTitle>
            <HandCoins size={24} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(15678, 'USD')}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span>+10.5% o'tgan oyga nisbatan</span>
              <TrendingDown size={16} className="text-red-500" />
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mijozlar</CardTitle>
            <Users size={24} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">345</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buyurtmalar</CardTitle>
            <ShoppingBasket size={24} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">102</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Title order={2} mt={40}>
          Sotuvlar
        </Title>
        <LineChart
          mt={10}
          h={300}
          data={data}
          dataKey="date"
          series={[{ name: 'sotuvlar', color: 'dark' }]}
          curveType="natural"
        />
      </div>
    </div>
  );
}

const data = [
  { date: '2024-01-01', sotuvlar: 1000 },
  { date: '2024-01-02', sotuvlar: 2000 },
  { date: '2024-01-03', sotuvlar: 1500 },
  { date: '2024-01-04', sotuvlar: 3000 },
  { date: '2024-01-05', sotuvlar: 2500 },
  { date: '2024-01-06', sotuvlar: 4000 },
  { date: '2024-01-07', sotuvlar: 3500 },
  { date: '2024-01-08', sotuvlar: 5000 },
  { date: '2024-01-09', sotuvlar: 4500 },
  { date: '2024-01-10', sotuvlar: 6000 }
];
