function Monogram({
  size = 36,
  animated = false,
}: {
  size?: number;
  animated?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${animated ? "logo-glow" : ""}`}
    >
      <circle cx="20" cy="20" r="19" stroke="#a67623" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="15.5" stroke="#a67623" strokeWidth="0.75" opacity="0.5" />
      <path
        d="M14 12h12M14 20h9M14 28h12"
        stroke="#a67623"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {animated && (
        <circle
          cx="20"
          cy="1.5"
          r="1.6"
          fill="#e9cb8d"
          className="logo-orbit-dot"
        />
      )}
    </svg>
  );
}

export default function Logo({
  variant = "navbar",
}: {
  variant?: "navbar" | "footer" | "hero";
}) {
  if (variant === "hero") {
    return (
      <div className="flex flex-col items-center gap-3">
        <Monogram size={88} animated />
        <span className="logo-shimmer-text font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Everlasting
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-brand-600">
          Mindset &middot; Intelek &middot; Islamik
        </span>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className="flex flex-col items-center gap-2">
        <Monogram size={44} />
        <span className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Everlasting
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.25em] text-brand-600">
          Mindset &middot; Intelek &middot; Islamik
        </span>
      </div>
    );
  }

  return (
    <span className="flex items-center gap-2.5">
      <Monogram size={32} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)]">
          Everlasting
        </span>
        <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-brand-600">
          Mindset &middot; Intelek &middot; Islamik
        </span>
      </span>
    </span>
  );
}
