import { mono } from '../styles'

interface Props {
  onOpenProfil: () => void
  showPoints: boolean
  pts: number
  headPad: string
  maxW: number | 'none'
  sticky: boolean
  name: string
  initials: string
  level: number
  boussoleDone: boolean
}

export default function HeaderCard({ onOpenProfil, showPoints, pts, headPad, maxW, sticky, name, initials, level, boussoleDone }: Props) {
  const ptsLabel = pts.toLocaleString('fr-FR')
  return (
    <div style={{ position: sticky ? 'sticky' : 'static', top: 0, zIndex: 20, background: '#eef0f7', borderBottom: '1px solid #e1e5f1', flex: 'none', padding: headPad }}>
      <div onClick={onOpenProfil} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', margin: '0 auto', maxWidth: maxW }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1b2a63', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 600, letterSpacing: '.04em', flex: 'none' }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <div style={{ fontSize: 11.5, color: '#6b7392', marginTop: 1 }}>{'Niveau ' + level + ' · ' + (boussoleDone ? 'Boussole faite' : 'Boussole à faire')}</div>
        </div>
        {showPoints && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: mono, fontSize: 15, fontWeight: 600, letterSpacing: '-.02em' }}>{ptsLabel}</div>
            <div style={{ fontSize: 10, color: '#6b7392', letterSpacing: '.06em', textTransform: 'uppercase' }}>points ◆</div>
          </div>
        )}
      </div>
    </div>
  )
}
