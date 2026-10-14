import type { FruitId, ItemId, Need, Save, StationId, Stage } from "@/game/types"
import { FRUITS, ITEM_IDS } from "@/game/types"

export const WORLD = { w: 900, h: 1200 }
export const REGEN_MS = 16_000
export const BASE_ENERGY = 30

export const PLOTS: { id: string; x: number; y: number; cost: number; stones?: number }[] = [
  { id: "p1", x: 340, y: 370, cost: 0 },
  { id: "p2", x: 490, y: 255, cost: 0 },
  { id: "p3", x: 470, y: 450, cost: 0 },
  { id: "p4", x: 355, y: 500, cost: 0 },
  { id: "p5", x: 250, y: 470, cost: 0, stones: 48 },
  { id: "p6", x: 545, y: 555, cost: 0, stones: 72 },
  { id: "p7", x: 450, y: 645, cost: 0, stones: 110 },
  { id: "p8", x: 675, y: 600, cost: 0, stones: 160 },
  { id: "p9", x: 620, y: 400, cost: 0, stones: 240 },
  { id: "p10", x: 175, y: 340, cost: 0, stones: 320 },
  { id: "p11", x: 780, y: 450, cost: 0, stones: 420 },
  { id: "p12", x: 250, y: 640, cost: 0, stones: 560 },
  { id: "p13", x: 600, y: 280, cost: 0, stones: 720 },
]

export const BUILDINGS: {
  id: StationId | "boat"
  x: number
  y: number
  name: string
  blurb: string
}[] = [
  { id: "press", x: 400, y: 790, name: "Marva's Press", blurb: "Jams, and the basket Granny is waiting on." },
  { id: "cellar", x: 700, y: 740, name: "The Bluff Cellar", blurb: "Bottles sleep underground. Waiting is the work." },
  { id: "shack", x: 185, y: 860, name: "Tide Smoothies", blurb: "Cold cups for the same hour they are blended." },
  { id: "bakery", x: 520, y: 900, name: "Oven House", blurb: "Cakes for the afternoon boat." },
  { id: "kitchen", x: 330, y: 980, name: "Harbour Grill", blurb: "Plates with a little char and a little glaze." },
  { id: "boat", x: 560, y: 1105, name: "Mail Boat", blurb: "Orders from people who cannot stay the season." },
]

export const TIDE = { x: 130, y: 960 }
export const GRANNY = { x: 300, y: 780 }
export const KEEPER_START = { x: 360, y: 430 }

export type Offer = {
  id: string
  name: string
  price: string
  url: string
  stones: number
  coins: number
  blurb: string
  perks: string[]
}

export const OFFERS: Offer[] = [
  {
    id: "tier-1",
    name: "Tide pouch",
    price: "$2.49",
    url: "https://app.payhere.co/cma-digital/mango-moon-game-tier-1",
    stones: 40,
    coins: 250,
    blurb: "A small purse for the first closed bed.",
    perks: ["40 moonstones", "250 coins"],
  },
  {
    id: "tier-2",
    name: "Orchard pouch",
    price: "$5.99",
    url: "https://app.payhere.co/cma-digital/mango-moon-game-tier-2",
    stones: 120,
    coins: 800,
    blurb: "Enough stones to open two hillside beds.",
    perks: ["120 moonstones", "800 coins"],
  },
  {
    id: "tier-3",
    name: "Harbour pouch",
    price: "$8.99",
    url: "https://app.payhere.co/cma-digital/mango-moon-game-tier-3",
    stones: 220,
    coins: 1_600,
    blurb: "A dock purse. The grill notices.",
    perks: ["220 moonstones", "1,600 coins"],
  },
  {
    id: "tier-4",
    name: "Festival pass",
    price: "$12.99",
    url: "https://app.payhere.co/cma-digital/mango-moon-game-tier-4",
    stones: 380,
    coins: 2_800,
    blurb: "The season pass Marva keeps under the kettle.",
    perks: ["380 moonstones", "2,800 coins"],
  },
  {
    id: "premium",
    name: "Premium bundle",
    price: "$19.99",
    url: "https://app.payhere.co/cma-digital/mango-moon-game-premium-bundle",
    stones: 700,
    coins: 5_000,
    blurb: "A heavy purse and room to plant the headland.",
    perks: ["700 moonstones", "5,000 coins"],
  },
  {
    id: "gold",
    name: "Gold bundle",
    price: "$27.99",
    url: "https://app.payhere.co/cma-digital/mango-moon-game-gold-bundle",
    stones: 1_200,
    coins: 9_000,
    blurb: "Gold jars, and the moon bed is within reach.",
    perks: ["1,200 moonstones", "9,000 coins"],
  },
  {
    id: "platinum",
    name: "Platinum bundle",
    price: "$59.99",
    url: "https://app.payhere.co/cma-digital/mango-moon-game-platinum-bundle",
    stones: 2_800,
    coins: 22_000,
    blurb: "Opens every bed on the cove, including the moon bed.",
    perks: ["2,800 moonstones", "22,000 coins", "Every closed bed opens"],
  },
]

