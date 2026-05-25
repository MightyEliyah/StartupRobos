# `invoice-naija` — InvoiceNaija: Invoicing + WhatsApp Receipts for Nigerian Freelancers

Lightweight SaaS invoicing tool for Nigerian freelancers and SMBs. Naira-first, Paystack payment links built in, send receipts directly via WhatsApp. Igbo language toggle. Freemium: 5 invoices/month free, $5/month pro for unlimited + branded PDFs + multi-currency (NGN/USD/JPY).

## Business type

`custom:saas`

## Monetization stack

| Channel | Account | Status |
|---------|---------|--------|
| Stripe (subscriptions) | — | pending |
| Paystack (Nigeria payments) | — | pending |

## Current experiments

1. MVP in 2 weeks: invoice → PDF → WhatsApp share + Paystack payment link (Next.js + Supabase)
2. Launch on Nairaland, Nigerian Twitter tech community, Lagos founders Slack
3. Free tier: 5 invoices/month. Pro: $5/month unlimited + branded PDFs
4. Add Igbo language toggle (no competitor has this)
5. Partner with Lagos accounting firm for white-label B2B2C deal

## Tech stack

- Next.js App Router + Supabase (auth + DB)
- Paystack for NGN payments, Stripe for USD/JPY
- WhatsApp Business API for receipt delivery
- Deployed on Vercel

## Files in this directory

| File | Purpose |
|------|---------|
| `README.md` | This file |
| `src/` | App source code |
