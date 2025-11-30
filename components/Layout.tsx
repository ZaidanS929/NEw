import React from 'react';
import Link from 'next/link'; // Use standard Next.js Link

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Removed all missing imports (router, utils, useAuth) and simplified the structure
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Rouge App</h1>
        <nav>
          <Link href="/" className="mr-4 hover:text-gray-300">Home</Link>
          <Link href="/about" className="mr-4 hover:text-gray-300">About</Link>
          {/* Add more navigation links here if needed */}
        </nav>
      </header>
      <main className="flex-grow p-8">
        {children}
      </main>
      <footer className="bg-gray-200 text-center p-4 text-gray-600">
        &copy; {new Date().getFullYear()} Rouge App
      </footer>
    </div>
  );
}
