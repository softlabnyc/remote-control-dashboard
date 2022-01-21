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
import { Prisma, Project } from '@prisma/client';
import { Description } from '@/components/Description';

const projectWithChannel = Prisma.validator<Prisma.ProjectArgs>()({
  include: {
    channel: {
      select: {
        key: true,
      },
    },
  },
});
type ProjectWithChannel = Prisma.ProjectGetPayload<typeof projectWithChannel>;

export const ProjectHeader = ({ project }: { project: ProjectWithChannel }) => {
  const updateMutation = trpc.useMutation(['project.update']);
  const deleteMutation = trpc.useMutation(['project.delete']);
  const utils = trpc.useContext();
  const router = useRouter();

  return (
    <Stack spacing={6}>
      <Breadcrumb
        fontSize="sm"
        fontWeight="semibold"
        separator={<Box as={HiChevronRight} color="gray.500" fontSize="lg" />}
      >
        <BreadcrumbItem>
          <Link href="/" passHref>
            <BreadcrumbLink color={mode('blue.600', 'blue.300')}>
              Projects
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{project.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box mx="auto" pos="relative">
        <Stack
          spacing={10}
          direction={{ base: 'column', md: 'row' }}
          align="flex-start"
        >
          <Stack w={{ base: 'full', md: 'auto' }} flex={1} spacing={4}>
            <Heading size="lg">{project.name}</Heading>
            <Grid
              templateColumns={{
                base: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, fit-content(320px))',
              }}
              columnGap="20"
              rowGap={{ base: '8', lg: '14' }}
            >
              <Description title="Client">{project.client}</Description>
              <Description title="Location">{project.location}</Description>
              <Description title="Description">
                {project.description}
              </Description>
              <Description title="Channel Key">
                <Code>{project.channel!.key}</Code>
              </Description>
            </Grid>
          </Stack>
          {project && (
            <ProjectDrawer
              mode="edit"
              values={project}
              onUpdate={async (values) => {
                await updateMutation.mutateAsync({
                  id: project.id,
                  data: values,
                });
                await utils.invalidateQueries(['project.findAll']);
                await utils.invalidateQueries(['project.find', project.id]);
              }}
              onDelete={async () => {
                await deleteMutation.mutateAsync(project.id);
                await utils.invalidateQueries(['project.findAll']);
                router.push('/');
              }}
            />
          )}
        </Stack>
      </Box>
    </Stack>
  );
};
