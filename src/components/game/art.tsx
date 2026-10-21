import type { FruitId } from "@/game/types"

export function IconSun() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.1 5.1l1.6 1.6M17.3 17.3l1.6 1.6M18.9 5.1l-1.6 1.6M6.7 17.3l-1.6 1.6" />
      </g>
    </svg>
  )
}

export function IconCoin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7.2c1.8 0 2.8.9 2.8 2.1 0 2.6-5.6 1.4-5.6 3.8 0 1.2 1.1 2 2.8 2 1.5 0 2.6-.6 3-1.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function IconStone() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2 19 12l-7 8.8L5 12 12 3.2Z" fill="currentColor" />
    </svg>
  )
}

export function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.5 3.2a8.2 8.2 0 1 0 6.2 13.6A7 7 0 0 1 14.5 3.2Z" fill="currentColor" />
    </svg>
  )
}

export function ItemGlyph({ id }: { id: string }) {
  if (id.startsWith("wine-")) return <Bottle />
  if (id.startsWith("jam-")) return <Jar />
  if (id.startsWith("sip-")) return <Cup />
  if (id.startsWith("cake-")) return <Cake />
  if (id.startsWith("plate-")) return <Plate />
  if (id === "coconut") return <PalmMark />
  if (id === "pineapple") return <PineMark />
  return <FruitMark fruit={id as FruitId} />
}

function Jar() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="11" y="6" width="10" height="3" rx="1" fill="#8a5a3a" />
      <path d="M10 10h12l-1 16a3 3 0 0 1-3 2h-4a3 3 0 0 1-3-2L10 10Z" fill="#c4473a" />
      <path d="M12 14h8v2H12z" fill="#f6f1e7" opacity="0.8" />
    </svg>
  )
}
function Bottle() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <rect x="14" y="4" width="4" height="5" rx="1" fill="#6b3a32" />
      <path d="M12 10h8l2 4v11a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V14l2-4Z" fill="#1c3a34" />
      <path d="M13 16h6v2h-6z" fill="#c4841d" />
    </svg>
  )
}
function Cup() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M9 8h12l-1.2 16a3 3 0 0 1-3 2h-3.6a3 3 0 0 1-3-2L9 8Z" fill="#f0a040" />
      <path d="M11 8c1 3 3 4 5 4s4-1 5-4" fill="none" stroke="#fffaf3" strokeWidth="1.4" />
    </svg>
  )
}
function Cake() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M7 16h18v8a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3v-8Z" fill="#e7c39a" />
      <path d="M7 16c2 2 3 2 4.5 0S15 14 16.5 16 20 18 21.5 16 25 14 27 16" fill="none" stroke="#c4473a" strokeWidth="2" />
      <circle cx="16" cy="12" r="2" fill="#c4473a" />
    </svg>
  )
}
function Plate() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="20" rx="11" ry="5" fill="#f6f1e7" stroke="#cbbba4" />
      <path d="M10 16c2-4 10-4 12 0" fill="none" stroke="#c45c3a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="15" r="2.2" fill="#e2a04a" />
    </svg>
  )
}
function PineMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 6c4 3 6 8 5 14H11C10 14 12 9 16 6Z" fill="#e2a04a" />
      <path d="M16 5c2 2 2 4 0 6-2-2-2-4 0-6Z" fill="#2f7d45" />
    </svg>
  )
}
function PalmMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 28c1-6 1-10 0-16" stroke="#8a5a3a" strokeWidth="2" />
      <ellipse cx="16" cy="11" rx="4" ry="3" fill="#2f7d45" />
      <ellipse cx="10" cy="12" rx="5" ry="2" fill="#3f8f4e" />
      <ellipse cx="22" cy="12" rx="5" ry="2" fill="#3f8f4e" />
    </svg>
  )
}
function FruitMark({ fruit }: { fruit: FruitId }) {
  const fill = fruit === "cherry" ? "#d63b45" : fruit === "tamarind" ? "#8a5b32" : fruit === "guava" ? "#e28aa0" : fruit === "soursop" ? "#7d9a62" : "#f0a020"
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <ellipse cx="16" cy="18" rx="8" ry="7" fill={fill} />
      <path d="M16 10c2-3 5-3 6-1" fill="none" stroke="#2f7d45" strokeWidth="1.5" />
    </svg>
  )
}

const TREE_ART: Partial<Record<FruitId, string>> = {
  mango: "/art/tree-mango.png",
  cherry: "/art/tree-cherry.png",
  tamarind: "/art/tree-tamarind.png",
  coconut: "/art/tree-coconut.png",
  pineapple: "/art/tree-pineapple.png",
}

