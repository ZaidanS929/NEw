import Layout from '@components/Layout';
import Link from 'next/link'; // 

export default function Home() {
  return (
    <Layout>
      <h1>Welcome Home</h1>
      <p>This is the home page content.</p>
      <Link href="/about">Go to About</Link>
    </Layout>
  );
}
