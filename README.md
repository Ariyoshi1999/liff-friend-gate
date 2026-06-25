# liff-friend-gate

Gate any static web app or SPA behind a **LINE friend-add**, using [LIFF](https://developers.line.biz/en/docs/liff/) + [Supabase](https://supabase.com/).

- **Friend added → app unlocked.**
- **Blocked / not added → lock screen with an "Add friend" button.**
- **Re-added → instantly works again.**

It is a small, framework-free drop-in (`<script>` tag) plus a secure Supabase backend. No build step required on the front end.

> This project generalizes a friend-add gate that has been running in production on a real consumer web app (a gamified quiz PWA). It ships the **token-verified** design from the start, so the naive "query the table directly from the browser" approach (which leaks data if RLS is misconfigured) is **not** used here.

---

## Why this exists

In Japan, LINE is the dominant messaging platform, and "add our LINE official account to use the tool" is a common growth + retention loop for indie SaaS. But wiring it up correctly is fiddly:

- You need LIFF login, a LINE official account, follow/unfollow webhooks, and a place to store follow state.
- The obvious shortcut — letting the browser read a `friend_status` table directly with the anon key — is **insecure**: the browser controls the query filter, so row-level security alone cannot scope a user to "their own" row.

`liff-friend-gate` gives you the **correct** version: the browser sends a LINE token, an Edge Function **verifies that token with LINE**, and only then returns the follow status. The table is never exposed to the anon role.

---

## How it works

```
Browser (liff-gate.js)
   |  1. liff.init() -> liff.login() if needed
   |  2. liff.getAccessToken()
   |  3. POST /functions/v1/check-status  { accessToken }
   v
Supabase Edge Function: check-status
   |  4. verify token at LINE (api.line.me/oauth2/v2.1/verify)
   |  5. get verified userId from LINE profile
   |  6. read friend_status with the SERVICE ROLE (RLS bypassed server-side)
   v
   returns { status: "followed" | "blocked" | "none" }

Browser -> unlock if "followed", else show lock screen.

LINE Official Account --(follow / unfollow webhook)--> Edge Function: line-webhook
                                                          upserts friend_status (service role)
```

The `friend_status` table has **RLS enabled and the anon role denied entirely** — only the service role (used by the two Edge Functions) can read or write it.

---

## Quick start

1. **Create the LINE assets** — a LINE Login channel (for LIFF) and a Messaging API official account. See [`docs/line-setup.md`](docs/line-setup.md).
2. **Set up the database** — run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase project.
3. **Deploy the Edge Functions**:
   ```bash
   supabase functions deploy check-status
   supabase functions deploy line-webhook
   ```
   Set the secrets (see `.env.example`):
   ```bash
   supabase secrets set LINE_CHANNEL_SECRET=... PROJECT_TAG=myapp
   ```
4. **Configure the front end** — copy `config.example.js` to `config.js` and fill in your public values (LIFF ID, Supabase URL, Supabase anon key, add-friend URL, function base URL). These are all **publishable** values; no secrets here.
5. **Drop the gate into your page** — just before `</body>`:
   ```html
   <script src="config.js"></script>
   <script src="src/liff-gate.js"></script>
   ```
6. **Point your LINE webhook** at `https://<your-project>.functions.supabase.co/line-webhook`.

A runnable demo lives in [`examples/index.html`](examples/index.html).

---

## What is and isn't a secret

| Value | Where it lives | Secret? |
|-------|----------------|---------|
| LIFF ID | `config.js` (front end) | No — public by design |
| Supabase URL | `config.js` (front end) | No |
| Supabase **anon** key | `config.js` (front end) | No — publishable |
| Add-friend URL | `config.js` (front end) | No |
| Supabase **service role** key | Edge Function env | **Yes** — never ship to the browser |
| LINE channel secret | Edge Function env | **Yes** |

`config.js`, `.env`, and anything under `supabase/.env` are git-ignored. Only the `.example` files are committed.

---

## Project layout

```
liff-friend-gate/
├── src/liff-gate.js              # client-side gate (config-driven, no secrets)
├── config.example.js             # front-end config template (publishable values)
├── examples/index.html           # minimal runnable demo
├── supabase/
│   ├── schema.sql                # friend_status table + RLS (anon denied)
│   └── functions/
│       ├── check-status/index.ts # verifies LINE token, returns follow status
│       └── line-webhook/index.ts # follow/unfollow -> upsert friend_status
├── docs/line-setup.md            # how to create the LINE channel + official account
├── .env.example                  # server-side secrets template
├── .gitignore
└── LICENSE                       # MIT
```

## Multi-tenant note

Each app is namespaced by `PROJECT_TAG`, so one Supabase project can host the gate for several apps without their rows colliding. Because access goes through the token-verified Edge Function (never the raw table), tenants stay isolated even when they share a database.

## License

MIT — see [`LICENSE`](LICENSE).
