import Head from 'next/head';
import { getSession, signOut, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import PageLayout from '../components/PageLayout';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { HiChartBar, HiDownload, HiPlus } from 'react-icons/hi';

export default function Home() {
  const { data: session } = useSession();

  return (
    <PageLayout>
      <Tabs isFitted>
        <Flex direction="column" align="stretch" minH="100vh">
          <Box bg={mode('gray.50', 'gray.800')} px="8" pt="8">
            <Box maxW="7xl" mx="auto">
              <Flex
                direction={{ base: 'column', md: 'row' }}
                justify="space-between"
                align="flex-start"
                mb="10"
              >
                <HStack mb={{ base: '4', md: '0' }}>
                  <Heading size="lg">Projects</Heading>
                  <Text color={mode('gray.500', 'gray.300')} fontSize="sm">
                    (42 Projects)
                  </Text>
                </HStack>

                <HStack spacing={{ base: '2', md: '4' }}>
                  <Button
                    colorScheme="blue"
                    leftIcon={<HiPlus />}
                    fontSize="sm"
                  >
                    New project
                  </Button>
                </HStack>
              </Flex>

              <Flex justify="space-between" align="center">
                <TabList
                  border="0"
                  position="relative"
                  zIndex={1}
                  w={{ base: '100%', md: 'auto' }}
                >
                  <Tab fontWeight="semibold">Manage</Tab>
                </TabList>
              </Flex>
            </Box>
          </Box>
          <Box pos="relative" zIndex={0}>
            <Divider
              borderBottomWidth="2px"
              opacity={1}
              borderColor={mode('gray.100', 'gray.700')}
            />
          </Box>
          <Box px="8" flex="1">
            <Box maxW="7xl" mx="auto">
              <TabPanels mt="5" h="full">
                <TabPanel>Manage</TabPanel>
              </TabPanels>
            </Box>
          </Box>
        </Flex>
      </Tabs>
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: await getSession(context),
    },
  };
};
