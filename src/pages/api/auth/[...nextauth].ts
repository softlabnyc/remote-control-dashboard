import { NextApiHandler } from 'next';
import NextAuth, { Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '../../../utils/prisma';
import { User } from '@prisma/client';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/signin',
    verifyRequest: '/auth/verify',
  },
  callbacks: {
    async session({ session, user }: { session: Session; user: any }) {
      if (session.user) {
        session.user.id = (user as User).id;
      }
      return session;
    },
  },
};
