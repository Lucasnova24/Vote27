// Veille de l'agenda : cherche sur le web les nouveaux événements de la
// campagne présidentielle 2027 (débats, interviews, meetings, scrutins
// internes, annonces...) et les enregistre dans Supabase, d'où l'onglet
// Agenda les lit via la vue public.agenda.
//
// Lancé par .github/workflows/veille-agenda.yml. En local :
//   ANTHROPIC_API_KEY=... SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run veille
//   DRY_RUN=1 npm run veille   # affiche ce qui serait écrit, sans écrire
//
// Règles d'écriture (volontairement prudentes) :
// - un événement n'est enregistré que s'il a une source https ;
// - une mise à jour ne vide jamais un champ, elle ne fait que compléter ou
//   corriger avec une valeur non nulle ;
// - les participants sont ajoutés, jamais retirés ;
// - rien n'est jamais supprimé.

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const MODEL = 'claude-opus-5'
const TOOL_NAME = 'enregistrer_resultats'
const MAX_TURNS = 8

const CATEGORIES = ['interview', 'debat', 'meeting', 'autre'] as const
const RELIABILITIES = ['confirme', 'a_confirmer', 'conditionnel'] as const
const PRECISIONS = ['exact', 'jour', 'mois', 'approx'] as const
const ROLES = ['participant', 'invite', 'organisateur'] as const

type Category = (typeof CATEGORIES)[number]
type Reliability = (typeof RELIABILITIES)[number]
type Precision = (typeof PRECISIONS)[number]
type Role = (typeof ROLES)[number]

interface ProposedCandidate {
  slug: string
  full_name: string
  party: string
  candidacy_status: string
  candidacy_note: string | null
  website_url: string | null
  source_url: string
}

interface ProposedEvent {
  action: 'creer' | 'mettre_a_jour'
  slug: string
  category: Category
  subtype: string | null
  title: string
  description: string | null
  event_date: string | null
  end_date: string | null
  start_time: string | null
  date_precision: Precision
  date_label: string | null
  location: string | null
  city: string | null
  media: string | null
  reliability: Reliability
  source_name: string | null
  source_url: string
  participants: { candidate_slug: string; role: Role }[]
}

interface ToolInput {
  nouveaux_candidats: ProposedCandidate[]
  evenements: ProposedEvent[]
  resume: string
}

interface ExistingEvent {
  id: string
  slug: string
  category: Category
  subtype: string | null
  title: string
  description: string | null
  event_date: string | null
  end_date: string | null
  start_time: string | null
  date_precision: Precision
  date_label: string | null
  location: string | null
  city: string | null
  media: string | null
  reliability: Reliability
  source_name: string | null
  source_url: string | null
  event_candidates: { role: Role; candidates: { slug: string } | null }[]
}

interface Rejection {
  slug: string
  reason: string
}

const nullableString = { type: ['string', 'null'] }

