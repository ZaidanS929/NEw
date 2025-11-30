import { getSession, useSession, signIn, signOut } from 'next-auth/react';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Sign in to view Rouge</h1>
        <button onClick={() => signIn('google')}>Sign in with Google</button>
        <button onClick={() => signIn('apple')}>Sign in with Apple</button>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Rouge (Protected)</title>
      </Head>
      <header style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
        <span>Signed in as {session.user?.email || session.user?.name}</span>
        <button style={{ marginLeft: 12 }} onClick={() => signOut()}>Sign out</button>
      </header>
      <main>
        {/* Load the original SPA's index.html inside an iframe to keep original behavior */}
        <iframe src="/rouge-app/index.html" style={{ width: '100%', height: '90vh', border: 'none' }} title="Rouge App" />
      </main>
    </>
  )
}
