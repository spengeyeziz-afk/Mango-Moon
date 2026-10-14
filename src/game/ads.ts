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
