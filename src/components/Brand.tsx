interface LogoProps {
  size?: number
}

// Mon Petit Vote 2027 mark: the 3D tricolore sheep (blue / white / red fleece)
// on a paper tile, so its dark legs stay readable on any background.
export function LogoMouton({ size = 40 }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Mon Petit Vote 2027"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.25),
        background: '#F5F0E6',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <img src="/mouton.png" alt="" width={Math.round(size * 0.86)} height={Math.round(size * 0.86)} draggable={false} />
    </span>
  )
}

interface BrandProps {
  size?: number
  dark?: boolean
  onClick?: () => void
}

// Logo + name. `dark` is for use on the navy sidebar/panel.
export default function Brand({ size = 40, dark = false, onClick }: BrandProps) {
  const content = (
    <>
      <LogoMouton size={size} />
      <span className="dsp" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, fontWeight: 800 }}>
        <span style={{ fontSize: Math.round(size * 0.46), whiteSpace: 'nowrap' }}>Mon Petit Vote</span>
        <span style={{ fontSize: Math.round(size * 0.46), marginTop: 3, color: dark ? '#B8C0F5' : '#3B4FD8' }}>2027</span>
      </span>
    </>
  )
  if (!onClick) return <span className="row" style={{ gap: 10 }}>{content}</span>
  return (
    <button type="button" onClick={onClick} className="row" style={{ gap: 10, textAlign: 'left', minHeight: 44 }} aria-label="Mon Petit Vote 2027, retour à l'accueil">
      {content}
    </button>
  )
}
