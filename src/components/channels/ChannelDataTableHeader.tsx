import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
} from '@chakra-ui/react';
import * as React from 'react';
import { BsSearch } from 'react-icons/bs';
import { RiAddFill, RiArrowRightUpLine } from 'react-icons/ri';

export const ChannelDataTableActions = ({
  action,
}: {
  action?: React.ReactNode;
}) => {
  return (
    <HStack
      spacing="4"
      direction={{ base: 'column', md: 'row' }}
      justify="space-between"
    >
      <Heading size="md">Project Data</Heading>
      {action}
    </HStack>
  );
};
