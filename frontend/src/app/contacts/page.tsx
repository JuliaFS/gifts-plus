// app/contacts/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useContactForm } from "@/services/hooks/useContactForm";

export default function ContactsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const { mutate: sendMessage, isPending, error } = useContactForm();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitted(false);

    sendMessage(formData, {
      onSuccess: () => {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" }); // Clear form on success
      }
    });
  };

  // Clear success message after a few seconds
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Me</h1>

      <p className="text-center max-w-2xl mb-10 text-gray-700">
        Passionate and motivated front-end developer with a strong foundation in
        HTML, CSS, JavaScript and React. Eager to apply my foundational skills
        in building user-friendly and visually appealing web applications. I am
        a quick learner and enjoy solving problems, with a focus on creating
        fast and stylish applications.
      </p>

      <div className="flex gap-4 justify-center mb-8">
        <a
          href="https://www.linkedin.com/in/yulia-stambolieva-47b777304/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white text-2xl transition duration-300 shadow-md"
          style={{ boxShadow: "0 0 10px rgba(168, 85, 247, 0.7)" }}
          data-icon="linkedin"
        >
          <FaLinkedinIn />
        </a>
        <a
          href="https://github.com/JuliaFS"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white text-2xl transition duration-300 shadow-md"
          style={{ boxShadow: "0 0 10px rgba(168, 85, 247, 0.7)" }}
          data-icon="github"
        >
          <FaGithub />
        </a>
        <a
          href="mailto:yuliya.f.s@gmail.com"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 text-white text-2xl transition duration-300 shadow-md"
          style={{ boxShadow: "0 0 10px rgba(168, 85, 247, 0.7)" }}
          data-icon="email"
        >
          <FaEnvelope />
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 space-y-4"
      >
        <div>
          <label
            htmlFor="name"
            className="block font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block font-medium text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-purple-500 text-white font-bold py-2 rounded-lg hover:bg-purple-600 transition disabled:bg-purple-300"
        >
          {isPending ? "Sending..." : "Send Message"}
        </button>

        {submitted && (
          <p className="text-green-600 text-center mt-2">
            Thank you! Your message has been sent.
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center mt-2">
            Error: {error.message}
          </p>
        )}
      </form>
    </div>
  );
}
