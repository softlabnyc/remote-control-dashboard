import * as trpc from '@trpc/server';
import { getSession, GetSessionParams } from 'next-auth/react';
import { prisma } from '../lib/prisma';

export const createTRPCContext = async (params?: GetSessionParams) => {
  const session = await getSession(params);
  return {
    session,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createTRPCContext>;
