import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AppActions } from '../useAppState'
import { supabase } from '../lib/supabaseClient'
import { backLink, h1Size, wideWidth } from '../styles'
import { ChevronLeft } from '../components/Icons'

// Écran d'administration. Il n'est affiché qu'aux comptes profiles.role = 'admin',
// mais la vraie protection est côté Supabase : les écritures passent par la clé
// anon et sont filtrées par les policies « admin write » (public.is_admin(),
// supabase/admin_roles_schema.sql). Un non-admin qui forcerait l'écran verrait
// ses écritures refusées par la base.

type Row = Record<string, unknown>
type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'time' | 'bool' | 'lines' | 'select'

interface Lookup { table: string; value: string; label: string }
interface Opt { value: string; label: string }

interface Field {
  key: string
  label: string
  type?: FieldType
  options?: string[]
  // liste déroulante alimentée par une autre table (ex. thème, candidat)
  lookup?: Lookup
  required?: boolean
  // clé primaire saisie à la création, non modifiable ensuite
  lockOnEdit?: boolean
  hint?: string
}

// Sous-éléments édités sous le formulaire d'une ligne (ex. choix d'une question)
interface ChildDef {
  label: string
  table: string
  fk: string
  // clés identifiant une ligne enfant (au moins une)
  pkKeys: string[]
  order: { column: string; ascending?: boolean }[]
  fields: Field[]
  title: (r: Row, lookups: Record<string, Opt[]>) => string
  defaults?: (rows: Row[]) => Row
  // un seul enfant peut avoir ce booléen à vrai (les autres sont remis à faux)
  exclusiveBool?: string
  // recopie ce champ de l'enfant « exclusif » dans le champ du parent
  syncToParent?: { childKey: string; parentKey: string }
}

interface TableDef {
  id: string
  label: string
  table: string
  pk: string
  select?: string
  // colonne « jour » : permet de trier / filtrer la liste par jour
  dayKey?: string
  children?: ChildDef[]
  order: { column: string; ascending?: boolean }[]
  title: (r: Row) => string
  sub?: (r: Row) => string
  fields: Field[]
  canCreate: boolean
  canDelete: boolean
  note?: string
  defaults?: Row
}

const str = (v: unknown) => (v === null || v === undefined ? '' : String(v))

