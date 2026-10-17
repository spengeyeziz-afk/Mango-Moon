import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { audio } from "@/game/audio"
import type { AvatarId, FruitId, ItemId, Save, Sheet, StationId, Toast } from "@/game/types"
import {
  buyFeed,
  buyFruit,
  buySpice,
  callTruck,
  castRod,
  chooseAvatar,
  collectEggs,
  collectJob,
  deliver,
  fillOrder,
  freshSave,
  harvest,
  holdBirds,
  instantJob,
  makeJerk,
  makeSauce,
  normalize,
  plant,
  reelRod,
  refill,
  rollOrders,
  rollTide,
  saveKeys,
  sell,
  sellYard,
  serveBeach,
  setPlace,
  startEggs,
  startJob,
  stockPen,
  syncEnergy,
  takeTide,
  unlockEggs,
  unlockPen,
  unlockPlot,
  unlockRod,
  uproot,
  claimOne,
  claimWelcome,
  claimDaily,
  grantRewarded,
} from "@/game/logic"
import { showRewardedAd } from "@/game/ads"
import { claimYard, settleYard, YARD_SELL } from "@/game/yard"

type YardGood = keyof typeof YARD_SELL

type Ui = { screen: "title" | "play"; sheet: Sheet }

type Store = Save & {
  now: number
  ui: Ui
  toasts: Toast[]
  hydrated: boolean
  tick: () => void
  begin: () => void
  open: (sheet: Sheet) => void
  close: () => void
  setSetting: (key: keyof Save["settings"], value: boolean) => void
  reset: () => void
  doPlant: (plotId: string, fruit: FruitId) => void
  doHarvest: (plotId: string) => void
  doUproot: (plotId: string) => void
  doUnlock: (plotId: string, pay?: "coins" | "stones") => void
  doDeliver: () => void
  doStart: (station: StationId, recipe: string) => void
  doCollect: (station: StationId, index: number) => void
  doInstant: (station: StationId, index: number) => void
  doFill: (orderId: string) => void
  doSell: (item: ItemId, qty: number) => void
  doBuy: (item: FruitId, qty: number, cost: number) => void
  doRefill: () => void
  doTide: () => void
  doAvatar: (id: AvatarId) => void
  doPlace: (place: "cove" | "cay") => void
  doBuyFeed: () => void
  doBuySpice: () => void
  doUnlockPen: (id: string, pay: "coins" | "stones") => void
  doStock: (id: string) => void
  doTruck: (id: string) => void
  doHold: (id: string) => void
  doUnlockRod: (id: string, pay: "coins" | "stones") => void
  doCast: (id: string) => void
  doReel: (id: string) => void
  doUnlockEggs: (pay: "coins" | "stones") => void
  doStartEggs: () => void
  doCollectEggs: () => void
  doSauce: () => void
  doJerk: () => void
  doServe: () => void
  doSellYard: (kind: YardGood, qty: number) => void
  doGift: () => void
  doDaily: () => void
  doWatchAd: () => void
}

