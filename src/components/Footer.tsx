import Link from "next/link";

import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6">
        <Link href="/">
          <Logo variant="footer" />
        </Link>
        <p className="mt-2 text-sm text-neutral-500">
          Cerita, opini, dan kabar terbaru — ditulis langsung dari sudut pandang saya.
        </p>
        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} Everlasting. Dibangun dengan Next.js & Sanity.
        </p>
      </div>
    </footer>
  );
}