const TABLES: TableDef[] = [
  {
    id: 'vote', label: 'Vote du jour', table: 'vote_questions', pk: 'code', dayKey: 'date_publication',
    order: [{ column: 'ordre' }],
    title: (r) => str(r.question), sub: (r) => `${str(r.code)} · ${str(r.statut)}${r.date_publication ? ' · ' + str(r.date_publication) : ''}`,
    canCreate: true, canDelete: true,
    defaults: { statut: 'active' },
    fields: [
      { key: 'code', label: 'Code (ex. V150)', required: true, lockOnEdit: true },
      { key: 'ordre', label: 'Ordre', type: 'number', required: true },
      { key: 'question', label: 'Question', type: 'textarea', required: true },
      { key: 'oui_label', label: 'Libellé « Oui »', type: 'text', required: true },
      { key: 'non_label', label: 'Libellé « Non »', type: 'text', required: true },
      { key: 'statut', label: 'Statut', type: 'select', options: ['active', 'a_verifier', 'retiree'], required: true },
      { key: 'date_publication', label: 'Date de publication', type: 'date' },
      { key: 'theme', label: 'Thème' },
      { key: 'arguments_pour', label: 'Arguments pour (un par ligne)', type: 'lines' },
      { key: 'arguments_contre', label: 'Arguments contre (un par ligne)', type: 'lines' },
    ],
  },
  {
    id: 'candidates', label: 'Candidats', table: 'candidates', pk: 'id',
    order: [{ column: 'full_name' }],
    title: (r) => str(r.full_name), sub: (r) => `${str(r.party)} · ${str(r.candidacy_status)}`,
    canCreate: true, canDelete: true,
    fields: [
      { key: 'slug', label: 'Slug (identifiant, ex. jean-dupont)', required: true },
      { key: 'full_name', label: 'Nom complet', required: true },
      { key: 'party', label: 'Parti', required: true },
      { key: 'candidacy_status', label: 'Statut de candidature (ex. déclaré, pressenti)', required: true },
      { key: 'candidacy_note', label: 'Note', type: 'textarea' },
      { key: 'website_url', label: 'Site web' },
    ],
  },
  {
    id: 'events', label: 'Agenda', table: 'events', pk: 'id', dayKey: 'event_date',
    order: [{ column: 'event_date', ascending: false }],
    title: (r) => str(r.title), sub: (r) => `${str(r.category)} · ${str(r.event_date) || str(r.date_label) || 'date à fixer'}`,
    canCreate: true, canDelete: true,
    defaults: { category: 'autre', date_precision: 'exact', reliability: 'a_confirmer' },
    children: [{
      label: 'Candidats rattachés', table: 'event_candidates', fk: 'event_id', pkKeys: ['candidate_id'],
      order: [{ column: 'role' }],
      title: (r, lk) => (lk.candidate_id?.find((o) => o.value === str(r.candidate_id))?.label ?? str(r.candidate_id)) + ' · ' + str(r.role),
      defaults: () => ({ role: 'participant' }),
      fields: [
        { key: 'candidate_id', label: 'Candidat', type: 'select', required: true, lookup: { table: 'candidates', value: 'id', label: 'full_name' } },
        { key: 'role', label: 'Rôle', type: 'select', options: ['participant', 'invite', 'organisateur'], required: true },
      ],
    }],
    fields: [
      { key: 'slug', label: 'Slug (identifiant unique)', required: true },
      { key: 'category', label: 'Catégorie', type: 'select', options: ['interview', 'debat', 'meeting', 'autre'], required: true },
      { key: 'subtype', label: 'Sous-type' },
      { key: 'title', label: 'Titre', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'event_date', label: 'Date', type: 'date' },
      { key: 'end_date', label: 'Date de fin', type: 'date' },
      { key: 'start_time', label: 'Heure de début', type: 'time' },
      { key: 'date_precision', label: 'Précision de la date', type: 'select', options: ['exact', 'jour', 'mois', 'approx'] },
      { key: 'date_label', label: 'Date affichée (texte libre, si imprécise)' },
      { key: 'location', label: 'Lieu' },
      { key: 'city', label: 'Ville' },
      { key: 'media', label: 'Média' },
      { key: 'reliability', label: 'Fiabilité', type: 'select', options: ['confirme', 'a_confirmer', 'conditionnel'] },
      { key: 'source_name', label: 'Source (nom)' },
      { key: 'source_url', label: 'Source (lien)' },
    ],
  },
  {
    id: 'quiz', label: 'Quiz', table: 'quiz_questions', pk: 'id',
    order: [{ column: 'code' }],
    title: (r) => str(r.prompt), sub: (r) => `${str(r.code)} · ${str(r.status)}`,
    canCreate: true, canDelete: true,
    defaults: { status: 'a_verifier' },
    note: "Une nouvelle question est créée en « a_verifier » : ajoutez ses 4 choix après l'enregistrement, puis passez-la en « active ».",
    children: [{
      label: 'Choix du QCM', table: 'quiz_question_choices', fk: 'question_id', pkKeys: ['id'],
      order: [{ column: 'position' }],
      title: (r) => (r.is_correct ? '✓ ' : '') + str(r.label),
      defaults: (rows) => ({ position: String(rows.reduce((m, r) => Math.max(m, Number(r.position) || 0), 0) + 1), is_correct: false }),
      exclusiveBool: 'is_correct',
      syncToParent: { childKey: 'label', parentKey: 'answer' },
      fields: [
        { key: 'label', label: 'Libellé du choix', required: true },
        { key: 'position', label: 'Position', type: 'number', required: true },
        { key: 'is_correct', label: 'Bonne réponse', type: 'bool' },
      ],
    }],
    fields: [
      { key: 'code', label: 'Code (ex. Q1651)', required: true, lockOnEdit: true },
      { key: 'theme_id', label: 'Thème', type: 'select', required: true, lookup: { table: 'quiz_themes', value: 'id', label: 'label' } },
      { key: 'position_in_theme', label: 'Position dans le thème', type: 'number', required: true },
      { key: 'prompt', label: 'Question', type: 'textarea', required: true },
      { key: 'answer', label: 'Bonne réponse', type: 'textarea', required: true },
      { key: 'explanation', label: 'Explication', type: 'textarea' },
      { key: 'status', label: 'Statut', type: 'select', options: ['active', 'a_verifier', 'doublon', 'retiree'], required: true },
      { key: 'difficulty', label: 'Difficulté', type: 'number' },
      { key: 'data_as_of', label: 'Données à jour au', type: 'date' },
      { key: 'review_note', label: 'Note de relecture', type: 'textarea' },
    ],
  },
  {
    id: 'affinites', label: 'Affinités', table: 'affinite_questions', pk: 'id',
    order: [{ column: 'ordre' }],
    title: (r) => str(r.enonce), sub: (r) => `${str(r.id)} · ${str(r.theme_code)}`,
    canCreate: true, canDelete: true,
    defaults: { poids: 1, dans_quiz_20: false, dans_quiz_100: true },
    fields: [
      { key: 'id', label: 'Identifiant (ex. A101)', required: true, lockOnEdit: true },
      { key: 'ordre', label: 'Ordre', type: 'number', required: true },
      { key: 'theme_code', label: 'Code du thème (voir table affinite_themes)', required: true },
      { key: 'enonce', label: 'Énoncé', type: 'textarea', required: true },
      { key: 'poids', label: 'Poids', type: 'number' },
      { key: 'dans_quiz_20', label: 'Dans le quiz court (20)', type: 'bool' },
      { key: 'dans_quiz_100', label: 'Dans le quiz complet', type: 'bool' },
    ],
  },
  {
    id: 'positions', label: 'Programmes', table: 'candidate_positions', pk: 'id',
    select: '*, candidates(full_name)',
    order: [{ column: 'theme' }],
    title: (r) => str((r.candidates as Row | null)?.full_name) + ' — ' + str(r.theme),
    sub: (r) => `Programme ${str(r.annee_programme)} · ${str(r.resume).slice(0, 80)}`,
    canCreate: true, canDelete: true,
    defaults: { annee_programme: '2027' },
    note: 'Un résumé de programme doit toujours avoir une source vérifiable (lien).',
    fields: [
      { key: 'candidate_id', label: 'Candidat', type: 'select', required: true, lookup: { table: 'candidates', value: 'id', label: 'full_name' } },
      { key: 'theme', label: 'Thème', type: 'select', options: ['Institutions', 'Économie', 'Écologie', 'Europe', 'Social', 'Sécurité'], required: true },
      { key: 'annee_programme', label: 'Année du programme', type: 'select', options: ['2022', '2027'], required: true },
      { key: 'resume', label: 'Résumé', type: 'textarea', required: true },
      { key: 'source_url', label: 'Source (lien)', required: true },
    ],
  },
  {
    id: 'quizthemes', label: 'Thèmes quiz', table: 'quiz_themes', pk: 'id',
    order: [{ column: 'position' }],
    title: (r) => str(r.label), sub: (r) => `${str(r.id)} · ${str(r.slug)}`,
    canCreate: true, canDelete: true,
    fields: [
      { key: 'id', label: 'Numéro du thème', type: 'number', required: true, lockOnEdit: true },
      { key: 'slug', label: 'Slug', required: true },
      { key: 'label', label: 'Libellé', required: true },
      { key: 'position', label: 'Position', type: 'number', required: true },
      { key: 'is_time_sensitive', label: 'Thème sensible au temps (à revérifier régulièrement)', type: 'bool' },
    ],
  },
  {
    id: 'affthemes', label: 'Thèmes affinités', table: 'affinite_themes', pk: 'code',
    order: [{ column: 'ordre' }],
    title: (r) => str(r.label), sub: (r) => str(r.code),
    canCreate: true, canDelete: true,
    fields: [
      { key: 'code', label: 'Code', required: true, lockOnEdit: true },
      { key: 'label', label: 'Libellé', required: true },
      { key: 'ordre', label: 'Ordre', type: 'number', required: true },
    ],
  },
  {
    id: 'notifs', label: 'Notifications', table: 'notifications_planning', pk: 'id', dayKey: 'date_envoi',
    order: [{ column: 'date_envoi', ascending: false }, { column: 'heure_envoi' }],
    title: (r) => str(r.titre), sub: (r) => `${str(r.date_envoi)} ${str(r.heure_envoi).slice(0, 5)} · ${r.actif ? 'actif' : 'inactif'}${r.envoye_le ? ' · envoyé' : ''}`,
    canCreate: true, canDelete: true,
    defaults: { actif: true },
    note: "Les notifications déjà envoyées ne sont pas renvoyées : modifiez plutôt la date d'une nouvelle.",
    fields: [
      { key: 'categorie', label: 'Catégorie' },
      { key: 'titre', label: 'Titre', required: true },
      { key: 'message', label: 'Message', type: 'textarea', required: true },
      { key: 'lien', label: 'Lien' },
      { key: 'date_envoi', label: "Date d'envoi", type: 'date', required: true },
      { key: 'heure_envoi', label: "Heure d'envoi", type: 'time', required: true },
      { key: 'actif', label: 'Actif', type: 'bool' },
    ],
  },
]

