# Checklist des captures et visuels

Prendre les captures sur l'app native (ou un émulateur) en **mode invité**, avec des données plausibles et
sans information personnelle. Mêmes écrans suggérés : Accueil, Isoloir (vote du jour), Quiz, Mes affinités,
Agenda/Débat, Profil.

## Apple App Store (obligatoire : au moins 1 jeu d'iPhone ; iPad seulement si l'app le supporte)

| Appareil | Taille (px, portrait) | Statut |
|---|---|---|
| iPhone 6,9" (16/17 Pro Max) | 1320 × 2868 (ou 1290 × 2796) | ☐ requis |
| iPhone 6,5" (11 Pro Max / XS Max) | 1284 × 2778 (ou 1242 × 2688) | ☐ requis si 6,9" non fourni |
| iPad 13" (si iPad supporté) | 2064 × 2752 | ☐ à décider |

3 à 10 captures par taille, PNG/JPEG sans transparence. Icône **1024 × 1024** (sans transparence, sans
coins arrondis) : `resources/icon-only.png`.

## Google Play

| Élément | Taille | Statut |
|---|---|---|
| Icône de l'application | **512 × 512** PNG 32 bits, ≤ 1 Mo | ☐ (`public/icon-512.png`) |
| Image de présentation (feature graphic) | **1024 × 500** PNG/JPEG, sans transparence | ☐ à créer |
| Captures téléphone | 2 à 8, ratio 16:9 ou 9:16, côté 320–3840 px (recommandé 1080 × 1920 min.) | ☐ requis |
| Captures tablette 7" / 10" | optionnel (recommandé) | ☐ |

## Sources & qualité

- `resources/icon-only.png` (1024) est un **agrandissement** de `public/icon-512.png` : la source la plus
  grande disponible dans le dépôt fait 512 px. Fournis un fichier maître vectoriel ou ≥ 1024 px, puis
  relance `npm run assets` pour des icônes nettes.
- Le splash (`resources/splash.png`, 2732 × 2732) utilise `public/mouton.png` (512 px) agrandi : à refaire
  à partir d'un visuel haute définition si l'image paraît floue.
- Interdits : mentions de prix, d'autres stores, contenu partisan, visages de candidats utilisés comme
  recommandation.
