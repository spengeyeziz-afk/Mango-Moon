import { useState } from "react"
import { ItemGlyph, Person } from "@/components/game/art"
import { AvatarPicker, Portrait } from "@/components/game/portraits"
import { GUESTS, guestLook, playerLook } from "@/game/people"
import {
  BUILDINGS,
  FRUIT_DEFS,
  ITEMS,
  OFFERS,
  PLOTS,
  QUESTS,
  RECIPES,
  WINES,
  activeQuest,
  bundles,
  energyCap,
  formatLeft,
  fruitDef,
  fruitOpen,
  grannyLine,
  helpSteps,
  levelInfo,
  recipeOpen,
  stationHint,
  stationOpen,
} from "@/game/content"
import { adDayKey, jobReady, nextEnergyMs, wineFrac, wineStage } from "@/game/logic"
import { useGame } from "@/game/store"
import type { ItemId, Save, StationId } from "@/game/types"
import {
  EGG_HOUSE,
  EGG_MS,
  EGG_YIELD,
  FEED_PACK,
  FISH_MS,
  GROW_MS,
  PENS,
  RODS,
  SPICE_TIN,
  STOCK_BIRDS,
  STOCK_FEED,
  YARD_QUESTS,
  YARD_SELL,
  activeYardQuest,
} from "@/game/yard"
import { X } from "lucide-react"

export function Sheets() {
  const sheet = useGame((s) => s.ui.sheet)
  const close = useGame((s) => s.close)
  if (!sheet) return null
  return (
    <div className="sheet-back" onClick={close} role="presentation">
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Cove panel"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="icon-x" onClick={close} aria-label="Close" data-testid="close-sheet">
          <X />
        </button>
        <div className="sheet-body">
          <Body />
        </div>
      </div>
    </div>
  )
}

function Body() {
  const sheet = useGame((s) => s.ui.sheet)
  if (!sheet) return null
  if (sheet.type === "plot") return <PlotSheet id={sheet.id} />
  if (sheet.type === "station") return <StationSheet id={sheet.id} />
  if (sheet.type === "tasks") return <Tasks />
  if (sheet.type === "orders") return <Orders />
  if (sheet.type === "market") return <Market />
  if (sheet.type === "book") return <Book />
  if (sheet.type === "settings") return <Settings />
  if (sheet.type === "help") return <Help />
  if (sheet.type === "sun") return <Sun />
  if (sheet.type === "level") return <Level />
  if (sheet.type === "shop") return <Shop />
  if (sheet.type === "pen") return <PenSheet id={sheet.id} />
  if (sheet.type === "rod") return <RodSheet id={sheet.id} />
  if (sheet.type === "eggs") return <EggSheet />
  if (sheet.type === "jerk") return <JerkSheet />
  if (sheet.type === "yard") return <YardShop />
  if (sheet.type === "avatar") return <AvatarSheet />
  if (sheet.type === "privacy") return <Privacy />
  if (sheet.type === "terms") return <Terms />
  if (sheet.type === "about") return <About />
  return null
}

