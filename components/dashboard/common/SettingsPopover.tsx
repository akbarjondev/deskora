import { Button, Popover } from '@mantine/core';
import { EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-react';

interface Props {
  onDelete: () => void;
  onEdit: () => void;
}

export const SettingsPopover = ({ onDelete, onEdit }: Props) => {
  return (
    <Popover
      position="bottom-end"
      withArrow
      clickOutsideEvents={['mouseup', 'touchend']}
    >
      <Popover.Target>
        <Button color="dark" variant="transparent" p={0}>
          <EllipsisIcon />
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="flex flex-col gap-2 items-start">
        <Button
          color="dark"
          leftSection={<PencilIcon size={16} />}
          variant="transparent"
          size="sm"
          p={0}
          onClick={() => {
            onEdit();
          }}
        >
          Tahrirlash
        </Button>
        <Button
          color="red"
          leftSection={<TrashIcon size={16} />}
          variant="transparent"
          size="sm"
          p={0}
          onClick={() => {
            onDelete();
          }}
        >
          O'chirish
        </Button>
      </Popover.Dropdown>
    </Popover>
  );
};
