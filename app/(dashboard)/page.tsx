import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/core/helpers/formatPrice';
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
    </div>
  );
}