function PlotSheet({ id }: { id: string }) {
  const save = useGame()
  const plant = useGame((s) => s.doPlant)
  const harvest = useGame((s) => s.doHarvest)
  const uproot = useGame((s) => s.doUproot)
  const unlock = useGame((s) => s.doUnlock)
  const i = PLOTS.findIndex((p) => p.id === id)
  const meta = PLOTS[i]
  const plot = save.plots[i]
  if (!meta || !plot) return <p>That bed is gone.</p>
  if (!save.unlocked[i]) {
    return (
      <>
        <h2>Closed bed</h2>
        <p className="muted">Close to the press and the water. These beds open with moonstones only, not coins.</p>
        <div className="pay-row">
          <button type="button" className="btn btn-primary" data-testid={`unlock-stones-${meta.id}`} onClick={() => unlock(meta.id, "stones")}>
            {meta.stones} moonstones
          </button>
        </div>
      </>
    )
  }
  if (plot.fruit && plot.at != null) {
    const def = fruitDef(plot.fruit)
    const left = plot.at + def.seconds * 1000 - save.now
    const ready = left <= 0
    return (
      <>
        <h2>{def.name}</h2>
        <p className="muted">{def.sub}. Yields {def.yield}.</p>
        <p className="stat">{ready ? "Ready to pick" : `${formatLeft(left)} left`}</p>
        {ready ? (
          <button type="button" className="btn btn-primary" data-testid="harvest" onClick={() => harvest(meta.id)}>
            Pick · 1 sun
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={() => uproot(meta.id)}>
            Pull it up
          </button>
        )}
      </>
    )
  }
  const locked = FRUIT_DEFS.filter((f) => !fruitOpen(save, f.id))
  return (
    <>
      <h2>Plant</h2>
      <p className="muted">One sunlight. The bed is free again after you pick.</p>
      <div className="grid-fruits">
        {FRUIT_DEFS.filter((f) => fruitOpen(save, f.id)).map((f) => (
          <button key={f.id} type="button" className="fruit-card" data-testid={`plant-${f.id}`} onClick={() => plant(meta.id, f.id)}>
            <ItemGlyph id={f.id} />
            <strong>{f.name}</strong>
            <small>{f.sub}</small>
            <small>{f.seconds}s · ×{f.yield}</small>
          </button>
        ))}
      </div>
      {locked[0] ? <p className="hint">Next in the grove: {locked[0].name}. {locked[0].after ? "Keep the tasks moving." : ""}</p> : null}
    </>
  )
}

function StationSheet({ id }: { id: StationId }) {
  const save = useGame()
  const building = BUILDINGS.find((b) => b.id === id)
  const open = stationOpen(save, id)
  return (
    <>
      <h2>{building?.name}</h2>
      <p className="muted">{building?.blurb}</p>
      {id === "press" ? <Quote save={save} /> : null}
      {!open ? <p className="hint">{stationHint(id)}</p> : id === "cellar" ? <Cellar save={save} /> : <Work station={id} save={save} />}
    </>
  )
}

function Quote({ save }: { save: Save }) {
  const deliver = useGame((s) => s.doDeliver)
  const ready = !save.delivered && save.claimed.includes("pick-pair")
  return (
    <div className="quote">
      <Person who="granny" />
      <div>
        <strong>Granny Marva</strong>
        <p>{grannyLine(save)}</p>
        {ready ? (
          <button type="button" className="btn btn-primary" data-testid="deliver" onClick={() => deliver()} disabled={save.inv.cherry < 2 || save.inv.tamarind < 2}>
            Bring 2 cherry and 2 tamarind ({save.inv.cherry}/2, {save.inv.tamarind}/2)
          </button>
        ) : null}
      </div>
    </div>
  )
}

function Work({ station, save }: { station: Exclude<StationId, "cellar">; save: Save & { now: number } }) {
  const start = useGame((s) => s.doStart)
  const collect = useGame((s) => s.doCollect)
  const instant = useGame((s) => s.doInstant)
  const list = RECIPES.filter((r) => r.station === station && recipeOpen(save, r.after))
  const next = RECIPES.find((r) => r.station === station && !recipeOpen(save, r.after))
  return (
    <>
      <Slots station={station} save={save} onCollect={collect} onInstant={instant} />
      <div className="rows">
        {list.map((r) => {
          const missing = r.inputs.find((n) => (save.inv[n.item] ?? 0) < n.qty)
          const busy = save.jobs[station].every((j) => j != null)
          const low = save.energy < 1
          const reason = low ? "No sun" : busy ? "Busy" : missing ? "Short" : "Make"
          return (
            <button key={r.id} type="button" className="row" data-testid={`make-${r.id}`} disabled={reason !== "Make"} onClick={() => start(station, r.id)}>
              <ItemGlyph id={r.output} />
              <span>
                <strong>{r.name}</strong>
                <small>
                  {r.inputs.map((n) => `${n.qty} ${ITEMS[n.item].name}`).join(", ")} · {r.seconds}s
                </small>
              </span>
              <em>{reason}</em>
            </button>
          )
        })}
      </div>
      {next ? <p className="hint">{next.hint}</p> : null}
    </>
  )
}

