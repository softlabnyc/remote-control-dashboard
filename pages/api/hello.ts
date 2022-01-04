// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import type { User } from '@prisma/client';

type Data = {
  users: User[];
};

const hello = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ users });
};

export default hello;
