"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import Logo from "@/components/Logo";
import type { Category } from "@/sanity/lib/types";

const baseLinks = [{ href: "/", label: "Home" }];

export default function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setGenreOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const dropdownTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const };
  const menuTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${
        scrolled ? "glass shadow-sm" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/">
          <Logo variant="navbar" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {baseLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 ${
                isActive(link.href)
                  ? "text-brand-700"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setGenreOpen(true)}
            onMouseLeave={() => setGenreOpen(false)}
          >
            <Link
              href="/genre"
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 ${
                isActive("/genre")
                  ? "text-brand-700"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
            >
              Genre Artikel
              <svg
                className={`h-3.5 w-3.5 transition-transform ${genreOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <AnimatePresence>
              {genreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={dropdownTransition}
                  className="absolute left-0 top-full w-64 pt-2"
                >
                  <div className="glass-strong overflow-hidden rounded-2xl border p-2 shadow-xl">
                    {categories.length === 0 && (
                      <p className="px-3 py-2 text-sm text-neutral-500">
                        Belum ada genre.
                      </p>
                    )}
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/genre/${cat.slug.current}`}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-neutral-300 dark:hover:bg-brand-500/10"
                      >
                        {cat.title}
                        <span className="text-xs text-neutral-400">
                          {cat.postCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/profil"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-500/10 ${
              isActive("/profil")
                ? "text-brand-700"
                : "text-neutral-600 dark:text-neutral-300"
            }`}
          >
            Profil
          </Link>
        </div>

        <button
          aria-label="Buka menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] md:hidden"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {open ? (
              <path strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={menuTransition}
            className="glass-strong overflow-hidden border-t md:hidden"
          >
            <div className="px-4 py-3">
              <Link href="/" className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-500/10">
                Home
              </Link>
              <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Genre Artikel
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/genre/${cat.slug.current}`}
                  className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-500/10"
                >
                  {cat.title}
                </Link>
              ))}
              <Link href="/profil" className="mt-2 flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-brand-50 dark:hover:bg-brand-500/10">
                Profil
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
