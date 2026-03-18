import { CampaignBuilder } from '@/features/reach/campaign-builder'

interface ReachRouteProps {
  searchParams: Promise<{
    prompt?: string | string[]
    campaign?: string | string[]
    draft?: string | string[]
  }>
}

function readSingle(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export default async function ReachRoute({ searchParams }: ReachRouteProps) {
  const params = await searchParams
  const initialPrompt = readSingle(params.prompt)
  const initialCampaignId = readSingle(params.campaign)
  const initialDraftId = readSingle(params.draft)
  const routeKey = JSON.stringify({
    prompt: initialPrompt,
    campaign: initialCampaignId,
    draft: initialDraftId
  })

  return (
    <CampaignBuilder
      key={routeKey}
      initialPrompt={initialPrompt}
      initialCampaignId={initialCampaignId}
      initialDraftId={initialDraftId}
    />
  )
}
