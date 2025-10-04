import React from "react";
import { useNavigate } from "react-router-dom";

// ✅ Category definitions (backend name matches route param)
const categories = [
  { name: "Education", backend: "Education" },
  { name: "Competition", backend: "Competition" },
  { name: "Fiction", backend: "Fiction" },
  { name: "Non-Fiction", backend: "Non-Fiction" },
  { name: "Comics", backend: "Comics" },
  { name: "Biography", backend: "Biography" },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        📚 Book Categories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.backend}
            className="relative rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg cursor-pointer hover:shadow-2xl transition-transform duration-300 hover:scale-105 flex items-center justify-center h-40"
            onClick={() =>
              navigate(`/categories/${encodeURIComponent(cat.backend)}`)
            }
          >
            <h2 className="text-xl font-bold text-white text-center">
              {cat.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
