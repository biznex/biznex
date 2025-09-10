"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isJobDashboard = pathname.startsWith("/jobdashboard");
  const isJobListing = pathname.startsWith("/joblisting");
  const isSubdomain = pathname.startsWith("/subdomain");

  // Hide header and footer on certain routes
  const hideHeaderFooter =
    isDashboard || isJobDashboard || isJobListing || isSubdomain;

  return (
    <html lang="en">
      <body className="relative text-white min-h-screen">
        {!hideHeaderFooter && (
          <Header className="absolute top-0 left-0 w-full z-50 bg-transparent" />
        )}

        <main className="flex flex-col items-center justify-center text-center">
          {children}
        </main>

        {!hideHeaderFooter && (
          <Footer className="absolute bottom-0 left-0 w-full z-50 bg-transparent" />
        )}
      </body>
    </html>
  );
}
