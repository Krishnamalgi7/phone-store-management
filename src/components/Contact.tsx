import { useState } from "react";
import { X } from "lucide-react";

type Submission = {
  name: string;
  phone: string;
  message: string;
};

function Contact() {
  // Controls whether the popup is visible
  const [isOpen, setIsOpen] = useState(false);


  // Form values
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
    <section id="contact" className="px-6 py-20">

      {/* Main container */}
      <div className="mx-auto max-w-7xl">

        {/* Contact box */}
        <div className="rounded-3xl border border-gray-200 p-8 md:p-12">

          {/* Small label */}
          <p className="text-sm font-semibold">
            CONTACT US
          </p>

          {/* Heading */}
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Have a question?
          </h2>

          {/* Description */}
          <p className="mt-4 max-w-2xl text-gray-600">
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
            >
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 font-semibold">
                hello@nova.com
              </p>
            </a>

            {/* Phone */}
            <a
              href="tel:+919876543210"
              className="cursor-pointer rounded-2xl bg-gray-100 px-5 py-4 transition hover:bg-gray-200"
            >
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="mt-1 font-semibold">
                +91 98765 43210
              </p>
            </a>

          </div>

          {/* Get in touch button */}
          <button
            onClick={() => setIsOpen(true)}
            className="mt-8 cursor-pointer rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-yellow-500"
          >
            Get in Touch
          </button>

        </div>

      </div>

      {/* Contact popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">

          {/* Popup */}
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 cursor-pointer rounded-full p-2 transition hover:bg-yellow-500"
              aria-label="Close contact form"
            >
              <X size={20} />
            </button>

            {/* Popup heading */}
            <h2 className="text-2xl font-bold">
              Get in Touch
            </h2>

            <p className="mt-2 text-sm text-gray-600">
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
                >
                  Name
                </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => {
                const value = event.target.value.replace(/[^a-zA-Z ]/g, "");
                setName(value);
              }}
              placeholder="Enter your name"
              maxLength={40}
              pattern="[a-zA-Z ]+"
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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
                <div className="mt-2 flex overflow-hidden rounded-xl border border-gray-300 focus-within:border-black">

                  {/* Fixed +91 */}
                  <span className="flex items-center bg-gray-100 px-4 text-gray-600">
                    +91
                  </span>

                  {/* User enters only 10 digits */}
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => {
                      // Remove anything that is not a number
                      const value = event.target.value.replace(/\D/g, "");

                      // Maximum 10 digits
                      if (value.length <= 10) {
                        setPhone(value);
                      }
                    }}
                    placeholder="Enter 10 digit number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    required
                    className="min-w-0 flex-1 px-4 py-3 outline-none"
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
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write your message"
                  rows={4}
                  required
                  className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-yellow-500"
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

    <h2 className="text-2xl font-bold">
      Contact Requests
    </h2>

    <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200">

      <table className="w-full min-w-[600px] text-left">

        {/* Table heading */}
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold">
              Name
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Phone
            </th>

            <th className="px-6 py-4 text-sm font-semibold">
              Message
            </th>
          </tr>
        </thead>

        {/* Table data */}
        <tbody>

          {submissions.map((submission, index) => (
            <tr
              key={index}
              className="border-t border-gray-200"
            >

              <td className="px-6 py-4">
                {submission.name}
              </td>

              <td className="px-6 py-4">
                +91 {submission.phone}
              </td>

              <td className="px-6 py-4">
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

export default Contact;