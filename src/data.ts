import type { AgendaEvent, BoussoleStatement, Candidate, QuizQuestion } from './types'

export const ACCENT = '#2f4bb0'
export const SHOW_POINTS = true
export const LIVE_DEBATE = true
export const DAYS_LEFT = 3

export const CANDS: Candidate[] = [
  { name: 'Camille Aubry', party: 'Parti fictif A', pct: 26, color: '#2f4bb0', initials: 'CA' },
  { name: 'Théo Marchand', party: 'Parti fictif B', pct: 23, color: '#4a7a56', initials: 'TM' },
  { name: 'Nadia Belkacem', party: 'Parti fictif C', pct: 19, color: '#9a5b1f', initials: 'NB' },
  { name: 'Paul Rivière', party: 'Parti fictif D', pct: 17, color: '#7a4a8c', initials: 'PR' },
  { name: 'Élise Fontaine', party: 'Parti fictif E', pct: 15, color: '#b03a4a', initials: 'EF' },
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
    e: 'Neuf membres nommés pour neuf ans, renouvelés par tiers, auxquels s\'ajoutent les anciens présidents de la République.',
    s: 'Constitution, art. 56',
  },
]

export const BOUSSOLE: BoussoleStatement[] = [
  { t: 'Institutions', s: 'Le vote devrait être obligatoire à toutes les élections nationales.' },
  { t: 'Économie', s: "L'État doit réduire la dépense publique même si cela touche certains services." },
  { t: 'Écologie', s: 'Les objectifs climatiques doivent primer sur la compétitivité à court terme.' },
  { t: 'Europe', s: 'Davantage de décisions devraient être prises à l\'échelle européenne.' },
  { t: 'Social', s: 'L\'âge légal de départ à la retraite doit être abaissé.' },
  { t: 'Sécurité', s: 'Il faut renforcer les effectifs de police plutôt que la prévention.' },
]

export const THEMES = ['Institutions', 'Économie', 'Écologie', 'Europe', 'Social', 'Sécurité']

export const POSITIONS: Record<string, string[]> = {
  Institutions: [
    'Proportionnelle intégrale aux législatives, mandat unique renouvelable.',
    "Référendum d'initiative citoyenne à partir de 700 000 signatures.",
    'Vote obligatoire assorti d\'une reconnaissance du vote blanc.',
    'Réduction du nombre de parlementaires de 30 %.',
    'Maintien du scrutin actuel, renforcement du contrôle parlementaire.',
  ],
  'Économie': [
    'Baisse des cotisations sur les bas salaires, financée par la fiscalité du capital.',
    'Réduction de 40 Md€ de dépense publique sur le quinquennat.',
    'Conditionnalité écologique et sociale des aides aux entreprises.',
    'TVA réduite sur les produits de première nécessité.',
    'Impôt plancher de 2 % sur les très hauts patrimoines.',
  ],
  'Écologie': [
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
    'Priorité aux coopérations à quelques États plutôt qu\'à 27.',
    'Traité social européen : salaire minimum de référence.',
  ],
  Social: [
    'Retraite à 62 ans pour les carrières longues, 64 ans sinon.',
    'Indexation des pensions sur les salaires plutôt que sur les prix.',
    'Revenu minimum garanti versé automatiquement.',
    'Conditionnalité du RSA à 15 heures d\'activité hebdomadaires.',
    'Grande loi sur le grand âge financée par une cotisation dédiée.',
  ],
  'Sécurité': [
    '10 000 policiers supplémentaires, redéploiement en zone rurale.',
    'Police de proximité rétablie dans 200 quartiers.',
    'Doublement du budget de la justice de proximité.',
    'Peines planchers pour les récidives violentes.',
    'Plan national contre les violences intrafamiliales.',
  ],
}

export const AGENDA_EVENTS: AgendaEvent[] = [
  { day: "Aujourd'hui · jeudi 15 avril", time: '21:00', title: 'Débat télévisé — France 2', who: 'Les 5 candidats', tag: 'Débat', live: true },
  { day: "Aujourd'hui · jeudi 15 avril", time: '18:30', title: 'Interview — France Inter', who: 'Paul Rivière', tag: 'Interview' },
  { day: 'Vendredi 16 avril', time: '11:00', title: 'Conférence de presse — Paris', who: 'Camille Aubry', tag: 'Presse' },
  { day: 'Vendredi 16 avril', time: '19:00', title: 'Meeting — Lyon', who: 'Théo Marchand', tag: 'Meeting' },
  { day: 'Samedi 17 avril', time: '08:15', title: 'Interview — RTL', who: 'Nadia Belkacem', tag: 'Interview' },
  { day: 'Samedi 17 avril', time: '15:00', title: 'Meeting — Marseille', who: 'Élise Fontaine', tag: 'Meeting' },
]

export const AGENDA_FILTERS = ['Tout', 'Débat', 'Meeting', 'Interview', 'Presse']

export const CALENDAR = [
  { label: 'Clôture des votes du 1er tour', when: 'dimanche 8h' },
  { label: '1er tour', when: '18 avril' },
  { label: '2nd tour', when: '2 mai' },
]

export const SETTINGS_ROWS = ['Notifications', 'Données et confidentialité', 'Sources et méthodologie', 'Se déconnecter']

export const VOTE_RESULTS = (accent: string) => [
  { label: 'Oui', pct: '58%', color: accent },
  { label: 'Non', pct: '42%', color: '#aab2cc' },
]

export const DEBATE_PCTS = [31, 24, 18, 15, 12]

export const DEBATE_STEPS = [
  { time: '20:50', label: 'Ouverture du pronostic avant débat' },
  { time: '21:00', label: 'Votes en direct, séquence par séquence' },
  { time: '23:15', label: 'Vote final et comparaison des écarts' },
]

export const BOUSSOLE_SEED = [78, 64, 59, 47, 33]

export const BOUSSOLE_SCALE = [
  { label: "Tout à fait d'accord", v: 2, color: '#2f6b3c' },
  { label: 'Plutôt d\'accord', v: 1, color: '#6b9a74' },
  { label: 'Sans avis', v: 0, color: '#aab2cc' },
  { label: "Plutôt pas d'accord", v: -1, color: '#d08a94' },
  { label: "Pas du tout d'accord", v: -2, color: '#b03a4a' },
]
