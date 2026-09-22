import type { CSSProperties } from 'react'

export const colors = {
  bg: '#F6F4EE',
  text: '#14162B',
  sub: '#454A66',
  subMuted: '#5C617B',
  border: '#E7E2D6',
  borderSoft: '#EDE9DF',
  borderStrong: '#DDD7C9',
  navy: '#171B3C',
}

// Route sub-screens (vote, quiz run, boussole, débat…) center in a narrower
// column; the "programmes" comparison screen gets a wider one.
export const flowWidth = (isWeb: boolean) => (isWeb ? 680 : undefined)
export const wideWidth = (isWeb: boolean) => (isWeb ? 980 : undefined)

export const h1Size = (isWeb: boolean) => (isWeb ? 46 : 34)
export const qSize = (isWeb: boolean) => (isWeb ? 36 : 28)
export const gapPage = (isWeb: boolean) => (isWeb ? 24 : 16)

export const pagePad = (isWeb: boolean): CSSProperties =>
  isWeb ? { padding: '20px 40px 56px' } : { padding: '10px 16px 28px' }

export const flowWrap = (isWeb: boolean): CSSProperties => ({
  width: '100%',
  margin: '0 auto',
  maxWidth: flowWidth(isWeb),
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
})

export const backLink: CSSProperties = {
  display: 'inline-flex',
  alignSelf: 'flex-start',
  alignItems: 'center',
  gap: 4,
  minHeight: 44,
  padding: '0 12px 0 2px',
  fontSize: 15,
  fontWeight: 700,
  color: colors.sub,
  cursor: 'pointer',
}

export const primaryButton = (bg: string): CSSProperties => ({
  background: bg,
})
