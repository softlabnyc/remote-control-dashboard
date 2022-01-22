import { EditableDataItem } from '@/lib/DataItem';
import { Prisma } from '@prisma/client';

export const ChannelDataItemName = ({
  value: name,
}: {
  value: EditableDataItem['name'];
}) => {
  return <b>{name}</b>;
};
