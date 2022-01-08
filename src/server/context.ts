import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { getSession, GetSessionParams } from 'next-auth/react';
import { prisma } from '../lib/prisma';

export const createContext = async (params?: GetSessionParams) => {
  const session = await getSession(params);
  // for API-response caching see https://trpc.io/docs/caching
  return {
    session,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
