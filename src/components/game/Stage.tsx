import { BUILDINGS, PLOTS, formatLeft, fruitDef, stationOpen } from "@/game/content"
import { jobReady } from "@/game/logic"
import { playerLook } from "@/game/people"
import { EGG_MS, PENS, RODS } from "@/game/yard"
import { useGame } from "@/game/store"
import type { StationId } from "@/game/types"

export function Stage() {
  const place = useGame((s) => s.yard.place)
  return (
    <div className="stage" data-place={place} style={{ backgroundImage: `url(${place === "cay" ? "/art/look/cay.jpg" : "/art/look/cove.jpg"})` }}>
      <Keeper />
      {place === "cay" ? <CaySpots /> : <CoveSpots />}
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
        <button type="button" onClick={() => open({ type: "tasks" })}>Quests</button>
        <button type="button" onClick={() => open({ type: "shop" })}>Shop</button>
      </div>
      <button type="button" className="spot spot-sign" onClick={() => open({ type: "tasks" })}>Welcome</button>
      <button type="button" className="spot spot-granny" onClick={() => open({ type: "station", id: "press" })} aria-label="Granny Marva">
        <img src="/art/look/marva.png" alt="" />
      </button>
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
        <button type="button" onClick={() => open({ type: "tasks" })}>Quests</button>
        <button type="button" onClick={() => open({ type: "jerk" })}>Jerk</button>
      </div>
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
    </>
  )
}
