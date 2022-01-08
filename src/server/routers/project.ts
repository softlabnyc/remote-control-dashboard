import { createRouter } from '../createRouter';
import * as Yup from 'yup';
import { TRPCError } from '@trpc/server';
import { getSession } from 'next-auth/react';

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
          channelKey: '',
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
        select: {
          id: true,
        },
      });
    },
  })
  .query('find', {
    input: Yup.object({
      id: Yup.number().required().positive().integer(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
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
  // .mutation('update', {
  //   input: Yup.object({
  //     id: Yup.number().required().positive().integer(),
  //     data: Yup.object({
  //       title: z.string().min(1).max(32).optional(),
  //       text: z.string().min(1).optional(),
  //     }),
  //   }),
  //   async resolve({ ctx, input }) {
  //     const { id, data } = input;
  //     const post = await ctx.prisma.project.update({
  //       where: { id },
  //       data,
  //     });
  //     return post;
  //   },
  // })
  .mutation('delete', {
    input: Yup.number().required().positive().integer(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.project.delete({ where: { id } });
      return id;
    },
  });