export function TreeArt({ fruit, scale = 1 }: { fruit: FruitId; scale?: number }) {
  const src = TREE_ART[fruit]
  if (src) {
    return (
      <span className="sprite-fit" style={{ transform: `scale(${scale})` }}>
        <img src={src} alt="" className="sprite-img sway" />
      </span>
    )
  }
  return (
    <svg viewBox="0 0 160 170" className="sprite-svg" style={{ transform: `scale(${scale})` }} aria-hidden="true">
      <ellipse cx="80" cy="150" rx="36" ry="10" fill="#1c241c" opacity="0.18" />
      {fruit === "pineapple" ? <Pineapple /> : fruit === "coconut" ? <Palm /> : fruit === "soursop" ? <Soursop /> : fruit === "tamarind" ? <Tamarind /> : fruit === "cherry" ? <Cherry /> : fruit === "guava" ? <Guava /> : <Mango />}
    </svg>
  )
}

function Mango() {
  return (
    <g>
      <path d="M80 78c8 18 6 48-2 62" stroke="#8a5a3a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="78" cy="62" rx="40" ry="32" fill="#2f7d45" />
      <ellipse cx="96" cy="70" rx="28" ry="24" fill="#3f8f4e" />
      <ellipse cx="60" cy="74" rx="24" ry="20" fill="#24683a" />
      <ellipse cx="70" cy="58" rx="8" ry="6" fill="#f0a020" transform="rotate(-20 70 58)" />
      <ellipse cx="96" cy="64" rx="7" ry="5" fill="#e28a14" transform="rotate(16 96 64)" />
      <ellipse cx="84" cy="80" rx="7" ry="5" fill="#f2b43a" />
    </g>
  )
}
function Cherry() {
  return (
    <g>
      <path d="M80 86c6 14 4 40-1 54" stroke="#8a5a3a" strokeWidth="6" fill="none" />
      <ellipse cx="80" cy="70" rx="34" ry="28" fill="#2a6b40" />
      <ellipse cx="98" cy="78" rx="22" ry="18" fill="#3d8a52" />
      {[[62, 66], [74, 58], [88, 62], [100, 74], [78, 78], [92, 84]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4.2" fill="#d63b45" />
      ))}
    </g>
  )
}
function Tamarind() {
  return (
    <g>
      <path d="M80 70c10 20 6 50-4 70" stroke="#6e4a32" strokeWidth="6" fill="none" />
      <ellipse cx="78" cy="58" rx="42" ry="26" fill="#3d7a48" />
      <ellipse cx="104" cy="64" rx="24" ry="16" fill="#4e9260" />
      <ellipse cx="56" cy="66" rx="20" ry="14" fill="#2f6a40" />
      {[[70, 86], [84, 96], [98, 88]].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="4" ry="10" fill="#8a5b32" />
      ))}
    </g>
  )
}
function Guava() {
  return (
    <g>
      <path d="M80 84c4 16 2 40 0 54" stroke="#8a5a3a" strokeWidth="6" fill="none" />
      <ellipse cx="80" cy="68" rx="36" ry="28" fill="#347848" />
      <ellipse cx="98" cy="76" rx="22" ry="18" fill="#4c9460" />
      <circle cx="68" cy="70" r="6" fill="#e28aa0" />
      <circle cx="90" cy="64" r="5.5" fill="#f0b45a" />
      <circle cx="84" cy="82" r="5" fill="#e7a0b0" />
    </g>
  )
}
function Soursop() {
  return (
    <g>
      <path d="M80 90c6 12 4 36-2 48" stroke="#5c4030" strokeWidth="7" fill="none" />
      <ellipse cx="80" cy="64" rx="40" ry="30" fill="#1f5c38" />
      <ellipse cx="102" cy="74" rx="24" ry="18" fill="#2e7a4a" />
      <ellipse cx="66" cy="86" rx="12" ry="10" fill="#8eae72" />
      <ellipse cx="96" cy="90" rx="11" ry="9" fill="#9bb882" />
    </g>
  )
}
function Pineapple() {
  return (
    <g>
      <path d="M80 78c8 6 10 16 8 28H72c-2-12 0-22 8-28Z" fill="#e2a04a" />
      <path d="M92 96c6 4 8 12 6 20H86c0-10 1-16 6-20Z" fill="#d28a2e" />
      <path d="M80 70c6-10 8-8 10 0-6 2-8 2-10 0Z" fill="#2f7d45" />
      <path d="M74 74c-8-8-6-12-2-16 4 6 6 10 2 16Z" fill="#24683a" />
      <path d="M90 72c8-6 12-4 14 2-6 2-10 2-14-2Z" fill="#3f8f4e" />
      <path d="M98 86c6-8 10-6 12 0-6 1-8 2-12 0Z" fill="#2f7d45" />
    </g>
  )
}
function Palm() {
  return (
    <g>
      <path d="M84 150c8-24 6-48-4-78" stroke="#8a5a3a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="62" rx="28" ry="10" fill="#2f7d45" transform="rotate(-28 70 62)" />
      <ellipse cx="96" cy="58" rx="30" ry="10" fill="#3f8f4e" transform="rotate(24 96 58)" />
      <ellipse cx="78" cy="50" rx="16" ry="22" fill="#24683a" />
      <ellipse cx="108" cy="70" rx="22" ry="8" fill="#2f7d45" transform="rotate(50 108 70)" />
      <circle cx="74" cy="78" r="5" fill="#d8c39a" />
      <circle cx="84" cy="84" r="4.5" fill="#cbb88a" />
    </g>
  )
}

