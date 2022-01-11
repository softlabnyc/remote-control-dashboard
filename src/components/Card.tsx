import { Box, BoxProps, Center, useColorModeValue } from '@chakra-ui/react';

export const Card = (props: BoxProps) => (
  <Box
    bg={useColorModeValue('white', 'gray.700')}
    py="8"
    px={{ base: '4', md: '10' }}
    shadow="base"
    rounded={{ sm: 'lg' }}
    {...props}
  />
);

const EmptyCard = ({ children, ...props }: BoxProps) => (
  <Box
    bg={useColorModeValue('white', 'gray.700')}
    p="6"
    shadow="base"
    rounded={{ sm: 'lg' }}
    {...props}
  >
    <Center
      border="3px dashed currentColor"
      color={useColorModeValue('gray.200', 'gray.600')}
      h="96"
      rounded={{ sm: 'lg' }}
    >
      {children}
    </Center>
  </Box>
);

Card.Empty = EmptyCard;
