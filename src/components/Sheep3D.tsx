import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  Box3, Color, DirectionalLight, Group, HemisphereLight, Mesh, MeshBasicMaterial, CircleGeometry,
  PerspectiveCamera, Scene, Vector3, WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Renders the 3D tricolore sheep, hopping and swaying. Falls back to
// `fallback` while the model loads or if WebGL / the model fails.
export default function Sheep3D({ fallback }: { fallback: ReactNode }) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setFailed(true)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(new Color('#F5F0E6'), 0)
    el.appendChild(renderer.domElement)
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block'

    const scene = new Scene()
    scene.add(new HemisphereLight(0xffffff, 0xd8cfb8, 1.6))
    const sun = new DirectionalLight(0xffffff, 2.2)
    sun.position.set(2, 4, 3)
    scene.add(sun)

    const camera = new PerspectiveCamera(30, 1, 0.1, 50)
    const pivot = new Group() // yaw + hop
    scene.add(pivot)

    const shadow = new Mesh(new CircleGeometry(1, 40), new MeshBasicMaterial({ color: 0x14162b, transparent: true, opacity: 0.16 }))
    shadow.rotation.x = -Math.PI / 2
    scene.add(shadow)

    let radius = 1
    let footY = 0
    let raf = 0
    let disposed = false

    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    new GLTFLoader().load(
      '/mouton.glb',
      (gltf) => {
        if (disposed) return
        const model = gltf.scene
        const box = new Box3().setFromObject(model)
        const c = box.getCenter(new Vector3())
        const size = box.getSize(new Vector3())
        model.position.sub(c) // centre on the pivot
        pivot.add(model)
        radius = Math.max(size.x, size.y, size.z) * 0.5
        footY = -size.y / 2
        camera.position.set(0, radius * 0.45, radius * 4.4)
        camera.lookAt(0, -radius * 0.05, 0)
        shadow.position.y = footY - 0.02
        shadow.scale.set(size.x * 0.45, size.x * 0.45, 1)
        setReady(true)
        start()
      },
      undefined,
      () => !disposed && setFailed(true),
    )

    const start = () => {
      const t0 = performance.now()
      const tick = (now: number) => {
        const t = (now - t0) / 1000
        const phase = (t % 1.1) / 1.1 // one hop per 1.1 s
        const hop = reduced ? 0 : Math.abs(Math.sin(phase * Math.PI))
        const squash = reduced ? 0 : Math.max(0, 1 - phase * 8) * 0.07 // land-squash
        pivot.position.y = hop * radius * 0.28
        pivot.scale.set(1 + squash, 1 - squash, 1 + squash)
        pivot.rotation.y = -0.6 + (reduced ? 0 : Math.sin(t * 1.1) * 0.55)
        const s = 1 - hop * 0.3
        shadow.scale.set(radius * 0.75 * s, radius * 0.75 * s, 1)
        ;(shadow.material as MeshBasicMaterial).opacity = 0.16 * s
        renderer.render(scene, camera)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  if (failed) return <>{fallback}</>
  return (
    <div ref={host} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!ready && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{fallback}</div>}
    </div>
  )
}
