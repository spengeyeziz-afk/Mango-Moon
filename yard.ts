import type { AvatarId, Save, Yard } from "@/game/types"
import { AVATAR_IDS } from "@/game/types"

export const GROW_MS = 20_000
export const TRUCK_MS = 8_000
export const FISH_MS = 9_000
export const EGG_MS = 12_000
export const FEED_PACK = { cost: 1_200, qty: 4 }
export const SPICE_TIN = { cost: 600, qty: 2 }
export const STOCK_FEED = 2
export const STOCK_BIRDS = 4
export const BIRD_PAY = 650
export const EGG_YIELD = 6
export const BEACH_PAY = 2_200
export const EGG_HOUSE = { coins: 3_200, stones: 100, x: 210, y: 690 }

export const PENS: { id: string; name: string; x: number; y: number; coins: number; stones: number }[] = [
  { id: "pantry", name: "Open pantry", x: 250, y: 440, coins: 0, stones: 0 },
  { id: "hill", name: "Hill coop", x: 470, y: 390, coins: 2_800, stones: 90 },
  { id: "shade", name: "Shade coop", x: 690, y: 480, coins: 5_400, stones: 160 },
  { id: "export", name: "Export coop", x: 360, y: 600, coins: 8_600, stones: 240 },
]

export const RODS: { id: string; name: string; x: number; y: number; coins: number; stones: number }[] = [
  { id: "pier", name: "Open pier", x: 170, y: 930, coins: 0, stones: 0 },
  { id: "reef", name: "Reef rocks", x: 340, y: 1020, coins: 2_200, stones: 70 },
  { id: "blue", name: "Blue water", x: 530, y: 970, coins: 4_100, stones: 120 },
]

export const YARD_SPOTS = {
  shop: { x: 560, y: 730, name: "Feed & goods" },
  jerk: { x: 710, y: 860, name: "Lenny's pan" },
  factory: { x: 760, y: 250, name: "Factory road" },
  ferry: { x: 120, y: 780, name: "Ferry" },
}

export const YARD_SELL = { eggs: 150, fish: 220, birds: 500, jerk: 1_400, sauce: 350 }

export type YardQuest = {
  id: string
  title: string
  detail: string
  goal: number
  progress: (s: Save) => number
  coins: number
  toast: string
}

export const YARD_QUESTS: YardQuest[] = [
  { id: "y-feed", title: "Buy a sack of feed", detail: "The open pantry on Bonnet Cay needs feed from the goods shop. A sack is 1,200 coins.", goal: 1, progress: (s) => Math.min(1, s.yard.boughtFeed), coins: 200, toast: "Feed is in the shed. The pantry can take birds." },
  { id: "y-stock", title: "Stock the pantry", detail: "Put four birds in the open pantry. That spends two measures of feed.", goal: 1, progress: (s) => Math.min(1, s.yard.stocked), coins: 250, toast: "The birds are down. Wait, then choose truck or pan." },
  { id: "y-truck", title: "Send the factory truck", detail: "When a coop says ready, call the truck. It hauls the birds to the works and pays in coins.", goal: 1, progress: (s) => Math.min(1, s.yard.trucks), coins: 600, toast: "Kingston has the birds. The road is yours now." },
  { id: "y-fish", title: "Land a fish", detail: "Cast from the open pier and reel when the flag says ready.", goal: 1, progress: (s) => Math.min(1, s.yard.caught), coins: 200, toast: "First fish. The other rocks cost real money." },
  { id: "y-eggs", title: "Collect a tray of eggs", detail: "Open the egg house with coins or moonstones, spend feed, and collect the tray.", goal: 1, progress: (s) => Math.min(1, s.yard.laid), coins: 400, toast: "Eggs in the basket. Sell them, or keep cooking." },
  { id: "y-sauce", title: "Make Lenny's sauce", detail: "At the beach pan: one mango, one tamarind, and one spice from the shop.", goal: 1, progress: (s) => Math.min(1, s.yard.sauceMade), coins: 300, toast: "The sauce is the thing people cross the channel for." },
  { id: "y-jerk", title: "Serve a jerk plate", detail: "Hold a ready coop for the pan, jerk it with sauce, and serve Keisha on the sand.", goal: 1, progress: (s) => Math.min(1, s.yard.jerked), coins: 500, toast: "Keisha paid. The umbrella crowd will be back." },
  { id: "y-second", title: "Open another coop", detail: "The hill coop takes thousands of coins, or a heavy purse of moonstones.", goal: 1, progress: (s) => (s.yard.penOpen[1] ? 1 : 0), coins: 400, toast: "Two coops. The yard is starting to look like a business." },
]

