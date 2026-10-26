import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

export interface RoulettePrize {
  id: string
  label: string
  image?: string
}

interface Props {
  prizes: readonly RoulettePrize[]
  /** Index of the prize to land on. Read when `spinKey` changes. */
  winningIndex: number
  /** Increment to start a new spin (the strip continues from where it stopped, no jump). */
  spinKey: number
  onComplete?: (prize: RoulettePrize) => void
  /** Fired each time an item crosses the pointer (haptics / tick sound). */
  onTick?: () => void
  duration?: number
  /** Size of one item along the scroll axis, in px. */
  itemSize?: number
  /** Full laps done before landing. */
  laps?: number
  vertical?: boolean
  renderPrize?: (prize: RoulettePrize, state: { active: boolean }) => ReactNode
  style?: CSSProperties
}

// Fast start, long smooth deceleration — no stop-and-go at the end like a cubic-bezier on a huge strip.
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5)
const mod = (n: number, m: number) => ((n % m) + m) % m

/**
 * Roulette fluide : animation pilotée par requestAnimationFrame, un seul `transform`
 * composité GPU, et une bande virtuelle (seuls les éléments visibles sont dans le DOM,
 * quel que soit le nombre de tours ou de participants). La position finale est conservée,
 * donc le tour suivant repart d'où le précédent s'est arrêté.
 */
export default function Roulette({
  prizes, winningIndex, spinKey, onComplete, onTick,
  duration = 5200, itemSize = 120, laps = 6, vertical = false, renderPrize, style,
}: Props) {
  const n = prizes.length
  const hostRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState(0)
  const [base, setBase] = useState(0)
  const [activeIdx, setActiveIdx] = useState(-1)

  const posRef = useRef(0)        // position courante (px de la bande)
  const rafRef = useRef(0)
  const lastTickRef = useRef(0)
  const cbRef = useRef({ onComplete, onTick })
  cbRef.current = { onComplete, onTick }
  const viewportRef = useRef(0)
  viewportRef.current = viewport

  const centerOffset = (v: number) => (v - itemSize) / 2

  const paint = useCallback((pos: number) => {
    posRef.current = pos
    const b = Math.floor(pos / itemSize)
    const frac = pos - b * itemSize
    const el = stripRef.current
    if (el) {
      el.style.transform = vertical ? `translate3d(0, ${-frac}px, 0)` : `translate3d(${-frac}px, 0, 0)`
    }
    setBase(prev => (prev === b ? prev : b))
    const tick = Math.round((pos + centerOffset(viewportRef.current)) / itemSize)
    if (tick !== lastTickRef.current) {
      lastTickRef.current = tick
      cbRef.current.onTick?.()
    }
  }, [itemSize, vertical])

  useLayoutEffect(() => {
    const el = hostRef.current
    if (!el) return
    const measure = () => setViewport(vertical ? el.clientHeight : el.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [vertical])

  // Pose initiale : premier élément au centre.
  useLayoutEffect(() => {
    if (viewport && !rafRef.current) paint(posRef.current || -centerOffset(viewport))
  }, [viewport, paint])

  useEffect(() => {
    if (spinKey === 0 || !viewport || n === 0) return
    cancelAnimationFrame(rafRef.current)
    setActiveIdx(-1)

    const lap = n * itemSize
    const start = posRef.current
    const target = (idx: number) => idx * itemSize - centerOffset(viewport)
    // Prochaine occurrence du gagnant après `laps` tours complets, + petit décalage aléatoire dans la case.
    const jitter = (Math.random() - 0.5) * itemSize * 0.6
    let end = target(winningIndex) + jitter
    end += Math.ceil((start + laps * lap - end) / lap) * lap
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const dur = reduced ? 600 : duration

    const t0 = performance.now()
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / dur)
      paint(start + (end - start) * easeOutQuint(t))
      if (t < 1) { rafRef.current = requestAnimationFrame(frame); return }
      rafRef.current = 0
      // Recentrage doux sur la case gagnante (annule le décalage aléatoire).
      const settleFrom = posRef.current
      const settleTo = end - jitter
      const s0 = performance.now()
      const settle = (now2: number) => {
        const k = Math.min(1, (now2 - s0) / 320)
        paint(settleFrom + (settleTo - settleFrom) * (1 - Math.pow(1 - k, 3)))
        if (k < 1) { rafRef.current = requestAnimationFrame(settle); return }
        rafRef.current = 0
        setActiveIdx(winningIndex)
        cbRef.current.onComplete?.(prizes[winningIndex])
      }
      rafRef.current = requestAnimationFrame(settle)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinKey])

  const slots = viewport ? Math.ceil(viewport / itemSize) + 2 : 0
  const items: ReactNode[] = []
  for (let j = 0; j < slots; j++) {
    const abs = base + j
    const idx = mod(abs, n)
    const prize = prizes[idx]
    items.push(
      <div
        key={j}
        role="option"
        aria-label={prize.label}
        aria-selected={idx === activeIdx}
        style={{
          flex: '0 0 auto',
          [vertical ? 'height' : 'width']: itemSize,
          [vertical ? 'width' : 'height']: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {renderPrize ? renderPrize(prize, { active: idx === activeIdx }) : (
          <span style={{ fontWeight: 700, fontSize: 14, textAlign: 'center', padding: 8 }}>{prize.label}</span>
        )}
      </div>,
    )
  }

  return (
    <div
      ref={hostRef}
      role="listbox"
      aria-label="Roulette"
      style={{
        position: 'relative', overflow: 'hidden', width: '100%', height: vertical ? 360 : itemSize,
        contain: 'layout paint', ...style,
      }}
    >
      <div
        ref={stripRef}
        style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', height: '100%', willChange: 'transform', backfaceVisibility: 'hidden' }}
      >
        {items}
      </div>
      {/* fondu sur les bords + repère central */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `linear-gradient(${vertical ? '180deg' : '90deg'}, var(--roulette-fade, #F6F4EE) 0%, transparent 22%, transparent 78%, var(--roulette-fade, #F6F4EE) 100%)`,
      }} />
      <div aria-hidden style={{
        position: 'absolute', pointerEvents: 'none', background: '#D94A4A', borderRadius: 2,
        ...(vertical
          ? { left: 0, right: 0, top: '50%', height: 3, transform: 'translateY(-50%)' }
          : { top: 0, bottom: 0, left: '50%', width: 3, transform: 'translateX(-50%)' }),
      }} />
    </div>
  )
}
