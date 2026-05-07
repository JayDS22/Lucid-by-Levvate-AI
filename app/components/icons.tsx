import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

/**
 * The Lucid mark: an aperture / iris evoking "clarity."
 * Six segments converging on a center point, like a camera diaphragm closing.
 */
export function LucidMark({ size = 24, ...props }: Props & { size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
      {/* aperture blades */}
      <path
        d="M16 4 L20 14 L26 14 Z"
        fill="currentColor"
        opacity="0.18"
      />
      <path
        d="M26 14 L20 18 L26 22 Z"
        fill="currentColor"
        opacity="0.32"
      />
      <path
        d="M26 22 L20 18 L20 28 Z"
        fill="currentColor"
        opacity="0.46"
      />
      <path
        d="M20 28 L16 18 L12 28 Z"
        fill="currentColor"
        opacity="0.60"
      />
      <path
        d="M12 28 L12 18 L6 22 Z"
        fill="currentColor"
        opacity="0.74"
      />
      <path
        d="M6 22 L12 18 L6 14 Z"
        fill="currentColor"
        opacity="0.88"
      />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
    </svg>
  );
}

/** Lucid wordmark — letterforms only, no icon */
export function LucidWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        letterSpacing: "-0.04em",
      }}
    >
      lucid
    </span>
  );
}

/** Sparkles cluster, used for "powered by Claude" pill */
export function Spark({ size = 14, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" {...props}>
      <path
        d="M8 1.5 L9.2 6.4 L14 7.6 L9.2 8.8 L8 13.7 L6.8 8.8 L2 7.6 L6.8 6.4 Z"
        fill="currentColor"
      />
      <path
        d="M13 12 L13.5 13.5 L15 14 L13.5 14.5 L13 16 L12.5 14.5 L11 14 L12.5 13.5 Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

/** Geometric arrow, custom drawn for hero CTA */
export function ArrowOut({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 8 H13" />
      <path d="M9 4 L13 8 L9 12" />
    </svg>
  );
}

/** Rotating refresh — for "new analysis" */
export function Refresh({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 8 a 6 6 0 0 1 10.5 -3.8" />
      <path d="M13 2 V5 H10" />
      <path d="M14 8 a 6 6 0 0 1 -10.5 3.8" />
      <path d="M3 14 V11 H6" />
    </svg>
  );
}

/** Document — for PDF download */
export function DocIcon({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 2 V14 H13 V5 L10 2 Z" />
      <path d="M10 2 V5 H13" />
      <path d="M5.5 8.5 H10.5" />
      <path d="M5.5 11 H9" />
    </svg>
  );
}

/** Code brackets — for JSON view */
export function CodeIcon({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5.5 4 L2 8 L5.5 12" />
      <path d="M10.5 4 L14 8 L10.5 12" />
    </svg>
  );
}

/** Lock for login screen */
export function Lock({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5 7 V5 a 3 3 0 0 1 6 0 V7" />
      <circle cx="8" cy="10.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

/** Eye open / closed for password reveal */
export function Eye({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1.5 8 S 4 3 8 3 S 14.5 8 14.5 8 S 12 13 8 13 S 1.5 8 1.5 8 Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}
export function EyeOff({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1.5 8 S 4 3 8 3 c 1.5 0 2.8 0.7 3.8 1.6" />
      <path d="M14.5 8 S 12 13 8 13 c -1.5 0 -2.8 -0.7 -3.8 -1.6" />
      <path d="M2 2 L14 14" />
    </svg>
  );
}

/** Plus + minus for highlights */
export function Plus({ size = 14, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M8 3 V13" />
      <path d="M3 8 H13" />
    </svg>
  );
}
export function Minus({ size = 14, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...props}>
      <path d="M3 8 H13" />
    </svg>
  );
}

/** Spinner */
export function Spinner({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...props}>
      <path d="M8 2 a 6 6 0 0 1 6 6" opacity="1">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 8 8"
          to="360 8 8"
          dur="0.9s"
          repeatCount="indefinite"
        />
      </path>
      <circle cx="8" cy="8" r="6" opacity="0.15" />
    </svg>
  );
}

/** Alert triangle */
export function Alert({ size = 16, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 2 L14.5 13 H1.5 Z" />
      <path d="M8 6 V9" />
      <circle cx="8" cy="11.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

/** External link */
export function ExternalLink({ size = 12, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3 H13 V7" />
      <path d="M13 3 L7 9" />
      <path d="M11 9 V13 H3 V5 H7" />
    </svg>
  );
}

/** Logout */
export function LogOut({ size = 14, ...props }: Props & { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3 H4 V13 H9" />
      <path d="M11 5 L14 8 L11 11" />
      <path d="M7 8 H14" />
    </svg>
  );
}
