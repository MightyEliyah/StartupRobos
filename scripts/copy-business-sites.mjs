// Copies static business landing pages into public/sites/<slug>/ so the
// Next.js app on Vercel serves them (see rewrites in next.config.ts).
// businesses/<slug>/index.html stays the single source of truth.
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PUBLIC_SITES = ['diaspora-it-support', 'naija-biz-websites']

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

for (const slug of PUBLIC_SITES) {
  const src = join(root, 'businesses', slug, 'index.html')
  if (!existsSync(src)) throw new Error(`Missing landing page: ${src}`)
  const destDir = join(root, 'public', 'sites', slug)
  mkdirSync(destDir, { recursive: true })
  copyFileSync(src, join(destDir, 'index.html'))
  console.log(`copied ${slug} -> public/sites/${slug}/index.html`)
}
