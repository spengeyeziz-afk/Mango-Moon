import { BUILDINGS, PLOTS, formatLeft, fruitDef, stationOpen } from "@/game/content"
import { jobReady } from "@/game/logic"
import { playerLook } from "@/game/people"
import { EGG_MS, PENS, RODS } from "@/game/yard"
import { useGame } from "@/game/store"
import type { StationId } from "@/game/types"

export function Stage() {
  const place = useGame((s) => s.yard.place)
  return (
    <div className="stage" data-place={place}>
      <div className="stage-paint" style={{ backgroundImage: `url(${place === "cay" ? "/art/look/cay.jpg" : "/art/look/cove.jpg"})` }} />
      <Atmosphere />
      <Keeper />
      {place === "cay" ? <CaySpots /> : <CoveSpots />}
    </div>
  )
}

function Atmosphere() {
  return (
    <div className="atmo" aria-hidden="true">
      <i className="atmo-cloud a" />
      <i className="atmo-cloud b" />
      <i className="atmo-sea" />
      <i className="atmo-glint" />
      <svg className="atmo-palm left" viewBox="0 0 80 140">
        <path d="M38 140c2-30 1-60 4-90" stroke="#1d5a32" strokeWidth="4" fill="none" />
        <path d="M42 52c-28-8-40-24-36-34 16 2 30 12 36 28z" fill="#1f7a3a" />
        <path d="M42 50c18-18 40-20 48-10-16 2-32 10-42 22z" fill="#2e8a42" />
        <path d="M40 48c-8-24 6-40 16-44-2 16-4 28-8 40z" fill="#176b34" />
        <path d="M44 54c8 10 10 22 6 32-8-8-10-18-6-30z" fill="#24924a" />
      </svg>
      <svg className="atmo-palm right" viewBox="0 0 80 140">
        <path d="M40 140c-2-28 0-58-2-88" stroke="#1d5a32" strokeWidth="4" fill="none" />
        <path d="M38 54c26-6 38-22 34-32-16 4-28 14-34 26z" fill="#1f7a3a" />
        <path d="M36 50c-16-16-38-18-46-8 16 2 30 10 40 20z" fill="#2e8a42" />
        <path d="M38 46c6-22-8-38-16-42 2 16 6 28 12 38z" fill="#176b34" />
      </svg>
    </div>
  )
}

function Keeper() {
  const id = useGame((s) => s.yard.avatar)
  const look = playerLook(id)
  return look.photo ? <img src={look.photo} alt="" className="stage-keeper" /> : null
}

function CoveSpots() {
  const save = useGame()
  const open = useGame((s) => s.open)
  const harvest = useGame((s) => s.doHarvest)
  const tide = useGame((s) => s.doTide)
  const ferry = useGame((s) => s.doPlace)
  const now = save.now
  return (
    <>
      <div className="stage-rail">
        <button type="button" onClick={() => open({ type: "market" })}>Basket</button>
        <button type="button" onClick={() => open({ type: "shop" })}>Shop</button>
      </div>
      <button type="button" className="spot spot-sign" onClick={() => open({ type: "tasks" })} aria-label="Welcome to Mango Moon" />
      <button type="button" className="spot spot-granny" onClick={() => open({ type: "station", id: "press" })} aria-label="Granny Marva">
        <img src="/art/look/marva.png" alt="" />
      </button>
      <div className="stage-actions">
        <div className="bed-row">
          {PLOTS.map((plot, i) => {
            const state = save.plots[i]
            const fruit = state?.fruit
            const def = fruit ? fruitDef(fruit) : null
            const left = def && state?.at != null ? state.at + def.seconds * 1000 - now : 0
            const ready = fruit != null && left <= 0
            const openBed = save.unlocked[i]
            return (
              <button
                key={plot.id}
                type="button"
                className={`bed-chip${ready ? " is-ready" : ""}`}
                data-testid={`plot-${plot.id}`}
                onClick={() => {
                  if (!openBed || !ready) open({ type: "plot", id: plot.id })
                  else harvest(plot.id)
                }}
              >
                <b>{openBed ? (fruit ? fruitDef(fruit).name : "Plant") : "Closed"}</b>
                <small>{!openBed ? `${plot.stones ?? 0} stones` : ready ? "Ready" : fruit && def ? formatLeft(left) : "Bed"}</small>
              </button>
            )
          })}
        </div>
        <div className="spot-row">
          {BUILDINGS.map((b) => {
            const station = b.id === "boat" ? null : (b.id as StationId)
            const unlocked = station ? stationOpen(save, station) : true
            const ready = station ? save.jobs[station].some((job) => job && jobReady(station, job, now)) : save.orders.some((o) => (save.inv[o.item] ?? 0) >= o.qty)
            return (
              <button
                key={b.id}
                type="button"
                className={`spot-btn${ready ? " is-ready" : ""}`}
                data-testid={`station-${b.id}`}
                onClick={() => open(b.id === "boat" ? { type: "orders" } : { type: "station", id: b.id })}
              >
                {b.name}
                {!unlocked ? <small>Closed</small> : ready ? <small>Ready</small> : null}
              </button>
            )
          })}
          <button type="button" className={`spot-btn${save.tideReady ? " is-ready" : ""}`} data-testid="tide" onClick={() => tide()}>
            Tide
            <small>{save.tideReady ? "Ready" : formatLeft(save.tideAt - now)}</small>
          </button>
          <button type="button" className="spot-btn" data-testid="ferry-cay" onClick={() => ferry("cay")}>Bonnet Cay</button>
        </div>
      </div>
    </>
  )
}

function CaySpots() {
  const save = useGame()
  const open = useGame((s) => s.open)
  const place = useGame((s) => s.doPlace)
  const now = save.now
  return (
    <>
      <div className="stage-rail">
        <button type="button" onClick={() => open({ type: "yard" })}>Goods</button>
        <button type="button" onClick={() => open({ type: "jerk" })}>Jerk</button>
      </div>
      <div className="stage-actions">
        <div className="spot-row">
          {PENS.map((pen, i) => (
            <button key={pen.id} type="button" className="spot-btn" data-testid={`pen-${pen.id}`} onClick={() => open({ type: "pen", id: pen.id })}>
              {pen.name}
              <small>{save.yard.penOpen[i] ? save.yard.pens[i]?.state ?? "open" : "Closed"}</small>
            </button>
          ))}
          <button type="button" className="spot-btn" data-testid="egg-house" onClick={() => open({ type: "eggs" })}>
            Egg house
            <small>{save.yard.egg.at != null && now >= save.yard.egg.at + EGG_MS ? "Ready" : save.yard.egg.open ? "Open" : "Closed"}</small>
          </button>
          {RODS.map((rod, i) => {
            const at = save.yard.rods[i]?.at
            const ready = at != null && now >= at
            return (
              <button key={rod.id} type="button" className={`spot-btn${ready ? " is-ready" : ""}`} data-testid={`rod-${rod.id}`} onClick={() => open({ type: "rod", id: rod.id })}>
                {rod.name}
                <small>{save.yard.rodOpen[i] ? (ready ? "Ready" : "Cast") : "Closed"}</small>
              </button>
            )
          })}
          <button type="button" className="spot-btn" data-testid="yard-shop" onClick={() => open({ type: "yard" })}>Feed shop</button>
          <button type="button" className="spot-btn" data-testid="jerk" onClick={() => open({ type: "jerk" })}>
            Lenny's pan
          </button>
          <button type="button" className="spot-btn" data-testid="ferry-cove" onClick={() => place("cove")}>Marva's Cove</button>
        </div>
      </div>
    </>
  )
}
