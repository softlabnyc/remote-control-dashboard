import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';
import { Logo } from '../Logo';

export const AuthLayout = ({ children, ...props }: BoxProps) => (
  <Box
    bg={useColorModeValue('gray.50', 'inherit')}
    minH="100vh"
    py="12"
    px={{ base: '4', lg: '8' }}
    {...props}
  >
    <Box maxW="md" mx="auto">
      <Logo mx="auto" h="8" mb={{ base: '10', md: '20' }} />
      {children}
    </Box>
  </Box>
);
