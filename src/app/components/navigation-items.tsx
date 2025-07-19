"use client";

import { useState } from "react";
import { ReactNode } from "react";
import Link from "next/link";

export default function NavigationItems({ navLinks }: { navLinks: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link href="/">TravelPack</Link>
        </h1>

        <nav className="hidden space-x-8 md:flex">{navLinks}</nav>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && <nav className="mt-2 space-y-2 md:hidden">{navLinks}</nav>}
    </header>
  );
}
