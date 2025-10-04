import { useEffect, useState } from "react";
import axios from "axios";

export default function Wishlist({ token: propToken }) {
  const backendUrl = "http://localhost:5000";
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingBookId, setUpdatingBookId] = useState(null);

  const token = propToken || localStorage.getItem("token");

  // Fetch wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${backendUrl}/api/books/my-wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(Array.isArray(res.data.wishlist) ? res.data.wishlist : []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const toggleWishlist = async (bookId) => {
    if (!token) return alert("Please sign in to manage wishlist");

    setUpdatingBookId(bookId);
    setWishlist((prev) => prev.filter((b) => b._id !== bookId)); // Optimistic UI

    try {
      const res = await axios.post(
        `${backendUrl}/api/books/wishlist/${bookId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.success) {
        alert(res.data.message || "Failed to update wishlist.");
        // Refetch wishlist on failure
        const fallbackRes = await axios.get(`${backendUrl}/api/books/my-wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(Array.isArray(fallbackRes.data.wishlist) ? fallbackRes.data.wishlist : []);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      alert("Failed to update wishlist. Try again.");
      // Refetch wishlist on failure
      try {
        const fallbackRes = await axios.get(`${backendUrl}/api/books/my-wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(Array.isArray(fallbackRes.data.wishlist) ? fallbackRes.data.wishlist : []);
      } catch {}
    } finally {
      setUpdatingBookId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-white">
        Loading...
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="p-6 min-h-[70vh] flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-semibold mb-4">Wishlist (0)</h1>
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="Empty Wishlist"
          className="w-48 mb-6"
        />
        <p className="text-2xl font-medium mb-2">Your wishlist is empty 😢</p>
        <p className="text-center max-w-md">
          Add some books to your wishlist and they will show up here!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-[70vh]">
      <h1 className="text-center text-3xl font-semibold text-white mb-8">
        Wishlist ({wishlist.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((book) => {
          const imageUrl =
            book.imageUrl && book.imageUrl.startsWith("/")
              ? `${backendUrl}${book.imageUrl}`
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
                  <p>Name: {book.seller.fullName}</p>
                  <p>Email: {book.seller.email}</p>
                  <p>Mobile: {book.seller.mobile}</p>
                </div>
              )}

              <button
                onClick={() => toggleWishlist(book._id)}
                disabled={updatingBookId === book._id}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingBookId === book._id ? "Updating..." : "Remove"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