export function BuildingArt({ id }: { id: string }) {
  if (id === "press" || id === "cellar") {
    return <img src={id === "press" ? "/art/press.png" : "/art/cellar.png"} alt="" className="sprite-img" />
  }
  return (
    <svg viewBox="0 0 180 160" className="sprite-svg" aria-hidden="true">
      <ellipse cx="90" cy="142" rx="48" ry="12" fill="#1c241c" opacity="0.16" />
      {id === "cellar" ? <Cellar /> : id === "shack" ? <Shack /> : id === "bakery" ? <Bakery /> : id === "kitchen" ? <Kitchen /> : id === "boat" ? <Boat /> : <Press />}
    </svg>
  )
}

function Press() {
  return (
    <g>
      <rect x="48" y="78" width="84" height="52" rx="6" fill="#f0c2b4" />
      <path d="M40 82 90 48l50 34v8H40Z" fill="#c45c4a" />
      <rect x="78" y="98" width="22" height="32" rx="2" fill="#6b3e2e" />
      <rect x="56" y="92" width="16" height="14" rx="2" fill="#14302e" />
      <rect x="112" y="96" width="12" height="16" rx="2" fill="#a33b32" />
      <circle cx="40" cy="110" r="12" fill="#b87333" />
      <rect x="34" y="100" width="12" height="6" rx="1" fill="#8a5a3a" />
    </g>
  )
}
function Cellar() {
  return (
    <g>
      <path d="M36 124c8-40 28-62 54-66 30 2 52 28 58 66Z" fill="#d7c4a8" />
      <path d="M78 92c0-16 8-24 14-24s12 8 12 24v32H78Z" fill="#3a2a24" />
      <circle cx="58" cy="108" r="14" fill="#6b3e2e" />
      <circle cx="58" cy="108" r="6" fill="#2a211c" />
      <rect x="112" y="96" width="8" height="22" rx="2" fill="#1c3a34" />
      <rect x="122" y="100" width="8" height="18" rx="2" fill="#1c3a34" />
      <rect x="116" y="92" width="12" height="4" fill="#c4841d" />
    </g>
  )
}
function Shack() {
  return (
    <g>
      <rect x="46" y="96" width="88" height="28" rx="4" fill="#e7d3b0" />
      <path d="M36 100c20-28 88-28 112 0v10H36Z" fill="#c4a15a" />
      <path d="M40 86c24-20 80-18 104 6" fill="#d8b56a" />
      <rect x="108" y="78" width="16" height="28" rx="3" fill="#d7e4ea" />
      <rect x="56" y="104" width="14" height="16" rx="2" fill="#f0a040" />
      <rect x="74" y="106" width="12" height="14" rx="2" fill="#c4473a" />
    </g>
  )
}
function Bakery() {
  return (
    <g>
      <rect x="50" y="84" width="80" height="46" rx="4" fill="#e6d3c0" />
      <path d="M62 84c0-22 56-22 56 0" fill="#cbbba4" />
      <path d="M78 84c0-14 24-14 24 0" fill="#3a2a24" />
      <rect x="46" y="112" width="28" height="16" rx="2" fill="#8a5a3a" />
      <ellipse cx="60" cy="110" rx="10" ry="6" fill="#f0c48a" />
      <path d="M118 70c6 10 4 20-2 24" stroke="#a33b32" strokeWidth="3" fill="none" />
    </g>
  )
}
function Kitchen() {
  return (
    <g>
      <rect x="44" y="100" width="96" height="26" rx="3" fill="#c9844a" />
      <path d="M38 100h108l-10-22H50Z" fill="#0f6e6a" />
      <rect x="62" y="92" width="36" height="8" rx="2" fill="#3a2a24" />
      <path d="M70 80v16M82 78v18M94 80v16" stroke="#e7c39a" strokeWidth="3" />
      <circle cx="118" cy="108" r="8" fill="#b87333" />
    </g>
  )
}
function Boat() {
  return (
    <g>
      <path d="M36 108c18 24 90 24 112 0l-10 16H48Z" fill="#c47a3a" />
      <path d="M48 108h88l-6 10H54Z" fill="#e0b07a" />
      <rect x="78" y="86" width="28" height="18" rx="2" fill="#8a5a3a" />
      <circle cx="88" cy="94" r="4" fill="#f0a020" />
      <circle cx="98" cy="96" r="3.5" fill="#d63b45" />
    </g>
  )
}

export function Person({ who }: { who: "granny" | "keeper" }) {
  const src = who === "granny" ? "/art/look/marva.png" : "/art/look/kian.png"
  return <img src={src} alt="" className="photo-face person-shot" />
}

export function Ground() {
  return (
    <>
      <img className="ground" src="/art/island.jpg" alt="" />
      <div className="atmosphere" aria-hidden="true">
        <i className="cloud c1" />
        <i className="cloud c2" />
        <i className="cloud c3" />
        <i className="shimmer" />
        <span className="gull g1" />
        <span className="gull g2" />
      </div>
    </>
  )
}
