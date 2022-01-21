import { trpc } from '@/utils/trpc';
import { Stack } from '@chakra-ui/react';
import { Channel, Prisma } from '@prisma/client';
import { useState } from 'react';
import { JSONObject } from 'superjson/dist/types';
import { TableContent } from '../TableContent';
import { useErrorToast } from '../useErrorToast';
import { ChannelDataItemDrawer } from './ChannelDataItemDrawer';
import { ChannelDataItemProperty } from './ChannelDataItemProperty';
import { ChannelDataItemType } from './ChannelDataItemType';
import { ChannelDataItemValue } from './ChannelDataItemValue';
import { ChannelDataTableActions } from './ChannelDataTableHeader';
import sortObject from 'sort-object-keys';

const ChannelDataInner = ({ initialChannel }: { initialChannel: Channel }) => {
  const [channel, setChannel] = useState(initialChannel);
  trpc.useSubscription(['channel.onUpdate', channel.key], {
    onNext(channel) {
      setChannel(channel);
    },
  });
  const updateMutation = trpc.useMutation(['channel.update']);

  return (
    <Stack spacing={4}>
      <ChannelDataTableActions
        action={
          <ChannelDataItemDrawer
            mode="create"
            onCreate={async ({ property, value }) => {
              await updateMutation.mutateAsync({
                key: channel.key,
                data: {
                  data: {
                    [property]: value,
                  },
                },
              });
            }}
          />
        }
      />
      <TableContent
        columns={[
          {
            header: 'Property',
            accessor: '0',
            Cell: ChannelDataItemProperty,
          },
          {
            header: 'Value',
            accessor: '1',
            Cell: ChannelDataItemValue,
          },
          {
            header: 'Type',
            accessor: '1',
            Cell: ChannelDataItemType,
          },
        ]}
        data={Object.entries(sortObject(channel.data as JSONObject))}
        Action={function ActionCell([property, value]: [
          property: string,
          value: Prisma.JsonValue
        ]) {
          return (
            <ChannelDataItemDrawer
              mode="edit"
              values={{ property, value }}
              onUpdate={async ({ property: newProperty, value: newValue }) => {
                await updateMutation.mutateAsync({
                  key: channel.key,
                  data: {
                    data: Object.assign(
                      { [property]: undefined },
                      { [newProperty]: newValue }
                    ),
                  },
                });
              }}
              onDelete={async () => {
                await updateMutation.mutateAsync({
                  key: channel.key,
                  data: {
                    data: {
                      [property]: undefined,
                    },
                  },
                });
              }}
            />
          );
        }}
      />
    </Stack>
  );
};

export const ChannelData = ({ channelKey }: { channelKey: string }) => {
  const { data: initialChannel, error } = trpc.useQuery([
    'channel.read',
    channelKey,
  ]);
  useErrorToast(error);

  return initialChannel ? (
    <ChannelDataInner initialChannel={initialChannel} />
  ) : null;
};
