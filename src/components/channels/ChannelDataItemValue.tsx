import { EditableDataItem } from '@/lib/DataItem';
import { Badge, Code } from '@chakra-ui/react';
import { Row } from 'react-table';
import { Prisma } from '@prisma/client';

export const ChannelDataItemValue = ({
  value,
  row: { original: item },
}: {
  value: EditableDataItem['editableValue'];
  row: Row<EditableDataItem>;
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
    case 'null':
      return <Code>null</Code>;
  }
  return <Code>{value}</Code>;
};