// Valeur du formulaire (texte) -> valeur envoyée à Supabase
function toDb(f: Field, v: unknown): unknown {
  const t = f.type ?? 'text'
  if (t === 'bool') return !!v
  if (t === 'lines') return str(v).split('\n').map((x) => x.trim()).filter(Boolean)
  const raw = str(v).trim()
  if (raw === '') return null
  if (t === 'number') return Number(raw)
  return raw
}

function toForm(f: Field, v: unknown): unknown {
  const t = f.type ?? 'text'
  if (t === 'bool') return !!v
  if (t === 'lines') return Array.isArray(v) ? v.join('\n') : ''
  if (t === 'time') return str(v).slice(0, 5)
  return str(v)
}

const errBox = { fontSize: 13, fontWeight: 600, color: '#8A1F0E', background: '#FFDFD8', borderRadius: 12, padding: '10px 12px' } as const

// Charge les listes déroulantes alimentées par d'autres tables
function useLookups(fields: Field[]): Record<string, Opt[]> {
  const [lk, setLk] = useState<Record<string, Opt[]>>({})
  useEffect(() => {
    let active = true
    fields.filter((f) => f.lookup).forEach(async (f) => {
      const l = f.lookup!
      const { data } = await supabase.from(l.table).select(`${l.value}, ${l.label}`).order(l.label).range(0, 1999)
      if (!active) return
      const opts = ((data as unknown as Row[] | null) ?? []).map((r) => ({ value: str(r[l.value]), label: str(r[l.label]) }))
      setLk((p) => ({ ...p, [f.key]: opts }))
    })
    return () => { active = false }
  }, [fields])
  return lk
}

