"use client"; // Make this a client component

import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isJobListing = pathname.startsWith("/joblisting");

  return (
    <div className={`relative min-h-screen ${isDashboard || isJobListing ? "" : "bg-black"}`}>
      {/* Show Background Only on Non-Dashboard and Non-JobListing Pages */}
      {!(isDashboard || isJobListing) && (
        <div 
          className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-999]" 
          style={{ backgroundImage: "url('/landingbg.jpg')" }}>
        </div>
      )}
      {children}
    </div>
  );
}