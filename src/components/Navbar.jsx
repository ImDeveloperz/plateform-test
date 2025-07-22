'use client';
import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Web4Jobs Logo"
              width={100}
              height={100}
              className=""
            />
          </Link>

          {/* Auth Button */}
          {status === "loading" ? (
            // Loading state
            <div className="px-4 py-2">
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : session ? (
            // Logged in - show Logout
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            // Not logged in - show Login
            <Link href="/login">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <User className="h-4 w-4" />
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}