export function freshYard(now = Date.now()): Yard {
  return {
    place: "cove",
    avatar: "kian",
    feed: 0,
    eggs: 0,
    fish: 0,
    birds: 0,
    sauce: 0,
    jerk: 0,
    spice: 0,
    pens: PENS.map(() => ({ birds: 0, state: "empty", at: 0 })),
    penOpen: PENS.map((_, i) => i === 0),
    rods: RODS.map(() => ({ at: null })),
    rodOpen: RODS.map((_, i) => i === 0),
    egg: { open: false, at: null },
    claimed: [],
    boughtFeed: 0,
    stocked: 0,
    trucks: 0,
    caught: 0,
    laid: 0,
    sauceMade: 0,
    jerked: 0,
    beachOpen: true,
    beachAt: now,
  }
}

function count(v: unknown) {
  const n = typeof v === "number" && Number.isFinite(v) ? Math.floor(v) : 0
  return Math.max(0, n)
}

export function normalizeYard(raw: unknown, now: number): Yard {
  const base = freshYard(now)
  if (!raw || typeof raw !== "object") return base
  const y = raw as Partial<Yard>
  const avatar = AVATAR_IDS.includes(y.avatar as AvatarId) ? (y.avatar as AvatarId) : base.avatar
  const pens = PENS.map((_, i) => {
    const p = y.pens?.[i]
    const state = p?.state === "growing" || p?.state === "ready" || p?.state === "truck" || p?.state === "empty" ? p.state : "empty"
    return { birds: count(p?.birds), state, at: typeof p?.at === "number" ? p.at : 0 }
  })
  return {
    place: y.place === "cay" ? "cay" : "cove",
    avatar,
    feed: count(y.feed),
    eggs: count(y.eggs),
    fish: count(y.fish),
    birds: count(y.birds),
    sauce: count(y.sauce),
    jerk: count(y.jerk),
    spice: count(y.spice),
    pens,
    penOpen: PENS.map((_, i) => (i === 0 ? true : Boolean(y.penOpen?.[i]))),
    rods: RODS.map((_, i) => ({ at: typeof y.rods?.[i]?.at === "number" ? y.rods[i].at : null })),
    rodOpen: RODS.map((_, i) => (i === 0 ? true : Boolean(y.rodOpen?.[i]))),
    egg: { open: Boolean(y.egg?.open), at: typeof y.egg?.at === "number" ? y.egg.at : null },
    claimed: Array.isArray(y.claimed) ? y.claimed.filter((id) => typeof id === "string") : [],
    boughtFeed: count(y.boughtFeed),
    stocked: count(y.stocked),
    trucks: count(y.trucks),
    caught: count(y.caught),
    laid: count(y.laid),
    sauceMade: count(y.sauceMade),
    jerked: count(y.jerked),
    beachOpen: y.beachOpen !== false,
    beachAt: typeof y.beachAt === "number" ? y.beachAt : now,
  }
}

export function settleYard(save: Save, now: number): { save: Save; toast?: string } {
  const pens = save.yard.pens.map((p) => ({ ...p }))
  let toast: string | undefined
  let coins = save.coins
  let trucks = save.yard.trucks
  let beachOpen = save.yard.beachOpen
  for (let i = 0; i < pens.length; i++) {
    const p = pens[i]
    if (p.state === "growing" && now >= p.at + GROW_MS) {
      pens[i] = { ...p, state: "ready" }
      toast = "The birds are ready. Call the truck, or hold them for jerk."
    } else if (p.state === "truck" && now >= p.at + TRUCK_MS) {
      const pay = p.birds * BIRD_PAY
      coins += pay
      trucks += 1
      pens[i] = { birds: 0, state: "empty", at: 0 }
      toast = `The factory truck paid ${pay.toLocaleString("en-US")} coins.`
    }
  }
  if (!beachOpen && now >= save.yard.beachAt) {
    beachOpen = true
    toast = toast ?? "Keisha is back under the umbrella."
  }
  const changed = toast != null || coins !== save.coins || beachOpen !== save.yard.beachOpen
  if (!changed) return { save }
  return { save: { ...save, coins, yard: { ...save.yard, pens, trucks, beachOpen } }, toast }
}

export function claimYard(save: Save): { save: Save; toast?: string } {
  for (let i = 0; i < YARD_QUESTS.length; i++) {
    const q = YARD_QUESTS[i]
    if (save.yard.claimed.includes(q.id)) continue
    if (i > 0 && !save.yard.claimed.includes(YARD_QUESTS[i - 1].id)) return { save }
    if (q.progress(save) >= q.goal) {
      return {
        save: {
          ...save,
          coins: save.coins + q.coins,
          yard: { ...save.yard, claimed: [...save.yard.claimed, q.id] },
        },
        toast: q.toast,
      }
    }
    return { save }
  }
  return { save }
}

export function activeYardQuest(save: Save) {
  return YARD_QUESTS.find((q) => !save.yard.claimed.includes(q.id)) ?? null
}