function ChildEditor({ child, parentId, onSyncParent }: { child: ChildDef; parentId: string; onSyncParent: (key: string, value: string) => void }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [edit, setEdit] = useState<Row | 'new' | null>(null)
  const [form, setForm] = useState<Row>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const lookups = useLookups(child.fields)

  const load = useCallback(async () => {
    let q = supabase.from(child.table).select('*').eq(child.fk, parentId)
    for (const o of child.order) q = q.order(o.column, { ascending: o.ascending ?? true })
    const { data, error: err } = await q
    if (err) setError(err.message)
    setRows((data as Row[] | null) ?? [])
  }, [child, parentId])
  useEffect(() => { void load() }, [load])

  const open = (r: Row | 'new') => {
    const init: Row = {}
    const base = r === 'new' ? child.defaults?.(rows ?? []) ?? {} : r
    for (const f of child.fields) init[f.key] = toForm(f, base[f.key])
    setForm(init)
    setError(null)
    setEdit(r)
  }

  const matchPk = <T extends { eq: (c: string, v: string) => T }>(q: T, r: Row): T =>
    child.pkKeys.reduce((acc, k) => acc.eq(k, str(r[k])), q)

  const save = async () => {
    for (const f of child.fields) {
      if (f.required && (f.type ?? 'text') !== 'bool' && str(form[f.key]).trim() === '') { setError(`« ${f.label} » est obligatoire.`); return }
    }
    setBusy(true)
    setError(null)
    const payload: Row = { [child.fk]: parentId }
    for (const f of child.fields) payload[f.key] = toDb(f, form[f.key])
    // un seul enfant « exclusif » (ex. une seule bonne réponse) : on libère l'ancien avant
    if (child.exclusiveBool && payload[child.exclusiveBool]) {
      let q = supabase.from(child.table).update({ [child.exclusiveBool]: false }).eq(child.fk, parentId).eq(child.exclusiveBool, true)
      if (edit !== 'new' && edit) q = q.neq(child.pkKeys[0], str(edit[child.pkKeys[0]]))
      const { error: e0 } = await q
      if (e0) { setBusy(false); setError(e0.message); return }
    }
    const res = edit === 'new'
      ? await supabase.from(child.table).insert(payload).select()
      : await matchPk(supabase.from(child.table).update(payload).eq(child.fk, parentId), edit as Row).select()
    setBusy(false)
    if (res.error) { setError(res.error.message); return }
    if (!res.data || res.data.length === 0) { setError('Modification refusée par la base.'); return }
    if (child.syncToParent && child.exclusiveBool && payload[child.exclusiveBool]) {
      onSyncParent(child.syncToParent.parentKey, str(payload[child.syncToParent.childKey]))
      const { error: e1 } = await supabase.from('quiz_questions').update({ [child.syncToParent.parentKey]: payload[child.syncToParent.childKey] }).eq('id', parentId)
      if (e1) { setError(e1.message); return }
    }
    setEdit(null)
    void load()
  }

  const remove = async () => {
    if (!edit || edit === 'new') return
    setBusy(true)
    const { data, error: err } = await matchPk(supabase.from(child.table).delete().eq(child.fk, parentId), edit).select()
    setBusy(false)
    if (err) { setError(err.message); return }
    if (!data || data.length === 0) { setError('Suppression refusée par la base.'); return }
    setEdit(null)
    void load()
  }

  return (
    <div className="stk" style={{ gap: 10, borderTop: '1px solid #E7E2D6', paddingTop: 14 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3 className="dsp" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{child.label}</h3>
        {edit === null && <button type="button" onClick={() => open('new')} style={{ minHeight: 44, padding: '0 8px', fontSize: 14, fontWeight: 700, color: '#3B4FD8' }}>+ Ajouter</button>}
      </div>
      {error && <div role="alert" style={errBox}>{error}</div>}
      {edit === null ? (
        rows === null ? <div style={{ fontSize: 14, color: '#5C617B' }}>Chargement…</div>
        : rows.length === 0 ? <div style={{ fontSize: 14, color: '#5C617B' }}>Aucun élément.</div>
        : rows.map((r) => (
          <button key={child.pkKeys.map((k) => str(r[k])).join('|')} type="button" onClick={() => open(r)} className="card lift" style={{ textAlign: 'left', padding: '10px 14px', fontSize: 14.5, fontWeight: 600 }}>
            {child.title(r, lookups)}
          </button>
        ))
      ) : (
        <div className="stk" style={{ gap: 12, background: '#F6F4EE', borderRadius: 16, padding: 14 }}>
          {child.fields.map((f) => {
            const id = `adm-child-${f.key}`
            if (f.type === 'bool') {
              return (
                <label key={f.key} className="row" style={{ gap: 10, fontSize: 15, fontWeight: 600 }}>
                  <input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.checked }))} style={{ width: 22, height: 22 }} />
                  {f.label}
                </label>
              )
            }
            const opts: Opt[] = f.lookup ? lookups[f.key] ?? [] : (f.options ?? []).map((o) => ({ value: o, label: o }))
            return (
              <div key={f.key}>
                <label className="lbl" htmlFor={id}>{f.label}{f.required ? ' *' : ''}</label>
                {f.type === 'select' ? (
                  <select id={id} className="inp" value={str(form[f.key])} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}>
                    <option value="">—</option>
                    {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input id={id} className="inp" type={f.type === 'number' ? 'number' : 'text'} value={str(form[f.key])} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />
                )}
              </div>
            )
          })}
          <div className="row" style={{ gap: 8 }}>
            <button type="button" disabled={busy} onClick={() => setEdit(null)} className="btn" style={{ flex: 1, background: '#EFEBE2', color: '#14162B' }}>Annuler</button>
            <button type="button" disabled={busy} onClick={save} className="btn" style={{ flex: 1, background: '#171B3C' }}>{busy ? '…' : 'Enregistrer'}</button>
          </div>
          {edit !== 'new' && (
            <button type="button" disabled={busy} onClick={() => { if (window.confirm('Supprimer cet élément ?')) void remove() }} style={{ minHeight: 44, fontSize: 14, fontWeight: 700, color: '#B0301A' }}>Supprimer</button>
          )}
        </div>
      )}
    </div>
  )
}

