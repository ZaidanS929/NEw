import Layout from '@components/Layout';
import Link from 'next/link'; // CORRECTED: Use Next.js's built-in Link

export default function Admin() {
  return (
    <Layout>
      <h1>Admin Panel</h1>
      <p>This is the admin panel content.</p>
      <Link href="/">Go to Home</Link>
    </Layout>
  );
}
