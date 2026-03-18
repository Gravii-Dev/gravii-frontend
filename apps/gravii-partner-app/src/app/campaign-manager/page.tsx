import { CampaignManagerPage } from '@/features/campaign-manager/campaign-manager-page'

interface CampaignManagerRouteProps {
  searchParams: Promise<{
    launch?: string | string[]
  }>
}

function readSingle(value: string | string[] | undefined): string | null {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

export default async function CampaignManagerRoute({ searchParams }: CampaignManagerRouteProps) {
  const params = await searchParams

  return <CampaignManagerPage initialLaunchStatus={readSingle(params.launch)} />
}
