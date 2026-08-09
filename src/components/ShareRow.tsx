"use client";

import { useState } from "react";

export default function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the native share sheet — nothing to do
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition-colors hover:border-brand-300 hover:text-brand-700"
    >
      {copied ? "Link disalin" : "Bagikan artikel"}
    </button>
  );
}
