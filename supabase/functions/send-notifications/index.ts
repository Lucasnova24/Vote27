// Edge Function — envoie les notifications push arrivées à échéance.
// Appelée chaque minute par pg_cron (cf. supabase/notifications_schema.sql).
//
// Déploiement (le JWT est remplacé par un secret partagé) :
//   supabase functions deploy send-notifications --no-verify-jwt
//   supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... \
//     VAPID_SUBJECT=mailto:toi@exemple.fr
// L'appelant (pg_cron) s'authentifie avec le secret « cron_secret » du Vault,
// vérifié via la fonction SQL verify_cron_secret().
//
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement.

import { createClient } from 'jsr:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUBJECT')!,
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!,
)

const BATCH = 25
const PAGE = 1000

interface Planning {
  id: string
  categorie: string
  titre: string
  message: string
  lien: string
}

// Envoie une notification à tous les abonnés ; renvoie le nombre d'appareils atteints.
async function broadcast(n: Planning): Promise<number> {
  const payload = JSON.stringify({ title: n.titre, body: n.message, url: n.lien || '/', tag: n.categorie })
  let delivered = 0
  const dead: string[] = []

  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('id,endpoint,p256dh,auth')
      .order('created_at')
      .range(from, from + PAGE - 1)
    if (error) throw error
    if (!data || data.length === 0) break

    for (let i = 0; i < data.length; i += BATCH) {
      await Promise.all(data.slice(i, i + BATCH).map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload,
            { TTL: 60 * 60 * 6, urgency: 'normal' },
          )
          delivered++
        } catch (e) {
          const code = (e as { statusCode?: number }).statusCode
          if (code === 404 || code === 410) dead.push(sub.id) // abonnement expiré / révoqué
          else console.error('[send-notifications] push failed', code, (e as Error).message)
        }
      }))
    }
    if (data.length < PAGE) break
  }

  if (dead.length) await supabase.from('push_subscriptions').delete().in('id', dead)
  return delivered
}

Deno.serve(async (req) => {
  const given = req.headers.get('x-cron-secret') ?? ''
  const { data: ok } = given ? await supabase.rpc('verify_cron_secret', { p_secret: given }) : { data: false }
  if (ok !== true) return new Response('Unauthorized', { status: 401 })

  const { data, error } = await supabase.rpc('claim_due_notifications')
  if (error) {
    console.error('[send-notifications] claim failed', error.message)
    return new Response(error.message, { status: 500 })
  }

  const results: { id: string; titre: string; envois: number }[] = []
  for (const n of (data as Planning[] | null) ?? []) {
    let envois = 0
    try {
      envois = await broadcast(n)
    } catch (e) {
      console.error('[send-notifications] broadcast failed', n.id, (e as Error).message)
    }
    await supabase.from('notifications_planning').update({ nb_envois: envois }).eq('id', n.id)
    results.push({ id: n.id, titre: n.titre, envois })
  }

  return Response.json({ sent: results })
})