export const COVE_PEOPLE = [
  {
    name: "Granny Marva",
    role: "Press & cellar",
    src: "/art/granny.png",
    line: "Mixed-race Jamaican. She sets jam the same morning and leaves wine in the dark for years.",
  },
  {
    name: "Kian Cole",
    role: "Orchard keeper",
    src: "/art/keeper.png",
    line: "Walks the beds. You move him every time you plant, pick, or deliver.",
  },
] as const

export type FruitDef = {
  id: FruitId
  name: string
  sub: string
  seconds: number
  yield: number
  after: string | null
}

export const FRUIT_DEFS: FruitDef[] = [
  { id: "mango", name: "Mango", sub: "Julie, gold flesh", seconds: 8, yield: 2, after: null },
  { id: "cherry", name: "Cherry", sub: "West Indian acerola", seconds: 10, yield: 2, after: null },
  { id: "tamarind", name: "Tamarind", sub: "Long pods", seconds: 14, yield: 2, after: null },
  { id: "guava", name: "Guava", sub: "Pink heart", seconds: 12, yield: 2, after: "own-jam" },
  { id: "pineapple", name: "Pineapple", sub: "Sugar loaf", seconds: 16, yield: 2, after: "smoothie" },
  { id: "coconut", name: "Coconut", sub: "Jelly and water", seconds: 18, yield: 1, after: "cake" },
  { id: "soursop", name: "Soursop", sub: "A lunar fruit", seconds: 20, yield: 1, after: "rested" },
]

export type ItemDef = { name: string; sell: number; blurb: string }

