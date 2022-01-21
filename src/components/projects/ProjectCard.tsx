import { Button, Code } from '@chakra-ui/react';
import { Prisma, Project } from '@prisma/client';
import Link from 'next/link';
import { trpc } from '../../utils/trpc';
import { Card } from '../Card';
import { CardContent } from '../CardContent';
import { CardHeader } from '../CardHeader';
import { Property } from '../Property';
import { ProjectDrawer } from './ProjectDrawer';

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

export const ProjectCard = ({ project }: { project: ProjectWithChannel }) => {
  const updateMutation = trpc.useMutation(['project.update']);
  const deleteMutation = trpc.useMutation(['project.delete']);
  const utils = trpc.useContext();

  return (
    <Card>
      <CardHeader
        action={
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
            }}
          />
        }
      >
        <Link href={`/projects/${project.id}`}>
          <a>{project.name}</a>
        </Link>
      </CardHeader>
      <CardContent>
        <Property label="Client" value={project.client} />
        <Property label="Location" value={project.location} />
        <Property label="Description" value={project.description} />
        <Property
          label="Channel Key"
          value={<Code>{project.channel!.key}</Code>}
        />
      </CardContent>
    </Card>
  );
};
