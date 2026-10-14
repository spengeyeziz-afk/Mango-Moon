export const FRUITS = [
  "mango",
  "cherry",
  "tamarind",
  "guava",
  "pineapple",
  "coconut",
  "soursop",
] as const

export type FruitId = (typeof FRUITS)[number]

export const PRODUCTS = [
  "jam-mango",
  "jam-cherry",
  "jam-tamarind",
  "jam-duo",
  "jam-guava",
  "sip-moon",
  "sip-cherry",
  "sip-tam",
  "sip-pine",
  "sip-coco",
  "sip-sour",
  "cake-mango",
  "cake-cherry",
  "cake-tam",
  "cake-guava",
  "plate-skewer",
  "plate-pine",
  "plate-drops",
  "wine-mango-0",
  "wine-mango-1",
  "wine-mango-2",
  "wine-cherry-0",
  "wine-cherry-1",
  "wine-cherry-2",
  "wine-tamarind-0",
  "wine-tamarind-1",
  "wine-tamarind-2",
  "wine-night-0",
  "wine-night-1",
  "wine-night-2",
  "wine-soursop-0",
  "wine-soursop-1",
  "wine-soursop-2",
] as const

export const ITEM_IDS = [...FRUITS, ...PRODUCTS] as const
export type ItemId = (typeof ITEM_IDS)[number]
export type StationId = "press" | "shack" | "bakery" | "kitchen" | "cellar"
export type Stage = 0 | 1 | 2
export type Job = { recipe: string; at: number }

export const AVATAR_IDS = [
  "kian",
  "malik",
  "zion",
  "andre",
  "owen",
  "nia",
  "irie",
  "sasha",
  "claire",
  "priya",
  "rohan",
] as const
export type AvatarId = (typeof AVATAR_IDS)[number]

export type PenState = "empty" | "growing" | "ready" | "truck"
export type PenSave = { birds: number; state: PenState; at: number }
export type RodSave = { at: number | null }

export type Yard = {
  place: "cove" | "cay"
  avatar: AvatarId
  feed: number
  eggs: number
  fish: number
  birds: number
  sauce: number
  jerk: number
  spice: number
  pens: PenSave[]
  penOpen: boolean[]
  rods: RodSave[]
  rodOpen: boolean[]
  egg: { open: boolean; at: number | null }
  claimed: string[]
  boughtFeed: number
  stocked: number
  trucks: number
  caught: number
  laid: number
  sauceMade: number
  jerked: number
  beachOpen: boolean
  beachAt: number
}

export type Order = {
  id: string
  item: ItemId
  qty: number
  guest: string
  line: string
  coins: number
  xp: number
  due: number
}

export type Stats = {
  harvested: Record<FruitId, number>
  planted: Record<FruitId, number>
  crafted: Record<string, number>
  pressCollects: number
  shackCollects: number
  bakeryCollects: number
  kitchenCollects: number
  laid: number
  orders: number
  young: number
  rested: number
  vintage: number
}

export type Settings = { music: boolean; sfx: boolean; motion: boolean }

export type Save = {
  version: 1
  coins: number
  stones: number
  energy: number
  energyAt: number
  xp: number
  inv: Record<ItemId, number>
  plots: { fruit: FruitId | null; at: number | null }[]
  unlocked: boolean[]
  jobs: Record<StationId, (Job | null)[]>
  orders: Order[]
  seq: number
  claimed: string[]
  delivered: boolean
  stats: Stats
  tideAt: number
  tideReady: boolean
  hasPlayed: boolean
  settings: Settings
  keeper: { x: number; y: number }
  ownedOffers: string[]
  yard: Yard
}

export type Sheet =
  | null
  | { type: "plot"; id: string }
  | { type: "station"; id: StationId }
  | { type: "tasks" }
  | { type: "orders" }
  | { type: "market" }
  | { type: "book" }
  | { type: "settings" }
  | { type: "help" }
  | { type: "sun" }
  | { type: "level" }
  | { type: "shop" }
  | { type: "pen"; id: string }
  | { type: "rod"; id: string }
  | { type: "eggs" }
  | { type: "jerk" }
  | { type: "yard" }
  | { type: "avatar" }
  | { type: "privacy" }
  | { type: "terms" }
  | { type: "about" }

export type Toast = { id: number; text: string; until: number }

export type Need = { item: ItemId; qty: number }
