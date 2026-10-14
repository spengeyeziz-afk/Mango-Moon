import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { Game } from "@/components/game/Game"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  if (!ready) {
    return (
      <main className="boot">
        <p className="eyebrow">Marva's Cove, Jamaica</p>
        <h1>Mango Moon</h1>
        <p className="lede">The press is warming.</p>
      </main>
    )
  }
  return <Game />
}
