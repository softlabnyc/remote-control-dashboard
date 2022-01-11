import { createRouter } from '../createRouter';
import * as Yup from 'yup';
import { TRPCError } from '@trpc/server';
import { nanoid } from 'nanoid';

export const projectRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next();
  })
  .mutation('create', {
    input: Yup.object().shape({
      name: Yup.string().required('Project name is required.'),
      location: Yup.string(),
      description: Yup.string(),
      client: Yup.string(),
    }),
    async resolve({ ctx, input }) {
      const post = await ctx.prisma.project.create({
        data: {
          channelKey: await nanoid(),
          user: { connect: { id: ctx.session!.user.id } },
          ...input,
        },
      });
      return post;
    },
  })
  .query('findAll', {
    async resolve({ ctx }) {
      return ctx.prisma.project.findMany({
        orderBy: [
          {
            valuesUpdatedAt: 'desc',
          },
        ],
      });
    },
  })
  .query('find', {
    input: Yup.number().required().positive().integer(),
    async resolve({ ctx, input: id }) {
      const project = await ctx.prisma.project.findUnique({
        where: { id },
      });
      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return project;
    },
  })
  .mutation('update', {
    input: Yup.object({
      id: Yup.number().required().positive().integer(),
      data: Yup.object({
        name: Yup.lazy((name) =>
          typeof name === 'undefined'
            ? Yup.string().optional()
            : Yup.string().required()
        ),
        location: Yup.string().optional(),
        description: Yup.string().optional(),
        client: Yup.string().optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const post = await ctx.prisma.project.update({
        where: { id },
        data,
      });
      return post;
    },
  })
  .mutation('delete', {
    input: Yup.number().required().positive().integer(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.project.delete({ where: { id } });
      return id;
    },
  });
