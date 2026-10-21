import {
  ASKS,
  BUILDINGS,
  FRUIT_DEFS,
  ITEMS,
  GRANNY,
  KEEPER_START,
  PLOTS,
  QUESTS,
  RECIPES,
  REGEN_MS,
  TIDE,
  WINES,
  askOpen,
  emptyInv,
  emptyStats,
  energyCap,
  fruitDef,
  BASE_ENERGY,
} from "@/game/content"
import type { AvatarId, FruitId, ItemId, Job, Order, Save, Stage, StationId } from "@/game/types"
import { AVATAR_IDS, ITEM_IDS } from "@/game/types"
import {
  BEACH_PAY,
  EGG_HOUSE,
  EGG_MS,
  EGG_YIELD,
  FEED_PACK,
  FISH_MS,
  PENS,
  RODS,
  SPICE_TIN,
  STOCK_BIRDS,
  STOCK_FEED,
  YARD_SELL,
  YARD_SPOTS,
  freshYard,
  normalizeYard,
} from "@/game/yard"

export type Act = { ok: true; save: Save; note?: string } | { ok: false; reason: string }

function copySave(s: Save): Save {
  return {
    ...s,
    inv: { ...s.inv },
    plots: s.plots.map((p) => ({ ...p })),
    unlocked: [...s.unlocked],
    jobs: {
      press: s.jobs.press.map((j) => (j ? { ...j } : null)),
      shack: s.jobs.shack.map((j) => (j ? { ...j } : null)),
      bakery: s.jobs.bakery.map((j) => (j ? { ...j } : null)),
      kitchen: s.jobs.kitchen.map((j) => (j ? { ...j } : null)),
      cellar: s.jobs.cellar.map((j) => (j ? { ...j } : null)),
    },
    orders: s.orders.map((o) => ({ ...o })),
    claimed: [...s.claimed],
    ownedOffers: [...s.ownedOffers],
    stats: {
      ...s.stats,
      harvested: { ...s.stats.harvested },
      planted: { ...s.stats.planted },
      crafted: { ...s.stats.crafted },
    },
    settings: { ...s.settings },
    keeper: { ...s.keeper },
    yard: {
      ...s.yard,
      pens: s.yard.pens.map((p) => ({ ...p })),
      penOpen: [...s.yard.penOpen],
      rods: s.yard.rods.map((r) => ({ ...r })),
      rodOpen: [...s.yard.rodOpen],
      egg: { ...s.yard.egg },
      claimed: [...s.yard.claimed],
    },
  }
}

export function syncEnergy(s: Save, now: number): Save {
  const cap = energyCap(s.xp)
  if (s.energy >= cap) return { ...s, energy: cap, energyAt: now }
  const gained = Math.floor((now - s.energyAt) / REGEN_MS)
  if (gained <= 0) return s
  const energy = Math.min(cap, s.energy + gained)
  const energyAt = energy >= cap ? now : s.energyAt + gained * REGEN_MS
  return { ...s, energy, energyAt }
}

function spend(s: Save, cost: number, now: number): Save | null {
  const cap = energyCap(s.xp)
  let energy = s.energy
  let energyAt = s.energyAt
  if (energy >= cap) energyAt = now
  if (energy < cost) return null
  energy -= cost
  return { ...s, energy, energyAt }
}

export function nextEnergyMs(s: Save, now: number) {
  const cap = energyCap(s.xp)
  if (s.energy >= cap) return 0
  const elapsed = now - s.energyAt
  return REGEN_MS - (elapsed % REGEN_MS)
}

function needText(s: Save, inputs: { item: ItemId; qty: number }[]) {
  for (const n of inputs) {
    const have = s.inv[n.item] ?? 0
    if (have < n.qty) return `Need ${n.qty - have} more ${ITEMS[n.item].name}`
  }
  return null
}

function takeInputs(s: Save, inputs: { item: ItemId; qty: number }[]) {
  const inv = { ...s.inv }
  for (const n of inputs) inv[n.item] -= n.qty
  return inv
}

export function wineStage(job: Job, seconds: [number, number, number], now: number): Stage | -1 {
  const elapsed = (now - job.at) / 1000
  if (elapsed >= seconds[2]) return 2
  if (elapsed >= seconds[1]) return 1
  if (elapsed >= seconds[0]) return 0
  return -1
}

export function wineFrac(job: Job, seconds: [number, number, number], now: number) {
  const elapsed = Math.max(0, (now - job.at) / 1000)
  const marks = [0, seconds[0], seconds[1], seconds[2]]
  let idx = 0
  for (let i = 0; i < 3; i++) {
    if (elapsed >= marks[i + 1]) idx = i + 1
  }
  if (idx >= 3) return { parts: [1, 1, 1] as const, stage: 2 as Stage }
  const span = marks[idx + 1] - marks[idx]
  const local = span <= 0 ? 1 : Math.min(1, (elapsed - marks[idx]) / span)
  const parts: [number, number, number] = [0, 0, 0]
  for (let i = 0; i < idx; i++) parts[i] = 1
  if (idx < 3) parts[idx] = local
  return { parts, stage: wineStage(job, seconds, now) }
}

