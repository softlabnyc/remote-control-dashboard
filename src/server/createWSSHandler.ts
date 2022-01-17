import { applyWSSHandler } from '@trpc/server/adapters/ws';
import type { WebSocketServer } from 'ws';
import { appRouter } from './routers/_app';
import { createContext } from './context';

export default function createWSSHandler(wss: WebSocketServer) {
  return applyWSSHandler({
    wss,
    router: appRouter,
    createContext,
  });
}
