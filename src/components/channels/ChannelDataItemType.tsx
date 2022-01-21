import { Badge, Code } from '@chakra-ui/react';
import { Prisma } from '@prisma/client';

export const ChannelDataItemType = (value: Prisma.JsonValue) => {
  switch (typeof value) {
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
        <Badge ml="1" colorScheme={value ? 'green' : 'red'}>
          Boolean
        </Badge>
      );
  }
  if (value === null) return <Badge colorScheme="red">Null</Badge>;
  return (
    <Badge ml="1" colorScheme="purple">
      {Array.isArray(value) ? 'Array' : 'Object'}
    </Badge>
  );
};
