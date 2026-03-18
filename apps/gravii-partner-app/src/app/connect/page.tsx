import { ConnectPage } from '@/features/connect/connect-page'

interface ConnectRouteProps {
  searchParams: Promise<{
    module?: string | string[]
  }>
}

export default async function ConnectRoute({ searchParams }: ConnectRouteProps) {
  const params = await searchParams
  const activeModuleId = Array.isArray(params.module) ? params.module[0] : params.module

  return <ConnectPage activeModuleId={activeModuleId} />
}
