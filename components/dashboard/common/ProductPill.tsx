import { Badge } from '@mantine/core';

interface IProps {
  name: string | number;
  quantity: number;
}

export const ProductPill = ({ name, quantity }: IProps) => {
  return (
    <div className="flex px-1 pl-2 py-1 gap-1 bg-slate-500 text-white font-semibold text-sm rounded-full truncate">
      {name}
      <Badge color="lime.5" circle>
        {quantity}
      </Badge>
    </div>
  );
};
