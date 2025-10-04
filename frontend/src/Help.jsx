import React, { useState } from "react";
import PageWrapper from "./PageWrapper";

export default function Help() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "1. How can I buy a book?",
      answer: "Go to My Books → Buy and choose your preferred category.",
    },
    {
      question: "2. How can I rent or donate books?",
      answer: "Under My Books, you’ll find options for Rent, Sell, and Donate.",
    },
    {
      question: "3. How do I contact support?",
      answer: (
        <>
          You can always email us at{" "}
          <a
            href="mailto:yourname@gmail.com"
            className="text-blue-300 hover:underline"
          >
            yourname@gmail.com
          </a>
        </>
      ),
    },
  ];

  return (
    <PageWrapper title="Help & Support">
      <h1 className="text-3xl font-bold mb-4 text-center text-white">🛠 Help & Support</h1>
      <p className="mb-6 text-center text-gray-200">
        Need assistance? Check the frequently asked questions below or reach out to us.
      </p>

      {/* FAQ Section */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300/30 pb-2">
            <button
              className="flex justify-between items-center w-full text-left font-semibold text-white"
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            >
              {faq.question}
              <span className="text-xl">{openFAQ === index ? "−" : "+"}</span>
            </button>
            {openFAQ === index && (
              <p className="mt-2 text-gray-200">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