export const ITEMS: Record<ItemId, ItemDef> = {
  mango: { name: "Mango", sell: 6, blurb: "Heavy, fragrant, and the reason the cove has a name." },
  cherry: { name: "West Indian cherry", sell: 7, blurb: "Bright and sharp. Granny wants these by the bowl." },
  tamarind: { name: "Tamarind", sell: 8, blurb: "Sour, brown, and the bass note in everything Marva keeps." },
  guava: { name: "Guava", sell: 7, blurb: "Perfume first, then pink. It behaves in a loaf." },
  pineapple: { name: "Pineapple", sell: 8, blurb: "Cut it over the grill so the sugar can catch." },
  coconut: { name: "Coconut", sell: 9, blurb: "Water for the cup, flesh for the cake, shell for the path." },
  soursop: { name: "Soursop", sell: 10, blurb: "Pale and wild. It makes a quiet elixir." },
  "jam-mango": { name: "Mango Gold", sell: 36, blurb: "A bright jar. It tastes like the hour after rain." },
  "jam-cherry": { name: "Cherry Glow", sell: 38, blurb: "Sharp enough to wake a slice of bread." },
  "jam-tamarind": { name: "Tamarind Velvet", sell: 42, blurb: "Dark, slow, and good with salt." },
  "jam-duo": { name: "Marva's Duo", sell: 64, blurb: "Cherry and tamarind in one jar. Her signature." },
  "jam-guava": { name: "Guava Amber", sell: 40, blurb: "Soft set, floral, the color of late sun." },
  "sip-moon": { name: "Mango Moon", sell: 34, blurb: "Mango, cherry, and ice. The house cup." },
  "sip-cherry": { name: "Cherry Breeze", sell: 30, blurb: "A short drink the color of the fruit." },
  "sip-tam": { name: "Tamarind Cooler", sell: 36, blurb: "Sweet, sour, and meant for the dock." },
  "sip-pine": { name: "Pineapple Tide", sell: 38, blurb: "Pineapple lifted with cherry." },
  "sip-coco": { name: "Mango Coconut", sell: 44, blurb: "Thick, pale gold, and gone in four sips." },
  "sip-sour": { name: "Soursop Silk", sell: 48, blurb: "Cold, creamy, and a little mysterious." },
  "cake-mango": { name: "Upside Mango", sell: 42, blurb: "Fruit on the bottom, crumb on top, no apology." },
  "cake-cherry": { name: "Cherry Loaf", sell: 40, blurb: "A tender crumb stained at the edges." },
  "cake-tam": { name: "Tamarind Tart", sell: 46, blurb: "A short crust and a dark, shining center." },
  "cake-guava": { name: "Guava Loaf", sell: 42, blurb: "Pink crumb. It sells before it cools." },
  "plate-skewer": { name: "Mango Skewers", sell: 36, blurb: "Charred mango, tamarind glaze, a little heat." },
  "plate-pine": { name: "Jerk Pineapple", sell: 40, blurb: "Spice, sugar, and a stripe of char." },
  "plate-drops": { name: "Coconut Drops", sell: 34, blurb: "Chewy, toasted, wrapped for the boat." },
  "wine-mango-0": { name: "Mango wine · Young", sell: 36, blurb: "One month in the bluff. Still learning its name." },
  "wine-mango-1": { name: "Mango wine · Rested", sell: 80, blurb: "Eight months in the dark. Round, and sure of itself." },
  "wine-mango-2": { name: "Mango wine · Vintage", sell: 170, blurb: "Two years under the cove. This is the bottle people mean." },
  "wine-cherry-0": { name: "Cherry cordial · Young", sell: 40, blurb: "Bright, and not ready to be hurried." },
  "wine-cherry-1": { name: "Cherry cordial · Rested", sell: 88, blurb: "The sharpness has turned to perfume." },
  "wine-cherry-2": { name: "Cherry cordial · Vintage", sell: 180, blurb: "A small glass is enough." },
  "wine-tamarind-0": { name: "Tamarind reserve · Young", sell: 44, blurb: "Sour still. Leave it." },
  "wine-tamarind-1": { name: "Tamarind reserve · Rested", sell: 96, blurb: "The sour has become length." },
  "wine-tamarind-2": { name: "Tamarind reserve · Vintage", sell: 200, blurb: "Years in the stone. A collector's pour." },
  "wine-night-0": { name: "Night blend · Young", sell: 58, blurb: "Cherry, tamarind, and her duo. Barely asleep." },
  "wine-night-1": { name: "Night blend · Rested", sell: 120, blurb: "The two fruits have stopped arguing." },
  "wine-night-2": { name: "Night blend · Vintage", sell: 250, blurb: "The bottle Marva will not sell to strangers." },
  "wine-soursop-0": { name: "Soursop elixir · Young", sell: 50, blurb: "Pale and green-gold. Too new." },
  "wine-soursop-1": { name: "Soursop elixir · Rested", sell: 110, blurb: "Soft, strange, and lovely." },
  "wine-soursop-2": { name: "Soursop elixir · Vintage", sell: 220, blurb: "A lunar bottle. Cork it only when the meter is full." },
}

export type Recipe = {
  id: string
  name: string
  station: Exclude<StationId, "cellar">
  kind: "jam" | "smoothie" | "cake" | "plate"
  inputs: Need[]
  output: ItemId
  seconds: number
  after: string | null
  blurb: string
  hint: string
}

