interface Props {
  size?: number;
  className?: string;
}

export default function OxalysLogo({ size = 40, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="oxalys-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="oxalys-g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {/* Background square with rounded corners */}
      <rect x="4" y="4" width="32" height="32" rx="9" fill="url(#oxalys-g2)" />
      {/* Hexagon shape */}
      <path
        d="M20 9 L29 14.5 L29 25.5 L20 31 L11 25.5 L11 14.5 Z"
        stroke="url(#oxalys-g1)"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Inner cross / atom */}
      <circle cx="20" cy="20" r="3" fill="url(#oxalys-g1)" />
      <line x1="20" y1="14.5" x2="20" y2="17" stroke="url(#oxalys-g1)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="23" x2="20" y2="25.5" stroke="url(#oxalys-g1)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="17.25" x2="17" y2="18.75" stroke="url(#oxalys-g1)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="23" y1="21.25" x2="25.5" y2="22.75" stroke="url(#oxalys-g1)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="22.75" x2="17" y2="21.25" stroke="url(#oxalys-g1)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="23" y1="18.75" x2="25.5" y2="17.25" stroke="url(#oxalys-g1)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
