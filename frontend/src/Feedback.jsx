import { useState } from "react";
import PageWrapper from "./PageWrapper";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setMessage("⚠️ Please enter your feedback before submitting.");
      return;
    }
    setMessage("Thank you for your feedback! ✅");
    setFeedback("");
  };

  return (
    <PageWrapper title="Feedback">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">💬 Feedback</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback..."
            className="w-full p-3 rounded bg-white/70 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400"
            rows="4"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
          >
            Submit
          </button>
          {message && (
            <p className="text-white text-center mt-2">{message}</p>
          )}
        </form>
      </div>
    </PageWrapper>
  );
}
