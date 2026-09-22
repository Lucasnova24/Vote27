import type { AgendaEvent, BoussoleStatement, Candidate, QuizQuestion } from './types'

export const ACCENT = '#3B4FD8'
export const SHOW_POINTS = true
export const LIVE_DEBATE = true
export const DAYS_LEFT = 3

export const CANDS: Candidate[] = [
  { name: 'Camille Aubry', party: 'Parti fictif A', pct: 26, color: '#3B4FD8', ink: '#1F2A8A', soft: '#E3E7FF', initials: 'CA' },
  { name: 'Théo Marchand', party: 'Parti fictif B', pct: 23, color: '#0E7A6B', ink: '#0A4F45', soft: '#D2F1EA', initials: 'TM' },
  { name: 'Nadia Belkacem', party: 'Parti fictif C', pct: 19, color: '#A85400', ink: '#6E3A00', soft: '#FFEBC6', initials: 'NB' },
  { name: 'Paul Rivière', party: 'Parti fictif D', pct: 17, color: '#6B45D9', ink: '#3F238F', soft: '#E8E0FF', initials: 'PR' },
  { name: 'Élise Fontaine', party: 'Parti fictif E', pct: 15, color: '#C2385A', ink: '#8C1F3D', soft: '#FFDCE5', initials: 'EF' },
]

export const QUIZ: QuizQuestion[] = [
  {
    q: 'Quelle est la durée du mandat présidentiel ?',
    o: ['5 ans', '6 ans', '7 ans'],
    a: 0,
    e: 'Depuis le référendum de 2000, le mandat présidentiel est de cinq ans, renouvelable une fois consécutivement.',
    s: 'Constitution, art. 6',
  },
  {
    q: "Qui peut dissoudre l'Assemblée nationale ?",
    o: ['Le Premier ministre', 'Le Président de la République', 'Le Sénat'],
    a: 1,
    e: 'Le Président peut prononcer la dissolution après consultation du Premier ministre et des présidents des assemblées.',
    s: 'Constitution, art. 12',
  },
  {
    q: "Combien de députés siègent à l'Assemblée nationale ?",
    o: ['348', '500', '577'],
    a: 2,
    e: '577 députés élus au scrutin uninominal majoritaire à deux tours. Le Sénat compte 348 sénateurs.',
    s: 'Code électoral, art. L.121',
  },
  {
    q: 'Qui nomme le Premier ministre ?',
    o: ['Le Président de la République', "L'Assemblée nationale", 'Le Conseil constitutionnel'],
    a: 0,
    e: "Le Président nomme le Premier ministre, mais celui-ci doit disposer d'une majorité à l'Assemblée pour gouverner.",
    s: 'Constitution, art. 8',
  },
  {
    q: 'Combien de membres nommés compte le Conseil constitutionnel ?',
    o: ['7', '9', '12'],
    a: 1,
    e: "Neuf membres nommés pour neuf ans, renouvelés par tiers, auxquels s'ajoutent les anciens présidents de la République.",
    s: 'Constitution, art. 56',
  },
]

export const BOUSSOLE: BoussoleStatement[] = [
  { t: 'Institutions', s: 'Le vote devrait être obligatoire à toutes les élections nationales.' },
  { t: 'Économie', s: "L'État doit réduire la dépense publique même si cela touche certains services." },
  { t: 'Écologie', s: 'Les objectifs climatiques doivent primer sur la compétitivité à court terme.' },
  { t: 'Europe', s: "Davantage de décisions devraient être prises à l'échelle européenne." },
  { t: 'Social', s: "L'âge légal de départ à la retraite doit être abaissé." },
  { t: 'Sécurité', s: 'Il faut renforcer les effectifs de police plutôt que la prévention.' },
]

export const THEMES = ['Institutions', 'Économie', 'Écologie', 'Europe', 'Social', 'Sécurité']

