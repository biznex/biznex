"use client";
import { useState , useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  //const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null; // Check if running in browser
 // const jtoken = typeof window !== 'undefined' ? localStorage.getItem('jtoken') : null;
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

  return (
    <header className="absolute top-0 left-0 w-full p-4 bg-transparent">
      <div className="container mx-auto flex justify-between items-center">
        {/* Clicking on "Biznex" navigates to the homepage */}
        <h1
          className="text-white text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Biznex
        </h1>

        <nav className="hidden md:flex items-center space-x-6">
          {/* Clicking "Home" also navigates to the homepage */}
          <a
            onClick={() => router.push("/")}
            className="text-white text-lg hover:text-gray-300 cursor-pointer"
          >
            Home
          </a>
          <a href="#" className="text-white text-lg hover:text-gray-300">
            Services
          </a>
          {isClient && ( // Only render this part on the client
            token ? (
              jtoken ? (
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-[#F16416] text-white rounded-md hover:bg-[#d14b10] transition"
                >
                  Login/Register
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/dashboard");
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-[#F16416] text-white rounded-md hover:bg-[#d14b10] transition"
                >
                  Dashboard
                </button>
              )
            ) : (
              jtoken ? (
                <button
                  onClick={() => {
                    router.push("/jobdashboard");
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-[#F16416] text-white rounded-md hover:bg-[#d14b10] transition"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-[#F16416] text-white rounded-md hover:bg-[#d14b10] transition"
                >
                  Login/Register
                </button>
              )
            )
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black bg-opacity-90 p-6 text-center md:hidden">
          <a
            onClick={() => {
              router.push("/");
              setIsOpen(false);
            }}
            className="block text-white text-lg mb-4 cursor-pointer"
          >
            Home
          </a>
          <a href="#" className="block text-white text-lg mb-4">
            Services
          </a>
          
          
          {token ? (
            jtoken ? (
              <button
                onClick={() => {
                  router.push("/login");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-[#F16416] text-white rounded-md hover:bg-[#d14b10] transition"
              >
                Login/Register
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/dashboard");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-[#F16416] text-white rounded-md hover:bg-[#d14b10] transition"
              >
                Dashboard
              </button>
            )
          ) : (
            jtoken ? (
              <button
                onClick={() => {
                  router.push("/jobdashboard");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-[#F16416] text-white rounded-md hover:bg-[#d14b10] transition"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/login");
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-[#F16416] text-white rounded-md hover:bg-[#d14b10] transition"
              >
                Login/Register
              </button>
            )
          )}
        </div>
      )}
    </header>
  );
}
