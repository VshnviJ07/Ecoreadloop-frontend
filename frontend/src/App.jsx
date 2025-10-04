import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth Pages
import Signin from "./Signin";
import Signup from "./Signup";
import ForgotPasswordFlow from "./ForgotPasswordFlow";

// Main App Pages
import HomePage from "./HomePage";
import Profile from "./Profile";
import UploadBook from "./UploadBook";
import Contact from "./Contact";
import Help from "./Help";
import Feedback from "./Feedback";
import Wishlist from "./wishlist";
import MyBook from "./MyBooks";

import Categories from "./Categories";
import CategoryPage from "./CategoryPage";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import BackgroundVideo from "./BackgroundVideo";
import Navbar from "./Navbar";

import { ProtectedRoute } from "./ProtectedRoute"; // ✅ import your protected route

// ----- Main Layout -----
const MainLayout = ({ children }) => {
  return (
    <div className="relative w-full h-screen flex">
      <BackgroundVideo />
      {/* Sidebar */}
      <Navbar />
      {/* Main content with margin on desktop */}
      <div className="flex-1 lg:ml-64 relative z-10 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (public, no layout) */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordFlow />} />

        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Main App Routes with Layout */}
        <Route
          path="/*"
          element={
            <MainLayout>
              <Routes>
                {/* Public Routes */}
                <Route index element={<HomePage />} />
                <Route path="home" element={<HomePage />} />
                <Route path="contact" element={<Contact />} />
                <Route path="help" element={<Help />} />
                <Route path="feedback" element={<Feedback />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/:backendCategory" element={<CategoryPage />} />

                {/* Protected Routes */}
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="upload"
                  element={
                    <ProtectedRoute>
                      <UploadBook />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="mybooks"
                  element={
                    <ProtectedRoute>
                      <MyBook />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Dashboard */}
                <Route path="admin/dashboard" element={<AdminDashboard />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
