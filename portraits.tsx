import { useId } from "react"
import { PLAYERS, type Look } from "@/game/people"
import { useGame } from "@/game/store"
import type { AvatarId } from "@/game/types"

export function Portrait({ look, className }: { look: Look; className?: string }) {
  const clip = useId()
  return (
    <svg viewBox="0 0 80 80" className={className ?? "face"} aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx="40" cy="40" r="39" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <circle cx="40" cy="40" r="40" fill="#f3e6d4" />
        <HairBack look={look} />
        <path d="M30 58c2 10 18 12 22 2" fill={look.skin} />
        <path d="M6 86c10-22 18-28 34-28s24 6 34 28" fill={look.shirt} />
        <ellipse cx="40" cy="40" rx="18" ry="21" fill={look.skin} />
        <ellipse cx="28" cy="46" rx="5" ry="3" fill="#c45c4a" opacity="0.18" />
        <ellipse cx="52" cy="46" rx="5" ry="3" fill="#c45c4a" opacity="0.18" />
        <path d={look.feminine ? "M28 34c3-3 6-3 8-1M44 33c2-2 6-2 8 1" : "M28 34c3-2 6-2 8 0M45 34c2-2 6-2 8 0"} fill="none" stroke="#2a1c16" strokeWidth="1.3" strokeLinecap="round" />
        <ellipse cx="33" cy="39" rx="2.15" ry="2.45" fill="#1c1915" />
        <ellipse cx="48" cy="39" rx="2.15" ry="2.45" fill="#1c1915" />
        <circle cx="33.7" cy="38.3" r="0.7" fill="#fffaf3" />
        <circle cx="48.7" cy="38.3" r="0.7" fill="#fffaf3" />
        {look.feminine ? (
          <path d="M30.6 40.6c.8 1.4 2.4 1.4 3.2 0M45.6 40.6c.8 1.4 2.4 1.4 3.2 0" fill="none" stroke="#2a1c16" strokeWidth="0.8" />
        ) : null}
        <path d="M40 41c-1.2 2-1 4 .2 5" fill="none" stroke="#6a4032" strokeWidth="1.1" strokeLinecap="round" />
        <path d={look.feminine ? "M33.5 50c2.2 2.6 5 3.4 6.5 3.4s4.4-.8 6.5-3.4c-2 2.4-4.2 3.2-6.5 3.2s-4.6-.8-6.5-3.2z" : "M34.5 50c2 1.8 4 2.4 5.5 2.4s3.6-.6 5.5-2.4c-1.6 1.8-3.4 2.4-5.5 2.4s-4-.6-5.5-2.4z"} fill={look.feminine ? "#a33b48" : "#8d4b44"} />
        {look.beard ? <path d="M27 48c2 14 24 16 28 1-6 6-20 7-28-1z" fill={look.hair} /> : null}
        {look.band ? (
          <g strokeLinecap="round">
            <path d="M26 33h28" stroke="#c4473a" strokeWidth="1.6" />
            <path d="M26 35.4h28" stroke="#e2b84a" strokeWidth="1.6" />
            <path d="M26 37.8h28" stroke="#1f7a3a" strokeWidth="1.6" />
          </g>
        ) : null}
      </g>
    </svg>
  )
}

