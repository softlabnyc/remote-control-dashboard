import { createRouter } from '../createRouter';
import * as Yup from 'yup';
import { Subscription, TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';
import { PrismaClient, Channel, Prisma } from '@prisma/client';
import { EventEmitter } from 'events';
const prisma = new PrismaClient();

interface ChannelEvents {
  update: (key: string, data: Channel) => void;
}

declare interface ChannelEventEmitter {
  on<U extends keyof ChannelEvents>(event: U, listener: ChannelEvents[U]): this;
  once<U extends keyof ChannelEvents>(
    event: U,
    listener: ChannelEvents[U]
  ): this;
  emit<U extends keyof ChannelEvents>(
    event: U,
    ...args: Parameters<ChannelEvents[U]>
  ): boolean;
}

class ChannelEventEmitter extends EventEmitter {}

const ee = new ChannelEventEmitter();

export const channelRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .query('read', {
    input: Yup.string().matches(new RegExp('^[A-Za-z0-9-_.~]*$')).required(),
    async resolve({ ctx, input: key }) {
      const channel = await ctx.prisma.channel.findUnique({
        where: { key },
      });
      if (!channel) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No channel with key '${key}'`,
        });
      }
      return channel;
    },
  })
  .mutation('update', {
    input: Yup.object({
      key: Yup.string().matches(new RegExp('^[A-Za-z0-9-_.~]*$')).required(),
      data: Yup.object({
        data: Yup.mixed().optional(),
      }).noUnknown(),
    }),
    async resolve({ ctx, input }) {
      const { key, data } = input;
      const updatedChannel = await prisma.$transaction(async (prisma) => {
        const channel = await prisma.channel.findUnique({
          where: { key },
        });
        if (!channel) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `No channel with key '${key}'`,
          });
        }
        if (
          !channel.data ||
          typeof channel.data !== 'object' ||
          Array.isArray(channel.data)
        ) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Channel data in unexpected form for key '${key}'`,
          });
        }
        const updatedData = Object.assign(
          {},
          channel.data as Prisma.JsonObject,
          data.data
        );
        const updatedChannel = await prisma.channel.update({
          where: { key },
          data: {
            lastUpdated: new Date(),
            data: updatedData,
          },
        });
        return updatedChannel;
      });
      ee.emit('update', key, updatedChannel);
      return updatedChannel;
    },
  })
  .subscription('onUpdate', {
    input: Yup.string().matches(new RegExp('^[A-Za-z0-9-_.~]*$')).required(),
    resolve({ ctx, input: key }) {
      return new Subscription<Channel>((emit) => {
        const handleUpdate = (k: string, data: Channel) => {
          if (key === k) emit.data(data);
        };

        ee.on('update', handleUpdate);

        return () => {
          ee.off('update', handleUpdate);
        };
      });
    },
  });