export function jobReady(station: StationId, job: Job, now: number) {
  if (station === "cellar") {
    const wine = WINES.find((w) => w.id === job.recipe)
    if (!wine) return false
    return wineStage(job, wine.seconds, now) >= 0
  }
  const recipe = RECIPES.find((r) => r.id === job.recipe)
  if (!recipe) return false
  return now >= job.at + recipe.seconds * 1000
}

export function claimOne(s: Save): { save: Save; toast?: string } {
  for (let i = 0; i < QUESTS.length; i++) {
    const q = QUESTS[i]
    if (s.claimed.includes(q.id)) continue
    if (i > 0 && !s.claimed.includes(QUESTS[i - 1].id)) return { save: s }
    if (q.progress(s) >= q.goal) {
      return {
        save: {
          ...s,
          claimed: [...s.claimed, q.id],
          coins: s.coins + q.coins,
          stones: s.stones + q.stones,
          xp: s.xp + q.xp,
        },
        toast: q.toast,
      }
    }
    return { save: s }
  }
  return { save: s }
}

function orderCap(s: Save) {
  return s.claimed.includes("deliver") ? 3 : 2
}

export function rollOrders(s: Save, now: number): Save {
  const cap = orderCap(s)
  let orders = s.orders.filter((o) => o.due > now)
  let seq = s.seq
  let guard = 0
  while (orders.length < cap && guard < 12) {
    guard++
    const pool = ASKS.filter((a) => askOpen(s, a) && !orders.some((o) => o.item === a.item))
    if (pool.length === 0) break
    const ask = pool[seq % pool.length]
    seq++
    const sell = ITEMS[ask.item].sell
    orders = [
      ...orders,
      {
        id: `o${seq}`,
        item: ask.item,
        qty: ask.qty,
        guest: ask.guest,
        line: ask.line,
        coins: Math.round(sell * ask.qty * 2.4),
        xp: 10 + ask.qty * 4,
        due: now + (ask.mins ?? 7) * 60_000,
      },
    ]
  }
  return { ...s, orders, seq }
}

export function rollTide(s: Save, now: number): Save {
  if (!s.tideReady && now >= s.tideAt) return { ...s, tideReady: true }
  return s
}

export function freshSave(now = Date.now()): Save {
  const slots = (n: number): (Job | null)[] => Array.from({ length: n }, () => null)
  const save: Save = {
    version: 1,
    coins: 40,
    stones: 2,
    energy: BASE_ENERGY,
    energyAt: now,
    xp: 0,
    inv: emptyInv(),
    plots: PLOTS.map(() => ({ fruit: null, at: null })),
    unlocked: PLOTS.map((p) => p.cost === 0 && !p.stones),
    jobs: {
      press: slots(2),
      shack: slots(1),
      bakery: slots(1),
      kitchen: slots(1),
      cellar: slots(3),
    },
    orders: [],
    seq: 1,
    claimed: [],
    delivered: false,
    stats: emptyStats(),
    tideAt: now + 45_000,
    tideReady: false,
    hasPlayed: false,
    giftClaimed: false,
    dailyAt: 0,
    adDay: 0,
    adsToday: 0,
    settings: { music: true, sfx: true, motion: true },
    keeper: { ...KEEPER_START },
    ownedOffers: [],
    yard: freshYard(now),
  }
  return rollOrders(save, now)
}

