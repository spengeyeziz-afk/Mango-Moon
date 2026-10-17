/**
 * AdMob hooks for a future native Android build.
 * These functions are intentionally empty. Do not load AdMob, ad scripts, or tracking here.
 * When a Play build exists, banner and interstitial calls can be filled in behind the same names.
 */

export function initAds() {
  // Initialize the AdMob SDK after consent. No SDK is bundled in this web build.
}

export function showBanner() {
  // Reserved for an AdMob banner anchored under the dock.
}

export function hideBanner() {
  // Reserved for hiding the banner during sheets or the title card.
}

export function showInterstitial() {
  // Reserved for an AdMob interstitial between islands or after a quest. Do not call it on a timer.
}

/** Reward a finished rewarded-ad view would pay. Do not grant this unless showRewardedAd resolves completed. */
export const REWARDED_AD = { stones: 2, coins: 50 }

/**
 * Placeholder for a future AdMob rewarded ad.
 * Returns completed: false until a Play build actually shows an ad and the viewer finishes it.
 */
export function showRewardedAd(): Promise<{ completed: boolean; reason?: string }> {
  return Promise.resolve({
    completed: false,
    reason: "Rewarded ads are not connected on this build yet.",
  })
}
