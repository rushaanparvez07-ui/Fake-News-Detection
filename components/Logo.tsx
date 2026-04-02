
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 44, animated = true }) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
      >
        <defs>
          <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbit 1 */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity="0.1"
          className={animated ? "animate-[spin_10s_linear_infinite]" : ""}
          strokeDasharray="10 20"
        />

        {/* Outer Orbit 2 */}
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity="0.2"
          className={animated ? "animate-[spin_15s_linear_infinite_reverse]" : ""}
          strokeDasharray="5 15"
        />

        {/* The Shield Frame */}
        <path
          d="M50 10L85 25V50C85 70 70 85 50 90C30 85 15 70 15 50V25L50 10Z"
          fill="black"
          fillOpacity="0.3"
          stroke="url(#coreGradient)"
          strokeWidth="2"
        />

        {/* Pulse Core */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="url(#coreGradient)"
          className={animated ? "animate-pulse" : ""}
          filter="url(#glow)"
        />

        {/* Signal Lines */}
        <path
          d="M35 50H45L50 40L55 60L60 50H65"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animated ? "opacity-100" : "opacity-50"}
        />
      </svg>
    </div>
  );
};
