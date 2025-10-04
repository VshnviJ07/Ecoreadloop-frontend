import { useState } from "react";

const initialForm = {
  title: "",
  author: "",
  category: "Fiction", // Default backend enum
  description: "",
  type: "Sell",
  price: "",
  rentDuration: "",
};

const categories = [
  "Fiction",
  "Non-Fiction",
  "Education",
  "Competition",
  "Comics",
  "Biography",
];

export default function UploadBook() {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!image) {
      setError("Please select an image.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to upload books.");
        return;
      }

      const data = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) data.append(key, form[key]);
      });
      data.append("image", image);

      const res = await fetch(`${backendUrl}/api/books/add`, {
        method: "POST",
        body: data, // FormData
        headers: {
          Authorization: `Bearer ${token}`, // Only Authorization, no content-type for FormData
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      const responseData = await res.json();

      if (responseData.success) {
        setSuccess("Book uploaded successfully!");
        setForm(initialForm);
        setImage(null);
      } else {
        setError(responseData.message || "Failed to upload book.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Server error occurred.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload a Book</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label htmlFor="title" className="block mb-1 font-semibold">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="author" className="block mb-1 font-semibold">
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={form.author}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-1 font-semibold">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-semibold">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label htmlFor="type" className="block mb-1 font-semibold">
            Type *
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="Sell">Sell</option>
            <option value="Rent">Rent</option>
            <option value="Donate">Donate</option>
          </select>
        </div>

        {(form.type === "Sell" || form.type === "Rent") && (
          <div>
            <label htmlFor="price" className="block mb-1 font-semibold">
              {form.type === "Sell" ? "Price (₹)" : "Rent Price (₹)"}
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        )}

        {form.type === "Rent" && (
          <div>
            <label htmlFor="rentDuration" className="block mb-1 font-semibold">
              Rent Duration
            </label>
            <input
              id="rentDuration"
              name="rentDuration"
              type="text"
              value={form.rentDuration}
              onChange={handleChange}
              placeholder="E.g. 2 weeks"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        )}

        <div>
          <label htmlFor="image" className="block mb-1 font-semibold">
            Book Image *
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Upload Book
        </button>
      </form>
    </div>
  );
}
