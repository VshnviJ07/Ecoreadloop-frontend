import React from "react";
import PageWrapper from "./PageWrapper";

export default function Contact() {
  return (
    <PageWrapper title="Contact Us">
      <div className="text-white space-y-2">
        <p>
          If you have any questions or feedback, feel free to reach out.
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:yourname@gmail.com" className="underline text-blue-400">
            yourname@gmail.com
          </a>
        </p>
      </div>
    </PageWrapper>
  );
}
