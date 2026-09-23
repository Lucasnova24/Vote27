import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { LeagueMemberRow, LeagueRow } from '../lib/dbTypes'
import { ChevronRight } from './Icons'

function logIfError(label: string) {
  return ({ error }: { error: { message: string } | null }) => {
    if (error) console.error(`[supabase] ${label}:`, error.message)
  }
}

export default function Leagues() {
  const [leagues, setLeagues] = useState<LeagueRow[] | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [members, setMembers] = useState<Record<string, LeagueMemberRow[]>>({})
  const [mode, setMode] = useState<'none' | 'create' | 'join'>('none')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justCreated, setJustCreated] = useState<LeagueRow | null>(null)

  const loadLeagues = () => {
    supabase.rpc('get_my_leagues').then(({ data, error: err }) => {
      if (err) {
        console.error('[supabase] get_my_leagues:', err.message)
        return
      }
      setLeagues((data as LeagueRow[] | null) ?? [])
    })
  }

  useEffect(() => {
    loadLeagues()
  }, [])

  const toggleExpand = (league: LeagueRow) => {
    const id = league.id
    if (expanded === id) {
      setExpanded(null)
      return
    }
    setExpanded(id)
    if (!members[id]) {
      supabase.rpc('get_league_members', { p_league_id: id }).then(({ data, error: err }) => {
        if (err) {
          console.error('[supabase] get_league_members:', err.message)
          return
        }
        setMembers((m) => ({ ...m, [id]: (data as LeagueMemberRow[] | null) ?? [] }))
      })
    }
  }

  const handleCreate = () => {
    if (!name.trim()) return
    setBusy(true)
    setError(null)
    supabase.rpc('create_league', { p_name: name.trim() }).then(({ data, error: err }) => {
      setBusy(false)
      if (err) {
        setError(err.message)
        return
      }
      const league = data as LeagueRow
      setJustCreated(league)
      setName('')
      setMode('none')
      loadLeagues()
    })
  }

  const handleJoin = () => {
    if (!code.trim()) return
    setBusy(true)
    setError(null)
    supabase.rpc('join_league', { p_code: code.trim() }).then(({ error: err }) => {
      setBusy(false)
      if (err) {
        setError(err.message)
        return
      }
      setCode('')
      setMode('none')
      loadLeagues()
    })
  }

  const handleLeave = (id: string) => () => {
    supabase.rpc('leave_league', { p_league_id: id }).then(logIfError('leave_league'))
    setLeagues((ls) => (ls ? ls.filter((l) => l.id !== id) : ls))
    if (expanded === id) setExpanded(null)
  }

  const copyCode = (c: string) => () => {
    navigator.clipboard?.writeText(c).catch(() => {})
  }

  return (
    <section aria-label="Mes ligues">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline', margin: '6px 0 12px' }}>
        <h2 className="dsp" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Mes ligues</h2>
        <span style={{ fontSize: 13, color: '#5C617B' }}>entre amis, en privé</span>
      </div>

      {justCreated && (
        <div className="card rise" style={{ background: '#DDF3E3', borderColor: '#8CC9A0', boxShadow: 'none', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#14532D' }}>{'Ligue « ' + justCreated.name + ' » créée !'}</div>
          <div style={{ fontSize: 13, color: '#14532D', marginTop: 4 }}>Partage ce code pour inviter du monde :</div>
          <div className="row" style={{ gap: 10, marginTop: 8 }}>
            <span className="dsp num" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '.08em', color: '#14532D' }}>{justCreated.code}</span>
            <button type="button" onClick={copyCode(justCreated.code)} className="chip" style={{ background: '#fff', borderColor: '#8CC9A0', color: '#14532D' }}>Copier</button>
          </div>
        </div>
      )}

      {leagues === null && (
        <div style={{ padding: 16, fontSize: 13, color: '#5C617B' }}>Chargement…</div>
      )}

      {leagues !== null && leagues.length === 0 && (
        <div style={{ fontSize: 14, color: '#5C617B', marginBottom: 12 }}>Tu n'es dans aucune ligue pour l'instant.</div>
      )}

      {leagues !== null && leagues.length > 0 && (
        <div className="card" style={{ padding: 6, marginBottom: 12 }}>
          {leagues.map((l) => (
            <div key={l.id} className="sep">
              <button type="button" onClick={() => toggleExpand(l)} className="row rowh" style={{ width: '100%', gap: 12, minHeight: 66, padding: '10px 12px', borderRadius: 18 }}>
                <span style={{ width: 44, height: 44, borderRadius: 14, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, background: '#E3E7FF', color: '#1F2A8A' }}>
                  {l.name.slice(0, 2).toUpperCase()}
                </span>
                <span style={{ flex: 1, minWidth: 0, display: 'block', textAlign: 'left' }}>
                  <span style={{ display: 'block', fontSize: 15.5, fontWeight: 700, letterSpacing: '-.01em' }}>{l.name}</span>
                  <span style={{ display: 'block', fontSize: 13, color: '#5C617B', marginTop: 1 }}>{l.member_count + (l.member_count > 1 ? ' joueurs' : ' joueur')}</span>
                </span>
                <ChevronRight size={18} color="#5C617B" />
              </button>
              {expanded === l.id && (
                <div className="rise" style={{ padding: '0 12px 14px' }}>
                  <div className="row" style={{ gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12.5, color: '#5C617B' }}>Code d'invitation</span>
                    <span className="dsp num" style={{ fontSize: 15, fontWeight: 800, letterSpacing: '.06em' }}>{l.code}</span>
                    <button type="button" onClick={copyCode(l.code)} className="chip" style={{ background: '#F6F4EE', borderColor: '#DDD7C9', color: '#454A66', minHeight: 32, padding: '0 12px', fontSize: 12.5 }}>Copier</button>
                  </div>
                  <div className="stk" style={{ gap: 0 }}>
                    {(members[l.id] ?? []).map((m, i) => (
                      <div key={i} className="row sep" style={{ gap: 12, padding: '8px 0' }}>
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{m.pseudo}</span>
                        <span className="num" style={{ fontSize: 13, color: '#5C617B' }}>{m.points.toLocaleString('fr-FR') + ' pts'}</span>
                      </div>
                    ))}
                    {members[l.id] === undefined && <div style={{ fontSize: 13, color: '#5C617B', padding: '6px 0' }}>Chargement…</div>}
                  </div>
                  <button type="button" onClick={handleLeave(l.id)} style={{ marginTop: 8, minHeight: 36, fontSize: 13, fontWeight: 700, color: '#B0301A' }}>Quitter la ligue</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {mode === 'none' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={() => { setMode('create'); setError(null) }} className="btn" style={{ flex: 1, background: '#14162B' }}>Créer une ligue</button>
          <button type="button" onClick={() => { setMode('join'); setError(null) }} className="btn" style={{ flex: 1, background: '#fff', color: '#14162B', border: '1.5px solid #DDD7C9' }}>Rejoindre</button>
        </div>
      )}

      {mode === 'create' && (
        <div className="card rise" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label className="lbl" htmlFor="league-name">Nom de la ligue</label>
            <input id="league-name" className="inp" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="La coloc'" />
          </div>
          {error && <div role="alert" style={{ fontSize: 13, fontWeight: 600, color: '#8A1F0E', background: '#FFDFD8', borderRadius: 12, padding: '10px 12px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={handleCreate} disabled={busy || !name.trim()} className="btn" style={{ flex: 1, background: '#14162B' }}>{busy ? '…' : 'Créer'}</button>
            <button type="button" onClick={() => setMode('none')} className="btn" style={{ flex: 1, background: '#fff', color: '#14162B', border: '1.5px solid #DDD7C9' }}>Annuler</button>
          </div>
        </div>
      )}

      {mode === 'join' && (
        <div className="card rise" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <label className="lbl" htmlFor="league-code">Code d'invitation</label>
            <input id="league-code" className="inp" value={code} onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target.value.toUpperCase())} placeholder="ABC123" />
          </div>
          {error && <div role="alert" style={{ fontSize: 13, fontWeight: 600, color: '#8A1F0E', background: '#FFDFD8', borderRadius: 12, padding: '10px 12px' }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={handleJoin} disabled={busy || !code.trim()} className="btn" style={{ flex: 1, background: '#14162B' }}>{busy ? '…' : 'Rejoindre'}</button>
            <button type="button" onClick={() => setMode('none')} className="btn" style={{ flex: 1, background: '#fff', color: '#14162B', border: '1.5px solid #DDD7C9' }}>Annuler</button>
          </div>
        </div>
      )}
    </section>
  )
}