export const RECIPES: Recipe[] = [
  { id: "jam-mango", name: "Mango Gold", station: "press", kind: "jam", inputs: [{ item: "mango", qty: 3 }], output: "jam-mango", seconds: 12, after: null, blurb: ITEMS["jam-mango"].blurb, hint: "" },
  { id: "jam-cherry", name: "Cherry Glow", station: "press", kind: "jam", inputs: [{ item: "cherry", qty: 3 }], output: "jam-cherry", seconds: 12, after: null, blurb: ITEMS["jam-cherry"].blurb, hint: "" },
  { id: "jam-tamarind", name: "Tamarind Velvet", station: "press", kind: "jam", inputs: [{ item: "tamarind", qty: 3 }], output: "jam-tamarind", seconds: 14, after: "deliver", blurb: ITEMS["jam-tamarind"].blurb, hint: "Marva teaches this after the basket." },
  { id: "jam-duo", name: "Marva's Duo", station: "press", kind: "jam", inputs: [{ item: "cherry", qty: 2 }, { item: "tamarind", qty: 2 }], output: "jam-duo", seconds: 16, after: "deliver", blurb: ITEMS["jam-duo"].blurb, hint: "Bring her the basket first." },
  { id: "jam-guava", name: "Guava Amber", station: "press", kind: "jam", inputs: [{ item: "guava", qty: 3 }], output: "jam-guava", seconds: 12, after: "own-jam", blurb: ITEMS["jam-guava"].blurb, hint: "Guava comes after your own first jar." },
  { id: "sip-moon", name: "Mango Moon", station: "shack", kind: "smoothie", inputs: [{ item: "mango", qty: 2 }, { item: "cherry", qty: 1 }], output: "sip-moon", seconds: 8, after: "deliver", blurb: ITEMS["sip-moon"].blurb, hint: "The shack opens with the first duo." },
  { id: "sip-cherry", name: "Cherry Breeze", station: "shack", kind: "smoothie", inputs: [{ item: "cherry", qty: 3 }], output: "sip-cherry", seconds: 8, after: "deliver", blurb: ITEMS["sip-cherry"].blurb, hint: "The shack opens with the first duo." },
  { id: "sip-tam", name: "Tamarind Cooler", station: "shack", kind: "smoothie", inputs: [{ item: "tamarind", qty: 2 }, { item: "mango", qty: 1 }], output: "sip-tam", seconds: 8, after: "deliver", blurb: ITEMS["sip-tam"].blurb, hint: "The shack opens with the first duo." },
  { id: "sip-pine", name: "Pineapple Tide", station: "shack", kind: "smoothie", inputs: [{ item: "pineapple", qty: 2 }, { item: "cherry", qty: 1 }], output: "sip-pine", seconds: 8, after: "smoothie", blurb: ITEMS["sip-pine"].blurb, hint: "Blend a cup before the pineapple tide." },
  { id: "sip-coco", name: "Mango Coconut", station: "shack", kind: "smoothie", inputs: [{ item: "mango", qty: 2 }, { item: "coconut", qty: 1 }], output: "sip-coco", seconds: 9, after: "cake", blurb: ITEMS["sip-coco"].blurb, hint: "The palm opens after the oven does." },
  { id: "sip-sour", name: "Soursop Silk", station: "shack", kind: "smoothie", inputs: [{ item: "soursop", qty: 1 }, { item: "coconut", qty: 1 }], output: "sip-sour", seconds: 10, after: "rested", blurb: ITEMS["sip-sour"].blurb, hint: "Soursop follows a rested bottle." },
  { id: "cake-mango", name: "Upside Mango", station: "bakery", kind: "cake", inputs: [{ item: "mango", qty: 3 }], output: "cake-mango", seconds: 14, after: "smoothie", blurb: ITEMS["cake-mango"].blurb, hint: "The oven waits on your first smoothie." },
  { id: "cake-cherry", name: "Cherry Loaf", station: "bakery", kind: "cake", inputs: [{ item: "cherry", qty: 3 }], output: "cake-cherry", seconds: 14, after: "smoothie", blurb: ITEMS["cake-cherry"].blurb, hint: "The oven waits on your first smoothie." },
  { id: "cake-tam", name: "Tamarind Tart", station: "bakery", kind: "cake", inputs: [{ item: "tamarind", qty: 2 }, { item: "jam-mango", qty: 1 }], output: "cake-tam", seconds: 16, after: "smoothie", blurb: ITEMS["cake-tam"].blurb, hint: "The oven waits on your first smoothie." },
  { id: "cake-guava", name: "Guava Loaf", station: "bakery", kind: "cake", inputs: [{ item: "guava", qty: 2 }, { item: "mango", qty: 1 }], output: "cake-guava", seconds: 14, after: "cake", blurb: ITEMS["cake-guava"].blurb, hint: "Bake once, then the guava loaf." },
  { id: "plate-skewer", name: "Mango Skewers", station: "kitchen", kind: "plate", inputs: [{ item: "mango", qty: 2 }, { item: "tamarind", qty: 1 }], output: "plate-skewer", seconds: 12, after: "cake", blurb: ITEMS["plate-skewer"].blurb, hint: "The grill opens after a cake leaves the oven." },
  { id: "plate-pine", name: "Jerk Pineapple", station: "kitchen", kind: "plate", inputs: [{ item: "pineapple", qty: 2 }], output: "plate-pine", seconds: 12, after: "plate", blurb: ITEMS["plate-pine"].blurb, hint: "Serve a plate, then the pineapple." },
  { id: "plate-drops", name: "Coconut Drops", station: "kitchen", kind: "plate", inputs: [{ item: "coconut", qty: 2 }], output: "plate-drops", seconds: 12, after: "cake", blurb: ITEMS["plate-drops"].blurb, hint: "The grill opens after a cake leaves the oven." },
]

