import { createRouter } from '../createRouter';
import * as Yup from 'yup';
import { Subscription, TRPCError } from '@trpc/server';
import { PrismaClient, Channel, Prisma } from '@prisma/client';
import { EventEmitter } from 'events';
import { memoizeDebounce } from '../../lib/memoizeDebounce';
const prisma = new PrismaClient();

interface ChannelEvents {
  update: (
    key: string,
    data: { data: Prisma.JsonObject },
    uuid?: string
  ) => void;
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

const updateValue = async (
  key: string,
  name: string,
  value: Prisma.JsonValue | undefined
) => {
  return await prisma.$transaction(async (prisma) => {
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
    const updatedData = Object.assign({}, channel.data as Prisma.JsonObject, {
      [name]: value,
    });
    const updatedChannel = await prisma.channel.update({
      where: { key },
      data: {
        lastUpdated: new Date(),
        data: updatedData,
      },
    });
    return updatedChannel;
  });
};

const debouncedUpdateValue = memoizeDebounce(
  updateValue,
  1000,
  {},
  (key: string, name: string, value: Prisma.JsonValue | undefined) => name
);

export const channelRouter = createRouter()
  // .middleware(async ({ ctx, next }) => {
  //   if (!ctx.session) {
  //     throw new TRPCError({ code: 'UNAUTHORIZED' });
  //   }
  //   return next();
  // })
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
        data: Yup.mixed(),
      }).noUnknown(),
      uuid: Yup.string(),
    }),
    async resolve({ ctx, input }) {
      if (
        !input.data.data ||
        typeof input.data.data !== 'object' ||
        Array.isArray(input.data.data)
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Input data in unexpected form for key '${input.key}'`,
        });
      }

      const { key, data, uuid } = input as {
        key: string;
        data: {
          data: Prisma.JsonObject;
        };
        uuid?: string;
      };
      ee.emit('update', key, data, uuid);

      for (let [name, value] of Object.entries(data.data)) {
        debouncedUpdateValue(key, name, value);
      }

      return input;
    },
  })
  .subscription('onUpdate', {
    input: Yup.object({
      key: Yup.string().matches(new RegExp('^[A-Za-z0-9-_.~]*$')).required(),
      uuid: Yup.string(),
    }),
    resolve({ ctx, input }) {
      const { key, uuid } = input;
      return new Subscription<{ data: Prisma.JsonObject }>((emit) => {
        const handleUpdate = (
          k: string,
          data: { data: Prisma.JsonObject },
          id?: string
        ) => {
          if (typeof uuid !== 'undefined' && uuid === id) return;
          if (key === k) emit.data(data);
        };

        ee.on('update', handleUpdate);

        return () => {
          ee.off('update', handleUpdate);
        };
      });
    },
  });
