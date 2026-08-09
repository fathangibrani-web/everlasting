"use client";

import { useEffect, useState } from "react";

export default function ReadingProgressBar({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const elTop = rect.top + window.scrollY;
      const start = elTop;
      const end = elTop + rect.height - window.innerHeight;

      if (end <= start) {
        setProgress(window.scrollY > start ? 1 : 0);
        return;
      }

      const pct = (window.scrollY - start) / (end - start);
      setProgress(Math.min(1, Math.max(0, pct)));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div className="fixed left-0 top-0 z-[60] h-[2.5px] w-full bg-transparent">
      <div
        className="h-full bg-brand-600"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
