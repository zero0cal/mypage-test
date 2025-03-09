export function DiamondPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full mix-blend-overlay pointer-events-none"
      viewBox="0 0 400 100"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="diamondGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(178, 235, 242, 0.7)" />
          <stop offset="50%" stopColor="rgba(128, 222, 234, 0.9)" />
          <stop offset="100%" stopColor="rgba(77, 208, 225, 0.7)" />
        </linearGradient>
        <linearGradient id="diamondGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(238, 238, 238, 0.5)" />
          <stop offset="50%" stopColor="rgba(189, 189, 189, 0.7)" />
          <stop offset="100%" stopColor="rgba(158, 158, 158, 0.5)" />
        </linearGradient>
        <pattern id="diamondPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          {/* 기본 다이아몬드 패턴 */}
          <path d="M30,0 L60,30 L30,60 L0,30 Z" fill="url(#diamondGradient1)" />
          <path d="M30,10 L50,30 L30,50 L10,30 Z" fill="url(#diamondGradient2)" />

          {/* 하이라이트 라인 */}
          <path d="M30,0 L60,30 M0,30 L30,60" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
          <path d="M30,10 L50,30 M10,30 L30,50" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
        </pattern>

        {/* 반짝임 효과 */}
        <filter id="diamondGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          <feColorMatrix type="matrix" values="1 0 0 0 1   1 0 0 0 1   1 0 0 0 1  0 0 0 0.5 0" />
        </filter>
      </defs>

      {/* 기본 패턴 적용 */}
      <rect width="100%" height="100%" fill="url(#diamondPattern)" />

      {/* 반짝이는 포인트들 */}
      <g className="diamond-sparkles">
        {[...Array(8)].map((_, i) => (
          <g key={i} className="animate-diamond-sparkle" style={{ animationDelay: `${i * 0.3}s` }}>
            <circle cx={50 + i * 50} cy={25 + (i % 2) * 25} r="1" fill="white" filter="url(#diamondGlow)" />
            <path
              d={`M${45 + i * 50},${25 + (i % 2) * 25} L${55 + i * 50},${25 + (i % 2) * 25}`}
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="0.5"
              filter="url(#diamondGlow)"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}

