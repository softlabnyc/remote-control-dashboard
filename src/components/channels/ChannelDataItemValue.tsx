import { EditableDataItem } from '@/lib/dataItem';
import { Badge, Code } from '@chakra-ui/react';
import { Prisma } from '@prisma/client';

export const ChannelDataItemValue = ({
  value,
  row: item,
}: {
  value: EditableDataItem['value'];
  row: EditableDataItem;
}) => {
  switch (item.type) {
    case 'string':
      return (
        <Code>
          {'"'}
          {value}
          {'"'}
        </Code>
      );
  }
  return <Code>{value}</Code>;
};
