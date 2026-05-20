import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "CampusAI — Recruitment Prediction & Gen AI Coach",
  description: "Full-stack microservices campus placement platform with ML, RAG, and AI agents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-100">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
