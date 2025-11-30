import Layout from '@components/Layout';
import Link from 'next/link'; // 

export default function Article() {
  return (
    <Layout>
      <h1>Article Page</h1>
      <p>This is the article content.</p>
      <Link href="/">Go to Home</Link>
    </Layout>
  );
}