export type WineDef = {
  id: string
  name: string
  inputs: Need[]
  seconds: [number, number, number]
  sell: [number, number, number]
  ages: [string, string, string]
  after: string | null
  blurb: string
  hint: string
}

export const WINES: WineDef[] = [
  {
    id: "mango",
    name: "Mango wine",
    inputs: [{ item: "mango", qty: 4 }],
    seconds: [20, 48, 90],
    sell: [36, 80, 170],
    ages: ["One month in the bluff", "Eight months in the dark", "Two years under the cove"],
    after: "deliver",
    blurb: "The house wine. It improves every time you refuse to rush it.",
    hint: "The cellar opens once the basket has been brought.",
  },
  {
    id: "cherry",
    name: "Cherry cordial",
    inputs: [{ item: "cherry", qty: 4 }],
    seconds: [24, 56, 100],
    sell: [40, 88, 180],
    ages: ["Six weeks in glass", "Ten months below", "Three years, almost"],
    after: "lay",
    blurb: "A cordial, not a rush. The fruit stays loud if you let it.",
    hint: "Lay a first bottle, then the cordial.",
  },
  {
    id: "tamarind",
    name: "Tamarind reserve",
    inputs: [{ item: "tamarind", qty: 4 }],
    seconds: [28, 64, 120],
    sell: [44, 96, 200],
    ages: ["Two months in stone", "A year underground", "Four years, if you can bear it"],
    after: "lay",
    blurb: "The longest ordinary bottle. Sour becomes length.",
    hint: "Lay a first bottle, then the reserve.",
  },
  {
    id: "night",
    name: "Night blend",
    inputs: [
      { item: "cherry", qty: 2 },
      { item: "tamarind", qty: 2 },
      { item: "jam-duo", qty: 1 },
    ],
    seconds: [30, 70, 130],
    sell: [58, 120, 250],
    ages: ["A season in the dark", "A year and a winter", "The bottle she will not hurry"],
    after: "rested",
    blurb: "Cherry, tamarind, and a spoon of the duo. It needs a rested hand.",
    hint: "Cork something that has rested before the night blend.",
  },
  {
    id: "soursop",
    name: "Soursop elixir",
    inputs: [{ item: "soursop", qty: 2 }, { item: "mango", qty: 1 }],
    seconds: [26, 60, 110],
    sell: [50, 110, 220],
    ages: ["A pale month", "Nine months, lunar", "Two years and a tide"],
    after: "rested",
    blurb: "Strange, silky, and worth the wait.",
    hint: "A rested bottle opens the soursop cask.",
  },
]

