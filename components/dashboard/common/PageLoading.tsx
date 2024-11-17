import { Skeleton } from '@mantine/core';

export const PageLoading = () => {
  return (
    <div className="rounded-lg border p-6 flex flex-col gap-2">
      <Skeleton height={88} />
      <Skeleton height={370} />
    </div>
  );
};
