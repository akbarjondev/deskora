'use client';

import { ROUTES } from 'core/consts';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({
  error
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="p-4 md:p-6">
      <div className="mb-8 space-y-4">
        <h1 className="font-semibold text-lg md:text-2xl">
          Xatolik yuz berdi!
        </h1>
        <p>Iltimos bosh sahifaga qayting.</p>
        <Link href={ROUTES.home}>Bosh sahifa</Link>
      </div>
    </main>
  );
}