function Editor({ def, row, onClose, onSaved }: { def: TableDef; row: Row | null; onClose: () => void; onSaved: (created?: Row) => void }) {
  const isNew = row === null
  const [form, setForm] = useState<Row>(() => {
    const init: Row = {}
    for (const f of def.fields) init[f.key] = toForm(f, row ? row[f.key] : def.defaults?.[f.key])
    return init
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const lookups = useLookups(def.fields)

  const set = (key: string, v: unknown) => setForm((p) => ({ ...p, [key]: v }))

  const save = async () => {
    for (const f of def.fields) {
      if (f.required && (f.type ?? 'text') !== 'bool' && str(form[f.key]).trim() === '') {
        setError(`« ${f.label} » est obligatoire.`)
        return
      }
      if (f.type === 'number' && str(form[f.key]).trim() !== '' && Number.isNaN(Number(str(form[f.key])))) {
        setError(`« ${f.label} » doit être un nombre.`)
        return
      }
    }
    setBusy(true)
    setError(null)
    const payload: Row = {}
    for (const f of def.fields) {
      if (!isNew && f.lockOnEdit) continue
      payload[f.key] = toDb(f, form[f.key])
    }
    const q = isNew
      ? supabase.from(def.table).insert(payload).select('*')
      : supabase.from(def.table).update(payload).eq(def.pk, row![def.pk] as string).select(def.pk)
    const { data, error: err } = await q
    setBusy(false)
    if (err) { setError(err.message); return }
    // création d'un élément avec sous-éléments : on le rouvre pour pouvoir les ajouter
    if (isNew && def.children && data && (data as Row[])[0]) { onSaved((data as Row[])[0]); return }
    // Un UPDATE refusé par le RLS ne renvoie pas d'erreur : il touche 0 ligne.
    if (!isNew && (!data || (data as unknown[]).length === 0)) {
      setError("Modification refusée : ce compte n'a pas les droits admin côté base.")
      return
    }
    onSaved()
  }

  const remove = async () => {
    setBusy(true)
    setError(null)
    const { data, error: err } = await supabase.from(def.table).delete().eq(def.pk, row![def.pk] as string).select(def.pk)
    setBusy(false)
    if (err) { setError(err.message); return }
    if (!data || (data as unknown[]).length === 0) { setError('Suppression refusée par la base.'); return }
    onSaved()
  }

  return (
    <div className="card stk" style={{ gap: 14 }} aria-label={isNew ? 'Nouvel élément' : 'Modifier'}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 className="dsp" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{isNew ? 'Nouveau — ' + def.label : 'Modifier'}</h2>
        <button type="button" onClick={onClose} style={{ minHeight: 44, padding: '0 8px', fontSize: 14, fontWeight: 700, color: '#454A66' }}>Fermer</button>
      </div>

      {def.fields.map((f) => {
        const t = f.type ?? 'text'
        const id = `adm-${def.id}-${f.key}`
        const locked = !isNew && f.lockOnEdit
        if (t === 'bool') {
          return (
            <label key={f.key} className="row" style={{ gap: 10, fontSize: 15, fontWeight: 600 }}>
              <input type="checkbox" checked={!!form[f.key]} onChange={(e) => set(f.key, e.target.checked)} style={{ width: 22, height: 22 }} />
              {f.label}
            </label>
          )
        }
        return (
          <div key={f.key}>
            <label className="lbl" htmlFor={id}>{f.label}{f.required ? ' *' : ''}</label>
            {t === 'textarea' || t === 'lines' ? (
              <textarea id={id} className="inp" rows={t === 'lines' ? 5 : 4} value={str(form[f.key])} onChange={(e) => set(f.key, e.target.value)}
                style={{ height: 'auto', padding: '12px 14px', lineHeight: 1.45, resize: 'vertical' }} />
            ) : t === 'select' ? (
              <select id={id} className="inp" value={str(form[f.key])} onChange={(e) => set(f.key, e.target.value)}>
                {(!f.required || f.lookup) && <option value="">—</option>}
                {(f.lookup ? lookups[f.key] ?? [] : (f.options ?? []).map((o) => ({ value: o, label: o }))).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input id={id} className="inp" type={t === 'number' ? 'number' : t === 'date' ? 'date' : t === 'time' ? 'time' : 'text'}
                value={str(form[f.key])} disabled={locked} onChange={(e) => set(f.key, e.target.value)} />
            )}
            {f.hint && <div style={{ fontSize: 12, color: '#5C617B', marginTop: 4 }}>{f.hint}</div>}
          </div>
        )
      })}

      {error && <div role="alert" style={errBox}>{error}</div>}

      <div className="row" style={{ gap: 8 }}>
        <button type="button" disabled={busy} onClick={onClose} className="btn" style={{ flex: 1, background: '#EFEBE2', color: '#14162B' }}>Annuler</button>
        <button type="button" disabled={busy} onClick={save} className="btn" style={{ flex: 1, background: '#171B3C' }}>{busy ? '…' : 'Enregistrer'}</button>
      </div>

      {!isNew && def.children?.map((c) => (
        <ChildEditor key={c.table} child={c} parentId={str(row![def.pk])} onSyncParent={(k, v) => set(k, v)} />
      ))}

      {!isNew && def.canDelete && (
        !confirmDelete ? (
          <button type="button" onClick={() => setConfirmDelete(true)} style={{ minHeight: 44, fontSize: 14, fontWeight: 700, color: '#B0301A' }}>Supprimer</button>
        ) : (
          <div className="row" style={{ gap: 8 }}>
            <button type="button" disabled={busy} onClick={() => setConfirmDelete(false)} className="btn" style={{ flex: 1, background: '#EFEBE2', color: '#14162B' }}>Non, garder</button>
            <button type="button" disabled={busy} onClick={remove} className="btn" style={{ flex: 1, background: '#B0301A' }}>Confirmer la suppression</button>
          </div>
        )
      )}
    </div>
  )
}

interface Props {
  actions: AppActions
  isWeb: boolean
}

export default function Admin({ actions, isWeb }: Props) {
  const [tabId, setTabId] = useState(TABLES[0].id)
  const def = TABLES.find((t) => t.id === tabId)!
  const [rows, setRows] = useState<Row[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  // tri / filtre par jour (onglets qui ont une colonne jour)
  const [sort, setSort] = useState<'defaut' | 'asc' | 'desc'>('asc')
  const [day, setDay] = useState('')
  // null = liste ; 'new' = création ; Row = édition
  const [editing, setEditing] = useState<Row | 'new' | null>(null)

  const load = useCallback(async () => {
    setRows(null)
    setLoadError(null)
    let q = supabase.from(def.table).select(def.select ?? '*')
    for (const o of def.order) q = q.order(o.column, { ascending: o.ascending ?? true, nullsFirst: false })
    const { data, error } = await q.range(0, 1999)
    if (error) { setLoadError(error.message); setRows([]); return }
    setRows((data as unknown as Row[]) ?? [])
  }, [def])

  useEffect(() => { setEditing(null); setQuery(''); setDay(''); setSort('asc'); void load() }, [load])

  const shown = useMemo(() => {
    if (!rows) return []
    const n = query.trim().toLowerCase()
    let out = n ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(n)) : rows
    const k = def.dayKey
    if (k) {
      if (day) out = out.filter((r) => str(r[k]).slice(0, 10) === day)
      if (sort !== 'defaut') {
        // sans jour : toujours en fin de liste, quel que soit le sens
        const dir = sort === 'asc' ? 1 : -1
        out = [...out].sort((a, b) => {
          const da = str(a[k]).slice(0, 10)
          const db = str(b[k]).slice(0, 10)
          if (!da && !db) return 0
          if (!da) return 1
          if (!db) return -1
          return da < db ? -dir : da > db ? dir : 0
        })
      }
    }
    return out
  }, [rows, query, def, sort, day])

  return (
    <div className="rise stk" style={{ gap: 18, width: '100%', margin: '0 auto', maxWidth: wideWidth(isWeb) }}>
      <button type="button" onClick={actions.back} style={backLink}><ChevronLeft />Retour</button>
      <div className="stk" style={{ gap: 8 }}>
        <div className="eyebrow">Administration</div>
        <h1 className="dsp" style={{ margin: 0, fontSize: h1Size(isWeb), lineHeight: 1.02, fontWeight: 700 }}>Contenu de l'app</h1>
        <div style={{ fontSize: 15, color: '#454A66', lineHeight: 1.5 }}>Les modifications sont publiées immédiatement pour tous les utilisateurs.</div>
      </div>

      <div role="tablist" aria-label="Contenu à modifier" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: isWeb ? 0 : '0 -16px', padding: isWeb ? 0 : '0 16px' }}>
        {TABLES.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={t.id === tabId} className="chip" onClick={() => setTabId(t.id)}
            style={{ background: t.id === tabId ? '#171B3C' : '#fff', color: t.id === tabId ? '#fff' : '#14162B', borderColor: t.id === tabId ? '#171B3C' : '#DDD7C9' }}>
            {t.label}
          </button>
        ))}
      </div>

      {editing !== null ? (
        <Editor key={editing === 'new' ? 'new' : str(editing[def.pk])} def={def} row={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)} onSaved={(created) => { setEditing(created ?? null); void load() }} />
      ) : (
        <>
          {def.note && <div style={{ fontSize: 13, color: '#454A66', lineHeight: 1.5 }}>{def.note}</div>}
          <div className="row" style={{ gap: 8 }}>
            <input className="inp" type="search" placeholder="Rechercher…" aria-label="Rechercher" value={query} onChange={(e) => setQuery(e.target.value)} />
            {def.canCreate && (
              <button type="button" onClick={() => setEditing('new')} className="btn" style={{ flex: 'none', background: '#171B3C', minHeight: 50 }}>+ Ajouter</button>
            )}
          </div>
          {def.dayKey && (
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <select className="inp" aria-label="Trier par jour" value={sort} onChange={(e) => setSort(e.target.value as 'defaut' | 'asc' | 'desc')} style={{ flex: '1 1 160px', width: 'auto' }}>
                <option value="asc">Jour : du plus ancien au plus récent</option>
                <option value="desc">Jour : du plus récent au plus ancien</option>
                <option value="defaut">Ordre d'origine</option>
              </select>
              <input className="inp" type="date" aria-label="Aller à un jour" value={day} onChange={(e) => setDay(e.target.value)} style={{ flex: '1 1 150px', width: 'auto' }} />
              <button type="button" className="chip" onClick={() => setDay(new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' }))} style={{ background: '#fff', borderColor: '#DDD7C9' }}>Aujourd'hui</button>
              {day && <button type="button" className="chip" onClick={() => setDay('')} style={{ background: '#fff', borderColor: '#DDD7C9' }}>Tous les jours</button>}
            </div>
          )}
          {loadError && <div role="alert" style={errBox}>{loadError}</div>}
          {rows === null ? (
            <div style={{ fontSize: 14, color: '#5C617B' }}>Chargement…</div>
          ) : (
            <div className="stk" style={{ gap: 8 }}>
              <div className="eyebrow">{shown.length} élément{shown.length > 1 ? 's' : ''}</div>
              {shown.map((r, i) => {
                const k = def.dayKey
                const d = k ? str(r[k]).slice(0, 10) : ''
                const prev = k && i > 0 ? str(shown[i - 1][k]).slice(0, 10) : null
                // titre de jour quand on trie par jour et que le jour change
                const header = k && sort !== 'defaut' && (i === 0 || d !== prev)
                  ? (d ? new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Sans jour')
                  : null
                return (
                  <div key={str(r[def.pk])} className="stk" style={{ gap: 8 }}>
                    {header && <div className="eyebrow" style={{ paddingTop: i === 0 ? 0 : 8 }}>{header}</div>}
                    <button type="button" onClick={() => setEditing(r)} className="card lift stk" style={{ gap: 3, textAlign: 'left', padding: '12px 14px' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{def.title(r)}</span>
                      {def.sub && <span style={{ fontSize: 12.5, color: '#5C617B' }}>{def.sub(r)}</span>}
                    </button>
                  </div>
                )
              })}
              {shown.length === 0 && !loadError && <div style={{ fontSize: 14, color: '#5C617B' }}>Aucun élément.</div>}
            </div>
          )}
        </>
      )}
    </div>
  )
}