const recordTool: Anthropic.Beta.BetaTool = {
  name: TOOL_NAME,
  description:
    "Enregistre le résultat de la veille : les événements nouveaux ou mis à jour et les nouveaux candidats. À appeler une seule fois, à la fin de la recherche, même si rien de nouveau n'a été trouvé (listes vides).",
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    additionalProperties: false,
    required: ['nouveaux_candidats', 'evenements', 'resume'],
    properties: {
      nouveaux_candidats: {
        type: 'array',
        description:
          "Personnes absentes de la liste des candidats connus mais qui participent à un événement enregistré. Ne pas y remettre un candidat déjà connu.",
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['slug', 'full_name', 'party', 'candidacy_status', 'candidacy_note', 'website_url', 'source_url'],
          properties: {
            slug: { type: 'string', description: 'prenom-nom en minuscules sans accents, ex. "marine-le-pen"' },
            full_name: { type: 'string' },
            party: { type: 'string' },
            candidacy_status: { type: 'string', description: 'ex. "Déclaré (3 mai 2026)", "Candidat à la primaire"' },
            candidacy_note: nullableString,
            website_url: nullableString,
            source_url: { type: 'string', description: 'URL https de la page qui atteste la candidature' },
          },
        },
      },
      evenements: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: [
            'action', 'slug', 'category', 'subtype', 'title', 'description', 'event_date', 'end_date',
            'start_time', 'date_precision', 'date_label', 'location', 'city', 'media', 'reliability',
            'source_name', 'source_url', 'participants',
          ],
          properties: {
            action: {
              type: 'string',
              enum: ['creer', 'mettre_a_jour'],
              description: '"mettre_a_jour" uniquement avec le slug exact d\'un événement déjà connu.',
            },
            slug: { type: 'string', description: 'identifiant stable en kebab-case, ex. "retailleau-meeting-nantes-2026-11"' },
            category: { type: 'string', enum: [...CATEGORIES] },
            subtype: { ...nullableString, description: 'ex. "Débat de primaire", "Grand meeting", "Interview TV", "Scrutin interne", "Annonce"' },
            title: { type: 'string' },
            description: nullableString,
            event_date: { ...nullableString, description: 'AAAA-MM-JJ, null si le jour n\'est pas connu' },
            end_date: { ...nullableString, description: 'AAAA-MM-JJ pour un événement sur plusieurs jours, sinon null' },
            start_time: { ...nullableString, description: 'HH:MM heure de Paris, null si inconnue' },
            date_precision: { type: 'string', enum: [...PRECISIONS] },
            date_label: { ...nullableString, description: 'obligatoire si event_date est null, ex. "Octobre 2026 (date non fixée)"' },
            location: nullableString,
            city: nullableString,
            media: { ...nullableString, description: 'chaîne, radio ou journal qui diffuse / organise' },
            reliability: { type: 'string', enum: [...RELIABILITIES] },
            source_name: nullableString,
            source_url: { type: 'string', description: 'URL https d\'une page consultée pendant cette recherche' },
            participants: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['candidate_slug', 'role'],
                properties: {
                  candidate_slug: { type: 'string' },
                  role: { type: 'string', enum: [...ROLES] },
                },
              },
            },
          },
        },
      },
      resume: { type: 'string', description: 'Deux ou trois phrases sur ce qui a été trouvé.' },
    },
  },
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Variable d'environnement manquante : ${name}`)
    process.exit(1)
  }
  return value
}

function parisToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date())
}

function formatExisting(events: ExistingEvent[]): string {
  return events
    .map((e) => {
      const when = e.event_date
        ? `${e.event_date}${e.end_date ? ` → ${e.end_date}` : ''}${e.start_time ? ` ${e.start_time.slice(0, 5)}` : ''}`
        : e.date_label ?? '?'
      const who = e.event_candidates
        .map((ec) => ec.candidates?.slug)
        .filter(Boolean)
        .join(', ')
      const where = [e.city, e.media].filter(Boolean).join(' / ')
      return `- ${e.slug} | ${e.category} | ${when} | ${e.title}${where ? ` | ${where}` : ''} | ${e.reliability}${who ? ` | ${who}` : ''}`
    })
    .join('\n')
}

