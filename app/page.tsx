"use client";

import Header from "../components/header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-gray-200 to-pink-300 min-h-screen">
      <Header />

      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Welcome to AI Powered Blog Website
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
          Turn your ideas into stunning, AI-generated blogs. Just enter a title, pick a few tags, and let our AI do the writing for you — fast, creative, and ready to share.
        </p>
        <div className="flex gap-4">
          <Link
            href="/create"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-all"
          >
            ✨ Create Blog
          </Link>
          <Link
            href="/blogs"
            className="bg-white hover:bg-gray-100 text-purple-700 px-6 py-3 rounded-lg shadow-md transition-all"
          >
            📚 View Blogs
          </Link>
        </div>
      </section>
    </div>
  );
}
