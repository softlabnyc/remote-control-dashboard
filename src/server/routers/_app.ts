import superjson from 'superjson';
import { createRouter } from '../createRouter';
import { projectRouter } from './project';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('project.', projectRouter);

export type AppRouter = typeof appRouter;