function buildSystemPrompt(): string {
  return `Tu tiens à jour l'agenda d'une application française consacrée à l'élection présidentielle de 2027. Ton travail : chercher sur le web les événements de campagne nouveaux ou modifiés et les enregistrer avec l'outil ${TOOL_NAME}.

Ce qui entre dans l'agenda :
- débats télévisés ou radio entre candidats ou prétendants (category "debat") ;
- grandes interviews d'un candidat dans un média national, annoncées à l'avance (category "interview") ;
- meetings et grands rassemblements de campagne (category "meeting") ;
- scrutins internes (primaires, votes d'adhérents), déclarations de candidature annoncées, conventions et congrès d'investiture, dates officielles du calendrier électoral (category "autre").
Ce qui n'y entre pas : les simples déplacements de terrain, les petites apparitions médiatiques quotidiennes, les rumeurs sans source, les événements sans lien avec la présidentielle 2027.

Période : les événements à venir, et ceux des 7 derniers jours qui manqueraient. Ne crée rien de plus ancien.

Fiabilité ("reliability") :
- "confirme" : annoncé par l'organisateur, le média ou le candidat, ou rapporté par un média reconnu comme fixé ;
- "a_confirmer" : annoncé mais dont la date, l'heure ou le format restent incertains ;
- "conditionnel" : n'aura lieu que sous condition (ex. second tour éventuel).

Précision de la date ("date_precision") : "exact" = jour et heure connus ; "jour" = jour connu, heure inconnue ; "mois" = seul le mois est connu ; "approx" = période vague. Si event_date est null, date_label est obligatoire. Heures au format HH:MM, heure de Paris.

Règles :
- Chaque événement doit citer dans source_url une page que tu as réellement consultée pendant cette recherche et qui l'atteste. Pas de source, pas d'événement.
- Ne recrée jamais un événement déjà connu (liste fournie), même sous un autre slug ou un autre titre. Si tu trouves une information nouvelle sur un événement connu (heure annoncée, chaîne, lieu, fiabilité qui change, participant manquant), utilise action "mettre_a_jour" avec son slug exact et renvoie la fiche complète corrigée.
- Les participants se réfèrent aux slugs des candidats connus. Si une personne manque, ajoute-la dans nouveaux_candidats avec une source.
- Rédige les titres et descriptions en français, sobrement, sans opinion.
- Si rien de nouveau n'est trouvé, appelle quand même l'outil avec des listes vides.`
}

function buildUserPrompt(today: string, events: ExistingEvent[], candidates: { slug: string; full_name: string; party: string }[]): string {
  return `Nous sommes le ${today} (heure de Paris).

Candidats connus (slug | nom | parti) :
${candidates.map((c) => `- ${c.slug} | ${c.full_name} | ${c.party}`).join('\n')}

Événements déjà dans l'agenda (slug | catégorie | date | titre | lieu/média | fiabilité | participants) :
${formatExisting(events) || '(aucun)'}

Fais la veille : cherche les événements de campagne annoncés récemment (débats, interviews, meetings, primaires, déclarations...), vérifie ce qui a changé pour les événements à venir déjà connus, puis appelle ${TOOL_NAME}.`
}

async function runResearch(client: Anthropic, system: string, user: string): Promise<ToolInput> {
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: user }]

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const message = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 64000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high' },
        system,
        tools: [
          { type: 'web_search_20260209', name: 'web_search', max_uses: 25, user_location: { type: 'approximate', country: 'FR', timezone: 'Europe/Paris' } },
          { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 15 },
          recordTool,
        ],
        messages,
      })
      .finalMessage()

    console.log(
      `[claude] tour ${turn + 1} : stop=${message.stop_reason}, modèle=${message.model}, ` +
        `entrée=${message.usage.input_tokens}, sortie=${message.usage.output_tokens}`,
    )

    if (message.stop_reason === 'refusal') {
      throw new Error(`Requête refusée par le modèle (${message.stop_details?.category ?? 'sans catégorie'})`)
    }
    if (message.stop_reason === 'max_tokens') {
      throw new Error('Réponse tronquée (max_tokens atteint)')
    }

    const call = message.content.find(
      (block): block is Anthropic.Beta.BetaToolUseBlock => block.type === 'tool_use' && block.name === TOOL_NAME,
    )
    if (call) return call.input as ToolInput

    messages.push({ role: 'assistant', content: message.content })
    // pause_turn : le serveur reprend tout seul la boucle de recherche, il ne
    // faut rien ajouter. Sinon le modèle a fini sans appeler l'outil.
    if (message.stop_reason !== 'pause_turn') {
      messages.push({
        role: 'user',
        content: `Appelle maintenant ${TOOL_NAME} avec ce que tu as trouvé (listes vides si rien de nouveau).`,
      })
    }
  }
  throw new Error(`Pas de résultat après ${MAX_TURNS} tours`)
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

