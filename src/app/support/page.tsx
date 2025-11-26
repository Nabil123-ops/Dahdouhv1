"use client";

import { useState } from "react";
import { Mail, Phone, MessageSquare, HelpCircle, AlertTriangle } from "lucide-react";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Your message has been sent! We will contact you soon.");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

        {/* Testing Notice */}
        <div className="flex items-center gap-3 p-4 mb-6 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
          <AlertTriangle size={22} />
          <p className="font-medium">
            This support page is currently under testing and will be updated soon.
          </p>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">
          Customer Support
        </h1>
        <p className="text-center text-gray-600 mb-8">
          We're here to help you with anything you need.
        </p>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="p-6 rounded-xl border text-center hover:shadow-lg transition">
            <Mail className="mx-auto mb-3 text-blue-500" size={35} />
            <h3 className="font-semibold">Email Support</h3>
            <p className="text-gray-500 text-sm mt-1">dahdouhn74@gmail.com</p>
          </div>

          <div className="p-6 rounded-xl border text-center hover:shadow-lg transition">
            <Phone className="mx-auto mb-3 text-green-500" size={35} />
            <h3 className="font-semibold">Phone Support</h3>
            <p className="text-gray-500 text-sm mt-1">+447377279370</p>
          </div>

          <div className="p-6 rounded-xl border text-center hover:shadow-lg transition">
            <MessageSquare className="mx-auto mb-3 text-purple-500" size={35} />
            <h3 className="font-semibold">Live Chat</h3>
            <p className="text-gray-500 text-sm mt-1">Available 24/7</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <details className="p-4 border rounded-xl">
              <summary className="cursor-pointer flex items-center gap-2">
                <HelpCircle size={18} /> How can I reset my password?
              </summary>
              <p className="mt-2 text-gray-600">
                You can reset your password from the login page by clicking "Forgot Password".
              </p>
            </details>

            <details className="p-4 border rounded-xl">
              <summary className="cursor-pointer flex items-center gap-2">
                <HelpCircle size={18} /> How do I cancel my subscription?
              </summary>
              <p className="mt-2 text-gray-600">
                Go to “My Account → Billing” and click **Cancel Subscription**.
              </p>
            </details>

            <details className="p-4 border rounded-xl">
              <summary className="cursor-pointer flex items-center gap-2">
                <HelpCircle size={18} /> Why is my payment failing?
              </summary>
              <p className="mt-2 text-gray-600">
                Make sure your Visa/Mastercard is enabled for online purchases.
                If the issue continues, contact your bank.
              </p>
            </details>
          </div>
        </div>

        {/* Contact Form */}
        <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4"
        >
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Your Name"
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Your Email"
            className="border p-3 rounded-lg"
            required
          />

          <textarea
            name="message"
            onChange={handleChange}
            placeholder="Your Message..."
            rows={5}
            className="border p-3 rounded-lg"
            required
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition text-lg"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}