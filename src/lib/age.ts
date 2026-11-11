/** Date du jour au format `YYYY-MM-DD` (attribut `max` des champs date de naissance). */
export function maxDobIso(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`
}
