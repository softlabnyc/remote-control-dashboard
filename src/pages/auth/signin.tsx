import { Heading, Stack } from '@chakra-ui/react';
import * as React from 'react';
import { Card } from '../../components/Card';
import { LoginForm } from '../../components/auth/LoginForm';
import { getCsrfToken, getSession } from 'next-auth/react';
import type { GetServerSideProps } from 'next';
import { AuthLayout } from '../../components/layout/AuthLayout';

export default function SignIn({
  csrfToken,
}: {
  csrfToken: string | undefined;
}) {
  return (
    <AuthLayout>
      <Stack spacing="6">
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          Sign In
        </Heading>
        <Card>
          <LoginForm csrfToken={csrfToken} />
        </Card>
      </Stack>
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
};
