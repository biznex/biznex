'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BoltIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const parts = host.split('.');

      if (parts[0].toLowerCase() !== 'localhost') {
        router.push('/subdomain-login');
      }
    }
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-white p-6 font-sans">
      
      {/* Top small rectangle button */}
      <button className="flex items-center bg-[#E6E0FF] text-[#5D46E7] px-4 py-2 rounded-md text-sm font-semibold mb-8" style={{ fontFamily: 'helvetica-medium' }}>
        <BoltIcon className="w-5 h-5 mr-2" />
        Simplified Management
      </button>

      {/* Main Centered Text */}
      <h1 className="text-4xl md:text-6xl leading-tight text-center text-black mb-10" style={{ fontFamily: 'helvetica-bold' }}>
        Enabling businesses <br />
        <span style={{ fontFamily: 'helvetica-bold', color: '#5D46E7' }}>kickstart</span> their <br />
        digital journey
      </h1>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        {/* Try Biznex Button */}
        <button className="bg-[#5D46E7] text-white px-6 py-3 rounded-md font-medium hover:bg-[#4b36c0] transition" style={{ fontFamily: 'helvetica-medium' }}>
          Try Biznex
        </button>

        {/* Contact Button */}
        <button className="bg-white text-black border border-black px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition" style={{ fontFamily: 'helvetica-medium' }}>
          Contact
        </button>
      </div>

    </main>
  );
}