export function normalize(raw: unknown): Save {
  const base = freshSave()
  if (!raw || typeof raw !== "object") return base
  const p = raw as Partial<Save>
  const inv = emptyInv()
  if (p.inv && typeof p.inv === "object") {
    for (const id of ITEM_IDS) {
      const n = (p.inv as Record<string, number>)[id]
      if (typeof n === "number" && Number.isFinite(n)) inv[id] = Math.max(0, Math.floor(n))
    }
  }
  const stats = emptyStats()
  if (p.stats && typeof p.stats === "object") {
    for (const id of Object.keys(stats.harvested) as FruitId[]) {
      stats.harvested[id] = Math.max(0, Number(p.stats.harvested?.[id] ?? 0) || 0)
      stats.planted[id] = Math.max(0, Number(p.stats.planted?.[id] ?? 0) || 0)
    }
    if (p.stats.crafted && typeof p.stats.crafted === "object") stats.crafted = { ...p.stats.crafted }
    stats.pressCollects = Number(p.stats.pressCollects ?? 0) || 0
    stats.shackCollects = Number(p.stats.shackCollects ?? 0) || 0
    stats.bakeryCollects = Number(p.stats.bakeryCollects ?? 0) || 0
    stats.kitchenCollects = Number(p.stats.kitchenCollects ?? 0) || 0
    stats.laid = Number(p.stats.laid ?? 0) || 0
    stats.orders = Number(p.stats.orders ?? 0) || 0
    stats.young = Number(p.stats.young ?? 0) || 0
    stats.rested = Number(p.stats.rested ?? 0) || 0
    stats.vintage = Number(p.stats.vintage ?? 0) || 0
  }
  const plots = PLOTS.map((_, i) => {
    const plot = p.plots?.[i]
    const fruit = plot?.fruit
    const ok = FRUIT_DEFS.some((f) => f.id === fruit)
    return { fruit: ok ? (fruit as FruitId) : null, at: typeof plot?.at === "number" ? plot.at : null }
  })
  const unlocked = PLOTS.map((_, i) => (typeof p.unlocked?.[i] === "boolean" ? p.unlocked[i] : base.unlocked[i]))
  const jobs = base.jobs
  if (p.jobs) {
    for (const key of Object.keys(jobs) as StationId[]) {
      const incoming = p.jobs[key]
      if (!Array.isArray(incoming)) continue
      jobs[key] = jobs[key].map((_, i) => {
        const j = incoming[i]
        if (j && typeof j.recipe === "string" && typeof j.at === "number") return { recipe: j.recipe, at: j.at }
        return null
      })
    }
  }
  const orders: Order[] = Array.isArray(p.orders)
    ? p.orders.filter((o): o is Order => !!o && typeof o.id === "string" && typeof o.item === "string" && ITEM_IDS.includes(o.item as ItemId))
    : []
  return {
    ...base,
    coins: num(p.coins, base.coins),
    stones: num(p.stones, base.stones),
    energy: num(p.energy, base.energy),
    energyAt: num(p.energyAt, base.energyAt),
    xp: num(p.xp, 0),
    inv,
    plots,
    unlocked,
    jobs,
    orders,
    seq: num(p.seq, 1),
    claimed: Array.isArray(p.claimed) ? p.claimed.filter((id) => typeof id === "string") : [],
    delivered: Boolean(p.delivered),
    stats,
    tideAt: num(p.tideAt, base.tideAt),
    tideReady: Boolean(p.tideReady),
    hasPlayed: Boolean(p.hasPlayed),
    giftClaimed: typeof p.giftClaimed === "boolean" ? p.giftClaimed : Boolean(p.hasPlayed),
    dailyAt: num(p.dailyAt, 0),
    adDay: num(p.adDay, 0),
    adsToday: num(p.adsToday, 0),
    settings: {
      music: p.settings?.music !== false,
      sfx: p.settings?.sfx !== false,
      motion: p.settings?.motion !== false,
    },
    keeper: {
      x: num(p.keeper?.x, KEEPER_START.x),
      y: num(p.keeper?.y, KEEPER_START.y),
    },
    ownedOffers: Array.isArray(p.ownedOffers) ? p.ownedOffers.filter((id) => typeof id === "string") : [],
    yard: normalizeYard(p.yard, num(p.energyAt, base.energyAt)),
  }
}

function num(v: unknown, fallback: number) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback
}

export function plotIndex(id: string) {
  return PLOTS.findIndex((p) => p.id === id)
}

export function plant(save: Save, plotId: string, fruit: FruitId, now: number): Act {
  const s = spend(syncEnergy(copySave(save), now), 1, now)
  if (!s) return { ok: false, reason: "Not enough sunlight." }
  const i = plotIndex(plotId)
  const plot = PLOTS[i]
  if (!plot || !s.unlocked[i]) return { ok: false, reason: "That bed is still closed." }
  if (s.plots[i].fruit) return { ok: false, reason: "Something is already growing there." }
  if (!fruitOpenSafe(s, fruit)) return { ok: false, reason: "That fruit is not in season yet." }
  s.plots[i] = { fruit, at: now }
  s.stats.planted[fruit] += 1
  s.keeper = { x: plot.x, y: plot.y + 16 }
  return { ok: true, save: s, note: `${fruitDef(fruit).name} planted.` }
}

function fruitOpenSafe(s: Save, fruit: FruitId) {
  const def = fruitDef(fruit)
  return def.after == null || s.claimed.includes(def.after)
}

export function harvest(save: Save, plotId: string, now: number): Act {
  const s = spend(syncEnergy(copySave(save), now), 1, now)
  if (!s) return { ok: false, reason: "Not enough sunlight." }
  const i = plotIndex(plotId)
  const plot = s.plots[i]
  const meta = PLOTS[i]
  if (!plot?.fruit || plot.at == null || !meta) return { ok: false, reason: "Nothing to pick." }
  const def = fruitDef(plot.fruit)
  if (now < plot.at + def.seconds * 1000) return { ok: false, reason: "Still ripening." }
  s.inv[plot.fruit] += def.yield
  s.stats.harvested[plot.fruit] += def.yield
  const name = def.name
  const qty = def.yield
  s.plots[i] = { fruit: null, at: null }
  s.keeper = { x: meta.x, y: meta.y + 16 }
  return { ok: true, save: s, note: `+${qty} ${name}` }
}