export const RANKS = ["Keeper", "Cutter", "Press hand", "Blender", "Oven hand", "Grill", "Cellar hand", "Vintner", "Cove steady"]
const LEVEL_XP = [0, 40, 90, 150, 230, 330, 450, 600, 780]

export function levelInfo(xp: number) {
  let level = 1
  for (let i = 0; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) level = i + 1
  }
  const cur = LEVEL_XP[level - 1] ?? 0
  const next = LEVEL_XP[level] ?? null
  const pct = next == null ? 1 : Math.min(1, (xp - cur) / (next - cur))
  return { level, rank: RANKS[Math.min(level, RANKS.length) - 1] ?? "Keeper", pct, next, xp }
}

export function energyCap(xp: number) {
  return BASE_ENERGY + (levelInfo(xp).level - 1) * 2
}

export function fruitDef(id: FruitId) {
  return FRUIT_DEFS.find((f) => f.id === id) ?? FRUIT_DEFS[0]
}

export function fruitOpen(save: Save, id: FruitId) {
  const def = fruitDef(id)
  return def.after == null || save.claimed.includes(def.after)
}

export function recipeOpen(save: Save, after: string | null) {
  return after == null || save.claimed.includes(after)
}

export function stationOpen(save: Save, id: StationId | "boat") {
  if (id === "press" || id === "boat") return true
  if (id === "cellar" || id === "shack") return save.claimed.includes("deliver")
  if (id === "bakery") return save.claimed.includes("smoothie")
  if (id === "kitchen") return save.claimed.includes("cake")
  return false
}

export function stationHint(id: StationId | "boat") {
  if (id === "cellar" || id === "shack") return "Bring Granny the basket of cherry and tamarind."
  if (id === "bakery") return "Blend a smoothie and the oven will take a fire."
  if (id === "kitchen") return "Bake a cake, then the grill is yours."
  return ""
}

export type Quest = {
  id: string
  title: string
  detail: string
  goal: number
  progress: (s: Save) => number
  coins: number
  stones: number
  xp: number
  toast: string
}

