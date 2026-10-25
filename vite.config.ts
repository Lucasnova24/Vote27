import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Les balises Open Graph exigent des URL absolues : VITE_SITE_URL (ex. https://monpetitvote.fr,
// sans slash final). Vide, elles restent relatives (suffisant en local).
export default defineConfig(({ mode }) => {
  const siteUrl = (loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL ?? '').replace(/\/+$/, '')
  return {
    plugins: [
      react(),
      { name: 'site-url', transformIndexHtml: (html: string) => html.split('__SITE_URL__').join(siteUrl) },
    ],
  }
})