export function uproot(save: Save, plotId: string, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  const i = plotIndex(plotId)
  if (!s.plots[i]?.fruit) return { ok: false, reason: "The bed is empty." }
  s.plots[i] = { fruit: null, at: null }
  return { ok: true, save: s, note: "Bed cleared." }
}

export function unlockPlot(save: Save, plotId: string, now: number, pay: "coins" | "stones" = "coins"): Act {
  const s = copySave(syncEnergy(save, now))
  const i = plotIndex(plotId)
  const plot = PLOTS[i]
  if (!plot) return { ok: false, reason: "No such bed." }
  if (s.unlocked[i]) return { ok: false, reason: "Already open." }
  const stoneCost = plot.stones ?? 0
  if (pay === "stones") {
    if (stoneCost <= 0) return { ok: false, reason: "This bed is bought with coins." }
    if (s.stones < stoneCost) return { ok: false, reason: `Need ${stoneCost - s.stones} more moonstones.` }
    s.stones -= stoneCost
  } else {
    if (plot.cost <= 0) return { ok: false, reason: "This bed opens with moonstones." }
    if (s.coins < plot.cost) return { ok: false, reason: `Need ${plot.cost - s.coins} more coins.` }
    s.coins -= plot.cost
  }
  s.unlocked[i] = true
  s.keeper = { x: plot.x, y: plot.y + 16 }
  return { ok: true, save: s, note: "A new bed is open." }
}

export function deliver(save: Save, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  if (s.delivered) return { ok: false, reason: "She already has the basket." }
  if (!s.claimed.includes("pick-pair")) return { ok: false, reason: "Pick her fruit first." }
  if (s.inv.cherry < 2 || s.inv.tamarind < 2) return { ok: false, reason: "Need 2 cherry and 2 tamarind." }
  s.inv.cherry -= 2
  s.inv.tamarind -= 2
  s.inv["jam-duo"] += 1
  s.stats.crafted["jam-duo"] = (s.stats.crafted["jam-duo"] ?? 0) + 1
  s.delivered = true
  s.keeper = { x: GRANNY.x, y: GRANNY.y + 10 }
  return { ok: true, save: s, note: "Marva pressed the first duo with you. +1 Marva's Duo" }
}

export function startJob(save: Save, station: StationId, recipeId: string, now: number): Act {
  let s = spend(syncEnergy(copySave(save), now), 1, now)
  if (!s) return { ok: false, reason: "Not enough sunlight." }
  if (station === "cellar") {
    const wine = WINES.find((w) => w.id === recipeId)
    if (!wine) return { ok: false, reason: "Unknown bottle." }
    if (wine.after && !s.claimed.includes(wine.after)) return { ok: false, reason: wine.hint }
    const missing = needText(s, wine.inputs)
    if (missing) return { ok: false, reason: missing }
    const idx = s.jobs.cellar.findIndex((j) => j == null)
    if (idx < 0) return { ok: false, reason: "The racks are full." }
    s.inv = takeInputs(s, wine.inputs)
    s.jobs.cellar[idx] = { recipe: wine.id, at: now }
    s.stats.laid += 1
    s.keeper = approach(station)
    return { ok: true, save: s, note: `${wine.name} is in the dark.` }
  }
  const recipe = RECIPES.find((r) => r.id === recipeId && r.station === station)
  if (!recipe) return { ok: false, reason: "Unknown recipe." }
  if (recipe.after && !s.claimed.includes(recipe.after)) return { ok: false, reason: recipe.hint }
  const missing = needText(s, recipe.inputs)
  if (missing) return { ok: false, reason: missing }
  const idx = s.jobs[station].findIndex((j) => j == null)
  if (idx < 0) return { ok: false, reason: "No free place to work." }
  s.inv = takeInputs(s, recipe.inputs)
  s.jobs[station][idx] = { recipe: recipe.id, at: now }
  s.keeper = approach(station)
  return { ok: true, save: s, note: `${recipe.name} started.` }
}

function approach(station: StationId) {
  const b = BUILDINGS.find((x) => x.id === station)
  return { x: (b?.x ?? 400) - 30, y: (b?.y ?? 600) + 20 }
}