export const QUESTS: Quest[] = [
  {
    id: "sow-mango",
    title: "Plant a mango",
    detail: "Choose an open bed and set a mango in it.",
    goal: 1,
    progress: (s) => s.stats.planted.mango,
    coins: 20,
    stones: 0,
    xp: 10,
    toast: "The first mango is in the ground.",
  },
  {
    id: "pick-mango",
    title: "Harvest mangoes",
    detail: "Pick four mangoes. Replant if a bed comes free.",
    goal: 4,
    progress: (s) => s.stats.harvested.mango,
    coins: 25,
    stones: 0,
    xp: 14,
    toast: "Four mangoes. The cove has started paying you back.",
  },
  {
    id: "sow-pair",
    title: "Plant cherry and tamarind",
    detail: "Granny's jam needs both trees, not one.",
    goal: 2,
    progress: (s) => (s.stats.planted.cherry > 0 ? 1 : 0) + (s.stats.planted.tamarind > 0 ? 1 : 0),
    coins: 30,
    stones: 0,
    xp: 14,
    toast: "Cherry and tamarind. She will know.",
  },
  {
    id: "pick-pair",
    title: "Pick her fruit",
    detail: "Harvest at least two West Indian cherries and two tamarind.",
    goal: 2,
    progress: (s) => (s.stats.harvested.cherry >= 2 ? 1 : 0) + (s.stats.harvested.tamarind >= 2 ? 1 : 0),
    coins: 30,
    stones: 1,
    xp: 16,
    toast: "The basket is real now.",
  },
  {
    id: "deliver",
    title: "Bring the basket",
    detail: "Take 2 cherry and 2 tamarind to Marva at the press. She keeps them.",
    goal: 1,
    progress: (s) => (s.delivered ? 1 : 0),
    coins: 40,
    stones: 1,
    xp: 20,
    toast: "Marva has the fruit. The kettle and the cellar are yours.",
  },
  {
    id: "own-jam",
    title: "Press a jar yourself",
    detail: "Run the kettle without her hands on the spoon.",
    goal: 1,
    progress: (s) => s.stats.pressCollects,
    coins: 30,
    stones: 0,
    xp: 18,
    toast: "Your own jar. Guava can join the grove.",
  },
  {
    id: "smoothie",
    title: "Blend a cup",
    detail: "Make any smoothie at Tide Smoothies.",
    goal: 1,
    progress: (s) => s.stats.shackCollects,
    coins: 28,
    stones: 0,
    xp: 18,
    toast: "Cold, and gone too fast. The oven is next.",
  },
  {
    id: "cake",
    title: "Bake a cake",
    detail: "Send something sweet out of Oven House.",
    goal: 1,
    progress: (s) => s.stats.bakeryCollects,
    coins: 32,
    stones: 0,
    xp: 20,
    toast: "The cake survived the oven. The grill can wake up.",
  },
  {
    id: "plate",
    title: "Serve a plate",
    detail: "Cook at the Harbour Grill.",
    goal: 1,
    progress: (s) => s.stats.kitchenCollects,
    coins: 32,
    stones: 0,
    xp: 20,
    toast: "A plate with a little char. That is lunch.",
  },
  {
    id: "lay",
    title: "Lay a bottle down",
    detail: "Start any wine in the Bluff Cellar. Do not cork it yet unless you must.",
    goal: 1,
    progress: (s) => s.stats.laid,
    coins: 20,
    stones: 0,
    xp: 16,
    toast: "It is in the dark. That is the whole of this step.",
  },
  {
    id: "orders",
    title: "Fill two orders",
    detail: "The mail boat pays better than selling loose fruit.",
    goal: 2,
    progress: (s) => s.stats.orders,
    coins: 40,
    stones: 1,
    xp: 22,
    toast: "Two orders away. The cove has a reputation now.",
  },
  {
    id: "rested",
    title: "Cork a rested bottle",
    detail: "Wait past young. Rested is the middle mark on the cellar meter.",
    goal: 1,
    progress: (s) => s.stats.rested + s.stats.vintage,
    coins: 50,
    stones: 1,
    xp: 24,
    toast: "You waited. Soursop and the night blend are open.",
  },
  {
    id: "vintage",
    title: "Draw a vintage",
    detail: "Leave a bottle until the last mark. The label will say years. The meter will say ready.",
    goal: 1,
    progress: (s) => s.stats.vintage,
    coins: 80,
    stones: 2,
    xp: 40,
    toast: "Vintage. Marva would pour a small glass and say nothing.",
  },
]

export function activeQuest(save: Save) {
  return QUESTS.find((q) => !save.claimed.includes(q.id)) ?? null
}

export function grannyLine(save: Save) {
  if (save.claimed.includes("vintage")) return "Two years in the story. A few quiet minutes in your hands. The color tells the truth."
  if (save.claimed.includes("rested")) return "You waited. That is the whole craft. The night blend is for hands that already know how."
  if (save.claimed.includes("deliver")) return "Jam is for this week. Wine is for a longer kindness. Do not cork a bottle that has only just sat down."
  if (save.claimed.includes("pick-pair")) return "Cherry for brightness. Tamarind for the note underneath. Bring me two of each."
  if (save.claimed.includes("sow-mango")) return "When the fruit blushes, pick it. I am not in a hurry. The wine will be."
  return "The soil is warm. Put a mango in the ground and the cove will answer."
}

export function helpSteps() {
  return [
    { title: "Plant the grove", body: "Open a bed, set mango, cherry, or tamarind, and pick when the flag says ready. Sunlight is spent on planting and picking. It returns on its own." },
    { title: "Feed the press", body: "Granny Marva wants West Indian cherry and tamarind. Bring her two of each. She keeps that basket and shows you the kettle." },
    { title: "Cook the day", body: "Jams stay in jars. Smoothies, cakes, and plates are for today. Guava, pineapple, coconut, and soursop join as the cove trusts you." },
    { title: "Let the wine learn", body: "Bottles under the bluff age through young, rested, and vintage. The words on the label are months and years. Cork late if you can." },
    { title: "Cross to Bonnet Cay", body: "The ferry opens a second island: one chicken pantry, then egg house, fishing rocks, and more coops. Closed beds on this cove take moonstones only. Feed, shops, and extra yards take thousands of coins." },
  ]
}

