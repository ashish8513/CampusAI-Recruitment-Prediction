"use client";

import { useEffect } from "react";

/** Always dark mode — light mode removed */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("campus-theme", "dark");
  }, []);

  return <>{children}</>;
}
