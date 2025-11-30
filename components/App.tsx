import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';

// This component wraps your entire application.
// It provides the session context for NextAuth.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
