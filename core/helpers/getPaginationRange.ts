export function getPaginationRange(
  pageNumber: number,
  pageSize: number
): { from: number; to: number } {
  const from = (pageNumber - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}
