import Layout from '@components/Layout';
import Link from 'next/link'; // 
export default function CurrentEvents() {
  return (
    <Layout>
      <h1>Current Events</h1>
      <p>This is the current events content.</p>
      <Link href="/">Go to Home</Link>
    </Layout>
  );
}
