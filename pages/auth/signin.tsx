import { getCsrfToken } from 'next-auth/react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

export default function SignIn({
  csrfToken,
}: {
  csrfToken: string | undefined;
}) {
  const { query } = useRouter();

  const errors: { [errorType: string]: string } = {
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

  const error =
    query.error && (errors[query.error as string] ?? errors.default);

  return (
    <>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      <form method="post" action="/api/auth/signin/email">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Email Address
          <input type="email" id="email" name="email" />
        </label>
        <button type="submit">Sign In with Email</button>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
};
