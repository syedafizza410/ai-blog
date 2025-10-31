"use client";

import Header from "../../components/header";
import BlogCard from "../../components/blogcard";
import { useEffect, useState } from "react";
import axios from "axios";

interface Blog {
  id: number;
  title: string;
  content: string;
  tags: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axios.get("http://localhost:8000/blogs");
      setBlogs(res.data);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-100 to-pink-200 min-h-screen">
      <Header />
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          All Blogs
        </h2>
        {blogs.length > 0 ? (
          blogs.map((blog) => <BlogCard key={blog.id} {...blog} />)
        ) : (
          <p className="text-center text-gray-600">No blogs found yet.</p>
        )}
      </div>
    </div>
  );
}