export type Ask = {
  item: ItemId
  qty: number
  guest: string
  line: string
  need?: string
  mins?: number
}

export const ASKS: Ask[] = [
  { item: "mango", qty: 2, guest: "Imani Holt", line: "The mail boat has room for mangoes." },
  { item: "mango", qty: 3, guest: "Ellis Reid", line: "I am baking off-island. Mangoes, if the trees agree." },
  { item: "cherry", qty: 2, guest: "June Palmer", line: "West Indian cherry, if the tree has been kind." },
  { item: "tamarind", qty: 2, guest: "Aya Bennett", line: "A handful of tamarind for the road." },
  { item: "guava", qty: 2, guest: "Ellis Reid", line: "Guava, if the new bed has flushed.", need: "own-jam" },
  { item: "pineapple", qty: 2, guest: "June Palmer", line: "Pineapple for a friend who will not visit.", need: "smoothie" },
  { item: "coconut", qty: 1, guest: "Imani Holt", line: "One coconut. The boat is particular today.", need: "cake" },
  { item: "jam-mango", qty: 1, guest: "Imani Holt", line: "A jar of Mango Gold travels well.", need: "own-jam" },
  { item: "jam-cherry", qty: 1, guest: "June Palmer", line: "Cherry Glow, if a jar is spare.", need: "own-jam" },
  { item: "jam-duo", qty: 1, guest: "Mr. Liang", line: "Marva's duo. I have been asking for a year.", need: "own-jam" },
  { item: "sip-moon", qty: 1, guest: "June Palmer", line: "One Mango Moon, cold as you can make it.", need: "smoothie" },
  { item: "cake-mango", qty: 1, guest: "Ellis Reid", line: "An upside mango for the afternoon boat.", need: "cake" },
  { item: "plate-skewer", qty: 1, guest: "Aya Bennett", line: "Skewers, if the grill is awake.", need: "plate" },
  { item: "wine-mango-0", qty: 1, guest: "Mr. Liang", line: "Even a young mango wine, if that is all the dark has.", need: "lay", mins: 10 },
  { item: "wine-mango-1", qty: 1, guest: "Mr. Liang", line: "I only buy a mango wine that has rested.", need: "rested", mins: 12 },
  { item: "wine-night-2", qty: 1, guest: "Mr. Liang", line: "The night blend, vintage. Name your price in coins.", need: "vintage", mins: 14 },
]

export function askOpen(save: Save, ask: Ask) {
  if (ask.need && !save.claimed.includes(ask.need)) return false
  if ((FRUITS as readonly string[]).includes(ask.item)) return fruitOpen(save, ask.item as FruitId)
  return true
}

export function formatLeft(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m <= 0) return `${r}s`
  return `${m}m ${r.toString().padStart(2, "0")}s`
}

export function emptyStats(): Save["stats"] {
  const harvested = {} as Record<FruitId, number>
  const planted = {} as Record<FruitId, number>
  for (const id of FRUITS) {
    harvested[id] = 0
    planted[id] = 0
  }
  return {
    harvested,
    planted,
    crafted: {},
    pressCollects: 0,
    shackCollects: 0,
    bakeryCollects: 0,
    kitchenCollects: 0,
    laid: 0,
    orders: 0,
    young: 0,
    rested: 0,
    vintage: 0,
  }
}

export function emptyInv(): Record<ItemId, number> {
  const inv = {} as Record<ItemId, number>
  for (const id of ITEM_IDS) inv[id] = 0
  return inv
}

export function bundles(): { id: string; item: FruitId; qty: number; cost: number }[] {
  const price: Record<FruitId, number> = {
    mango: 1_200,
    cherry: 1_400,
    tamarind: 1_600,
    guava: 1_800,
    pineapple: 2_000,
    coconut: 2_200,
    soursop: 2_600,
  }
  return FRUIT_DEFS.map((f) => ({
    id: `bag-${f.id}`,
    item: f.id,
    qty: f.id === "coconut" || f.id === "soursop" ? 2 : 4,
    cost: price[f.id],
  }))
}
