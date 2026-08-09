export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <span className="texture-dots" />
      <span className="aurora-blob aurora-blob-1" />
      <span className="aurora-blob aurora-blob-2" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.35] dark:opacity-[0.22]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          d="M-100 620 C 260 500, 480 740, 780 600 S 1300 420, 1560 540"
          stroke="#864c2c"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M-100 180 C 220 260, 520 60, 860 180 S 1340 300, 1600 160"
          stroke="#864c2c"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
