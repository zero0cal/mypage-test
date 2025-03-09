export function GoldPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full mix-blend-soft-light"
      viewBox="0 0 400 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 215, 0, 0.4)" />
          <stop offset="50%" stopColor="rgba(255, 223, 0, 0.6)" />
          <stop offset="100%" stopColor="rgba(255, 215, 0, 0.4)" />
        </linearGradient>
        <pattern id="goldPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0,20 L40,20 M20,0 L20,40" stroke="url(#goldGradient)" strokeWidth="0.5" />
          <path d="M0,0 L40,40 M40,0 L0,40" stroke="url(#goldGradient)" strokeWidth="0.5" />
          <rect x="0" y="0" width="40" height="40" fill="none" stroke="url(#goldGradient)" strokeWidth="1" />
        </pattern>
        <filter id="goldNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="1" />
          <feColorMatrix type="saturate" values="0" />
          <feBlend mode="overlay" in2="SourceGraphic" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#goldPattern)" />
      <rect width="100%" height="100%" filter="url(#goldNoise)" opacity="0.1" />
      <g className="gold-highlights">
        {[...Array(8)].map((_, i) => (
          <line
            key={i}
            x1={50 + i * 50}
            y1="0"
            x2={50 + i * 50}
            y2="100"
            stroke="rgba(255, 223, 0, 0.3)"
            strokeWidth="2"
            className="animate-shimmer"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </g>
    </svg>
  )
}

