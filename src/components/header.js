'use client';
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [jtoken, setJtoken] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
      setJtoken(localStorage.getItem("jtoken"));
    }
  }, []);

  // --- START: Simplified Button Logic ---
  // Define default properties for a logged-out user.
  let buttonProps = {
    onClick: () => router.push("/login"),
    text: "Login/Register",
  };

  if (isClient) {
    // If a regular token exists, it takes priority.
    // This handles both the "token only" and "token + jtoken" cases.
    if (token) {
      buttonProps = {
        onClick: () => router.push("/dashboard"),
        text: "Dashboard",
      };
    }
    // This case only runs if 'token' is null but 'jtoken' exists.
    else if (jtoken) {
      buttonProps = {
        onClick: () => router.push("/jobdashboard"),
        text: "Dashboard",
      };
    }
  }
  // --- END: Simplified Button Logic ---

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <h1
          className="text-2xl cursor-pointer"
          style={{ fontFamily: 'helvetica-bold', color: '#1f2937' }}
          onClick={() => router.push("/")}
        >
          Biznex
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            onClick={() => router.push("/")}
            className="text-md cursor-pointer"
            style={{ fontFamily: 'helvetica-roman', color: '#1f2937' }}
          >
            Home
          </a>
          <a
            href="#"
            className="text-md"
            style={{ fontFamily: 'helvetica-roman', color: '#1f2937' }}
          >
            Services
          </a>

          {/* Use the dynamically defined button properties */}
          {isClient && (
            <button
              onClick={() => {
                buttonProps.onClick();
                setIsOpen(false);
              }}
              className="px-5 py-2 bg-[#5D46E7] text-white rounded-md hover:bg-[#4b36c0] transition"
              style={{ fontFamily: 'helvetica-medium' }}
            >
              {buttonProps.text}
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white p-6 space-y-4 text-center">
          <a
            onClick={() => {
              router.push("/");
              setIsOpen(false);
            }}
            className="block text-sm cursor-pointer"
            style={{ fontFamily: 'helvetica-roman', color: '#1f2937' }}
          >
            Home
          </a>
          <a
            href="#"
            className="block text-sm"
            style={{ fontFamily: 'helvetica-roman', color: '#1f2937' }}
          >
            Services
          </a>

          {/* Use the same dynamic button properties for mobile */}
          {isClient && (
            <button
              onClick={() => {
                buttonProps.onClick();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 bg-[#5D46E7] text-white rounded-md hover:bg-[#4b36c0] transition"
              style={{ fontFamily: 'helvetica-medium' }}
            >
              {buttonProps.text}
            </button>
          )}
        </div>
      )}
    </header>
  );
}