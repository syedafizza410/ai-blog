"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-800 to-pink-900 relative">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Blog Website
      </h1>

      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className="text-white hover:text-purple-400 transition">Home</Link>
        <Link href="/create" className="text-white hover:text-purple-400 transition">Create</Link>
        <Link href="/blogs" className="text-white hover:text-purple-400 transition">Blogs</Link>
      </nav>

      <button
        className="md:hidden text-white text-3xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gradient-to-b from-gray-800 to-pink-900 flex flex-col items-center space-y-4 py-6 md:hidden shadow-lg z-50">
          <Link href="/" className="text-white text-lg hover:text-purple-400 transition" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/create" className="text-white text-lg hover:text-purple-400 transition" onClick={() => setMenuOpen(false)}>Create</Link>
          <Link href="/blogs" className="text-white text-lg hover:text-purple-400 transition" onClick={() => setMenuOpen(false)}>Blogs</Link>
        </div>
      )}
    </header>
  );
}
