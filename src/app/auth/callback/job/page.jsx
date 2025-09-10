"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function GoogleCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      router.replace("/dashboard"); // Redirect after login
    } else {
      router.replace("/login"); // Redirect if token is missing
    }
  }, [searchParams, router]);

  return <p>Signing you in...</p>;
}