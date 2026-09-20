import type { CSSProperties } from 'react'

export const serif = "'Source Serif 4',Georgia,serif"
export const mono = "'IBM Plex Mono',monospace"

export const colors = {
  bg: '#eef0f7',
  text: '#10162e',
  sub: '#6b7392',
  border: '#e3e7f3',
  borderStrong: '#d9dfee',
  accentInk: '#1b2a63',
}

export const screenWrap: CSSProperties = {
  padding: '18px 16px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  width: '100%',
  maxWidth: 720,
}

export const card: CSSProperties = {
  background: '#fff',
  border: '1px solid #e3e7f3',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 1px 2px rgba(16,22,46,.04)',
}

export const infoBox: CSSProperties = {
  background: '#e8ecf8',
  border: '1px solid #dce1f2',
  borderRadius: 16,
  padding: 16,
}

export const sectionLabel: CSSProperties = {
  fontSize: 10.5,
  letterSpacing: '.14em',
  textTransform: 'uppercase',
  color: '#6b7392',
  fontWeight: 500,
}

export const h1: CSSProperties = {
  margin: '6px 0 4px',
  fontFamily: serif,
  fontSize: 30,
  lineHeight: 1.1,
  fontWeight: 600,
  letterSpacing: '-.02em',
}

export const backLink: CSSProperties = {
  fontSize: 12.5,
  color: '#6b7392',
  cursor: 'pointer',
  fontWeight: 500,
}

export const progressTrack = (height = 4, bg = '#e8ebf5'): CSSProperties => ({
  height,
  borderRadius: 9,
  background: bg,
  overflow: 'hidden',
})

export const progressFill = (pct: string, color: string, transition = 'width .4s ease'): CSSProperties => ({
  height: '100%',
  borderRadius: 9,
  transition,
  width: pct,
  background: color,
})

export const primaryButton = (bg: string): CSSProperties => ({
  textAlign: 'center',
  padding: 13,
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  color: '#fff',
  cursor: 'pointer',
  background: bg,
})
