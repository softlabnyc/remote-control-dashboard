import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { wsLink, createWSClient } from '@trpc/client/links/wsLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { AppRouter } from '../server/routers/_app';
import superjson from 'superjson';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const { APP_URL, WS_URL } = publicRuntimeConfig;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

function getEndingLink() {
  if (!process.browser) {
    return httpBatchLink({
      url: `${APP_URL}/api/trpc`,
    });
  }
  const client = createWSClient({
    url: WS_URL,
  });
  return wsLink<AppRouter>({
    client,
  });
}

export default withTRPC<AppRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        getEndingLink(),
      ],
      transformer: superjson,
    };
  },
})(MyApp);
