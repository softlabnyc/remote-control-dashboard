import { Badge, Code } from '@chakra-ui/react';
import { Prisma } from '@prisma/client';

export const ChannelDataItemValue = (value: Prisma.JsonValue) => {
  switch (typeof value) {
    case 'number':
      return <Code>{value}</Code>;
    case 'string':
      return (
        <Code>
          {'"'}
          {value}
          {'"'}
        </Code>
      );
    case 'boolean':
      return <Code>{value ? 'true' : 'false'}</Code>;
  }
  if (value === null) return <Code>null</Code>;
  return <Code>{JSON.stringify(value)}</Code>;
};
