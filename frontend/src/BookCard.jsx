import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BookCard({ book, token, currentUserId }) {
  // ✅ Use environment variable for backend base URL
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const [showContact, setShowContact] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize wishlist
  useEffect(() => {
    setWishlist(book.wishlist?.some(id => id.toString() === currentUserId) || false);
  }, [book.wishlist, currentUserId]);

  const toggleWishlist = async () => {
    if (!token) return alert("Please login first!");
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/books/wishlist/${book._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success && res.data.book) {
        setWishlist(res.data.book.wishlist?.some(id => id.toString() === currentUserId));
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      alert("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  // Fix image URL
  const imageUrl =
    book.imageUrl && book.imageUrl.startsWith("/")
      ? `${backendUrl}${book.imageUrl}`
      : book.imageUrl || "/default-book.png";

  return (
    <div className="border rounded-lg shadow-md overflow-hidden w-full max-w-xs bg-gray-800 text-white">
      <img
        src={imageUrl}
        alt={book.title || "Book Cover"}
        className="w-full h-60 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold">{book.title}</h2>
        <p className="text-gray-300">{book.author || "Unknown Author"}</p>
        {book.description && (
          <p className="text-gray-400 text-sm mt-1">{book.description}</p>
        )}

        <div className="mt-2 flex justify-between items-center">
          {book.price !== undefined && (
            <span className="font-semibold">₹{book.price}</span>
          )}
          <span className="text-sm bg-gray-700 px-2 py-1 rounded capitalize">
            {book.type} {book.condition ? `| ${book.condition}` : ""}
          </span>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setShowContact(!showContact)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {showContact ? "Hide Contact" : "Contact Seller"}
          </button>

          <button
            onClick={toggleWishlist}
            disabled={loading}
            className={`px-4 py-2 rounded transition ${
              wishlist
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {wishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {showContact && book.seller && (
          <div className="mt-2 text-gray-300 text-sm">
            <p>
              <strong>Name:</strong> {book.seller.fullName || "NA"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a
                href={`mailto:${book.seller.email}`}
                className="text-blue-400 underline"
              >
                {book.seller.email || "NA"}
              </a>
            </p>
            <p>
              <strong>Mobile:</strong>{" "}
              <a
                href={`tel:${book.seller.mobile}`}
                className="text-blue-400 underline"
              >
                {book.seller.mobile || "NA"}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
