import React from "react";
import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Nav />
      <main className="flex-1 p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
