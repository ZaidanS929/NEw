import Layout from '@components/Layout';
import Link from 'next/link'; // 

export default function Fashion() {
  return (
    <Layout>
      <h1>Fashion Page</h1>
      <p>This is the fashion content.</p>
      <Link href="/">Go to Home</Link>
    </Layout>
  );
}
