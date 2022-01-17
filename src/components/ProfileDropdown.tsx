import {
  Avatar,
  Box,
  Flex,
  HStack,
  Menu,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue as mode,
  useMenuButton,
  UseMenuButtonProps,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import * as React from 'react';
import emailToName from 'email-to-name';

const ProfileMenuButton = (props: UseMenuButtonProps) => {
  const { data: session } = useSession();
  const buttonProps = useMenuButton(props);
  return (
    <Flex
      {...buttonProps}
      as="button"
      flexShrink={0}
      rounded="full"
      outline="0"
      _focus={{ shadow: 'outline' }}
    >
      <Box srOnly>Open user menu</Box>
      <Avatar
        size="sm"
        name={emailToName.process(session!.user?.email ?? '')}
      />
    </Flex>
  );
};

export const ProfileDropdown = () => {
  const { data: session } = useSession();

  return (
    <Menu>
      <ProfileMenuButton />
      <MenuList
        rounded="md"
        shadow="lg"
        py="1"
        color={mode('gray.600', 'inherit')}
        fontSize="sm"
      >
        <HStack px="3" py="4">
          <Avatar
            size="sm"
            name={emailToName.process(session!.user?.email ?? '')}
          />
          <Box lineHeight="1">
            <Text fontWeight="semibold">
              {emailToName.process(session!.user?.email ?? '')}
            </Text>
            <Text mt="1" fontSize="xs" color="gray.500">
              {session!.user?.email}
            </Text>
          </Box>
        </HStack>
        <MenuItem
          onClick={() => signOut()}
          fontWeight="medium"
          color={mode('red.500', 'red.300')}
        >
          Sign out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
