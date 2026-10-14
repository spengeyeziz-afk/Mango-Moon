import { useEffect, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"
import { BuildingArt, Ground, Person, TreeArt } from "@/components/game/art"
import { CayGround, CayHits } from "@/components/game/CayIsland"
import { Walker } from "@/components/game/portraits"
import { playerLook } from "@/game/people"
import {
  BUILDINGS,
  FRUIT_DEFS,
  GRANNY,
  PLOTS,
  TIDE,
  WORLD,
  formatLeft,
  fruitDef,
  stationOpen,
} from "@/game/content"
import { jobReady } from "@/game/logic"
import { useGame } from "@/game/store"
import type { StationId } from "@/game/types"

export function Island({ interactive }: { interactive: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const cam = useRef({ x: 0, y: -40, s: 0.62 })
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null)

  const apply = () => {
    const vp = ref.current
    const el = world.current
    if (!vp || !el) return
    const { s } = cam.current
    const ww = WORLD.w * s
    const wh = WORLD.h * s
    const m = 20
    if (ww <= vp.clientWidth) cam.current.x = (vp.clientWidth - ww) / 2
    else cam.current.x = Math.min(m, Math.max(vp.clientWidth - ww - m, cam.current.x))
    if (wh <= vp.clientHeight) cam.current.y = (vp.clientHeight - wh) / 2
    else cam.current.y = Math.min(m, Math.max(vp.clientHeight - wh - m, cam.current.y))
    el.style.transform = `translate(${cam.current.x}px, ${cam.current.y}px) scale(${s})`
  }

  useLayoutEffect(() => {
    const vp = ref.current
    if (!vp) return
    const fit = Math.min(vp.clientWidth / WORLD.w, vp.clientHeight / WORLD.h)
    cam.current.s = Math.min(1.15, Math.max(0.42, fit * 1.55))
    cam.current.x = vp.clientWidth / 2 - 400 * cam.current.s
    cam.current.y = vp.clientHeight / 2 - 380 * cam.current.s
    apply()
  }, [])

  useEffect(() => {
    const vp = ref.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = vp.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const prev = cam.current.s
      const next = Math.min(1.35, Math.max(0.38, prev * (e.deltaY > 0 ? 0.92 : 1.08)))
      const wx = (mx - cam.current.x) / prev
      const wy = (my - cam.current.y) / prev
      cam.current.s = next
      cam.current.x = mx - wx * next
      cam.current.y = my - wy * next
      apply()
    }
    vp.addEventListener("wheel", onWheel, { passive: false })
    const onResize = () => apply()
    window.addEventListener("resize", onResize)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useGame.getState().close()
      const step = e.shiftKey ? 80 : 36
      if (e.key === "ArrowLeft") cam.current.x += step
      else if (e.key === "ArrowRight") cam.current.x -= step
      else if (e.key === "ArrowUp") cam.current.y += step
      else if (e.key === "ArrowDown") cam.current.y -= step
      else if (e.key === "+" || e.key === "=") cam.current.s = Math.min(1.35, cam.current.s * 1.08)
      else if (e.key === "-" || e.key === "_") cam.current.s = Math.max(0.38, cam.current.s * 0.92)
      else return
      e.preventDefault()
      apply()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      vp.removeEventListener("wheel", onWheel)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  const zoom = (dir: number) => {
    const vp = ref.current
    if (!vp) return
    const prev = cam.current.s
    const next = Math.min(1.35, Math.max(0.38, prev * (dir > 0 ? 1.12 : 0.9)))
    const mx = vp.clientWidth / 2
    const my = vp.clientHeight / 2
    const wx = (mx - cam.current.x) / prev
    const wy = (my - cam.current.y) / prev
    cam.current.s = next
    cam.current.x = mx - wx * next
    cam.current.y = my - wy * next
    apply()
  }

  const onPointerDown = (e: ReactPointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    drag.current = { x: e.clientX, y: e.clientY, ox: cam.current.x, oy: cam.current.y, moved: false }
    ref.current?.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    const prev = pointers.current.get(e.pointerId)
    if (prev) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()]
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const last = (drag.current as { pinch?: number } | null)?.pinch
      if (last && last > 0) {
        const vp = ref.current
        if (!vp) return
        const rect = vp.getBoundingClientRect()
        const mx = (pts[0].x + pts[1].x) / 2 - rect.left
        const my = (pts[0].y + pts[1].y) / 2 - rect.top
        const prevS = cam.current.s
        const next = Math.min(1.35, Math.max(0.38, prevS * (dist / last)))
        const wx = (mx - cam.current.x) / prevS
        const wy = (my - cam.current.y) / prevS
        cam.current.s = next
        cam.current.x = mx - wx * next
        cam.current.y = my - wy * next
        apply()
      }
      if (drag.current) (drag.current as { pinch?: number }).pinch = dist
      return
    }
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    if (Math.hypot(dx, dy) > 4) drag.current.moved = true
    cam.current.x = drag.current.ox + dx
    cam.current.y = drag.current.oy + dy
    apply()
  }
  const onPointerUp = (e: ReactPointerEvent) => {
    pointers.current.delete(e.pointerId)
    drag.current = null
  }

  const place = useGame((s) => s.yard.place)

  return (
    <div
      className="viewport"
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="world" ref={world} style={{ width: WORLD.w, height: WORLD.h }}>
        {place === "cay" ? <CayGround /> : <Ground />}
        {place === "cove" ? (
          <div className="sign" style={{ left: 450, top: 168 }}>
            <strong>Welcome to</strong>
            <b>Mango Moon</b>
          </div>
        ) : null}
        {interactive ? place === "cay" ? <CayHits /> : <Hits /> : null}
      </div>
      <div className="zoom">
        <button type="button" aria-label="Zoom in" data-testid="zoom-in" onClick={() => zoom(1)}>+</button>
        <button type="button" aria-label="Zoom out" data-testid="zoom-out" onClick={() => zoom(-1)}>−</button>
      </div>
    </div>
  )
}