export const TABS: Record<string, { soft: string; ink: string; dark: string }> = {
  accueil: { soft: '#E3E7FF', ink: '#1F2A8A', dark: '#8E9BFF' },
  isoloir: { soft: '#E8E0FF', ink: '#3F238F', dark: '#B7A2FF' },
  agenda: { soft: '#D8EBFB', ink: '#0A4577', dark: '#7CC0F5' },
  quiz: { soft: '#FFEBC6', ink: '#6E3A00', dark: '#F4B860' },
  profil: { soft: '#D2F1EA', ink: '#0A4F45', dark: '#5FD3BF' },
}

export const THEME_STYLE: Record<string, { solid: string; soft: string; ink: string }> = {
  Institutions: { solid: '#3B4FD8', soft: '#E3E7FF', ink: '#1F2A8A' },
  Économie: { solid: '#A85400', soft: '#FFEBC6', ink: '#6E3A00' },
  Écologie: { solid: '#1F7A3E', soft: '#DDF3E3', ink: '#14532D' },
  Europe: { solid: '#0B6BB8', soft: '#D8EBFB', ink: '#0A4577' },
  Social: { solid: '#C2385A', soft: '#FFDCE5', ink: '#8C1F3D' },
  Sécurité: { solid: '#6B45D9', soft: '#E8E0FF', ink: '#3F238F' },
}

export const EVENT_TAGS: Record<string, { soft: string; ink: string }> = {
  Débat: { soft: '#FFDFD8', ink: '#8A1F0E' },
  Meeting: { soft: '#E3E7FF', ink: '#1F2A8A' },
  Presse: { soft: '#FFEBC6', ink: '#6E3A00' },
}

export const POSITIONS: Record<string, string[]> = {
  Institutions: [
    'Proportionnelle intégrale aux législatives, mandat unique renouvelable.',
    "Référendum d'initiative citoyenne à partir de 700 000 signatures.",
    "Vote obligatoire assorti d'une reconnaissance du vote blanc.",
    'Réduction du nombre de parlementaires de 30 %.',
    'Maintien du scrutin actuel, renforcement du contrôle parlementaire.',
  ],
  Économie: [
    'Baisse des cotisations sur les bas salaires, financée par la fiscalité du capital.',
    'Réduction de 40 Md€ de dépense publique sur le quinquennat.',
    'Conditionnalité écologique et sociale des aides aux entreprises.',
    'TVA réduite sur les produits de première nécessité.',
    'Impôt plancher de 2 % sur les très hauts patrimoines.',
  ],
  Écologie: [
    'Sortie du charbon en 2030 et plan ferroviaire de 15 Md€.',
    "Relance du nucléaire : six réacteurs d'ici 2040.",
    "Moratoire sur l'artificialisation des sols.",
    'Rénovation thermique de 700 000 logements par an.',
    "Objectifs européens conservés, calendrier assoupli pour l'industrie.",
  ],
  Europe: [
    'Budget commun de défense et emprunt européen pour la transition.',
    'Renégociation des règles budgétaires du pacte de stabilité.',
    'Élargissement conditionné à une réforme du droit de veto.',
    "Priorité aux coopérations à quelques États plutôt qu'à 27.",
    'Traité social européen : salaire minimum de référence.',
  ],
  Social: [
    'Retraite à 62 ans pour les carrières longues, 64 ans sinon.',
    'Indexation des pensions sur les salaires plutôt que sur les prix.',
    'Revenu minimum garanti versé automatiquement.',
    "Conditionnalité du RSA à 15 heures d'activité hebdomadaires.",
    'Grande loi sur le grand âge financée par une cotisation dédiée.',
  ],
  Sécurité: [
    '10 000 policiers supplémentaires, redéploiement en zone rurale.',
    'Police de proximité rétablie dans 200 quartiers.',
    'Doublement du budget de la justice de proximité.',
    'Peines planchers pour les récidives violentes.',
    'Plan national contre les violences intrafamiliales.',
  ],
}