const memory = new Map<string, string>()
const storage = {
  getItem: (k: string) => {
    try {
      if (typeof localStorage === "undefined") return memory.get(k) ?? null
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  setItem: (k: string, v: string) => {
    try {
      if (typeof localStorage === "undefined") memory.set(k, v)
      else localStorage.setItem(k, v)
    } catch {
      /* ignore quota */
    }
  },
  removeItem: (k: string) => {
    try {
      memory.delete(k)
      localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  },
}

let toastSeq = 1

function push(toasts: Toast[], text: string | undefined, now: number) {
  if (!text) return toasts.filter((t) => t.until > now)
  return [...toasts.filter((t) => t.until > now), { id: toastSeq++, text, until: now + 2600 }].slice(-3)
}

export const useGame = create<Store>()(
  persist(
    (set, get) => {
      const boot = freshSave()
      const run = (result: { ok: true; save: Save; note?: string } | { ok: false; reason: string }, good: "ok" | "coin" = "ok") => {
        const now = Date.now()
        if (!result.ok) {
          audio.bad()
          set((s) => ({ toasts: push(s.toasts, result.reason, now), now }))
          return
        }
        const claimed = claimOne(result.save)
        const yarded = claimYard(claimed.save)
        if (good === "coin") audio.coin()
        else audio.ok()
        set((s) => ({
          ...yarded.save,
          now,
          toasts: push(push(push(s.toasts, result.note, now), claimed.toast, now), yarded.toast, now),
        }))
      }
      return {
        ...boot,
        now: Date.now(),
        ui: { screen: "title", sheet: null },
        toasts: [],
        hydrated: false,
        tick: () => {
          const now = Date.now()
          set((s) => {
            let save = syncEnergy(saveKeys(s), now)
            save = rollTide(save, now)
            save = rollOrders(save, now)
            const settled = settleYard(save, now)
            const claimed = claimOne(settled.save)
            const yarded = claimYard(claimed.save)
            return {
              ...s,
              ...yarded.save,
              now,
              toasts: push(push(push(s.toasts, settled.toast, now), claimed.toast, now), yarded.toast, now),
            }
          })
        },
        begin: () => {
          audio.unlock()
          const s = get()
          audio.configure(s.settings.music, s.settings.sfx)
          set({ hasPlayed: true, ui: { screen: "play", sheet: null } })
        },
        open: (sheet) => set((s) => ({ ui: { ...s.ui, sheet } })),
        close: () => set((s) => ({ ui: { ...s.ui, sheet: null } })),
        setSetting: (key, value) => {
          set((s) => {
            const settings = { ...s.settings, [key]: value }
            audio.configure(settings.music, settings.sfx)
            return { settings }
          })
        },
        reset: () => {
          const now = Date.now()
          const next = freshSave(now)
          audio.configure(next.settings.music, false)
          set({ ...next, now, ui: { screen: "title", sheet: null }, toasts: [], hydrated: true })
        },
        doPlant: (plotId, fruit) => run(plant(saveKeys(get()), plotId, fruit, Date.now())),
        doHarvest: (plotId) => run(harvest(saveKeys(get()), plotId, Date.now())),
        doUproot: (plotId) => run(uproot(saveKeys(get()), plotId, Date.now())),
        doUnlock: (plotId, pay = "stones") => run(unlockPlot(saveKeys(get()), plotId, Date.now(), pay), "coin"),
        doDeliver: () => run(deliver(saveKeys(get()), Date.now()), "coin"),
        doStart: (station, recipe) => run(startJob(saveKeys(get()), station, recipe, Date.now())),
        doCollect: (station, index) => run(collectJob(saveKeys(get()), station, index, Date.now()), "coin"),
        doInstant: (station, index) => run(instantJob(saveKeys(get()), station, index, Date.now())),
        doFill: (orderId) => run(fillOrder(saveKeys(get()), orderId, Date.now()), "coin"),
        doSell: (item, qty) => run(sell(saveKeys(get()), item, qty, Date.now()), "coin"),
        doBuy: (item, qty, cost) => run(buyFruit(saveKeys(get()), item, qty, cost, Date.now()), "coin"),
        doRefill: () => run(refill(saveKeys(get()), Date.now())),
        doTide: () => run(takeTide(saveKeys(get()), Date.now()), "coin"),
        doAvatar: (id) => run(chooseAvatar(saveKeys(get()), id, Date.now())),
        doPlace: (place) => run(setPlace(saveKeys(get()), place, Date.now())),
        doBuyFeed: () => run(buyFeed(saveKeys(get()), Date.now()), "coin"),
        doBuySpice: () => run(buySpice(saveKeys(get()), Date.now()), "coin"),
        doUnlockPen: (id, pay) => run(unlockPen(saveKeys(get()), id, pay, Date.now()), "coin"),
        doStock: (id) => run(stockPen(saveKeys(get()), id, Date.now())),
        doTruck: (id) => run(callTruck(saveKeys(get()), id, Date.now())),
        doHold: (id) => run(holdBirds(saveKeys(get()), id, Date.now())),
        doUnlockRod: (id, pay) => run(unlockRod(saveKeys(get()), id, pay, Date.now()), "coin"),
        doCast: (id) => run(castRod(saveKeys(get()), id, Date.now())),
        doReel: (id) => run(reelRod(saveKeys(get()), id, Date.now()), "coin"),
        doUnlockEggs: (pay) => run(unlockEggs(saveKeys(get()), pay, Date.now()), "coin"),
        doStartEggs: () => run(startEggs(saveKeys(get()), Date.now())),
        doCollectEggs: () => run(collectEggs(saveKeys(get()), Date.now()), "coin"),
        doSauce: () => run(makeSauce(saveKeys(get()), Date.now())),
        doJerk: () => run(makeJerk(saveKeys(get()), Date.now())),
        doServe: () => run(serveBeach(saveKeys(get()), Date.now()), "coin"),
        doSellYard: (kind, qty) => run(sellYard(saveKeys(get()), kind, qty, Date.now()), "coin"),
        doGift: () => run(claimWelcome(saveKeys(get()), Date.now()), "coin"),
        doDaily: () => run(claimDaily(saveKeys(get()), Date.now()), "coin"),
        doWatchAd: () => {
          void (async () => {
            const ad = await showRewardedAd()
            const now = Date.now()
            if (!ad.completed) {
              audio.bad()
              set((s) => ({ toasts: push(s.toasts, ad.reason ?? "Ad not ready.", now), now }))
              return
            }
            run(grantRewarded(saveKeys(get()), now), "coin")
          })()
        },
      }
    },
    {
      name: "mango-moon-v1",
      skipHydration: true,
      storage: createJSONStorage(() => storage),
      partialize: (s) => saveKeys(s),
      merge: (persisted, current) => {
        try {
          const save = normalize(persisted)
          return { ...current, ...save }
        } catch {
          return current
        }
      },
    },
  ),
)
