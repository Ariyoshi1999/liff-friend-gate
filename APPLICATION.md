# Codex for Open Source — application draft

Form: <https://openai.com/form/codex-for-oss/>
Program terms: <https://developers.openai.com/codex/codex-for-oss-terms>

Fill the bracketed placeholders before submitting. Be honest about numbers —
a new repo with zero stars can still apply; the form weighs *value*, not stars.

---

## Field: Project / repository link
```
https://github.com/[YOUR_GITHUB]/liff-friend-gate
```

## Field: GitHub stars
```
[current number — fine if 0 at submission]
```

## Field: Monthly downloads
```
[0 if not yet published to a registry; or your npm/release download count]
```

---

## Field: Why does this project matter to the ecosystem? (English)

liff-friend-gate is an open-source, framework-free way to gate a web app or
SPA behind a LINE "friend-add", built on LIFF + Supabase. LINE is the dominant
messaging platform in Japan and much of Southeast Asia, and "add our LINE
official account to use the tool" is one of the most common acquisition and
retention loops for indie developers and small SaaS in that market — yet there
is no clean open-source building block for it.

The naive implementation most people reach for — letting the browser read a
follow-status table directly with the Supabase anon key — is insecure, because
the client controls the query filter and row-level security alone cannot scope
a user to their own row. This project ships the correct, hardened design
instead: the browser sends a LINE access token, a Supabase Edge Function
verifies that token directly with LINE, and only then returns follow status
using the service role. The table is never exposed to the browser. A signed
follow/unfollow webhook keeps state in sync.

This pattern is not theoretical — it is generalized from a gate I run in
production on a live consumer web app (a gamified quiz PWA), with all secrets
and product-specific code removed. My goal is to give Japanese and SEA indie
developers a secure, copy-pasteable starting point so they stop hand-rolling
(and mis-securing) the same flow. With Codex, I can move faster on the parts
that make this genuinely reusable: hardening the Edge Functions, adding tests,
writing multi-tenant docs, and supporting more identity providers.

## 項目：このプロジェクトがエコシステムにとってなぜ重要か（日本語）

liff-friend-gate は、WebアプリやSPAを「LINEの友だち追加」で認証ゲート化する、
フレームワーク非依存のオープンソースです（LIFF＋Supabase）。LINEは日本や東南アジア
で支配的なメッセージング基盤で、「ツールを使うにはLINE公式を友だち追加してね」という
動線は、個人開発者や小規模SaaSの集客・継続の定番です。それなのに、これを綺麗に実装
できるオープンソースの部品が存在しません。

多くの人が最初に書く実装——ブラウザからSupabaseのanonキーで友だち状態テーブルを直接
読む——は安全ではありません。クエリ条件をクライアントが操作できるため、RLSだけでは
「本人の行だけ」に絞れないからです。本プロジェクトは正しい設計を最初から同梱します。
ブラウザはLINEアクセストークンを送り、Supabase Edge FunctionがそのトークンをLINEで
検証し、その後サービスロールで友だち状態を返します。テーブルはブラウザに一切露出
しません。署名検証付きのfollow/unfollow Webhookで状態を同期します。

これは机上の設計ではなく、実際に本番稼働しているゲート（ゲーム性のあるクイズPWA）から、
秘密情報と製品固有コードを取り除いて汎用化したものです。同じ動線を毎回手作りして
（しかもセキュリティを誤って）いる日本・東南アジアの個人開発者に、安全でそのまま使える
出発点を届けたい。Codexがあれば、再利用性を本当に高める部分——Edge Functionの堅牢化、
テスト追加、マルチテナント向けドキュメント、対応プロバイダの拡張——を速く進められます。

---

## Talking points if the form has free-form / extra fields
- Production-proven: generalized from a live consumer PWA, not a toy.
- Security-first: ships the token-verified design; documents the insecure
  shortcut explicitly so others avoid it.
- Underserved niche: no existing OSS building block for LINE-friend-gating.
- Multi-tenant ready: one Supabase project can host several apps via PROJECT_TAG.
- MIT licensed, framework-free front end, single-file drop-in.
