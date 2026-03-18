import React from "react";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default function StatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="w-full flex-1">{children}</main>
      <Footer />
    </div>
  );
}
