// Propage app.config.json (appId, appName) vers les projets natifs android/ et ios/.
// Usage : npm run app:set-id   (idempotent ; à relancer après tout changement de l'ID)
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, readdirSync, rmdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const { appId, appName } = JSON.parse(readFileSync(join(root, 'app.config.json'), 'utf8'))
if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(appId)) {
  console.error(`appId invalide : ${appId}`)
  process.exit(1)
}

const rd = (p) => readFileSync(join(root, p), 'utf8')
const wr = (p, s) => writeFileSync(join(root, p), s)

// Identifiant actuel, lu dans le projet Android.
const gradle = rd('android/app/build.gradle')
const old = gradle.match(/applicationId "([^"]+)"/)?.[1]
if (!old) { console.error('applicationId introuvable dans android/app/build.gradle'); process.exit(1) }

const files = [
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res/values/strings.xml',
  'ios/App/App.xcodeproj/project.pbxproj',
  'ios/App/App/Info.plist',
]
if (old !== appId) {
  for (const f of files) wr(f, rd(f).split(old).join(appId))
  // Déplace MainActivity vers le nouveau package.
  const base = 'android/app/src/main/java'
  const from = join(root, base, ...old.split('.'))
  const to = join(root, base, ...appId.split('.'))
  if (existsSync(from)) {
    mkdirSync(to, { recursive: true })
    for (const f of readdirSync(from)) {
      const src = join(from, f)
      const dst = join(to, f)
      writeFileSync(dst, readFileSync(src, 'utf8').replace(`package ${old};`, `package ${appId};`))
      unlinkSync(src)
    }
    // nettoyage des anciens dossiers vides
    for (let d = from; d.length > join(root, base).length; d = dirname(d)) {
      try { rmdirSync(d) } catch { break }
    }
  }
  console.log(`appId : ${old} -> ${appId}`)
} else {
  console.log(`appId déjà à jour : ${appId}`)
}

// Nom affiché.
const strings = 'android/app/src/main/res/values/strings.xml'
wr(strings, rd(strings)
  .replace(/(<string name="app_name">)[^<]*/, `$1${appName}`)
  .replace(/(<string name="title_activity_main">)[^<]*/, `$1${appName}`))
const plist = 'ios/App/App/Info.plist'
wr(plist, rd(plist).replace(/(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*/, `$1${appName}`))
