import Layout from '@components/Layout';
import Link from 'next/link'; // CORRECTED: Use Next.js's built-in Link

export default function About() {
  return (
    <Layout>
      <h1>About Us</h1>
      <p>This is the about page content.</p>
      <Link href="/">Go to Home</Link>
    </Layout>
  );
}
