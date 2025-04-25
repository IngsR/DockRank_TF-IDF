"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState(pathname);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  return (
    <header
      className="bg-secondary text-secondary-foreground p-6 shadow-md"
      style={{ height: "90px" }}
    >
      {" "}
      {/* Increased height */}
      <nav className="container mx-auto flex justify-between items-center h-full">
        <Link
          href="/"
          className="text-4xl font-bold transition-colors hover:text-accent"
        >
          DocRank Explorer
        </Link>
        <ul className="flex space-x-10 items-center">
          {" "}
          {/* Added items-center */}
          <li>
            <Link
              href="/search"
              className={`relative text-lg transition-colors hover:text-accent ${
                activeLink === "/search"
                  ? "text-accent font-semibold" // Make active link stand out more
                  : "text-secondary-foreground"
              } header-link`}
              style={{
                fontSize: "1.2em",
              }}
            >
              Pencarian
            </Link>
          </li>
          <li>
            <Link
              href="/add-document"
              className={`relative text-lg transition-colors hover:text-accent ${
                activeLink === "/add-document"
                  ? "text-accent font-semibold"
                  : "text-secondary-foreground"
              } header-link`}
              style={{
                fontSize: "1.2em",
              }}
            >
              Tambah Dokumen
            </Link>
          </li>
          <li>
            <Link
              href="/documents"
              className={`relative text-lg transition-colors hover:text-accent ${
                activeLink === "/documents"
                  ? "text-accent font-semibold"
                  : "text-secondary-foreground"
              } header-link`}
              style={{
                fontSize: "1.2em",
              }}
            >
              MyDokumen
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
