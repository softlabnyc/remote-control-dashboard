import { Heading, Stack } from '@chakra-ui/react';
import AuthLayout from '../../components/AuthLayout';
import { Card } from '../../components/Card';

export default function Verify() {
  return (
    <AuthLayout>
      <Stack spacing="6">
        <Heading textAlign="center" size="xl" fontWeight="extrabold">
          Sign In
        </Heading>
        <Card>
          <Stack spacing="6">
            <p>A temporary sign in link has been sent to your email address.</p>
            <p>Please check your inbox.</p>
          </Stack>
        </Card>
      </Stack>
    </AuthLayout>
  );
}
