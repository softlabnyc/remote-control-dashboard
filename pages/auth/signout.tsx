import { signOut, useSession } from 'next-auth/react';

export default function SignOut() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
  );
}
