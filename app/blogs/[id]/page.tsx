"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Header from "../../../components/header";

interface Blog {
    id: number;
    title: string;
    content: string;
    tags: string;
}

export default function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/blogs/${id}`);
                setBlog(res.data);
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };
        if (id) fetchBlog();
    }, [id]);

    if (!blog)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200">
                <p className="text-2xl font-semibold text-gray-700 animate-pulse">
                    Loading your blog...
                </p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-purple-100">
            <Header />
            <div className="p-8 max-w-3xl mx-auto space-y-6 bg-white/90 shadow-2xl rounded-2xl backdrop-blur-md border border-purple-200">
                <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-center drop-shadow-lg">
                    {blog.title}
                </h1>

                <p className="text-center text-sm text-gray-600 italic mt-2">
                    ✨ Tags:{" "}
                    <span className="text-purple-700 font-medium">{blog.tags}</span>
                </p>

                <hr className="border-t-2 border-purple-300 my-4" />

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-purple-700 prose-strong:text-pink-600 prose-a:text-indigo-600 hover:prose-a:text-indigo-800">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>

            </div>
        </div>
    );
}
