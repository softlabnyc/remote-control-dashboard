import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HTMLChakraProps,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import type { FieldProps } from 'formik';
import { useRouter } from 'next/router';
import * as React from 'react';
import * as Yup from 'yup';

interface Props extends HTMLChakraProps<'a'> {
  csrfToken: string | undefined;
}

const SigninSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address.')
    .required('Email is required.'),
});

const ERRORS: { [errorType: string]: string } = {
  Configuration:
    'There is a problem with the server configuration. Please contact the site administrator.',
  AccessDenied: 'Access denied. You do not have permission to sign in.',
  Verification:
    'The sign in link is no longer valid. It may have been used already or it may have expired.',
  EmailCreateAccount: 'Unable to create email account. Please try again.',
  EmailSignin: 'Unable to send verification email. Please try again.',
  SessionRequired: 'Please sign in to access this page.',
  default: 'Unable to sign in. Please try again.',
};

export const LoginForm = ({ csrfToken, ...props }: Props) => {
  const ref = React.useRef<HTMLFormElement>(null);

  const { query } = useRouter();
  const toast = useToast();

  React.useEffect(() => {
    const error =
      query.error && (ERRORS[query.error as string] ?? ERRORS.default);

    if (error) {
      toast({
        title: error,
        status: 'error',
        isClosable: true,
      });
    }
  }, [query, toast]);

  return (
    <Formik
      initialValues={{
        csrfToken,
        email: '',
      }}
      validationSchema={SigninSchema}
      onSubmit={() => {
        ref.current!.submit();
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form ref={ref} method="post" action="/api/auth/signin/email">
          <Field type="hidden" name="csrfToken" />
          <Stack spacing="6">
            <Field name="email">
              {({ field }: FieldProps<string>) => (
                <FormControl isInvalid={!!(errors.email && touched.email)}>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                  />
                  {errors.email && touched.email ? (
                    <FormErrorMessage lineHeight={'normal'}>
                      {errors.email}
                    </FormErrorMessage>
                  ) : (
                    <FormHelperText>
                      Enter your email address to receive a signin link.
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            </Field>

            <Button
              isLoading={isSubmitting}
              type="submit"
              colorScheme="blue"
              size="lg"
              fontSize="md"
            >
              Sign In
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
