"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = new URL("mailto:support@haaaib.com");
    const params = new URLSearchParams({
      subject: subject || "Message from HAAAIB contact form",
      body: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    // Some clients support ?subject=&body= directly appended
    window.location.href = `${mailto.toString()}?${params.toString()}`;
  };

  return (
    <main className="max-w-[800px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have a question or feedback? Send us a message and we’ll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact form">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="Your name"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="you@example.com"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="How can we help?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="Write your message"
            aria-required="true"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-white hover:opacity-90"
            aria-label="Send message"
          >
            Send Message
          </button>
          <a
            href="mailto:support@haaaib.com"
            className="text-[var(--accent)] hover:underline"
            aria-label="Email support at support@haaaib.com"
          >
            or email support@haaaib.com
          </a>
        </div>
      </form>
    </main>
  );
}


