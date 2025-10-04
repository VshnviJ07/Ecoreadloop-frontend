import { useState, useEffect } from "react";

export default function OthersBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${backendUrl}/api/book/others`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch books");

        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [backendUrl]);

  const addToWishlist = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/wishlist/add/${bookId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        alert("Book added to wishlist ✅");
      } else {
        alert(data.message || "Failed to add");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-red-400 text-center mt-10">
        {error || "Failed to load books"}
      </p>
    );

  return (
    <div className="p-6 min-h-[70vh]">
      <h1 className="text-center text-3xl font-semibold text-white mb-8">
        Other Users’ Books ({books.length})
      </h1>

      {books.length === 0 ? (
        <p className="text-center text-white">
          No books uploaded by other users yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="relative border rounded-lg overflow-hidden backdrop-blur-md bg-white/30 shadow-lg hover:shadow-xl transition-all"
            >
              <img
                src={
                  book.imageUrl
                    ? `${backendUrl}${book.imageUrl}`
                    : "https://via.placeholder.com/150"
                }
                alt={`Cover of ${book.title}`}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-white truncate">
                  {book.title}
                </h3>
                <p className="text-sm text-white">{book.author}</p>
                <p className="text-blue-200 mt-2 font-medium">
                  {book.type === "Sell"
                    ? `₹${book.price}`
                    : book.type === "Rent"
                    ? `₹${book.price} / ${book.rentDuration}`
                    : "Free (Donate)"}
                </p>
                <button
                  onClick={() => addToWishlist(book._id)}
                  className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
