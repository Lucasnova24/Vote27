# Dossier de publication — Mon Petit Vote 2027

| Fichier | Contenu |
|---|---|
| [`fiches-stores.md`](fiches-stores.md) | Descriptions courte/longue, mots-clés, notes pour les relecteurs (accès démo) |
| [`captures-ecran.md`](captures-ecran.md) | Checklist des captures et visuels, tailles exigées |
| [`ANDROID.md`](ANDROID.md) | Keystore, Play App Signing, build de l'AAB, checklist Play Console (compte organisation) |
| [`../public/confidentialite.html`](../public/confidentialite.html) | Modèle de politique de confidentialité (HTML statique) |
| [`../public/suppression-compte.html`](../public/suppression-compte.html) | Page publique de demande de suppression de compte (HTML statique) |

Les deux pages HTML sont dans `public/` : elles sont servies telles quelles par le site web de l'app
(`https://<ton-domaine>/confidentialite.html` et `/suppression-compte.html`) et copiées dans `dist/`
au build. Ce sont ces URL qu'il faut saisir dans Play Console et App Store Connect.

## ⚠️ Champs à remplacer avant publication

Chaque champ entre crochets doit être remplacé : `grep -rn "\[" public/confidentialite.html public/suppression-compte.html store/`

- `[NOM DE L'ÉDITEUR]` — raison sociale / nom du responsable de traitement
- `[ADRESSE POSTALE]` — adresse de l'éditeur
- `[EMAIL DE CONTACT]` — adresse de contact et de demande RGPD
- `[DOMAINE]` — domaine où l'app web est hébergée
- `[RÉGION D'HÉBERGEMENT SUPABASE]` — région du projet Supabase (ex. eu-west-3 Paris)
- `[DATE]` — date de dernière mise à jour

Ces modèles ne constituent pas un avis juridique : fais-les relire, en particulier sur le traitement
d'opinions politiques (voir la note dans la politique de confidentialité).

## Identifiant d'application

`com.novaparticipations.petitvote` est **provisoire** (`app.config.json`). Il est **définitif** une fois
publié sur Google Play / App Store : à confirmer avant tout envoi. Pour le changer : modifier
`app.config.json` puis `npm run app:set-id`.