export const EVENTS: AgendaEvent[] = [
  { day: "Aujourd'hui · jeudi 15 avril", time: '18:30', title: 'Interview — France Inter', who: 'Paul Rivière', tag: 'Presse' },
  { day: "Aujourd'hui · jeudi 15 avril", time: '21:00', title: 'Débat télévisé — France 2', who: 'Les 5 candidats', tag: 'Débat', live: true },
  { day: 'Vendredi 16 avril', time: '11:00', title: 'Conférence de presse — Paris', who: 'Camille Aubry', tag: 'Presse' },
  { day: 'Vendredi 16 avril', time: '19:00', title: 'Meeting — Lyon', who: 'Théo Marchand', tag: 'Meeting' },
  { day: 'Samedi 17 avril', time: '08:15', title: 'Interview — RTL', who: 'Nadia Belkacem', tag: 'Presse' },
  { day: 'Samedi 17 avril', time: '15:00', title: 'Meeting — Marseille', who: 'Élise Fontaine', tag: 'Meeting' },
]

export const AGENDA_FILTERS = ['Tout', 'Débat', 'Meeting', 'Presse']

export const CALENDAR = [
  { label: 'Clôture des votes du 1er tour', when: 'dimanche 8h', dot: '#F4B860' },
  { label: '1er tour', when: '18 avril', dot: '#8E9BFF' },
  { label: '2nd tour', when: '2 mai', dot: '#5FD3BF' },
]

export const SETTINGS_ROWS = ['Notifications', 'Données et confidentialité', 'Sources et méthodologie']

// Static demo flavor text for past participation, matching the prototype —
// this app has no historical ledger of past estimations/votes to read from.
export const PAST_VOTES = [
  { title: 'Estimation · débat du 2 avril', result: '+180 ◆', bg: '#DDF3E3', fg: '#14532D' },
  { title: 'Vote du jour · vote blanc', result: 'participé', bg: '#EFEBE2', fg: '#454A66' },
  { title: 'Estimation · municipales', result: '+40 ◆', bg: '#DDF3E3', fg: '#14532D' },
  { title: 'Vote du jour · mandat de 5 ans', result: 'participé', bg: '#EFEBE2', fg: '#454A66' },
]

export const VOTE_RESULTS = (accent: string) => [
  { label: 'Oui', pct: '58%', color: accent },
  { label: 'Non', pct: '42%', color: '#C26A00' },
]

export const DEBATE_PCTS = [31, 24, 18, 15, 12]

export const DEBATE_STEPS = [
  { time: '20:50', label: 'Ouverture du pronostic avant débat', dot: '#F4B860' },
  { time: '21:00', label: 'Votes en direct, séquence par séquence', dot: '#8E9BFF' },
  { time: '23:15', label: 'Vote final et comparaison des écarts', dot: '#5FD3BF' },
]

export const BOUSSOLE_SEED = [78, 64, 59, 47, 33]

export const BOUSSOLE_SCALE = [
  { label: "Tout à fait d'accord", v: 2, color: '#1F7A3E' },
  { label: "Plutôt d'accord", v: 1, color: '#6DB287' },
  { label: 'Sans avis', v: 0, color: '#B4B0A3' },
  { label: "Plutôt pas d'accord", v: -1, color: '#E39A8F' },
  { label: 'Pas du tout d\'accord', v: -2, color: '#C8341C' },
]

// Static demo flavor text, matching the prototype: this app is fictional and
// the "history" shown here isn't computed from real past submissions.
export const FIRST_ROUND_HISTORY = [
  { month: 'Mars 2027', name: 'Camille Aubry', color: '#3B4FD8' },
  { month: 'Février 2027', name: 'Nadia Belkacem', color: '#A85400' },
]

export const BADGES = [
  { name: 'Première voix', color: '#3B4FD8' },
  { name: 'Bon pronostic', color: '#A85400' },
  { name: 'Sans faute', color: '#6B45D9' },
  { name: 'Affinités faites', color: '#0E7A6B' },
]
