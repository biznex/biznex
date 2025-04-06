"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import Spline from "@splinetool/react-spline";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isJobListing = pathname.startsWith("/joblisting");
  const isEcom = pathname.startsWith("/ecom");

  return (
    <html lang="en">
      <body className="relative text-white min-h-screen overflow-hidden">
        {/* Background Spline (Only for Landing Page) */}
        {!(isDashboard || isJobListing || isEcom) && (
          <div className="fixed top-0 left-0 w-full h-full z-[-999]">
            <Spline scene="https://prod.spline.design/yehwNkPOGwGGi0is/scene.splinecode" />
          </div>
        )}

        {/* Header */}
        {!(isDashboard || isJobListing || isEcom) && (
          <Header className="absolute top-0 left-0 w-full z-50 bg-transparent" />
        )}

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center text-center relative z-10">
          {children}
        </main>

        {/* Footer */}
        {!(isDashboard || isJobListing || isEcom) && (
          <Footer className="absolute bottom-0 left-0 w-full z-50 bg-transparent" />
        )}
      </body>
    </html>
  );
}