function isValidDate(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

function isHttpsUrl(value: string | null | undefined): boolean {
  if (!value) return false
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function clean(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Returns the reason the event is rejected, or null when it can be written.
function validateEvent(e: ProposedEvent, today: string, knownCandidates: Set<string>): string | null {
  if (!e || typeof e !== 'object') return 'entrée invalide'
  if (!SLUG_RE.test(e.slug ?? '')) return 'slug invalide'
  if (!clean(e.title)) return 'titre manquant'
  if (!CATEGORIES.includes(e.category)) return `catégorie inconnue (${e.category})`
  if (!RELIABILITIES.includes(e.reliability)) return `fiabilité inconnue (${e.reliability})`
  if (!PRECISIONS.includes(e.date_precision)) return `précision inconnue (${e.date_precision})`
  if (!isHttpsUrl(e.source_url)) return 'source https manquante'
  if (e.event_date && !isValidDate(e.event_date)) return `date invalide (${e.event_date})`
  if (e.end_date && !isValidDate(e.end_date)) return `date de fin invalide (${e.end_date})`
  if (e.end_date && !e.event_date) return 'date de fin sans date de début'
  if (e.end_date && e.event_date && e.end_date < e.event_date) return 'date de fin avant la date de début'
  if (e.start_time && !TIME_RE.test(e.start_time)) return `heure invalide (${e.start_time})`
  if (!e.event_date && !clean(e.date_label)) return 'ni date ni libellé de date'
  if (e.action === 'creer' && e.event_date && (e.end_date ?? e.event_date) < addDays(today, -7)) {
    return 'événement trop ancien'
  }
  if (!Array.isArray(e.participants)) return 'participants invalides'
  for (const p of e.participants) {
    if (!knownCandidates.has(p.candidate_slug)) return `candidat inconnu (${p.candidate_slug})`
    if (!ROLES.includes(p.role)) return `rôle inconnu (${p.role})`
  }
  return null
}

function toRow(e: ProposedEvent) {
  return {
    slug: e.slug,
    category: e.category,
    subtype: clean(e.subtype),
    title: clean(e.title)!,
    description: clean(e.description),
    event_date: e.event_date || null,
    end_date: e.end_date || null,
    start_time: e.start_time || null,
    date_precision: e.date_precision,
    date_label: clean(e.date_label),
    location: clean(e.location),
    city: clean(e.city),
    media: clean(e.media),
    reliability: e.reliability,
    source_name: clean(e.source_name),
    source_url: e.source_url,
  }
}

// Same day, same category and the same participants: almost certainly an
// event we already have under another slug.
function findDuplicate(row: ReturnType<typeof toRow>, participants: string[], existing: ExistingEvent[]): ExistingEvent | undefined {
  if (!row.event_date || participants.length === 0) return undefined
  const key = [...participants].sort().join(',')
  return existing.find(
    (e) =>
      e.event_date === row.event_date &&
      e.category === row.category &&
      e.event_candidates.map((ec) => ec.candidates?.slug).filter(Boolean).sort().join(',') === key,
  )
}

// Only fields that the proposal fills with a different, non-null value.
function diffForUpdate(current: ExistingEvent, row: ReturnType<typeof toRow>): Record<string, unknown> {
  const patch: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    if (key === 'slug' || value === null) continue
    let currentValue = current[key as keyof ExistingEvent] as unknown
    if (key === 'start_time' && typeof currentValue === 'string') currentValue = currentValue.slice(0, 5)
    if (currentValue !== value) patch[key] = value
  }
  // Once a real date is known, the placeholder label must not hide it.
  if (patch.event_date && current.date_label && row.date_label === null) patch.date_label = null
  return patch
}

async function main() {
  const dryRun = ['1', 'true', 'yes'].includes((process.env.DRY_RUN ?? '').toLowerCase())
  requireEnv('ANTHROPIC_API_KEY')
  const supabase = createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const anthropic = new Anthropic()
  const today = parisToday()

  let runId: number | null = null
  if (!dryRun) {
    const { data, error } = await supabase.from('agenda_sync_runs').insert({ status: 'en_cours' }).select('id').single()
    if (error) throw new Error(`agenda_sync_runs : ${error.message} (as-tu relancé supabase/schema.sql ?)`)
    runId = data.id
  }

  try {
    const [{ data: candidates, error: candErr }, { data: events, error: evErr }] = await Promise.all([
      supabase.from('candidates').select('slug, full_name, party').order('full_name'),
      supabase
        .from('events')
        .select(
          'id, slug, category, subtype, title, description, event_date, end_date, start_time, date_precision, date_label, location, city, media, reliability, source_name, source_url, event_candidates(role, candidates(slug))',
        )
        .order('event_date', { ascending: true, nullsFirst: false }),
    ])
    if (candErr) throw new Error(`candidates : ${candErr.message}`)
    if (evErr) throw new Error(`events : ${evErr.message}`)
    const existing = (events ?? []) as unknown as ExistingEvent[]
    const bySlug = new Map(existing.map((e) => [e.slug, e]))

    const result = await runResearch(anthropic, buildSystemPrompt(), buildUserPrompt(today, existing, candidates ?? []))
    console.log(`[claude] résumé : ${result.resume}`)

    const rejected: Rejection[] = []
    const knownCandidates = new Set((candidates ?? []).map((c) => c.slug))

    const newCandidates = (Array.isArray(result.nouveaux_candidats) ? result.nouveaux_candidats : []).filter((c) => {
      const reason = !SLUG_RE.test(c.slug ?? '')
        ? 'slug invalide'
        : !clean(c.full_name) || !clean(c.party) || !clean(c.candidacy_status)
          ? 'fiche incomplète'
          : !isHttpsUrl(c.source_url)
            ? 'source https manquante'
            : null
      if (reason) rejected.push({ slug: `candidat:${c.slug}`, reason })
      return !reason && !knownCandidates.has(c.slug)
    })
    for (const c of newCandidates) knownCandidates.add(c.slug)

    const toInsert: { row: ReturnType<typeof toRow>; participants: ProposedEvent['participants'] }[] = []
    const toUpdate: { current: ExistingEvent; patch: Record<string, unknown>; participants: ProposedEvent['participants'] }[] = []

    for (const e of Array.isArray(result.evenements) ? result.evenements : []) {
      const reason = validateEvent(e, today, knownCandidates)
      if (reason) {
        rejected.push({ slug: e?.slug ?? '?', reason })
        continue
      }
      const row = toRow(e)
      const current = bySlug.get(e.slug) ?? findDuplicate(row, e.participants.map((p) => p.candidate_slug), existing)
      if (current) {
        toUpdate.push({ current, patch: diffForUpdate(current, { ...row, slug: current.slug }), participants: e.participants })
      } else if (e.action === 'mettre_a_jour') {
        rejected.push({ slug: e.slug, reason: 'mise à jour d\'un événement inconnu' })
      } else if (toInsert.some((i) => i.row.slug === row.slug)) {
        rejected.push({ slug: e.slug, reason: 'slug en double dans la réponse' })
      } else {
        toInsert.push({ row, participants: e.participants })
      }
    }

    const newParticipants = (current: ExistingEvent, participants: ProposedEvent['participants']) => {
      const have = new Set(current.event_candidates.map((ec) => ec.candidates?.slug))
      return participants.filter((p) => !have.has(p.candidate_slug))
    }
    const realUpdates = toUpdate.filter(
      (u) => Object.keys(u.patch).length > 0 || newParticipants(u.current, u.participants).length > 0,
    )

    console.log(`Nouveaux candidats : ${newCandidates.map((c) => c.slug).join(', ') || 'aucun'}`)
    for (const i of toInsert) console.log(`+ ${i.row.slug} (${i.row.event_date ?? i.row.date_label}) ${i.row.title}`)
    for (const u of realUpdates) {
      const added = newParticipants(u.current, u.participants).map((p) => p.candidate_slug)
      console.log(`~ ${u.current.slug} ${JSON.stringify(u.patch)}${added.length ? ` +participants ${added.join(', ')}` : ''}`)
    }
    for (const r of rejected) console.log(`! ${r.slug} rejeté : ${r.reason}`)

    if (dryRun) {
      console.log('DRY_RUN : rien n\'a été écrit.')
      return
    }

    if (newCandidates.length > 0) {
      const { error } = await supabase.from('candidates').upsert(
        newCandidates.map((c) => ({
          slug: c.slug,
          full_name: clean(c.full_name),
          party: clean(c.party),
          candidacy_status: clean(c.candidacy_status),
          candidacy_note: clean(c.candidacy_note),
          website_url: isHttpsUrl(c.website_url) ? c.website_url : null,
        })),
        { onConflict: 'slug', ignoreDuplicates: true },
      )
      if (error) throw new Error(`insertion candidats : ${error.message}`)
    }

    const { data: candRows, error: candIdErr } = await supabase.from('candidates').select('id, slug')
    if (candIdErr) throw new Error(`candidates : ${candIdErr.message}`)
    const candidateId = new Map((candRows ?? []).map((c) => [c.slug as string, c.id as string]))
    const now = new Date().toISOString()
    let inserted = 0
    let updated = 0

    const linkParticipants = async (eventId: string, slug: string, participants: ProposedEvent['participants']) => {
      const links = participants
        .filter((p) => candidateId.has(p.candidate_slug))
        .map((p) => ({ event_id: eventId, candidate_id: candidateId.get(p.candidate_slug)!, role: p.role }))
      if (links.length === 0) return
      const { error } = await supabase
        .from('event_candidates')
        .upsert(links, { onConflict: 'event_id,candidate_id', ignoreDuplicates: true })
      if (error) rejected.push({ slug, reason: `participants : ${error.message}` })
    }

    // One event at a time so a single bad row doesn't sink the whole run.
    for (const { row, participants } of toInsert) {
      const { data, error } = await supabase
        .from('events')
        .insert({ ...row, origin: 'veille', last_checked_at: now })
        .select('id')
        .single()
      if (error) {
        rejected.push({ slug: row.slug, reason: `insertion : ${error.message}` })
        continue
      }
      inserted++
      await linkParticipants(data.id, row.slug, participants)
    }

    for (const { current, patch, participants } of toUpdate) {
      const { error } = await supabase
        .from('events')
        .update({ ...patch, last_checked_at: now })
        .eq('id', current.id)
      if (error) {
        rejected.push({ slug: current.slug, reason: `mise à jour : ${error.message}` })
        continue
      }
      if (realUpdates.some((u) => u.current.id === current.id)) updated++
      await linkParticipants(current.id, current.slug, newParticipants(current, participants))
    }

    console.log(`Terminé : ${inserted} ajouté(s), ${updated} mis à jour, ${rejected.length} rejeté(s).`)
    await supabase
      .from('agenda_sync_runs')
      .update({ status: 'ok', finished_at: new Date().toISOString(), inserted, updated, rejected, summary: result.resume })
      .eq('id', runId!)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (runId !== null) {
      await supabase
        .from('agenda_sync_runs')
        .update({ status: 'erreur', finished_at: new Date().toISOString(), error: message })
        .eq('id', runId)
    }
    throw err
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
