export const MIN_AGE = 15

/** Âge révolu à la date `now` pour une date de naissance `YYYY-MM-DD` ; null si invalide. */
export function ageFromDob(dob: string, now = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  let age = now.getFullYear() - y
  if (now.getMonth() + 1 < mo || (now.getMonth() + 1 === mo && now.getDate() < d)) age--
  return age
}

export const isUnderMinAge = (dob: string) => {
  const age = ageFromDob(dob)
  return age !== null && age < MIN_AGE
}

/** Plus récente date de naissance autorisée (attribut `max` des champs date). */
export function maxDobIso(now = new Date()): string {
  const d = new Date(now.getFullYear() - MIN_AGE, now.getMonth(), now.getDate())
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const UNDER_AGE_MESSAGE = `L'inscription est réservée aux personnes de ${MIN_AGE} ans et plus.`
