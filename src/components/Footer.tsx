import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          Artikel<span className="text-rose-600">Saya</span>
        </Link>
        <p className="text-sm text-neutral-500">
          Cerita, opini, dan kabar terbaru — ditulis langsung dari sudut pandang saya.
        </p>
        <p className="text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} ArtikelSaya. Dibangun dengan Next.js & Sanity.
        </p>
      </div>
    </footer>
  );
}
