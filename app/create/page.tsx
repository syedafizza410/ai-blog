"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Header from "../../components/header";

export default function CreateBlog() {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [language, setLanguage] = useState("English");
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); // ✅ Loading state

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/languages`);
        setLanguages(res.data.languages);
      } catch (err) {
        console.error("Error fetching languages:", err);
      }
    };
    fetchLanguages();
  }, []);

  const generateBlog = async () => {
    try {
      setLoading(true); // start loading
      setContent("");   // clear previous content
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/generate`,
        {
          prompt: topic,
          language: language,
        }
      );
      setContent(res.data.content || "No content generated.");
    } catch (err) {
      console.error(err);
      setContent("Error generating content. Please try again.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  const saveBlog = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/blogs`, {
        title,
        content,
        tags,
      });
      alert("Blog saved successfully!");
      setTopic("");
      setTitle("");
      setContent("");
      setTags("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-pink-200 min-h-screen">
      <Header />
      <div className="p-8 max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Your Blog
        </h2>

        <input
          type="text"
          placeholder="Enter topic (any language)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border p-2 w-full rounded text-black"
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 w-full rounded text-black"
        >
          <option disabled>Select blog language</option>
          {languages.length > 0
            ? languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))
            : <option>Loading languages...</option>}
        </select>

        <button
          onClick={generateBlog}
          className="bg-gradient-to-r from-gray-800 to-pink-900 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Content
        </button>

        {/* ✅ Loading indicator */}
        {loading && (
          <div className="text-center text-gray-700 font-semibold mt-4">
            📝 AI is generating content, please wait...
          </div>
        )}

        {/* ✅ Show content only when generated */}
        {content && !loading && (
          <div className="space-y-4 mt-4">
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full rounded text-black"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border p-2 w-full rounded text-black"
            />

            <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800 prose prose-sm md:prose lg:prose-lg">
              <ReactMarkdown
                components={{
                  li: ({ node, ...props }) => (
                    <li className="font-bold" {...props} />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            <button
              onClick={saveBlog}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
