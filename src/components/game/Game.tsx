import { useEffect } from "react"
import { BookOpen, ListChecks, Settings, Ship, Store } from "lucide-react"
import { IconCoin, IconMoon, IconStone, IconSun } from "@/components/game/art"
import { Island } from "@/components/game/Island"
import { AvatarPicker } from "@/components/game/portraits"
import { Sheets } from "@/components/game/Sheets"
import { activeQuest, energyCap, formatLeft, helpSteps, levelInfo } from "@/game/content"
import { initAds } from "@/game/ads"
import { nextEnergyMs } from "@/game/logic"
import { useGame } from "@/game/store"

export function Game() {
  const hydrated = useGame((s) => s.hydrated)
  const screen = useGame((s) => s.ui.screen)
  const settings = useGame((s) => s.settings)

  useEffect(() => {
    let alive = true
    void (async () => {
      try {
        await useGame.persist.rehydrate()
      } catch {
        /* keep a fresh cove */
      }
      if (!alive) return
      const s = useGame.getState()
      useGame.setState({
        hydrated: true,
        now: Date.now(),
        ui: { screen: s.hasPlayed ? "play" : "title", sheet: null },
      })
      if (s.hasPlayed) {
        const { audio } = await import("@/game/audio")
        audio.unlock()
        audio.configure(s.settings.music, s.settings.sfx)
      }
      useGame.getState().tick()
    })()
    const id = window.setInterval(() => useGame.getState().tick(), 250)
    const hide = () => useGame.getState().tick()
    document.addEventListener("visibilitychange", hide)
    window.addEventListener("pagehide", hide)
    return () => {
      alive = false
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", hide)
      window.removeEventListener("pagehide", hide)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = settings.motion ? "on" : "off"
  }, [settings.motion])

  useEffect(() => {
    initAds()
  }, [])

  if (!hydrated) {
    return (
      <main className="boot">
        <p className="eyebrow">Marva's Cove, Jamaica</p>
        <h1>Mango Moon</h1>
        <p className="lede">The press is warming.</p>
      </main>
    )
  }

  return (
    <main className="game">
      <Island interactive={screen === "play"} />
      {screen === "play" ? <Hud /> : <Title />}
      {screen === "play" ? <Dock /> : null}
      <Toasts />
      <Sheets />
    </main>
  )
}

function Title() {
  const begin = useGame((s) => s.begin)
  const open = useGame((s) => s.open)
  const played = useGame((s) => s.hasPlayed)
  const music = useGame((s) => s.settings.music)
  const setSetting = useGame((s) => s.setSetting)
  return (
    <section className="title-card">
      <p className="eyebrow">Marva's Cove, Jamaica</p>
      <h1>Mango Moon</h1>
      <p className="lede">
        Grow the grove, cook with Granny Marva, then ferry to Bonnet Cay for chickens, eggs, fish, and jerk.
      </p>
      <p className="section-label">Who is walking</p>
      <AvatarPicker />
      <button type="button" className="btn btn-primary" data-testid="start" onClick={() => begin()}>
        {played ? "Continue" : "Step ashore"}
      </button>
      <button type="button" className="btn btn-ghost" data-testid="help" onClick={() => open({ type: "help" })}>
        How the cove works
      </button>
      <button type="button" className="switch title-sound" role="switch" aria-checked={music} onClick={() => setSetting("music", !music)}>
        <span>Music</span>
        <i data-on={music ? "1" : "0"} />
      </button>
      <ol className="title-steps">
        {helpSteps().map((s) => (
          <li key={s.title}>{s.title}</li>
        ))}
      </ol>
      <p className="legal-links">
        <button type="button" onClick={() => open({ type: "about" })}>About</button>
        <button type="button" onClick={() => open({ type: "privacy" })}>Privacy</button>
        <button type="button" onClick={() => open({ type: "terms" })}>Terms</button>
      </p>
    </section>
  )
}

function Hud() {
  const save = useGame()
  const open = useGame((s) => s.open)
  const info = levelInfo(save.xp)
  const cap = energyCap(save.xp)
  const quest = activeQuest(save)
  const wait = nextEnergyMs(save, save.now)
  const place = useGame((s) => s.doPlace)
  const onCay = save.yard.place === "cay"
  return (
    <>
      <header className="hud">
        <button type="button" className="pill" onClick={() => open({ type: "level" })}>
          <IconMoon />
          <span className="num">{info.level}</span>
          <i className="xpbar" style={{ transform: `scaleX(${info.pct})` }} />
        </button>
        <button type="button" className="pill" onClick={() => open({ type: "sun" })}>
          <IconSun />
          <span className="num">{save.energy}</span>
          <small>{save.energy >= cap ? "Full" : formatLeft(wait)}</small>
        </button>
        <button type="button" className="pill" data-testid="ferry-toggle" onClick={() => place(onCay ? "cove" : "cay")}>
          {onCay ? "Cove" : "Cay"}
        </button>
        <button type="button" className="pill pill-money" data-testid="open-shop" onClick={() => open({ type: "shop" })}>
          <span className="coin"><IconCoin /><b className="num">{save.coins.toLocaleString("en-US")}</b></span>
          <span className="stone"><IconStone /><b className="num">{save.stones}</b></span>
        </button>
      </header>
      <button type="button" className="objchip" onClick={() => open({ type: "tasks" })}>
        <span>{quest ? quest.title : "The cove is in season"}</span>
        {quest ? <small className="num">{Math.min(quest.goal, quest.progress(save))}/{quest.goal}</small> : null}
      </button>
    </>
  )
}

function Dock() {
  const open = useGame((s) => s.open)
  const orders = useGame((s) => s.orders.length)
  return (
    <nav className="dock" aria-label="Cove">
      <button type="button" data-testid="dock-tasks" onClick={() => open({ type: "tasks" })}><ListChecks /><span>Tasks</span></button>
      <button type="button" data-testid="dock-orders" onClick={() => open({ type: "orders" })}><Ship /><span>Orders</span>{orders > 0 ? <em>{orders}</em> : null}</button>
      <button type="button" data-testid="dock-market" onClick={() => open({ type: "market" })}><Store /><span>Market</span></button>
      <button type="button" data-testid="dock-book" onClick={() => open({ type: "book" })}><BookOpen /><span>Book</span></button>
      <button type="button" data-testid="dock-settings" onClick={() => open({ type: "settings" })}><Settings /><span>Settings</span></button>
    </nav>
  )
}

function Toasts() {
  const toasts = useGame((s) => s.toasts)
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => (
        <p key={t.id} className="toast">{t.text}</p>
      ))}
    </div>
  )
}
