import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CategoryPage() {
  const { backendCategory } = useParams(); // matches the route param
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Use environment variable for backend
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/books/category/${encodeURIComponent(backendCategory)}`
        );
        if (res.data.success && Array.isArray(res.data.books)) {
          setBooks(res.data.books);
        } else {
          setBooks([]);
        }
      } catch (err) {
        console.error("❌ Error fetching category books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBooks();
  }, [backendCategory, API_BASE]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-white">
        Loading...
      </div>
    );
  }

  if (!books.length) {
    return (
      <div className="p-6 min-h-[70vh] text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold mb-4">{backendCategory} Books</h1>
        <p className="text-xl opacity-80">No books found in this category.</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-[70vh]">
      <h1 className="text-3xl font-semibold text-white mb-8">{backendCategory} Books</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {books.map((book) => {
          const imageUrl =
            book.imageUrl && book.imageUrl.startsWith("/")
              ? `${API_BASE}${book.imageUrl}`
              : book.imageUrl || "/default-book.png";

          return (
            <div
              key={book._id}
              className="bg-gray-800 text-white p-4 rounded-xl shadow-md relative"
            >
              <img
                src={imageUrl}
                alt={book.title || "Book Cover"}
                className="h-40 w-full object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold mb-1">{book.title}</h2>
              <p className="text-sm opacity-80">by {book.author || "Unknown"}</p>
              {book.description && <p className="mt-2 text-sm">{book.description}</p>}

              {book.seller && (
                <div className="mt-3 text-sm text-gray-300">
                  <p className="font-semibold">Seller Info:</p>
                  <p>Name: {book.seller.fullName || "NA"}</p>
                  <p>Email: {book.seller.email || "NA"}</p>
                  <p>Mobile: {book.seller.mobile || "NA"}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
