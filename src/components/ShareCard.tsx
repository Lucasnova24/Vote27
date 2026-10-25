import { useState } from 'react'
import { shareApp } from '../lib/native'
import { ChevronRight } from './Icons'

interface Props {
  order?: number
}

// "Partager à mes amis" : feuille de partage native, ou lien copié sur le web.
export default function ShareCard({ order }: Props) {
  const [done, setDone] = useState(false)
  const onShare = async () => {
    if (await shareApp()) {
      setDone(true)
      setTimeout(() => setDone(false), 2500)
    }
  }
  return (
    <button type="button" onClick={onShare} className="card lift row" style={{ order, width: '100%', gap: 12, textAlign: 'left', background: '#E3E7FF', borderColor: '#B8C0F5' }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, color: '#1F2A8A' }}>Partager à mes amis</span>
        <span style={{ display: 'block', fontSize: 13, color: '#2A3596', marginTop: 2 }}>{done ? 'Merci, c\'est partagé !' : 'Invite tes proches à préparer 2027 avec toi'}</span>
      </span>
      <ChevronRight size={18} color="#1F2A8A" />
    </button>
  )
}
