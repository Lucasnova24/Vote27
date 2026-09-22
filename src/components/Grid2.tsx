import type { ReactNode } from 'react'

interface Props {
  isWeb: boolean
  gap: number
  colA: ReactNode
  colB: ReactNode
}

// Two-column layout on web (each column keeps its own DOM order), single
// flex column on phone — where `display:contents` on the column wrappers
// lets every card become a direct flex child of the outer column, so the
// `order` CSS each card sets (see screens/*) puts them in the right visual
// sequence even though colA/colB group them differently for the web grid.
export default function Grid2({ isWeb, gap, colA, colB }: Props) {
  return (
    <div
      style={{
        display: isWeb ? 'grid' : 'flex',
        gridTemplateColumns: isWeb ? 'minmax(0, 1.25fr) minmax(0, 1fr)' : undefined,
        flexDirection: 'column',
        gap,
        alignItems: isWeb ? 'start' : 'stretch',
      }}
    >
      <div style={{ display: isWeb ? 'flex' : 'contents', flexDirection: 'column', gap, minWidth: 0 }}>{colA}</div>
      <div style={{ display: isWeb ? 'flex' : 'contents', flexDirection: 'column', gap, minWidth: 0 }}>{colB}</div>
    </div>
  )
}
