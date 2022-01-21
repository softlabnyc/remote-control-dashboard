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
    input: Yup.object()
      .shape({
        name: Yup.string().required('Project name is required.'),
        location: Yup.string(),
        description: Yup.string(),
        client: Yup.string(),
      })
      .noUnknown(),
    async resolve({ ctx, input }) {
      const project = await ctx.prisma.project.create({
        data: {
          channel: {
            create: {
              key: await nanoid(),
            },
          },
          user: { connect: { id: ctx.session!.user?.id } },
          ...input,
        },
        include: {
          channel: {
            select: {
              key: true,
            },
          },
        },
      });
      return project;
    },
  })
  .query('findAll', {
    async resolve({ ctx }) {
      const projects = await ctx.prisma.project.findMany({
        orderBy: {
          channel: {
            lastUpdated: 'desc',
          },
        },
        include: {
          channel: {
            select: {
              key: true,
            },
          },
        },
      });
      return projects;
    },
  })
  .query('find', {
    input: Yup.number().required().positive().integer(),
    async resolve({ ctx, input: id }) {
      const project = await ctx.prisma.project.findUnique({
        where: { id },
        include: {
          channel: {
            select: {
              key: true,
            },
          },
        },
      });
      if (!project) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No project with id '${id}'`,
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
      }).noUnknown(),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const project = await ctx.prisma.project.update({
        where: { id },
        data,
        include: {
          channel: {
            select: {
              key: true,
            },
          },
        },
      });
      return project;
    },
  })
  .mutation('delete', {
    input: Yup.number().required().positive().integer(),
    async resolve({ input: id, ctx }) {
      await ctx.prisma.project.delete({ where: { id } });
      return id;
    },
  });
