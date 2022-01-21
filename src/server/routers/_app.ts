import { Subscription } from '@trpc/server';
import superjson from 'superjson';
import { createRouter } from '../createRouter';
import { channelRouter } from './channel';
import { projectRouter } from './project';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('project.', projectRouter)
  .merge('channel.', channelRouter);

export type AppRouter = typeof appRouter;
