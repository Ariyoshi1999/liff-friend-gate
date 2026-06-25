/*
 * Front-end configuration for liff-friend-gate.
 *
 * Copy this file to `config.js` and fill in YOUR values.
 * Every value here is PUBLISHABLE (it ships to the browser by design):
 *   - LIFF ID, Supabase URL, Supabase ANON key, and the add-friend URL
 *     are all safe to expose.
 *   - The Supabase SERVICE ROLE key and the LINE channel secret are NOT here.
 *     They live only in the Edge Function environment.
 *
 * `config.js` is git-ignored so you never commit your real values.
 */
window.LIFF_GATE_CONFIG = {
  // LIFF ID from your LINE Login channel (e.g. "1234567890-AbCdEfGh")
  liffId: "YOUR_LIFF_ID",

  // Base URL of your deployed Supabase Edge Functions
  // e.g. "https://YOUR_PROJECT_REF.functions.supabase.co"
  functionsBaseUrl: "https://YOUR_PROJECT_REF.functions.supabase.co",

  // Supabase ANON (publishable) key — used only to call the Edge Function.
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",

  // Add-friend URL for your LINE official account (e.g. "https://line.me/R/ti/p/@yourid")
  addFriendUrl: "https://line.me/R/ti/p/@YOUR_LINE_ID",

  // Optional: localStorage key for the "unlocked" flag
  authKey: "lfg_auth",

  // Optional: lock-screen copy (override to localize)
  lockTitle: "Add us on LINE to continue",
  lockBody: "Adding our LINE official account as a friend unlocks this app.",
  addFriendLabel: "Add friend on LINE",
  reloadLabel: "I've added — reload",
  checkingLabel: "Checking…",
};
