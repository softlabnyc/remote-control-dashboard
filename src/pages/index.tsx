import Head from 'next/head';
import { createSSGHelpers } from '@trpc/react/ssg';
import { trpc } from '../lib/trpc';
import { GetServerSideProps } from 'next';
import { PageLayout } from '../components/layout/PageLayout';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue as mode,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { HiPlus } from 'react-icons/hi';
import { appRouter } from '../server/routers/_app';
import superjson from 'superjson';

import { createTRPCContext } from '../server/context';
import { ProjectDrawer } from '../components/projects/ProjectDrawer';
import { useEffect } from 'react';
import pluralize from 'pluralize';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Card } from '../components/Card';

export default function Home() {
  const { data, error } = trpc.useQuery(['project.findAll']);
  const projects = data ?? [];
  const mutation = trpc.useMutation(['project.create']);
  const toast = useToast();
  const utils = trpc.useContext();

  useEffect(() => {
    if (error) {
      toast({
        title: error?.message,
        status: 'error',
        isClosable: true,
      });
    }
  }, [toast, error]);

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
                    ({projects.length} {pluralize('Project', projects.length)})
                  </Text>
                </HStack>

                <HStack spacing={{ base: '2', md: '4' }}>
                  <ProjectDrawer
                    mode="create"
                    onCreate={async (values) => {
                      await mutation.mutateAsync(values);
                      await utils.invalidateQueries(['project.findAll']);
                    }}
                  />
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
                <TabPanel>
                  <Stack spacing="6">
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))
                    ) : (
                      <Card.Empty>No projects</Card.Empty>
                    )}
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Box>
          </Box>
        </Flex>
      </Tabs>
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const trpcContext = await createTRPCContext(context);
  const { session } = trpcContext;

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: trpcContext,
    transformer: superjson,
  });

  await ssg.fetchQuery('project.findAll');

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
    },
  };
};
