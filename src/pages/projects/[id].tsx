import Head from 'next/head';
import { createSSGHelpers } from '@trpc/react/ssg';
import { trpc } from '../../utils/trpc';
import { GetServerSideProps } from 'next';
import { PageLayout } from '../../components/layout/PageLayout';
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Center,
  Code,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
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
import {
  HiChatAlt,
  HiChevronRight,
  HiPencilAlt,
  HiPhone,
  HiPlus,
} from 'react-icons/hi';
import { appRouter } from '../../server/routers/_app';
import superjson from 'superjson';

import { createContext } from '../../server/context';
import { ProjectDrawer } from '../../components/projects/ProjectDrawer';
import { useEffect, useState } from 'react';
import pluralize from 'pluralize';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { Card } from '../../components/Card';
import { useRouter } from 'next/router';
import { useErrorToast } from '../../components/useErrorToast';
import { CardHeader } from '../../components/CardHeader';
import Link from 'next/link';
import { CardContent } from '../../components/CardContent';
import { Property } from '../../components/Property';
import { Prisma } from '@prisma/client';
import { Description } from '@/components/Description';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ChannelData } from '@/components/channels/ChannelData';

export default function Project({
  id,
  channelKey,
}: {
  id: number;
  channelKey: string;
}) {
  const { data: project, error } = trpc.useQuery(['project.find', id]);
  useErrorToast(error);

  return (
    <PageLayout>
      <Box bg={mode('white', 'gray.700')} px="8" pt="8" minH="100vh">
        <Stack maxW="7xl" mx="auto" spacing={10}>
          {project && <ProjectHeader project={project} />}
          {<ChannelData channelKey={channelKey} />}
        </Stack>
      </Box>
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const trpcContext = await createContext(context);
  const { session } = trpcContext;

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  if (!context.query.id) {
    return {
      notFound: true,
    };
  }
  const id = +context.query.id;

  const ssg = await createSSGHelpers({
    router: appRouter,
    ctx: trpcContext,
    transformer: superjson,
  });

  const project = await ssg.fetchQuery('project.find', id);
  const channelKey = project.channel!.key;

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
      id,
      channelKey,
    },
  };
};
