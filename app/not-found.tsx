import { H2 } from '@/components/typography/h2';
import { P } from '@/components/typography/p';
import { ROUTES } from 'core/consts';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <H2>Topilmadi</H2>
      <P>So'ralgan manbaa topilmadi</P>
      <Link className="text-link" href={ROUTES.home}>
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
