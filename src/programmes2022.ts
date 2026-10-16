// Programmes 2022 (ou, à défaut, ceux du parti / du candidat soutenu) des
// candidats à la présidentielle 2027, résumés à partir des programmes
// officiels et de sources de presse citées dans chaque fiche. Ce ne sont PAS
// les programmes 2027 : à remplacer au fur et à mesure de leur publication.
// Source des données : fiches du dossier Drive « Programmes 2022 ».

export type ProgrammeKind = 'propre' | 'soutien' | 'parti' | 'partiel' | 'aucun'

export interface ProgrammeTheme {
  resume: string
  mesures: string[]
}

export interface ProgrammeLink {
  label: string
  url: string
}

export interface Programme {
  kind: ProgrammeKind
  programmeLabel: string
  note: string
  themes: Record<string, ProgrammeTheme>
  autres: string[]
  phares: string[]
  pdfs: ProgrammeLink[]
  sources: ProgrammeLink[]
}

export const KIND_LABEL: Record<ProgrammeKind, string> = {
  propre: 'Son programme 2022',
  soutien: 'Programme du candidat soutenu',
  parti: 'Programme du parti',
  partiel: 'Programme partiel',
  aucun: 'Pas de programme 2022',
}

export const PROGRAMMES_2022: Record<string, Programme> = {
  "Marine Le Pen": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 de Marine Le Pen (candidate RN)",
    "note": "Résumé établi à partir du manifeste de 2022 et de la synthèse « 22 mesures pour 2022 » ; les livrets thématiques (dont l'écologie) n'ont pas été lus en détail. Certaines mesures ne figurent que dans la synthèse web.",
    "themes": {
      "Institutions": {
        "resume": "Référendum d'initiative citoyenne et proportionnelle, réforme constitutionnelle par référendum, moratoire d'au moins 3 ans sur les sujets sociétaux et gouvernement d'union nationale.",
        "mesures": [
          "Référendum d'initiative citoyenne (RIC)",
          "Proportionnelle",
          "Réforme constitutionnelle par référendum",
          "Moratoire d'au moins 3 ans sur les sujets sociétaux (interdiction renforcée de la GPA)",
          "Gouvernement d'union nationale"
        ]
      },
      "Économie": {
        "resume": "« État stratège », patriotisme économique, TVA énergie à 5,5 %, hausse de 10 % des salaires aidée jusqu'à 3 SMIC, baisse des impôts de production, exonération d'impôt sur le revenu des moins de 30 ans. Pas de hausse du SMIC annoncée.",
        "mesures": [
          "« État stratège », localisme et patriotisme économique ; objectif de rendre 150 à 200 € par mois par ménage",
          "TVA sur les produits énergétiques (essence, fioul, gaz, électricité) ramenée de 20 % à 5,5 %",
          "Contrat d'entreprise : exonération de la hausse des cotisations patronales en cas d'augmentation de 10 % de tous les salaires jusqu'à 3 SMIC",
          "Baisse immédiate des péages autoroutiers d'environ 15 % (autoroutes remises dans la main publique via le fonds souverain)",
          "Priorité nationale (voire européenne) dans les marchés publics",
          "Fin du travail détaché ; contrôle accru des importations ; simplification administrative",
          "Fonds Souverain Français (épargne des Français, rémunération garantie d'au moins 2 %)",
          "Prime d'Aménagement des Territoires relancée",
          "Suppression de l'IFI et création d'un impôt sur la fortune financière (IFF : produits financiers et œuvres d'art détenus depuis moins de 10 ans ; résidence principale et biens professionnels exclus)",
          "Suppression de la CFE, de la C3S dans les zones de relocalisation, baisse des impôts de production",
          "Exonération d'impôt sur le revenu pour les moins de 30 ans",
          "Dispense d'impôt sur les sociétés pendant 5 ans pour les jeunes créateurs d'entreprise",
          "Part fiscale pleine dès le 2e enfant",
          "Donations : abattement de 100 000 € tous les 10 ans",
          "Successions : 300 000 € de biens immobiliers sortis de l'assiette ; suppression des droits de succession à la transmission d'entreprise (pacte Dutreil modernisé)",
          "Suppression de la redevance audiovisuelle (privatisation de l'audiovisuel public)",
          "Agriculture : 80 % de produits français dans la restauration collective",
          "Agriculture : interdiction des importations non conformes aux normes françaises, étiquetage généralisé, prix minimums garantis"
        ]
      },
      "Écologie": {
        "resume": "Nucléaire au centre de la politique énergétique (prolongation du parc, nouveaux réacteurs), moratoire sur toute nouvelle éolienne et démantèlement progressif des existantes, fin des subventions aux énergies intermittentes.",
        "mesures": [
          "Nucléaire au centre de la politique énergétique : parc préservé et prolongé, nouveaux réacteurs, réacteurs à neutrons rapides, petits réacteurs modulaires",
          "Hydroélectricité maintenue publique sous EDF",
          "Moratoire sur toute nouvelle éolienne (terre et mer) dès le printemps 2022 et démantèlement progressif des existantes",
          "Fin des subventions aux énergies intermittentes",
          "Sortie du marché européen de l'électricité (selon la synthèse)",
          "Transformation écologique financée via le fonds souverain"
        ]
      },
      "Europe": {
        "resume": "« Politique des mains libres » : sortie du commandement intégré de l'OTAN, Alliance Européenne des Nations appelée à se substituer progressivement à l'UE, primauté du droit national, budget des armées d'environ 55 Md€ en 2027.",
        "mesures": [
          "« Politique des mains libres »",
          "Sortie du commandement intégré de l'OTAN",
          "Fin des coopérations d'armement avec l'Allemagne ; rapprochement avec le Royaume-Uni",
          "Budget des armées de l'ordre de 55 Md€ en 2027",
          "Alliance Européenne des Nations appelée à se substituer progressivement à l'UE",
          "Primauté du droit national (référendum) sur les juridictions supranationales",
          "Union francophone",
          "Siège au Conseil de sécurité non partageable"
        ]
      },
      "Social": {
        "resume": "Refus de tout report de l'âge de départ à la retraite, petites retraites à 1 000 €, départ à 60 ans pour carrières longues ; suppression des ARS, classes de 20 élèves en primaire ; 100 000 logements sociaux par an.",
        "mesures": [
          "Retraites : refus de tout report de l'âge ; réindexation (sur l'inflation selon la synthèse)",
          "Retraites : retour de la demi-part des veufs/veuves ; petites retraites revalorisées à 1 000 €",
          "Retraites : départ à 60 ans pour ceux ayant commencé à travailler avant 20 ans et ayant 40 annuités ; pour les autres, âge et durée dépendant de l'âge de début d'activité (détail non chiffré dans le manifeste)",
          "Santé : lutte contre les déserts médicaux (consultations bonifiées, maisons de santé, télémédecine)",
          "Santé : suppression des ARS ; direction des hôpitaux en binôme médecin/directeur ; plafond de 10 % de personnel administratif",
          "Santé : urgences gériatriques ; revalorisation salariale des soignants et du personnel d'EHPAD ; +1 Md€ pour le plan EHPAD",
          "Santé : plan d'urgence de 20 Md€ et relance de la production de médicaments en France (selon la synthèse)",
          "Éducation : priorité au français, mathématiques, histoire en primaire",
          "Éducation : classes de 20 élèves en primaire et 30 dans le secondaire",
          "Éducation : suppression du collège unique (modèle suisse, 40 % de jeunes en filière professionnelle dès la fin de la 3e)",
          "Éducation : revalorisation de la grille des enseignants de 3 % par an pendant 5 ans",
          "Éducation : uniforme (selon la synthèse) ; programmes fixés par le Parlement ; sanctions pour les parents d'élèves indisciplinés",
          "Logement : 100 000 logements sociaux par an dont 20 000 pour étudiants et jeunes travailleurs (synthèse) ; 100 000 logements étudiants en 5 ans",
          "Prêt à taux zéro de 100 000 € sur 10 ans pour jeunes couples, capital effacé à la naissance du 3e enfant",
          "Doublement de l'allocation de soutien familial (familles françaises monoparentales)",
          "AAH déconjugalisée et indexée sur l'inflation ; congé de proche aidant de 3 à 12 mois",
          "Lutte contre les discriminations liées au handicap inscrite dans la Constitution",
          "Jeunes : chèque apprentis/alternants de 5 700 €/an (moins de 18 ans) ou 8 000 €/an (18-30 ans)",
          "Jeunes : gratuité des transports aux heures creuses pour les 18-25 ans"
        ]
      },
      "Sécurité": {
        "resume": "Peines planchers, 85 000 places de prison en 6 ans, référendum sur l'immigration dans les 6 mois (priorité nationale, fin du regroupement familial), expulsion des étrangers irréguliers et délinquants.",
        "mesures": [
          "Peines minimales (peines planchers), limitation drastique des aménagements de peine",
          "85 000 places de prison en 6 ans",
          "Plusieurs milliers de magistrats supplémentaires en 5 ans (justice civile : délais divisés par deux)",
          "Au moins un centre éducatif fermé par département",
          "Notion de coauteur en droit pénal",
          "Présomption de légitime défense pour les forces de l'ordre (selon la synthèse)",
          "Fermeture des mosquées radicales, dissolution d'associations islamistes, loi contre les idéologies islamistes",
          "Ministère de lutte contre la fraude (amendes de 3 puis 5 fois les sommes perçues, carte Vitale biométrique)",
          "Référendum dans les 6 mois suivant l'élection (révision constitutionnelle : maîtrise de l'immigration, priorité nationale, règles de nationalité)",
          "Fin du regroupement familial (« rare exception »), expulsion systématique des étrangers irréguliers et délinquants",
          "Retour des travailleurs étrangers après un an de chômage",
          "Blocage des transferts d'argent et des visas pour les pays refusant de reprendre leurs ressortissants",
          "Asile recentré",
          "Allocations familiales réservées aux familles dont un parent est français ; priorité nationale pour le logement social",
          "Suppression du droit du sol et accès aux prestations après 5 ans de travail (selon la synthèse)"
        ]
      }
    },
    "autres": [
      "Ministère de la Mer et de l'Outre-mer",
      "Service national du patrimoine (volontariat, 18-24 ans)"
    ],
    "phares": [
      "Référendum sur l'immigration (priorité nationale, fin du regroupement familial, expulsions) dans les 6 mois",
      "TVA sur l'énergie de 20 % à 5,5 %",
      "Hausse de 10 % des salaires jusqu'à 3 SMIC avec exonération de cotisations patronales sur la hausse",
      "Retraite à 60 ans pour 40 annuités si début de carrière avant 20 ans ; refus du recul de l'âge ; minimum à 1 000 €",
      "Exonération d'impôt sur le revenu pour les moins de 30 ans",
      "Suppression de l'IFI, création d'un IFF ; suppression des impôts de production (CFE)",
      "85 000 places de prison, peines planchers, milliers de magistrats en plus",
      "Moratoire sur l'éolien, relance massive du nucléaire",
      "RIC et proportionnelle ; sortie du commandement intégré de l'OTAN ; Alliance Européenne des Nations",
      "Budget des armées à 55 Md€ en 2027 ; plan de santé (suppression des ARS, plafond 10 % d'administratifs)"
    ],
    "pdfs": [
      {
        "label": "Manifeste",
        "url": "https://mlafrance.fr/pdfs/manifeste-m-la-france-programme-presidentiel.pdf"
      },
      {
        "label": "22 mesures pour 2022",
        "url": "https://mlafrance.fr/pdfs/22-mesures-pour-2022.pdf"
      }
    ],
    "sources": [
      {
        "label": "mlafrance.fr",
        "url": "https://mlafrance.fr/programme"
      }
    ]
  },
  "Jean-Luc Mélenchon": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 de Jean-Luc Mélenchon (« L'Avenir en commun », Union populaire)",
    "note": "Résumé établi à partir de la version abrégée officielle (32 p.) du programme 2022 ; le PDF complet n'est plus accessible. LFI a depuis publié une mise à jour pour 2027 : ne pas confondre.",
    "themes": {
      "Institutions": {
        "resume": "Assemblée constituante convoquée par référendum et VIe République parlementaire à la proportionnelle, RIC (dont révocation des élus), vote à 16 ans, vote obligatoire, fin du Concordat d'Alsace-Moselle.",
        "mesures": [
          "Assemblée constituante convoquée par référendum (art. 11), nouvelle Constitution (VIe République) soumise à référendum",
          "Régime parlementaire, députés à la proportionnelle",
          "RIC (proposer/abroger une loi, réviser la Constitution, révoquer les élus)",
          "Vote à 16 ans, vote obligatoire, reconnaissance du vote blanc",
          "Laïcité : fin du Concordat d'Alsace-Moselle et des statuts dérogatoires",
          "Justice : indépendance vis-à-vis du Gouvernement"
        ]
      },
      "Économie": {
        "resume": "SMIC à 1 400 € net, écart salarial de 1 à 20, blocage des prix de première nécessité, 14 tranches d'impôt sur le revenu, ISF renforcé, 35 h rétablies, 1 million d'emplois publics ; +250 Md€ de dépenses par an.",
        "mesures": [
          "SMIC à 1 400 € net",
          "Écart salarial maximal de 1 à 20 dans une entreprise",
          "Revalorisation des salaires des fonctionnaires et des métiers féminisés",
          "Blocage des prix des produits de première nécessité (carburant, énergie)",
          "Gratuité des quantités vitales d'eau, d'électricité, de gaz ; annulation des hausses du gaz depuis 2017",
          "Garantie d'autonomie à 1 063 € (seuil de pauvreté)",
          "Interdiction des dividendes supérieurs aux bénéfices et des licenciements économiques pour les entreprises versant des dividendes",
          "Impôt sur les sociétés progressif ; relocalisation",
          "BCE : dette détenue transformée en dette perpétuelle à taux zéro ; circuit du Trésor",
          "14 tranches d'impôt sur le revenu et de CSG ; quotient familial remplacé par un crédit d'impôt par enfant",
          "Suppression des niches injustes et polluantes ; baisse de TVA sur les produits de première nécessité et « TVA grand luxe »",
          "Rétablissement et renforcement de l'ISF ; impôt universel (anti-exil fiscal)",
          "Droits de succession augmentés pour les plus riches, supprimés sous 120 000 € par enfant et par parent ; héritage maximal de 12 M€",
          "Affirmation : sous 4 000 €/mois, tout le monde paie moins",
          "Financement : +250 Md€ de dépenses/an, +267 Md€ de recettes/an (163 Md€ d'impôt plus juste, 52 Md€ de lutte contre la fraude, 52 Md€ de recettes induites)",
          "Garantie d'emploi pour les chômeurs de longue durée",
          "35 h rétablies, 32 h dans les métiers pénibles/de nuit, 6e semaine de congés payés",
          "Suppression des ordonnances Pénicaud et de la loi El Khomri",
          "1 million d'emplois publics",
          "Agriculture : interdiction du glyphosate et des néonicotinoïdes, 100 % bio et local dans les cantines, 300 000 emplois agricoles",
          "Agriculture : interdiction des fermes-usines, prix planchers"
        ]
      },
      "Écologie": {
        "resume": "« Règle verte » dans la Constitution, émissions -65 % en 2030, 200 Md€ d'investissements sur le mandat, 100 % d'énergies renouvelables et sortie planifiée du nucléaire, 700 000 logements rénovés par an.",
        "mesures": [
          "« Règle verte » dans la Constitution",
          "Émissions -65 % en 2030 (au lieu de -40 %)",
          "200 Md€ investis sur le mandat dans la bifurcation écologique",
          "100 % d'énergies renouvelables (possible d'ici 2050 selon le texte)",
          "Sortie planifiée du nucléaire, abandon des nouvelles centrales",
          "Fin des subventions aux fossiles",
          "Pôle public de l'énergie",
          "700 000 logements rénovés par an",
          "Renationalisation des autoroutes, pôle public des transports, refus de la mise en concurrence ferroviaire"
        ]
      },
      "Europe": {
        "resume": "Plan A : proposer de rompre avec les traités européens ; Plan B : désobéir aux règles empêchant le programme. Sortie du commandement intégré de l'OTAN puis de l'organisation ; conscription citoyenne.",
        "mesures": [
          "Plan A : proposer de rompre avec les traités (fin des critères budgétaires, harmonisation sociale/écologique, protectionnisme écologique)",
          "Plan B : désobéir aux règles européennes empêchant l'application du programme (opt-out, refus des normes moins ambitieuses)",
          "Sortie du commandement intégré de l'OTAN puis de l'organisation",
          "Refus de toute intervention sans mandat de l'ONU",
          "Conscription citoyenne et garde civile nationale",
          "Levée des brevets sur les vaccins"
        ]
      },
      "Social": {
        "resume": "Retraite à 60 ans pour 40 annuités, remboursement à 100 % des soins, gratuité réelle de l'école et de l'université, 200 000 logements publics par an, encadrement des loyers, zéro sans-abri.",
        "mesures": [
          "Retraite à 60 ans à taux plein pour 40 annuités",
          "Petites retraites au SMIC revalorisé (1 400 €) pour carrière complète ; minimum vieillesse au seuil de pauvreté (environ 1 100 €)",
          "Retraites indexées sur les salaires",
          "Santé : recrutement de soignants, revalorisation, réouverture de lits ; urgences, maternités et EHPAD à moins de 30 minutes",
          "Remboursement à 100 % (mutuelles intégrées à l'assurance maladie) ; centres de santé ; pôle public du médicament",
          "Abrogation du passe sanitaire et de l'état d'urgence sanitaire",
          "EHPAD : 10 000 places publiques/an, 240 000 recrutements",
          "Gratuité réelle de l'école et de l'université",
          "Abrogation des réformes du lycée, de la voie pro et du collège ; bac pro à 4 ans",
          "Revalorisation des enseignants et rattrapage du point d'indice ; 19 élèves par classe en moyenne en fin de mandat",
          "15 000 logements étudiants supplémentaires par an",
          "Garantie d'autonomie de 1 063 € pour les jeunes dès 18 ans",
          "200 000 logements publics par an",
          "Encadrement des loyers, garantie universelle des loyers ; permis de louer",
          "Interdiction des expulsions sans relogement ; réquisition des logements vides",
          "Zéro sans-abri (doublement des places d'accueil)",
          "Crèches publiques gratuites, 500 000 places en 5 ans",
          "AAH au niveau du SMIC et déconjugalisée",
          "Égalité femmes-hommes : plan d'1 Md€ contre les violences",
          "1 % du PIB pour la culture ; gratuité des musées",
          "Accès minimal gratuit à Internet",
          "Adoption plénière pour tous les couples"
        ]
      },
      "Sécurité": {
        "resume": "Police de proximité, démantèlement des BAC, légalisation encadrée du cannabis, antiterrorisme par le renseignement humain, fin de la surpopulation carcérale ; politique d'accueil « humaniste et réaliste » et droit d'asile garanti.",
        "mesures": [
          "Police de proximité, démantèlement des BAC",
          "Interdiction des flashballs et grenades de désencerclement",
          "Remplacement de l'IGPN par une institution indépendante",
          "Légalisation encadrée du cannabis",
          "Antiterrorisme axé sur le renseignement humain, sortie de l'état d'urgence",
          "Justice : recrutements (magistrats, greffiers), tribunaux de proximité, fin de la surpopulation carcérale",
          "Politique migratoire « humaniste et réaliste » : accueil digne, structures d'hébergement, droit d'asile garanti",
          "Abrogation de la loi asile et immigration",
          "Action sur les causes des migrations ; renforcement de l'OIM et du HCR"
        ]
      }
    },
    "autres": [],
    "phares": [
      "SMIC à 1 400 € net",
      "Retraite à 60 ans pour 40 annuités",
      "Blocage des prix des produits de première nécessité",
      "Révolution fiscale : 14 tranches, ISF rétabli, plafond d'héritage à 12 M€",
      "Constituante et VIe République ; RIC",
      "Garantie d'autonomie à 1 063 € (jeunes, personnes sans ressources)",
      "Règle verte, -65 % d'émissions en 2030, 200 Md€ d'investissements",
      "100 % renouvelable, sortie du nucléaire",
      "Désobéissance aux traités européens ; sortie de l'OTAN",
      "1 million d'emplois publics, 200 000 logements publics par an"
    ],
    "pdfs": [
      {
        "label": "L’Avenir en commun, version abrégée",
        "url": "https://melenchon.fr/wp-content/uploads/2022/04/programme-avenir-en-commun-abrege.pdf"
      }
    ],
    "sources": [
      {
        "label": "programme.lafranceinsoumise.fr",
        "url": "https://programme.lafranceinsoumise.fr/programme-version-courte/"
      },
      {
        "label": "linfodurable.fr",
        "url": "https://www.linfodurable.fr/politique/le-programme-ecolo-de-jean-luc-melenchon-31349"
      },
      {
        "label": "previssima.fr",
        "url": "https://www.previssima.fr/actualite/presidentielle-2022-le-programme-de-jean-luc-melenchon-la-franche-insoumise-en-matiere-de-protection-sociale-infographie.html"
      }
    ]
  },
  "Édouard Philippe": {
    "kind": "soutien",
    "programmeLabel": "Programme 2022 d'Emmanuel Macron (candidat soutenu par Horizons)",
    "note": "Horizons (créé en octobre 2021) n'a pas de programme 2022 propre : le contenu est celui du projet d'Emmanuel Macron, dont Horizons a soutenu la réélection, et n'engage pas Édouard Philippe sur chaque point. Certains chiffres (30 Md€, 6 EPR + 8, 15 Md€, régimes spéciaux, CVAE) viennent de synthèses de presse et non des professions de foi ; le programme détaillé d'avecvous.fr n'est plus consultable.",
    "themes": {
      "Institutions": {
        "resume": "Citoyens associés à chaque grande décision, relance de la réforme institutionnelle par une commission transpartisane, droit à la différenciation et conseiller territorial. Pas de proportionnelle chiffrée dans les sources lues.",
        "mesures": [
          "Citoyens associés à chaque grande décision",
          "Relance de la réforme institutionnelle via une commission transpartisane",
          "Droit à la différenciation / conseiller territorial",
          "Référendum possible sur la fin de vie (selon la presse)"
        ]
      },
      "Économie": {
        "resume": "Objectif de plein emploi, prime « Macron » triplée (jusqu'à 3 000 à 6 000 €), compte épargne-temps universel, baisses d'impôts d'environ 15 Md€/an dont suppression de la CVAE et de la redevance audiovisuelle. Coût annoncé : environ 50 Md€ par an d'ici 2027.",
        "mesures": [
          "Objectif de plein emploi (« horizon enfin accessible »)",
          "Prime « Macron » (prime annuelle défiscalisée) triplée, jusqu'à 3 000 € voire 6 000 € sans charges ni impôts (PME de moins de 50 salariés ou accord d'intéressement)",
          "Maintien des boucliers tarifaires gaz et électricité",
          "Généralisation de la participation/intéressement (« dividende salarié »)",
          "Compte épargne-temps universel (RTT et congés monétisables ou épargnés)",
          "Baisse des charges des indépendants",
          "30 Md€ d'investissements dans les secteurs d'avenir (spatial, biomédicaments, semi-conducteurs, réacteurs, numérique, quantique, IA) selon la presse",
          "Coût annoncé du programme : environ 50 Md€ par an d'ici 2027 (franceinfo/Public Sénat) ; financement par le plein emploi, la réforme des retraites, les réformes de fond (e-prescription, fraude)",
          "Pôle emploi transformé en « France Travail »",
          "Rémunération des dirigeants liée à des critères environnementaux et sociaux",
          "Baisses d'impôts d'environ 15 Md€/an (moitié ménages, moitié entreprises) selon Public Sénat",
          "Suppression de la redevance audiovisuelle",
          "Suppression de la CVAE (environ 10 Md€/an d'allègement selon myRHline)",
          "Baisse des droits de succession : aucun droit jusqu'à 150 000 € par enfant et jusqu'à 100 000 € transmis à d'autres membres de la famille",
          "Loi d'orientation et d'avenir agricole"
        ]
      },
      "Écologie": {
        "resume": "« Premier grand pays à sortir du pétrole, du gaz, du charbon » ; 6 nouveaux réacteurs nucléaires et étude de 8 autres, solaire x10, 50 parcs éoliens en mer d'ici 2050 ; 700 000 rénovations de logements par an. La « planification écologique » n'est pas citée dans les sources lues.",
        "mesures": [
          "« Premier grand pays à sortir du pétrole, du gaz, du charbon »",
          "Taxe carbone aux frontières de l'UE",
          "6 nouveaux réacteurs nucléaires et étude de 8 autres, solaire x10, 50 parcs éoliens en mer d'ici 2050 (Public Sénat, d'après les annonces de campagne)",
          "700 000 rénovations de logements par an",
          "Filière française de voitures électriques",
          "Location d'une voiture électrique pour moins de 100 €/mois"
        ]
      },
      "Europe": {
        "resume": "« Europe-puissance » indépendante : Europe de la défense, des frontières et technologique face aux grandes plateformes ; investissement dans la défense et pacte Armées-Nation ; livraisons de Rafale, sous-marins et blindés aux armées.",
        "mesures": [
          "« Europe-puissance » indépendante : Europe de la défense, Europe des frontières, Europe technologique face aux grandes plateformes",
          "Investissement dans la défense ; pacte Armées-Nation",
          "Livraison aux armées de plus de 60 Rafale supplémentaires d'ici 2030, 5 sous-marins nucléaires d'attaque, 1 250 véhicules blindés"
        ]
      },
      "Social": {
        "resume": "Recul progressif de l'âge légal à 65 ans avec minimum de pension à 1 100 €, RSA conditionné à 15-20 h d'activité hebdomadaire, droit opposable à la garde d'enfants, bilans de santé gratuits, priorité aux fondamentaux à l'école.",
        "mesures": [
          "Recul progressif de l'âge légal à 65 ans (à partir de 62 ans) avec prise en compte de l'incapacité, des carrières longues ou pénibles",
          "Minimum de pension à 1 100 € pour une carrière complète",
          "Cumul emploi-retraite plus avantageux et simplifié",
          "Régimes spéciaux ramenés à trois (nouveaux entrants), selon myRHline",
          "Indexation des retraites sur l'inflation (ajoutée au 2nd tour)",
          "Bilans de santé gratuits aux âges clés",
          "Lutte contre les déserts médicaux (recrutement d'infirmiers, aides-soignants, médecins et réorganisation)",
          "Poursuite de l'investissement dans l'hôpital public ; simplification de la gouvernance hospitalière",
          "Grande conférence sur le système de santé ; convention citoyenne sur la fin de vie",
          "Aînés : 50 000 soignants/infirmiers et aides-soignants de plus en maison de retraite, contrôles renforcés",
          "Aînés : « Prime Adapt' » pour jusqu'à 70 % des coûts d'adaptation du logement, 2 h d'aide à domicile en plus par semaine",
          "Éducation : priorité aux fondamentaux (français, maths), plus de sport",
          "Enseignants mieux rémunérés avec de nouvelles missions (sans chiffre) et plus de liberté ; concertation préalable à la réforme de l'école",
          "Lycée professionnel « voie d'excellence »",
          "Supérieur : plus de places dans les filières qui recrutent, bourses plus justes",
          "Contrôle parental automatique des appareils, lutte contre le harcèlement",
          "Versement automatique et simplifié des aides sociales (RSA, prime d'activité, APL, allocations familiales) en contrepartie d'une activité d'insertion",
          "RSA conditionné à 15-20 h d'activité hebdomadaire",
          "Droit opposable à la garde d'enfants ; allocation familiale des mères isolées +50 %",
          "Égalité femmes-hommes « grande cause » du second quinquennat",
          "Testing contre les discriminations dans les grandes entreprises (plus de 5 000 salariés selon la presse)",
          "Caution publique élargie pour le logement"
        ]
      },
      "Sécurité": {
        "resume": "Doublement de la présence de policiers et gendarmes sur la voie publique, 200 brigades de gendarmerie en plus, 8 500 magistrats et personnels de justice d'ici 2027 ; frontières nationales renforcées, titres de séjour conditionnés au français, éloignements plus rapides.",
        "mesures": [
          "Doublement de la présence de policiers et gendarmes sur la voie publique",
          "200 brigades de gendarmerie supplémentaires",
          "Recrutement de 8 500 magistrats et personnels de justice d'ici 2027",
          "Cybersécurité",
          "Généralisation du service national universel (selon la presse)",
          "« Force des frontières » aux frontières nationales, poursuite de la réforme de Schengen",
          "Titres de séjour longs conditionnés à la maîtrise du français et à la connaissance de la culture (examen de français selon la presse)",
          "Refonte de l'asile, éloignements plus rapides (refus d'asile = obligation de quitter le territoire)"
        ]
      }
    },
    "autres": [
      "Guichet et numéro uniques pour les démarches administratives"
    ],
    "phares": [
      "Recul progressif de l'âge légal de départ à 65 ans, avec minimum de pension à 1 100 €",
      "RSA : 15 à 20 heures d'activité hebdomadaire, versement automatique des aides, France Travail",
      "Prime « Macron » triplée (jusqu'à 3 000 à 6 000 €) et compte épargne-temps universel",
      "Suppression de la redevance télé et baisse des droits de succession",
      "Suppression de la CVAE et baisse des impôts de production",
      "Plan nucléaire (6 EPR, 8 études), solaire x10, 50 parcs éoliens en mer",
      "700 000 rénovations de logements par an ; voiture électrique à moins de 100 €/mois",
      "Doublement de la présence policière et gendarmique sur la voie publique ; 8 500 magistrats et personnels de justice",
      "Droit opposable à la garde d'enfants ; bilans de santé gratuits ; plus de 50 000 soignants pour les aînés",
      "Taxe carbone aux frontières européennes ; Europe de la défense"
    ],
    "pdfs": [
      {
        "label": "Macron — profession de foi, 1er tour",
        "url": "https://www.france-politique.fr/doc/PR-2022/PR2022-Macron-PROF.pdf"
      },
      {
        "label": "Macron — profession de foi, 2nd tour",
        "url": "https://france-politique.fr/doc/PR-2022/PR2022-Macron-t2.pdf"
      }
    ],
    "sources": [
      {
        "label": "europe1.fr",
        "url": "https://www.europe1.fr/politique/lancien-premier-ministre-edouard-philippe-lance-son-parti-horizons-4070672"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/non-classe/presidentielle-2022-que-retenir-du-programme-d-emmanuel-macron-198600"
      },
      {
        "label": "myrhline.com",
        "url": "https://myrhline.com/type-article/programme-emmanuel-macron/"
      }
    ]
  },
  "Raphaël Glucksmann": {
    "kind": "soutien",
    "programmeLabel": "Programme 2022 d'Anne Hidalgo (candidate PS), 70 propositions",
    "note": "Programme d'Anne Hidalgo, et non de Raphaël Glucksmann : Place publique n'a soutenu aucun candidat en 2022 ; ce choix est celui de l'utilisateur. Résumé établi à partir du programme officiel « Mes 70 propositions pour la France ».",
    "themes": {
      "Institutions": {
        "resume": "Démocratie continue : RIP à 1 million de signatures, création d'un RIC, scrutin mixte à la proportionnelle partielle, limitation du 49.3 et des ordonnances, Premier ministre chef de la majorité, décentralisation « acte III ».",
        "mesures": [
          "Possibilité d'amendements et de propositions de lois citoyennes ; référendum comme mode normal de participation",
          "Abaissement des seuils du référendum d'initiative partagée (RIP), avec 1 million de signatures ; création d'un référendum d'initiative citoyenne (RIC), sous l'égide d'un Conseil de la société civile (actuellement le CESE)",
          "Conférence Départementale de la Participation dans chaque département",
          "Parité réelle, droit de vote à 16 ans, droit de vote des étrangers aux élections locales, parcours de formation à la citoyenneté",
          "Inscription automatique sur les listes électorales, prise en compte du vote blanc, financement plus égalitaire avec des « bons de la démocratie »",
          "Mode de scrutin mixte (proche du système allemand) élisant une partie des députés à la proportionnelle ; élection législative avant la présidentielle",
          "Parlement maître de son ordre du jour, limites à son pouvoir d'amendement supprimées ou réduites, abrogation du vote bloqué",
          "Recours aux ordonnances strictement limité ; fin du 49.3 sauf pour les lois budgétaires",
          "Rôle de l'opposition et pouvoirs des commissions d'enquête renforcés ; contrôle et évaluation du gouvernement accrus",
          "Premier ministre véritable chef de la majorité, quasi-totalité des pouvoirs de nomination transférés au gouvernement sous contrôle du Parlement",
          "Article 16 remplacé par un article sur le contrôle démocratique de l'état d'urgence",
          "Indépendance du parquet : avis conforme du Conseil supérieur de la magistrature sur toutes les nominations de magistrats du parquet",
          "Acte III de la décentralisation : autonomie financière des collectivités restaurée, « permis de faire », remplacement du contrôle de légalité par du conseil et un contrôle a posteriori",
          "Accès de premier niveau aux principaux services publics garanti dans chaque commune ; carte des services publics garantie sur cinq ans ; bus itinérants du service public",
          "Discours annuel sur l'Union européenne devant le Parlement réuni en congrès"
        ]
      },
      "Économie": {
        "resume": "SMIC +15 % (200 € net), écart de rémunération limité de 1 à 20, assurance-chômage universelle, conditionnalité sociale et environnementale des aides aux entreprises, ISF Climat, réindustrialisation ; programme chiffré à 50 Md€ par an.",
        "mesures": [
          "SMIC augmenté de 15 % dès l'arrivée au pouvoir (200 € net de plus par mois) ; conférence sur les salaires ; négociations dans les branches ; révision des grilles de qualification",
          "Écart maximal de rémunération de 1 à 20 dans les entreprises (au-delà, non déductible de l'IS) ; salariés dans les comités de rémunération ; bonus/malus de cotisations patronales lié à la part consacrée aux salaires",
          "Égalité réelle des salaires femmes-hommes : liste publique des entreprises fautives, pénalités, inversion de la charge de la preuve",
          "Abrogation de la réforme de l'assurance-chômage ; assurance-chômage universelle négociée par les partenaires sociaux, accessible aux jeunes, portabilité intégrale des droits",
          "Compte épargne temps universel et mieux doté ; incitation à la réduction du temps de travail sans modifier la durée légale",
          "Œuvres sociales et culturelles mutualisées pour les salariés des petites entreprises",
          "Présomption de salariat pour les travailleurs des plateformes, charge de la preuve inversée, transparence des algorithmes",
          "Relocalisation des activités économiques, en commençant par les plus stratégiques ; réduction de 50 % des émissions de CO2 de l'industrie d'ici 2035 par rapport à 2015",
          "Fonds pour la réindustrialisation et l'emploi local de 3 Md€ ; livret de développement industriel par l'écologie",
          "Quatre « odyssées industrielles » (santé, énergie, mobilité, numérique), menées avec les Régions",
          "Entreprises de plus de 1 000 salariés : 50 % d'administrateurs salariés (33 % en dessous de 1 000 salariés)",
          "Aides publiques aux entreprises conditionnées à des critères sociaux et environnementaux, remboursement en cas de manquement",
          "Économie sociale et solidaire : ministre de plein exercice, accès à la commande publique, emplois aidés et verts, généralisation de « territoire zéro chômeur de longue durée », TVA réduite sur le recyclage et le réemploi",
          "Recherche et développement à 3 % du PIB à la fin du quinquennat, recherche publique privilégiée",
          "Finance et GAFAM : labellisation exigeante contre le greenwashing, pénalité sur l'investissement dans les énergies fossiles, critères ESG obligatoires pour banques et assurances",
          "ISF Climat et Biodiversité (5 Md€ par an) ; surtaxation des placements liés aux énergies fossiles",
          "Fiscalité des successions abaissée pour 95 % des Français, relevée pour les patrimoines supérieurs à 2 M€ (8 Md€ par an)",
          "Fiscalité des multinationales (6 Md€ par an) ; lutte contre la fraude fiscale (6 Md€ par an)",
          "Budget : 50 Md€ de ressources annuelles (dont 10 Md€ de dépenses néfastes à l'environnement en moins, 5 Md€ de fonds européens réorientés, 10 Md€ de surplus de croissance) et 50 Md€ de dépenses (travail 3, écologie et réindustrialisation 15, éducation et jeunesse 14, nouvelles sécurités sociales 14, justice-sécurité-démocratie-diplomatie 4)",
          "Agriculture : loi de régulation et de protection du foncier agricole, plan décennal de renouvellement des générations, contrats tripartites et pluriannuels, revalorisation des retraites agricoles",
          "Agroécologie : sortie des engrais de synthèse et pesticides (rapide pour le glyphosate), interdiction des néonicotinoïdes dans les 100 premiers jours, 30 % de la surface agricole en bio en 2030",
          "Triplement des moyens de formation agricole sur 5 ans ; autonomie européenne en protéines végétales dès 2030 ; pêche et aquaculture 100 % durables en 2030 ; Assises du bien-être animal",
          "Alimentation : publicité interdite pour les produits néfastes destinés aux enfants, tarification sociale en restauration collective, plans alimentaires territoriaux obligatoires, contrats de filière sur 5 ans, clarification des labels, PAC plus juste et plus verte"
        ]
      },
      "Écologie": {
        "resume": "Droits de la nature dans la Constitution, ministre du Climat numéro deux du gouvernement, 100 % d'énergies renouvelables aussi vite que possible sans nouveaux EPR, 760 000 rénovations par an, leasing social de voitures électriques.",
        "mesures": [
          "Droits de la nature, non-régression et lutte contre le réchauffement inscrits dans la Constitution ; Défenseur de l'environnement",
          "Crime d'écocide ; Tribunal Pénal International de l'Environnement",
          "Ministre du Climat, de la Biodiversité et de l'Économie numéro deux du gouvernement ; Budget Climat et biodiversité voté chaque année par le Parlement",
          "Règle d'Or Climatique : 50 % des recettes de fiscalité écologique pour la transition, 50 % pour des mesures sociales en faveur des ménages impactés",
          "Pacte énergétique : 100 % d'énergies renouvelables aussi rapidement que possible, l'essentiel des investissements énergétiques leur étant consacré",
          "Pas de construction de nouveaux EPR ni de petits réacteurs modulaires",
          "Nucléaire utilisé comme énergie de transition, sans sortie précipitée ; durée de vie des centrales actuelles définie sous le contrôle de l'ASN et du Parlement, avec investissements de prolongation possibles",
          "Leasing social de véhicules électriques (coût mensuel inférieur à celui d'un véhicule à essence) ; prêt à taux zéro pour la mobilité durable ; aides au retrofit renforcées",
          "Un million de bornes électriques supplémentaires, priorité aux zones rurales ; infrastructures électriques et hydrogène",
          "Investissement massif dans le ferroviaire (petites lignes, trains de nuit, fret) ; TVA réduite sur les déplacements en train ; taxe empreinte carbone sur le billet d'avion si alternative ferroviaire comparable",
          "Doublement du fret ferroviaire d'ici 2030 ; revitalisation du fret maritime et fluvial",
          "Plan pluriannuel de rénovation énergétique sans frais à avancer (remboursement à la revente ou à la succession) : 760 000 logements privés par an, 22 millions d'ici 2050",
          "Loyers du parc locatif encadrés en fonction de la performance énergétique",
          "TVA baissée sur le gaz naturel et l'électricité pour les particuliers ; baisse transitoire sur les carburants en cas de flambée",
          "Sobriété numérique : filières de réemploi et reconditionnement à TVA réduite, charte carbone pour les data centers, déploiement dans les zones blanches, libération progressive des fréquences obsolètes",
          "Adaptation au dérèglement climatique : moyens humains et d'ingénierie accrus (agences de l'eau, ONF, Météo-France, Cerema, Ademe), solutions fondées sur la nature",
          "Prélèvement « 1 % océans » sur les budgets publicitaires des entreprises ; lutte contre les dépôts sauvages de déchets",
          "Protection des forêts : regroupement et renforcement de l'ONF et du CNPF, plan de formation des métiers de la filière forêt-bois"
        ]
      },
      "Europe": {
        "resume": "Europe « instrument de souveraineté » : fin du pacte de stabilité au profit d'un pacte de progrès, ressources propres, agenda social européen, mécanisme carbone aux frontières ; armées renforcées, diplomatie climatique et sommet « Paris+10 ».",
        "mesures": [
          "Fin du pacte de stabilité et de croissance au profit d'un « pacte de progrès » ; nouvelles ressources propres de l'UE (taxe sur les transactions financières et les géants du numérique, contribution carbone aux frontières, fraction de TVA et d'IS)",
          "Nouvel agenda social européen : salaire minimum, égalité femmes-hommes, protection des travailleurs des plateformes et précaires, transitions professionnelles",
          "Tenir l'engagement de -55 % d'émissions en 2030 et la neutralité carbone en 2050 ; mise en œuvre rapide du mécanisme d'ajustement carbone aux frontières",
          "TVA réduite sur les produits verts au niveau européen ; élargissement du Fonds pour une transition juste",
          "Fiscalité plus forte des multinationales (taux minimal supérieur à 15 %), transparence fiscale, contrôle du Parlement sur la liste européenne des paradis fiscaux",
          "Rénovation de la politique commerciale européenne : accords conditionnés à des critères sociaux et environnementaux et au bannissement des importations liées à la traite des êtres humains",
          "Parlement européen partageant l'initiative des lois, pouvant amender le budget pluriannuel et ayant le dernier mot à la majorité des deux tiers ; fin du vote à l'unanimité dans des domaines comme la fiscalité",
          "Programme « deux langues pour l'Europe » ; droits d'interpellation des citoyens renforcés",
          "Armées : loi de programmation militaire 2019-2025 révisée à la hausse (spatial, cybersécurité), moyens de recherche et développement militaire accrus, France puissance maritime",
          "Contrôle du Parlement renforcé sur les opérations militaires extérieures (vote régulier sur leur poursuite)",
          "Francophonie et diplomatie : moyens rendus au Quai d'Orsay, à l'Institut français, aux Alliances françaises et à l'audiovisuel extérieur ; services consulaires et centres de vote rétablis",
          "Diplomatie climatique : sommet mondial « Paris+10 » en 2025, trajectoire zéro carbone plus ambitieuse que celle de la COP26, reconnaissance internationale du crime d'écocide",
          "Santé mondiale : pression pour la levée temporaire des brevets sur les vaccins, fin de l'épidémie de sida, lutte contre le paludisme"
        ]
      },
      "Social": {
        "resume": "Âge légal de la retraite plafonné à 62 ans, minimum vieillesse à 1 000 €, jusqu'à 15 000 médecins formés par an, suppression de Parcoursup, 150 000 logements sociaux par an, minimum jeunesse et capital de 5 000 €, fin de vie digne.",
        "mesures": [
          "Âge légal de départ plafonné aux 62 ans actuels",
          "Minimum vieillesse à 1 000 € net et minimum contributif à 1 200 € ; chaque heure travaillée ouvre à cotisation pour la retraite",
          "Rétablissement des 4 critères de pénibilité supprimés (manutention de charges lourdes, postures pénibles, vibrations mécaniques, agents chimiques), en plus des 6 existants",
          "Hôpital : fin de l'ONDAM remplacé par des Objectifs Nationaux de Santé Publique débattus chaque année par le Parlement ; sortie de la tarification à l'acte au profit d'une dotation selon les besoins ; permanences de médecins libéraux le week-end",
          "Facultés de médecine : jusqu'à 15 000 nouveaux médecins par an ; 1 250 sages-femmes, 25 000 infirmiers et aides-soignants, 5 000 logisticiens, techniciens et agents hospitaliers par an ; poursuite de la revalorisation des rémunérations",
          "Année de professionnalisation de 12 mois comme médecin-assistant dans les déserts médicaux, à la place de la 4e année d'internat : 4 à 8 000 médecins dans ces territoires chaque année",
          "Santé publique et prévention : renforcement de Santé publique France, plan maladies chroniques, santé mentale grande cause du quinquennat",
          "Burn-out reconnu maladie professionnelle ; CHSCT rétablis dans les entreprises de plus de 50 salariés",
          "Seniors : politique « bien vieillir », service public d'accompagnement de la perte d'autonomie, revalorisation de l'APA, présence humaine accrue en Ehpad, plan de formation et de recrutement, guichet unique",
          "Handicap : statut pérenne pour les AESH, école inclusive, accessibilité universelle, individualisation de l'AAH menée à son terme",
          "Droit opposable à un mode d'accueil pour la petite enfance ; places en crèche portées de 470 000 à 600 000 en 10 ans ; allocation de rentrée scolaire dès l'entrée en maternelle",
          "Fin de vie : nouvelle loi (directives anticipées, soins palliatifs universels, aide active à mourir)",
          "Logement social porté à 150 000 logements par an dont un tiers de très sociaux ; encadrement des loyers dans toutes les zones tendues ; sanctions pour les communes ne respectant pas la loi SRU (25 % en 2025)",
          "Foncières publiques avec la Caisse des dépôts ; bouclier logement (allocation complémentaire pour que nul ne dépense plus du tiers de ses revenus pour se loger)",
          "« Minimum jeunesse » pour tous les jeunes de plus de 18 ans sous condition de ressources, avec accompagnement vers l'emploi ; dotation en capital de 5 000 € à 18 ans",
          "Congé paternité allongé à 16 semaines dont 6 obligatoires",
          "Ministère des Droits des femmes de plein exercice ; plus d'1 Md€ contre les violences faites aux femmes ; politique de protection de l'enfance",
          "Observatoire de lutte contre les discriminations, plan quinquennal contre le racisme et l'antisémitisme, moyens accrus pour le testing, formation obligatoire du personnel éducatif ; dépénalisation universelle de l'homosexualité portée à l'international",
          "Enseignants : rémunération portée progressivement au niveau de celle des cadres, en commençant par les débuts de carrière ; formation initiale complète et formation continue",
          "États généraux de la pédagogie en 2022, pédagogies ouvertes et inclusives",
          "« Plan mixité » dans chaque département pour mettre fin aux collèges-ghettos, enseignement privé sous contrat associé",
          "Enseignement civique renforcé, atteintes à la laïcité sanctionnées, professeurs protégés des pressions ; lutte contre le harcèlement scolaire (référents, formation)",
          "Suppression de Parcoursup au profit de règles transparentes, justes et humaines ; service public de l'orientation renforcé ; création de places dans les formations les plus demandées",
          "Mentorat à l'échelle des territoires pour les jeunes décrocheurs",
          "Université : 60 % d'une classe d'âge diplômée du supérieur (38 % aujourd'hui), plan de rattrapage avec les régions ; alternance généralisée à l'ensemble des formations",
          "Éducation artistique et culturelle : 10 000 artistes accueillis dès 2023, maisons d'art pour la petite enfance, Erasmus culturel",
          "Culture : artistes en résidence dans toutes les scènes publiques, 10 % de la programmation des institutions publiques à la nouvelle création, artothèques, politique de patrimoine, juste rémunération des auteurs et artistes",
          "Médias : nouvelle politique anti-concentration, statut juridique des rédactions, service public de l'audiovisuel renforcé, Contribution à l'Audiovisuel Public juste et universelle"
        ]
      },
      "Sécurité": {
        "resume": "Présence renforcée de policiers et gendarmes sur le terrain, contrôle par une autorité indépendante, lutte contre le terrorisme et la criminalité organisée, alternatives à l'incarcération, conférence de consensus sur le cannabis, réforme européenne de l'asile.",
        "mesures": [
          "Présence des policiers et gendarmes sur le terrain renforcée par des recrutements répondant aux besoins locaux et un allègement de la procédure pénale",
          "Chaque recrutement accompagné d'un budget d'équipement et d'immobilier ; police municipale en complémentarité de la police nationale ; réforme concertée des cycles de travail",
          "Formation des policiers à la lutte contre le racisme, l'antisémitisme, l'homophobie et le harcèlement de rue",
          "Contrôle de l'action des forces de sécurité intérieure par une autorité indépendante spécialisée",
          "Moyens des services de renseignement et du versant judiciaire de la lutte antiterroriste confortés ; mobilisation contre la criminalité organisée et la grande délinquance financière",
          "Lutte contre les violences faites aux femmes sur le modèle espagnol : formation des policiers et magistrats, assistantes sociales dans les commissariats, sanctions pénales aggravées, éloignement des conjoints violents, priorité dans le parc social pour les victimes",
          "Loi de programmation quinquennale pour la justice : recrutement de magistrats, greffiers et travailleurs sociaux ; réduction des délais, simplification des démarches",
          "Sanction qui éduque : diversification des modalités d'incarcération, évaluation et accompagnement de toutes les personnes incarcérées, renforcement des services d'insertion et de probation",
          "Alternatives à l'incarcération (liberté surveillée, bracelet électronique, travail d'intérêt général, amendes) ; respect de l'encellulement individuel et plan de construction pénitentiaire",
          "Conférence de consensus sur la légalisation du cannabis, avec examen d'une légalisation sous contrôle strict de l'État pour les plus de 18 ans",
          "Commission nationale de suivi des réseaux sociaux auprès du Défenseur des droits, poursuites contre les réseaux tolérant le harcèlement en ligne et les discriminations",
          "Réforme du système de Dublin : solidarité entre États membres, coopération renforcée si nécessaire",
          "Accueil digne des demandeurs d'asile, répartition équilibrée sur le territoire, délais de traitement maîtrisés ; lutte contre l'immigration clandestine et les filières",
          "Intégration relancée : accès au travail dès la demande d'asile, cours de français gratuits, enseignement des dimensions culturelles et historiques du pays"
        ]
      }
    },
    "autres": [
      "Outre-mer : plan de rattrapage des services publics et des infrastructures (eau, énergies renouvelables, routes) ; lutte contre la vie chère (réduction de l'octroi de mer sur certains produits essentiels, action de l'Autorité de la concurrence) ; « agence du retour » pour les jeunes ultramarins",
      "Outre-mer : plan de développement des énergies renouvelables pour l'autonomie énergétique ; mesures d'urgence sur le chlordécone (frais médicaux pris en charge par la Sécurité sociale) et les sargasses ; chaîne publique dédiée aux outre-mers"
    ],
    "phares": [
      "SMIC augmenté de 15 % (200 € net par mois) et conférence sur les salaires",
      "Âge légal de la retraite plafonné à 62 ans ; minimum vieillesse à 1 000 € et minimum contributif à 1 200 €",
      "ISF Climat et Biodiversité ; impôt sur les successions relevé pour les patrimoines supérieurs à 2 M€",
      "100 % d'énergies renouvelables aussi vite que possible, sans nouveaux EPR",
      "Rénovation énergétique de 760 000 logements par an sans frais à avancer",
      "150 000 logements sociaux par an ; encadrement des loyers dans toutes les zones tendues",
      "« Minimum jeunesse » dès 18 ans et dotation en capital de 5 000 €",
      "Jusqu'à 15 000 médecins formés par an ; fin de l'ONDAM ; suppression de Parcoursup",
      "RIC et RIP à 1 million de signatures ; scrutin mixte ; fin du 49.3 sauf lois budgétaires",
      "Limitation à 1 à 20 de l'écart de rémunération dans les entreprises ; 50 % d'administrateurs salariés au-delà de 1 000 salariés"
    ],
    "pdfs": [
      {
        "label": "Hidalgo — Mes 70 propositions",
        "url": "https://xn--ambitionsant2022-mqb.fhf.fr/medias/anne-hidalgo-programme-officiel-en-a4-leger-compressed-623217494ac28272306959.pdf"
      }
    ],
    "sources": [
      {
        "label": "assets.nationbuilder.com",
        "url": "https://assets.nationbuilder.com/themes/6181b6eb4445ea720389b314/attachments/original/1643803625/programme_presidentiel_yannick_jadot.pdf?1643803625"
      },
      {
        "label": "jadot2022.fr",
        "url": "https://www.jadot2022.fr/programme"
      }
    ]
  },
  "Gabriel Attal": {
    "kind": "soutien",
    "programmeLabel": "Programme 2022 d'Emmanuel Macron (candidat soutenu par Renaissance)",
    "note": "Programme du candidat Emmanuel Macron, soutenu par le parti (alors LaREM, devenu Renaissance) ; ce n'est pas un programme d'Attal, qui n'était pas candidat. Certains chiffres (30 Md€, 6 EPR + 8, 15 Md€, régimes spéciaux, CVAE) viennent de synthèses de presse et non des professions de foi ; le programme détaillé d'avecvous.fr n'est plus consultable.",
    "themes": {
      "Institutions": {
        "resume": "Citoyens associés à chaque grande décision, relance de la réforme institutionnelle par une commission transpartisane, droit à la différenciation et conseiller territorial. Pas de proportionnelle chiffrée dans les sources lues.",
        "mesures": [
          "Citoyens associés à chaque grande décision",
          "Relance de la réforme institutionnelle via une commission transpartisane",
          "Droit à la différenciation / conseiller territorial",
          "Référendum possible sur la fin de vie (selon la presse)"
        ]
      },
      "Économie": {
        "resume": "Objectif de plein emploi, prime « Macron » triplée (jusqu'à 3 000 à 6 000 €), compte épargne-temps universel, baisses d'impôts d'environ 15 Md€/an dont suppression de la CVAE et de la redevance audiovisuelle. Coût annoncé : environ 50 Md€ par an d'ici 2027.",
        "mesures": [
          "Objectif de plein emploi (« horizon enfin accessible »)",
          "Prime « Macron » (prime annuelle défiscalisée) triplée, jusqu'à 3 000 € voire 6 000 € sans charges ni impôts (PME de moins de 50 salariés ou accord d'intéressement)",
          "Maintien des boucliers tarifaires gaz et électricité",
          "Généralisation de la participation/intéressement (« dividende salarié »)",
          "Compte épargne-temps universel (RTT et congés monétisables ou épargnés)",
          "Baisse des charges des indépendants",
          "30 Md€ d'investissements dans les secteurs d'avenir (spatial, biomédicaments, semi-conducteurs, réacteurs, numérique, quantique, IA) selon la presse",
          "Coût annoncé du programme : environ 50 Md€ par an d'ici 2027 (franceinfo/Public Sénat) ; financement par le plein emploi, la réforme des retraites, les réformes de fond (e-prescription, fraude)",
          "Pôle emploi transformé en « France Travail »",
          "Rémunération des dirigeants liée à des critères environnementaux et sociaux",
          "Baisses d'impôts d'environ 15 Md€/an (moitié ménages, moitié entreprises) selon Public Sénat",
          "Suppression de la redevance audiovisuelle",
          "Suppression de la CVAE (environ 10 Md€/an d'allègement selon myRHline)",
          "Baisse des droits de succession : aucun droit jusqu'à 150 000 € par enfant et jusqu'à 100 000 € transmis à d'autres membres de la famille",
          "Loi d'orientation et d'avenir agricole"
        ]
      },
      "Écologie": {
        "resume": "« Premier grand pays à sortir du pétrole, du gaz, du charbon » ; 6 nouveaux réacteurs nucléaires et étude de 8 autres, solaire x10, 50 parcs éoliens en mer d'ici 2050 ; 700 000 rénovations de logements par an. La « planification écologique » n'est pas citée dans les sources lues.",
        "mesures": [
          "« Premier grand pays à sortir du pétrole, du gaz, du charbon »",
          "Taxe carbone aux frontières de l'UE",
          "6 nouveaux réacteurs nucléaires et étude de 8 autres, solaire x10, 50 parcs éoliens en mer d'ici 2050 (Public Sénat, d'après les annonces de campagne)",
          "700 000 rénovations de logements par an",
          "Filière française de voitures électriques",
          "Location d'une voiture électrique pour moins de 100 €/mois"
        ]
      },
      "Europe": {
        "resume": "« Europe-puissance » indépendante : Europe de la défense, des frontières et technologique face aux grandes plateformes ; investissement dans la défense et pacte Armées-Nation ; livraisons de Rafale, sous-marins et blindés aux armées.",
        "mesures": [
          "« Europe-puissance » indépendante : Europe de la défense, Europe des frontières, Europe technologique face aux grandes plateformes",
          "Investissement dans la défense ; pacte Armées-Nation",
          "Livraison aux armées de plus de 60 Rafale supplémentaires d'ici 2030, 5 sous-marins nucléaires d'attaque, 1 250 véhicules blindés"
        ]
      },
      "Social": {
        "resume": "Recul progressif de l'âge légal à 65 ans avec minimum de pension à 1 100 €, RSA conditionné à 15-20 h d'activité hebdomadaire, droit opposable à la garde d'enfants, bilans de santé gratuits, priorité aux fondamentaux à l'école.",
        "mesures": [
          "Recul progressif de l'âge légal à 65 ans (à partir de 62 ans) avec prise en compte de l'incapacité, des carrières longues ou pénibles",
          "Minimum de pension à 1 100 € pour une carrière complète",
          "Cumul emploi-retraite plus avantageux et simplifié",
          "Régimes spéciaux ramenés à trois (nouveaux entrants), selon myRHline",
          "Indexation des retraites sur l'inflation (ajoutée au 2nd tour)",
          "Bilans de santé gratuits aux âges clés",
          "Lutte contre les déserts médicaux (recrutement d'infirmiers, aides-soignants, médecins et réorganisation)",
          "Poursuite de l'investissement dans l'hôpital public ; simplification de la gouvernance hospitalière",
          "Grande conférence sur le système de santé ; convention citoyenne sur la fin de vie",
          "Aînés : 50 000 soignants/infirmiers et aides-soignants de plus en maison de retraite, contrôles renforcés",
          "Aînés : « Prime Adapt' » pour jusqu'à 70 % des coûts d'adaptation du logement, 2 h d'aide à domicile en plus par semaine",
          "Éducation : priorité aux fondamentaux (français, maths), plus de sport",
          "Enseignants mieux rémunérés avec de nouvelles missions (sans chiffre) et plus de liberté ; concertation préalable à la réforme de l'école",
          "Lycée professionnel « voie d'excellence »",
          "Supérieur : plus de places dans les filières qui recrutent, bourses plus justes",
          "Contrôle parental automatique des appareils, lutte contre le harcèlement",
          "Versement automatique et simplifié des aides sociales (RSA, prime d'activité, APL, allocations familiales) en contrepartie d'une activité d'insertion",
          "RSA conditionné à 15-20 h d'activité hebdomadaire",
          "Droit opposable à la garde d'enfants ; allocation familiale des mères isolées +50 %",
          "Égalité femmes-hommes « grande cause » du second quinquennat",
          "Testing contre les discriminations dans les grandes entreprises (plus de 5 000 salariés selon la presse)",
          "Caution publique élargie pour le logement"
        ]
      },
      "Sécurité": {
        "resume": "Doublement de la présence de policiers et gendarmes sur la voie publique, 200 brigades de gendarmerie en plus, 8 500 magistrats et personnels de justice d'ici 2027 ; frontières nationales renforcées, titres de séjour conditionnés au français, éloignements plus rapides.",
        "mesures": [
          "Doublement de la présence de policiers et gendarmes sur la voie publique",
          "200 brigades de gendarmerie supplémentaires",
          "Recrutement de 8 500 magistrats et personnels de justice d'ici 2027",
          "Cybersécurité",
          "Généralisation du service national universel (selon la presse)",
          "« Force des frontières » aux frontières nationales, poursuite de la réforme de Schengen",
          "Titres de séjour longs conditionnés à la maîtrise du français et à la connaissance de la culture (examen de français selon la presse)",
          "Refonte de l'asile, éloignements plus rapides (refus d'asile = obligation de quitter le territoire)"
        ]
      }
    },
    "autres": [
      "Guichet et numéro uniques pour les démarches administratives"
    ],
    "phares": [
      "Recul progressif de l'âge légal de départ à 65 ans, avec minimum de pension à 1 100 €",
      "RSA : 15 à 20 heures d'activité hebdomadaire, versement automatique des aides, France Travail",
      "Prime « Macron » triplée (jusqu'à 3 000 à 6 000 €) et compte épargne-temps universel",
      "Suppression de la redevance télé et baisse des droits de succession",
      "Suppression de la CVAE et baisse des impôts de production",
      "Plan nucléaire (6 EPR, 8 études), solaire x10, 50 parcs éoliens en mer",
      "700 000 rénovations de logements par an ; voiture électrique à moins de 100 €/mois",
      "Doublement de la présence policière et gendarmique sur la voie publique ; 8 500 magistrats et personnels de justice",
      "Droit opposable à la garde d'enfants ; bilans de santé gratuits ; plus de 50 000 soignants pour les aînés",
      "Taxe carbone aux frontières européennes ; Europe de la défense"
    ],
    "pdfs": [
      {
        "label": "Macron — profession de foi, 1er tour",
        "url": "https://www.france-politique.fr/doc/PR-2022/PR2022-Macron-PROF.pdf"
      },
      {
        "label": "Macron — profession de foi, 2nd tour",
        "url": "https://france-politique.fr/doc/PR-2022/PR2022-Macron-t2.pdf"
      }
    ],
    "sources": [
      {
        "label": "parti-renaissance.fr",
        "url": "https://parti-renaissance.fr/"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/non-classe/presidentielle-2022-que-retenir-du-programme-d-emmanuel-macron-198600"
      },
      {
        "label": "myrhline.com",
        "url": "https://myrhline.com/type-article/programme-emmanuel-macron/"
      },
      {
        "label": "franceinfo.fr",
        "url": "https://www.franceinfo.fr/elections/presidentielle/presidentielle-2022-retraite-rsa-aides-sociales-emmanuel-macron-devoile-son-programme_5022326.html"
      }
    ]
  },
  "Bruno Retailleau": {
    "kind": "soutien",
    "programmeLabel": "Programme 2022 de Valérie Pécresse (candidate LR), « Le courage de faire »",
    "note": "Programme de Valérie Pécresse, candidate soutenue par le parti, et non de Bruno Retailleau, qui n'était pas candidat en 2022. Résumé établi à partir de la brochure de campagne de 16 pages, non du projet complet.",
    "themes": {
      "Institutions": {
        "resume": "Référendums sur l'immigration, la sécurité et la laïcité dès l'automne 2022 et référendums d'initiative populaire, grande loi de décentralisation, mesures de laïcité (voile, burkini). Pas de réforme du mode de scrutin dans la brochure.",
        "mesures": [
          "Référendums (immigration, sécurité, laïcité) et référendums d'initiative populaire",
          "Grande loi de décentralisation (« République des territoires »)",
          "« Pacte de réconciliation nationale »",
          "Inscription dans la Constitution que nul ne peut se prévaloir de ses origines ou de sa religion pour s'exonérer de la loi commune",
          "Interdiction du voile pour les fillettes et des accompagnatrices scolaires voilées",
          "Burkini proscrit dans les piscines"
        ]
      },
      "Économie": {
        "resume": "Hausse de 10 % du salaire net en 5 ans sous 2 800 € nets/mois, heures supplémentaires sans charges ni impôt, fin des 35 h par négociation d'entreprise, 200 000 postes de fonctionnaires supprimés, règle d'or budgétaire (déficit réduit de 42 Md€ en 2027).",
        "mesures": [
          "Hausse du salaire net de 10 % en 5 ans pour ceux gagnant moins de 2 800 € nets/mois (au moins 500 € de plus par an dès 2023)",
          "RTT convertibles en salaire sans charges",
          "Ni charge ni impôt sur les heures au-delà de 35 h, sans plafond",
          "Intéressement/participation (dividende salarié)",
          "Fin des 35 h par négociation d'entreprise (référendum d'entreprise possible)",
          "10 Md€ de baisse des impôts de production",
          "Suppression de 500 organismes publics",
          "Suppression de 200 000 postes de fonctionnaires dans les services « suradministrés », avec 50 000 recrutements santé/justice/éducation",
          "15 heures d'activité hebdomadaires obligatoires pour les bénéficiaires du RSA",
          "Indemnités chômage réduites de 30 % en cas de refus d'une formation dans un métier en tension",
          "Liberté de cumul emploi-retraite",
          "Énergie : suppression de la TVA sur les taxes pesant sur l'électricité, indexation des indemnités kilométriques sur les prix des carburants, fin de l'indexation du prix de l'électricité sur le marché européen",
          "Suppression de la redevance audiovisuelle",
          "TVA réduite à 5,5 % sur les biens culturels",
          "Suppression des droits de succession pour 95 % des Français",
          "Donations jusqu'à 100 000 € sans impôt par enfant et petit-enfant tous les 6 ans",
          "Défiscalisation des pensions alimentaires",
          "Crédit d'impôt emplois à domicile relevé (6 000 à 10 000 €/an, +1 500 € par enfant)",
          "Règle d'or budgétaire dans la Constitution (déficit réduit de 42 Md€ en 2027 ; « deux fois plus d'économies que de dépenses »)"
        ]
      },
      "Écologie": {
        "resume": "Neutralité carbone 2050 sans hausse d'impôt, au moins 6 nouveaux EPR et prolongation du parc, fin de la vente de véhicules thermiques neufs en 2035, 200 000 bornes de recharge, « livret vert » de 120 Md€.",
        "mesures": [
          "Neutralité carbone 2050 « sans hausse d'impôt »",
          "Au moins 6 nouveaux EPR, réacteur de nouvelle génération, prolongation du parc existant, sauvetage d'EDF",
          "Renouvelables, hydrogène ; aucun projet éolien sans accord des populations",
          "Fin de la vente de véhicules thermiques neufs en 2035 (hybrides rechargeables 2040)",
          "200 000 bornes de recharge",
          "120 Md€ pour la transition via un « livret vert »",
          "Doublement du nombre de rénovations de logements",
          "100 % de produits locaux dont bio dans les cantines publiques d'ici 2027",
          "10 % du territoire en forte protection"
        ]
      },
      "Europe": {
        "resume": "« France forte dans une Europe forte » : renégociation de Schengen, 10 000 garde-frontières Frontex de plus, préférence européenne dans la commande publique, fin de l'adhésion de la Turquie, +108 Md€ pour les armées d'ici 2030.",
        "mesures": [
          "« France forte dans une Europe forte »",
          "Renégociation de Schengen, 10 000 garde-frontières Frontex supplémentaires",
          "Préférence européenne dans la commande publique",
          "Taxe carbone aux frontières de l'UE",
          "Fin du processus d'adhésion de la Turquie",
          "Europe de la défense solidaire dans l'OTAN",
          "+108 Md€ pour les armées d'ici 2030",
          "Dialogue avec les États-Unis, fermeté stratégique avec la Chine",
          "Condamnation de l'invasion russe de l'Ukraine",
          "Aide au développement redéployée vers l'Afrique"
        ]
      },
      "Social": {
        "resume": "Retraite à 65 ans en 2030 avec minimum au SMIC net, 25 000 soignants de plus et consultation à 30 €, +2 h de français au primaire, apprentissage dès 14 ans, allocations familiales rétablies pour tous, 500 000 logements par an.",
        "mesures": [
          "Relèvement progressif de l'âge légal à 65 ans à horizon 2030 (prise en compte de la pénibilité et des carrières longues)",
          "Aucune pension sous un SMIC net pour une carrière complète ; réversion de 54 % à 75 %",
          "Un trimestre de retraite pour 10 ans d'engagement associatif des dirigeants",
          "4e année d'internat de médecine générale dans les déserts médicaux (objectif 4 000 « docteurs juniors » par an)",
          "Consultation généraliste à 30 € ; 25 000 soignants de plus à l'hôpital ; statut rénové des hôpitaux",
          "3 grandes causes : santé mentale (institut national), cancer de l'enfant (congé avec maintien de salaire), santé des femmes (endométriose en ALD, TVA 2,1 % sur les produits d'hygiène féminine)",
          "Maintien à domicile (+2 500 € de crédit d'impôt) ; EHPAD : plus de personnel et indicateurs publics ; AAH déconjugalisée",
          "+2 h de français et +1 h de maths par semaine au primaire",
          "Examen avant l'entrée en 6e et 6e de consolidation ; maths dans le tronc commun en 1re/Terminale",
          "Autonomie accrue des établissements ; revalorisation des salaires des enseignants (début de carrière, missions supplémentaires, établissements difficiles) ; 10 000 recrutements en 5 ans",
          "Apprentissage sous statut scolaire dès 14 ans, 1 million d'apprentis en 2027 ; régions responsables de l'enseignement professionnel",
          "Réforme de Parcoursup",
          "« Revenu jeune actif » de 670 €/mois pour les 18-25 ans en formation dans des métiers en tension",
          "Allocations familiales rétablies pour tous sans condition de ressources, +15 % pour 2-3 enfants, allocation de 900 €/an dès le 1er enfant jusqu'à 18 ans",
          "30 000 places de crèche ; statut des aidants",
          "500 000 logements neufs ou rénovés par an ; PTZ généralisé ; plafond de 30 % de logements très sociaux par commune",
          "Exclusion du logement social des fauteurs de troubles",
          "Cantine à 1 € ; doublement de l'aide alimentaire",
          "Non à la GPA",
          "Culture : plan patrimoine de 2,5 Md€",
          "1 Md€ supplémentaire pour la recherche fondamentale"
        ]
      },
      "Sécurité": {
        "resume": "+5 Md€ pour les forces de l'ordre, polices municipales armées, 20 000 places de prison, majorité pénale à 16 ans, peines planchers, 16 000 recrutements dans la justice ; quotas d'immigration, fin du droit du sol automatique, référendum.",
        "mesures": [
          "+5 Md€ pour les forces de l'ordre",
          "Polices municipales armées et obligatoires dans les villes de plus de 5 000 habitants",
          "20 000 places de prison supplémentaires ; centres éducatifs fermés doublés",
          "1 an de prison ferme minimum pour les agressions de dépositaires de l'autorité",
          "Majorité pénale à 16 ans",
          "Peines planchers pour multirécidivistes violents et trafiquants",
          "+50 % de moyens des tribunaux en 5 ans, 16 000 recrutements (juges, procureurs, greffiers, gardiens) ; procédures 2 fois moins longues",
          "Droit à la sécurité inscrit dans la Constitution",
          "Quotas annuels d'immigration par pays et par catégorie (étudiants, familles, métiers)",
          "Expulsion systématique des clandestins, zéro visa pour les pays refusant de les reprendre ; expulsion des étrangers condamnés",
          "Fin du regroupement familial automatique",
          "Pas d'allocations logement et familiales avant 5 ans de résidence légale",
          "Fin du droit du sol automatique (demande à 18 ans, test de français)",
          "Aucune régularisation",
          "Référendum sur l'immigration, la sécurité et la laïcité dès l'automne 2022"
        ]
      }
    },
    "autres": [
      "Fibre sur tout le territoire début 2024",
      "Sport ; bien-être animal",
      "Banque des outre-mer"
    ],
    "phares": [
      "16 000 recrutements dans la justice, impunité zéro ; peines planchers ; majorité pénale à 16 ans",
      "Quotas d'immigration par pays et par catégorie, fin du droit du sol automatique, référendum",
      "Hausse de 10 % du salaire net (moins de 2 800 € nets/mois), heures sup défiscalisées, RTT en salaire",
      "Retraite à 65 ans en 2030 ; minimum au SMIC net pour carrière complète",
      "15 heures d'activité obligatoires pour le RSA",
      "Baisse d'impôts : redevance TV supprimée, TVA culture à 5,5 %, successions supprimées pour 95 % des Français",
      "Règle d'or budgétaire (-42 Md€ de déficit en 2027), 200 000 postes de fonctionnaires supprimés",
      "Au moins 6 nouveaux EPR ; 120 Md€ pour la transition (livret vert) ; taxe carbone aux frontières",
      "+25 000 soignants, 4e année d'internat dans les déserts médicaux, consultation à 30 €",
      "+5 Md€ et polices municipales armées ; +108 Md€ pour les armées d'ici 2030"
    ],
    "pdfs": [
      {
        "label": "Pécresse — Le courage de faire",
        "url": "https://valeriepecresse.fr/wp-content/uploads/2022/03/16P-VP2022-ok.pdf"
      }
    ],
    "sources": [
      {
        "label": "previssima.fr",
        "url": "https://www.previssima.fr/actualite/presidentielle-2022-le-programme-de-valerie-pecresse-les-republicains-en-matiere-de-protection-sociale-infographie.html"
      },
      {
        "label": "valeriepecresse.fr (PDF)",
        "url": "https://valeriepecresse.fr/wp-content/uploads/2022/03/Programme-Valerie-Pecresse-page-2.pdf"
      }
    ]
  },
  "Éric Zemmour": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 d'Éric Zemmour (candidat Reconquête), « Pour que la France reste la France »",
    "note": "Résumé établi à partir du PDF du programme (copie hébergée par la FHF, non par le parti). Certains chiffres (défense, carburant, médecins, Ehpad) viennent d'une synthèse Public Sénat ; le chiffrage global est discuté (65 Md€ annoncés, 55 Md€ détaillés).",
    "themes": {
      "Institutions": {
        "resume": "Référendum dès les législatives sur l'immigration, la sécurité et la justice, dernier mot du Parlement sur une loi censurée, fin du « gouvernement des juges », conseiller territorial rétabli ; interdiction du voile dans l'espace public et des minarets.",
        "mesures": [
          "Référendum dès les législatives sur l'immigration, la sécurité et la justice",
          "Parlement ayant le dernier mot sur une loi censurée (Congrès, 3/5)",
          "Fin du « gouvernement des juges »",
          "Conseiller territorial rétabli",
          "Interdiction du voile dans l'espace public, des minarets et des mosquées imposantes",
          "Financements étrangers du culte interdits"
        ]
      },
      "Économie": {
        "resume": "Équivalent d'un 13e mois pour les salaires au SMIC par baisse de la CSG, heures supplémentaires exonérées, 30 Md€ de baisse des impôts de production, franchise de succession de 200 000 € par enfant, suppression de la redevance audiovisuelle. Pas de hausse du SMIC annoncée.",
        "mesures": [
          "Équivalent d'un 13e mois pour les salaires du SMIC à 2 000 € via une baisse dégressive de la CSG",
          "Petites retraites < 1 300 €/mois exonérées de CSG/CRDS (jusqu'à 600 €/an)",
          "Exonération totale d'impôts et de charges sur les heures supplémentaires",
          "Participation défiscalisée (dès 11 salariés)",
          "Apprentis exonérés de cotisations salariales jusqu'à 100 % du SMIC",
          "Aide carburant (moitié du prix, plafonnée à 40 €/mois, d'après Public Sénat)",
          "Suppression du permis à points, retour à 90 km/h, amendes de stationnement plafonnées à 17 € (idem Public Sénat)",
          "Baisse des impôts de production (30 Md€) ; 36 Md€ de baisses d'impôts pour les entreprises au total",
          "Exonération de droits de succession pour 95 % des familles (franchise de 200 000 € par enfant)",
          "Dons parents/grands-parents jusqu'à 200 000 € tous les 10 ans sans impôt",
          "Plafond du quotient familial doublé (1 592 à 3 000 €)",
          "Suppression de la redevance audiovisuelle (138 €/an) par privatisation de l'audiovisuel public",
          "Chiffrage annoncé : 65 Md€ d'économies / environ 60 Md€ de mesures nouvelles en année pleine (Public Sénat note que le détail ne totalise que 55 Md€)",
          "Agriculteurs : limitation des centrales d'achat"
        ]
      },
      "Écologie": {
        "resume": "Relance du nucléaire (au moins 14 EPR2 à horizon 2050, SMR, 4e génération), fin de la fermeture de réacteurs, arrêt de tous les projets d'éoliennes à terre et en mer.",
        "mesures": [
          "Relance du nucléaire : au moins 14 EPR2 à horizon 2050, SMR, 4e génération",
          "Fin de la fermeture de réacteurs",
          "Arrêt de tous les projets d'éoliennes (terre et mer)",
          "Hydroélectricité préservée de la concurrence",
          "CIGEO"
        ]
      },
      "Europe": {
        "resume": "« Europe des Nations » : référendum obligatoire pour tout traité européen, élargissement ou révision constitutionnelle, primauté des lois nationales, sortie du commandement intégré de l'OTAN, défense à 70 Md€ à l'horizon 2030.",
        "mesures": [
          "« Europe des Nations »",
          "Référendum obligatoire pour toute révision constitutionnelle, traité européen ou élargissement de l'UE",
          "Primauté des lois nationales nouvelles (révision de l'article 55)",
          "Sortie du commandement intégré de l'OTAN en restant dans l'Alliance",
          "Paix en Ukraine puis dialogue avec la Russie",
          "Défense portée à 70 Md€ à l'horizon 2030 (Public Sénat)"
        ]
      },
      "Social": {
        "resume": "Âge légal à 64 ans d'ici 2030 et +1 an de cotisation, fin du collège unique, grand ministère du Savoir et de la Transmission, suppression des ARS, abrogation de la loi SRU, prime de 10 000 € à la naissance pour les familles rurales.",
        "mesures": [
          "Âge légal à 64 ans d'ici 2030 (+1 trimestre par an dès 2023)",
          "Durée de cotisation +1 an d'ici la fin du quinquennat ; aménagements carrières longues/pénibles",
          "Économie attendue d'environ 15 Md€ ; index senior ; cumul emploi-retraite facilité",
          "Doubler le nombre de médecins et soignants formés ; revalorisation des infirmiers et aides-soignants",
          "Suppression des ARS ; 1 000 médecins salariés par l'État pour les territoires (Public Sénat)",
          "Lutte contre les arrêts maladie frauduleux",
          "400 000 places d'Ehpad supplémentaires (Public Sénat)",
          "Fin du collège unique (classes de niveaux, filière pré-professionnelle dès la 4e) ; classes d'excellence",
          "Grand ministère d'État du Savoir et de la Transmission (Instruction publique, Enseignement supérieur, Culture)",
          "Numerus clausus ciblés à l'université ; fin de la discrimination positive dans les filières sélectives",
          "50 000 AESH (Public Sénat)",
          "Abrogation de la loi SRU ; logements sociaux interdits aux étrangers (Public Sénat) ; objectif « France de propriétaires »",
          "Prime de 10 000 € à la naissance pour les familles rurales (résidents depuis 2 ans)",
          "Allocations familiales universelles ; 60 000 places de crèche ; ministère de la Famille",
          "PMA sans père et transitions de mineurs remises en cause"
        ]
      },
      "Sécurité": {
        "resume": "« Immigration zéro » : ministère de la remigration, asile limité à une centaine de personnes par an, fin du regroupement familial et du droit du sol ; présomption de légitime défense pour les forces de l'ordre, 10 000 places de prison.",
        "mesures": [
          "Présomption de légitime défense pour policiers et gendarmes ; « défense excusable » pour les citoyens",
          "Force nationale anti-drogue",
          "Armement obligatoire des polices municipales",
          "Responsabilité pénale dès 13-15 ans pour crimes graves",
          "10 000 places de prison construites + 10 000 libérées par expulsion des détenus étrangers",
          "« Immigration zéro » ; ministère de la remigration",
          "Asile limité à une centaine de personnes par an, demandes déposées dans les consulats",
          "Fin du regroupement familial et du droit du sol ; naturalisation durcie (résidence de 5 à 10 ans)",
          "Suppression des aides sociales non contributives pour les étrangers extra-européens (20 Md€) et de l'AME (aide d'urgence conservée)",
          "Caution de 10 000 € pour un visa ; régularisation interdite",
          "Expulsion des délinquants étrangers et fichés S",
          "Fin de l'accord franco-algérien de 1968 ; retrait du Pacte de Marrakech",
          "Garde-frontières à statut militaire"
        ]
      }
    },
    "autres": [],
    "phares": [
      "Retraite à 64 ans d'ici 2030 (+1 trimestre/an dès 2023) et +1 an de cotisation",
      "Immigration zéro : fin du regroupement familial, du droit du sol, asile environ 100 personnes/an, ministère de la remigration",
      "Suppression des aides sociales non contributives aux extra-européens (20 Md€ d'économies annoncées)",
      "Équivalent 13e mois (baisse de CSG du SMIC à 2 000 €) et heures supplémentaires exonérées",
      "30 Md€ de baisse des impôts de production",
      "14 EPR2 d'ici 2050 et arrêt de l'éolien",
      "Référendum obligatoire pour traités européens et révisions constitutionnelles ; primauté du droit national",
      "Légitime défense présumée pour les forces de l'ordre ; 10 000 places de prison",
      "Franchise de succession de 200 000 € par enfant (95 % des familles exonérées)",
      "Fin du collège unique et grand ministère du Savoir et de la Transmission"
    ],
    "pdfs": [
      {
        "label": "Programme",
        "url": "https://xn--ambitionsant2022-mqb.fhf.fr/medias/ez-programme-2022-final6-compressed-623218e2a2ef4036050815.pdf"
      }
    ],
    "sources": [
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/presidentielle-2022-eric-zemmour-detaille-son-programme-et-assume-le-terme"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/emploi-retrouvez-les-principales-propositions-des-candidats-a-la-presidentielle"
      }
    ]
  },
  "Marine Tondelier": {
    "kind": "soutien",
    "programmeLabel": "Programme 2022 de Yannick Jadot (candidat EELV)",
    "note": "Programme de Yannick Jadot, candidat du pôle écologiste en 2022, et non de Marine Tondelier. Résumé établi à partir d'une analyse tierce (Les Économistes atterrés) et de la presse, faute d'accès au texte officiel ; l'immigration n'y est pas traitée.",
    "themes": {
      "Institutions": {
        "resume": "Peu détaillées dans la source : « nouvelle République écologique, sociale, démocratique, résiliente et laïque » et Organisation mondiale de l'environnement.",
        "mesures": [
          "Nouvelle République écologique, sociale, démocratique, résiliente et laïque",
          "Organisation mondiale de l'environnement"
        ]
      },
      "Économie": {
        "resume": "SMIC +10 % pour atteindre 1 500 € net, revenu citoyen dès 18 ans, 150 Md€ d'aides aux entreprises conditionnées à des critères écologiques, ISF « climatique », suppression de la flat tax, retour des impôts de production.",
        "mesures": [
          "SMIC +10 % pour atteindre 1 500 € net en fin de mandat",
          "Écarts de rémunération limités (revenus > 20 SMIC non déductibles de l'IS)",
          "Revenu citoyen dès 18 ans (RSA augmenté de 565 à 740 € selon cas, pour garantir le seuil de pauvreté ; coût > 20 Md€ non chiffré officiellement)",
          "150 Md€ d'aides aux entreprises conditionnées à des critères écologiques",
          "Fin des 18 Md€ de dépenses publiques néfastes à l'environnement",
          "Suppression de la réforme de l'assurance chômage",
          "Salariés à 50 % des conseils d'administration des grandes entreprises",
          "Convention citoyenne sur le temps de travail",
          "Rétablissement d'un ISF « climatique » (patrimoines > 2 M€, environ 15 Md€)",
          "Impôt sur le revenu à 13 tranches (+3 Md€)",
          "Suppression du quotient conjugal ; suppression de la flat tax (PFU)",
          "Droits de succession renforcés (> 200 000 €, +8 Md€)",
          "Rétablissement des impôts de production",
          "IS minimal de 25 % à l'échelle de l'UE",
          "TVA modulée (bio, réparable...)",
          "Pas de hausse de la taxe carbone intérieure, taxe carbone aux frontières"
        ]
      },
      "Écologie": {
        "resume": "Écocide et climat dans la Constitution, arrêt d'au moins 10 réacteurs nucléaires d'ici 2035 et sortie du nucléaire à terme, 12 000 éoliennes en 2027, fin de la vente de véhicules thermiques neufs en 2030, 10 Md€/an de rénovation thermique.",
        "mesures": [
          "Écocide et climat dans la Constitution",
          "Arrêt d'au moins 10 réacteurs nucléaires d'ici 2035 et sortie du nucléaire à terme (calendrier précis variable selon les sources)",
          "70 TWh d'éolien (12 000 éoliennes) en 2027, photovoltaïque sur 340 km², biométhane 32 TWh en 2030",
          "Nationalisation d'EDF et Engie",
          "Rénovation thermique 10 Md€/an",
          "Fin de la vente de véhicules thermiques neufs en 2030",
          "4 Md€/an pour les petites lignes ferroviaires",
          "Arrêt de grands projets (Lyon-Turin, Grand Paris Express, LGV...)",
          "Interdiction des vols de moins de 4 h en train",
          "Fonds vélo de 500 M€/an ; forfait mobilité de 1 000 €/an",
          "Pesticides et engrais de synthèse interdits dès 2025",
          "Zéro artificialisation ; 40 % d'aires protégées en 2030",
          "Gestion publique de l'eau avec premiers m3 gratuits"
        ]
      },
      "Europe": {
        "resume": "Europe fédérale (majorité qualifiée, assemblée constituante à moyen terme), fin du Pacte de stabilité, salaire minimum européen, moratoire sur les traités de libre-échange, Buy European Act, Europe de la défense.",
        "mesures": [
          "Europe fédérale (majorité qualifiée, assemblée constituante à moyen terme)",
          "Fin du Pacte de stabilité",
          "Salaire minimum européen",
          "Moratoire sur les traités de libre-échange",
          "Buy European Act",
          "Europe de la défense"
        ]
      },
      "Social": {
        "resume": "Pas de recul de l'âge légal au-delà de 62 ans, plan d'urgence hôpital (+100 000 infirmiers, +10 % de salaires), +65 000 enseignants, retour sur Parcoursup, budget des droits des femmes x5, +1 Md€ pour la culture.",
        "mesures": [
          "Pas de recul de l'âge légal au-delà de 62 ans ; départ anticipé pour métiers pénibles",
          "Minimum de retraite au niveau du seuil de pauvreté (Previssima : au niveau du SMIC ; chiffres divergents selon les sources)",
          "Plan d'urgence hôpital : reprise de 30 Md€ de dette, +100 000 infirmiers, +10 % de salaires, suppression du numerus clausus",
          "10 000 lits de santé mentale",
          "Légalisation encadrée du cannabis",
          "Reste à charge zéro ; santé environnementale",
          "3 Md€ pour le sport",
          "+65 000 enseignants, +10 000 enseignants-chercheurs",
          "6 000 médecins scolaires/infirmières/assistantes sociales",
          "100 000 places étudiantes ; recherche publique à 1 % du PIB",
          "Retour sur Parcoursup et réforme du bac",
          "Budget droits des femmes x5 ; 1 Md€ contre les violences",
          "+1 Md€ pour la culture",
          "Revalorisation de l'AAH ; politique de la ville"
        ]
      },
      "Sécurité": {
        "resume": "3 000 magistrats, 8 000 agents de tribunaux, 20 000 éducateurs pour la justice des mineurs, +1 Md€ pour la justice et police de proximité. L'immigration n'est pas traitée dans les sources consultées.",
        "mesures": [
          "3 000 magistrats, 8 000 agents de tribunaux",
          "20 000 éducateurs justice des mineurs",
          "+1 Md€ pour la justice",
          "Police de proximité"
        ]
      }
    },
    "autres": [
      "Chasse interdite le week-end et pendant les vacances scolaires"
    ],
    "phares": [
      "SMIC +10 % pour atteindre 1 500 € net",
      "Sortie progressive du nucléaire (au moins 10 réacteurs arrêtés d'ici 2035) et 12 000 éoliennes",
      "ISF « climatique » et suppression de la flat tax",
      "Revenu citoyen dès 18 ans",
      "Règle d'or climatique et écocide dans la Constitution",
      "10 Md€/an de rénovation thermique",
      "Plan d'urgence hôpital : +100 000 infirmiers, +10 % de salaires",
      "Fin de la vente de véhicules thermiques neufs en 2030",
      "Abrogation de la réforme de l'assurance chômage",
      "Pas de report de l'âge légal au-delà de 62 ans ; départ anticipé pour pénibilité"
    ],
    "pdfs": [
      {
        "label": "Jadot — programme des Écologistes",
        "url": "https://assets.nationbuilder.com/themes/6181b6eb4445ea720389b314/attachments/original/1648232746/programme_des_ecologistes.pdf?1648232746"
      }
    ],
    "sources": [
      {
        "label": "previssima.fr",
        "url": "https://www.previssima.fr/actualite/presidentielle-2022-le-programme-de-yannick-jadot-europe-ecologie-les-verts-en-matiere-de-protection-sociale-infographie.html"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/emploi-retrouvez-les-principales-propositions-des-candidats-a-la-presidentielle"
      },
      {
        "label": "atterres.org (PDF)",
        "url": "https://www.atterres.org/wp-content/uploads/2022/04/Programme-presidentiel-Yannick-Jadot.pdf"
      }
    ]
  },
  "Fabien Roussel": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 de Fabien Roussel (candidat PCF) : « La France des jours heureux »",
    "note": "Source : livre-programme de 180 propositions, dont la copie PDF est hébergée hors du site du parti et peut inclure des propositions du PCF au-delà de la campagne. Texte exploité par recherche ciblée ; la ligne sur l'immigration et le nombre exact de mesures sont à confirmer.",
    "themes": {
      "Institutions": {
        "resume": "Proportionnelle intégrale, parité garantie, nouvelle République (VIe) et nouveaux droits décisionnels pour les citoyens.",
        "mesures": [
          "Proportionnelle intégrale",
          "Parité garantie",
          "Nouvelle République (VIe)",
          "Nouveaux droits décisionnels pour les citoyens"
        ]
      },
      "Économie": {
        "resume": "Hausse des salaires (SMIC à 1 500 € net, fonction publique +30 %), 32 heures, sécurité d'emploi, contrôle des aides aux entreprises et nationalisations. Fiscalité : ISF renforcé, baisse des impôts indirects, disparition progressive de la CSG.",
        "mesures": [
          "SMIC à 1 500 € net (1 923 € brut)",
          "Salaires de la fonction publique +30 % et dégel du point d'indice",
          "Négociations tripartites pour une hausse générale des grilles de salaires",
          "Égalité salariale femmes-hommes en 1 an (loi)",
          "32 heures sans baisse de salaire",
          "Sécurité d'emploi et de formation",
          "Abrogation de la loi El Khomri, des ordonnances Travail et de la réforme de l'assurance chômage",
          "Statut des travailleurs de plateformes",
          "Contrôle des aides aux entreprises (CICE, niches, CIR supprimés)",
          "Pôle public bancaire et nationalisations (dont Sanofi)",
          "Droit de veto suspensif des salariés sur les licenciements",
          "Rétablissement de l'ISF, renforcé et plus progressif",
          "Baisse des impôts indirects : TVA sur l'énergie à 5,5 %, chèque énergie de 700 € minimum",
          "Disparition progressive de la CSG",
          "Lutte contre l'évasion fiscale, « serpent fiscal européen »",
          "Dotation jeunes agriculteurs doublée",
          "Consommations alimentaires locales"
        ]
      },
      "Écologie": {
        "resume": "Nucléaire de fission conservé avec 6 EPR supplémentaires, développement des renouvelables (surtout hydraulique), rénovation énergétique des logements et planification écologique démocratique.",
        "mesures": [
          "Nucléaire de fission conservé, avec 6 EPR supplémentaires",
          "Développement des renouvelables, surtout l'hydraulique",
          "10 Md€/an pour la rénovation énergétique des logements",
          "Planification écologique démocratique"
        ]
      },
      "Europe": {
        "resume": "Désobéissance aux règles d'austérité européennes, sortie de l'OTAN et signature du TIAN, fin des opérations extérieures, conférence européenne de sécurité collective incluant la Russie.",
        "mesures": [
          "Désobéissance aux règles européennes d'austérité",
          "Fin du plafond de 3 % de déficit",
          "« Europe à géométrie choisie »",
          "Sortie de l'OTAN (et du commandement intégré) et demande de sa dissolution",
          "Signature du TIAN",
          "Fin des opérations extérieures et fermeture des bases hors du pays",
          "Conférence européenne de sécurité collective jusqu'à la Russie",
          "Règlement diplomatique du conflit ukrainien",
          "Désarmement nucléaire mondial"
        ]
      },
      "Social": {
        "resume": "Retraite à 60 ans à taux plein, service public du grand âge, hôpital public renforcé, budget de l'Éducation nationale +45 %, revenu étudiant de 850 €/mois et droit au logement effectif.",
        "mesures": [
          "Retraite à 60 ans à taux plein (carrière de 18 à 60 ans, pension à 75 % du revenu net d'activité)",
          "Départs anticipés pour pénibilité",
          "Pension minimale de 1 200 € net",
          "Demi-part des veufs et veuves rétablie",
          "Budget et emplois pour l'hôpital public, financement intégral de la dette hospitalière",
          "Service public du grand âge : 300 000 emplois sur 3 ans dont 100 000 aides à domicile",
          "Ehpad privés sous tutelle",
          "Sécurité sociale gérée par les cotisants",
          "Pôle public du médicament et Conseil national du médicament",
          "Budget de l'Éducation nationale +45 % (80 Md€)",
          "Classes à 15 élèves maximum en petite section et maternelle, seuils réduits",
          "Gratuité des parcours éducatifs",
          "Salaires des enseignants +30 %",
          "32 heures au collège",
          "Logements Crous : de 175 000 à 525 000 en 5 ans",
          "Revenu étudiant de 850 €/mois",
          "Droit au logement effectif",
          "Foyers de jeunes travailleurs"
        ]
      },
      "Sécurité": {
        "resume": "Plan de sauvetage de la justice, alternatives à l'incarcération plutôt que nouvelles prisons, police de proximité ; sur l'immigration, respect de la Convention de Genève et du droit d'asile.",
        "mesures": [
          "Plan de sauvetage de la justice",
          "Alternatives à l'incarcération plutôt que de nouvelles prisons (pas de PPP)",
          "Police de proximité",
          "Moyens contre les trafics",
          "Respect de la Convention de Genève et du droit d'asile",
          "Dénonciation des accords du Touquet et de Dublin",
          "Redéfinition des missions de Frontex",
          "Moyens à l'Ofpra et à l'Ofii"
        ]
      }
    },
    "autres": [
      "Éducation populaire"
    ],
    "phares": [
      "SMIC à 1 500 € net ; fonction publique +30 %",
      "Retraite à 60 ans à taux plein ; pension minimale de 1 200 €",
      "Semaine de 32 heures sans baisse de salaire",
      "Rétablissement de l'ISF renforcé",
      "Revenu étudiant de 850 €/mois",
      "6 EPR supplémentaires et 10 Md€/an de rénovation énergétique",
      "Service public du grand âge : 300 000 emplois, Ehpad sous tutelle",
      "Sortie de l'OTAN, signature du TIAN",
      "Proportionnelle intégrale, nouvelle République",
      "Éducation +45 % (80 Md€), classes réduites"
    ],
    "pdfs": [
      {
        "label": "La France des jours heureux",
        "url": "https://xn--ambitionsant2022-mqb.fhf.fr/medias/exe-la-france-des-jours-heureux-livre-stc-compressed-6232177c5af32228446743.pdf"
      }
    ],
    "sources": [
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/presidentielle-fabien-roussel-presente-180-propositions-pour-une-france-des-jours-heureux"
      },
      {
        "label": "reporterre.net",
        "url": "https://reporterre.net/Le-communiste-Fabien-Roussel-presente-un-programme-fort-en-nucleaire"
      }
    ]
  },
  "Nicolas Dupont-Aignan": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 de Nicolas Dupont-Aignan (candidat Debout la France) : « Libérons-nous ! »",
    "note": "Source : profession de foi et presse ; le livret chiffré et le site de campagne n'ont pas pu être consultés. Certaines mesures (septennat, 40 000 places de prison, sécurité sociale unique) viennent de la presse et peuvent mêler des propositions de campagnes précédentes.",
    "themes": {
      "Institutions": {
        "resume": "RIC à 500 000 signatures, reconnaissance du vote blanc et casier vierge exigé des candidats ; septennat avec révocation à mi-mandat selon la presse.",
        "mesures": [
          "RIC (500 000 signatures)",
          "Reconnaissance du vote blanc",
          "Casier vierge exigé des candidats",
          "Septennat avec révocation à mi-mandat (presse)"
        ]
      },
      "Économie": {
        "resume": "Hausse des salaires de 8 % par baisse des cotisations, indexation sur l'inflation, IS divisé par 2 pour les bénéfices réinvestis en France et préférence nationale dans les marchés publics.",
        "mesures": [
          "Hausse des salaires de 8 % (un mois supplémentaire, via baisse des cotisations, dans la limite de 3 SMIC), financée par la lutte contre les gaspillages",
          "Indexation sur l'inflation des salaires des fonctionnaires",
          "Suppression de la TVA sur la taxe sur les carburants",
          "Heures supplémentaires exonérées",
          "IS divisé par 2 pour les bénéfices réinvestis en France",
          "75 % des marchés publics réservés aux fabrications françaises",
          "RSA contre une journée d'activité hebdomadaire",
          "Zéro droit de succession sur la résidence principale",
          "Prêt à taux zéro pour l'accession",
          "Renationalisation des autoroutes et suppression des péages en 5 ans"
        ]
      },
      "Écologie": {
        "resume": "Aucune nouvelle éolienne, nucléaire maintenu à au moins 70 % de l'électricité avec réacteurs de 4e génération et thorium, plan zéro déchet plastique et renouvellement de 10 millions de véhicules.",
        "mesures": [
          "Aucune nouvelle éolienne",
          "Nucléaire maintenu à au moins 70 % de la production électrique",
          "Réacteurs de 4e génération et thorium",
          "Plan 0 déchet plastique sur 10 ans",
          "Bonus pour véhicules < 3 L/100 km",
          "Remplacement de 10 millions de véhicules en 10 ans",
          "Lutte contre l'artificialisation"
        ]
      },
      "Europe": {
        "resume": "Référendum pour remplacer l'UE par une « Communauté des Nations libres », supériorité du droit français, sortie du commandement intégré de l'OTAN et +40 000 soldats.",
        "mesures": [
          "Référendum pour remplacer l'UE par une « Communauté des Nations libres » avec projets à la carte",
          "Supériorité du droit français",
          "Renégociation des traités de libre-échange",
          "Sortie du commandement intégré de l'OTAN",
          "+40 000 soldats",
          "Soutien à la francophonie"
        ]
      },
      "Social": {
        "resume": "Indexation des retraites sur l'inflation, un hôpital ou une maternité par département, école exigeante, 250 000 places de crèche et allocations familiales dès le premier enfant.",
        "mesures": [
          "Retraites indexées sur l'inflation",
          "Suppression définitive du passe sanitaire et réintégration des soignants exclus",
          "Un hôpital ou une maternité par département (20 000 lits)",
          "Doublement des médecins et infirmières scolaires",
          "Sécurité sociale unique, consultation à 35 € et fin du tiers payant généralisé (presse, à vérifier)",
          "+25 % d'encadrement en Ehpad",
          "École exigeante (lire, écrire, compter, histoire)",
          "Mieux payer les chercheurs",
          "Service national civil mixte de 3 mois",
          "250 000 places de crèche en 5 ans",
          "Allocations familiales dès le premier enfant",
          "AAH revalorisée et déconjugalisée"
        ]
      },
      "Sécurité": {
        "resume": "Peines planchers, 40 000 places de prison selon la presse, peine réellement appliquée ; expulsion des clandestins et délinquants étrangers, fin du droit du sol.",
        "mesures": [
          "Peines planchers pour récidivistes",
          "40 000 places de prison (presse)",
          "Condamnation et peine réellement appliquée à chaque délit",
          "Violences faites aux femmes : réponse pénale en 72 h",
          "Suppression du permis à points",
          "Expulsion des clandestins et des délinquants étrangers",
          "5 ans de travail avant les aides sociales",
          "Suppression du droit du sol",
          "Expulsion des fichés S",
          "Interdiction du financement étranger des mosquées"
        ]
      }
    },
    "autres": [
      "Plan d'urgence Outre-mer (billets d'avion divisés par 2)",
      "Haut débit et résorption des zones blanches",
      "Gratuité des musées le dimanche",
      "Refuges pour animaux"
    ],
    "phares": [
      "Référendum pour remplacer l'UE par une Communauté des Nations libres ; primauté du droit français",
      "Hausse des salaires de 8 % (un mois de plus)",
      "RIC à 500 000 signatures, vote blanc reconnu",
      "Expulsion des clandestins et délinquants étrangers ; fin du droit du sol",
      "Division par 2 de l'IS sur les bénéfices réinvestis en France ; 75 % des marchés publics en produits français",
      "Renationalisation des autoroutes, fin des péages en 5 ans",
      "Un hôpital ou une maternité par département (20 000 lits)",
      "Peines planchers et 40 000 places de prison",
      "+40 000 soldats ; sortie du commandement intégré de l'OTAN",
      "250 000 places de crèche ; zéro droit de succession sur la résidence principale"
    ],
    "pdfs": [
      {
        "label": "Profession de foi",
        "url": "https://www.macommune.info/wp-content/uploads/2022/04/candidat-02-nicolas-dupont-aignan-declaration-accessible.pdf"
      }
    ],
    "sources": [
      {
        "label": "lyoncapitale.fr",
        "url": "https://www.lyoncapitale.fr/?p=283088"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/emploi-retrouvez-les-principales-propositions-des-candidats-a-la-presidentielle"
      }
    ]
  },
  "Nathalie Arthaud": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 de Nathalie Arthaud (candidate Lutte ouvrière)",
    "note": "Source : réponses officielles de la candidate, brochure comparative et presse ; le document programmatique complet n'a pas pu être lu. Les passages sur l'immigration, l'UE, le logement et la police sont partiels ; le plancher de 2 000 € net est cité de façon concordante, une autre source évoque 1 800 €.",
    "themes": {
      "Institutions": {
        "resume": "Contrôle des travailleurs et de la population ; programme révolutionnaire de renversement du capitalisme, sans réforme institutionnelle précise relevée.",
        "mesures": [
          "Contrôle des travailleurs et de la population sur les comptes des entreprises et des banques"
        ]
      },
      "Économie": {
        "resume": "Aucun revenu sous 2 000 € net, +300 € pour tous, interdiction des licenciements et partage du travail, contrôle sur les entreprises ; suppression de la TVA, fiscalité reposant sur les profits du capital.",
        "mesures": [
          "Aucun salaire, pension ou allocation en dessous de 2 000 € net",
          "Augmentation de 300 € de tous les salaires",
          "Indexation sur le coût de la vie",
          "Interdiction des licenciements et répartition du travail entre tous sans baisse de salaire",
          "Expropriation des grandes fortunes et du grand patronat",
          "Abolition du secret bancaire",
          "Fin des aides au patronat",
          "Suppression de la TVA (~120 Md€ en 2020 sur ~230 Md€ de recettes nettes)",
          "Fiscalité reposant exclusivement sur les profits du capital et la classe riche"
        ]
      },
      "Écologie": {
        "resume": "Politique « concertée et planifiée à l'échelle de la planète » en retirant aux groupes privés la direction de l'industrie et des transports ; nucléaire : le problème est le capitalisme, pas la filière.",
        "mesures": [
          "Politique écologique concertée et planifiée à l'échelle de la planète",
          "Retirer aux groupes privés la direction de l'industrie et des transports",
          "Nucléaire : refus de poser la question en « sortir ou non », le problème étant le capitalisme et le profit"
        ]
      },
      "Europe": {
        "resume": "Opposition à l'UE du capital, défense d'une « Europe des travailleurs » ; rejet du protectionnisme comme du libre-échange.",
        "mesures": [
          "Opposition à l'UE du capital, défense d'une « Europe des travailleurs »",
          "Rejet du protectionnisme comme du libre-échange"
        ]
      },
      "Social": {
        "resume": "Retraite à 60 ans et minimum de 2 000 € net, embauches massives dans la santé et l'école, service public de la dépendance et de la petite enfance, droit au logement.",
        "mesures": [
          "Retour de l'âge légal de la retraite à 60 ans",
          "Minimum de 2 000 € net pour toutes les retraites",
          "Augmentation des dépenses de santé, réouverture d'établissements, embauches massives",
          "Prise en charge collective de la perte d'autonomie, service public de la dépendance",
          "Embauches massives dans l'éducation (enseignants titulaires, surveillants, personnels d'entretien, assistants sociaux, infirmières)",
          "Bourses étudiantes accrues",
          "Service public de la petite enfance",
          "Droit au logement, arrêt des expulsions locatives (sources secondaires)"
        ]
      },
      "Sécurité": {
        "resume": "Pas de programme répressif détaillé dans les sources lues ; défense de l'unité des travailleurs français et immigrés, avec ou sans papiers, et droit de vote des étrangers.",
        "mesures": [
          "Défense de l'unité des travailleurs français et immigrés, avec ou sans papiers",
          "Droit de vote des étrangers (presse)"
        ]
      }
    },
    "autres": [
      "Dépénalisation du cannabis (pas légalisation)",
      "Interdiction de la chasse à courre"
    ],
    "phares": [
      "Aucun revenu en dessous de 2 000 € net et +300 € pour tous",
      "Indexation des salaires, pensions et allocations sur les prix",
      "Interdiction des licenciements et partage du travail sans baisse de salaire",
      "Retraite à 60 ans",
      "Embauches massives dans les services publics (école, hôpital, petite enfance)",
      "Suppression de la TVA, fiscalité sur les profits",
      "Contrôle des travailleurs sur les comptes des entreprises et des banques ; fin du secret bancaire",
      "Expropriation des grandes fortunes et des grands groupes",
      "Droit de vote et égalité pour les travailleurs immigrés",
      "Dépénalisation du cannabis"
    ],
    "pdfs": [
      {
        "label": "Comparatif des programmes 2022 (SNES), pas le programme officiel",
        "url": "https://lille.snes.edu/IMG/pdf/brochure_programmes_candidats_presidentielles_2022_web.pdf"
      }
    ],
    "sources": [
      {
        "label": "lutte-ouvriere.org",
        "url": "https://www.lutte-ouvriere.org/portail/qui-sommes-nous/qui-sommes-nous-nos-idees-et-positions-politiques-quelques-reponses-des-questions-posees-nathalie-arthaud"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/emploi-retrouvez-les-principales-propositions-des-candidats-a-la-presidentielle"
      },
      {
        "label": "lyoncapitale.fr",
        "url": "https://www.lyoncapitale.fr/?p=283031"
      },
      {
        "label": "lutte-ouvriere.org (PDF)",
        "url": "https://www.lutte-ouvriere.org/medias/presentation/fichiers/2022/03/Supprimer-la-TVA.pdf"
      },
      {
        "label": "lutte-ouvriere.org (PDF)",
        "url": "https://www.lutte-ouvriere.org/medias/presentation/fichiers/2022/03/Reseau-sortir-du-nucleaire.pdf"
      },
      {
        "label": "lutte-ouvriere.org (PDF)",
        "url": "https://www.lutte-ouvriere.org/medias/presentation/fichiers/2022/03/Drogue-et-societe.pdf"
      }
    ]
  },
  "François Asselineau": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 de François Asselineau (UPR) : 27 engagements",
    "note": "Candidature 2022 non aboutie (parrainages insuffisants) ; le programme est celui du parti, porté personnellement par Asselineau. Le programme 2027 de l'UPR est en cours d'élaboration et pourrait évoluer. L'âge de la retraite n'est pas précisé.",
    "themes": {
      "Institutions": {
        "resume": "RIC, référendum obligatoire pour toute révision constitutionnelle, réduction du nombre de parlementaires, septennat et Cour constitutionnelle.",
        "mesures": [
          "RIC",
          "Référendum obligatoire pour toute révision constitutionnelle",
          "Députés de 577 à 500, sénateurs de 348 à environ 100",
          "Septennat, mandat des députés de 4 ans",
          "Proportionnelle partielle",
          "Cour constitutionnelle remplaçant le Conseil constitutionnel",
          "Machines à voter interdites"
        ]
      },
      "Économie": {
        "resume": "SMIC brut +24 % sur le quinquennat, charges patronales -50 % pour les PME, objectif -1 million de chômeurs, contrôle des changes ; baisse de la TVA sur produits courants et nouvelles tranches d'IR.",
        "mesures": [
          "SMIC brut +24 % sur le quinquennat (~4,4 %/an)",
          "Salaires des fonctionnaires de terrain revalorisés",
          "Charges patronales -50 % pour les PME (< 50 M€ de CA)",
          "Suppression du CICE pour les grandes entreprises (10 Md€)",
          "Objectif -1 million de chômeurs de catégorie A en 3 ans",
          "Fin des allocations après 2 refus d'offre",
          "Contrôle des changes et des capitaux",
          "Solde commercial positif en 3 ans",
          "Économies > 27 Md€/an (12 Md€ liés à la sortie de l'UE, 5 Md€ par suppression des conseils régionaux)",
          "Baisse de la TVA sur produits courants, fin de la double taxation des carburants, TVA relevée sur le grand luxe",
          "Deux tranches d'IR au-delà de 250 000 et 500 000 €",
          "Impôt de solidarité sur les très grandes fortunes enrichies pendant la Covid",
          "Taxe sur les transactions financières étendue",
          "Droits de succession -5 points sous 300 000 €",
          "Annulation de la hausse de la CSG",
          "Lutte contre la fraude fiscale (60-80 Md€/an) et sociale",
          "Renationalisation des autoroutes",
          "Taxation des GAFAM"
        ]
      },
      "Écologie": {
        "resume": "Relocalisation industrielle, 70 % du fret par le rail sur les axes prioritaires, renationalisation d'EDF, du gaz et de l'eau, glyphosate interdit ; pas de position chiffrée sur le nucléaire civil.",
        "mesures": [
          "Relocalisation industrielle",
          "70 % du fret par le rail sur les axes prioritaires",
          "Interdiction de fermer les petites lignes",
          "Écotaxe sur poids lourds étrangers",
          "Glyphosate interdit",
          "Élevage en batterie interdit",
          "Renationalisation d'EDF (abandon d'Hercule), du gaz et de l'eau",
          "Fusion nucléaire en recherche",
          "Renationalisation de la SNCF et de la RATP"
        ]
      },
      "Europe": {
        "resume": "Sortie de l'UE (Frexit), de l'euro et de l'OTAN en gardant l'arme nucléaire et le siège à l'ONU ; défense à 3 % du PIB, dénonciation du CETA et fin de la PAC.",
        "mesures": [
          "Sortie de l'UE (Frexit), de l'euro et de l'OTAN",
          "Conservation de l'arme nucléaire et du siège permanent à l'ONU, inscrit incessible dans la Constitution",
          "Statut d'observateur aux BRICS",
          "Parlement de la Francophonie",
          "Rupture avec la « Françafrique »",
          "Défense à 3 % du PIB",
          "Dénonciation du CETA, arrêt du TAFTA",
          "Fin de la PAC remplacée par une politique agricole nationale"
        ]
      },
      "Social": {
        "resume": "Régime de retraite par répartition inscrit dans la Constitution, 30 000 lits d'hôpital rouverts, 80 000 logements supplémentaires par an et allocations familiales dès le premier enfant.",
        "mesures": [
          "Régime par répartition inscrit dans la Constitution",
          "Pensions revalorisées au moins au niveau de l'inflation, arrêt des réformes",
          "30 000 lits rouverts (265 000 en fin de quinquennat dont 25 000 en réanimation)",
          "Budget de l'hôpital +15 % dès le premier budget",
          "Moratoire sur les fermetures d'hôpitaux et de maternités",
          "Pôle public pharmaceutique, autosuffisance en médicaments en 10 ans",
          "Majoration de 20 % des actes dans les déserts médicaux",
          "Suppression du passe sanitaire et vaccinal",
          "Cadre national du bac, retour de la notation et du classement",
          "80 % du temps du primaire sur les fondamentaux",
          "Portable interdit en cours, stages artisanat dès la 4e",
          "Recherche +50 %",
          "Cours universitaires en français",
          "Bourses +25 %",
          "80 000 logements supplémentaires par an (400 000 en 5 ans)",
          "Expulsion des squatteurs accélérée",
          "Allocations familiales dès le 1er enfant",
          "150 000 places de crèche",
          "AAH +20 %",
          "Outre-mer : 15 Md€"
        ]
      },
      "Sécurité": {
        "resume": "Budgets de la police et de la justice +20 %, peines planchers, perpétuité incompressible pour le terrorisme ; sortie de Schengen et référendum sur le regroupement familial et le droit du sol.",
        "mesures": [
          "Budgets justice et police +20 %",
          "Police de proximité",
          "Peines planchers",
          "Prison dès la première atteinte violente",
          "Perpétuité incompressible pour crimes terroristes",
          "Déchéance de nationalité pour combattants à l'étranger",
          "Travail obligatoire en prison",
          "Sortie de Schengen et contrôles à toutes les frontières",
          "Exécution des OQTF à 75 %",
          "Dénonciation du Pacte de Marrakech",
          "Retrait de certains articles de la CEDH",
          "Référendum avant fin 2022 sur le regroupement familial et le droit du sol",
          "Naturalisation conditionnée à l'assimilation"
        ]
      }
    },
    "autres": [
      "Renationalisation de La Poste",
      "Engagement de remise en jeu du mandat si moins de 14 des 27 engagements sont tenus à mi-mandat",
      "Limites constitutionnelles aux confinements"
    ],
    "phares": [
      "Frexit : sortie de l'UE, de l'euro et de l'OTAN (« triple libération »)",
      "SMIC brut +24 % sur le quinquennat",
      "Renationalisation d'EDF, gaz, eau, autoroutes, SNCF, RATP, La Poste",
      "Charges patronales -50 % pour les PME",
      "30 000 lits d'hôpital rouverts et budget hospitalier +15 %",
      "Sortie de Schengen, contrôles aux frontières, référendum sur regroupement familial et droit du sol",
      "RIC et réduction du nombre de parlementaires ; septennat",
      "Budgets de la police et de la justice +20 %, peines planchers",
      "Suppression du passe sanitaire et vaccinal ; limites constitutionnelles aux confinements",
      "Défense à 3 % du PIB ; retrait de l'OTAN"
    ],
    "pdfs": [
      {
        "label": "Programme UPR 2022",
        "url": "https://upr.fr/post-img/uploads/2022/10/20220215_Programme-presi-leg-2022.pdf"
      }
    ],
    "sources": [
      {
        "label": "upr.fr",
        "url": "https://upr.fr/notre-programme/programme-2022"
      },
      {
        "label": "upr.fr",
        "url": "https://upr.fr/actualites/programme-presidentiel-2022/"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/la-majorite-des-gens-de-l-upr-viennent-de-la-gauche-selon-le-directeur-de-campagne"
      }
    ]
  },
  "Delphine Batho": {
    "kind": "partiel",
    "programmeLabel": "Orientations de Delphine Batho (primaire écologiste 2021)",
    "note": "Il n'existe pas de programme 2022 rédigé et chiffré de Delphine Batho : elle a été éliminée à la primaire écologiste de 2021 et n'a pas figuré sur le bulletin. Les éléments ci-dessous sont des orientations de la primaire, reconstituées à partir de la presse ; aucun chiffre n'a été trouvé.",
    "themes": {
      "Institutions": {
        "resume": "Séparation des lobbies et de l'État, rupture avec le présidentialisme (régime parlementaire), assemblées citoyennes et conseil scientifique indépendant ; laïcité stricte.",
        "mesures": [
          "Loi de séparation des lobbies et de l'État",
          "Rupture avec le présidentialisme : régime parlementaire, référendum pour mettre fin à l'élection directe du président",
          "Assemblées citoyennes",
          "Conseil scientifique indépendant pour évaluer les mesures",
          "Laïcité stricte"
        ]
      },
      "Économie": {
        "resume": "Décroissance assumée, économie du « bien-être », circuits courts, économie circulaire et relocalisation, financées par la réorientation des subventions PAC et fossiles ; aucun chiffre trouvé.",
        "mesures": [
          "Décroissance assumée (« seul projet politique réellement alternatif »)",
          "Économie du « bien-être », circuits courts, économie circulaire, relocalisation",
          "Réorienter les subventions PAC et fossiles vers cette économie",
          "Décisions fondées sur le bien-être humain, le climat et le vivant plutôt que sur les bilans comptables"
        ]
      },
      "Écologie": {
        "resume": "Priorité absolue à la décroissance énergétique, sortie progressive du nucléaire, arrêt du projet de six EPR, interdiction des pesticides et adaptation climatique.",
        "mesures": [
          "Décroissance énergétique prioritaire (baisse de la consommation)",
          "Sortie progressive du nucléaire",
          "Arrêt du projet de six EPR",
          "Interdiction des pesticides, par décret dès la prise de fonction (France 24)",
          "Adaptation climatique"
        ]
      },
      "Europe": {
        "resume": "",
        "mesures": []
      },
      "Social": {
        "resume": "Éducation populaire écologique de 7 à 87 ans ; autres thèmes sociaux non documentés.",
        "mesures": [
          "Éducation populaire écologique de 7 à 87 ans"
        ]
      },
      "Sécurité": {
        "resume": "Se présente comme une « écologie républicaine, régalienne » ; pas de mesure détaillée trouvée hormis la prévention des féminicides.",
        "mesures": [
          "Politique pénale et de prévention des féminicides et des violences sexistes"
        ]
      }
    },
    "autres": [],
    "phares": [
      "Décroissance énergétique prioritaire",
      "Sortie progressive du nucléaire",
      "Arrêt des six EPR",
      "Interdiction des pesticides",
      "Loi de séparation des lobbies et de l'État",
      "Fin du présidentialisme (régime parlementaire)",
      "Éducation populaire écologique (7-87 ans)",
      "Politique pénale et de prévention des féminicides",
      "Relocalisation et économie circulaire financées par réorientation des subventions PAC et fossiles"
    ],
    "pdfs": [],
    "sources": [
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/primaire-ecologiste-quels-sont-les-programmes-des-candidats-190437"
      },
      {
        "label": "webdoc.france24.com",
        "url": "https://webdoc.france24.com/primaire-ecologiste-propositions-jadot-piolle-rousseau-batho-governatori/"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/ecologie-candidats-soutiens"
      },
      {
        "label": "reporterre.net",
        "url": "https://reporterre.net/Delphine-Batho-La-decroissance-est-le-seul-projet-politique-reellement-alternatif"
      },
      {
        "label": "fr.wikipedia.org",
        "url": "https://fr.wikipedia.org/wiki/Delphine_Batho"
      }
    ]
  },
  "Xavier Bertrand": {
    "kind": "partiel",
    "programmeLabel": "Propositions de Xavier Bertrand au congrès LR de 2021 (primaire de la droite)",
    "note": "Pas de programme 2022 rédigé : il a été éliminé au congrès LR de décembre 2021 (4e) puis a appelé à voter Pécresse, dont le programme n'est pas repris ici. Synthèse reconstituée à partir de la presse ; chiffres parfois divergents (33 ou 35 Md€ d'impôts de production).",
    "themes": {
      "Institutions": {
        "resume": "« République des territoires » : les élus locaux décident en matière d'emploi, de social et d'écologie, hors sécurité, justice, immigration, terrorisme, éducation et santé ; un seul mandat présidentiel.",
        "mesures": [
          "« République des territoires » : décentralisation, élus locaux décideurs en emploi, social et écologie (hors sécurité, justice, immigration, terrorisme, éducation, santé)",
          "Un seul mandat présidentiel"
        ]
      },
      "Économie": {
        "resume": "« Prime au travail » garantissant 1 500 € nets minimum, heures supplémentaires défiscalisées, baisse de moitié des impôts de production et baisse de la dépense publique.",
        "mesures": [
          "« Prime au travail » : au moins 1 500 € nets par mois pour tout salarié à temps complet",
          "Développer l'intéressement et la participation",
          "Heures au-delà de 35 h majorées et exonérées d'impôts et de charges",
          "Possibilité de passer à 39 h par accord d'entreprise ou référendum (une seule source)",
          "Baisse de moitié des impôts de production (33 à 35 Md€ selon les sources), financée par la dépense publique",
          "Hausse de la fiscalité sur les GAFAM",
          "Baisse de la dépense publique",
          "Durcissement de l'assurance chômage",
          "Temps de travail des fonctionnaires relevé au-delà de 35 h pour réduire les effectifs"
        ]
      },
      "Écologie": {
        "resume": "Dix nouveaux réacteurs nucléaires, moratoire sur l'éolien et investissements lourds dans les infrastructures de transport.",
        "mesures": [
          "Dix nouveaux réacteurs nucléaires",
          "Moratoire sur l'éolien (une seule source)",
          "Investissements lourds dans les infrastructures de transport (routes, TGV, trains locaux, fret)"
        ]
      },
      "Europe": {
        "resume": "",
        "mesures": []
      },
      "Social": {
        "resume": "Âge légal de la retraite relevé progressivement jusqu'à 64 ans en 2030, avec exception pour les métiers pénibles ; pause dans les réformes sociales.",
        "mesures": [
          "Âge légal relevé progressivement jusqu'à 64 ans en 2030",
          "Exception pour les métiers pénibles (propos de 2021 rapportés)",
          "Pause dans les réformes sociales"
        ]
      },
      "Sécurité": {
        "resume": "Hausse des budgets sécurité et justice, peines planchers, quotas d'immigration fixés par le Parlement après référendum, « passeport républicain » et expulsion des étrangers condamnés.",
        "mesures": [
          "Hausse des budgets de la sécurité et de la justice",
          "Majorité pénale à 15 ans",
          "Peines planchers",
          "Période de sûreté de 50 ans pour les terroristes",
          "Des procureurs pourraient remplacer des juges pour les délits jusqu'à 5 ans de prison",
          "Révision de la Constitution par référendum (automne 2022) pour que le Parlement fixe des quotas annuels d'immigration",
          "Réduire en priorité l'immigration familiale avec un « passeport républicain » (français, laïcité, égalité)",
          "Fin du système actuel de régularisation",
          "Expulsion des étrangers condamnés à la fin de leur peine",
          "Loi d'urgence pour sécuriser les expulsions",
          "« Triple frontière » : alliance méditerranéenne, visas conditionnés à la coopération"
        ]
      }
    },
    "autres": [],
    "phares": [
      "Prime au travail : 1 500 € nets minimum pour un temps plein",
      "Heures supplémentaires sans impôts ni charges",
      "Baisse des impôts de production (33-35 Md€)",
      "Retraite à 64 ans en 2030",
      "Référendum sur des quotas d'immigration fixés par le Parlement",
      "Passeport républicain et réduction de l'immigration familiale",
      "Dix nouveaux réacteurs nucléaires",
      "Majorité pénale à 15 ans, peines planchers, 50 ans de sûreté pour terrorisme",
      "République des territoires",
      "Un seul mandat"
    ],
    "pdfs": [],
    "sources": [
      {
        "label": "webdoc.france24.com",
        "url": "https://webdoc.france24.com/primaire-lr-programmes-barnier-bertrand-ciotti-juvin-pecresse/"
      },
      {
        "label": "lejdd.fr",
        "url": "https://www.lejdd.fr/Politique/presidentielle-bertrand-pecresse-barnier-ciotti-juvin-ce-quil-faut-savoir-des-candidats-au-congres-lr-4078641"
      },
      {
        "label": "france24.com",
        "url": "https://www.france24.com/fr/info-en-continu/20211104-bertrand-veut-reprendre-le-contr%C3%B4le-de-l-immigration"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/presidentielle-derniere-ligne-droite-pour-les-cinq-candidats-a-l-investiture-lr"
      },
      {
        "label": "fr.wikipedia.org",
        "url": "https://fr.wikipedia.org/wiki/Xavier_Bertrand"
      }
    ]
  },
  "Karim Bouamrane": {
    "kind": "parti",
    "programmeLabel": "Programme 2022 d'Anne Hidalgo (candidate PS) : « Mes 70 propositions pour la France »",
    "note": "Programme d'Anne Hidalgo, candidate du PS en 2022, et non de Karim Bouamrane, qui n'était pas candidat. La source est une copie miroir du programme officiel ; la ligne du PS pour 2027 peut avoir changé.",
    "themes": {
      "Institutions": {
        "resume": "RIP à 1 million de signatures et création d'un RIC, vote à 16 ans, dose de proportionnelle, fin du 49.3 sauf lois budgétaires, Premier ministre chef de la majorité et décentralisation « acte III ».",
        "mesures": [
          "RIP à 1 million de signatures, création d'un RIC",
          "Vote à 16 ans",
          "Vote des étrangers aux élections locales",
          "Dose de proportionnelle (mode mixte « allemand »), législatives avant la présidentielle",
          "Fin du 49.3 sauf lois budgétaires",
          "Suppression de l'article 16",
          "Premier ministre chef de la majorité",
          "Décentralisation « acte III », permis de faire",
          "Service public de proximité dans chaque commune",
          "Indépendance du parquet",
          "Autorité indépendante de contrôle des forces de l'ordre"
        ]
      },
      "Économie": {
        "resume": "SMIC +15 %, écart de rémunération de 1 à 20, réindustrialisation (3 Md€), ISF Climat et Biodiversité et budget de 50 Md€ de dépenses et de ressources par an.",
        "mesures": [
          "SMIC +15 % dès l'arrivée au pouvoir (environ +200 € nets/mois)",
          "Conférence sur les salaires et renégociation des grilles de conventions collectives",
          "Écart maximal de 1 à 20 entre la plus basse et la plus haute rémunération en entreprise (au-delà, non déductible de l'IS)",
          "Bonus/malus de cotisations patronales selon la part consacrée aux salaires",
          "Égalité salariale femmes-hommes (inversion de la charge de la preuve)",
          "Présomption de salariat pour les plateformes",
          "Abrogation de la réforme de l'assurance chômage, assurance chômage universelle",
          "Congé paternité à 16 semaines (6 obligatoires)",
          "50 % d'administrateurs salariés (entreprises > 1 000 salariés), 33 % en dessous",
          "Réindustrialisation : fonds de 3 Md€, quatre « odyssées » (santé, énergie, mobilité, numérique)",
          "R&D à 3 % du PIB",
          "Aides publiques conditionnées à des critères sociaux et environnementaux",
          "Économie sociale et solidaire : ministre dédié",
          "ISF Climat et Biodiversité (5 Md€/an) avec règle d'or climatique (50 % transition, 50 % mesures sociales)",
          "Surtaxe des placements fossiles",
          "Hausse de l'impôt sur les successions au-delà de 2 M€ (8 Md€/an) et baisse pour 95 % des Français",
          "Fiscalité des multinationales (6 Md€)",
          "Lutte contre la fraude (6 Md€)",
          "TVA réduite sur gaz, électricité, train, réemploi, recyclage, bio",
          "Budget : 50 Md€ de dépenses et de ressources par an (dont 10 Md€ de croissance additionnelle, 10 Md€ de dépenses néfastes à l'environnement supprimées, 5 Md€ de fonds européens réorientés)",
          "30 % de bio dans la SAU en 2030"
        ]
      },
      "Écologie": {
        "resume": "Droits de la nature dans la Constitution, ministre du Climat n° 2 du gouvernement, 100 % renouvelables, pas de nouveaux EPR, rénovation de 760 000 logements par an et doublement du fret ferroviaire.",
        "mesures": [
          "Droits de la nature dans la Constitution, Défenseur de l'environnement, crime d'écocide",
          "Numéro deux du gouvernement : ministre du Climat, de la Biodiversité et de l'Économie",
          "Budget Climat voté chaque année",
          "100 % renouvelables aussi vite que possible",
          "Pas de nouveaux EPR ni petits réacteurs",
          "Nucléaire comme énergie de transition, prolongation possible des centrales existantes",
          "Rénovation de 760 000 logements par an sans avance de frais",
          "Leasing social de véhicules électriques, 1 million de bornes",
          "Doublement du fret ferroviaire d'ici 2030",
          "Interdiction des néonicotinoïdes en 100 jours",
          "Baisse de 50 % des émissions industrielles d'ici 2035 (par rapport à 2015)"
        ]
      },
      "Europe": {
        "resume": "L'Europe comme instrument de souveraineté : pacte de progrès à la place du pacte de stabilité, ressources propres, salaire minimum européen et conditionnement des accords commerciaux.",
        "mesures": [
          "Remplacer le pacte de stabilité par un pacte de progrès",
          "Ressources propres européennes (taxe sur les transactions financières, GAFAM, carbone aux frontières)",
          "Agenda social européen (salaire minimum)",
          "Conditionner les accords commerciaux",
          "Sommet « Paris+10 » en 2025",
          "Levée temporaire des brevets sur les vaccins",
          "Moyens du Quai d'Orsay",
          "Loi de programmation militaire révisée à la hausse"
        ]
      },
      "Social": {
        "resume": "Âge légal maintenu à 62 ans, minimum vieillesse à 1 000 €, plan de formation de soignants, enseignants payés comme des cadres, 150 000 logements sociaux par an, minimum jeunesse et dotation de 5 000 € à 18 ans.",
        "mesures": [
          "Âge légal maintenu et plafonné à 62 ans",
          "Minimum vieillesse net de 1 000 €",
          "Minimum contributif de 1 200 €",
          "Rétablissement des 4 critères de pénibilité supprimés",
          "Chaque heure travaillée ouvre des cotisations",
          "Fin de l'ONDAM, remplacé par des Objectifs nationaux de santé publique",
          "Réforme de la tarification à l'acte pour l'hôpital",
          "Formation de jusqu'à 15 000 médecins/an, 25 000 infirmiers et aides-soignants, 1 250 sages-femmes",
          "Année de médecin-assistant en zone désertique (4 000 à 8 000 médecins)",
          "Plan maladies chroniques, santé mentale grande cause",
          "Burn-out reconnu maladie professionnelle, CHSCT rétablis",
          "Réforme du grand âge (APA revalorisée, guichet unique, plan de recrutement)",
          "Loi sur la fin de vie (aide active à mourir)",
          "Conférence de consensus sur la légalisation du cannabis",
          "Salaires des enseignants alignés progressivement sur ceux des cadres",
          "Formation initiale complète, états généraux de la pédagogie",
          "Plan mixité contre les « collèges-ghettos »",
          "Suppression de Parcoursup",
          "60 % de diplômés du supérieur par classe d'âge",
          "Alternance généralisée",
          "Lutte contre le harcèlement",
          "Éducation artistique (10 000 artistes à l'école dès 2023)",
          "150 000 logements sociaux par an (dont un tiers très sociaux)",
          "Encadrement des loyers en zones tendues",
          "Allocation logement complémentaire (aucun ménage au-delà de 1/3 de ses revenus)",
          "SRU à 25 %",
          "Minimum jeunesse dès 18 ans",
          "Dotation de 5 000 € à 18 ans",
          "Crèches de 470 000 à 600 000 places en 10 ans, droit opposable à un mode d'accueil",
          "Ministère des Droits des femmes, plus d'1 Md€ contre les violences faites aux femmes"
        ]
      },
      "Sécurité": {
        "resume": "Recrutements de policiers et gendarmes selon les besoins locaux, loi de programmation pour la justice, peines alternatives et encellulement individuel ; accueil digne des demandeurs d'asile.",
        "mesures": [
          "Recrutements de policiers et gendarmes selon les besoins locaux, allègement de la procédure pénale",
          "Renforcement du renseignement",
          "Loi de programmation pour la justice (magistrats, greffiers)",
          "Peines alternatives, plan de construction carcérale et encellulement individuel",
          "Observatoire contre les discriminations",
          "Accueil digne des demandeurs d'asile, répartition équilibrée, délais maîtrisés",
          "Réforme de Dublin fondée sur la solidarité",
          "Lutte contre l'immigration clandestine",
          "Intégration : accès au travail dès la demande d'asile, cours de français gratuits"
        ]
      }
    },
    "autres": [
      "Lutte contre la concentration des médias",
      "Soutien à l'audiovisuel public",
      "Outre-mer : plan de rattrapage, lutte contre la vie chère, chlordécone"
    ],
    "phares": [
      "SMIC +15 % (environ +200 € nets)",
      "Écart de rémunération maximal de 1 à 20",
      "Âge légal de la retraite maintenu à 62 ans, minimum vieillesse de 1 000 €",
      "ISF Climat et Biodiversité (5 Md€/an)",
      "100 % renouvelables, pas de nouveaux EPR",
      "Ministre du Climat n° 2 du gouvernement et Budget Climat",
      "150 000 logements sociaux par an et encadrement des loyers",
      "Minimum jeunesse et dotation de 5 000 € à 18 ans",
      "Suppression de Parcoursup, enseignants payés comme des cadres",
      "RIP/RIC, proportionnelle, fin du 49.3"
    ],
    "pdfs": [
      {
        "label": "Hidalgo — Mes 70 propositions",
        "url": "https://xn--ambitionsant2022-mqb.fhf.fr/medias/anne-hidalgo-programme-officiel-en-a4-leger-compressed-623217494ac28272306959.pdf"
      }
    ],
    "sources": [
      {
        "label": "2022avechidalgo.fr",
        "url": "https://2022avechidalgo.fr/notre_programme"
      },
      {
        "label": "previssima.fr",
        "url": "https://www.previssima.fr/actualite/presidentielle-2022-le-programme-danne-hidalgo-parti-socialiste-en-matiere-de-protection-sociale-infographie.html"
      },
      {
        "label": "atterres.org (PDF)",
        "url": "https://www.atterres.org/wp-content/uploads/2022/03/Programme-presidentiel-Anne-Hidalgo.pdf"
      }
    ]
  },
  "Bernard Cazeneuve": {
    "kind": "aucun",
    "programmeLabel": "Aucun programme 2022",
    "note": "Bernard Cazeneuve n'était pas candidat en 2022 (annonce de septembre 2020) et sa formation, La Convention, n'a été lancée qu'en 2023 : il n'existe donc aucun programme 2022 pertinent. Il n'est pas l'auteur du programme PS d'Hidalgo, dont il s'est ensuite éloigné.",
    "themes": {
      "Institutions": {
        "resume": "",
        "mesures": []
      },
      "Économie": {
        "resume": "",
        "mesures": []
      },
      "Écologie": {
        "resume": "",
        "mesures": []
      },
      "Europe": {
        "resume": "",
        "mesures": []
      },
      "Social": {
        "resume": "",
        "mesures": []
      },
      "Sécurité": {
        "resume": "",
        "mesures": []
      }
    },
    "autres": [],
    "phares": [],
    "pdfs": [],
    "sources": [
      {
        "label": "fr.wikipedia.org",
        "url": "https://fr.wikipedia.org/wiki/Bernard_Cazeneuve"
      },
      {
        "label": "tendanceouest.com",
        "url": "https://www.tendanceouest.com/actualite-396571-presidentielle-2022-l-ancien-maire-de-cherbourg-bernard-cazeneuve-appelle-a-voter-pour-emmanuel-macron"
      }
    ]
  },
  "Sylvain Durif": {
    "kind": "aucun",
    "programmeLabel": "Aucun programme 2022",
    "note": "Sylvain Durif ne s'est pas présenté à la présidentielle 2022 et aucune trace de candidature ou de programme 2022 n'a été trouvée. Son programme de « 50 engagements » pour 2027 (durif2027.com) est hors périmètre 2022.",
    "themes": {
      "Institutions": {
        "resume": "",
        "mesures": []
      },
      "Économie": {
        "resume": "",
        "mesures": []
      },
      "Écologie": {
        "resume": "",
        "mesures": []
      },
      "Europe": {
        "resume": "",
        "mesures": []
      },
      "Social": {
        "resume": "",
        "mesures": []
      },
      "Sécurité": {
        "resume": "",
        "mesures": []
      }
    },
    "autres": [],
    "phares": [],
    "pdfs": [],
    "sources": [
      {
        "label": "sudradio.fr",
        "url": "https://www.sudradio.fr/politique/qui-est-ce-sylvain-durif-le-christ-cosmique-candidat-a-la-presidentielle-2027"
      },
      {
        "label": "franco.wiki",
        "url": "https://franco.wiki/fr/Sylvain_Durif.html"
      }
    ]
  },
  "Anasse Kazib": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 d'Anasse Kazib (Révolution permanente)",
    "note": "Candidature non aboutie en 2022 faute de parrainages (116 à 161 selon les sources, pour 500 requis). Le programme complet n'a pas pu être consulté : mesures partielles, d'après Révolution permanente et la presse.",
    "themes": {
      "Institutions": {
        "resume": "Remplacement des institutions par une assemblée unique, avec vote dès 16 ans et élus révocables.",
        "mesures": [
          "Assemblée unique élue pour 2 ans",
          "Vote dès 16 ans",
          "Élus révocables et payés au salaire médian"
        ]
      },
      "Économie": {
        "resume": "Hausse des salaires, interdiction des licenciements et expropriation des secteurs stratégiques.",
        "mesures": [
          "SMIC à 1 800 € nets",
          "+300 € pour tous les salaires",
          "Interdiction des licenciements",
          "Transformation des CDD et de l'intérim en CDI",
          "Réduction du temps de travail",
          "Expropriation des secteurs stratégiques de l'économie, sous contrôle au service des besoins sociaux"
        ]
      },
      "Écologie": {
        "resume": "Transition « réelle » passant par l'expropriation des secteurs stratégiques ; pas de mesure chiffrée retrouvée.",
        "mesures": [
          "Transition écologique « réelle » via l'expropriation des secteurs stratégiques"
        ]
      },
      "Europe": {
        "resume": "Droit à l'autodétermination des peuples encore colonisés.",
        "mesures": [
          "Droit à l'autodétermination des peuples encore colonisés (Guadeloupe citée)",
          "Réparations"
        ]
      },
      "Social": {
        "resume": "Sécurité sociale couvrant tous les besoins de santé, mesures contre la précarité et droits des personnes LGBTI.",
        "mesures": [
          "Sécurité sociale remboursant l'ensemble des besoins, fin des mutuelles",
          "Moyens massifs pour les soins et la prévention",
          "Expropriation des grands groupes pharmaceutiques et levée des brevets sur les traitements",
          "Mesures contre la précarité",
          "Droits des personnes LGBTI : autodétermination, dépsychiatrisation de la transidentité, gratuité des soins de transition",
          "Abrogation de la pénalisation des clients du travail du sexe"
        ]
      },
      "Sécurité": {
        "resume": "Dissolution des corps policiers spéciaux, abrogation de lois sécuritaires, régularisation des sans-papiers.",
        "mesures": [
          "Dissolution des corps spéciaux (BAC, BRAV, CRS)",
          "Interdiction des armes non létales en manifestation",
          "Abrogation des lois sécurité globale et séparatisme (et loi sur le voile selon Courrier de Guadeloupe)",
          "Abrogation du pass sanitaire",
          "Régularisation de tous les sans-papiers",
          "Droit de vote de tous les immigrés à toutes les élections",
          "Défense du regroupement familial",
          "Fin des expulsions"
        ]
      }
    },
    "autres": [
      "Lutte contre le racisme, les violences policières et sexistes",
      "Programme conçu comme des objectifs « transitoires » à reprendre dans les luttes",
      "Annonce de se préparer à résister aux attaques sur les retraites et le RSA"
    ],
    "phares": [
      "SMIC à 1 800 € nets, +300 € pour tous",
      "Interdiction des licenciements",
      "CDD et intérim en CDI",
      "Réduction du temps de travail",
      "Expropriation des secteurs stratégiques",
      "Régularisation de tous les sans-papiers",
      "Dissolution de la BAC, des BRAV et des CRS",
      "Abrogation du pass sanitaire et des lois séparatisme et sécurité globale",
      "Assemblée unique révocable, élus au salaire médian",
      "Sécurité sociale couvrant tout, levée des brevets pharmaceutiques"
    ],
    "pdfs": [],
    "sources": [
      {
        "label": "revolutionpermanente.fr",
        "url": "https://www.revolutionpermanente.fr/Anasse-Kazib-2022-decouvrez-le-programme-de-la-campagne"
      },
      {
        "label": "revolutionpermanente.fr",
        "url": "https://www.revolutionpermanente.fr/Anasse-2022-malgre-les-obstacles-une-campagne-qui-pose-des-jalons-pour-un-renouveau-de-l-extreme"
      },
      {
        "label": "tetu.com",
        "url": "https://tetu.com/2022/02/17/election-presidentielle-2022-interview-anasse-kazib-candidat-revolution-permanente-programme-lgbt/"
      },
      {
        "label": "lecourrierdeguadeloupe.com",
        "url": "https://lecourrierdeguadeloupe.com/les-idees-des-5-non-qualifies/?print=pdf"
      }
    ]
  },
  "Selma Labib": {
    "kind": "parti",
    "programmeLabel": "Programme 2022 de Philippe Poutou (NPA, avant la scission)",
    "note": "Programme du NPA unifié de 2022 (candidat Philippe Poutou), avant la scission de décembre 2022 : pas un programme propre au NPA-R de Selma Labib, à lire comme base indicative. Chiffres tirés du comparatif SNES et de résumés presse ; le programme 2027 peut différer.",
    "themes": {
      "Institutions": {
        "resume": "",
        "mesures": []
      },
      "Économie": {
        "resume": "Hausse des salaires, réduction du temps de travail, nationalisations et fiscalité fortement redistributive.",
        "mesures": [
          "SMIC à 1 800 € net, +400 € pour tous",
          "Semaine de 32 h sur 4 jours (vers 28 h)",
          "6e semaine de congés payés",
          "Salaires indexés sur le coût de la vie",
          "Nationalisations : énergie, banques (monopole public bancaire), pharmacie, Total, Sanofi, etc.",
          "1 million d'emplois publics en 5 ans",
          "Réquisition d'activités vitales",
          "Impôt sur la fortune élargi à tout le patrimoine",
          "Prélèvement à 100 % au-delà de 5 fois le SMIC (108 000 € par an net)",
          "Suppression des dispositifs d'allègement pour les riches (estimée à 150 Md€ par an par le programme)"
        ]
      },
      "Écologie": {
        "resume": "Sortie du nucléaire et des fossiles en 10 ans, services publics de l'énergie et planification écosocialiste.",
        "mesures": [
          "Sortie du nucléaire et des fossiles en 10 ans, fermeture immédiate des réacteurs de plus de 40 ans",
          "Services publics de l'énergie : nationalisation d'EDF, Engie, Veolia, Total",
          "Transports publics gratuits",
          "Interdiction des intrants chimiques",
          "Opposition aux méga-bassines",
          "Écosocialisme et planification"
        ]
      },
      "Europe": {
        "resume": "Retrait des troupes françaises à l'étranger et fin de la Françafrique.",
        "mesures": [
          "Retrait des troupes françaises à l'étranger",
          "Fin de la Françafrique",
          "Arrêt des ventes d'armes"
        ]
      },
      "Social": {
        "resume": "Grande Sécurité sociale, retraite à 60 ans, école commune jusqu'à 18 ans et présalaire d'autonomie pour les jeunes.",
        "mesures": [
          "Retraite à 60 ans avec 37 annuités, 55 ans pour les métiers pénibles (coût annoncé environ 60 Md€)",
          "Grande Sécurité sociale : tiers payant généralisé, fin des dépassements d'honoraires, franchises et forfaits supprimés",
          "200 000 hospitaliers embauchés, 100 000 lits rouverts",
          "Hôpitaux de proximité, centres de santé publics gratuits",
          "Service public du grand âge (200 000 postes), expropriation d'Orpea et Korian",
          "IVG jusqu'à 24 semaines",
          "École commune jusqu'à 18 ans, fin de la sélection et de Parcoursup",
          "20 élèves maximum par classe (12 en éducation prioritaire)",
          "Nationalisation de l'enseignement privé",
          "100 000 postes et +33 % de salaire pour les enseignants, titularisation des contractuels",
          "Présalaire d'autonomie 18-25 ans : 75 % du SMIC revalorisé à 1 800 €, coût annoncé 110 Md€ par an, remplaçant bourses, APL et RSA jeunes",
          "Égalité salariale femmes-hommes",
          "PMA pour toutes, changement d'état civil libre, transitions remboursées",
          "Centres d'aide aux victimes de violences"
        ]
      },
      "Sécurité": {
        "resume": "Désarmement de la police, fin de l'état d'urgence, régularisation des sans-papiers.",
        "mesures": [
          "Désarmement de la police, suppression de la BAC",
          "Fin de l'état d'urgence et des lois sécuritaires",
          "Régularisation de tous les sans-papiers",
          "Droit de vote des étrangers résidents",
          "Abrogation des lois jugées racistes ou islamophobes"
        ]
      }
    },
    "autres": [],
    "phares": [
      "SMIC 1 800 € net + 400 € pour tous",
      "32 h sur 4 jours, 6e semaine de congés",
      "Retraite à 60 ans (55 pour les métiers pénibles)",
      "Présalaire jeunes 18-25 ans (75 % de 1 800 €)",
      "Nationalisations (énergie, banques, pharmacie)",
      "Sortie du nucléaire en 10 ans",
      "1 million d'emplois publics ; 200 000 hospitaliers, 100 000 lits",
      "Prélèvement à 100 % au-delà de 5 SMIC ; ISF élargi",
      "Régularisation de tous les sans-papiers ; droit de vote des étrangers",
      "Désarmement de la police, suppression de la BAC"
    ],
    "pdfs": [
      {
        "label": "Comparatif des programmes 2022 (SNES), pas le programme officiel",
        "url": "https://lille.snes.edu/IMG/pdf/brochure_programmes_candidats_presidentielles_2022_web.pdf"
      }
    ],
    "sources": [
      {
        "label": "poutou2022.org",
        "url": "https://poutou2022.org/programme"
      },
      {
        "label": "vl-media.fr",
        "url": "https://vl-media.fr/presidentielle-2022-demandez-le-programme-de-philippe-poutou-npa/"
      },
      {
        "label": "linfodurable.fr",
        "url": "https://www.linfodurable.fr/politique/le-programme-ecolo-de-philippe-poutou-31345"
      },
      {
        "label": "fr.wikipedia.org",
        "url": "https://fr.wikipedia.org/wiki/Nouveau_Parti_anticapitaliste"
      }
    ]
  },
  "Francis Lalanne": {
    "kind": "aucun",
    "programmeLabel": "Aucun programme 2022",
    "note": "Aucun programme présidentiel 2022 trouvé : en 2022, Francis Lalanne s'est présenté aux législatives (France Libre). Un programme actuel existe pour 2027, mais il n'est pas de 2022 et n'est donc pas repris ici.",
    "themes": {
      "Institutions": {
        "resume": "",
        "mesures": []
      },
      "Économie": {
        "resume": "",
        "mesures": []
      },
      "Écologie": {
        "resume": "",
        "mesures": []
      },
      "Europe": {
        "resume": "",
        "mesures": []
      },
      "Social": {
        "resume": "",
        "mesures": []
      },
      "Sécurité": {
        "resume": "",
        "mesures": []
      }
    },
    "autres": [],
    "phares": [],
    "pdfs": [],
    "sources": [
      {
        "label": "fr.wikipedia.org",
        "url": "https://fr.wikipedia.org/wiki/Francis_Lalanne"
      },
      {
        "label": "parlons-politique.fr",
        "url": "https://www.parlons-politique.fr/elections/candidature-presidentielle-de-francis-lalanne-ce-que-son-programme-changerait-pour-les-citoyens-francais_25379/"
      },
      {
        "label": "cnews.fr",
        "url": "https://www.cnews.fr/france/2026-08-19/presidentielle-2027-francis-lalanne-se-porte-officiellement-candidat-1906812"
      }
    ]
  },
  "Jean Lassalle": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 de Jean Lassalle (« La France authentique », Résistons !)",
    "note": "Document officiel non retrouvé en ligne : résumé établi à partir de sources secondaires (Wikipédia, VL Média, L'Info durable). Le SMIC +8 % et le taux de TVA carburants (5 % ou 5,5 %) ne sont pas confirmés par un second document.",
    "themes": {
      "Institutions": {
        "resume": "RIC constituant et reconnaissance du vote blanc.",
        "mesures": [
          "RIC constituant",
          "Reconnaissance du vote blanc"
        ]
      },
      "Économie": {
        "resume": "Hausse du SMIC, baisse de la TVA sur les hydrocarbures, rétablissement de l'ISF, souveraineté économique et réindustrialisation.",
        "mesures": [
          "SMIC +8 %",
          "TVA sur les hydrocarbures de 20 % à 5,5 % (5 % selon VL Média)",
          "Souveraineté économique et réindustrialisation",
          "Rétablissement de l'ISF",
          "Suppression des droits de succession agricoles"
        ]
      },
      "Écologie": {
        "resume": "Renouvelables et nucléaire de nouvelle génération, soutien à la ruralité et à l'agriculture de proximité.",
        "mesures": [
          "Solaire, éolien, géothermie, énergie marine",
          "Nucléaire : 4e génération, fusion",
          "« Ticket paysan », circuits courts, réforme de la PAC",
          "Défense de la chasse et de la pêche traditionnelles"
        ]
      },
      "Europe": {
        "resume": "Sortie de l'OTAN et renégociation des traités européens.",
        "mesures": [
          "Sortie de l'OTAN",
          "Renégociation des traités pour une « Europe des nations », critique de la « dictature financière » de l'UE"
        ]
      },
      "Social": {
        "resume": "Plus d'effectifs hospitaliers, service civique ou militaire, 3 Md€ pour les campagnes.",
        "mesures": [
          "Plus d'effectifs hospitaliers",
          "Service civique/militaire universel de 9 mois",
          "3 Md€ pour les campagnes : ruralité (internet, transports, école)",
          "Agence des Français de l'étranger"
        ]
      },
      "Sécurité": {
        "resume": "Hausse des effectifs de police et de douane, légalisation du cannabis.",
        "mesures": [
          "Hausse des effectifs de police et de douane",
          "Légalisation du cannabis, recettes en partie pour lutter contre les addictions"
        ]
      }
    },
    "autres": [
      "Engagement notarié (3 avril 2022) de donner ses biens si RIC, vote blanc et TVA carburants n'étaient pas appliqués avant les législatives"
    ],
    "phares": [
      "RIC constituant",
      "Vote blanc reconnu",
      "TVA carburants à 5,5 %",
      "SMIC +8 %",
      "ISF rétabli",
      "Service civique/militaire de 9 mois",
      "3 Md€ pour les campagnes, ticket paysan",
      "Sortie de l'OTAN",
      "Légalisation du cannabis",
      "Renégociation des traités européens"
    ],
    "pdfs": [],
    "sources": [
      {
        "label": "fr.wikipedia.org",
        "url": "https://fr.wikipedia.org/wiki/Jean_Lassalle"
      },
      {
        "label": "vl-media.fr",
        "url": "https://vl-media.fr/presidentielles-2022-demandez-le-programme-de-jean-lassalle-resistons/"
      },
      {
        "label": "linfodurable.fr",
        "url": "https://www.linfodurable.fr/politique/le-programme-ecolo-de-jean-lassalle-31347"
      }
    ]
  },
  "David Lisnard": {
    "kind": "aucun",
    "programmeLabel": "Aucun programme 2022",
    "note": "Aucun programme présidentiel 2022 de Nouvelle Énergie ni de David Lisnard n'a été retrouvé : il n'était pas candidat en 2022 (alors maire de Cannes, président de l'AMF, membre de LR). Son éventuel soutien en 2022 n'a pas pu être vérifié.",
    "themes": {
      "Institutions": {
        "resume": "",
        "mesures": []
      },
      "Économie": {
        "resume": "",
        "mesures": []
      },
      "Écologie": {
        "resume": "",
        "mesures": []
      },
      "Europe": {
        "resume": "",
        "mesures": []
      },
      "Social": {
        "resume": "",
        "mesures": []
      },
      "Sécurité": {
        "resume": "",
        "mesures": []
      }
    },
    "autres": [],
    "phares": [],
    "pdfs": [],
    "sources": [
      {
        "label": "en.wikipedia.org",
        "url": "https://en.wikipedia.org/wiki/New_Energy_(political_party"
      },
      {
        "label": "elyseescope.com",
        "url": "https://www.elyseescope.com/le-radar/nouvelle-energie-le-mouvement-de-david-lisnard-pour-2027-decrypte"
      },
      {
        "label": "unenouvelleenergie.fr",
        "url": "https://www.unenouvelleenergie.fr"
      }
    ]
  },
  "Florian Philippot": {
    "kind": "propre",
    "programmeLabel": "Programme 2022 de Florian Philippot (« Libérons la France », Les Patriotes)",
    "note": "Candidature non aboutie en 2022 (retrait le 18 février faute de parrainages). Résumé d'après une copie tierce du PDF du projet ; peu de chiffres (ni SMIC ni âge de retraite).",
    "themes": {
      "Institutions": {
        "resume": "Démocratie directe et refonte des institutions : RIC, proportionnelle intégrale, Conseil constitutionnel tiré au sort.",
        "mesures": [
          "Conseil constitutionnel tiré au sort",
          "Proportionnelle intégrale",
          "RIC",
          "Référendum obligatoire pour réviser la Constitution",
          "Moins de parlementaires",
          "Suppression des conseils régionaux et du CESER",
          "CSA tiré au sort",
          "Loi contre la censure des GAFAM"
        ]
      },
      "Économie": {
        "resume": "Planification stratégique d'État, nationalisation d'une grande banque, fiscalité progressive selon la taille des entreprises ; aucun taux chiffré.",
        "mesures": [
          "Planification stratégique d'État",
          "Nationalisation d'au moins une grande banque",
          "Fin des entraves aux entrepreneurs",
          "Hausse générale des salaires et retraites par la relance, grâce au Frexit",
          "Baisse immédiate de la fiscalité sur énergie et carburants",
          "Fiscalité progressive selon la taille d'entreprise (TPE/PME moins taxées)",
          "Récompenser le travail, pénaliser la rente",
          "Lutte contre l'évasion fiscale"
        ]
      },
      "Écologie": {
        "resume": "Nucléaire de nouvelle génération, retour des monopoles EDF/GDF, arrêt des éoliennes, protection animale.",
        "mesures": [
          "Nucléaire nouvelle génération",
          "Sortie du marché européen de l'électricité",
          "Retour des monopoles EDF/GDF",
          "Arrêt des éoliennes",
          "Hydrogène, biocarburants d'algues",
          "Bio, circuits courts, fin des traités de libre-échange, déplastification",
          "Protection animale cause nationale"
        ]
      },
      "Europe": {
        "resume": "Frexit (UE et euro), sortie de l'OTAN et doublement du budget de la défense.",
        "mesures": [
          "Frexit : sortie de l'UE et de l'euro",
          "Sortie de l'OTAN",
          "Refus d'une armée européenne",
          "Partenariats avec toutes les puissances, y compris la Russie",
          "Budget de la défense doublé en 5 ans",
          "2 porte-avions nucléaires",
          "Abandon du SCAF et du MGCS",
          "Budget spatial doublé"
        ]
      },
      "Social": {
        "resume": "Réforme de la santé (fin des ARS, de la T2A) et retour aux savoirs fondamentaux à l'école.",
        "mesures": [
          "Médecine de proximité, liberté de prescription",
          "Fermeture des ARS",
          "Fin de la T2A",
          "Investissement massif dans l'hôpital et la recherche",
          "Suspension de la participation à l'OMS",
          "Réintégration des soignants suspendus",
          "Dissolution du Conseil de l'ordre",
          "Fin du pass sanitaire, interdiction constitutionnelle du confinement",
          "Savoirs fondamentaux, fin du tout-numérique",
          "Interdiction de l'écriture inclusive",
          "Cours de morale, uniforme obligatoire"
        ]
      },
      "Sécurité": {
        "resume": "Exécution systématique des peines et arrêt de l'immigration massive via la sortie de la CEDH, de l'UE et de Schengen.",
        "mesures": [
          "Exécution systématique des peines",
          "Lutte contre le trafic de drogue",
          "Arrêt de l'immigration massive",
          "Fin du regroupement familial par sortie de la CEDH et de l'UE",
          "Sortie de Schengen",
          "Pression sur les pays refusant leurs ressortissants (OQTF)"
        ]
      }
    },
    "autres": [
      "Lutte anticorruption, inéligibilité à vie, fin du pantouflage",
      "Sauvegarde du patrimoine"
    ],
    "phares": [
      "Frexit (UE et euro)",
      "Sortie de l'OTAN",
      "Fin du pass sanitaire, interdiction constitutionnelle du confinement",
      "Sortie de Schengen et de la CEDH, arrêt de l'immigration massive",
      "RIC et proportionnelle intégrale",
      "Nationalisation d'une grande banque",
      "Nucléaire nouvelle génération, arrêt des éoliennes",
      "Budget de la défense doublé en 5 ans",
      "Baisse de la fiscalité sur l'énergie",
      "Fermeture des ARS, sortie de l'OMS"
    ],
    "pdfs": [
      {
        "label": "Mon projet présidentiel",
        "url": "https://www.politique-animaux.fr/sites/www.politique-animaux.fr/fichiers/prises-de-positions/pieces-jointes/programme2022.pdf"
      }
    ],
    "sources": [
      {
        "label": "fr.wikipedia.org",
        "url": "https://fr.wikipedia.org/wiki/Les_Patriotes_(parti_politique"
      }
    ]
  },
  "Dominique de Villepin": {
    "kind": "aucun",
    "programmeLabel": "Aucun programme 2022",
    "note": "Dominique de Villepin n'a pas été candidat en 2022 et aucun programme 2022 ne lui est rattachable. Son parti La France humaniste date de 2025.",
    "themes": {
      "Institutions": {
        "resume": "",
        "mesures": []
      },
      "Économie": {
        "resume": "",
        "mesures": []
      },
      "Écologie": {
        "resume": "",
        "mesures": []
      },
      "Europe": {
        "resume": "",
        "mesures": []
      },
      "Social": {
        "resume": "",
        "mesures": []
      },
      "Sécurité": {
        "resume": "",
        "mesures": []
      }
    },
    "autres": [],
    "phares": [],
    "pdfs": [],
    "sources": [
      {
        "label": "vl-media.fr",
        "url": "https://vl-media.fr/cest-quoi-la-france-humaniste-le-nouveau-parti-de-dominique-de-villepin/"
      },
      {
        "label": "lcp.fr",
        "url": "https://lcp.fr/actualites/dominique-de-villepin-nous-voulons-etre-presents-en-2027-429413"
      },
      {
        "label": "publicsenat.fr",
        "url": "https://www.publicsenat.fr/actualites/politique/presidentielle-villepin-apporte-son-soutien-a-macron-59071"
      }
    ]
  }
}
