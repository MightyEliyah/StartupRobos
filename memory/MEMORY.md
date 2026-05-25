# Launchpad Long-term Memory

> This file is auto-updated by nightly_consolidation.
> Manual edits are also allowed.

## Project Overview
- Launchpad: AI CXO multi-agent startup platform
- Operator: Jin (Jintae Kim) / Robo Co-op
- Infra: Next.js + Vercel + Supabase (ap-northeast-1)
- Repository: Robo-Co-op/StartupRobos (formerly launchpad)

## Current 11 Businesses — Mighty Eliyah (eliyahe@roboco-op.org)
1. **naija-japan-guide** (affiliate_seo) — Nigerian's guide to Japan, remittance affiliates
2. **igbo-ebooks** (digital_product) — Igbo & Ikwere language products on Gumroad
3. **kawaii-arcade** (game_ads) — Japan-themed HTML5 games, AdSense + portal rev-share
4. **naija-in-japan-merch** (physical_product) — Afro-Japanese fusion merch on Suzuri + Redbubble
5. **kanji-for-igbo-speakers** (saas) — Japanese learning app using Igbo/Pidgin analogies, $4.99/mo
6. **tokyo-halal-naija** (affiliate_seo) — Halal & African food directory in Japan
7. **diaspora-it-support** (service) — Remote IT support for Nigerian diaspora, $20-40/session
8. **repair-bench-jp** (content) — YouTube hardware repair channel, Japan junk electronics
9. **naija-biz-websites** (service) — Done-for-you websites for Nigerian SMBs, $150-400
10. **dev-templates-store** (digital_product) — Code templates + Figma UI kits for African builders
11. **invoice-naija** (saas) — Invoicing + WhatsApp receipts for Nigerian freelancers, $5/mo

## Operator: Mighty Eliyah
- Languages: English, Igbo, Ikwere
- Location: Japan 🇯🇵
- Budget: $20/month AI spend
- Skills: IT engineer (hardware + software), web development, graphic design
- Onboarded: 2026-05-25
- Repo: https://github.com/MightyEliyah/StartupRobos

## Existing 3 Businesses — Suzan (suzan.attallah@roboco-op.org)
1. **Patent Mining Spain** (physical_product) — Amazon.es FBA + Amazon.de expansion — REPLACED ArabReviews
2. **DigitalSouq** (digital_product) — Gumroad, Notion/Canva templates for Arabic professionals
3. **AI Sales Buddy** (saas) — https://pronto-ai-sales-buddy.lovable.app/, Stripe billing pending

## Pivot Log
- 2026-05-14: ArabReviews (affiliate_seo) → Patent Mining Spain (physical_product)
  Reason: Higher ARPU (48% margin/unit vs ~5% affiliate), Spanish language moat on Amazon.es,
  Suzan already speaks Spanish. CEO decision — one-way door approved by operator.

## Patent Mining Spain — Key Facts
- Pipeline: USPTO PatentsView API → Claude scoring (threshold 7+) → Amazon.es FBA
- Target categories: kitchen, home, garden, pet
- Patent filter: expiry after 2014, assignee < 50 employees
- Manufacturing: Alibaba samples first (€200-400), then EU local if validated
- Revenue target: €500-1,000/month by Month 3, €2,000-5,000 by Month 6
- Amazon Seller account: €39/month (one-way door — confirm before opening)

## Agent Setup
- CEO: Opus (daily 9:00 JST heartbeat)
- CTO/CMO/COO/CFO: Sonnet (daily 21:00 JST heartbeat)
- Research: Haiku (on-demand)
- Coordinator: Sonnet (main session)

## Key Decision Log
- 2026-05-14: Pivot — ArabReviews → Patent Mining Spain (CEO approved, operator confirmed)
- 2026-05-14: Mission Control dashboard wired to mission_control_data.json (auto-update on session end)
- 2026-05-14: Suzan's 3 businesses seeded in Supabase (seed-suzan.sql)
- 2026-04-12: Monetization codes deployed for all 3 businesses (Amazon/Gumroad/AdSense)
- 2026-04-12: Vercel Cron heartbeat implemented
- 2026-04-12: Long-term memory system introduced

## Lessons Learned
- Supabase anon key + RLS = auth.uid() null → use service role key instead
- Next.js server component: no need for fetch('/api/...') → call Supabase directly
- export const dynamic = 'force-dynamic' prevents static pre-rendering
- Manus can't push to GitHub → use patch file workflow
