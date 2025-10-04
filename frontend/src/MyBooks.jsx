import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import BackgroundVideo from "./BackgroundVideo";
import Navbar from "./Navbar";

export default function MyBooks({ token, currentUserId }) {
  const [uploaded, setUploaded] = useState({ sell: [], rent: [], donate: [] });
  const [purchased, setPurchased] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fallbackImage = "/default-book.png";
  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const authToken = token || localStorage.getItem("token");
        if (!authToken) throw new Error("No token found");

        const res = await axios.get(`${backendUrl}/api/books/mybooks`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (res.data.success) {
          setUploaded({
            sell: res.data.uploaded?.sell || [],
            rent: res.data.uploaded?.rent || [],
            donate: res.data.uploaded?.donate || [],
          });
          setPurchased(res.data.purchased || []);
        }
      } catch (err) {
        console.error("❌ Error fetching MyBooks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [token, backendUrl]);

  const renderBookList = (books) => {
    if (!books || books.length === 0)
      return <p className="text-center text-gray-300 mt-4">No books available</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4 justify-items-center">
        {books.map((b) => {
          const imageUrl =
            b.imageUrl && b.imageUrl.startsWith("/")
              ? `${backendUrl}${b.imageUrl}`
              : b.imageUrl || fallbackImage;

          return (
            <BookCard
              key={b._id}
              book={{ ...b, imageUrl }}
              token={token}
              currentUserId={currentUserId}
            />
          );
        })}
      </div>
    );
  };

  if (loading) return <p className="text-center mt-20 text-white">Loading...</p>;

  const cardColors = {
    sell: "bg-red-500/20 border-red-400",
    rent: "bg-yellow-500/20 border-yellow-400",
    donate: "bg-green-500/20 border-green-400",
    purchased: "bg-blue-500/20 border-blue-400",
  };

  const cardTitles = { sell: "Sell", rent: "Rent", donate: "Donate", purchased: "Purchased" };
  const cardData = { sell: uploaded.sell, rent: uploaded.rent, donate: uploaded.donate, purchased };

  return (
    <div className="relative min-h-screen flex text-white">
      {/* Navbar */}
      <div className="flex-shrink-0 z-30">
        <Navbar />
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-10 overflow-x-hidden flex flex-col items-center">
        <BackgroundVideo />

        <div className="relative z-20 pt-6 px-6 w-full max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-8">📚 My Books Dashboard</h2>

          {!selectedCategory && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {Object.keys(cardData).map((type) => (
                <div
                  key={type}
                  className={`border ${cardColors[type]} p-6 rounded shadow-lg hover:shadow-xl cursor-pointer flex flex-col items-center justify-start transition backdrop-blur-sm w-full max-w-xs`}
                  onClick={() => setSelectedCategory(type)}
                >
                  <h3 className="text-2xl font-semibold mb-4">{cardTitles[type]}</h3>
                  {cardData[type].length > 0 && (
                    <div className="flex gap-2 mt-3 justify-center overflow-x-auto w-full">
                      {cardData[type].slice(0, 2).map((b) => {
                        const imageUrl =
                          b.imageUrl && b.imageUrl.startsWith("/")
                            ? `${backendUrl}${b.imageUrl}`
                            : b.imageUrl || fallbackImage;

                        return (
                          <img
                            key={b._id}
                            src={imageUrl}
                            alt={b.title || "Book"}
                            className="w-16 h-24 object-cover rounded"
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedCategory && (
            <div className="mt-8 w-full">
              <button
                className="mb-4 px-4 py-2 bg-gray-200/30 text-black rounded hover:bg-gray-300/40 transition"
                onClick={() => setSelectedCategory(null)}
              >
                ← Back
              </button>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                {cardTitles[selectedCategory]} Books
              </h3>
              {renderBookList(cardData[selectedCategory])}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
