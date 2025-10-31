"use client";
import Link from "next/link";

interface BlogCardProps {
  id: number;
  title: string;
  content: string;
  tags?: string;
}

export default function BlogCard({ id, title, content, tags }: BlogCardProps) {
  const preview =
    content.length > 200 ? content.slice(0, 200) + "..." : content;

  return (
    <div className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition bg-white dark:bg-gray-900">
      <h2 className="font-bold text-xl mb-2 text-gray-900 dark:text-white">
        {title}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-4">
        {preview}
      </p>
      {tags && (
        <p className="mt-1 text-sm text-purple-600 dark:text-purple-400">
          {tags}
        </p>
      )}
      <div className="mt-4">
        <Link
          href={`/blogs/${id}`}
          className="inline-block bg-gradient-to-r from-gray-800 to-pink-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}
