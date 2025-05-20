'use client'
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const link = [
  { href: "/popular", label: "🎬 Popular" },
  { href: "/top-rated", label: "⭐ Top Rated" },
  { href: "/now-playing", label: "🎥 Now Playing" },
  { href: "/my-favorites", label: "❤️ Favorites" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          🎞️ Movies DB
        </Link>

        <nav className="flex gap-6">
          {link.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "text-sm font-medium transition-colors",
                pathname === href
                  ? "text-blue-600 underline"
                  : "text-gray-700 hover:text-blue-500"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