export function collectJob(save: Save, station: StationId, index: number, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  const job = s.jobs[station][index]
  if (!job) return { ok: false, reason: "Nothing there." }
  if (station === "cellar") {
    const wine = WINES.find((w) => w.id === job.recipe)
    if (!wine) return { ok: false, reason: "The bottle is unlabeled." }
    const stage = wineStage(job, wine.seconds, now)
    if (stage < 0) return { ok: false, reason: "It has not even reached young." }
    const item = `wine-${wine.id}-${stage}` as ItemId
    s.inv[item] += 1
    s.stats.crafted[item] = (s.stats.crafted[item] ?? 0) + 1
    if (stage === 0) s.stats.young += 1
    if (stage === 1) s.stats.rested += 1
    if (stage === 2) s.stats.vintage += 1
    s.jobs.cellar[index] = null
    s.xp += stage === 2 ? 24 : stage === 1 ? 16 : 10
    return { ok: true, save: s, note: `Corked ${ITEMS[item].name}.` }
  }
  const recipe = RECIPES.find((r) => r.id === job.recipe)
  if (!recipe) return { ok: false, reason: "Missing recipe." }
  if (now < job.at + recipe.seconds * 1000) return { ok: false, reason: "Not ready." }
  s.inv[recipe.output] += 1
  s.stats.crafted[recipe.id] = (s.stats.crafted[recipe.id] ?? 0) + 1
  if (station === "press") s.stats.pressCollects += 1
  if (station === "shack") s.stats.shackCollects += 1
  if (station === "bakery") s.stats.bakeryCollects += 1
  if (station === "kitchen") s.stats.kitchenCollects += 1
  s.jobs[station][index] = null
  s.xp += 8
  return { ok: true, save: s, note: `${recipe.name} is ready to keep.` }
}

export function instantJob(save: Save, station: StationId, index: number, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  const job = s.jobs[station][index]
  if (!job) return { ok: false, reason: "Nothing to finish." }
  if (s.stones < 1) return { ok: false, reason: "Need a moonstone." }
  if (station === "cellar") {
    const wine = WINES.find((w) => w.id === job.recipe)
    if (!wine) return { ok: false, reason: "Unknown bottle." }
    const elapsed = (now - job.at) / 1000
    const target = elapsed >= wine.seconds[1] ? wine.seconds[2] : elapsed >= wine.seconds[0] ? wine.seconds[1] : wine.seconds[0]
    if (elapsed >= wine.seconds[2]) return { ok: false, reason: "It is already vintage." }
    s.stones -= 1
    s.jobs.cellar[index] = { recipe: job.recipe, at: now - target * 1000 }
    return { ok: true, save: s, note: "The cellar skips a season." }
  }
  const recipe = RECIPES.find((r) => r.id === job.recipe)
  if (!recipe) return { ok: false, reason: "Unknown recipe." }
  if (now >= job.at + recipe.seconds * 1000) return { ok: false, reason: "Already ready." }
  s.stones -= 1
  s.jobs[station][index] = { recipe: job.recipe, at: now - recipe.seconds * 1000 }
  return { ok: true, save: s, note: "Finished now." }
}

export function fillOrder(save: Save, orderId: string, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  const order = s.orders.find((o) => o.id === orderId)
  if (!order) return { ok: false, reason: "That order sailed." }
  if ((s.inv[order.item] ?? 0) < order.qty) return { ok: false, reason: `Need ${order.qty} ${ITEMS[order.item].name}.` }
  s.inv[order.item] -= order.qty
  s.coins += order.coins
  s.xp += order.xp
  s.stats.orders += 1
  s.orders = s.orders.filter((o) => o.id !== orderId)
  const rolled = rollOrders(s, now)
  return { ok: true, save: rolled, note: `+${order.coins} coins from ${order.guest}.` }
}

export function sell(save: Save, item: ItemId, qty: number, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  const have = s.inv[item] ?? 0
  const n = Math.min(have, qty)
  if (n <= 0) return { ok: false, reason: "You have none." }
  const coins = ITEMS[item].sell * n
  s.inv[item] -= n
  s.coins += coins
  return { ok: true, save: s, note: `Sold for ${coins} coins.` }
}

export function buyFruit(save: Save, item: FruitId, qty: number, cost: number, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  if (!fruitOpenSafe(s, item)) return { ok: false, reason: "Not in season yet." }
  if (s.coins < cost) return { ok: false, reason: "Not enough coins." }
  s.coins -= cost
  s.inv[item] += qty
  return { ok: true, save: s, note: `+${qty} ${fruitDef(item).name}` }
}

export function refill(save: Save, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  const cap = energyCap(s.xp)
  if (s.energy >= cap) return { ok: false, reason: "Sunlight is already full." }
  if (s.stones < 2) return { ok: false, reason: "Need 2 moonstones." }
  s.stones -= 2
  s.energy = cap
  s.energyAt = now
  return { ok: true, save: s, note: "Sunlight restored." }
}

export function takeTide(save: Save, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  if (!s.tideReady) return { ok: false, reason: "The tide has not left anything." }
  const roll = now % 10
  s.tideReady = false
  s.tideAt = now + 90_000
  s.keeper = { x: TIDE.x, y: TIDE.y - 10 }
  if (roll === 0) {
    s.stones += 1
    return { ok: true, save: s, note: "The tide left a moonstone." }
  }
  if (roll < 4) {
    const open = FRUIT_DEFS.filter((f) => fruitOpenSafe(s, f.id))
    const fruit = open[now % open.length]?.id ?? "mango"
    s.inv[fruit] += 1
    return { ok: true, save: s, note: `The tide left 1 ${fruitDef(fruit).name.toLowerCase()}.` }
  }
  const coins = 18 + (now % 19)
  s.coins += coins
  return { ok: true, save: s, note: `The tide left ${coins} coins.` }
}

