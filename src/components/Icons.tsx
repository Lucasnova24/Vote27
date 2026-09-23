interface IProps {
  size?: number
  color?: string
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
})

export function LogoDiamond({ size = 18, color = '#fff' }: IProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" />
    </svg>
  )
}

export function ChevronRight({ size = 18, color }: IProps) {
  return (
    <svg {...base(size)} stroke={color ?? 'currentColor'} strokeWidth={2.2}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}

export function ChevronLeft({ size = 20, color }: IProps) {
  return (
    <svg {...base(size)} stroke={color ?? 'currentColor'} strokeWidth={2.2}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

export function CheckIcon({ size = 13 }: IProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  )
}

export function VoteIcon({ size = 22 }: IProps) {
  return (
    <svg {...base(size)}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <path d="m8.5 12.3 2.4 2.4 4.6-5" />
    </svg>
  )
}

export function QuizIcon({ size = 22 }: IProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r=".8" fill="currentColor" />
    </svg>
  )
}

export function BoussoleIcon({ size = 22 }: IProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  )
}

export function FirstRoundIcon({ size = 22 }: IProps) {
  return (
    <svg {...base(size)}>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="m8.5 15 2 2 4-4" />
    </svg>
  )
}

export function DebatIcon({ size = 22 }: IProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="2" />
      <path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9M4.5 4.5a10.6 10.6 0 0 0 0 15M19.5 4.5a10.6 10.6 0 0 1 0 15" />
    </svg>
  )
}

export function BellIcon({ size = 19 }: IProps) {
  return (
    <svg {...base(size)}>
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 1.5h-15L6 16.5Z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function SourceIcon({ size = 16 }: IProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4.5h9a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3V4.5Z" />
      <path d="M8.5 8.5h5" />
    </svg>
  )
}

export function PersonIcon({ size = 20 }: IProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 21s-7-4.6-7-10.5A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 7 4.5C19 16.4 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </svg>
  )
}

export function NavHomeIcon({ size = 19 }: IProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1v-7.5Z" />
    </svg>
  )
}

export function NavIsoloirIcon({ size = 19 }: IProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 13h16v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5Z" />
      <path d="m8 13 1-9h6l1 9" />
      <path d="M10 8.5h4" />
    </svg>
  )
}

export function NavAgendaIcon({ size = 19 }: IProps) {
  return (
    <svg {...base(size)}>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  )
}

export function NavProfilIcon({ size = 19 }: IProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c.9-3.6 3.7-5.5 7.5-5.5s6.6 1.9 7.5 5.5" />
    </svg>
  )
}

export function AppleLogo({ size = 16 }: IProps) {
  return (
    <svg width={size} height={size * 1.13} viewBox="0 0 15 17" fill="none" aria-hidden="true">
      <path d="M10.4 8.9c0-2 1.6-3 1.7-3.1-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.5-.4 6.1 1 8.1.7 1 1.5 2.1 2.5 2 1-.1 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.1-.8-2.1-3.1Z" fill="currentColor" />
      <path d="M8.9 2.9c.5-.6.9-1.5.8-2.4-.8 0-1.7.5-2.2 1.2-.5.6-.9 1.5-.8 2.3.9.1 1.7-.5 2.2-1.1Z" fill="currentColor" />
    </svg>
  )
}

export function GoogleLogo({ size = 17 }: IProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h2.9c1.7-1.6 2.7-3.9 2.7-6.5Z" fill="#4285F4" />
      <path d="M9 18c2.4 0 4.5-.8 6-2.3l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.5-1.6-5.2-3.8H.8v2.3A9 9 0 0 0 9 18Z" fill="#34A853" />
      <path d="M3.8 10.6a5.4 5.4 0 0 1 0-3.4V4.9H.8a9 9 0 0 0 0 8.1l3-2.4Z" fill="#FBBC05" />
      <path d="M9 3.6c1.3 0 2.5.5 3.4 1.4l2.6-2.6A9 9 0 0 0 .8 4.9l3 2.3C4.5 5 6.6 3.6 9 3.6Z" fill="#EA4335" />
    </svg>
  )
}
