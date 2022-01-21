import { BoxProps, Flex, useColorModeValue as mode } from '@chakra-ui/react';
import * as React from 'react';
import { Logo } from '../Logo';
import { MobileHamburgerMenu } from '../MobileHamburgerMenu';
import { NavMenu } from '../NavMenu';
import { ProfileDropdown } from '../ProfileDropdown';
import { useMobileMenuState } from '../useMobileMenuState';

export const PageLayout = ({ children, ...props }: BoxProps) => {
  const { isMenuOpen, toggle } = useMobileMenuState();

  return (
    <Flex
      direction="column"
      bg={mode('gray.50', 'gray.800')}
      minH="100vh"
      {...props}
    >
      <Flex align="center" bg="blue.600" color="white" px="6" minH="16">
        <Flex justify="space-between" align="center" w="full">
          <MobileHamburgerMenu onClick={toggle} isOpen={isMenuOpen} />
          <NavMenu.Mobile isOpen={isMenuOpen} />

          {/* Desktop Logo placement */}
          <Logo
            display={{ base: 'none', lg: 'block' }}
            flexShrink={0}
            h="5"
            marginEnd="10"
          />

          {/* Desktop Navigation Menu */}
          <NavMenu.Desktop />

          {/* Mobile Logo placement */}
          <Logo
            flex={{ base: '1', lg: '0' }}
            display={{ lg: 'none' }}
            flexShrink={0}
            h="5"
          />

          <ProfileDropdown />
        </Flex>
      </Flex>

      {children}
    </Flex>
  );
};