function yardMove(s: Save, x: number, y: number) {
  s.keeper = { x, y: y + 16 }
  s.yard.place = "cay"
}

export function chooseAvatar(save: Save, id: AvatarId, now: number): Act {
  if (!AVATAR_IDS.includes(id)) return { ok: false, reason: "That look is not on the boat." }
  const s = copySave(syncEnergy(save, now))
  s.yard.avatar = id
  return { ok: true, save: s }
}

export function setPlace(save: Save, place: "cove" | "cay", now: number): Act {
  const s = copySave(syncEnergy(save, now))
  s.yard.place = place
  s.keeper = place === "cay" ? { x: 450, y: 780 } : { ...KEEPER_START }
  return { ok: true, save: s, note: place === "cay" ? "Ferry to Bonnet Cay." : "Back on Marva's Cove." }
}

export function buyFeed(save: Save, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  if (s.coins < FEED_PACK.cost) return { ok: false, reason: `Need ${FEED_PACK.cost.toLocaleString("en-US")} coins for feed.` }
  s.coins -= FEED_PACK.cost
  s.yard.feed += FEED_PACK.qty
  s.yard.boughtFeed += 1
  yardMove(s, YARD_SPOTS.shop.x, YARD_SPOTS.shop.y)
  return { ok: true, save: s, note: `+${FEED_PACK.qty} feed.` }
}

export function buySpice(save: Save, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  if (s.coins < SPICE_TIN.cost) return { ok: false, reason: `Spice is ${SPICE_TIN.cost.toLocaleString("en-US")} coins.` }
  s.coins -= SPICE_TIN.cost
  s.yard.spice += SPICE_TIN.qty
  yardMove(s, YARD_SPOTS.shop.x, YARD_SPOTS.shop.y)
  return { ok: true, save: s, note: `+${SPICE_TIN.qty} spice.` }
}

function payGate(s: Save, coins: number, stones: number, pay: "coins" | "stones") {
  if (pay === "stones") {
    if (s.stones < stones) return `Need ${stones - s.stones} more moonstones.`
    s.stones -= stones
    return null
  }
  if (s.coins < coins) return `Need ${(coins - s.coins).toLocaleString("en-US")} more coins.`
  s.coins -= coins
  return null
}

export function unlockPen(save: Save, id: string, pay: "coins" | "stones", now: number): Act {
  const i = PENS.findIndex((p) => p.id === id)
  const pen = PENS[i]
  if (!pen) return { ok: false, reason: "No such coop." }
  const s = copySave(syncEnergy(save, now))
  if (s.yard.penOpen[i]) return { ok: false, reason: "That coop is already open." }
  if (i === 0) return { ok: false, reason: "The pantry is already open." }
  const err = payGate(s, pen.coins, pen.stones, pay)
  if (err) return { ok: false, reason: err }
  s.yard.penOpen[i] = true
  yardMove(s, pen.x, pen.y)
  return { ok: true, save: s, note: `${pen.name} is open.` }
}

export function stockPen(save: Save, id: string, now: number): Act {
  const i = PENS.findIndex((p) => p.id === id)
  const pen = PENS[i]
  if (!pen) return { ok: false, reason: "No such coop." }
  const s = spend(syncEnergy(copySave(save), now), 1, now)
  if (!s) return { ok: false, reason: "Not enough sunlight." }
  if (!s.yard.penOpen[i]) return { ok: false, reason: "That coop is still closed." }
  if (s.yard.pens[i].state !== "empty") return { ok: false, reason: "This coop is already working." }
  if (s.yard.feed < STOCK_FEED) return { ok: false, reason: `Need ${STOCK_FEED} feed. Buy a sack at the shop.` }
  s.yard.feed -= STOCK_FEED
  s.yard.pens[i] = { birds: STOCK_BIRDS, state: "growing", at: now }
  s.yard.stocked += 1
  yardMove(s, pen.x, pen.y)
  return { ok: true, save: s, note: "Four birds are on feed." }
}

export function callTruck(save: Save, id: string, now: number): Act {
  const i = PENS.findIndex((p) => p.id === id)
  const pen = PENS[i]
  if (!pen) return { ok: false, reason: "No such coop." }
  const s = copySave(syncEnergy(save, now))
  const box = s.yard.pens[i]
  if (box.state !== "ready") return { ok: false, reason: "The birds are not ready for the truck." }
  s.yard.pens[i] = { ...box, state: "truck", at: now }
  yardMove(s, pen.x, pen.y)
  return { ok: true, save: s, note: "The truck is on the factory road." }
}

