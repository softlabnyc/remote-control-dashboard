import { EditableDataItem, marshall } from '@/lib/dataItem';
import { trpc } from '@/utils/trpc';
import { Channel } from '@prisma/client';
import { ChannelDataItemDrawer } from './ChannelDataItemDrawer';
import { Row } from 'react-table';

export const ChannelDataItemAction = ({
  value: { channel },
  row: { original: item },
}: {
  value: {
    channel: Channel;
  };
  row: Row<EditableDataItem>;
}) => {
  const updateMutation = trpc.useMutation(['channel.update']);
  return (
    <ChannelDataItemDrawer
      mode="edit"
      item={item}
      onUpdate={async (updatedItem) => {
        const newItem = marshall(updatedItem);
        await updateMutation.mutateAsync({
          key: channel.key,
          data: {
            data: Object.assign(
              { [item.name]: undefined },
              { [newItem.name]: newItem.value }
            ),
          },
        });
      }}
      onDelete={async () => {
        await updateMutation.mutateAsync({
          key: channel.key,
          data: {
            data: {
              [item.name]: undefined,
            },
          },
        });
      }}
    />
  );
};
