import { Flex, Heading } from '@chakra-ui/react';
import * as React from 'react';

export const CardHeader: React.FC<{ title?: React.ReactNode }> = ({
  title,
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
      <Heading fontSize="lg">{title}</Heading>
      <div>{children}</div>
    </Flex>
  );
};
