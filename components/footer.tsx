"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-pink-900 text-white py-10 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start space-y-8 md:space-y-0">
        
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Blog Website
          </h2>
          <p className="text-gray-300 mt-2 max-w-xs">
            Generate and share intelligent blogs in multiple languages — powered by Our AI.
          </p>
        </div>

        <div className="flex flex-col text-center md:text-left space-y-2">
          <h3 className="text-lg font-semibold text-pink-300">Quick Links</h3>
          <Link href="/" className="hover:text-purple-400 transition">Home</Link>
          <Link href="/create" className="hover:text-purple-400 transition">Create Blog</Link>
          <Link href="/blogs" className="hover:text-purple-400 transition">All Blogs</Link>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-2">
          <h3 className="text-lg font-semibold text-pink-300">Connect</h3>
          <div className="flex gap-4 text-2xl">
            <a href="https://github.com/syedafizza410" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400"><FaGithub /></a>
            <a href="https://www.linkedin.com/in/umm-e-fizza-0416b4239/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400"><FaLinkedin /></a>
            <a href="#" className="hover:text-purple-400"><FaGlobe /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} AI Powered Blog Website. Built with ❤️ by 
        <span className="text-pink-300 font-medium"> Syeda UmmeFizza </span> 
      </div>
    </footer>
  );
}
