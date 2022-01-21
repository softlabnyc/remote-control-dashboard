import { Flex, Heading } from '@chakra-ui/react';
import * as React from 'react';

export const CardHeader: React.FC<{ action?: React.ReactNode }> = ({
  action,
  children,
}) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      px="6"
      py="4"
      borderBottomWidth="1px"
    >
      <Heading fontSize="lg">{children}</Heading>
      {action}
    </Flex>
  );
};
