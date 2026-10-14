import type { ReactNode } from "react"
import { Walker } from "@/components/game/portraits"
import { guestLook, playerLook } from "@/game/people"
import {
  EGG_HOUSE,
  EGG_MS,
  FISH_MS,
  GROW_MS,
  PENS,
  RODS,
  TRUCK_MS,
  YARD_SPOTS,
} from "@/game/yard"
import { formatLeft } from "@/game/content"
import { useGame } from "@/game/store"

export function CayGround() {
  return (
    <svg className="cay-ground" viewBox="0 0 900 1200" aria-hidden="true">
      <defs>
        <linearGradient id="cay-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8ec8e6" />
          <stop offset="55%" stopColor="#d7efe8" />
          <stop offset="100%" stopColor="#f3e2c4" />
        </linearGradient>
        <linearGradient id="cay-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1f8f96" />
          <stop offset="100%" stopColor="#0c4e62" />
        </linearGradient>
      </defs>
      <rect width="900" height="1200" fill="url(#cay-sky)" />
      <ellipse cx="160" cy="90" rx="70" ry="22" fill="#fff" opacity="0.7" />
      <ellipse cx="700" cy="120" rx="90" ry="24" fill="#fff" opacity="0.65" />
      <path d="M0 820c120-40 220 20 340-10 140-36 220 30 340 8 80-14 150 10 220-20v402H0Z" fill="url(#cay-sea)" />
      <path d="M70 980c40 30 90 10 120 36 80 60 200 20 280 70 90 54 160 10 230 40 70 28 120 8 160 30v44H40Z" fill="#e7c98a" />
      <path d="M120 430c40-180 180-250 300-230 150 24 250 40 310 160 50 100 20 230-40 300-90 110-160 80-250 120-140 60-280 20-340-40-50-50-40-180 20-310z" fill="#3f8f4e" />
      <path d="M180 520c80-20 140-10 200 20 70 34 150 10 210 40 40 20 30 70-10 90-80 40-180 10-260-10-90-24-160-30-140-140z" fill="#2f7d45" />
      <path d="M230 500c40 80 80 200 70 340" fill="none" stroke="#e7d3b0" strokeWidth="28" strokeLinecap="round" />
      <path d="M300 760c80 20 180-10 250 30 40 24 90 16 150-20" fill="none" stroke="#cbbba4" strokeWidth="22" strokeLinecap="round" />
      <path d="M520 640c80-80 160-160 230-250" fill="none" stroke="#d7c4a8" strokeWidth="26" strokeLinecap="round" />
      <g transform="translate(640 160)">
        <rect x="0" y="40" width="120" height="70" rx="4" fill="#d7c4a8" />
        <path d="M-8 40h136l-16-28H8z" fill="#8a5a3a" />
        <rect x="18" y="58" width="22" height="28" fill="#6b3e2e" />
        <rect x="70" y="54" width="30" height="18" fill="#14302e" />
        <rect x="40" y="18" width="10" height="24" fill="#5c6858" />
      </g>
      <g transform="translate(80 860)">
        <path d="M0 40c30 16 70 16 100 0v16H0z" fill="#c47a3a" />
        <rect x="34" y="10" width="6" height="30" fill="#8a5a3a" />
        <path d="M40 12c20 6 28 20 10 28" fill="#f6f1e7" />
      </g>
      <Palm x={150} y={360} />
      <Palm x={620} y={340} />
      <Palm x={800} y={620} />
      <g transform="translate(640 800)">
        <path d="M20 20c30-28 70-28 100 0" fill="none" stroke="#c4473a" strokeWidth="6" />
        <path d="M30 20c24-18 54-18 80 0" fill="none" stroke="#e7c98a" strokeWidth="6" />
        <rect x="68" y="18" width="4" height="28" fill="#8a5a3a" />
      </g>
    </svg>
  )
}

function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 80c8-30 8-60 0-80" stroke="#8a5a3a" strokeWidth="8" fill="none" />
      <ellipse cx="-18" cy="8" rx="26" ry="8" fill="#1f6b3a" transform="rotate(-30 -18 8)" />
      <ellipse cx="18" cy="6" rx="26" ry="8" fill="#2f7d45" transform="rotate(28 18 6)" />
      <ellipse cx="0" cy="-6" rx="16" ry="8" fill="#3f8f4e" />
    </g>
  )
}