export function holdBirds(save: Save, id: string, now: number): Act {
  const i = PENS.findIndex((p) => p.id === id)
  const pen = PENS[i]
  if (!pen) return { ok: false, reason: "No such coop." }
  const s = copySave(syncEnergy(save, now))
  const box = s.yard.pens[i]
  if (box.state !== "ready") return { ok: false, reason: "Nothing ready to hold." }
  s.yard.birds += box.birds
  s.yard.pens[i] = { birds: 0, state: "empty", at: 0 }
  yardMove(s, pen.x, pen.y)
  return { ok: true, save: s, note: `${box.birds} birds are in the cold shed for the pan.` }
}

export function unlockRod(save: Save, id: string, pay: "coins" | "stones", now: number): Act {
  const i = RODS.findIndex((r) => r.id === id)
  const rod = RODS[i]
  if (!rod) return { ok: false, reason: "No such water." }
  const s = copySave(syncEnergy(save, now))
  if (s.yard.rodOpen[i]) return { ok: false, reason: "Already fishing there." }
  const err = payGate(s, rod.coins, rod.stones, pay)
  if (err) return { ok: false, reason: err }
  s.yard.rodOpen[i] = true
  yardMove(s, rod.x, rod.y)
  return { ok: true, save: s, note: `${rod.name} is open.` }
}

export function castRod(save: Save, id: string, now: number): Act {
  const i = RODS.findIndex((r) => r.id === id)
  const rod = RODS[i]
  if (!rod) return { ok: false, reason: "No such water." }
  const s = spend(syncEnergy(copySave(save), now), 1, now)
  if (!s) return { ok: false, reason: "Not enough sunlight." }
  if (!s.yard.rodOpen[i]) return { ok: false, reason: "That water is still closed." }
  if (s.yard.rods[i].at != null) return { ok: false, reason: "A line is already out." }
  s.yard.rods[i] = { at: now }
  yardMove(s, rod.x, rod.y)
  return { ok: true, save: s, note: "Line in. Wait for the tug." }
}

export function reelRod(save: Save, id: string, now: number): Act {
  const i = RODS.findIndex((r) => r.id === id)
  const rod = RODS[i]
  if (!rod) return { ok: false, reason: "No such water." }
  const s = copySave(syncEnergy(save, now))
  const at = s.yard.rods[i].at
  if (at == null) return { ok: false, reason: "Cast first." }
  if (now < at + FISH_MS) return { ok: false, reason: "Still quiet." }
  const n = 1 + (now % 2)
  s.yard.fish += n
  s.yard.caught += n
  s.yard.rods[i] = { at: null }
  yardMove(s, rod.x, rod.y)
  return { ok: true, save: s, note: `+${n} fish.` }
}

export function unlockEggs(save: Save, pay: "coins" | "stones", now: number): Act {
  const s = copySave(syncEnergy(save, now))
  if (s.yard.egg.open) return { ok: false, reason: "The egg house is open." }
  const err = payGate(s, EGG_HOUSE.coins, EGG_HOUSE.stones, pay)
  if (err) return { ok: false, reason: err }
  s.yard.egg.open = true
  yardMove(s, EGG_HOUSE.x, EGG_HOUSE.y)
  return { ok: true, save: s, note: "The hens have a house." }
}

export function startEggs(save: Save, now: number): Act {
  const s = spend(syncEnergy(copySave(save), now), 1, now)
  if (!s) return { ok: false, reason: "Not enough sunlight." }
  if (!s.yard.egg.open) return { ok: false, reason: "The egg house is closed." }
  if (s.yard.egg.at != null) return { ok: false, reason: "The hens are already laying." }
  if (s.yard.feed < 1) return { ok: false, reason: "Need 1 feed." }
  s.yard.feed -= 1
  s.yard.egg.at = now
  yardMove(s, EGG_HOUSE.x, EGG_HOUSE.y)
  return { ok: true, save: s, note: "Hens are on the nest." }
}

export function collectEggs(save: Save, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  const at = s.yard.egg.at
  if (at == null) return { ok: false, reason: "Start a laying first." }
  if (now < at + EGG_MS) return { ok: false, reason: "Not laid yet." }
  s.yard.eggs += EGG_YIELD
  s.yard.laid += EGG_YIELD
  s.yard.egg.at = null
  yardMove(s, EGG_HOUSE.x, EGG_HOUSE.y)
  return { ok: true, save: s, note: `+${EGG_YIELD} eggs.` }
}

export function makeSauce(save: Save, now: number): Act {
  const s = spend(syncEnergy(copySave(save), now), 1, now)
  if (!s) return { ok: false, reason: "Not enough sunlight." }
  if ((s.inv.mango ?? 0) < 1 || (s.inv.tamarind ?? 0) < 1) return { ok: false, reason: "Need 1 mango and 1 tamarind." }
  if (s.yard.spice < 1) return { ok: false, reason: "Need spice from the goods shop." }
  s.inv.mango -= 1
  s.inv.tamarind -= 1
  s.yard.spice -= 1
  s.yard.sauce += 1
  s.yard.sauceMade += 1
  yardMove(s, YARD_SPOTS.jerk.x, YARD_SPOTS.jerk.y)
  return { ok: true, save: s, note: "Special sauce is in the jar." }
}

