import { EditableDataItem } from '@/lib/dataItem';
import { Badge, Code } from '@chakra-ui/react';
import { Row } from 'react-table';
import { Prisma } from '@prisma/client';

export const ChannelDataItemType = ({
  value: type,
  row: { original: item },
}: {
  value: EditableDataItem['type'];
  row: Row<EditableDataItem>;
}) => {
  switch (type) {
    case 'number':
      return (
        <Badge ml="1" colorScheme="blue">
          Number
        </Badge>
      );
    case 'string':
      return (
        <Badge ml="1" colorScheme="yellow">
          String
        </Badge>
      );
    case 'boolean':
      return (
        <Badge ml="1" colorScheme={item.value ? 'green' : 'red'}>
          Boolean
        </Badge>
      );
    case 'null':
      <Badge colorScheme="red">Null</Badge>;
  }
  return (
    <Badge ml="1" colorScheme="purple">
      {Array.isArray(item.value) ? 'Array' : 'Object'}
    </Badge>
  );
};