export function CayHits() {
  const save = useGame()
  const open = useGame((s) => s.open)
  const place = useGame((s) => s.doPlace)
  const now = save.now
  const entities: { y: number; node: ReactNode; key: string }[] = []
  const look = playerLook(save.yard.avatar)
  const lenny = guestLook("Lenny Parks")

  PENS.forEach((pen, i) => {
    const openPen = save.yard.penOpen[i]
    const state = save.yard.pens[i]
    const left = state?.state === "growing" ? state.at + GROW_MS - now : state?.state === "truck" ? state.at + TRUCK_MS - now : 0
    const flag = !openPen ? "Closed" : state?.state === "ready" ? "Ready" : state?.state === "growing" || state?.state === "truck" ? formatLeft(left) : null
    entities.push({
      key: pen.id,
      y: pen.y,
      node: (
        <button type="button" className={`hit${!openPen ? " is-locked" : ""}${state?.state === "ready" ? " is-ready" : ""}`} style={{ left: pen.x, top: pen.y }} data-testid={`pen-${pen.id}`} aria-label={pen.name} onClick={() => open({ type: "pen", id: pen.id })}>
          <CoopArt />
          {state && state.birds > 0 && state.state !== "truck" ? <i className="birds" aria-hidden="true" /> : null}
          <span className="nameplate">{pen.name}</span>
          {flag ? <em className="flag">{flag}</em> : null}
        </button>
      ),
    })
  })

  entities.push({
    key: "eggs",
    y: EGG_HOUSE.y,
    node: (
      <button type="button" className={`hit hit-lg${!save.yard.egg.open ? " is-locked" : ""}${save.yard.egg.at != null && now >= save.yard.egg.at + EGG_MS ? " is-ready" : ""}`} style={{ left: EGG_HOUSE.x, top: EGG_HOUSE.y }} data-testid="egg-house" aria-label="Egg house" onClick={() => open({ type: "eggs" })}>
        <EggArt />
        <span className="nameplate">Egg house</span>
        <em className="flag">{!save.yard.egg.open ? "Closed" : save.yard.egg.at == null ? "Hens" : now >= save.yard.egg.at + EGG_MS ? "Ready" : formatLeft(save.yard.egg.at + EGG_MS - now)}</em>
      </button>
    ),
  })

  RODS.forEach((rod, i) => {
    const spot = save.yard.rods[i]
    const openRod = save.yard.rodOpen[i]
    const waiting = spot?.at != null
    const ready = waiting && now >= (spot?.at ?? 0) + FISH_MS
    entities.push({
      key: rod.id,
      y: rod.y,
      node: (
        <button type="button" className={`hit hit-sm${!openRod ? " is-locked" : ""}${ready ? " is-ready" : ""}`} style={{ left: rod.x, top: rod.y }} data-testid={`rod-${rod.id}`} aria-label={rod.name} onClick={() => open({ type: "rod", id: rod.id })}>
          <span className="pier" />
          <span className="nameplate">{rod.name}</span>
          <em className="flag">{!openRod ? "Closed" : ready ? "Ready" : waiting ? formatLeft((spot?.at ?? 0) + FISH_MS - now) : "Cast"}</em>
        </button>
      ),
    })
  })

  entities.push({
    key: "shop",
    y: YARD_SPOTS.shop.y,
    node: (
      <button type="button" className="hit hit-lg" style={{ left: YARD_SPOTS.shop.x, top: YARD_SPOTS.shop.y }} data-testid="yard-shop" aria-label="Feed and goods" onClick={() => open({ type: "yard" })}>
        <ShopArt />
        <span className="nameplate">{YARD_SPOTS.shop.name}</span>
      </button>
    ),
  })

  entities.push({
    key: "jerk",
    y: YARD_SPOTS.jerk.y,
    node: (
      <button type="button" className={`hit hit-lg${save.yard.beachOpen && save.yard.jerk > 0 ? " is-ready" : ""}`} style={{ left: YARD_SPOTS.jerk.x, top: YARD_SPOTS.jerk.y }} data-testid="jerk" aria-label="Lenny's pan" onClick={() => open({ type: "jerk" })}>
        <PanArt />
        <span className="nameplate">Lenny's pan</span>
        {save.yard.beachOpen ? <em className="flag">Keisha</em> : null}
      </button>
    ),
  })

  if (lenny) {
    entities.push({
      key: "lenny",
      y: YARD_SPOTS.jerk.y - 8,
      node: (
        <div className="actor" style={{ left: YARD_SPOTS.jerk.x - 70, top: YARD_SPOTS.jerk.y }} aria-hidden="true">
          <Walker look={lenny} />
        </div>
      ),
    })
  }

  const truck = save.yard.pens.findIndex((p) => p.state === "truck")
  const truckPen = truck >= 0 ? save.yard.pens[truck] : null
  const progress = truckPen ? Math.min(1, Math.max(0, (now - truckPen.at) / TRUCK_MS)) : 0
  const tx = truckPen ? PENS[truck].x + (YARD_SPOTS.factory.x - PENS[truck].x) * progress : YARD_SPOTS.factory.x - 40
  const ty = truckPen ? PENS[truck].y + (YARD_SPOTS.factory.y - PENS[truck].y) * progress : YARD_SPOTS.factory.y + 30
  entities.push({
    key: "truck",
    y: ty,
    node: (
      <div className="actor truck" style={{ left: tx, top: ty }} aria-hidden="true">
        <TruckArt />
      </div>
    ),
  })

  entities.push({
    key: "factory",
    y: YARD_SPOTS.factory.y,
    node: (
      <div className="sign sign-sm" style={{ left: YARD_SPOTS.factory.x, top: YARD_SPOTS.factory.y }}>
        <strong>Factory road</strong>
        <b>to the works</b>
      </div>
    ),
  })

  entities.push({
    key: "cay-sign",
    y: 200,
    node: (
      <div className="sign" style={{ left: 450, top: 200 }}>
        <strong>Welcome ashore</strong>
        <b>Bonnet Cay</b>
      </div>
    ),
  })

  entities.push({
    key: "ferry",
    y: YARD_SPOTS.ferry.y,
    node: (
      <button type="button" className="hit hit-sm" style={{ left: YARD_SPOTS.ferry.x, top: YARD_SPOTS.ferry.y }} data-testid="ferry-cove" aria-label="Ferry to Marva's Cove" onClick={() => place("cove")}>
        <span className="pier" />
        <span className="nameplate">To the cove</span>
      </button>
    ),
  })

  entities.push({
    key: "keeper",
    y: save.keeper.y,
    node: (
      <div className="actor keeper" style={{ left: save.keeper.x, top: save.keeper.y }} aria-hidden="true">
        <Walker look={look} />
      </div>
    ),
  })

  entities.sort((a, b) => a.y - b.y)
  return (
    <>
      {entities.map((e) => (
        <span key={e.key}>{e.node}</span>
      ))}
    </>
  )
}