export function makeJerk(save: Save, now: number): Act {
  const s = spend(syncEnergy(copySave(save), now), 1, now)
  if (!s) return { ok: false, reason: "Not enough sunlight." }
  if (s.yard.birds < 1) return { ok: false, reason: "Hold a ready coop for the pan first." }
  if (s.yard.sauce < 1) return { ok: false, reason: "Need Lenny's sauce." }
  s.yard.birds -= 1
  s.yard.sauce -= 1
  s.yard.jerk += 1
  yardMove(s, YARD_SPOTS.jerk.x, YARD_SPOTS.jerk.y)
  return { ok: true, save: s, note: "A jerk plate is off the pan." }
}

export function serveBeach(save: Save, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  if (!s.yard.beachOpen) return { ok: false, reason: "Keisha is between boats." }
  if (s.yard.jerk < 1) return { ok: false, reason: "Jerk a plate first." }
  s.yard.jerk -= 1
  s.coins += BEACH_PAY
  s.yard.jerked += 1
  s.yard.beachOpen = false
  s.yard.beachAt = now + 90_000
  yardMove(s, YARD_SPOTS.jerk.x, YARD_SPOTS.jerk.y)
  return { ok: true, save: s, note: `Keisha paid ${BEACH_PAY.toLocaleString("en-US")} coins.` }
}

export function sellYard(save: Save, kind: keyof typeof YARD_SELL, qty: number, now: number): Act {
  const s = copySave(syncEnergy(save, now))
  const have = s.yard[kind]
  const n = Math.min(have, Math.max(0, Math.floor(qty)))
  if (n <= 0) return { ok: false, reason: "Nothing to sell." }
  const coins = YARD_SELL[kind] * n
  s.yard[kind] -= n
  s.coins += coins
  yardMove(s, YARD_SPOTS.shop.x, YARD_SPOTS.shop.y)
  return { ok: true, save: s, note: `Sold for ${coins.toLocaleString("en-US")} coins.` }
}

export function saveKeys(s: Save): Save {
  return {
    version: s.version,
    coins: s.coins,
    stones: s.stones,
    energy: s.energy,
    energyAt: s.energyAt,
    xp: s.xp,
    inv: s.inv,
    plots: s.plots,
    unlocked: s.unlocked,
    jobs: s.jobs,
    orders: s.orders,
    seq: s.seq,
    claimed: s.claimed,
    delivered: s.delivered,
    stats: s.stats,
    tideAt: s.tideAt,
    tideReady: s.tideReady,
    hasPlayed: s.hasPlayed,
    giftClaimed: s.giftClaimed,
    dailyAt: s.dailyAt,
    adDay: s.adDay,
    adsToday: s.adsToday,
    settings: s.settings,
    keeper: s.keeper,
    ownedOffers: s.ownedOffers,
    yard: s.yard,
  }
}

export const DAY_MS = 24 * 60 * 60 * 1000

export function claimWelcome(save: Save, _now: number): Act {
  const s = copySave(save)
  if (s.giftClaimed) return { ok: false, reason: "That gift is already open." }
  s.giftClaimed = true
  s.stones += 5
  s.coins += 150
  return { ok: true, save: s, note: "Gift claimed. 5 moonstones and 150 coins." }
}

export function claimDaily(save: Save, now: number): Act {
  const s = copySave(save)
  if (s.dailyAt > 0 && now < s.dailyAt + DAY_MS) return { ok: false, reason: "The next daily gift opens tomorrow." }
  s.dailyAt = now
  s.stones += 1
  s.coins += 50
  return { ok: true, save: s, note: "Daily gift. 1 moonstone and 50 coins." }
}

/** Only call after a rewarded ad actually finishes. Tokens are moonstones. */
export const TOKEN_AD_REWARD = 50
export const TOKEN_AD_LIMIT = 4
const TOKEN_LIMIT = "You've reached today's free token limit. Come back tomorrow or visit the Token Shop."

export function adDayKey(now: number) {
  const d = new Date(now)
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate()
}

export function adsUsedToday(save: Save, now: number) {
  return save.adDay === adDayKey(now) ? save.adsToday : 0
}

export function grantTokenAd(save: Save, now: number): Act {
  const s = copySave(save)
  const day = adDayKey(now)
  if (s.adDay !== day) {
    s.adDay = day
    s.adsToday = 0
  }
  if (s.adsToday >= TOKEN_AD_LIMIT) return { ok: false, reason: TOKEN_LIMIT }
  s.adsToday += 1
  s.stones += TOKEN_AD_REWARD
  return { ok: true, save: s, note: "+50 Tokens earned! Enjoy your day." }
}

export function grantRewarded(save: Save, now: number): Act {
  return grantTokenAd(save, now)
}
