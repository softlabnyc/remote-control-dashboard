import { Button } from '@chakra-ui/react';
import type { Project } from '@prisma/client';
import { trpc } from '../../lib/trpc';
import { Card } from '../Card';
import { CardContent } from '../CardContent';
import { CardHeader } from '../CardHeader';
import { Property } from '../Property';
import ProjectDrawer from './ProjectDrawer';

export const ProjectCard = ({ project }: { project: Project }) => {
  const updateMutation = trpc.useMutation(['project.update']);
  const deleteMutation = trpc.useMutation(['project.delete']);
  const utils = trpc.useContext();

  return (
    <Card>
      <CardHeader
        title={project.name}
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
      />
      <CardContent>
        <Property label="Client" value={project.client ?? ''} />
        <Property label="Location" value={project.location ?? ''} />
        <Property label="Description" value={project.description ?? ''} />
        <Property label="Channel Key" value={project.channelKey ?? ''} />
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
