interface LogoProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="2" width="26" height="26" rx="2" fill="var(--accent)" stroke="var(--border)" strokeWidth="2.5" />
      <path d="M6 29 L29 29 L29 6" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="square" />
      {/* U shape — two prongs connected by an arc at the bottom */}
      <path
        d="M9 6 L9 20 C9 27 23 27 23 20 L23 6"
        stroke="var(--bg-primary)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="butt"
      />
      {/* Left cap — extends the prong sideways like a wrench jaw */}
      <line x1="5.5" y1="6" x2="12.5" y2="6" stroke="var(--bg-primary)" strokeWidth="3.5" strokeLinecap="square" />
      {/* Right cap */}
      <line x1="19.5" y1="6" x2="26.5" y2="6" stroke="var(--bg-primary)" strokeWidth="3.5" strokeLinecap="square" />
    </svg>
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight text-text-primary ${className}`}>
      Utilitop
    </span>
  );
}
