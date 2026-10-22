/**
 * AdMob via the Google H5 Ad Placement API.
 * Rewarded and interstitial units are the live Mango Moon units.
 * In an Android WebView registered with the Mobile Ads SDK, the
 * data-admob-* slots serve these AdMob units. Tokens are granted
 * only from the reward callback.
 */

export const ADMOB_APP_ID = "ca-app-pub-8801782508971606~5157227320"
export const REWARDED_UNIT = "ca-app-pub-8801782508971606/8904900646"
export const INTERSTITIAL_UNIT = "ca-app-pub-8801782508971606/6626221662"
const PUBLISHER = "ca-pub-8801782508971606"
const UNAVAILABLE = "Ad not available right now. Please try again later."
const INTERSTITIAL_GAP_MS = 90_000

type BreakInfo = { breakStatus?: string }
type ShowAd = () => void
type AdBreakFn = (placement: Record<string, unknown>) => void

declare global {
  interface Window {
    adsbygoogle?: object[]
    adBreak?: AdBreakFn
    adConfig?: AdBreakFn
  }
}

let booted = false
let busy = false
let lastInterstitial = 0

export function initAds() {
  if (typeof document === "undefined" || booted) return
  booted = true
  window.adsbygoogle = window.adsbygoogle || []
  const push = (placement: Record<string, unknown>) => {
    window.adsbygoogle?.push(placement)
  }
  window.adBreak = window.adBreak || push
  window.adConfig = window.adConfig || push

  if (!document.querySelector('meta[name="google-admob-app-id"]')) {
    const meta = document.createElement("meta")
    meta.name = "google-admob-app-id"
    meta.content = ADMOB_APP_ID
    document.head.appendChild(meta)
  }

  if (!document.getElementById("admob-h5")) {
    const script = document.createElement("script")
    script.id = "admob-h5"
    script.async = true
    script.crossOrigin = "anonymous"
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER}`
    script.setAttribute("data-ad-client", PUBLISHER)
    script.setAttribute("data-admob-rewarded-slot", REWARDED_UNIT)
    script.setAttribute("data-admob-interstitial-slot", INTERSTITIAL_UNIT)
    script.setAttribute("data-ad-frequency-hint", "30s")
    script.onload = configure
    script.onerror = () => {
      booted = false
    }
    document.head.appendChild(script)
  }
  configure()
}

function configure() {
  window.adConfig?.({
    preloadAdBreaks: "on",
    sound: "on",
  })
}

export function showRewardedAd(): Promise<{ completed: boolean; reason?: string }> {
  initAds()
  if (busy || typeof window.adBreak !== "function") {
    return Promise.resolve({ completed: false, reason: UNAVAILABLE })
  }
  busy = true
  return new Promise((resolve) => {
    let earned = false
    let settled = false
    const finish = (completed: boolean) => {
      if (settled) return
      settled = true
      busy = false
      window.clearTimeout(waiting)
      resolve(completed ? { completed: true } : { completed: false, reason: UNAVAILABLE })
    }
    const waiting = window.setTimeout(() => finish(false), 12000)
    try {
      window.adBreak?.({
        type: "reward",
        name: "earn-10-tokens",
        beforeReward: (showAd: ShowAd) => {
          window.clearTimeout(waiting)
          try {
            showAd()
          } catch {
            finish(false)
          }
        },
        adViewed: () => {
          earned = true
        },
        adDismissed: () => {
          earned = false
        },
        adBreakDone: (info: BreakInfo) => {
          finish(earned && info?.breakStatus === "viewed")
        },
      })
    } catch {
      finish(false)
    }
  })
}

/** Full-screen interstitial at a menu break. Resolves when it closes or if none is ready. */
export function showInterstitial(name: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if (busy || Date.now() - lastInterstitial < INTERSTITIAL_GAP_MS) return Promise.resolve()
  initAds()
  if (typeof window.adBreak !== "function") return Promise.resolve()
  busy = true
  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      busy = false
      window.clearTimeout(waiting)
      resolve()
    }
    const waiting = window.setTimeout(finish, 12000)
    try {
      window.adBreak?.({
        type: "browse",
        name,
        beforeAd: () => {
          window.clearTimeout(waiting)
          lastInterstitial = Date.now()
        },
        adBreakDone: () => {
          lastInterstitial = Date.now()
          finish()
        },
      })
    } catch {
      finish()
    }
  })
}
