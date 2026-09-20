// Simple, real leveling curve for the Supabase-backed version: 100 points per level,
// replacing the local prototype's hardcoded "Niveau 12" demo flavor text.
export function levelFromPoints(points: number): number {
  return Math.max(1, Math.floor(Math.max(0, points) / 100) + 1)
}

export function levelProgress(points: number): { xpIntoLevel: number; xpTarget: number; pct: number } {
  const xpIntoLevel = Math.max(0, points) % 100
  return { xpIntoLevel, xpTarget: 100, pct: xpIntoLevel }
}