function Slots({
  station,
  save,
  onCollect,
  onInstant,
}: {
  station: StationId
  save: Save & { now: number }
  onCollect: (station: StationId, index: number) => void
  onInstant: (station: StationId, index: number) => void
}) {
  return (
    <div className="slots">
      {save.jobs[station].map((job, index) => {
        if (!job) return <div key={index} className="slot empty">Open</div>
        if (station === "cellar") return null
        const recipe = RECIPES.find((r) => r.id === job.recipe)
        const left = recipe ? job.at + recipe.seconds * 1000 - save.now : 0
        const ready = left <= 0
        return (
          <div key={index} className="slot">
            <span>{recipe?.name ?? "Working"}</span>
            <strong>{ready ? "Ready" : formatLeft(left)}</strong>
            {ready ? (
              <button type="button" className="btn btn-primary" data-testid={`collect-${station}-${index}`} onClick={() => onCollect(station, index)}>
                Collect
              </button>
            ) : (
              <button type="button" className="btn btn-ghost" onClick={() => onInstant(station, index)}>
                Finish · 1 stone
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Cellar({ save }: { save: Save & { now: number } }) {
  const start = useGame((s) => s.doStart)
  const collect = useGame((s) => s.doCollect)
  const instant = useGame((s) => s.doInstant)
  const openWines = WINES.filter((w) => recipeOpen(save, w.after))
  const next = WINES.find((w) => !recipeOpen(save, w.after))
  return (
    <>
      <p className="muted">Young, rested, vintage. Cork whenever a mark has filled. Later marks sell for more.</p>
      <div className="slots">
        {save.jobs.cellar.map((job, index) => {
          if (!job) return <div key={index} className="slot empty">Empty rack</div>
          const wine = WINES.find((w) => w.id === job.recipe)
          if (!wine) return null
          const stage = wineStage(job, wine.seconds, save.now)
          const frac = wineFrac(job, wine.seconds, save.now)
          const ready = stage >= 0
          const age = stage === 0 ? wine.ages[0] : stage === 1 ? wine.ages[1] : stage === 2 ? wine.ages[2] : "Still going under"
          const cork = stage === 0 ? "Young" : stage === 1 ? "Rested" : "Vintage"
          return (
            <div key={index} className="slot">
              <span>{wine.name}</span>
              <div className="meter" aria-hidden="true">
                {frac.parts.map((p, i) => (
                  <i key={i}><b style={{ width: `${Math.round(p * 100)}%` }} /></i>
                ))}
              </div>
              <small>{age}</small>
              {ready ? (
                <button type="button" className="btn btn-primary" data-testid={`collect-cellar-${index}`} onClick={() => collect("cellar", index)}>
                  Cork · {cork}
                </button>
              ) : (
                <button type="button" className="btn btn-ghost" onClick={() => instant("cellar", index)}>
                  Skip a season · 1 stone
                </button>
              )}
            </div>
          )
        })}
      </div>
      <div className="rows">
        {openWines.map((w) => {
          const missing = w.inputs.find((n) => (save.inv[n.item] ?? 0) < n.qty)
          const busy = save.jobs.cellar.every((j) => j != null)
          const reason = save.energy < 1 ? "No sun" : busy ? "Full" : missing ? "Short" : "Lay down"
          return (
            <button key={w.id} type="button" className="row" data-testid={`make-wine-${w.id}`} disabled={reason !== "Lay down"} onClick={() => start("cellar", w.id)}>
              <ItemGlyph id={`wine-${w.id}-0`} />
              <span>
                <strong>{w.name}</strong>
                <small>{w.inputs.map((n) => `${n.qty} ${ITEMS[n.item].name}`).join(", ")}</small>
              </span>
              <em>{reason}</em>
            </button>
          )
        })}
      </div>
      {next ? <p className="hint">{next.hint}</p> : null}
    </>
  )
}

function Tasks() {
  const save = useGame()
  const current = activeQuest(save)
  return (
    <>
      <h2>Tasks</h2>
      <p className="section-label">Marva's Cove</p>
      <ol className="quests">
        {QUESTS.map((q) => {
          const done = save.claimed.includes(q.id)
          const isCurrent = current?.id === q.id
          const progress = Math.min(q.goal, q.progress(save))
          return (
            <li key={q.id} className={done ? "done" : isCurrent ? "now" : "wait"}>
              <strong>{q.title}</strong>
              {done || isCurrent ? <p>{q.detail}</p> : null}
              {isCurrent ? <small>{progress}/{q.goal} · {q.coins} coins</small> : null}
              {done ? <small>Done</small> : null}
            </li>
          )
        })}
      </ol>
      <p className="section-label">Bonnet Cay</p>
      <ol className="quests">
        {YARD_QUESTS.map((q) => {
          const done = save.yard.claimed.includes(q.id)
          const isCurrent = activeYardQuest(save)?.id === q.id
          const progress = Math.min(q.goal, q.progress(save))
          return (
            <li key={q.id} className={done ? "done" : isCurrent ? "now" : "wait"}>
              <strong>{q.title}</strong>
              {done || isCurrent ? <p>{q.detail}</p> : null}
              {isCurrent ? <small>{progress}/{q.goal} · {q.coins} coins</small> : null}
              {done ? <small>Done</small> : null}
            </li>
          )
        })}
      </ol>
    </>
  )
}

function Face({ name }: { name: string }) {
  const look = guestLook(name)
  if (look) return <Portrait look={look} />
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("")
  return <span className="face face-letter" aria-hidden="true">{initials}</span>
}

function Orders() {
  const save = useGame()
  const fill = useGame((s) => s.doFill)
  return (
    <>
      <h2>Mail boat</h2>
      <p className="muted">Orders pay more than the market. Loose fruit still sells if you are short on time.</p>
      <div className="rows">
        {save.orders.map((o) => {
          const have = save.inv[o.item] ?? 0
          const ok = have >= o.qty
          return (
            <div key={o.id} className="row static with-face">
              <Face name={o.guest} />
              <span>
                <strong>{o.guest}</strong>
                <small>{o.line}</small>
                <small>{o.qty} {ITEMS[o.item].name} · you have {have} · {formatLeft(o.due - save.now)}</small>
              </span>
              <button type="button" className="btn btn-primary" data-testid={`fill-${o.id}`} disabled={!ok} onClick={() => fill(o.id)}>
                {o.coins}
              </button>
            </div>
          )
        })}
      </div>
      {save.orders.length === 0 ? <p className="hint">The boat is between calls.</p> : null}
    </>
  )
}

function Market() {
  const save = useGame()
  const sell = useGame((s) => s.doSell)
  const buy = useGame((s) => s.doBuy)
  const held = (Object.keys(save.inv) as ItemId[]).filter((id) => save.inv[id] > 0)
  return (
    <>
      <h2>Market</h2>
      <p className="section-label">Sell</p>
      {held.length === 0 ? <p className="muted">Your baskets are empty.</p> : null}
      <div className="rows">
        {held.map((id) => (
          <div key={id} className="row static">
            <ItemGlyph id={id} />
            <span>
              <strong>{ITEMS[id].name}</strong>
              <small>{save.inv[id]} · {ITEMS[id].sell} each</small>
            </span>
            <button type="button" className="btn btn-ghost" data-testid={`sell-${id}`} onClick={() => sell(id, save.inv[id])}>
              Sell
            </button>
          </div>
        ))}
      </div>
      <p className="section-label">Buy a basket</p>
      <p className="muted">Baskets cost thousands of coins. Growing on the cove is the cheaper way.</p>
      <div className="rows">
        {bundles().filter((b) => fruitOpen(save, b.item)).map((b) => (
          <button key={b.id} type="button" className="row" data-testid={`buy-${b.id}`} onClick={() => buy(b.item, b.qty, b.cost)}>
            <ItemGlyph id={b.item} />
            <span>
              <strong>{b.qty} {fruitDef(b.item).name}</strong>
              <small>Faster than growing, worse than orders.</small>
            </span>
            <em>{b.cost}</em>
          </button>
        ))}
      </div>
    </>
  )
}

function Book() {
  const save = useGame()
  const known = (Object.keys(ITEMS) as ItemId[]).filter((id) => {
    if (save.inv[id] > 0) return true
    if ((save.stats.crafted[id] ?? 0) > 0) return true
    if ((FRUIT_DEFS as { id: string }[]).some((f) => f.id === id) && save.stats.harvested[id as keyof Save["stats"]["harvested"]] > 0) return true
    return false
  })
  return (
    <>
      <h2>Cove book</h2>
      <div className="people">
        <figure>
          <Portrait look={playerLook(save.yard.avatar)} className="book-face" />
          <figcaption>
            <strong>{playerLook(save.yard.avatar).name}</strong>
            <small>{playerLook(save.yard.avatar).role}</small>
            <small>{playerLook(save.yard.avatar).line}</small>
          </figcaption>
        </figure>
        {GUESTS.map((p) => (
          <figure key={p.id}>
            <Portrait look={p} className="book-face" />
            <figcaption>
              <strong>{p.name}</strong>
              <small>{p.role}</small>
              <small>{p.line}</small>
            </figcaption>
          </figure>
        ))}
      </div>
      {known.length === 0 ? <p className="muted">Press, blend, bake, or bottle something and it will be written here.</p> : null}
      <div className="rows">
        {known.map((id) => (
          <div key={id} className="row static">
            <ItemGlyph id={id} />
            <span>
              <strong>{ITEMS[id].name}</strong>
              <small>{ITEMS[id].blurb}</small>
            </span>
          </div>
        ))}
      </div>
      <p className="hint">Wine labels use the cove calendar. A minute here is a season there.</p>
    </>
  )
}

export function TokenAsk({ open, onClose }: { open: boolean; onClose: () => void }) {
  const watch = useGame((s) => s.doWatchAd)
  if (!open) return null
  return (
    <div className="ask-layer" role="dialog" aria-labelledby="earn-title">
      <div className="ask-card">
        <h3 id="earn-title">Earn Free Tokens</h3>
        <p>Watch a short video to receive 50 Tokens?</p>
        <div className="ask-actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose()
              watch()
            }}
          >
            Watch
          </button>
        </div>
      </div>
    </div>
  )
}

function Shop() {
  const [ask, setAsk] = useState(false)
  const used = useGame((s) => (s.adDay === adDayKey(s.now) ? s.adsToday : 0))
  return (
    <>
      <h2>Moon stall</h2>
      <section className="earn-card">
        <h3>Earn Free Tokens</h3>
        <p>Watch a short test ad for 50 tokens. {Math.max(0, 4 - used)} free today.</p>
        <button
          type="button"
          className="btn btn-primary"
          data-testid="watch-ad-tokens"
          onClick={() => {
            if (used >= 4) {
              useGame.getState().doWatchAd()
              return
            }
            setAsk(true)
          }}
        >
          Watch Ad for Tokens
        </button>
      </section>
      <TokenAsk open={ask} onClose={() => setAsk(false)} />
      <p className="muted">
        PayHere takes the payment on their page. This game does not add moonstones or coins from a button. A pack is added only after PayHere confirms the payment, which this preview cannot see.
      </p>
      <div className="offer-row">
        {OFFERS.map((offer) => (
          <article key={offer.id} className="offer">
            <p className="offer-kicker">{offer.price}</p>
            <h3>{offer.name}</h3>
            <p>{offer.blurb}</p>
            <ul>
              {offer.perks.map((perk) => (
                <li key={perk}>{perk}</li>
              ))}
            </ul>
            <a className="btn btn-primary" href={offer.url} target="_blank" rel="noopener noreferrer" data-testid={`pay-${offer.id}`}>
              Pay {offer.price} on PayHere
            </a>
          </article>
        ))}
      </div>
      <p className="hint">Closed orchard beds take moonstones only. Feed, baskets, and Bonnet Cay buildings take coins, often in the thousands.</p>
    </>
  )
}

function Settings() {
  const save = useGame()
  const setSetting = useGame((s) => s.setSetting)
  const reset = useGame((s) => s.reset)
  const open = useGame((s) => s.open)
  return (
    <>
      <h2>Settings</h2>
      <p className="section-label">Who is walking</p>
      <AvatarPicker />
      <Switch label="Music" on={save.settings.music} onChange={(v) => setSetting("music", v)} />
      <Switch label="Sounds" on={save.settings.sfx} onChange={(v) => setSetting("sfx", v)} />
      <Switch label="Gentle motion" on={save.settings.motion} onChange={(v) => setSetting("motion", v)} />
      <button type="button" className="btn btn-ghost" onClick={() => open({ type: "help" })}>How the cove works</button>
      <button type="button" className="btn btn-ghost" onClick={() => open({ type: "about" })}>About</button>
      <button type="button" className="btn btn-ghost" onClick={() => open({ type: "privacy" })}>Privacy policy</button>
      <button type="button" className="btn btn-ghost" onClick={() => open({ type: "terms" })}>Terms of use</button>
      <Reset onReset={reset} />
    </>
  )
}

function Reset({ onReset }: { onReset: () => void }) {
  const armed = useGame((s) => s.toasts.some((t) => t.text === "Tap reset again to clear the cove."))
  const poke = () => {
    if (armed) onReset()
    else useGame.setState((s) => ({ toasts: [...s.toasts, { id: Date.now(), text: "Tap reset again to clear the cove.", until: Date.now() + 2600 }].slice(-3) }))
  }
  return (
    <button type="button" className="btn btn-danger" data-testid="reset" onClick={poke}>
      {armed ? "Clear the cove" : "Reset this cove"}
    </button>
  )
}

function Switch({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className="switch" role="switch" aria-checked={on} onClick={() => onChange(!on)}>
      <span>{label}</span>
      <i data-on={on ? "1" : "0"} />
    </button>
  )
}

function Help() {
  return (
    <>
      <h2>How the cove works</h2>
      <ol className="quests">
        {helpSteps().map((s) => (
          <li key={s.title} className="now">
            <strong>{s.title}</strong>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="hint">Granny Marva runs the press. Her people come from more than one shore, and so does the cooking.</p>
    </>
  )
}

function Sun() {
  const save = useGame()
  const refill = useGame((s) => s.doRefill)
  const cap = energyCap(save.xp)
  const wait = nextEnergyMs(save, save.now)
  return (
    <>
      <h2>Sunlight</h2>
      <p className="stat">{save.energy}/{cap}</p>
      <p className="muted">{save.energy >= cap ? "Full. Spend some on the grove." : `Next point in ${formatLeft(wait)}.`}</p>
      <button type="button" className="btn btn-primary" onClick={() => refill()}>Restore · 2 moonstones</button>
    </>
  )
}

function Level() {
  const save = useGame()
  const info = levelInfo(save.xp)
  return (
    <>
      <h2>{info.rank}</h2>
      <p className="muted">Level {info.level} · Marva's Cove</p>
      <p className="stat">{info.next == null ? "Seasoned" : `${save.xp}/${info.next} xp`}</p>
      <ul className="stats">
        <li>Mangoes picked {save.stats.harvested.mango}</li>
        <li>Jars pressed {save.stats.pressCollects}</li>
        <li>Bottles corked {save.stats.young + save.stats.rested + save.stats.vintage}</li>
        <li>Orders filled {save.stats.orders}</li>
        <li>Factory trucks {save.yard.trucks}</li>
        <li>Fish landed {save.yard.caught}</li>
      </ul>
    </>
  )
}

function PayChoice({ coins, stones, onPay }: { coins: number; stones: number; onPay: (pay: "coins" | "stones") => void }) {
  return (
    <div className="pay-row">
      <button type="button" className="btn btn-primary" onClick={() => onPay("coins")}>{coins.toLocaleString("en-US")} coins</button>
      <button type="button" className="btn btn-ghost" onClick={() => onPay("stones")}>{stones} moonstones</button>
    </div>
  )
}

function PenSheet({ id }: { id: string }) {
  const save = useGame()
  const stock = useGame((s) => s.doStock)
  const truck = useGame((s) => s.doTruck)
  const hold = useGame((s) => s.doHold)
  const unlock = useGame((s) => s.doUnlockPen)
  const i = PENS.findIndex((p) => p.id === id)
  const meta = PENS[i]
  const pen = save.yard.pens[i]
  if (!meta || !pen) return <p>That coop is gone.</p>
  if (!save.yard.penOpen[i]) {
    return (
      <>
        <h2>{meta.name}</h2>
        <p className="muted">Still shut. Thousands of coins, or a purse of moonstones.</p>
        <PayChoice coins={meta.coins} stones={meta.stones} onPay={(pay) => unlock(meta.id, pay)} />
      </>
    )
  }
  const left = pen.state === "growing" ? pen.at + GROW_MS - save.now : 0
  return (
    <>
      <h2>{meta.name}</h2>
      <p className="muted">Feed in the shed: {save.yard.feed}. A batch is {STOCK_FEED} feed for {STOCK_BIRDS} birds.</p>
      {pen.state === "empty" ? <button type="button" className="btn btn-primary" data-testid={`stock-${meta.id}`} onClick={() => stock(meta.id)}>Stock · 1 sun</button> : null}
      {pen.state === "growing" ? <p className="stat">{formatLeft(left)} until ready</p> : null}
      {pen.state === "ready" ? (
        <>
          <button type="button" className="btn btn-primary" data-testid={`truck-${meta.id}`} onClick={() => truck(meta.id)}>Call the factory truck</button>
          <button type="button" className="btn btn-ghost" onClick={() => hold(meta.id)}>Hold for Lenny's pan</button>
        </>
      ) : null}
      {pen.state === "truck" ? <p className="stat">The truck is on the factory road.</p> : null}
    </>
  )
}

function RodSheet({ id }: { id: string }) {
  const save = useGame()
  const cast = useGame((s) => s.doCast)
  const reel = useGame((s) => s.doReel)
  const unlock = useGame((s) => s.doUnlockRod)
  const i = RODS.findIndex((r) => r.id === id)
  const meta = RODS[i]
  const rod = save.yard.rods[i]
  if (!meta || !rod) return <p>That water is gone.</p>
  if (!save.yard.rodOpen[i]) {
    return (
      <>
        <h2>{meta.name}</h2>
        <p className="muted">More water, more coins. Moonstones open it faster.</p>
        <PayChoice coins={meta.coins} stones={meta.stones} onPay={(pay) => unlock(meta.id, pay)} />
      </>
    )
  }
  const ready = rod.at != null && save.now >= rod.at + FISH_MS
  return (
    <>
      <h2>{meta.name}</h2>
      <p className="muted">Fish in the basket: {save.yard.fish}. Sell them at the goods shop.</p>
      {rod.at == null ? <button type="button" className="btn btn-primary" data-testid={`cast-${meta.id}`} onClick={() => cast(meta.id)}>Cast · 1 sun</button> : null}
      {rod.at != null && !ready ? <p className="stat">{formatLeft(rod.at + FISH_MS - save.now)} on the line</p> : null}
      {ready ? <button type="button" className="btn btn-primary" onClick={() => reel(meta.id)}>Reel in</button> : null}
    </>
  )
}

function EggSheet() {
  const save = useGame()
  const unlock = useGame((s) => s.doUnlockEggs)
  const start = useGame((s) => s.doStartEggs)
  const collect = useGame((s) => s.doCollectEggs)
  if (!save.yard.egg.open) {
    return (
      <>
        <h2>Egg house</h2>
        <p className="muted">One pantry is free. The hens wait on a bigger purse.</p>
        <PayChoice coins={EGG_HOUSE.coins} stones={EGG_HOUSE.stones} onPay={(pay) => unlock(pay)} />
      </>
    )
  }
  const at = save.yard.egg.at
  const ready = at != null && save.now >= at + EGG_MS
  return (
    <>
      <h2>Egg house</h2>
      <p className="muted">{EGG_YIELD} eggs for 1 feed. You are holding {save.yard.eggs}.</p>
      {at == null ? <button type="button" className="btn btn-primary" onClick={() => start()}>Set the hens · 1 sun</button> : null}
      {at != null && !ready ? <p className="stat">{formatLeft(at + EGG_MS - save.now)}</p> : null}
      {ready ? <button type="button" className="btn btn-primary" onClick={() => collect()}>Collect the tray</button> : null}
    </>
  )
}

function JerkSheet() {
  const save = useGame()
  const sauce = useGame((s) => s.doSauce)
  const jerk = useGame((s) => s.doJerk)
  const serve = useGame((s) => s.doServe)
  const keisha = guestLook("Keisha Grant")
  const lenny = guestLook("Lenny Parks")
  return (
    <>
      <h2>Lenny's pan</h2>
      <div className="people people-inline">
        {lenny ? <figure><Portrait look={lenny} /><figcaption><strong>{lenny.name}</strong><small>{lenny.line}</small></figcaption></figure> : null}
        {keisha ? <figure><Portrait look={keisha} /><figcaption><strong>{keisha.name}</strong><small>{keisha.line}</small></figcaption></figure> : null}
      </div>
      <p className="muted">Sauce {save.yard.sauce} · spice {save.yard.spice} · cold birds {save.yard.birds} · plates {save.yard.jerk}</p>
      <button type="button" className="btn btn-primary" onClick={() => sauce()}>Special sauce · mango, tamarind, spice</button>
      <button type="button" className="btn btn-ghost" onClick={() => jerk()}>Jerk one bird · 1 sun</button>
      <button type="button" className="btn btn-primary" disabled={!save.yard.beachOpen || save.yard.jerk < 1} onClick={() => serve()}>
        {save.yard.beachOpen ? "Serve Keisha · 2,200" : "Keisha is between boats"}
      </button>
    </>
  )
}

function YardShop() {
  const save = useGame()
  const feed = useGame((s) => s.doBuyFeed)
  const spice = useGame((s) => s.doBuySpice)
  const sell = useGame((s) => s.doSellYard)
  const goods = [
    ["eggs", "Eggs", save.yard.eggs],
    ["fish", "Fish", save.yard.fish],
    ["birds", "Cold birds", save.yard.birds],
    ["sauce", "Sauce", save.yard.sauce],
    ["jerk", "Jerk plates", save.yard.jerk],
  ] as const
  return (
    <>
      <h2>Feed and goods</h2>
      <p className="muted">Coins only. A feed sack is {FEED_PACK.cost.toLocaleString("en-US")} for {FEED_PACK.qty}. Spice is {SPICE_TIN.cost.toLocaleString("en-US")} for {SPICE_TIN.qty}.</p>
      <button type="button" className="btn btn-primary" data-testid="buy-feed" onClick={() => feed()}>Buy feed · {FEED_PACK.cost.toLocaleString("en-US")}</button>
      <button type="button" className="btn btn-ghost" onClick={() => spice()}>Buy spice · {SPICE_TIN.cost.toLocaleString("en-US")}</button>
      <p className="section-label">Sell</p>
      <div className="rows">
        {goods.map(([kind, label, have]) => (
          <div key={kind} className="row static">
            <span className="dot" />
            <span>
              <strong>{label}</strong>
              <small>{have} · {YARD_SELL[kind].toLocaleString("en-US")} each</small>
            </span>
            <button type="button" className="btn btn-ghost" disabled={have <= 0} onClick={() => sell(kind, have)}>Sell</button>
          </div>
        ))}
      </div>
    </>
  )
}

function AvatarSheet() {
  return (
    <>
      <h2>Who is walking</h2>
      <AvatarPicker />
    </>
  )
}

function Privacy() {
  return (
    <>
      <h2>Privacy policy</h2>
      <p>Mango Moon does not collect personal data by itself. Progress, settings, and the keeper you choose stay in this browser, on this device.</p>
      <p>The game does not ask for an account, and it does not send your orchard, coins, or moonstones to a server.</p>
      <p>If ads are added later, a third-party network such as Google AdMob may collect device and advertising data under its own rules. No ads are loaded in this version.</p>
      <p>
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google advertising privacy policy</a>
      </p>
      <p>Questions: <a href="mailto:spengeyeziz@gmail.com">spengeyeziz@gmail.com</a></p>
    </>
  )
}

function Terms() {
  return (
    <>
      <h2>Terms of use</h2>
      <p>Mango Moon is a game for entertainment. Fruit, coins, moonstones, and timers are fictional and have no cash value.</p>
      <p>PayHere checkout, if you use it, is handled on PayHere's site under their terms. This game does not add a pack from a button.</p>
      <p>The cove, Bonnet Cay, and the people in it are a game. They are not a promise about any real place or person.</p>
      <p>The game is provided as is, without a warranty. You use it at your own pace, on your own device.</p>
    </>
  )
}

function About() {
  return (
    <>
      <h2>About</h2>
      <p>Mango Moon is a Jamaican island game. You plant mango, West Indian cherry, and tamarind, then bring the fruit to Granny Marva. She presses jam, blends cups, bakes cakes, and lays wine down in the cellar until it is young, rested, or vintage.</p>
      <p>A second shore, Bonnet Cay, opens later for goats, chickens, fishing, and a jerk pit. Orders from the tide pay in coins. Moonstones open new beds. Nothing in the cove is rushed past the timer on the bottle.</p>
      <p>Game by CMA Digital.</p>
      <p className="muted">Questions: <a href="mailto:spengeyeziz@gmail.com">spengeyeziz@gmail.com</a></p>
    </>
  )
}