function CoopArt() {
  return (
    <svg viewBox="0 0 120 90" className="sprite-svg" aria-hidden="true">
      <path d="M10 40h100v36H10z" fill="#e7d3b0" />
      <path d="M6 40h108L96 18H24z" fill="#c45c4a" />
      <rect x="48" y="50" width="22" height="26" fill="#6b3e2e" />
      <path d="M18 70h16M86 70h16" stroke="#8a5a3a" strokeWidth="4" />
    </svg>
  )
}
function EggArt() {
  return (
    <svg viewBox="0 0 140 90" className="sprite-svg" aria-hidden="true">
      <rect x="20" y="36" width="100" height="40" rx="6" fill="#f6f1e7" />
      <path d="M16 36h108L108 16H32z" fill="#c4a15a" />
      <ellipse cx="48" cy="58" rx="10" ry="12" fill="#f3e2c4" />
      <ellipse cx="70" cy="60" rx="10" ry="12" fill="#fffaf3" />
      <ellipse cx="92" cy="58" rx="10" ry="12" fill="#f3e2c4" />
    </svg>
  )
}
function ShopArt() {
  return (
    <svg viewBox="0 0 150 90" className="sprite-svg" aria-hidden="true">
      <rect x="16" y="36" width="118" height="40" fill="#0f6e6a" />
      <path d="M10 36h130l-8-16H18z" fill="#f0d7a8" />
      <rect x="28" y="48" width="28" height="20" fill="#fffaf3" />
      <rect x="64" y="48" width="28" height="20" fill="#14302e" />
      <rect x="100" y="48" width="22" height="28" fill="#6b3e2e" />
    </svg>
  )
}
function PanArt() {
  return (
    <svg viewBox="0 0 140 90" className="sprite-svg" aria-hidden="true">
      <ellipse cx="70" cy="58" rx="40" ry="14" fill="#3a2a24" />
      <ellipse cx="70" cy="52" rx="34" ry="10" fill="#c45c3a" />
      <path d="M104 54h24" stroke="#8a5a3a" strokeWidth="6" strokeLinecap="round" />
      <path d="M48 40c4-16 10-16 8 0M66 36c2-18 10-16 6 2M82 40c2-14 8-12 4 2" stroke="#5c6858" strokeWidth="3" fill="none" />
    </svg>
  )
}
function TruckArt() {
  return (
    <svg viewBox="0 0 140 70" className="sprite-svg" aria-hidden="true">
      <rect x="8" y="16" width="78" height="32" rx="3" fill="#f6f1e7" />
      <path d="M86 24h28l12 14v10H86z" fill="#c45c4a" />
      <circle cx="36" cy="52" r="8" fill="#1c241c" />
      <circle cx="104" cy="52" r="8" fill="#1c241c" />
      <text x="16" y="36" fill="#14302e" fontSize="11" fontFamily="Georgia, serif">MOON</text>
    </svg>
  )
}