function Hits() {
  const save = useGame()
  const open = useGame((s) => s.open)
  const harvest = useGame((s) => s.doHarvest)
  const tide = useGame((s) => s.doTide)
  const ferry = useGame((s) => s.doPlace)
  const now = save.now
  const entities: { y: number; node: ReactNode; key: string }[] = []

  PLOTS.forEach((plot, i) => {
    const state = save.plots[i]
    const openBed = save.unlocked[i]
    const fruit = state?.fruit
    const growing = fruit != null && state.at != null
    const def = fruit ? fruitDef(fruit) : null
    const left = def && state.at != null ? state.at + def.seconds * 1000 - now : 0
    const ready = growing && left <= 0
    const scale = !growing || !def || state.at == null ? 1 : ready ? 1 : 0.72 + 0.28 * (1 - Math.max(0, left) / (def.seconds * 1000))
    entities.push({
      key: plot.id,
      y: plot.y,
      node: (
        <button
          type="button"
          className={`hit${ready ? " is-ready" : ""}${openBed ? "" : " is-locked"}`}
          style={{ left: plot.x, top: plot.y }}
          data-testid={`plot-${plot.id}`}
          aria-label={openBed ? (fruit ? `${fruitDef(fruit).name} bed` : "Empty bed") : `Closed bed, ${plot.stones ?? 0} moonstones`}
          onClick={() => {
            if (!openBed || !ready) open({ type: "plot", id: plot.id })
            else harvest(plot.id)
          }}
        >
          {fruit ? <TreeArt fruit={fruit} scale={scale} /> : <span className="ring">{openBed ? "Plant" : plot.stones}</span>}
          {!openBed ? <em className="flag">Moon</em> : growing && def ? <em className="flag">{ready ? "Ready" : formatLeft(left)}</em> : null}
        </button>
      ),
    })
  })

  for (const b of BUILDINGS) {
    const station = b.id === "boat" ? null : (b.id as StationId)
    const unlocked = station ? stationOpen(save, station) : true
    const ready = station ? save.jobs[station].some((job) => job && jobReady(station, job, now)) : save.orders.some((o) => (save.inv[o.item] ?? 0) >= o.qty)
    entities.push({
      key: b.id,
      y: b.y,
      node: (
        <button
          type="button"
          className={`hit hit-lg${ready ? " is-ready" : ""}${unlocked ? "" : " is-locked"}`}
          style={{ left: b.x, top: b.y }}
          data-testid={`station-${b.id}`}
          aria-label={b.name}
          onClick={() => open(b.id === "boat" ? { type: "orders" } : { type: "station", id: b.id })}
        >
          <BuildingArt id={b.id} />
          <span className="nameplate">{b.name}</span>
          {!unlocked ? <em className="flag">Closed</em> : ready ? <em className="flag">Ready</em> : null}
        </button>
      ),
    })
  }

  entities.push({
    key: "tide",
    y: TIDE.y,
    node: (
      <button
        type="button"
        className={`hit hit-sm${save.tideReady ? " is-ready" : ""}`}
        style={{ left: TIDE.x, top: TIDE.y }}
        data-testid="tide"
        aria-label="Tide gift"
        onClick={() => tide()}
      >
        <span className="shell" />
        <em className="flag">{save.tideReady ? "Tide" : formatLeft(save.tideAt - now)}</em>
      </button>
    ),
  })

  entities.push({
    key: "ferry",
    y: 1080,
    node: (
      <button type="button" className="hit hit-sm" style={{ left: 100, top: 1080 }} data-testid="ferry-cay" aria-label="Ferry to Bonnet Cay" onClick={() => ferry("cay")}>
        <span className="pier" />
        <span className="nameplate">Bonnet Cay</span>
      </button>
    ),
  })

  entities.push({
    key: "granny",
    y: GRANNY.y,
    node: (
      <div className="actor" style={{ left: GRANNY.x, top: GRANNY.y }} aria-hidden="true">
        <Person who="granny" />
      </div>
    ),
  })
  entities.push({
    key: "keeper",
    y: save.keeper.y,
    node: (
      <div className="actor keeper" style={{ left: save.keeper.x, top: save.keeper.y }} aria-hidden="true">
        <Walker look={playerLook(save.yard.avatar)} />
      </div>
    ),
  })

  entities.sort((a, b) => a.y - b.y)
  return (
    <>
      {entities.map((e) => (
        <span key={e.key}>{e.node}</span>
      ))}
      <span className="sr">{FRUIT_DEFS.length} fruits in season</span>
    </>
  )
}
