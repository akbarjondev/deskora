import Link from 'next/link';
import {
  Home,
  LayoutDashboard,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Users2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User } from '../../components/dashboard/navigation/user';
import { NavItem } from '../../components/dashboard/navigation/nav-item';
import { SearchInput } from '../../components/dashboard/navigation/search';
import { ROUTES } from 'core/consts';
import { Providers } from '@/components/providers/Providers';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <SearchInput />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href={ROUTES.home}
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <LayoutDashboard size={20} className="h-5 w-5" />
        </Link>

        <NavItem href={ROUTES.orders} label="Ish stol">
          <ShoppingCart className="h-5 w-5" />
        </NavItem>

        <NavItem href={ROUTES.products} label="Mahsulotlar">
          <Package className="h-5 w-5" />
        </NavItem>

        <NavItem href={ROUTES.customers} label="Mijozlar">
          <Users2 className="h-5 w-5" />
        </NavItem>
      </nav>
      {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={ROUTES.settings}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Sozlamalar</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Sozlamalar</TooltipContent>
        </Tooltip>
      </nav> */}
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Menyu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href={ROUTES.home}
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
          </Link>
          <Link
            href={ROUTES.home}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Ish stoli
          </Link>
          <Link
            href={ROUTES.orders}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            Buyurtmalar
          </Link>
          <Link
            href={ROUTES.products}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Package className="h-5 w-5" />
            Mahsulotlar
          </Link>
          <Link
            href={ROUTES.customers}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Users2 className="h-5 w-5" />
            Mijozlar
          </Link>
          {/* <Link
            href={ROUTES.settings}
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Sozlamalar
          </Link> */}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
