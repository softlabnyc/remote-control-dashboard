import { trpc } from '@/utils/trpc';
import { Stack } from '@chakra-ui/react';
import { Channel, Prisma } from '@prisma/client';
import { useMemo, useState } from 'react';
import { JSONObject } from 'superjson/dist/types';
import { TableContent } from '../TableContent';
import { useErrorToast } from '../useErrorToast';
import { ChannelDataItemDrawer } from './ChannelDataItemDrawer';
import { ChannelDataItemName } from './ChannelDataItemName';
import { ChannelDataItemType } from './ChannelDataItemType';
import { ChannelDataItemValue } from './ChannelDataItemValue';
import { ChannelDataTableHeader } from './ChannelDataTableHeader';
import sortObject from 'sort-object-keys';
import {
  DataItem,
  EditableDataItem,
  fromData,
  marshall,
  unmarshall,
} from '@/lib/DataItem';
import { ChannelDataItemAction } from './ChannelDataItemAction';

const ChannelDataTable = ({ channel }: { channel: Channel }) => {
  const updateMutation = trpc.useMutation(['channel.update']);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row: EditableDataItem) => row.name,
        id: 'property',
        Cell: ChannelDataItemName,
      },
      {
        Header: 'Value',
        id: 'value',
        accessor: (row: EditableDataItem) => row.editableValue,
        Cell: ChannelDataItemValue,
      },
      {
        Header: 'Type',
        id: 'type',
        accessor: (row: EditableDataItem) => row.type,
        Cell: ChannelDataItemType,
      },
      {
        id: 'action',
        accessor: (row: EditableDataItem) => ({ channelKey: channel.key }),
        Cell: ChannelDataItemAction,
      },
    ],
    [channel]
  );

  const data = useMemo(
    () =>
      fromData(sortObject(channel.data as Prisma.JsonObject)).map(unmarshall),
    [channel]
  );

  return (
    <Stack spacing={4}>
      <ChannelDataTableHeader>
        <ChannelDataItemDrawer
          mode="create"
          onCreate={async (item) => {
            const newItem = marshall(item);
            await updateMutation.mutateAsync({
              key: channel.key,
              data: {
                data: {
                  [newItem.name]: newItem.value,
                },
              },
            });
          }}
        />
      </ChannelDataTableHeader>
      <TableContent columns={columns} data={data} />
    </Stack>
  );
};

const ChannelDataSubscription = ({
  initialChannel,
}: {
  initialChannel: Channel;
}) => {
  const [channel, setChannel] = useState(initialChannel);
  trpc.useSubscription(['channel.onUpdate', { key: channel.key }], {
    onNext(data) {
      setChannel((channel) => ({
        ...channel,
        data: Object.assign(channel.data, data.data),
      }));
    },
  });

  return <ChannelDataTable channel={channel} />;
};

export const ChannelData = ({ channelKey }: { channelKey: string }) => {
  const { data: initialChannel, error } = trpc.useQuery([
    'channel.read',
    channelKey,
  ]);
  useErrorToast(error);

  return initialChannel ? (
    <ChannelDataSubscription initialChannel={initialChannel} />
  ) : null;
};
