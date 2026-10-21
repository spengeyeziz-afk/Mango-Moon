/**
 * Rewarded ads use Google's official AdMob test unit until a Play build
 * swaps this for the native SDK. The web preview plays that test creative
 * on screen. Tokens are granted only after the test ad finishes.
 */
export const GOOGLE_TEST_REWARDED = "ca-app-pub-3940256099942544/5224354917"
const AD_MS = 6000

export function initAds() {
  // Native AdMob init belongs in the Android wrapper. The web build uses the test unit above.
}

export function showBanner() {
  // Reserved for an AdMob banner anchored under the dock.
}

export function hideBanner() {
  // Reserved for hiding the banner during sheets or the title card.
}

export function showInterstitial() {
  // Reserved for an AdMob interstitial between islands or after a quest.
}

export const REWARDED_AD = { tokens: 50 }

export function showRewardedAd(): Promise<{ completed: boolean; reason?: string }> {
  if (typeof document === "undefined") return Promise.resolve({ completed: false, reason: "Ad not ready." })
  return new Promise((resolve) => {
    const root = document.createElement("div")
    root.className = "test-ad"
    root.setAttribute("role", "dialog")
    root.setAttribute("aria-label", "Test ad")
    root.innerHTML = `
      <div class="test-ad-card">
        <p class="test-ad-badge">Test Ad</p>
        <p class="test-ad-kicker">Google sample</p>
        <h2>Rewarded video</h2>
        <p class="test-ad-unit">${GOOGLE_TEST_REWARDED}</p>
        <div class="test-ad-bar"><i></i></div>
        <p class="test-ad-left">Reward in 6s</p>
        <button type="button" class="test-ad-close">Close</button>
      </div>`
    document.body.appendChild(root)
    const bar = root.querySelector(".test-ad-bar i") as HTMLElement
    const left = root.querySelector(".test-ad-left") as HTMLElement
    const close = root.querySelector(".test-ad-close") as HTMLButtonElement
    const started = performance.now()
    let settled = false
    const finish = (completed: boolean) => {
      if (settled) return
      settled = true
      window.clearInterval(timer)
      root.remove()
      resolve(completed ? { completed: true } : { completed: false, reason: "Ad closed before the reward." })
    }
    close.addEventListener("click", () => finish(false))
    const timer = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - started) / AD_MS)
      bar.style.transform = `scaleX(${t})`
      const sec = Math.ceil((1 - t) * 6)
      left.textContent = t >= 1 ? "Reward ready" : `Reward in ${sec}s`
      if (t >= 1) finish(true)
    }, 100)
  })
}
