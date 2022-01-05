import Head from 'next/head';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  const isSignedIn = status !== 'loading' && session;

  return (
    <div>
      <Head>
        <title>Hello, world!</title>
        <meta name="description" content="Hello, world description." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Hello, world!</h1>
        <Link href="/">
          <a>Home</a>
        </Link>
        {isSignedIn ? (
          <div>
            Hello, {session.user?.email}
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
        ) : (
          <Link href="/api/auth/signin">
            <a>Sign In</a>
          </Link>
        )}
      </main>
    </div>
  );
}
