import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { requireCronAuth } from '@/lib/auth'
import { runHeartbeatTask } from '@/lib/agent/heartbeatRunner'
import type { TaskType } from '@/lib/agent/responseSchemas'

// CXO heartbeat — dynamic, works for any operator's businesses
export const maxDuration = 300

/** Assign the right CXO role + task based on business type */
function getCxoTask(businessType: string, name: string, description: string): {
  role: string
  task_type: TaskType
  systemPrompt: string
  prompt: string
} {
  const base = businessType.replace('custom:', '')

  switch (base) {
    case 'affiliate_seo':
      return {
        role: 'CMO',
        task_type: 'market_research',
        systemPrompt: 'You are the CMO of StartupRobos. Provide specific, actionable SEO and content recommendations.',
        prompt: `You are the CMO responsible for "${name}" — ${description}

Propose 3 specific actions for this week:
1. Top 3 long-tail keyword clusters to target (with search intent)
2. One cornerstone article to write this week (title + outline in 5 bullets)
3. One affiliate or monetization angle to add

Be specific. No generic advice.`,
      }

    case 'digital_product':
      return {
        role: 'CMO',
        task_type: 'market_research',
        systemPrompt: 'You are the CMO of StartupRobos. Focus on digital product launches and email list growth.',
        prompt: `You are the CMO responsible for "${name}" — ${description}

Propose 3 specific actions for this week:
1. One product to create or improve (with exact title and price)
2. One traffic source to activate (Pinterest / Reddit / TikTok — with specific subreddit or board name)
3. One email capture tactic to deploy this week

Be specific. No generic advice.`,
      }

    case 'game_ads':
      return {
        role: 'CTO',
        task_type: 'mvp_spec',
        systemPrompt: 'You are the CTO of StartupRobos. Focus on building and deploying HTML5 games fast.',
        prompt: `You are the CTO responsible for "${name}" — ${description}

Propose 3 specific technical actions for this week:
1. One new HTML5 game concept to build (name, mechanic, Japan-themed twist)
2. One portal submission to complete this week (Poki / CrazyGames / GameDistribution — with submission checklist)
3. One technical improvement to increase ad revenue (eCPM optimization, load speed, mobile UX)

Be specific and actionable.`,
      }

    case 'saas':
      return {
        role: 'CTO',
        task_type: 'mvp_spec',
        systemPrompt: 'You are the CTO of StartupRobos. Focus on shipping SaaS MVPs fast with Next.js and Supabase.',
        prompt: `You are the CTO responsible for "${name}" — ${description}

Propose 3 specific technical actions for this week:
1. The single most important feature to ship this week (with implementation approach)
2. One onboarding improvement to reduce drop-off
3. One integration or automation to add (Paystack, WhatsApp API, Stripe, etc.)

Be specific. Assume Next.js + Supabase + Vercel stack.`,
      }

    case 'service':
      return {
        role: 'COO',
        task_type: 'ops_review',
        systemPrompt: 'You are the COO of StartupRobos. Focus on getting the first paying clients for service businesses.',
        prompt: `You are the COO responsible for "${name}" — ${description}

Propose 3 specific actions to get the first 3 paying clients this week:
1. Best outreach channel this week (which Facebook group / community / platform + exact message template)
2. One process improvement to deliver the service faster or better
3. One upsell or package to add

Be specific and tactical.`,
      }

    case 'content':
      return {
        role: 'CMO',
        task_type: 'market_research',
        systemPrompt: 'You are the CMO of StartupRobos. Focus on YouTube and content channel growth.',
        prompt: `You are the CMO responsible for "${name}" — ${description}

Propose 3 specific content actions for this week:
1. Best video concept to film this week (title, hook, thumbnail concept)
2. One SEO-optimized YouTube title + description for the next upload
3. One community or platform to post clips (TikTok / Instagram Reels / Twitter) with caption idea

Be specific. Assume the creator is based in Japan with access to Hard-Off, Akihabara, and Japanese electronics.`,
      }

    case 'physical_product':
      return {
        role: 'CMO',
        task_type: 'market_research',
        systemPrompt: 'You are the CMO of StartupRobos. Focus on print-on-demand design and social media growth.',
        prompt: `You are the CMO responsible for "${name}" — ${description}

Propose 3 specific actions for this week:
1. One new design concept to create (visual description + target product type on Suzuri/Redbubble)
2. One social media post to make this week (platform + exact caption + hashtags)
3. One community or event to target (African community in Japan / Japanese diaspora interest group)

Be specific and creative.`,
      }

    default:
      return {
        role: 'COO',
        task_type: 'ops_review',
        systemPrompt: 'You are the COO of StartupRobos. Help this business make progress this week.',
        prompt: `You are the COO responsible for "${name}" — ${description}

Propose 3 specific next actions to make progress this week:
1. The single most important task to move this business forward
2. One quick win that can be done in under 2 hours
3. One metric to track this week to measure success

Be specific and actionable.`,
      }
  }
}

export async function GET(req: NextRequest) {
  const authError = requireCronAuth(req)
  if (authError) return authError

  const supabase = createServiceClient()

  const { data: startups } = await supabase
    .from('startups')
    .select('id, name, business_type, description, status')
    .eq('status', 'active')

  if (!startups?.length) {
    return NextResponse.json({ message: 'No active startups found' })
  }

  // Run one CXO task per startup in parallel
  const taskPromises = startups.map(async startup => {
    const task = getCxoTask(
      startup.business_type ?? 'service',
      startup.name,
      startup.description ?? ''
    )

    const { content, costUsd } = await runHeartbeatTask(supabase, {
      model: 'claude-sonnet-4-6',
      maxTokens: 800,
      prompt: task.prompt,
      systemPrompt: task.systemPrompt,
      startupId: startup.id,
      taskType: task.task_type,
    })

    return {
      startup: startup.name,
      business_type: startup.business_type,
      role: task.role,
      actions: content,
      costUsd,
    }
  })

  const allResults = await Promise.all(taskPromises)
  const totalCost = allResults.reduce((sum, r) => sum + r.costUsd, 0)

  return NextResponse.json({
    ok: true,
    total_cost_usd: totalCost,
    businesses_processed: allResults.length,
    results: allResults.map(({ costUsd: _c, ...rest }) => rest),
  })
}
