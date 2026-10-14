let ctx: AudioContext | null = null
let musicOn = false
let sfxOn = true
let timer = 0
let nextAt = 0
let bar = 0
let eighth = 0

const BPM = 86
const EIGHTH = 60 / BPM / 2

// C, F, G, C, Am, F, C, G — a slow one-drop loop. Skanks sit on the offbeats.
const BARS: [number, number, number][] = [
  [0, 4, 7],
  [5, 9, 12],
  [7, 11, 14],
  [0, 4, 7],
  [9, 12, 16],
  [5, 9, 12],
  [0, 4, 7],
  [7, 11, 14],
]
const LEAD = [12, 7, 4, 7, 16, 12, 9, 7]

function ac() {
  if (typeof window === "undefined") return null
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === "suspended") void ctx.resume()
  return ctx
}

function tone(freq: number, dur: number, gain: number, type: OscillatorType, delay = 0) {
  const audio = ac()
  if (!audio) return
  const t = audio.currentTime + delay
  const osc = audio.createOscillator()
  const g = audio.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g)
  g.connect(audio.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

function note(semi: number) {
  return 130.81 * 2 ** (semi / 12)
}

function pump() {
  if (!musicOn || !ctx) return
  const look = ctx.currentTime + 0.4
  while (nextAt < look) {
    const chord = BARS[bar % BARS.length]
    const pos = eighth % 8
    const delay = nextAt - ctx.currentTime
    if (pos === 0) tone(note(chord[0] - 12), 0.26, 0.034, "sine", delay)
    if (pos === 4) tone(note(chord[0] - 12), 0.14, 0.02, "triangle", delay)
    if (pos % 2 === 1) {
      tone(note(chord[0]), 0.07, 0.014, "triangle", delay)
      tone(note(chord[1]), 0.07, 0.011, "triangle", delay)
      tone(note(chord[2]), 0.06, 0.008, "triangle", delay)
    }
    if ((pos === 2 || pos === 6) && bar % 2 === 0) {
      tone(note(LEAD[bar % LEAD.length]), 0.16, 0.011, "sine", delay)
    }
    nextAt += EIGHTH
    eighth += 1
    if (eighth % 8 === 0) bar += 1
  }
}

export const audio = {
  unlock() {
    ac()
  },
  configure(music: boolean, sfx: boolean) {
    musicOn = music
    sfxOn = sfx
    if (!musicOn) {
      window.clearInterval(timer)
      timer = 0
      return
    }
    const audioCtx = ac()
    if (!audioCtx) return
    if (!timer) {
      nextAt = audioCtx.currentTime + 0.05
      bar = 0
      eighth = 0
      timer = window.setInterval(pump, 120)
      pump()
    }
  },
  tap() {
    if (sfxOn) tone(520, 0.06, 0.03, "sine")
  },
  ok() {
    if (sfxOn) {
      tone(660, 0.08, 0.04, "sine")
      tone(880, 0.1, 0.03, "sine", 0.07)
    }
  },
  coin() {
    if (sfxOn) {
      tone(784, 0.08, 0.04, "triangle")
      tone(1046, 0.12, 0.035, "triangle", 0.06)
    }
  },
  bad() {
    if (sfxOn) tone(196, 0.12, 0.04, "sine")
  },
}
