import * as trpc from '@trpc/server';
import { getSession, GetSessionParams } from 'next-auth/react';
import { prisma } from '../utils/prisma';

export const createContext = async (params?: GetSessionParams) => {
  const session = await getSession(params);
  return {
    session,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
