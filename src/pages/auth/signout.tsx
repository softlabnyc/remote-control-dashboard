import { Button, Heading, Stack } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { getSession, signOut, useSession } from 'next-auth/react';
import AuthLayout from '../../components/AuthLayout';
import { Card } from '../../components/Card';

export default function SignOut() {
  const { data: session } = useSession();

  return (
    <AuthLayout>
      <Stack spacing="6">
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          Sign Out
        </Heading>
        <Card>
          <Stack spacing="6">
            <p>Goodbye, {session!.user?.email}</p>
            <Button
              onClick={() => signOut({ callbackUrl: '/' })}
              colorScheme="blue"
              size="lg"
              fontSize="md"
            >
              Sign Out
            </Button>
          </Stack>
        </Card>
      </Stack>
    </AuthLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session: await getSession(context),
    },
  };
};
