import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookCard from "./BookCard";

export default function CategoryPage() {
  const { backendCategory } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Use environment variable for backend
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchBooks = async () => {
      if (!backendCategory) return;
      setLoading(true);

      try {
        const categoryParam = encodeURIComponent(backendCategory);
        const res = await axios.get(`${API_BASE}/api/books/category/${categoryParam}`);

        if (res.data.success && Array.isArray(res.data.books)) {
          setBooks(res.data.books);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("❌ Failed to load books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [backendCategory, API_BASE]);

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        {backendCategory ? backendCategory.replace(/,/g, " / ") : "Category"}
      </h1>

      {loading ? (
        <p className="text-center mt-10 text-white">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-400">
          No books available in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              token={localStorage.getItem("token")}
              currentUserId={localStorage.getItem("userId") || null} // safe default
            />
          ))}
        </div>
      )}
    </div>
  );
}
