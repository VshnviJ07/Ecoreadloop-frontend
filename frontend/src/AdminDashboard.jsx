// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/books`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBooks(res.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/admin/book/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBooks();
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user._id} className="flex justify-between mb-1">
                <span>
                  {user.fullName} ({user.email})
                </span>
                <button
                  className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                  onClick={() => deleteUser(user._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Books</h2>
        {books.length === 0 ? (
          <p>No books found.</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book._id} className="flex justify-between mb-1">
                <span>
                  {book.title} by {book.author}
                </span>
                <button
                  className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                  onClick={() => deleteBook(book._id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
