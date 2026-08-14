"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Submission = {
  name: string;
  phone: string;
  message: string;
};

export default function Contact() {
  // Controls whether the popup is visible
  const [isOpen, setIsOpen] = useState(false);

  // Form values
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Handle form submission
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newSubmission: Submission = {
      name: name,
      phone: phone,
      message: message,
    };

    setSubmissions((previousSubmissions) => [
      ...previousSubmissions,
      newSubmission,
    ]);

    setIsOpen(false);

    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <section
  id="contact"
  className="px-6 py-20"
  style={{
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
  }}
>

      {/* Main container */}

      <div className="mx-auto max-w-7xl">

        {/* Contact box */}

        <div
  className="rounded-3xl border p-8 md:p-12"
  style={{
    backgroundColor: "var(--bg-secondary)",
    borderColor: "var(--border-color)",
  }}
>

          {/* Small label */}

          <p
  className="text-sm font-semibold"
  style={{
    color: "var(--text-primary)",
  }}
>
  CONTACT US
</p>

          {/* Heading */}

         <h2
  className="mt-4 text-3xl font-bold md:text-4xl"
  style={{
    color: "var(--text-primary)",
  }}
>
  Have a question?
</h2>

          {/* Description */}

          <p
  className="mt-4 max-w-2xl"
  style={{
    color: "var(--text-secondary)",
  }}
>
            We'd love to hear from you. Get in touch with the NOVA
            team for product information or general enquiries.
          </p>

          {/* Contact information */}

          <div className="mt-8 flex flex-col gap-4 md:flex-row">

            {/* Email */}

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=hello@nova.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer rounded-2xl bg-gray-100 px-5 py-4 transition hover:bg-gray-200"
              style={{
  backgroundColor: "var(--bg-primary)",
}}
            >
              <p
  className="text-sm"
  style={{
    color: "var(--text-secondary)",
  }}
>
  Email
</p>

              <p
  className="mt-1 font-semibold"
  style={{
    color: "var(--text-primary)",
  }}
>
  hello@nova.com
</p>
            </a>

            {/* Phone */}

            <a
              href="tel:+919876543210"
              className="cursor-pointer rounded-2xl px-5 py-4 transition hover:bg-gray-200"
style={{
  backgroundColor: "var(--bg-primary)",
}}
            >
                <p
  className="text-sm"
  style={{
    color: "var(--text-secondary)",
  }}
>
                  Phone
                </p>

              <p className="mt-1 font-semibold"
              style={{
  color: "var(--text-primary)",
}}
>
                +91 98765 43210
              </p>
            </a>

          </div>

          {/* Get in touch button */}

          <button
            onClick={() => setIsOpen(true)}
            className="theme-accent-hover mt-8 inline-block cursor-pointer rounded-full px-6 py-3 font-semibold transition"
            style={{
  backgroundColor: "var(--text-primary)",
  color: "var(--bg-primary)",
}}
          >
            Get in Touch
          </button>

        </div>

      </div>

      {/* Contact popup */}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">

          {/* Popup */}

          <div
  className="relative w-full max-w-lg rounded-3xl p-8 shadow-2xl"
  style={{
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
  }}
>

            {/* Close button */}

            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 cursor-pointer rounded-full p-2 transition hover:bg-yellow-500"
              style={{
  color: "var(--text-primary)",
}}
              aria-label="Close contact form"
            >
              <X size={20} />
            </button>

            {/* Popup heading */}

            <h2
  className="text-2xl font-bold"
  style={{
    color: "var(--text-primary)",
  }}
>
  Get in Touch
</h2>

            <p
  className="mt-2 text-sm"
  style={{
    color: "var(--text-secondary)",
  }}
>
  Fill in your details and we'll get back to you.
</p>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                  style={{
  color: "var(--text-primary)",
}}
                >
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) => {
                    const value = event.target.value.replace(
                      /[^a-zA-Z ]/g,
                      ""
                    );

                    setName(value);
                  }}
                  placeholder="Enter your name"
                  maxLength={40}
                  pattern="[a-zA-Z ]+"
                  required
                  className="mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
style={{
  backgroundColor: "var(--bg-primary)",
  color: "var(--text-primary)",
  borderColor: "var(--border-color)",
}}
                />

              </div>

              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="text-sm font-medium"
                >
                  Phone
                </label>

                {/* +91 + 10 digit phone number */}

                <div
  className="mt-2 flex overflow-hidden rounded-xl border focus-within:border-black"
  style={{
    borderColor: "var(--border-color)",
  }}
>

                  {/* Fixed +91 */}

                  <span
  className="flex items-center px-4"
  style={{
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-secondary)",
  }}
>
  +91
</span>

                  {/* User enters only 10 digits */}

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(/\D/g, "");

                      if (value.length <= 10) {
                        setPhone(value);
                      }
                    }}
                    placeholder="Enter 10 digit number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                    className="min-w-0 flex-1 px-4 py-3 outline-none"
                    style={{
  backgroundColor: "var(--bg-primary)",
  color: "var(--text-primary)",
}}
                  />

                </div>

              </div>

              {/* MESSAGE */}

              <div>

                <label
                  htmlFor="message"
                  className="text-sm font-medium"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Write your message"
                  rows={4}
                  required
                  className="mt-2 w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-black"
  style={{
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    borderColor: "var(--border-color)",
  }}
                />

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="theme-accent-hover mt-8 inline-block cursor-pointer rounded-full px-6 py-3 font-semibold transition"
style={{
  backgroundColor: "var(--text-primary)",
  color: "var(--bg-primary)",
}}
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      )}

      {/* Submitted contact requests */}

      {submissions.length > 0 && (
        <div className="mx-auto mt-12 max-w-7xl">

          <h2
  className="text-2xl font-bold"
  style={{
    color: "var(--text-primary)",
  }}
>
  Contact Requests
</h2>

          <div
  className="mt-6 overflow-x-auto rounded-2xl border"
  style={{
    borderColor: "var(--border-color)",
  }}
>

            <table className="w-full min-w-[600px] text-left">

              {/* Table heading */}

              <thead
  style={{
    backgroundColor: "var(--bg-secondary)",
  }}
>
                <tr>

                  <th
  className="px-6 py-4 text-sm font-semibold"
  style={{
    color: "var(--text-primary)",
  }}
>
  Name
</th>

                  <th
  className="px-6 py-4 text-sm font-semibold"
  style={{
    color: "var(--text-primary)",
  }}
>
  Phone
</th>

                  <th
  className="px-6 py-4 text-sm font-semibold"
  style={{
    color: "var(--text-primary)",
  }}
>
  Message
</th>

                </tr>
              </thead>

              {/* Table data */}

              <tbody>

                {submissions.map((submission, index) => (
                  <tr
                    key={index}
                    className="border-t"
                    style={{
    borderColor: "var(--border-color)",
  }}
                  >

                    <td className="px-6 py-4"
                    style={{
    color: "var(--text-primary)",
  }}
  >
                      {submission.name}
                    </td>

                    <td className="px-6 py-4"
                    style={{
    color: "var(--text-primary)",
  }}>
                      +91 {submission.phone}
                    </td>

                    <td className="px-6 py-4"
                    style={{
    color: "var(--text-primary)",
  }}>
                      {submission.message}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </section>
  );
}