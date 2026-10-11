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