function HairBack({ look }: { look: Look }) {
  const c = look.hair
  if (look.hairStyle === "afro") return <ellipse cx="40" cy="32" rx="29" ry="25" fill={c} />
  if (look.hairStyle === "locks") {
    return (
      <g fill={c}>
        <path d="M14 38c-8 18-4 36 2 42 4-16 2-28 6-40z" />
        <path d="M24 30c-6 20-2 38 3 44 4-18 2-30 5-42z" />
        <path d="M50 30c3 20 1 36 6 44 3-16 1-30-2-42z" />
        <path d="M60 36c7 16 8 32 2 40-5-14-3-28-8-40z" />
        <path d="M20 32c8-16 32-16 40 0 1 8-4 10-8 6-8-10-24-10-32 2-3 3-8 1 0-8z" />
      </g>
    )
  }
  if (look.hairStyle === "long") return <path d="M16 36c-4 30 2 42 10 44 1-18 6-26 10-16 3 10 8 8 12-14 6 22 16 18 18-2 2-22-8-30-22-32-14 0-24 6-28 20z" fill={c} />
  if (look.hairStyle === "bun") {
    return (
      <g fill={c}>
        <ellipse cx="40" cy="16" rx="11" ry="8" />
        <path d="M18 38c2-16 42-18 46 2-6-10-34-10-46-2z" />
      </g>
    )
  }
  if (look.hairStyle === "bob") return <path d="M15 42c0-22 12-30 25-30s25 8 25 30c-1 10-6 16-11 16-2-12-6-16-14-16s-12 4-14 16c-5 0-10-6-11-16z" fill={c} />
  if (look.hairStyle === "waves") return <path d="M16 40c2-20 14-26 24-26 14 0 26 8 26 24-8-8-12-4-16 1-5-8-12-10-18-2-5-8-12-6-16 3z" fill={c} />
  if (look.hairStyle === "fade") return <path d="M24 38c1-14 10-20 16-20s16 6 18 18c-4-8-12-10-18-8-7-2-14 1-16 10z" fill={c} />
  return <path d="M20 38c2-16 14-22 20-22s18 6 20 20c-4-10-14-12-20-10-8-2-16 2-20 12z" fill={c} />
}

export function Walker({ look }: { look: Look }) {
  return (
    <svg viewBox="0 0 80 150" className="sprite-img sway" aria-hidden="true">
      <ellipse cx="40" cy="142" rx="18" ry="5" fill="#14302e" opacity="0.18" />
      <path d="M30 96h8l2 36h-8zM44 96h8l-2 36h-8z" fill="#243044" />
      <path d="M26 58h30l6 40H22z" fill={look.shirt} />
      <path d="M18 70c-6 10-4 22 2 26 4-8 4-16 2-26zM62 70c6 10 4 22-2 26-4-8-4-16-2-26z" fill={look.skin} />
      <path d="M34 52h14v10H34z" fill={look.skin} />
      <HairBack look={look} />
      <ellipse cx="40" cy="40" rx="16" ry="18" fill={look.skin} />
      <ellipse cx="34" cy="40" rx="1.7" ry="2" fill="#1c1915" />
      <ellipse cx="46" cy="40" rx="1.7" ry="2" fill="#1c1915" />
      <path d="M36 48c1.4 1.4 3 2 4 2s2.6-.6 4-2" fill={look.feminine ? "#a33b48" : "#8d4b44"} />
      {look.beard ? <path d="M30 46c2 12 18 14 22 2-4 5-16 6-22-2z" fill={look.hair} /> : null}
      {look.band ? (
        <g strokeLinecap="round">
          <path d="M28 34h24" stroke="#c4473a" strokeWidth="1.4" />
          <path d="M28 36.2h24" stroke="#e2b84a" strokeWidth="1.4" />
          <path d="M28 38.4h24" stroke="#1f7a3a" strokeWidth="1.4" />
        </g>
      ) : null}
    </svg>
  )
}

export function AvatarPicker() {
  const id = useGame((s) => s.yard.avatar)
  const set = useGame((s) => s.doAvatar)
  return (
    <div className="avatars" role="listbox" aria-label="Choose who walks the island">
      {PLAYERS.map((p) => (
        <button
          key={p.id}
          type="button"
          className="avatar-pick"
          data-on={id === p.id ? "1" : "0"}
          data-testid={`avatar-${p.id}`}
          aria-pressed={id === p.id}
          onClick={() => set(p.id as AvatarId)}
        >
          <Portrait look={p} />
          <small>{p.name}</small>
        </button>
      ))}
    </div>
  )
}
